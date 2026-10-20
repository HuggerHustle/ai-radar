/**
 * Slack notification — reads manifest.json and posts one message to a channel
 * with a link to each of the latest reports plus its highlights. Skips silently
 * if the secrets are not set.
 *
 * Required env vars:
 *   SLACK_BOT_TOKEN     — bot token (xoxb-…) with the chat:write scope
 *   SLACK_CHANNEL_ID    — channel to post to; the bot must be a member
 * Optional:
 *   GITHUB_REPOSITORY   — owner/repo the report links point at (set by GitHub Actions)
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { NOTIFY_LABELS } from "./i18n.ts";
import type { ReportHighlights } from "./prompts-data.ts";

const REPO_DEFAULT = "HuggerHustle/ai-radar";

/** Slack mrkdwn treats only these three characters as control characters. */
function escapeMrkdwn(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function sendSlack(text: string): Promise<void> {
  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${process.env["SLACK_BOT_TOKEN"] ?? ""}`,
    },
    body: JSON.stringify({
      channel: process.env["SLACK_CHANNEL_ID"] ?? "",
      text,
      unfurl_links: false,
      unfurl_media: false,
    }),
  });
  // Slack answers HTTP 200 for most failures (bad token, bot not in channel)
  // and reports them in the body, so `ok` is the real success signal.
  const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!res.ok || !body.ok) {
    throw new Error(`Slack API ${res.status}: ${body.error ?? "unknown error"}`);
  }
}

export function buildMessage(
  date: string,
  reports: string[],
  repo?: string,
  highlights?: ReportHighlights | null,
): string {
  const base = `https://github.com/${repo ?? (process.env["GITHUB_REPOSITORY"] || REPO_DEFAULT)}`;
  const lines: string[] = [`📡 *ai-radar · ${date}*`];

  for (const r of reports) {
    lines.push(""); // blank line before each report section
    lines.push(`• <${base}/blob/master/digests/${date}/${r}.md|${NOTIFY_LABELS[r] ?? r}>`);

    // Add highlights as indented sub-items.
    for (const h of highlights?.[r] ?? []) {
      lines.push(`    ◦ ${escapeMrkdwn(h)}`);
    }
  }

  lines.push(`\n<${base}/tree/master/digests/${date}|📁 All of today's reports>`);
  return lines.join("\n");
}

async function main(): Promise<void> {
  if (!process.env["SLACK_BOT_TOKEN"] || !process.env["SLACK_CHANNEL_ID"]) {
    console.log("[notify] SLACK_BOT_TOKEN or SLACK_CHANNEL_ID not set — skipping.");
    return;
  }

  if (!fs.existsSync("manifest.json")) {
    console.log("[notify] manifest.json not found — skipping.");
    return;
  }

  const { dates } = JSON.parse(fs.readFileSync("manifest.json", "utf-8")) as {
    dates: { date: string; reports: string[] }[];
  };

  const latest = dates?.[0];
  if (!latest) {
    console.log("[notify] manifest is empty — skipping.");
    return;
  }
  const { date, reports } = latest;

  // Load highlights if available
  let highlights: ReportHighlights | null = null;
  const highlightsPath = path.join("digests", date, "highlights.json");
  if (fs.existsSync(highlightsPath)) {
    try {
      highlights = JSON.parse(fs.readFileSync(highlightsPath, "utf-8")) as ReportHighlights;
    } catch {
      console.log("[notify] Failed to parse highlights.json — sending without highlights.");
    }
  }

  const text = buildMessage(date, reports, undefined, highlights);

  console.log(`[notify] Sending Slack message for ${date} (${reports.length} reports)…`);
  await sendSlack(text);
  console.log("[notify] Done!");
}

// Only auto-send when run directly (`tsx src/notify.ts`). Guard prevents an
// accidental send when another module imports `buildMessage` from here.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e: unknown) => {
    console.error("[notify]", e instanceof Error ? e.message : e);
    process.exit(1);
  });
}
