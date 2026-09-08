// Async generator of OpenRouter chat deltas — SSE parser.
// Port of boilerplate_app/services/rag/openrouter_stream.py.
//
// Unlike httpx's `aiter_lines`, `fetch` gives us raw bytes, so we buffer and
// split on newlines ourselves. A `data:` payload can straddle a chunk
// boundary, so anything after the last newline is carried forward.
//
// Three failure modes OpenRouter has that a naive `delta.content` reader
// swallows into a blank answer with a 200 status — all three now throw:
//
//   1. Mid-stream error frames. When the upstream provider dies after the
//      response has already started, OpenRouter keeps the 200 and puts the
//      failure in an SSE frame: {"choices":[],"error":{"code":502,...}}.
//   2. Reasoning-only streams. Thinking models (nvidia/nemotron-3-*,
//      deepseek-r1, …) stream `delta.reasoning` with `delta.content: ""`.
//      If the answer phase never arrives — token cap, provider cut-off — the
//      whole stream is content-free.
//   3. Empty completions. finish_reason arrives with nothing generated.

import "server-only";

import { settings } from "../config";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Pull the readable sentence out of an OpenRouter error body. */
function errorMessage(body: unknown): string | null {
  if (typeof body !== "object" || body === null) return null;
  const err = (body as { error?: unknown }).error;
  if (typeof err === "string") return err;
  if (typeof err !== "object" || err === null) return null;
  const { message, code } = err as { message?: unknown; code?: unknown };
  if (typeof message !== "string") return null;
  return typeof code === "number" || typeof code === "string"
    ? `${code}: ${message}`
    : message;
}

export async function* streamOpenRouter(
  messages: ChatMessage[],
  signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
  const res = await fetch(`${settings.openrouterBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${settings.openrouterApiKey ?? ""}`,
      "HTTP-Referer": settings.appReferer,
      "X-Title": settings.appTitle,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: settings.openrouterModel,
      messages,
      stream: true,
      temperature: 0.2,
      reasoning: { enabled: settings.openrouterThinking },
    }),
    signal,
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    let parsed: unknown;
    try {
      parsed = JSON.parse(detail);
    } catch {
      parsed = null;
    }
    throw new Error(
      `openrouter failed: ${res.status} ${errorMessage(parsed) ?? detail}`
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  // Distinguishes "the model thought but never answered" from "the model
  // returned nothing at all" in the error we raise at the end.
  let sawContent = false;
  let reasoningChars = 0;
  let finishReason: string | null = null;
  let done = false;

  try {
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (streamDone) break;

      buf += decoder.decode(value, { stream: true });

      // Keep the trailing partial line in the buffer.
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";

      for (const raw of lines) {
        const line = raw.trim();
        if (!line.startsWith("data:")) continue;

        const payload = line.slice(5).trim();
        if (payload === "[DONE]") {
          done = true;
          break;
        }

        let frame: unknown;
        try {
          frame = JSON.parse(payload);
        } catch {
          continue;
        }

        // (1) Mid-stream provider failure — arrives under a 200.
        const err = errorMessage(frame);
        if (err) throw new Error(`openrouter stream aborted: ${err}`);

        const choice = (
          frame as {
            choices?: Array<{
              delta?: { content?: unknown; reasoning?: unknown; reasoning_content?: unknown };
              finish_reason?: unknown;
            }>;
          }
        ).choices?.[0];
        if (!choice) continue;

        if (typeof choice.finish_reason === "string") {
          finishReason = choice.finish_reason;
        }

        // (2) Thinking tokens. Counted, not emitted — they are not the answer
        // and must stay out of the persisted text and citation extraction.
        const reasoning = choice.delta?.reasoning ?? choice.delta?.reasoning_content;
        if (typeof reasoning === "string") reasoningChars += reasoning.length;

        const delta = choice.delta?.content;
        if (typeof delta === "string" && delta) {
          sawContent = true;
          yield delta;
        }
      }
    }
  } finally {
    reader.cancel().catch(() => {});
  }

  // (3) Stream finished cleanly but produced no answer text. Silence here is
  // what rendered as a blank assistant bubble, so make it loud.
  if (!sawContent && !signal?.aborted) {
    const why =
      reasoningChars > 0
        ? `model streamed ${reasoningChars} reasoning chars but no answer text` +
          (finishReason ? ` (finish_reason=${finishReason})` : "") +
          " — it ran out of tokens while thinking"
        : `model returned an empty completion` +
          (finishReason ? ` (finish_reason=${finishReason})` : "");
    throw new Error(`openrouter produced no output: ${why}`);
  }
}
