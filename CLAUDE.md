# CLAUDE.md

## Project overview

ai-radar is a daily digest generator for the AI open-source ecosystem. A GitHub Actions cron job runs at 21:03 UTC (06:03 KST next day) and produces English reports, published as GitHub Issues and committed Markdown files.

## Commands

```bash
pnpm web:css        # rebuild app.css from web/app.css (commit the output)
pnpm start          # run the full digest locally
pnpm test           # vitest (unit tests)
pnpm typecheck      # tsc --noEmit
pnpm lint           # ESLint
pnpm lint:fix       # ESLint --fix
pnpm format         # Prettier --write src
pnpm format:check   # Prettier --check src
```

Required env vars for local runs:

```bash
export GITHUB_TOKEN=ghp_xxxxx
export DIGEST_REPO=owner/repo   # omit to skip GitHub issue creation

# LLM — every call goes through OpenRouter
export OPENROUTER_API_KEY=sk-or-xxxxx
# export OPENROUTER_MODEL=deepseek/deepseek-v4.1-flash   # any OpenRouter model id

# Slack notification (`pnpm notify`)
# export SLACK_BOT_TOKEN=xoxb-xxxxx
# export SLACK_CHANNEL_ID=C0123456789
```

## Architecture

The pipeline runs in four sequential phases, each implemented as a named async function in `src/index.ts`:

1. **`fetchAllData`** — all network I/O in parallel: GitHub API (issues/PRs/releases) for 18 repos, Claude Code Skills, Anthropic/OpenAI sitemaps, GitHub Trending HTML + Search API, Hacker News Algolia API, Product Hunt, ArXiv, Dev.to, Lobste.rs, and Hugging Face on its weekly day.
2. **`generateSummaries`** — per-repo LLM calls, all in parallel, rate-limited to 5 concurrent requests by a queue in `src/report.ts`.
3. **Comparisons** — three LLM calls (cross-tool CLI, OpenClaw cross-ecosystem, infra).
4. **Save phase** — `buildCliReportContent` / `buildOpenclawReportContent` / `buildInfraReportContent` (in `src/report-builders.ts`) build Markdown strings; the `saveXxxReport` functions (in `src/report-savers.ts`) make one LLM call, write one Markdown file and create one GitHub Issue. The phase ends by writing `highlights.json`, the per-report bullets `pnpm notify` posts to Slack.

## Source files

| File | Responsibility |
|------|---------------|
| `src/index.ts` | Orchestration: repo config, phase functions, `main()` |
| `src/i18n.ts` | Centralized fixed strings: report titles, issue titles and labels, footer text, `REPORT_LABELS`, `NOTIFY_LABELS` |
| `src/github.ts` | GitHub API helpers: `fetchRecentItems`, `fetchRecentReleases`, `fetchRecentDiscussions` (GraphQL), `fetchSkillsData`, `createGitHubIssue`; shared `RepoFetch` type |
| `src/config.ts` | Loads `config.yml` into `RadarConfig` (`cliRepos`, `skillsRepo`, `openclaw`, `openclawPeers`, `infraRepos`); built-in defaults when a section is missing |
| `src/prompts.ts` | LLM prompt builders for repo reports: `buildCliPrompt`, `buildPeerPrompt`, `buildInfraPrompt`, `buildComparisonPrompt`, `buildInfraComparisonPrompt`, `buildPeersComparisonPrompt`, `buildSkillsPrompt` |
| `src/prompts-data.ts` | LLM prompt builders for data-source reports: `buildTrendingPrompt`, `buildWebReportPrompt`, `buildHnPrompt`, `buildHighlightsPrompt`, … |
| `src/report.ts` | `callLlm` (with concurrency limiter), `saveFile`, `autoGenFooter` (uses i18n), LLM token budget constants |
| `src/report-builders.ts` | `buildCliReportContent`, `buildOpenclawReportContent`, `buildInfraReportContent` — assemble final Markdown strings for CLI, OpenClaw and infra reports |
| `src/report-savers.ts` | `saveWebReport`, `saveTrendingReport`, `saveHnReport`, … — one LLM call, one Markdown file, optional GitHub issue |
| `src/date.ts` | Date and timing utilities: `toCstDateStr`, `toUtcStr`, `weekdayOf`, `sleep` |
| `src/openrouter.ts` | `callOpenRouter` — the only LLM client (OpenAI SDK pointed at OpenRouter); `OPENROUTER_DEFAULT_MODEL` |
| `src/web.ts` | Sitemap-based web content fetching; state persisted to `digests/web-state.json` |
| `src/trending.ts` | GitHub Trending HTML scraper + Search API topic queries |
| `src/hn.ts` | Hacker News top AI stories via Algolia HN Search API |
| `src/ph.ts` | Product Hunt top AI products (GraphQL, needs `PRODUCTHUNT_TOKEN`) |
| `src/arxiv.ts` | ArXiv latest cs.AI / cs.CL / cs.LG papers |
| `src/hf.ts` | Hugging Face Hub trending models (weekly) |
| `src/devto.ts`, `src/lobsters.ts` | Dev.to and Lobste.rs AI stories for the community report |
| `src/notify.ts` | `pnpm notify` — Slack `chat.postMessage` with a GitHub file link + `highlights.json` bullets per report; skips unless `SLACK_BOT_TOKEN` and `SLACK_CHANNEL_ID` are set |
| `src/close-stale-issues.ts` | `pnpm close-stale` — entry point for `closeSupersededIssues` |
| `scripts/regen-highlights.ts` | Rebuilds a day's `highlights.json` from its committed reports; `--notify` resends the Slack message |
| `mcp/` | Cloudflare Worker MCP server (`ai-radar-mcp`) that serves reports from the Pages site |
| `src/generate-manifest.ts` | Generates `manifest.json` (sidebar data for Web UI) and `feed.xml` (RSS 2.0 feed) |

