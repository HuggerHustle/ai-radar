/**
 * One-off script: regenerate highlights.json from existing reports
 * and optionally resend the Slack notification.
 *
 * Usage:
 *   npx tsx scripts/regen-highlights.ts [--notify]
 *
 * Env vars:
 *   OPENROUTER_API_KEY
 *   SLACK_BOT_TOKEN + SLACK_CHANNEL_ID (only if --notify)
 */

import fs from "node:fs";
import path from "node:path";
import { callLlm, parseLlmJson } from "../src/report.ts";
import { buildHighlightsPrompt, type ReportHighlights } from "../src/prompts-data.ts";
import { buildMessage, sendSlack } from "../src/notify.ts";

const DATE = process.argv[2] && !process.argv[2].startsWith("-") ? process.argv[2] : null;
const NOTIFY = process.argv.includes("--notify");

async function main() {
  // Find latest date
  const digestsDir = "digests";
  const dateStr =
    DATE ??
    fs
      .readdirSync(digestsDir)
      .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
      .sort()
      .reverse()[0];

  if (!dateStr) {
    console.error("No digest date found");
    process.exit(1);
  }

  console.log(`Regenerating highlights for ${dateStr}...`);

  const reportIds = [
    "ai-cli",
    "ai-agents",
    "ai-infra",
    "ai-web",
    "ai-trending",
    "ai-hn",
    "ai-ph",
    "ai-arxiv",
    "ai-hf",
    "ai-community",
  ];

  // Read reports
  const reports: Record<string, string> = {};
  for (const id of reportIds) {
    const reportPath = path.join(digestsDir, dateStr, `${id}.md`);
    if (fs.existsSync(reportPath)) reports[id] = fs.readFileSync(reportPath, "utf-8");
  }

  console.log(`  Reports: ${Object.keys(reports).length}`);

  // Generate highlights
  let highlights: ReportHighlights = {};
  const raw = await callLlm(buildHighlightsPrompt(reports), 2048);
  try {
    highlights = parseLlmJson<ReportHighlights>(raw);
  } catch (err) {
    console.error(`  [highlights] parse failed: ${err}`);
  }

  const outPath = path.join(digestsDir, dateStr, "highlights.json");
  fs.writeFileSync(outPath, JSON.stringify(highlights, null, 2) + "\n");
  console.log(`  Saved ${outPath}`);
  console.log(`  Keys: ${Object.keys(highlights).join(", ")}`);

  if (NOTIFY) {
    if (!process.env["SLACK_BOT_TOKEN"] || !process.env["SLACK_CHANNEL_ID"]) {
      console.error("  SLACK_BOT_TOKEN or SLACK_CHANNEL_ID not set, cannot send notification.");
      process.exit(1);
    }
    console.log("  Sending Slack notification...");
    await sendSlack(buildMessage(dateStr, Object.keys(reports), undefined, highlights));
    console.log("  Slack notification sent!");
  }

  console.log("Done!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
