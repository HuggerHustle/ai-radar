import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { mockCreate } = vi.hoisted(() => ({ mockCreate: vi.fn() }));

vi.mock("openai", () => ({
  default: class {
    chat = { completions: { create: mockCreate } };
  },
}));

import { callOpenRouter, OPENROUTER_DEFAULT_MODEL } from "../openrouter.ts";

describe("callOpenRouter", () => {
  beforeEach(() => {
    mockCreate.mockReset();
    delete process.env["OPENROUTER_MODEL"];
  });
  afterEach(() => {
    delete process.env["OPENROUTER_MODEL"];
  });

  it("sends the default model, max_tokens and reasoning disabled", async () => {
    mockCreate.mockResolvedValue({ choices: [{ message: { content: "ok" } }] });
    await expect(callOpenRouter("hi", 123)).resolves.toBe("ok");
    expect(mockCreate).toHaveBeenCalledWith({
      model: OPENROUTER_DEFAULT_MODEL,
      max_tokens: 123,
      messages: [{ role: "user", content: "hi" }],
      reasoning: { enabled: false },
    });
  });

  it("uses OPENROUTER_MODEL when set", async () => {
    process.env["OPENROUTER_MODEL"] = "anthropic/claude-haiku-5.5";
    mockCreate.mockResolvedValue({ choices: [{ message: { content: "ok" } }] });
    await callOpenRouter("hi", 1);
    expect(mockCreate.mock.calls[0]?.[0]).toMatchObject({ model: "anthropic/claude-haiku-5.5" });
  });

  it("throws on an empty response", async () => {
    mockCreate.mockResolvedValue({ choices: [{ message: { content: "" } }] });
    await expect(callOpenRouter("hi", 1)).rejects.toThrow("empty response");
  });
});
