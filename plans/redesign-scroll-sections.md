# Redesign — Scrolling Full-Page Sections

**Inspiration**: https://glennreid.com/ — scroll-snap full-viewport sections with photos and text overlays.

## Goal

Turn the current single-hero landing page into a multi-section scrolling site that shows off Cameron's projects and personality through full-viewport image sections. Keep the existing animated gradient. No duplicate CTAs — every button does something unique.

## Environment / Context

- React Router 7 (SSG mode, see `react-router.config.ts` if present), Vite, deployed to Cloudflare Pages.
- Branch: `redesign-scroll-sections` off `master` (commit `2cb5bba`).
- Worktree: `C:\Users\camer\.t3\worktrees\cameron.tacklind.com\t3code-cf2fc5bd`.
- Dev server: `bun run dev` (react-router dev).
- Preview URL: Cloudflare Pages will give us a `*.pages.dev` preview once we push, per user.

## Decisions already made (don't re-ask)

1. **Keep the existing animated gradient** as the page background (continuous across all sections — not per-section). Glenn's static-with-jumps look is explicitly not wanted.
2. **No duplicate buttons / CTAs.** Each button has a unique destination or behavior. "Scroll to section X" and "open content on a different page" count as different behaviors, so both can exist — but no two buttons that both go to the same external link.
3. **Real photos go in later.** First pass uses SVG placeholders the user can swap.
4. **Scroll-snap, full-viewport sections.** Each section is `100dvh`, scroll-snap-align start, mandatory snap on the scroll container.
5. **Keep the tooltip-rich hero** as section 1 — that's already the personality summary. New sections expand on each role.
6. **Preserve dark/light mode** and the `?light` URL override.
7. **Source content from the existing page** — don't invent biography. Pull from tooltip data.

## Proposed Section Layout

| # | Section | Visual | Text | Unique CTA |
|---|---------|--------|------|-----------|
| 1 | Hero | Gradient only (no photo); centered name + tagline + tooltips | Existing hero content | Chevron-down → scroll to §2 |
| 2 | Roboticist | Photo of a robot/PCB/control work | "From BLDC to Kalman — control systems across medical, wearable, commercial, art." | Link to GitHub → `github.com/cinderblock` |
| 3 | Artist | Photo of an art installation (RadiaLumia / OPUS / etc.) | "Art that lights up the desert." | Link to foldhaus.com/radialumia (featured installation) |
| 4 | Maker | Photo of fabrication work (3D print, PCB, metal, fabric, wood) | "Built with 3D, PCBs, metal, fabric, wood." | Link to a specific project page (TBD, placeholder for now) |
| 5 | FIRST | Photo from FIRST competition / volunteering | "Team 8 alum, Bloomhouse mentor, 2023 Volunteer of the Year." | Link to TBA 2023 award page (already in current site) |
| 6 | Connect | Portrait photo + social icons grid | "Reach out." | Each social icon = its own unique destination (no duplicate-link rule violation since each is a distinct service) |

**Button uniqueness audit**:
- Chevron-down (§1): scroll behavior. Unique.
- GitHub CTA (§2): external profile. Also appears in §6 social icons → **conflict**. Resolution: §2 CTA goes to a specific *repo* (e.g. `react-smoothie` since it's already in the tooltip) rather than the profile. Or use LinkedIn here. **Open question 1.**
- foldhaus.com (§3): external. Not duplicated. ✓
- Maker external (§4): TBD. ✓
- FIRST/TBA award (§5): external. Not duplicated. ✓
- Socials grid (§6): each is its own destination. ✓

## Architecture

- One scrolling container (`<main>`) with `scroll-snap-type: y mandatory`, `overflow-y: auto`.
- Body/html changes: drop the `overflow: hidden` from html, keep on body.
- Each `<section>` is `100dvh` with `scroll-snap-align: start`.
- Gradient stays on `html` (so it scrolls with viewport, NOT with content) → use `background-attachment: fixed` or apply the gradient to a fixed pseudo-element.
- Section layout: photo on one side (rounded card, shadow), text + CTA on the other. Alternate left/right per section. On mobile, stack vertically with photo above text.
- Smooth scroll for in-page anchors / chevron clicks.

## Things NOT to do

- Don't replace the gradient with per-section background colors (would create Glenn's jump effect).
- Don't repeat the same external link in multiple buttons across sections.
- Don't break the existing tooltip UX in §1 — just leave it as-is.
- Don't add ScrollSpy / fancy section indicators in v1 — keep it Glenn-simple.
- Don't pull real biographical text from anywhere outside the current page's tooltips.
- Don't add new dependencies if CSS can do it (scroll-snap is pure CSS).

