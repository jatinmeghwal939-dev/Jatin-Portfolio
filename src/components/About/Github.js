import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";

const USERNAME = "jatinmeghwal2005";
const MONTHS   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

// ── Color scale matching portfolio purple #c084f5 ────────────────────
function getColor(count) {
  if (!count || count === 0) return "rgba(255,255,255,0.07)";
  if (count === 1)  return "rgba(192,132,245,0.30)";
  if (count <= 3)   return "rgba(192,132,245,0.55)";
  if (count <= 6)   return "rgba(192,132,245,0.80)";
  return "#c084f5";
}

// ── UTC midnight timestamp (matches LeetCode's keys) ─────────────────
function toUTCts(date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 1000);
}

// ── Build 52-week Sun→Sat grid ending today ───────────────────────────
function buildWeeks() {
  const today = new Date(); today.setHours(0,0,0,0);
  const start = new Date(today);
  start.setDate(today.getDate() - 363);
  start.setDate(start.getDate() - start.getDay()); // snap to Sunday
  const weeks = [];
  const cur   = new Date(start);
  while (cur <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) { week.push(new Date(cur)); cur.setDate(cur.getDate()+1); }
    weeks.push(week);
  }
  return weeks;
}

// ── LeetCode GraphQL query via CORS proxy ────────────────────────────
const GQL_QUERY = `
  query userCal($username: String!, $year: Int) {
    matchedUser(username: $username) {
      userCalendar(year: $year) {
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }
`;

