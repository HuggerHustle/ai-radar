import { describe, it, expect, vi, afterEach } from "vitest";
import { buildMessage, sendSlack } from "../notify.ts";
import type { ReportHighlights } from "../prompts-data.ts";

const REPO = "acme/radar";
const BLOB = `https://github.com/${REPO}/blob/master/digests/2026-03-09`;

describe("buildMessage", () => {
  const origRepo = process.env["GITHUB_REPOSITORY"];

  afterEach(() => {
    if (origRepo !== undefined) {
      process.env["GITHUB_REPOSITORY"] = origRepo;
    } else {
      delete process.env["GITHUB_REPOSITORY"];
    }
  });

  it("builds a daily message with one GitHub file link per report", () => {
    const msg = buildMessage("2026-03-09", ["ai-cli", "ai-agents"], REPO);
    expect(msg).toContain("📡 *ai-radar · 2026-03-09*");
    expect(msg).toContain(`<${BLOB}/ai-cli.md|AI CLI Tools>`);
    expect(msg).toContain(`<${BLOB}/ai-agents.md|AI Agents Ecosystem>`);
  });

  it("falls back to the report id when there is no label", () => {
    const msg = buildMessage("2026-03-09", ["ai-unknown"], REPO);
    expect(msg).toContain("/ai-unknown.md|ai-unknown>");
  });

  it("links to the day's folder", () => {
    const msg = buildMessage("2026-03-09", ["ai-cli"], REPO);
    expect(msg).toContain(`<https://github.com/${REPO}/tree/master/digests/2026-03-09|`);
  });

  it("uses GITHUB_REPOSITORY, then the default repo", () => {
    process.env["GITHUB_REPOSITORY"] = "env/repo";
    expect(buildMessage("2026-03-09", ["ai-cli"])).toContain("https://github.com/env/repo/blob/");
    delete process.env["GITHUB_REPOSITORY"];
    expect(buildMessage("2026-03-09", ["ai-cli"])).toContain(
      "https://github.com/HuggerHustle/ai-radar/blob/",
    );
  });

  it("includes escaped highlights when provided", () => {
    const highlights: ReportHighlights = {
      "ai-cli": ["Claude Code releases v1.2.0", "Gemini CLI fixes <streaming> & more"],
      "ai-agents": ["OpenClaw adds MCP support"],
    };
    const msg = buildMessage("2026-03-09", ["ai-cli", "ai-agents"], REPO, highlights);
    expect(msg).toContain("◦ Claude Code releases v1.2.0");
    expect(msg).toContain("◦ Gemini CLI fixes &lt;streaming&gt; &amp; more");
    expect(msg).toContain("◦ OpenClaw adds MCP support");
  });

  it("works without highlights", () => {
    expect(buildMessage("2026-03-09", ["ai-cli"], REPO, null)).not.toContain("◦");
    expect(buildMessage("2026-03-09", ["ai-cli"], REPO)).not.toContain("◦");
  });
});

describe("sendSlack", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const stubFetch = (status: number, body: unknown) => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  };

  it("posts to chat.postMessage with the bot token and channel", async () => {
    vi.stubEnv("SLACK_BOT_TOKEN", "xoxb-test");
    vi.stubEnv("SLACK_CHANNEL_ID", "C123");
    const fetchMock = stubFetch(200, { ok: true });
    await sendSlack("hello");
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://slack.com/api/chat.postMessage");
    expect((init.headers as Record<string, string>)["Authorization"]).toBe("Bearer xoxb-test");
    expect(JSON.parse(init.body as string)).toMatchObject({ channel: "C123", text: "hello" });
    vi.unstubAllEnvs();
  });

  it("throws when Slack answers 200 with ok: false", async () => {
    stubFetch(200, { ok: false, error: "not_in_channel" });
    await expect(sendSlack("hello")).rejects.toThrow("not_in_channel");
  });

  it("throws on a non-2xx response", async () => {
    stubFetch(500, {});
    await expect(sendSlack("hello")).rejects.toThrow("Slack API 500");
  });
});
