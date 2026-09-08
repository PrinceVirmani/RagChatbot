import type { NextConfig } from "next";

// The online RAG pipeline (retrieval + LLM streaming) now runs inside Next.js:
//   /api/chat      → app/api/chat/route.ts
//   /api/documents → app/api/documents/route.ts
//   /api/messages  → app/api/messages/route.ts
//
// Only the offline ingest pipeline is still Python — it needs pypdf for PDF
// text extraction — so /api/ingest stays proxied to the FastAPI service.
// /api/chat/stream is a separate legacy Next handler and is untouched.
const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: "100mb",
  },
  async rewrites() {
    const target =
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
      "http://localhost:8000";
    return [
      // Offline ingest — still served by Python.
      { source: "/api/ingest", destination: `${target}/api/ingest` },
      // Health/legacy v1 namespace (only /health is still live).
      { source: "/api/v1/:path*", destination: `${target}/api/v1/:path*` },
    ];
  },
};

export default nextConfig;
