// Cloudflare Worker Proxy - Adapted from Overchat AI Architecture
function getCorsHeaders(request) {
    const origin = request.headers.get('Origin') || '';
    const allowedOrigins = [
        'https://overchat.ai',
        'https://www.overchat.ai',
        'https://landing.overchat.ai',
        'http://localhost:5173',
        'http://localhost:3000'
    ];

    const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    const allowOrigin = isLocalhost || allowedOrigins.includes(origin) ? origin : '*';

    return {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
    };
}

export default {
    async fetch(request, env) {
        // Handle preflight CORS requests
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: getCorsHeaders(request),
            });
        }

        // Prompt Enhancement Endpoint (Simulating LLM logic securely)
        const url = new URL(request.url);
        if (request.method === 'POST' && url.pathname === '/api/enhance') {
            try {
                const { prompt } = await request.json();
                
                // В реальном проде здесь будет запрос к GPT-4/Claude
                // с использованием скрытого ключа env.OPENAI_API_KEY
                
                const enhanced = `Cinematic masterpiece of ${prompt}, highly detailed, 8k resolution, professional color grading, trending on artstation`;
                
                return new Response(JSON.stringify({ success: true, prompt: enhanced }), {
                    status: 200,
                    headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' }
                });
            } catch (err) {
                return new Response(JSON.stringify({ error: 'Enhancement failed' }), {
                    status: 500,
                    headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' }
                });
            }
        }

        return new Response("Hailuo AI Widget Proxy is Active", { 
            status: 200,
            headers: getCorsHeaders(request)
        });
    }
}
