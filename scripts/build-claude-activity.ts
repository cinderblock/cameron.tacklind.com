#!/usr/bin/env bun
/**
 * Scans ~/.claude/projects/**\/*.jsonl and emits app/data/claude-activity.json
 * with a GitHub-style 53-week grid of user prompts per local day.
 *
 * Runs locally — Cloudflare Pages builds use the committed JSON.
 * Rerun daily via a scheduled task to keep the chart fresh.
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const PROJECTS_DIR = join(homedir(), ".claude", "projects");
const OUTPUT = join(process.cwd(), "app", "data", "claude-activity.json");
const WEEKS = 53;

type Cell = { date: string; count: number; future?: boolean };

function* walkJsonl(dir: string): Generator<string> {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkJsonl(full);
    else if (entry.isFile() && entry.name.endsWith(".jsonl")) yield full;
  }
}

function toLocalDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// A "real" user prompt is a top-level (non-sidechain) user message whose
// content is or includes real text — excluding synthetic tool_result turns.
function parsePromptTimestamp(line: string): Date | null {
  if (!line || !line.trim()) return null;
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(line);
  } catch {
    return null;
  }
  if (obj.type !== "user") return null;
  if (obj.isSidechain) return null;
  const msg = obj.message as { role?: string; content?: unknown } | undefined;
  if (!msg || msg.role !== "user") return null;
  if (Array.isArray(msg.content)) {
    const hasText = msg.content.some(
      (c): c is { type: string; text: string } =>
        !!c && typeof c === "object" && (c as { type?: unknown }).type === "text" &&
        typeof (c as { text?: unknown }).text === "string",
    );
    if (!hasText) return null;
  } else if (typeof msg.content !== "string") {
    return null;
  }
  if (typeof obj.timestamp !== "string") return null;
  const d = new Date(obj.timestamp);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function main(): void {
  if (!existsSync(PROJECTS_DIR)) {
    console.warn(`No Claude projects dir at ${PROJECTS_DIR}; writing empty window.`);
  }

  const perDay = new Map<string, number>();
  let filesScanned = 0;
  let totalPrompts = 0;

  if (existsSync(PROJECTS_DIR)) {
    for (const file of walkJsonl(PROJECTS_DIR)) {
      filesScanned++;
      let content: string;
      try {
        content = readFileSync(file, "utf8");
      } catch {
        continue;
      }
      for (const line of content.split(/\r?\n/)) {
        const ts = parsePromptTimestamp(line);
        if (!ts) continue;
        const key = toLocalDateKey(ts);
        perDay.set(key, (perDay.get(key) ?? 0) + 1);
        totalPrompts++;
      }
    }
  }

  // Align grid: end at this Saturday, start on the Sunday 53 weeks earlier.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dow = today.getDay(); // 0=Sun..6=Sat
  const end = new Date(today);
  end.setDate(end.getDate() + (6 - dow));
  const start = new Date(end);
  start.setDate(start.getDate() - (WEEKS * 7 - 1));

  const todayKey = toLocalDateKey(today);
  const cells: Cell[] = [];
  let maxDaily = 0;
  let activeDays = 0;
  let currentStreak = 0;
  let longestStreak = 0;

  const cursor = new Date(start);
  for (let i = 0; i < WEEKS * 7; i++) {
    const key = toLocalDateKey(cursor);
    const isFuture = key > todayKey;
    const count = isFuture ? 0 : perDay.get(key) ?? 0;
    cells.push(isFuture ? { date: key, count: 0, future: true } : { date: key, count });
    if (!isFuture) {
      if (count > maxDaily) maxDaily = count;
      if (count > 0) {
        activeDays++;
        currentStreak++;
        if (currentStreak > longestStreak) longestStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  const windowPrompts = cells.reduce((a, c) => a + c.count, 0);

  const out = {
    generatedAt: new Date().toISOString(),
    weeks: WEEKS,
    startDate: cells[0].date,
    endDate: cells[cells.length - 1].date,
    today: todayKey,
    windowPrompts,
    totalPrompts,
    maxDaily,
    activeDays,
    longestStreak,
    cells,
  };

  mkdirSync(join(process.cwd(), "app", "data"), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(out) + "\n", "utf8");

  console.log(
    `Scanned ${filesScanned} files, counted ${totalPrompts.toLocaleString()} prompts lifetime.`,
  );
  console.log(
    `Window ${out.startDate} → ${out.endDate}: ${windowPrompts.toLocaleString()} prompts, ${activeDays} active days, max ${maxDaily}/day, longest streak ${longestStreak}.`,
  );
  console.log(`Wrote ${OUTPUT}`);
}

main();
