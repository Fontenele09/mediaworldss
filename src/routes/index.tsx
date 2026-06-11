import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Calendar,
  Camera,
  ChevronRight,
  CircleDot,
  Clapperboard,
  Command,
  Film,
  Layers,
  MoonStar,
  Search,
  Settings,
  Sparkles,
  Users,
  Plus,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atelier — Audiovisual Production OS" },
      { name: "description", content: "A quiet operating system for premium audiovisual production studios." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Ambient atmospheric wash */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-60 left-1/4 h-[640px] w-[640px] rounded-full opacity-[0.07] blur-3xl"
          style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 60%)" }}
        />
        <div
          className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full opacity-[0.04] blur-3xl"
          style={{ background: "radial-gradient(circle, #D9D9D9 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative flex min-h-screen">
        <Sidebar />

        <main className="flex-1 min-w-0">
          <TopBar />
          <div className="px-10 py-12 space-y-16 max-w-[1400px]">
            <Hero />
            <MetricsRow />
            <ProductionGrid />
            <ScheduleAndActivity />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

/* ----------------------------------- Sidebar ----------------------------------- */

function Sidebar() {
  const nav = [
    { icon: Layers, label: "Overview", active: true },
    { icon: Clapperboard, label: "Productions" },
    { icon: Calendar, label: "Schedule" },
    { icon: Users, label: "Talent" },
    { icon: Film, label: "Library" },
    { icon: Sparkles, label: "Insights" },
  ];

  return (
    <aside className="w-[260px] shrink-0 border-r border-border bg-[#080808]/80 backdrop-blur-2xl sticky top-0 h-screen flex flex-col">
      <div className="px-6 pt-7 pb-8">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg border border-border flex items-center justify-center bg-gradient-to-br from-[#1f1f1f] to-[#0e0e0e] shadow-[0_4px_12px_-4px_rgba(0,0,0,0.8)]">
            <MoonStar className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold tracking-tight">Atelier</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">Production OS</div>
          </div>
        </div>
      </div>

      <nav className="px-3 space-y-1">
        {nav.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`group w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200 ${
              active
                ? "bg-gradient-to-r from-[#1f1f1f] to-[#181818] text-foreground border border-border shadow-[0_2px_8px_-2px_rgba(0,0,0,0.6)]"
                : "text-secondary hover:text-foreground hover:bg-card/50 border border-transparent"
            }`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span className="font-medium">{label}</span>
            {active && <CircleDot className="ml-auto h-3 w-3 text-accent" strokeWidth={1.5} />}
          </button>
        ))}
      </nav>

      <div className="mt-12 px-6">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted mb-4 font-medium">Studios</div>
        <ul className="space-y-2.5 text-[12.5px]">
          {[
            { name: "Paris — HQ", active: true },
            { name: "Milano" },
            { name: "Los Angeles" },
            { name: "Tokyo" },
          ].map((s) => (
            <li key={s.name} className="flex items-center gap-2.5 text-secondary">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  s.active ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "bg-[#3a3a3a]"
                }`}
              />
              {s.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-xl border border-border bg-gradient-to-b from-[#1a1a1a] to-[#131313] p-3.5 shadow-[0_8px_20px_-12px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#3a3a3a] to-[#0e0e0e] border border-border shrink-0" />
            <div className="min-w-0">
              <div className="text-[12.5px] font-medium truncate">Élise Marchand</div>
              <div className="text-[11px] text-muted truncate">Executive Producer</div>
            </div>
            <Settings className="ml-auto h-3.5 w-3.5 text-muted shrink-0" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------ TopBar ----------------------------------- */

function TopBar() {
  return (
    <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-2xl">
      <div className="flex items-center gap-6 px-10 py-4">
        <div className="flex items-center gap-2 text-[12px] text-muted">
          <span>Workspace</span>
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
          <span className="text-secondary">Atelier</span>
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
          <span className="text-foreground font-medium">Overview</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-2.5 rounded-lg border border-border bg-card/60 px-3.5 py-2 text-[12px] text-secondary hover:text-foreground hover:bg-card hover:border-[#3a3a3a] transition-all">
            <Search className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>Search productions, talent, files…</span>
            <span className="ml-10 flex items-center gap-1 text-[10.5px] text-muted border border-border rounded px-1.5 py-0.5">
              <Command className="h-2.5 w-2.5" strokeWidth={1.5} />K
            </span>
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-b from-white to-[#e5e5e5] text-background px-4 py-2 text-[12px] font-semibold hover:from-white hover:to-white transition-all shadow-[0_4px_14px_-4px_rgba(255,255,255,0.2)]">
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            New production
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------- Hero ------------------------------------ */

function Hero() {
  return (
    <section className="grid grid-cols-12 gap-8 items-end pb-2">
      <div className="col-span-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#3a3a3a] to-transparent" />
          <span className="text-[10.5px] uppercase tracking-[0.24em] text-muted font-medium">
            Quarterly overview · Q2 2026
          </span>
        </div>
        <h1 className="text-[60px] leading-[1.02] font-light tracking-[-0.035em]">
          Good evening, Élise.
          <br />
          <span className="text-secondary">Twelve productions in motion,</span>
          <br />
          <span className="text-muted">three awaiting your sign-off.</span>
        </h1>
      </div>
      <div className="col-span-4 flex flex-col items-end gap-3">
        <div className="text-[10.5px] uppercase tracking-[0.24em] text-muted font-medium">Studio time</div>
        <div className="text-[48px] font-extralight tracking-tight tabular-nums leading-none">
          21:47<span className="text-muted text-[22px] ml-1.5 font-light">CET</span>
        </div>
        <div className="text-[12px] text-secondary">Paris · Thursday, June 11</div>
      </div>
    </section>
  );
}

/* --------------------------------- Metrics row -------------------------------- */

function MetricsRow() {
  const metrics = [
    { label: "Active productions", value: "12", delta: "+2 this week", tone: "up", emphasis: true },
    { label: "Revenue · committed", value: "€4.82M", delta: "+18.4%", tone: "up" },
    { label: "Crew utilisation", value: "84%", delta: "Optimal range", tone: "flat" },
    { label: "Delivery on-time", value: "97.2%", delta: "+1.1 pts", tone: "up" },
  ];
  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.22em] text-muted font-medium mb-2">Key metrics</div>
          <h2 className="text-[22px] font-light tracking-tight">Studio at a glance</h2>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="group relative rounded-2xl border border-border p-6 transition-all duration-500 hover:border-[#3a3a3a] hover:-translate-y-1 overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.21 0 0) 0%, oklch(0.155 0 0) 100%)",
              boxShadow:
                "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 20px 50px -25px rgba(0,0,0,0.9)",
            }}
          >
            {/* Top accent */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="flex items-center justify-between">
              <div className="text-[10.5px] uppercase tracking-[0.2em] text-muted font-medium">{m.label}</div>
              <TrendingUp className="h-3 w-3 text-muted opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
            </div>

            <div className="mt-5 text-[40px] font-extralight tracking-[-0.02em] tabular-nums leading-none text-foreground">
              {m.value}
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-[11.5px]">
              {m.tone === "up" && <ArrowUpRight className="h-3 w-3 text-[#a8d4a8]" strokeWidth={1.5} />}
              <span className={m.tone === "up" ? "text-[#a8d4a8]" : "text-secondary"}>{m.delta}</span>
            </div>

            {/* Hover glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.06), transparent 60%)",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- Production grid ------------------------------ */

const productions = [
  {
    code: "HRMS · 04",
    title: "Hermès — Carré 90",
    client: "Maison Hermès",
    stage: "Post-production",
    progress: 72,
    days: "Delivery in 14 days",
    crew: 8,
  },
  {
    code: "PRSH · 11",
    title: "Porsche — 911 Carrera GTS",
    client: "Porsche AG",
    stage: "Principal photography",
    progress: 41,
    days: "Day 6 of 14",
    crew: 24,
  },
  {
    code: "DIOR · 02",
    title: "Dior — Haute Couture FW26",
    client: "Christian Dior",
    stage: "Pre-production",
    progress: 18,
    days: "Shoot in 22 days",
    crew: 12,
  },
  {
    code: "APPL · 07",
    title: "Apple — Silence, A Film",
    client: "Apple Originals",
    stage: "Edit · Director cut",
    progress: 88,
    days: "Lock in 4 days",
    crew: 6,
  },
];

function ProductionGrid() {
  return (
    <section>
      <SectionHeader
        eyebrow="Operations"
        title="Productions in motion"
        caption="12 active · 3 awaiting sign-off"
      />
      <div className="grid grid-cols-2 gap-5">
        {productions.map((p) => (
          <article
            key={p.code}
            className="group relative rounded-2xl border border-border bg-card p-7 overflow-hidden transition-all duration-500 hover:border-[#3a3a3a] hover:-translate-y-1"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0) 60%)",
              boxShadow:
                "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 32px -16px rgba(0,0,0,0.7)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[10.5px] font-mono uppercase tracking-[0.18em] text-muted">{p.code}</div>
                <h3 className="mt-2 text-[20px] font-medium tracking-[-0.015em] leading-tight">{p.title}</h3>
                <div className="text-[12.5px] text-secondary mt-1">{p.client}</div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-all rounded-lg border border-border bg-[#1f1f1f] h-8 w-8 flex items-center justify-center text-secondary hover:text-foreground hover:bg-[#262626] shrink-0">
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[11px]">
              <span className="rounded-full border border-border bg-[#1f1f1f] px-2.5 py-1 text-secondary font-medium">
                {p.stage}
              </span>
              <span className="text-muted">·</span>
              <span className="text-muted">{p.days}</span>
            </div>

            <div className="mt-7">
              <div className="flex items-center justify-between text-[11px] mb-2.5">
                <span className="text-muted uppercase tracking-[0.18em] font-medium">Progress</span>
                <span className="text-foreground tabular-nums font-medium">{p.progress}%</span>
              </div>
              <div className="h-[2px] bg-[#1f1f1f] rounded-full relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${p.progress}%`,
                    background: "linear-gradient(90deg, #737373, #ffffff)",
                  }}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex -space-x-2">
                {Array.from({ length: Math.min(p.crew, 5) }).map((_, i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full border-2 border-card shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                    style={{
                      background: `linear-gradient(135deg, oklch(${0.3 + i * 0.05} 0 0), oklch(${0.13 + i * 0.03} 0 0))`,
                    }}
                  />
                ))}
                {p.crew > 5 && (
                  <div className="h-7 w-7 rounded-full border-2 border-card bg-[#262626] text-[10px] flex items-center justify-center text-secondary font-medium">
                    +{p.crew - 5}
                  </div>
                )}
              </div>
              <div className="text-[11px] text-muted">{p.crew} crew</div>
            </div>

            {/* Soft hover glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background:
                  "radial-gradient(600px circle at 50% -10%, rgba(255,255,255,0.04), transparent 50%)",
              }}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- Schedule + Activity row -------------------------- */

function ScheduleAndActivity() {
  return (
    <section>
      <SectionHeader eyebrow="This week" title="Schedule & signal" caption="Paris · Milano · LA · Tokyo" />
      <div className="grid grid-cols-12 gap-5 pb-6">
        <div
          className="col-span-7 rounded-2xl border border-border bg-card p-7"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 50%)",
            boxShadow:
              "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 32px -16px rgba(0,0,0,0.7)",
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[16px] font-medium tracking-tight">Upcoming this week</h3>
            <span className="text-[11px] text-muted">4 events</span>
          </div>
          <div className="text-[11.5px] text-muted mb-5">Across all studios</div>

          <div className="space-y-1 -mx-2">
            {[
              { day: "Thu 11", time: "08:00 — 18:00", title: "Porsche · Studio A — Color grading", loc: "Paris HQ", tag: "Studio" },
              { day: "Fri 12", time: "06:30 — 22:00", title: "Hermès · Carré 90 — Location shoot", loc: "Camargue", tag: "On location" },
              { day: "Sat 13", time: "10:00 — 13:00", title: "Apple · Silence — Director review", loc: "Remote", tag: "Review" },
              { day: "Mon 15", time: "09:00 — 19:00", title: "Dior · FW26 — Casting", loc: "Milano", tag: "Pre-prod" },
            ].map((e, i, arr) => (
              <div
                key={e.title}
                className="flex items-center gap-5 group rounded-xl px-2 py-3.5 hover:bg-[#1f1f1f]/60 transition-colors"
                style={{
                  borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                <div className="w-14 shrink-0">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">{e.day.split(" ")[0]}</div>
                  <div className="text-[24px] font-extralight tracking-tight tabular-nums leading-none mt-1">
                    {e.day.split(" ")[1]}
                  </div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium tracking-tight">{e.title}</div>
                  <div className="text-[11.5px] text-muted mt-1 tabular-nums">{e.time} · {e.loc}</div>
                </div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-secondary border border-border rounded-full px-2.5 py-1 font-medium bg-[#1a1a1a]">
                  {e.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="col-span-5 rounded-2xl border border-border p-7 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.19 0 0) 0%, oklch(0.155 0 0) 100%)",
            boxShadow:
              "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 12px 32px -16px rgba(0,0,0,0.8)",
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[16px] font-medium tracking-tight">Signal</h3>
            <span className="flex items-center gap-1.5 text-[11px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-[#a8d4a8] pulse-soft" />
              Live · last 24h
            </span>
          </div>
          <div className="text-[11.5px] text-muted mb-6">Studio-wide activity</div>

          <ul className="space-y-5">
            {[
              { icon: Camera, who: "Léon B.", what: "uploaded 142 frames to", target: "Porsche — 911 GTS", time: "12m ago" },
              { icon: Film, who: "Margaux T.", what: "locked the cut on", target: "Apple — Silence", time: "1h ago" },
              { icon: Users, who: "Casting", what: "shortlisted 8 talents for", target: "Dior FW26", time: "3h ago" },
              { icon: Sparkles, who: "Élise M.", what: "approved budget revision on", target: "Hermès — Carré 90", time: "5h ago" },
            ].map((a, i) => {
              const Icon = a.icon;
              return (
                <li key={i} className="flex gap-3.5 group">
                  <div className="h-8 w-8 shrink-0 rounded-lg border border-border bg-gradient-to-br from-[#222] to-[#161616] flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.6)]">
                    <Icon className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] text-secondary leading-relaxed">
                      <span className="text-foreground font-medium">{a.who}</span> {a.what}{" "}
                      <span className="text-foreground font-medium">{a.target}</span>
                    </div>
                    <div className="text-[11px] text-muted mt-1">{a.time}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Small atoms --------------------------------- */

function SectionHeader({
  eyebrow,
  title,
  caption,
}: {
  eyebrow?: string;
  title: string;
  caption?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-7">
      <div>
        {eyebrow && (
          <div className="text-[10.5px] uppercase tracking-[0.22em] text-muted font-medium mb-2">
            {eyebrow}
          </div>
        )}
        <h2 className="text-[22px] font-light tracking-[-0.02em]">{title}</h2>
        {caption && <div className="text-[12px] text-muted mt-1">{caption}</div>}
      </div>
      <button className="text-[12px] text-secondary hover:text-foreground flex items-center gap-1 transition-colors group">
        View all
        <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border mt-20 px-10 py-6 flex items-center justify-between text-[11px] text-muted">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#a8d4a8] pulse-soft" />
        All systems quiet · Synced 21:46 CET
      </div>
      <div className="tracking-[0.2em] uppercase font-medium">Atelier · v4.12 · Paris</div>
    </footer>
  );
}
