/**
 * OpenRouter client — every LLM call in the pipeline goes through here.
 *
 * Env vars:
 *   OPENROUTER_API_KEY  - API key (required)
 *   OPENROUTER_MODEL    - model id (default: OPENROUTER_DEFAULT_MODEL)
 */

import OpenAI from "openai";

export const OPENROUTER_DEFAULT_MODEL = "deepseek/deepseek-v4.1-flash";

export const openRouterModel = (): string => process.env["OPENROUTER_MODEL"] || OPENROUTER_DEFAULT_MODEL;

let client: OpenAI | undefined;

export async function callOpenRouter(prompt: string, maxTokens: number): Promise<string> {
  client ??= new OpenAI({
    apiKey: process.env["OPENROUTER_API_KEY"],
    baseURL: "https://openrouter.ai/api/v1",
  });
  const body: OpenAI.ChatCompletionCreateParamsNonStreaming & { reasoning: { enabled: boolean } } = {
    model: openRouterModel(),
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
    // OpenRouter-only field. Reasoning tokens count against max_tokens and
    // would truncate the report.
    reasoning: { enabled: false },
  };
  const response = await client.chat.completions.create(body);
  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error("Unexpected empty response from OpenRouter");
  return text;
}
