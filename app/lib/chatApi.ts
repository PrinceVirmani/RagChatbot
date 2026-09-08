import apiClient from "./apiClients";
import { AxiosError } from "axios";
import { authApi } from "./authApi";

// ==================== TYPES ====================

// Message structure for the messages array
interface ChatMessage {
    role: "user";
    type: "text";
    content: string;
    parent_id: null;
}

// Request payload for POST /chat/stream
interface ChatStreamRequest {
    conversation_id: string | null;
    use_file_plugin: boolean;
    messages: ChatMessage[];
}

// API response wrapper
interface ApiResponse<T> {
    data: T;
    meta: {
        timestamp: string;
    };
}

// Error response structure
interface ApiErrorResponse {
    message?: string;
    detail?: Array<{ msg: string }> | string;
}

// Conversation item from GET /chat/conversations
export interface Conversation {
    id: string;
    title: string;
    message_count: number;
    last_message_preview: string;
    last_message_type: string;
    updated_at: string;
    created_at: string;
}

// Response from GET /chat/conversations
export interface ConversationsResponse {
    data: Conversation[];
    meta: {
        timestamp: string;
        pagination: {
            limit: number;
            offset: number;
            total_count: number;
            has_more: boolean;
            returned_count: number;
        };
    };
}

// Message item from GET /chat/history/{conversation_id}
export interface HistoryMessage {
    id: string;
    conversation_id: string;
    role: "user" | "assistant";
    type: string;
    content: string;
    attachments: unknown[];
    sources: unknown[];
    parent_id: string | null;
    created_at: string;
    finish_reason: string | null;
}

// Response from GET /chat/history/{conversation_id}
export interface ConversationHistoryResponse {
    data: HistoryMessage[];
    meta: {
        timestamp: string;
        pagination: {
            limit: number;
            offset: number;
            total_count: number;
            has_more: boolean;
            returned_count: number;
        };
    };
}

// ==================== CHAT API ====================

export const chatApi = {

    /**
     * Send a message and receive streaming response
     *
     * @param content - The message text
     * @param conversationId - null for first message, string for subsequent
     * @param options - Callbacks for streaming chunks, completion, and errors
     * @returns Promise with conversationId for subsequent messages
     */
    sendMessageStream: async (
        content: string,
        conversationId: string | null = null,
        options?: {
            useFilePlugin?: boolean;
            onChunk?: (chunk: string) => void;
            onComplete?: (fullContent: string, conversationId: string) => void;
            onError?: (error: string) => void;
        }
    ): Promise<{ conversationId: string }> => {

        const {
            useFilePlugin = true,
            onChunk,
            onComplete,
            onError
        } = options || {};

        // Build payload as per your specification
        const payload: ChatStreamRequest = {
            conversation_id: conversationId,  // null for first message
            use_file_plugin: useFilePlugin,
            messages: [
                {
                    role: "user",
                    type: "text",
                    content: content,
                    parent_id: null  // always null
                }
            ]
        };

        try {
            // Use our custom API route that properly streams
            // The route at /api/chat/stream forwards to backend and streams response
            const response = await fetch('/api/chat/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',  // Send cookies for auth
                body: JSON.stringify(payload)
            });

            // Handle 401 - try to refresh token and retry
            if (response.status === 401) {
                try {
                    // Try to refresh the token
                    await authApi.refresh();
                    // Retry the request after token refresh
                    return chatApi.sendMessageStream(content, conversationId, options);
                } catch {
                    // Refresh failed - user needs to login again
                    throw new Error('Session expired. Please login again.');
                }
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            if (!response.body) {
                throw new Error('No response body');
            }

            // Read the streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';
            let receivedConversationId = conversationId || '';
            let buffer = '';  // Buffer for incomplete JSON lines

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }

                // Decode the chunk and add to buffer
                buffer += decoder.decode(value, { stream: true });

                // Response format: newline-delimited JSON (NDJSON)
                // Each line is a complete JSON object
                const lines = buffer.split('\n');

                // Keep the last incomplete line in buffer
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) continue;

                    try {
                        const data = JSON.parse(trimmedLine);

                        // Extract conversation_id from response
                        if (data.conversation_id) {
                            receivedConversationId = data.conversation_id;
                        }

                        // Extract delta (content chunk) and send to callback
                        if (data.delta) {
                            fullContent += data.delta;
                            onChunk?.(data.delta);
                        }

                        // Check for finish_reason to know when stream is done
                        if (data.finish_reason === 'stop') {
                            onComplete?.(fullContent, receivedConversationId);
                        }
                    } catch {
                        // Not valid JSON, might be partial chunk
                        console.debug('[CHAT STREAM] Non-JSON line:', trimmedLine);
                    }
                }
            }

            // Process any remaining buffer content
            if (buffer.trim()) {
                try {
                    const data = JSON.parse(buffer.trim());
                    if (data.conversation_id) {
                        receivedConversationId = data.conversation_id;
                    }
                    if (data.delta) {
                        fullContent += data.delta;
                        onChunk?.(data.delta);
                    }
                    if (data.finish_reason === 'stop') {
                        onComplete?.(fullContent, receivedConversationId);
                    }
                } catch {
                    console.debug('[CHAT STREAM] Final buffer not JSON:', buffer);
                }
            }

            return { conversationId: receivedConversationId };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Chat request failed';
            console.error('[CHAT STREAM ERROR]', error);
            onError?.(errorMessage);
            throw error;
        }
    },

    /**
     * Send message without streaming (if needed)
     * Uses apiClient with interceptors for token refresh
     */
    sendMessage: async (
        content: string,
        conversationId: string | null = null,
        useFilePlugin: boolean = true
    ): Promise<ApiResponse<{ conversation_id: string; content: string }>> => {

        const payload: ChatStreamRequest = {
            conversation_id: conversationId,
            use_file_plugin: useFilePlugin,
            messages: [
                {
                    role: "user",
                    type: "text",
                    content: content,
                    parent_id: null
                }
            ]
        };

        try {
            const response = await apiClient.post<ApiResponse<{ conversation_id: string; content: string }>>(
                '/chat/stream',
                payload
            );
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            console.error('[CHAT ERROR]', {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                message: axiosError.message
            });
            throw error;
        }
    },

    /**
     * Get list of conversations for the authenticated user
     * @param limit - Number of items to return per page (default: 10)
     * @param offset - Number of items to skip (default: 0)
     */
    getConversations: async (
        limit: number = 10,
        offset: number = 0
    ): Promise<ConversationsResponse> => {
        try {
            const response = await apiClient.get<ConversationsResponse>(
                `/chat/conversations?limit=${limit}&offset=${offset}`
            );
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            console.error('[GET CONVERSATIONS ERROR]', {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                message: axiosError.message
            });
            throw error;
        }
    },

    /**
     * Get conversation history (messages) for a specific conversation
     * Loads all messages in one request (no pagination)
     * @param conversationId - The conversation ID to fetch history for
     */
    getConversationHistory: async (
        conversationId: string
    ): Promise<ConversationHistoryResponse> => {
        try {
            const response = await apiClient.get<ConversationHistoryResponse>(
                `/chat/history/${conversationId}`
            );
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            console.error('[GET CONVERSATION HISTORY ERROR]', {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                message: axiosError.message
            });
            throw error;
        }
    }
};
