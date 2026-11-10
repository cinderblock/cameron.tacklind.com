import activity from "../data/claude-activity.json";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Cell = { date: string; count: number; future?: boolean };

function level(count: number, max: number): number {
  if (count === 0) return 0;
  const r = count / max;
  if (r < 0.15) return 1;
  if (r < 0.35) return 2;
  if (r < 0.65) return 3;
  return 4;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d);
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function formatMonth(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export function ActivityHeatmap() {
  const cells = activity.cells as Cell[];
  const max = Math.max(1, activity.maxDaily);

  const weeks: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  // Month label appears above the first week where the month starts.
  const monthLabels: (string | null)[] = weeks.map((week, i) => {
    const [, mm] = week[0].date.split("-").map(Number);
    if (i === 0) return MONTHS[(mm ?? 1) - 1];
    const prev = weeks[i - 1][0].date.split("-").map(Number);
    return mm !== prev[1] ? MONTHS[(mm ?? 1) - 1] : null;
  });

  const generated = new Date(activity.generatedAt);
  const loggedSince = activity.firstDate
    ? formatMonth(activity.firstDate)
    : "recently";

  return (
    <div className="heatmap" aria-label="Weekly Claude prompt activity, last 53 weeks">
      <div className="heatmap-chart">
        <div className="heatmap-months" aria-hidden="true">
          {monthLabels.map((label, i) => (
            <span key={i} className="heatmap-month">{label}</span>
          ))}
        </div>
        <div className="heatmap-body">
          <div className="heatmap-days" aria-hidden="true">
            <span />
            <span>Mon</span>
            <span />
            <span>Wed</span>
            <span />
            <span>Fri</span>
            <span />
          </div>
          <div className="heatmap-grid" role="grid">
            {weeks.map((week, wi) => (
              <div key={wi} className="heatmap-col" role="row">
                {week.map((cell) => (
                  <div
                    key={cell.date}
                    role="gridcell"
                    className={`heatmap-cell lvl-${level(cell.count, max)}${cell.future ? " future" : ""}`}
                    title={cell.future
                      ? formatDate(cell.date)
                      : `${cell.count} prompt${cell.count === 1 ? "" : "s"} on ${formatDate(cell.date)}`}
                    aria-label={cell.future
                      ? `${formatDate(cell.date)} — future`
                      : `${cell.count} prompts on ${formatDate(cell.date)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="heatmap-stats">
        <div className="heatmap-stat">
          <strong>{activity.windowPrompts.toLocaleString()}</strong>
          <span>prompts</span>
        </div>
        <div className="heatmap-stat">
          <strong>{activity.activeDays}</strong>
          <span>active days</span>
        </div>
        <div className="heatmap-stat">
          <strong>{activity.maxDaily.toLocaleString()}</strong>
          <span>peak day</span>
        </div>
        <div className="heatmap-stat">
          <strong>{activity.longestStreak}</strong>
          <span>day streak</span>
        </div>
      </div>

      <div className="heatmap-legend">
        <span className="heatmap-legend-label">Less</span>
        <span className="heatmap-cell lvl-0" aria-hidden="true" />
        <span className="heatmap-cell lvl-1" aria-hidden="true" />
        <span className="heatmap-cell lvl-2" aria-hidden="true" />
        <span className="heatmap-cell lvl-3" aria-hidden="true" />
        <span className="heatmap-cell lvl-4" aria-hidden="true" />
        <span className="heatmap-legend-label">More</span>
        <span className="heatmap-generated" title={generated.toISOString()}>
          Updated {generated.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </span>
      </div>

      <p className="heatmap-note">
        My logs only go back to {loggedSince}. The real story starts earlier: I went all in on
        Cursor around the start of 2025, and I haven't really looked at code myself since late 2025.
      </p>
    </div>
  );
}
