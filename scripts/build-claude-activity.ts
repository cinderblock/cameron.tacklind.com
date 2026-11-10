#!/usr/bin/env bun
/// <reference types="bun" />
/**
 * Emits app/data/claude-activity.json: a GitHub-style 53-week grid of
 * Claude prompts Cameron typed, per local day.
 *
 * Primary source is T3 Code's database (complete since T3 adoption).
 * Days before T3's first record fall back to ~/.claude transcripts and
 * history.jsonl. Sources are never summed: T3 sessions also write
 * transcripts, so adding them would double-count.
 *
 * Runs locally; Cloudflare Pages builds use the committed JSON.
 */

import { Database } from "bun:sqlite";
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const CLAUDE_DIR = join(homedir(), ".claude");
const PROJECTS_DIR = join(CLAUDE_DIR, "projects");
const HISTORY_FILE = join(CLAUDE_DIR, "history.jsonl");
const T3_DB = process.env.T3_STATE_DB ?? join(homedir(), ".t3", "userdata", "statev2.sqlite");
const OUTPUT = join(process.cwd(), "app", "data", "claude-activity.json");
const WEEKS = 53;

type Cell = { date: string; count: number; future?: boolean };
type DayCounts = Map<string, number>;

function toLocalDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function bump(map: DayCounts, d: Date): void {
  if (Number.isNaN(d.getTime())) return;
  const key = toLocalDateKey(d);
  map.set(key, (map.get(key) ?? 0) + 1);
}

// Prompts typed by the user (not agent-created) in Claude-provider threads.
function readT3(): DayCounts {
  const counts: DayCounts = new Map();
  if (!existsSync(T3_DB)) return counts;
  const db = new Database(T3_DB, { readonly: true });
  try {
    const rows = db
      .query(
        `SELECT m.created_at AS ts
         FROM orchestration_v2_projection_messages m
         JOIN orchestration_v2_projection_threads t ON t.thread_id = m.thread_id
         LEFT JOIN orchestration_v2_projection_runs r ON r.run_id = m.run_id
         WHERE m.role = 'user'
           AND json_extract(m.payload_json, '$.createdBy') = 'user'
           AND coalesce(r.provider, t.default_provider, '') LIKE 'claude%'`,
      )
      .all() as { ts: string }[];
    for (const { ts } of rows) bump(counts, new Date(ts));
  } finally {
    db.close();
  }
  return counts;
}

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

// Top-level user turns with real text, excluding sidechains and tool results.
function transcriptPromptTime(line: string): Date | null {
  if (!line.trim()) return null;
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(line);
  } catch {
    return null;
  }
  if (obj.type !== "user" || obj.isSidechain) return null;
  const msg = obj.message as { role?: string; content?: unknown } | undefined;
  if (!msg || msg.role !== "user") return null;
  if (Array.isArray(msg.content)) {
    const hasText = msg.content.some(
      (c) => !!c && typeof c === "object" && (c as { type?: unknown }).type === "text",
    );
    if (!hasText) return null;
  } else if (typeof msg.content !== "string") {
    return null;
  }
  return typeof obj.timestamp === "string" ? new Date(obj.timestamp) : null;
}

function readTranscripts(): DayCounts {
  const counts: DayCounts = new Map();
  if (!existsSync(PROJECTS_DIR)) return counts;
  for (const file of walkJsonl(PROJECTS_DIR)) {
    let content: string;
    try {
      content = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const line of content.split(/\r?\n/)) {
      const ts = transcriptPromptTime(line);
      if (ts) bump(counts, ts);
    }
  }
  return counts;
}

function readHistory(): DayCounts {
  const counts: DayCounts = new Map();
  if (!existsSync(HISTORY_FILE)) return counts;
  for (const line of readFileSync(HISTORY_FILE, "utf8").split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      const { timestamp } = JSON.parse(line) as { timestamp?: number };
      if (typeof timestamp === "number") bump(counts, new Date(timestamp));
    } catch {}
  }
  return counts;
}

function main(): void {
  const t3 = readT3();
  const transcripts = readTranscripts();
  const history = readHistory();

  const t3Start = [...t3.keys()].sort()[0];
  const perDay: DayCounts = new Map(t3);
  let fallbackDays = 0;
  for (const key of new Set([...transcripts.keys(), ...history.keys()])) {
    if (t3Start && key >= t3Start) continue;
    perDay.set(key, Math.max(transcripts.get(key) ?? 0, history.get(key) ?? 0));
    fallbackDays++;
  }

  const totalPrompts = [...perDay.values()].reduce((a, b) => a + b, 0);
  const firstDate = [...perDay.keys()].sort()[0] ?? null;

  // Grid ends on this Saturday and starts on the Sunday 53 weeks earlier.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setDate(end.getDate() + (6 - today.getDay()));
  const start = new Date(end);
  start.setDate(start.getDate() - (WEEKS * 7 - 1));

  const todayKey = toLocalDateKey(today);
  const cells: Cell[] = [];
  let maxDaily = 0;
  let activeDays = 0;
  let streak = 0;
  let longestStreak = 0;

  const cursor = new Date(start);
  for (let i = 0; i < WEEKS * 7; i++) {
    const key = toLocalDateKey(cursor);
    if (key > todayKey) {
      cells.push({ date: key, count: 0, future: true });
    } else {
      const count = perDay.get(key) ?? 0;
      cells.push({ date: key, count });
      maxDaily = Math.max(maxDaily, count);
      if (count > 0) {
        activeDays++;
        streak++;
        longestStreak = Math.max(longestStreak, streak);
      } else {
        streak = 0;
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
    firstDate,
    windowPrompts,
    totalPrompts,
    maxDaily,
    activeDays,
    longestStreak,
    cells,
  };

  mkdirSync(join(process.cwd(), "app", "data"), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(out) + "\n", "utf8");

  console.log(`T3: ${t3.size} days from ${t3Start ?? "n/a"}. Fallback filled ${fallbackDays} earlier days.`);
  console.log(`Lifetime: ${totalPrompts.toLocaleString()} prompts since ${firstDate}.`);
  console.log(
    `Window ${out.startDate} → ${out.endDate}: ${windowPrompts.toLocaleString()} prompts, ${activeDays} active days, max ${maxDaily}/day, longest streak ${longestStreak}.`,
  );
}

main();
