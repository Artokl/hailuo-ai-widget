// Проксируем только запросы к API
if (url.pathname === "/api/enhance") {
  const { prompt } = await request.json();
  
  // Здесь мог бы быть вызов реального API (например, GPT-4)
  // для улучшения промпта, скрывая ключ в переменных окружения
  const enhancedPrompt = `Cinematic, 8k, highly detailed: ${prompt}`;
  
  return new Response(JSON.stringify({ enhancedPrompt }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}

return new Response("Hailuo Proxy Active", { status: 200 });
