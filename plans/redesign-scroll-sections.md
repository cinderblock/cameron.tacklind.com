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

---

Plan path: `plans/redesign-scroll-sections.md`