## Open questions for the user

1. §2 (Roboticist) CTA — what's the "one thing" to link to? Options: a featured GitHub repo (e.g. `react-smoothie`), LinkedIn, or a specific company/project page. **Recommendation: link to LinkedIn for the professional roboticist work**, and let §6's GitHub icon cover the code side.
2. §4 (Maker) CTA — is there a portfolio site, Instagram album, or repo you'd want linked? **Recommendation: link Instagram for now** (visual maker content).
3. Section ordering — does "Roboticist → Artist → Maker → FIRST → Connect" feel right? Or lead with Artist since that's the most visually distinctive?

## Progress log

- [x] Branch created (`redesign-scroll-sections`)
- [x] Plan written
- [x] Skeleton in `app/routes/home.tsx` — 6 sections (hero, roboticist, artist, maker, first, connect), tooltip-rich hero preserved
- [x] CSS in `app/styles/global.css` — `.page` scroll container, `.snap` scroll-snap-align, alternating `.section-photo-left`/`.section-photo-right` two-col grid, `.cta` pill button, `.scroll-cue` chevron, mobile breakpoints retained
- [x] Placeholder SVGs in `public/placeholders/` (roboticist, artist, maker, first, portrait)
- [x] `bun run typecheck` clean
- [x] `bun run build` clean — SSG prerender of `/` produces `build/client/index.html`
- [x] Visual check at 1400×900 and 420×900 — all sections render, mobile stacks, light mode override (`?light`) works, hero tooltips still functional, chevron smooth-scrolls
- [ ] User reviews in dev server, decides on CTA targets (open questions)
- [ ] Swap placeholder SVGs for real photos
- [ ] Push for Cloudflare preview URL

## Findings / gotchas

- **Scroll container**: html keeps `overflow: hidden`, body wraps `<main class="page">` which is the scroll container with `scroll-snap-type: y mandatory`. This keeps the radial-gradient `background-image` on `html` pinned to the viewport without needing `background-attachment: fixed` — the gradient is on a non-scrolling element.
- **`background-attachment: fixed` added defensively** on html anyway, since the user mentioned Glenn's gradient "jumps" — wanted to be sure ours never could.
- **404 page**: still uses `.container` class. Restored the old `.container` rules (now slimmer — just centers the 404 content). Verified the 404 layout still works conceptually; not regression-tested in browser this session.
- **`prerender: true` warning** about splat (`*`) routes is pre-existing — not introduced by this change. Build still succeeds and prerenders `/`.
- **Tooltip on mobile**: the existing focus-only tooltip behavior on small screens was preserved as-is. The tooltip arrow positioning script keeps working because tooltips use `getBoundingClientRect`, which is viewport-relative.
- **No new dependencies added** — `ChevronDown` and `ArrowUpRight` were already in `lucide-react`.

## Round 2 — AI section + Claude activity chart (2026-11-09)

User asked to add AI/prompting/physical-AI angle and a GitHub-style weekly activity heatmap of real Claude usage.

### Tagline changes

- Meta title: `Cameron Tacklind - Complete AI Stack Roboticist`
- Meta description: `Cameron Tacklind — Complete AI Stack Roboticist. From BLDC to LLMs, from robots to reason.`
- Hero intro: `from Robots to Reason`
- Hero tagline: `Complete AI Stack Roboticist` (AI inserted as a new tooltipped word between Complete and Stack)
- New AI tooltip rows: Tools (Claude Code, MCP, Codex) · Models (Claude, GPT, Local) · Agents (Autonomous, Multi-Agent, Workflows) · Physical (Robot control, Vision, Embodied). Open question: are these the right rows for Cameron?

### New AI scroll section (between Hero and Roboticist)

- Single-column `.section-ai` layout (not photo+text split)
- Heading `AI` · lede `Physical AI, before it had a name.` · body `Robots that think. Agents that build. Prompts logged live from my own Claude usage.`
- No external CTA — the chart is the payload

### Activity heatmap