## Report outputs

Files written to `digests/YYYY-MM-DD/`:

| File | Label | Notes |
|------|-------|-------|
| `ai-cli.md` | `digest` | Always generated |
| `ai-agents.md` | `openclaw` | Always generated |
| `ai-infra.md` | `infra` | Always generated |
| `ai-web.md` | `web` | Skipped if no new sitemap content |
| `ai-trending.md` | `trending` | Skipped if both data sources fail |
| `ai-hn.md` | `hn` | Skipped if Algolia fetch fails |
| `ai-ph.md` | `ph` | Skipped without `PRODUCTHUNT_TOKEN` or data |
| `ai-arxiv.md` | `arxiv` | Skipped if the ArXiv fetch fails |
| `ai-community.md` | `community` | Dev.to + Lobste.rs combined |
| `ai-hf.md` | `hf` | **Weekly** — only on `HF_REPORT_WEEKDAY` (Monday, CST) |
| `highlights.json` | — | Flat `ReportHighlights` map, read by `pnpm notify` |

## Tracked sources

- **CLI_REPOS** (7): claude-code, codex, gemini-cli, copilot-cli, opencode, pi, qwen-code
- **Discussions** (`discussions: true` in `config.yml`): codex, pi.
- **OPENCLAW** + **OPENCLAW_PEERS** (5): openclaw/openclaw + 4 peer projects (sorted by stars)
- **INFRA_REPOS** (6): vllm, sglang, llama-cpp, ollama, litellm, unsloth — inference engines, gateway and fine-tuning layer
- **CLAUDE_SKILLS_REPO**: anthropics/skills — no date filter, sorted by popularity
- **Web**: anthropic.com + openai.com via sitemap, state in `digests/web-state.json`
- **Trending**: github.com/trending (HTML) + GitHub Search API (6 AI topics, 7-day window)
- **HN**: Algolia HN Search API — 6 parallel queries, top-30 AI stories by points, last 24h
- **HF**: Hugging Face Hub trending models — **weekly**, gated on `HF_REPORT_WEEKDAY` in `src/index.ts`. The Hub list is ranked by cumulative downloads and 90.5% of a day's models carried over from the previous day, so daily generation was re-summarizing the same table. The fetch is gated too, not just the report.

## Key conventions

