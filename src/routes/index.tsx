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
      {/* Ambient light wash */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/3 h-[520px] w-[520px] rounded-full opacity-[0.08] blur-3xl"
          style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 60%)" }}
        />
        <div
          className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full opacity-[0.05] blur-3xl"
          style={{ background: "radial-gradient(circle, #D9D9D9 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative flex min-h-screen">
        <Sidebar />

        <main className="flex-1 min-w-0">
          <TopBar />
          <div className="px-10 py-10 space-y-12 max-w-[1400px]">
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
    <aside className="w-[260px] shrink-0 border-r border-border/80 bg-[#0B0B0B]/60 backdrop-blur-xl sticky top-0 h-screen flex flex-col">
      <div className="px-6 pt-7 pb-8">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md border border-border flex items-center justify-center bg-card">
            <MoonStar className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-medium tracking-tight">Atelier</div>
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted">Production OS</div>
          </div>
        </div>
      </div>

      <nav className="px-3 space-y-0.5">
        {nav.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`group w-full flex items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors duration-200 ${
              active
                ? "bg-card text-foreground border border-border"
                : "text-secondary hover:text-foreground hover:bg-card/60"
            }`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span className="font-medium">{label}</span>
            {active && <CircleDot className="ml-auto h-3 w-3 text-accent" strokeWidth={1.5} />}
          </button>
        ))}
      </nav>

      <div className="mt-10 px-6">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3">Studios</div>
        <ul className="space-y-2 text-[12.5px]">
          {["Paris — HQ", "Milano", "Los Angeles", "Tokyo"].map((s, i) => (
            <li key={s} className="flex items-center gap-2.5 text-secondary">
              <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-white" : "bg-[#404040]"}`} />
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-lg border border-border bg-card p-3.5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#0e0e0e] border border-border" />
            <div className="min-w-0">
              <div className="text-[12.5px] font-medium truncate">Élise Marchand</div>
              <div className="text-[11px] text-muted truncate">Executive Producer</div>
            </div>
            <Settings className="ml-auto h-3.5 w-3.5 text-muted" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------ TopBar ----------------------------------- */

function TopBar() {
  return (
    <div className="sticky top-0 z-30 border-b border-border/80 bg-background/70 backdrop-blur-xl">
      <div className="flex items-center gap-6 px-10 py-4">
        <div className="flex items-center gap-2 text-[12px] text-muted">
          <span>Workspace</span>
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
          <span className="text-secondary">Atelier</span>
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
          <span className="text-foreground">Overview</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-2.5 rounded-md border border-border bg-card/60 px-3 py-1.5 text-[12px] text-secondary hover:text-foreground hover:bg-card transition-colors">
            <Search className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>Search productions, talent, files…</span>
            <span className="ml-8 flex items-center gap-1 text-[10.5px] text-muted">
              <Command className="h-3 w-3" strokeWidth={1.5} />K
            </span>
          </button>
          <button className="flex items-center gap-2 rounded-md bg-foreground text-background px-3.5 py-1.5 text-[12px] font-medium hover:bg-accent transition-colors">
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
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
    <section className="grid grid-cols-12 gap-8 items-end">
      <div className="col-span-8">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted mb-5">
          <span className="h-px w-8 bg-border" />
          Quarterly overview · Q2 2026
        </div>
        <h1 className="text-[56px] leading-[1.02] font-light tracking-[-0.03em]">
          Good evening, Élise.
          <br />
          <span className="text-secondary">Twelve productions in motion,</span>
          <br />
          <span className="text-muted">three awaiting your sign-off.</span>
        </h1>
      </div>
      <div className="col-span-4 flex flex-col items-end gap-3">
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted">Studio time</div>
        <div className="text-[42px] font-light tracking-tight tabular-nums">
          21:47<span className="text-muted text-[20px] ml-1">CET</span>
        </div>
        <div className="text-[12px] text-secondary">Paris · Thursday, June 11</div>
      </div>
    </section>
  );
}

/* --------------------------------- Metrics row -------------------------------- */

function MetricsRow() {
  const metrics = [
    { label: "Active productions", value: "12", delta: "+2 this week", tone: "up" },
    { label: "Revenue · committed", value: "€4.82M", delta: "+18.4%", tone: "up" },
    { label: "Crew utilisation", value: "84%", delta: "Optimal range", tone: "flat" },
    { label: "Delivery on-time", value: "97.2%", delta: "+1.1 pts", tone: "up" },
  ];
  return (
    <section className="grid grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border">
      {metrics.map((m) => (
        <div key={m.label} className="bg-card p-6 group hover:bg-[#1a1a1a] transition-colors duration-300">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">{m.label}</div>
          <div className="mt-4 text-[34px] font-light tracking-tight tabular-nums">{m.value}</div>
          <div className="mt-3 flex items-center gap-1.5 text-[11.5px] text-secondary">
            {m.tone === "up" && <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />}
            {m.delta}
          </div>
        </div>
      ))}
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
      <SectionHeader title="Productions in motion" caption="12 active · 3 awaiting sign-off" />
      <div className="grid grid-cols-2 gap-5">
        {productions.map((p) => (
          <article
            key={p.code}
            className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-[#333] hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10.5px] font-mono uppercase tracking-[0.18em] text-muted">{p.code}</div>
                <h3 className="mt-2 text-[19px] font-medium tracking-tight">{p.title}</h3>
                <div className="text-[12.5px] text-secondary mt-1">{p.client}</div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity rounded-md border border-border h-7 w-7 flex items-center justify-center text-secondary hover:text-foreground">
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[11px]">
              <span className="rounded-full border border-border px-2.5 py-0.5 text-secondary">
                {p.stage}
              </span>
              <span className="text-muted">·</span>
              <span className="text-muted">{p.days}</span>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="text-muted uppercase tracking-[0.18em]">Progress</span>
                <span className="text-secondary tabular-nums">{p.progress}%</span>
              </div>
              <div className="h-px bg-border relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-foreground"
                  style={{ width: `${p.progress}%`, height: "1px" }}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex -space-x-1.5">
                {Array.from({ length: Math.min(p.crew, 5) }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-6 rounded-full border border-[#0a0a0a]"
                    style={{
                      background: `linear-gradient(135deg, oklch(${0.25 + i * 0.05} 0 0), oklch(${0.12 + i * 0.03} 0 0))`,
                    }}
                  />
                ))}
                {p.crew > 5 && (
                  <div className="h-6 w-6 rounded-full border border-[#0a0a0a] bg-[#1f1f1f] text-[10px] flex items-center justify-center text-secondary">
                    +{p.crew - 5}
                  </div>
                )}
              </div>
              <div className="text-[11px] text-muted">{p.crew} crew</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- Schedule + Activity row -------------------------- */

function ScheduleAndActivity() {
  return (
    <section className="grid grid-cols-12 gap-5 pb-6">
      <div className="col-span-7 rounded-xl border border-border bg-card p-6">
        <SectionHeader title="This week" caption="Paris · Milano · LA" inline />
        <div className="mt-5 divide-y divide-border">
          {[
            { day: "Thu 11", time: "08:00 — 18:00", title: "Porsche · Studio A — Color grading", loc: "Paris HQ", tag: "Studio" },
            { day: "Fri 12", time: "06:30 — 22:00", title: "Hermès · Carré 90 — Location shoot", loc: "Camargue", tag: "On location" },
            { day: "Sat 13", time: "10:00 — 13:00", title: "Apple · Silence — Director review", loc: "Remote", tag: "Review" },
            { day: "Mon 15", time: "09:00 — 19:00", title: "Dior · FW26 — Casting", loc: "Milano", tag: "Pre-prod" },
          ].map((e) => (
            <div key={e.title} className="py-4 flex items-center gap-5 group">
              <div className="w-14 shrink-0">
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted">{e.day.split(" ")[0]}</div>
                <div className="text-[22px] font-light tracking-tight tabular-nums">{e.day.split(" ")[1]}</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-medium tracking-tight">{e.title}</div>
                <div className="text-[11.5px] text-muted mt-0.5 tabular-nums">{e.time} · {e.loc}</div>
              </div>
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-secondary border border-border rounded-full px-2.5 py-1">
                {e.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-5 rounded-xl border border-border bg-card p-6">
        <SectionHeader title="Signal" caption="Last 24 hours" inline />
        <ul className="mt-5 space-y-5">
          {[
            { icon: Camera, who: "Léon B.", what: "uploaded 142 frames to", target: "Porsche — 911 GTS", time: "12m ago" },
            { icon: Film, who: "Margaux T.", what: "locked the cut on", target: "Apple — Silence", time: "1h ago" },
            { icon: Users, who: "Casting", what: "shortlisted 8 talents for", target: "Dior FW26", time: "3h ago" },
            { icon: Sparkles, who: "Élise M.", what: "approved budget revision on", target: "Hermès — Carré 90", time: "5h ago" },
          ].map((a, i) => {
            const Icon = a.icon;
            return (
              <li key={i} className="flex gap-3.5">
                <div className="h-7 w-7 shrink-0 rounded-md border border-border bg-[#1a1a1a] flex items-center justify-center">
                  <Icon className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] text-secondary leading-relaxed">
                    <span className="text-foreground font-medium">{a.who}</span> {a.what}{" "}
                    <span className="text-foreground">{a.target}</span>
                  </div>
                  <div className="text-[11px] text-muted mt-0.5">{a.time}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------- Small atoms --------------------------------- */

function SectionHeader({
  title,
  caption,
  inline = false,
}: {
  title: string;
  caption?: string;
  inline?: boolean;
}) {
  return (
    <div className={`flex items-end justify-between ${inline ? "" : "mb-6"}`}>
      <div>
        <h2 className="text-[20px] font-light tracking-tight">{title}</h2>
        {caption && <div className="text-[11.5px] text-muted mt-0.5">{caption}</div>}
      </div>
      {!inline && (
        <button className="text-[11.5px] text-secondary hover:text-foreground flex items-center gap-1 transition-colors">
          View all <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border mt-16 px-10 py-6 flex items-center justify-between text-[11px] text-muted">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]/60" />
        All systems quiet · Synced 21:46 CET
      </div>
      <div className="tracking-[0.2em] uppercase">Atelier · v4.12 · Paris</div>
    </footer>
  );
}
