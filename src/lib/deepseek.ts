/**
 * DeepSeek API client — OAI-compatible, cheapest frontier model.
 * Used for AI property search (natural language → structured filters).
 */

const BASE_URL = "https://api.deepseek.com";

interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface DeepSeekResponse {
  choices: { message: { content: string } }[];
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

export async function chatCompletion(
  messages: DeepSeekMessage[],
  options?: { temperature?: number; maxTokens?: number; json?: boolean; timeoutMs?: number },
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY not configured");

  const body: Record<string, unknown> = {
    model: "deepseek-chat",
    messages,
    temperature: options?.temperature ?? 0.1,
  };
  if (options?.maxTokens) body.max_tokens = options.maxTokens;
  if (options?.json) body.response_format = { type: "json_object" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 10_000);

  const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: controller.signal,
  });

  clearTimeout(timeout);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DeepSeek API error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as DeepSeekResponse;
  return data.choices[0]?.message?.content ?? "";
}