- Reports are English only. Fixed strings (titles, labels, footers, messages) are centralized in `src/i18n.ts`; do not inline them elsewhere.
- LLM prompt builders are split across two files: `src/prompts.ts` (repo-level prompts) and `src/prompts-data.ts` (data-source prompts). Each report type has its own builder function.
- Weekly and monthly rollups were removed in July 2026. `ai-weekly`/`ai-monthly` remain in `REPORT_LABELS` (`src/i18n.ts`) and `REPORT_FILES` (`src/generate-manifest.ts`) only so archived reports stay reachable — do not add generation code back.
- `callLlm(prompt, maxTokens?)` defaults to 4096 tokens. Web report uses 8192, trending uses 6144. The table-formatted listing reports (HN, PH, ArXiv, HF, Community) use `LLM_TOKENS_LISTING` = 6144 to fit multi-row tables plus 2-sentence summaries.
- Data-source listing reports (Trending, HN, PH, ArXiv, HF, Community) render their item lists as **Markdown tables** (not bullet lists). Numeric columns are copied verbatim from the fetched data; the summary column is 2 sentences. The Web UI styles tables through the Tailwind typography plugin, and they render natively in GitHub Issues too.
- `callLlm` retries on two error classes, with separate budgets; the concurrency slot is released during every wait.
  - **429** — 3 retries, 5 s / 10 s / 20 s. A rate limit clears in seconds.
  - **Connection failure** (DNS/TCP/TLS, detected by `isConnectionError` walking the SDK's `cause` chain) — 6 retries, 5 / 10 / 20 / 40 / 60 / 60 s, capped by `RETRY_MAX_MS`. A network outage between the runner and the LLM endpoint lasts minutes, not seconds; a 35 s ladder gives up while the outage is still going and publishes a digest of nothing but "generation failed" placeholders.
- Every LLM call site degrades gracefully (a failed summary becomes a fixed notice), which is right per report and wrong for the run as a whole. `llmStats` in `src/report.ts` counts attempts and final failures across the run, and `assertLlmHealthy(stage)` throws when at least `LLM_MIN_SAMPLES` (5) calls have run and at least `LLM_ABORT_RATIO` (50%) of them failed. `main()` calls it at two gates — after the summary and comparison phase and after the save phase — so an LLM outage exits non-zero *before* anything is committed, no issues are opened and no Slack message is sent. A missing day is recoverable by `workflow_dispatch`; a published day of placeholders is not.
- `reportLlmHealth()` logs the final tally and, when any call was lost, appends a warning to `$GITHUB_STEP_SUMMARY` so a partially degraded run is visible on the Actions run page without a log dive.
- The concurrency limiter (`LLM_CONCURRENCY = 5`) prevents 429s when many parallel LLM calls fire. Do not bypass it by calling SDK clients directly.
- Every LLM call goes through `callOpenRouter` in `src/openrouter.ts`. The model is `OPENROUTER_MODEL`, default `deepseek/deepseek-v4.1-flash` (~$0.05/run). Switching model or vendor is an env change, not a code change. Requests send `reasoning: { enabled: false }`: reasoning tokens count against `max_tokens` and would truncate reports. `main()` throws before fetching anything when `OPENROUTER_API_KEY` is unset.
- The daily workflow only ever produces one digest per CST day. Two mechanisms enforce it: a workflow-level `concurrency: daily-digest` group (`cancel-in-progress: false`) serializes overlapping runs, and a `guard` job skips **scheduled** runs whose `digests/YYYY-MM-DD` folder is already committed (checked via `gh api .../contents/...`, so no second checkout). `workflow_dispatch` always proceeds — that is the escape hatch for regenerating a day. This exists because GitHub delayed the 2026-08-26 scheduled run by 5h07m; the manual catch-up run and the late scheduled run both completed and opened 18 duplicate issues for 2026-08-27.
- `closeSupersededIssues` in `src/github.ts` (run by `pnpm close-stale`, the workflow's last step) keeps only the most recent digest day's issues open and closes the rest. The retained day is the newest **open digest issue**, not today's date, so a failed run leaves yesterday's reports up instead of closing everything. Days are compared as CST dates via `toCstDateStr`, matching the `digests/YYYY-MM-DD` folders — a delayed cron and its manual catch-up run land on the same day and are both retained. Eligibility requires a label in `ISSUE_LABELS` (plus the legacy `weekly`/`monthly` and `-en` labels that older issues still carry), and pull requests are excluded: the `/issues` REST endpoint returns PRs too, and the previous `closeStaleIssues` would have closed any open PR older than its cutoff.
- GitHub issue label colors are defined in `LABEL_COLORS` in `src/github.ts`. Add new labels there.
- GitHub Discussions have no REST API, so `fetchRecentDiscussions` uses GraphQL. Enable per-repo with `discussions: true` — most tracked repos have the board enabled but dormant, and an unconditional fetch would just burn quota. Only `buildCliPrompt` renders a Discussions section, and it is omitted entirely when there is no data.
- `sampleNote(total, sampled, by)` in `src/prompts.ts` formats the "(Total: N items; showing top M by …)" note. Reuse it — do not inline the same string format. Pass `by: "engagement"` when the sample was ranked by comments + upvotes (discussions) instead of comments alone.
- Web state (`digests/web-state.json`) is committed to git on every run. It is the source of truth for which URLs have been seen. `saveWebReport` writes it once at the end, regardless of whether a report was generated.
- Tracked repos are pruned when they go quiet. Removed August 2026 after an activity audit:
  - `deepseek-harness` — Issues/PRs disabled upstream and the Discussions board dormant: 13/13 days of zero data.
  - `zeptoclaw`, `nullclaw` — no upstream push for 30+ days; 90% and 50% of days had no activity at all.
  - `nanobot`, `nanoclaw`, `lobsterai`, `codewhale` — 17–37 items per 24h, well under the 30-issue + 20-PR prompt sample, so the model was padding a full 8-section report out of a handful of items.
  - `picoclaw`, `moltis` — removed by maintainer decision alongside the above.
  - Same audit fixed two renames: `qwibitai/nanoclaw` → `nanocoai/nanoclaw`, `agentscope-ai/CoPaw` → `agentscope-ai/QwenPaw`.

## Web UI & RSS Feed

- Web UI: `index.html` reads `manifest.json` to build the sidebar, then fetches `digests/YYYY-MM-DD/report.md` on demand.
- Styling is Tailwind v4 on the OpsCom design system: `web/app.css` imports `web/theme.css` (a verbatim copy of `tokens/theme.css` from OpsComCorp/design-system — re-copy it, never edit it) and compiles to the committed root `app.css` with `pnpm web:css`. Style with Tailwind classes in `index.html`, not hand-written CSS. CI fails when `app.css` is stale, so rebuild and commit it with every class change.
- Theme defaults to the OS setting; the header button cycles system → light → dark and stores the choice in `localStorage` `ar-color-mode` (absent = system).
- RSS Feed: `feed.xml` at the repo root. Generated by `src/generate-manifest.ts` in the same `pnpm manifest` step. Contains the latest 30 items (newest first) across all report types. Item links use hash routing: `https://huggerhustle.github.io/ai-radar/#YYYY-MM-DD/report`.
- Both `manifest.json` and `feed.xml` are committed together in the "Commit manifest and feed" GHA step.
- The `REPORT_LABELS` map in `src/i18n.ts` must be kept in sync with the `LABELS` object in `index.html` when adding new report types.

## Adding a new report type

1. Create a data fetcher (or add to an existing one). For a repo-backed report, add the section to `RawConfig`/`RadarConfig` and `loadConfig` in `src/config.ts` — a `config.yml` section with no schema entry is silently ignored.
2. Add a `buildXxxPrompt` function in `src/prompts-data.ts` (for data-source prompts) or `src/prompts.ts` (for repo-level prompts).
3. Add fixed strings (titles, labels, issue title function) to `src/i18n.ts`.
4. Add a `saveXxxReport` function in `src/report-savers.ts`.
5. Wire into `fetchAllData`, `generateSummaries`, and the save phase in `src/index.ts`.
6. Add a label color entry in `LABEL_COLORS` in `src/github.ts`.
7. Add the report ID and label to `REPORT_LABELS` in `src/i18n.ts` and `LABELS` in `index.html`.
8. Add the report file name to `REPORT_FILES` in `src/generate-manifest.ts`.
9. Update both README files and this file.
