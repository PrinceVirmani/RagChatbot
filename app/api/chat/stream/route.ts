import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();


        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!backendUrl) {
            return new Response(
                JSON.stringify({ error: 'Backend URL not configured' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Forward cookies from the incoming request
        const cookies = request.headers.get('cookie') || '';

        // Make request to backend
        const response = await fetch(`${backendUrl}/api/v1/chat/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies,  // Forward auth cookies
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return new Response(errorText, { status: response.status });
        }

        if (!response.body) {
            return new Response('No response body', { status: 500 });
        }

        // Create a TransformStream to pass through the data
        const { readable, writable } = new TransformStream();

        // Pipe the backend response to the client
        response.body.pipeTo(writable);

        // Return streaming response with proper headers
        return new Response(readable, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('[CHAT STREAM API ERROR]', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