async function fetchCalendarYear(year) {
  // Primary: corsproxy.io  →  LeetCode GraphQL
  const PROXY = "https://corsproxy.io/?url=";
  const GQL   = "https://leetcode.com/graphql/";

  const res = await fetch(PROXY + encodeURIComponent(GQL), {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify({ query: GQL_QUERY, variables: { username: USERNAME, year } }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json?.data?.matchedUser?.userCalendar ?? null;
}

// ── Component ────────────────────────────────────────────────────────
export default function LeetCode() {
  const [submissions, setSubmissions] = useState({});
  const [streak,      setStreak]      = useState(null);
  const [totalActive, setTotalActive] = useState(null);
  const [totalSubs,   setTotalSubs]   = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [tooltip,     setTooltip]     = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const cur  = new Date().getFullYear();
        const prev = cur - 1;

        // Fetch both years in parallel
        const [cal1, cal2] = await Promise.all([
          fetchCalendarYear(cur),
          fetchCalendarYear(prev),
        ]);

        const merged = {
          ...(cal2?.submissionCalendar ? JSON.parse(cal2.submissionCalendar) : {}),
          ...(cal1?.submissionCalendar ? JSON.parse(cal1.submissionCalendar) : {}),
        };

        setSubmissions(merged);
        setStreak(cal1?.streak ?? 0);
        setTotalActive(cal1?.totalActiveDays ?? 0);
        setTotalSubs(Object.values(merged).reduce((a, b) => a + b, 0));
      } catch (e) {
        console.error("LeetCode fetch error:", e);
        setError("Could not load LeetCode data. The API may be unavailable.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Layout ────────────────────────────────────────────────────────
  const CELL = 13, GAP = 3, STEP = CELL + GAP;
  const LEFT  = 28, TOP = 22;

  const weeks   = buildWeeks();
  const today   = new Date(); today.setHours(0,0,0,0);

  // Month label positions (first week of each month)
  const monthLabels = [];
  weeks.forEach((week, wi) => {
    if (week[0].getDate() <= 7)
      monthLabels.push({ label: MONTHS[week[0].getMonth()], col: wi });
  });

  const svgW = weeks.length * STEP + LEFT;
  const svgH = 7 * STEP + TOP;

  return (
    <Row style={{ justifyContent: "center", paddingBottom: "40px", color: "white" }}>

      <h1 className="project-heading" style={{ paddingBottom: "20px", textAlign: "center", width: "100%" }}>
        My <strong className="purple">LeetCode</strong> Activity
      </h1>

      {/* ── Loading ── */}
      {loading && (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <div style={s.spinner} />
          <p style={{ color: "#c084f5", marginTop: "16px", fontSize: "14px" }}>
            Fetching your LeetCode data…
          </p>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div style={{ textAlign: "center", padding: "30px", color: "#ff7b7b" }}>
          ⚠️ {error}
          <br/>
          <a href={`https://leetcode.com/u/${USERNAME}/`} target="_blank" rel="noreferrer"
             style={{ color: "#c084f5", marginTop: "10px", display: "inline-block" }}>
            View profile on LeetCode →
          </a>
        </div>
      )}

      {/* ── Content ── */}
      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: "24px" }}>

          {/* Stats cards */}
          <div style={s.statsRow}>
            {[
              { label: "Total Submissions", value: totalSubs   },
              { label: "Active Days",        value: totalActive },
              { label: "Current Streak",     value: `${streak} day${streak !== 1 ? "s" : ""}` },
            ].map(({ label, value }) => (
              <div key={label} style={s.card}>
                <div style={s.cardVal}>{value}</div>
                <div style={s.cardLbl}>{label}</div>
              </div>
            ))}
          </div>

          {/* Heatmap SVG */}
          <div style={{ overflowX: "auto", maxWidth: "100%", padding: "0 8px" }}>
            <svg
              width={svgW} height={svgH}
              style={{ display: "block" }}
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Month labels */}
              {monthLabels.map(({ label, col }) => (
                <text key={`m${col}`} x={col * STEP + LEFT} y={13}
                  fill="#777" fontSize="10" fontFamily="inherit">{label}</text>
              ))}

              {/* Day labels (Mon / Wed / Fri) */}
              {DAY_LABELS.map((day, di) => day ? (
                <text key={`d${di}`} x={2} y={di * STEP + TOP + CELL/2 + 1}
                  fill="#666" fontSize="9" fontFamily="inherit" dominantBaseline="middle">{day}</text>
              ) : null)}

              {/* Cells */}
              {weeks.map((week, wi) =>
                week.map((date, di) => {
                  const ts     = toUTCts(date);
                  const count  = submissions[ts] || 0;
                  const future = date > today;
                  return (
                    <rect
                      key={`${wi}-${di}`}
                      x={wi * STEP + LEFT} y={di * STEP + TOP}
                      width={CELL} height={CELL} rx={2.5} ry={2.5}
                      fill={future ? "transparent" : getColor(count)}
                      style={{ cursor: future ? "default" : "pointer" }}
                      onMouseEnter={e => {
                        if (!future) setTooltip({
                          x: e.clientX, y: e.clientY, count,
                          date: date.toLocaleDateString("en-US",
                            { weekday:"short", month:"short", day:"numeric", year:"numeric" }),
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })
              )}
            </svg>

            {/* Legend */}
            <div style={s.legend}>
              <span style={s.legendTxt}>Less</span>
              {[0, 1, 2, 4, 7].map((v, i) => (
                <div key={i} style={{ width: CELL, height: CELL, background: getColor(v),
                  borderRadius: "2.5px", border: "1px solid rgba(255,255,255,0.06)" }} />
              ))}
              <span style={s.legendTxt}>More</span>
            </div>
          </div>

          {/* Profile link */}
          <a href={`https://leetcode.com/u/${USERNAME}/`} target="_blank" rel="noreferrer"
             style={s.link}>
            View full profile on LeetCode →
          </a>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div style={{ ...s.tooltip, left: tooltip.x + 14, top: tooltip.y - 50 }}>
          <span style={{ color: "#c084f5", fontWeight: 700 }}>
            {tooltip.count} submission{tooltip.count !== 1 ? "s" : ""}
          </span><br/>
          <span style={{ color: "#bbb", fontSize: "11px" }}>{tooltip.date}</span>
        </div>
      )}
    </Row>
  );
}

// ── Stylesheet ────────────────────────────────────────────────────────
const s = {
  statsRow: { display:"flex", gap:"18px", flexWrap:"wrap", justifyContent:"center" },
  card: {
    background: "rgba(192,132,245,0.08)",
    border: "1px solid rgba(192,132,245,0.28)",
    borderRadius: "14px", padding: "14px 26px",
    textAlign: "center", minWidth: "120px",
    backdropFilter: "blur(6px)",
  },
  cardVal: { fontSize: "1.7em", fontWeight: "700", color: "#c084f5", lineHeight: 1.1 },
  cardLbl: { fontSize: "0.72em", color: "#888", marginTop: "5px", letterSpacing: "0.02em" },
  legend:  { display:"flex", alignItems:"center", gap:"5px", justifyContent:"flex-end",
              marginTop:"8px", paddingRight:"2px" },
  legendTxt: { fontSize:"10px", color:"#666" },
  link: { color:"#c084f5", fontSize:"13px", textDecoration:"none", opacity:0.8 },
  tooltip: {
    position: "fixed",
    background: "rgba(15,12,25,0.96)",
    border: "1px solid rgba(192,132,245,0.45)",
    borderRadius: "8px", padding: "7px 13px",
    fontSize: "12px", color: "white",
    pointerEvents: "none", zIndex: 9999,
    whiteSpace: "nowrap",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  },
  spinner: {
    width: "36px", height: "36px",
    border: "3px solid rgba(192,132,245,0.15)",
    borderTop: "3px solid #c084f5",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
    margin: "0 auto",
  },
};