- `scripts/build-claude-activity.ts` scans `~/.claude/projects/**/*.jsonl`, counts real user prompts (non-sidechain, text content only) per local day, emits `app/data/claude-activity.json` with a 53×7 grid aligned to this Saturday.
- `app/components/ActivityHeatmap.tsx` renders the grid (CSS grid, `minmax(0, 1fr)` so it shrinks on mobile without overflow), with month labels, Mon/Wed/Fri day labels, stats row (total prompts / active days / peak day / longest streak), GitHub-style legend, and an "Updated {date}" note.
- Theme-aware (light + dark variables), `?light` override preserved via `data-force-light` guard already present in global.css.
- First run (transcripts only, superseded): 9,362 prompts, 70 active days, 656 peak. The 656 included delegated child sessions as if typed.
- Current source: T3 `statev2.sqlite`, counting only messages typed by the user (`createdBy = user`) in Claude-provider threads; transcripts and `history.jsonl` fill days before T3 (max of the two per day, never summed). Result: 16,673 prompts since 2026-01-13, 208 active days, 253 peak day (2026-11-02), 41-day longest streak.
- Typecheck needs `@types/bun` (dev dependency) for `bun:sqlite`. It's referenced only in the script via `/// <reference types="bun" />`, so Bun globals stay out of app code.
- Dev-server gotcha: after any `bun add`, Vite's dependency cache can serve mixed bundle versions, which shows up as "Invalid hook call / reading 'useContext'". Fix: stop the server, delete `node_modules/.vite`, run `bun run dev -- --force`, then reload the page once dependency optimization finishes. Production builds aren't affected.

### Daily regen (needs local setup)

CF Pages cannot reach `~/.claude/projects`, so the generator runs locally on Cameron's machine. Options to automate:

**Option A — Windows Task Scheduler** (recommended):
1. `schtasks /create /sc daily /st 06:00 /tn "cameron.tacklind.com-activity" /tr "pwsh -NoProfile -Command \"cd 'C:\Users\camer\git\Personal Projects\cameron.tacklind.com'; bun run activity; git add app/data/claude-activity.json; git diff --staged --quiet || (git commit -m 'Daily Claude activity refresh'; git push)\""`
2. Scheduler runs the job at 6 AM local; if the JSON changed, it commits and pushes, triggering a CF Pages rebuild of the active branch.

**Option B — manual**: `bun run activity && git add app/data/claude-activity.json && git commit -m "Refresh Claude activity" && git push` whenever Cameron wants to refresh.

### Files changed

- `scripts/build-claude-activity.ts` (new)
- `app/data/claude-activity.json` (new, generated)
- `app/components/ActivityHeatmap.tsx` (new)
- `app/routes/home.tsx` (tagline + AI tooltip + AI section + import)
- `app/styles/global.css` (section-ai + heatmap styles)
- `tests/home.spec.ts` (updated for new title/description/tagline tokens)
- `package.json` (added `activity` script)

### Verified

- `bun run typecheck` clean
- `bun run build` SSG prerender succeeds
- `bun run test --project=chromium` 7/7 pass
- Visual check 1400×900 + 420×900 (mobile), dark + light modes, AI tooltip hover

### Finding: `~/.claude/projects` is missing most of the history (2026-11-09)

The first chart showed only 70 active days. Cameron has far more.

- `~/.claude/projects` transcripts only go back to file mtimes of 2026-08-26 (4 files in Aug, 187 in Sep, 1,086 in Oct). Older transcripts are gone, even though `cleanupPeriodDays` is now 36500. Likely cause: Claude Code's default 30-day cleanup ran before the setting was raised. Unconfirmed.
- `~/.claude/history.jsonl` has only 206 prompts across 19 days (2026-01-14 → 2026-10-16). Too sparse to use alone.
- **T3's `~/.t3/userdata/statev2.sqlite` holds the complete record.** `orchestration_v2_projection_messages` has 19,060 `role=user` rows from 2026-03-09 to now, across 213 distinct days. Provider via `orchestration_v2_projection_runs.provider`: `claudeAgent` 19,046 rows over 211 days; `codex` 10 rows; `claudeAgent_claude_api` 6 rows. `payload_json.createdBy` separates typed prompts (`user`, 16,486) from agent-created ones (`agent`, 2,576: delegations, scheduled tasks).
- `~/.codex/sessions` is empty. The Claude desktop app has no local `.jsonl` transcripts.
- Open it read-only (`bun:sqlite` `{readonly:true}`). It's 8.3 GB and live.

**Implemented** (user approved 2026-11-09): use T3 as the primary source, and fall back to `~/.claude/projects` plus `history.jsonl` only for days T3 doesn't cover (before 2026-03-09). Don't sum the two sources: T3-driven sessions also write `~/.claude/projects` transcripts, so adding them would double-count.

### Open questions for round 2

1. AI tooltip rows — are Tools/Models/Agents/Physical the right four, with these exact entries?
2. Daily regen — want me to set up the Windows Task now, or leave that to you?

---

Plan path: `plans/redesign-scroll-sections.md`
