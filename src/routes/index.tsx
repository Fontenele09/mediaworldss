import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clapperboard,
  Clock,
  Command,
  CreditCard,
  FileText,
  Film,
  LayoutDashboard,
  MessageSquare,
  Phone,
  Plus,
  Search,
  Send,
  Settings,
  TrendingUp,
  Upload,
  UserPlus,
  Users,
  Video,
  Wallet,
  X,
  Pencil,
  Trash2,
  AlertCircle,
  Check,
  Info,
  Save,
  LogOut,
  Lock,
  User,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MW Studio — Media World" },
      { name: "description", content: "Sistema interno de produção audiovisual — Media World." },
    ],
  }),
  component: App,
});

/* ── Tokens ── */
const C = {
  bg: "#0D1612",
  surface: "#141F1A",
  card: "#1A2820",
  border: "#243028",
  hover: "#1F2E28",
  em: "#00C896",
  emDim: "#00C89622",
  emText: "#00C896",
  muted: "#6B8A7E",
  fg: "#E8F0EC",
  fgDim: "#A8C4B8",
  warn: "#F5A623",
  warnDim: "#F5A62322",
  danger: "#FF5252",
  dangerDim: "#FF525222",
  info: "#4A9EFF",
  infoDim: "#4A9EFF22",
};

type Screen =
  | "dashboard"
  | "clientes"
  | "projetos"
  | "pipeline"
  | "agenda"
  | "entregas"
  | "propostas"
  | "financeiro"
  | "mensagens"
  | "configuracoes";
type ProjectStatus = "Pré-produção" | "Gravação" | "Edição" | "Pós-produção" | "Aprovação" | "Entregue";

interface Project {
  id: number;
  name: string;
  client: string;
  status: ProjectStatus;
  deadline: string;
  owner: string;
  progress: number;
}
interface Client {
  id: number;
  name: string;
  project: string;
  status: string;
  last: string;
}
interface Entrega {
  id: number;
  project: string;
  client: string;
  file: string;
  status: string;
  date: string;
  size: string;
  urgent: boolean;
}
interface Proposta {
  id: number;
  title: string;
  client: string;
  value: string;
  status: string;
  date: string;
}
interface Gravacao {
  id: number;
  title: string;
  client: string;
  local: string;
  date: string;
  time: string;
  crew: string;
}
interface Notif {
  id: number;
  text: string;
  type: "info" | "warn" | "alert";
  read: boolean;
  time: string;
}
interface Msg {
  from: string;
  text: string;
  time: string;
}

const STATUS_OPTIONS: ProjectStatus[] = ["Pré-produção", "Gravação", "Edição", "Pós-produção", "Aprovação", "Entregue"];

/* ── Helpers ── */
const inp =
  `w-full rounded-xl border px-3 py-2 text-[13px] outline-none transition-all placeholder:opacity-40` +
  ` bg-[${C.card}] border-[${C.border}] text-[${C.fg}] focus:border-[${C.em}] focus:ring-1 focus:ring-[${C.em}]`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label style={{ color: C.muted }} className="text-[10.5px] font-semibold uppercase tracking-[0.14em]">
        {label}
      </label>
      {children}
    </div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center text-[10.5px] font-semibold rounded-full px-2.5 py-0.5 border"
      style={{ background: `${color}18`, color, borderColor: `${color}35` }}
    >
      {label}
    </span>
  );
}

function statusColor(s: string) {
  const m: Record<string, string> = {
    "Pré-produção": C.muted,
    Gravação: C.warn,
    Edição: C.info,
    "Pós-produção": "#A78BFA",
    Aprovação: C.warn,
    Entregue: C.em,
  };
  return m[s] || C.muted;
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: C.border }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${C.em}, #00E8B0)` }}
        />
      </div>
      <span className="text-[11px] tabular-nums w-8 text-right" style={{ color: C.fgDim }}>
        {value}%
      </span>
    </div>
  );
}

/* ── Initial data ── */
const initProjects: Project[] = [
  {
    id: 1,
    name: "Hermès — Carré 90",
    client: "Maison Hermès",
    status: "Pós-produção",
    deadline: "25 jun",
    owner: "Léon B.",
    progress: 72,
  },
  {
    id: 2,
    name: "Porsche 911 GTS",
    client: "Porsche AG",
    status: "Gravação",
    deadline: "18 jun",
    owner: "Margaux T.",
    progress: 41,
  },
  {
    id: 3,
    name: "Dior — Couture FW26",
    client: "Christian Dior",
    status: "Pré-produção",
    deadline: "03 jul",
    owner: "Carla V.",
    progress: 18,
  },
  {
    id: 4,
    name: "Apple — Silence",
    client: "Apple Originals",
    status: "Aprovação",
    deadline: "15 jun",
    owner: "Élise M.",
    progress: 88,
  },
  {
    id: 5,
    name: "Natura — Ekos",
    client: "Natura & Co.",
    status: "Edição",
    deadline: "22 jun",
    owner: "Rafael S.",
    progress: 56,
  },
];
const initClients: Client[] = [
  { id: 1, name: "Maison Hermès", project: "Carré 90", status: "Em produção", last: "há 2h" },
  { id: 2, name: "Porsche AG", project: "911 Carrera GTS", status: "Gravando", last: "há 35min" },
  { id: 3, name: "Christian Dior", project: "Couture FW26", status: "Reunião amanhã", last: "ontem" },
  { id: 4, name: "Apple Originals", project: "Silence — long form", status: "Aguardando aprovação", last: "há 4h" },
  { id: 5, name: "Natura & Co.", project: "Ekos — Filme institucional", status: "Edição", last: "há 1d" },
];
const initEntregas: Entrega[] = [
  {
    id: 1,
    project: "Apple — Silence",
    client: "Apple Originals",
    file: "Corte_Final_v3.mp4",
    status: "Aguardando aprovação",
    date: "15 jun",
    size: "4.2 GB",
    urgent: true,
  },
  {
    id: 2,
    project: "Hermès — Carré 90",
    client: "Maison Hermès",
    file: "Hermes_Color_v2.mov",
    status: "Em revisão",
    date: "25 jun",
    size: "8.7 GB",
    urgent: false,
  },
  {
    id: 3,
    project: "Natura — Ekos",
    client: "Natura & Co.",
    file: "Ekos_Teaser_v1.mp4",
    status: "Enviado",
    date: "22 jun",
    size: "1.1 GB",
    urgent: false,
  },
  {
    id: 4,
    project: "Porsche 911 GTS",
    client: "Porsche AG",
    file: "Porsche_Brutos.zip",
    status: "Pendente",
    date: "18 jun",
    size: "22 GB",
    urgent: true,
  },
];
const initPropostas: Proposta[] = [
  { id: 1, title: "Campanha Verão 2026", client: "Nike Brasil", value: "R$ 84.000", status: "Enviada", date: "10 jun" },
  {
    id: 2,
    title: "Série documental",
    client: "Natura & Co.",
    value: "R$ 210.000",
    status: "Em negociação",
    date: "08 jun",
  },
  { id: 3, title: "Conteúdo redes Q3", client: "Havaianas", value: "R$ 36.500", status: "Aprovada", date: "05 jun" },
  {
    id: 4,
    title: "Filme institucional 2026",
    client: "Itaú BBA",
    value: "R$ 320.000",
    status: "Rascunho",
    date: "12 jun",
  },
];
const initGravacoes: Gravacao[] = [
  {
    id: 1,
    title: "Gravação Studio A — Hermès",
    client: "Maison Hermès",
    local: "Studio A",
    date: "11 jun",
    time: "11:30",
    crew: "Léon B., Margaux T.",
  },
  {
    id: 2,
    title: "Gravação externa — Porsche",
    client: "Porsche AG",
    local: "São Paulo",
    date: "20 jun",
    time: "08:00",
    crew: "Rafael S., Carla V.",
  },
];
const initNotifs: Notif[] = [
  { id: 1, text: "Apple aprovou o corte final de Silence.", type: "info", read: false, time: "há 10min" },
  { id: 2, text: "Prazo de entrega Porsche em 4 dias.", type: "warn", read: false, time: "há 1h" },
  { id: 3, text: "Nova mensagem de Maison Hermès.", type: "info", read: false, time: "há 2h" },
  { id: 4, text: "Fatura de Hermès vence em 2 dias.", type: "alert", read: false, time: "há 3h" },
];
const initConvs = [
  {
    id: 1,
    name: "Maison Hermès",
    project: "Carré 90",
    last: "Aprovado o grade final ✓",
    time: "14:32",
    unread: 2,
    msgs: [
      { from: "Hermès", text: "Podemos revisar o color grading da cena 3?", time: "14:10" },
      { from: "Você", text: "Claro, vou verificar agora.", time: "14:15" },
      { from: "Hermès", text: "Aprovado o grade final ✓", time: "14:32" },
    ],
  },
  {
    id: 2,
    name: "Porsche AG",
    project: "911 GTS",
    last: "Quando ficam prontos os brutos?",
    time: "13:05",
    unread: 1,
    msgs: [{ from: "Porsche", text: "Quando ficam prontos os brutos?", time: "13:05" }],
  },
  {
    id: 3,
    name: "Apple Originals",
    project: "Silence",
    last: "Reunião amanhã às 14h?",
    time: "11:48",
    unread: 4,
    msgs: [
      { from: "Apple", text: "Precisamos alinhar o corte final.", time: "11:40" },
      { from: "Você", text: "Pode ser amanhã de manhã?", time: "11:44" },
      { from: "Apple", text: "Reunião amanhã às 14h?", time: "11:48" },
    ],
  },
];

/* ══════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════ */
function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [projects, setProjects] = useState(initProjects);
  const [clients, setClients] = useState(initClients);
  const [entregas, setEntregas] = useState(initEntregas);
  const [propostas, setPropostas] = useState(initPropostas);
  const [gravacoes, setGravacoes] = useState(initGravacoes);
  const [notifs, setNotifs] = useState(initNotifs);
  const [convs, setConvs] = useState(initConvs);
  const [searchQ, setSearchQ] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const [projModal, setProjModal] = useState<{ open: boolean; e: Project | null }>({ open: false, e: null });
  const [clientModal, setClientModal] = useState<{ open: boolean; e: Client | null }>({ open: false, e: null });
  const [entregaModal, setEntregaModal] = useState<{ open: boolean; e: Entrega | null }>({ open: false, e: null });
  const [propModal, setPropModal] = useState<{ open: boolean; e: Proposta | null }>({ open: false, e: null });
  const [gravModal, setGravModal] = useState<{ open: boolean; e: Gravacao | null }>({ open: false, e: null });

  const unread = notifs.filter((n) => !n.read).length;

  const saveProject = (d: Omit<Project, "id">) => {
    projModal.e
      ? setProjects((p) => p.map((x) => (x.id === projModal.e!.id ? { ...d, id: x.id } : x)))
      : setProjects((p) => [...p, { ...d, id: Date.now() }]);
    setProjModal({ open: false, e: null });
  };
  const saveClient = (d: Omit<Client, "id">) => {
    clientModal.e
      ? setClients((p) => p.map((x) => (x.id === clientModal.e!.id ? { ...d, id: x.id } : x)))
      : setClients((p) => [...p, { ...d, id: Date.now() }]);
    setClientModal({ open: false, e: null });
  };
  const saveEntrega = (d: Omit<Entrega, "id">) => {
    entregaModal.e
      ? setEntregas((p) => p.map((x) => (x.id === entregaModal.e!.id ? { ...d, id: x.id } : x)))
      : setEntregas((p) => [...p, { ...d, id: Date.now() }]);
    setEntregaModal({ open: false, e: null });
  };
  const saveProposta = (d: Omit<Proposta, "id">) => {
    propModal.e
      ? setPropostas((p) => p.map((x) => (x.id === propModal.e!.id ? { ...d, id: x.id } : x)))
      : setPropostas((p) => [...p, { ...d, id: Date.now() }]);
    setPropModal({ open: false, e: null });
  };
  const saveGravacao = (d: Omit<Gravacao, "id">) => {
    gravModal.e
      ? setGravacoes((p) => p.map((x) => (x.id === gravModal.e!.id ? { ...d, id: x.id } : x)))
      : setGravacoes((p) => [...p, { ...d, id: Date.now() }]);
    setGravModal({ open: false, e: null });
  };

  const sendMsg = (cid: number, text: string) => {
    const now = new Date();
    const t = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setConvs((p) =>
      p.map((c) =>
        c.id === cid ? { ...c, last: text, time: t, msgs: [...c.msgs, { from: "Você", text, time: t }] } : c,
      ),
    );
  };

  const searchResults =
    searchQ.length > 1
      ? [
          ...projects
            .filter(
              (p) =>
                p.name.toLowerCase().includes(searchQ.toLowerCase()) ||
                p.client.toLowerCase().includes(searchQ.toLowerCase()),
            )
            .map((p) => ({ type: "Projeto", label: p.name, sub: p.client })),
          ...clients
            .filter((c) => c.name.toLowerCase().includes(searchQ.toLowerCase()))
            .map((c) => ({ type: "Cliente", label: c.name, sub: c.project })),
        ]
      : [];

  const nav = (s: Screen) => {
    setScreen(s);
    setShowSearch(false);
    setShowNotifs(false);
  };

  return (
    <div style={{ background: C.bg, color: C.fg, minHeight: "100vh", fontFamily: "Inter,sans-serif" }}>
      <div className="flex min-h-screen">
        <Sidebar current={screen} onNavigate={nav} />
        <main className="flex-1 min-w-0">
          <TopBar
            screen={screen}
            unread={unread}
            notifs={notifs}
            showNotifs={showNotifs}
            onToggleNotifs={() => {
              setShowNotifs((v) => !v);
              setShowSearch(false);
            }}
            onMarkRead={() => setNotifs((n) => n.map((x) => ({ ...x, read: true })))}
            showSearch={showSearch}
            searchQ={searchQ}
            searchResults={searchResults}
            onToggleSearch={() => {
              setShowSearch((v) => !v);
              setShowNotifs(false);
            }}
            onSearchChange={setSearchQ}
            onNewProject={() => setProjModal({ open: true, e: null })}
          />
          <div className="px-8 py-8 max-w-[1480px]">
            {screen === "dashboard" && (
              <DashboardScreen
                projects={projects}
                clients={clients}
                gravacoes={gravacoes}
                onNewProject={() => setProjModal({ open: true, e: null })}
                onNewClient={() => setClientModal({ open: true, e: null })}
                onNewGravacao={() => setGravModal({ open: true, e: null })}
                onEditProject={(p: any) => setProjModal({ open: true, e: p })}
                onDeleteProject={(id: any) => setProjects((p) => p.filter((x) => x.id !== id))}
                onEditClient={(c: any) => setClientModal({ open: true, e: c })}
                onDeleteClient={(id: any) => setClients((p) => p.filter((x) => x.id !== id))}
              />
            )}
            {screen === "clientes" && (
              <ClientesScreen
                clients={clients}
                onNew={() => setClientModal({ open: true, e: null })}
                onEdit={(c: any) => setClientModal({ open: true, e: c })}
                onDelete={(id: any) => setClients((p) => p.filter((x) => x.id !== id))}
              />
            )}
            {screen === "projetos" && (
              <ProjetosScreen
                projects={projects}
                clients={clients}
                onNew={() => setProjModal({ open: true, e: null })}
                onEdit={(p: any) => setProjModal({ open: true, e: p })}
                onDelete={(id: any) => setProjects((p) => p.filter((x) => x.id !== id))}
              />
            )}
            {screen === "pipeline" && <PipelineScreen projects={projects} />}
            {screen === "agenda" && (
              <AgendaScreen
                gravacoes={gravacoes}
                clients={clients}
                onNew={() => setGravModal({ open: true, e: null })}
                onEdit={(g: any) => setGravModal({ open: true, e: g })}
                onDelete={(id: any) => setGravacoes((p) => p.filter((x) => x.id !== id))}
              />
            )}
            {screen === "entregas" && (
              <EntregasScreen
                entregas={entregas}
                projects={projects}
                onNew={() => setEntregaModal({ open: true, e: null })}
                onEdit={(e: any) => setEntregaModal({ open: true, e: e })}
                onDelete={(id: any) => setEntregas((p) => p.filter((x) => x.id !== id))}
              />
            )}
            {screen === "propostas" && (
              <PropostasScreen
                propostas={propostas}
                clients={clients}
                onNew={() => setPropModal({ open: true, e: null })}
                onEdit={(p: any) => setPropModal({ open: true, e: p })}
                onDelete={(id: any) => setPropostas((p) => p.filter((x) => x.id !== id))}
              />
            )}
            {screen === "financeiro" && <FinanceiroScreen />}
            {screen === "mensagens" && <MensagensScreen convs={convs} onSend={sendMsg} />}
            {screen === "configuracoes" && <ConfiguracoesScreen />}
          </div>
        </main>
      </div>

      {projModal.open && (
        <ProjectModal
          editing={projModal.e}
          clients={clients}
          onSave={saveProject}
          onClose={() => setProjModal({ open: false, e: null })}
        />
      )}
      {clientModal.open && (
        <ClientModal
          editing={clientModal.e}
          onSave={saveClient}
          onClose={() => setClientModal({ open: false, e: null })}
        />
      )}
      {entregaModal.open && (
        <EntregaModal
          editing={entregaModal.e}
          projects={projects}
          onSave={saveEntrega}
          onClose={() => setEntregaModal({ open: false, e: null })}
        />
      )}
      {propModal.open && (
        <PropostaModal
          editing={propModal.e}
          clients={clients}
          onSave={saveProposta}
          onClose={() => setPropModal({ open: false, e: null })}
        />
      )}
      {gravModal.open && (
        <GravacaoModal
          editing={gravModal.e}
          clients={clients}
          onSave={saveGravacao}
          onClose={() => setGravModal({ open: false, e: null })}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════ */
function Sidebar({ current, onNavigate }: { current: Screen; onNavigate: (s: Screen) => void }) {
  const sections = [
    {
      label: "Operação",
      items: [
        { icon: LayoutDashboard, label: "Visão geral", screen: "dashboard" as Screen },
        { icon: Clapperboard, label: "Projetos", screen: "projetos" as Screen },
        { icon: Users, label: "Clientes", screen: "clientes" as Screen },
        { icon: Video, label: "Gravações", screen: "agenda" as Screen },
        { icon: Send, label: "Entregas", screen: "entregas" as Screen },
      ],
    },
    {
      label: "Comercial",
      items: [
        { icon: FileText, label: "Propostas", screen: "propostas" as Screen },
        { icon: Wallet, label: "Financeiro", screen: "financeiro" as Screen },
        { icon: TrendingUp, label: "Pipeline", screen: "pipeline" as Screen },
      ],
    },
    {
      label: "Equipe",
      items: [
        { icon: Calendar, label: "Agenda", screen: "agenda" as Screen },
        { icon: MessageSquare, label: "Mensagens", screen: "mensagens" as Screen },
        { icon: Settings, label: "Configurações", screen: "configuracoes" as Screen },
      ],
    },
  ];
  return (
    <aside
      style={{ width: 248, background: C.surface, borderRight: `1px solid ${C.border}` }}
      className="shrink-0 sticky top-0 h-screen flex flex-col"
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg,${C.em},#00A87A)` }}
          >
            <Film className="h-4 w-4 text-white" strokeWidth={1.75} />
          </div>
          <div className="leading-tight">
            <div className="text-[14px] font-semibold tracking-tight" style={{ color: C.fg }}>
              MW Studio
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: C.muted }}>
              Media World
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-5 overflow-y-auto">
        {sections.map((sec) => (
          <div key={sec.label}>
            <div className="px-2 mb-2 text-[9.5px] uppercase tracking-[0.2em] font-semibold" style={{ color: C.muted }}>
              {sec.label}
            </div>
            <div className="space-y-0.5">
              {sec.items.map(({ icon: Icon, label, screen }: any) => {
                const active = current === screen;
                return (
                  <button
                    key={label}
                    onClick={() => onNavigate(screen)}
                    style={{
                      background: active ? C.emDim : "transparent",
                      color: active ? C.em : C.fgDim,
                      border: `1px solid ${active ? `${C.em}30` : "transparent"}`,
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] transition-all hover:opacity-100"
                    onMouseEnter={(e) => {
                      if (!active) (e.currentTarget as HTMLElement).style.background = C.hover;
                    }}
                    onMouseLeave={(e) => {
                      if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2 : 1.75} />
                    <span className={active ? "font-medium" : ""}>{label}</span>
                    {active && <span className="ml-auto h-1.5 w-1.5 rounded-full" style={{ background: C.em }} />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3" style={{ borderTop: `1px solid ${C.border}` }}>
        <div
          className="rounded-xl p-3 flex items-center gap-3"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
        >
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[12px] font-semibold shrink-0"
            style={{ background: `linear-gradient(135deg,${C.em},#00A87A)` }}
          >
            É
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-medium truncate" style={{ color: C.fg }}>
              Élise Marchand
            </div>
            <div className="text-[11px] truncate" style={{ color: C.muted }}>
              Produtora Executiva
            </div>
          </div>
          <Settings className="h-3.5 w-3.5 shrink-0" style={{ color: C.muted }} strokeWidth={1.75} />
        </div>
      </div>
    </aside>
  );
}

/* ══════════════════════════════════════════
   TOPBAR
══════════════════════════════════════════ */
const screenLabels: Record<Screen, string> = {
  dashboard: "Visão geral",
  clientes: "Clientes",
  projetos: "Projetos",
  pipeline: "Pipeline",
  agenda: "Agenda",
  entregas: "Entregas",
  propostas: "Propostas",
  financeiro: "Financeiro",
  mensagens: "Mensagens",
  configuracoes: "Configurações",
};

function TopBar({
  screen,
  unread,
  notifs,
  showNotifs,
  onToggleNotifs,
  onMarkRead,
  showSearch,
  searchQ,
  searchResults,
  onToggleSearch,
  onSearchChange,
  onNewProject,
}: any) {
  const nRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (nRef.current && !nRef.current.contains(e.target as Node) && showNotifs) onToggleNotifs();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [showNotifs]);

  return (
    <div
      className="sticky top-0 z-30 flex items-center gap-4 px-8 py-3.5"
      style={{ background: `${C.surface}E8`, borderBottom: `1px solid ${C.border}`, backdropFilter: "blur(16px)" }}
    >
      <div className="flex items-center gap-2 text-[12px]" style={{ color: C.muted }}>
        <span style={{ color: C.em, fontWeight: 500 }}>MW</span>
        <ChevronRight className="h-3 w-3" strokeWidth={1.75} />
        <span style={{ color: C.fg }}>{screenLabels[screen as Screen]}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-[12.5px] w-[220px] cursor-text"
            style={{ background: C.card, border: `1px solid ${C.border}`, color: C.muted }}
            onClick={onToggleSearch}
          >
            <Search className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            {showSearch ? (
              <input
                autoFocus
                className="flex-1 bg-transparent outline-none text-[12.5px]"
                style={{ color: C.fg }}
                placeholder="Buscar…"
                value={searchQ}
                onChange={(e) => onSearchChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span>Buscar…</span>
            )}
            <span className="ml-auto text-[10px] flex items-center gap-0.5 opacity-50">
              <Command className="h-2.5 w-2.5" strokeWidth={2} />K
            </span>
          </div>
          {searchQ.length > 1 && (
            <div
              className="absolute top-full left-0 mt-2 w-[300px] rounded-2xl overflow-hidden z-50 shadow-2xl"
              style={{ background: C.card, border: `1px solid ${C.border}` }}
            >
              {searchResults.length === 0 ? (
                <div className="px-4 py-6 text-center text-[13px]" style={{ color: C.muted }}>
                  Nenhum resultado.
                </div>
              ) : (
                searchResults.map((r: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2.5 transition-colors cursor-pointer"
                    style={{ borderBottom: `1px solid ${C.border}` }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = C.hover)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] w-12" style={{ color: C.em }}>
                      {r.type}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium truncate" style={{ color: C.fg }}>
                        {r.label}
                      </div>
                      <div className="text-[11.5px] truncate" style={{ color: C.muted }}>
                        {r.sub}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Notifs */}
        <div ref={nRef} className="relative">
          <button
            onClick={onToggleNotifs}
            className="relative h-8 w-8 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: C.card, border: `1px solid ${C.border}`, color: C.muted }}
          >
            <Bell className="h-4 w-4" strokeWidth={1.75} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full" style={{ background: C.em }} />
            )}
          </button>
          {showNotifs && (
            <div
              className="absolute top-full right-0 mt-2 w-[300px] rounded-2xl overflow-hidden z-50 shadow-2xl"
              style={{ background: C.card, border: `1px solid ${C.border}` }}
            >
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: `1px solid ${C.border}` }}
              >
                <span className="text-[13px] font-semibold" style={{ color: C.fg }}>
                  Notificações
                </span>
                <button onClick={onMarkRead} className="text-[11.5px]" style={{ color: C.em }}>
                  Marcar lidas
                </button>
              </div>
              {notifs.map((n: Notif) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 px-4 py-3"
                  style={{ borderBottom: `1px solid ${C.border}`, opacity: n.read ? 0.4 : 1 }}
                >
                  <div
                    className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: n.type === "alert" ? C.dangerDim : n.type === "warn" ? C.warnDim : C.infoDim,
                      color: n.type === "alert" ? C.danger : n.type === "warn" ? C.warn : C.info,
                    }}
                  >
                    {n.type === "alert" ? (
                      <AlertCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
                    ) : n.type === "warn" ? (
                      <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
                    ) : (
                      <Info className="h-3.5 w-3.5" strokeWidth={1.75} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px]" style={{ color: C.fg }}>
                      {n.text}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: C.muted }}>
                      {n.time}
                    </div>
                  </div>
                  {!n.read && (
                    <span className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ background: C.em }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onNewProject}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-[12.5px] font-semibold transition-all shadow-lg"
          style={{ background: `linear-gradient(135deg,${C.em},#00A87A)`, color: "#0D1612" }}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          Novo projeto
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════ */
function Card({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-2xl ${className}`} style={{ background: C.card, border: `1px solid ${C.border}`, ...style }}>
      {children}
    </div>
  );
}

function ActionButtons({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={onEdit}
        className="h-7 w-7 rounded-lg flex items-center justify-center transition-colors"
        style={{ color: C.muted }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.fg)}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.muted)}
      >
        <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
      </button>
      <button
        onClick={onDelete}
        className="h-7 w-7 rounded-lg flex items-center justify-center transition-colors"
        style={{ color: C.muted }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.danger)}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.muted)}
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
      </button>
    </div>
  );
}

function PageHeader({
  eyebrow,
  title,
  sub,
  action,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: C.em }}>
          {eyebrow}
        </div>
        <h1 className="text-[30px] font-light tracking-[-0.02em]" style={{ color: C.fg }}>
          {title}
        </h1>
        <p className="text-[13px] mt-1" style={{ color: C.muted }}>
          {sub}
        </p>
      </div>
      {action}
    </div>
  );
}

function Btn({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
}) {
  return variant === "primary" ? (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold shadow-lg transition-opacity hover:opacity-90"
      style={{ background: `linear-gradient(135deg,${C.em},#00A87A)`, color: "#0D1612" }}
    >
      {children}
    </button>
  ) : (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-medium transition-colors"
      style={{ background: C.card, border: `1px solid ${C.border}`, color: C.fgDim }}
    >
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════ */
function DashboardScreen({
  projects,
  clients,
  gravacoes,
  onNewProject,
  onNewClient,
  onNewGravacao,
  onEditProject,
  onDeleteProject,
  onEditClient,
  onDeleteClient,
}: any) {
  const active = projects.filter((p: Project) => p.status !== "Entregue").length;
  const pending = projects.filter((p: Project) => p.status === "Aprovação").length;
  const delivered = projects.filter((p: Project) => p.status === "Entregue").length;
  const kpis = [
    { label: "Clientes ativos", value: String(clients.length), delta: `+4 este mês`, tone: "up", icon: Users },
    {
      label: "Em andamento",
      value: String(active),
      delta: `${projects.length} no total`,
      tone: "up",
      icon: Clapperboard,
    },
    {
      label: "Aguardando aprovação",
      value: String(pending),
      delta: pending > 0 ? "Atenção" : "OK",
      tone: pending > 0 ? "warn" : "up",
      icon: CheckCircle2,
    },
    { label: "Entregues", value: String(delivered), delta: "Concluídos", tone: "neutral", icon: Send },
    { label: "Gravações", value: String(gravacoes.length), delta: "Agendadas", tone: "neutral", icon: Video },
    { label: "Faturamento", value: "R$ 482k", delta: "+18,4%", tone: "up", icon: TrendingUp },
    { label: "A receber", value: "R$ 96k", delta: "4 faturas", tone: "warn", icon: Wallet },
  ];
  return (
    <div className="space-y-8">
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: C.em }}>
          Visão geral · 11 jun 2026
        </div>
        <h1 className="text-[36px] font-light tracking-[-0.025em]" style={{ color: C.fg }}>
          Boa noite, Élise.
        </h1>
        <p className="text-[14px] mt-1" style={{ color: C.muted }}>
          Aqui está o panorama da operação hoje.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="p-4 group hover:-translate-y-0.5 transition-all duration-300 cursor-default">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="h-7 w-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: C.emDim, color: C.em }}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                </div>
              </div>
              <div className="text-[24px] font-semibold tabular-nums leading-none" style={{ color: C.fg }}>
                {k.value}
              </div>
              <div className="text-[10.5px] mt-1.5 font-medium" style={{ color: C.muted }}>
                {k.label}
              </div>
              <div
                className="text-[10.5px] mt-1 font-semibold flex items-center gap-0.5"
                style={{ color: k.tone === "up" ? C.em : k.tone === "warn" ? C.warn : C.muted }}
              >
                {k.tone === "up" && <ArrowUpRight className="h-3 w-3" strokeWidth={2} />}
                {k.delta}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick actions */}
      <div
        className="flex flex-wrap items-center gap-2 rounded-2xl p-3"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        <span className="text-[10px] uppercase tracking-[0.18em] font-semibold px-2" style={{ color: C.muted }}>
          Ações rápidas
        </span>
        <div className="h-4 w-px mx-1" style={{ background: C.border }} />
        {[
          { icon: Plus, label: "Novo projeto", onClick: onNewProject, primary: true },
          { icon: UserPlus, label: "Novo cliente", onClick: onNewClient, primary: false },
          { icon: Video, label: "Agendar gravação", onClick: onNewGravacao, primary: false },
          { icon: FileText, label: "Nova proposta", onClick: () => {}, primary: false },
        ].map(({ icon: Icon, label, onClick, primary }) => (
          <button
            key={label}
            onClick={onClick}
            className="flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-[12.5px] font-medium transition-all"
            style={
              primary
                ? { background: `linear-gradient(135deg,${C.em},#00A87A)`, color: "#0D1612" }
                : { background: C.hover, border: `1px solid ${C.border}`, color: C.fgDim }
            }
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <ProjectsTable projects={projects} onEdit={onEditProject} onDelete={onDeleteProject} />
          <PipelineMini projects={projects} />
          <ClientsTable clients={clients} onEdit={onEditClient} onDelete={onDeleteClient} />
        </div>
        <div className="col-span-12 xl:col-span-4 space-y-4">
          <AgendaWidget />
          <DeadlinesWidget />
          <FinancialWidget />
        </div>
      </div>
    </div>
  );
}

function ProjectsTable({ projects, onEdit, onDelete }: any) {
  return (
    <Card>
      <div
        className="flex items-center justify-between px-5 pt-5 pb-4"
        style={{ borderBottom: `1px solid ${C.border}` }}
      >
        <div>
          <div className="text-[9.5px] uppercase tracking-[0.2em] font-semibold mb-1" style={{ color: C.em }}>
            Operação
          </div>
          <h2 className="text-[16px] font-semibold" style={{ color: C.fg }}>
            Projetos recentes
          </h2>
        </div>
      </div>
      {projects.length === 0 ? (
        <div className="py-12 text-center text-[13px]" style={{ color: C.muted }}>
          Nenhum projeto.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.muted }}>
                {["Projeto", "Cliente", "Status", "Prazo", "Progresso", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-[0.15em] font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p: Project, i: number) => (
                <tr
                  key={p.id}
                  className="group transition-colors"
                  style={{ borderBottom: i < projects.length - 1 ? `1px solid ${C.border}` : "none" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = C.hover)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <td className="px-5 py-3.5 font-medium" style={{ color: C.fg }}>
                    {p.name}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: C.muted }}>
                    {p.client}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge label={p.status} color={statusColor(p.status)} />
                  </td>
                  <td className="px-5 py-3.5 tabular-nums" style={{ color: C.fgDim }}>
                    {p.deadline}
                  </td>
                  <td className="px-5 py-3.5 w-[140px]">
                    <ProgressBar value={p.progress} />
                  </td>
                  <td className="px-5 py-3.5">
                    <ActionButtons onEdit={() => onEdit(p)} onDelete={() => onDelete(p.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function PipelineMini({ projects }: any) {
  const stages: ProjectStatus[] = ["Pré-produção", "Gravação", "Edição", "Pós-produção", "Aprovação", "Entregue"];
  const max = Math.max(...stages.map((s) => projects.filter((p: Project) => p.status === s).length), 1);
  return (
    <Card className="p-5">
      <div className="text-[9.5px] uppercase tracking-[0.2em] font-semibold mb-1" style={{ color: C.em }}>
        Comercial
      </div>
      <h2 className="text-[16px] font-semibold mb-5" style={{ color: C.fg }}>
        Pipeline
      </h2>
      <div className="flex gap-2">
        {stages.map((stage, i) => {
          const count = projects.filter((p: Project) => p.status === stage).length;
          const intensity = 0.1 + (count / max) * 0.15;
          return (
            <div
              key={stage}
              className="flex-1 min-w-0 rounded-xl p-3 transition-all cursor-pointer"
              style={{
                background: `rgba(0,200,150,${intensity})`,
                border: `1px solid ${count > 0 ? `${C.em}30` : C.border}`,
              }}
            >
              <div
                className="text-[20px] font-semibold tabular-nums leading-none"
                style={{ color: count > 0 ? C.em : C.muted }}
              >
                {count}
              </div>
              <div
                className="text-[10.5px] font-medium mt-1.5 leading-tight"
                style={{ color: count > 0 ? C.fgDim : C.muted }}
              >
                {stage}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ClientsTable({ clients, onEdit, onDelete }: any) {
  return (
    <Card>
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="text-[9.5px] uppercase tracking-[0.2em] font-semibold mb-1" style={{ color: C.em }}>
          Relacionamento
        </div>
        <h2 className="text-[16px] font-semibold" style={{ color: C.fg }}>
          Clientes ativos
        </h2>
      </div>
      {clients.map((c: Client) => (
        <div
          key={c.id}
          className="flex items-center gap-4 px-5 py-3.5 group transition-colors"
          style={{ borderBottom: `1px solid ${C.border}` }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = C.hover)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
        >
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0"
            style={{ background: `linear-gradient(135deg,${C.em},#00A87A)`, color: "#0D1612" }}
          >
            {c.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0 grid grid-cols-3 gap-4 items-center">
            <div>
              <div className="text-[13px] font-semibold truncate" style={{ color: C.fg }}>
                {c.name}
              </div>
              <div className="text-[11px] truncate" style={{ color: C.muted }}>
                {c.project}
              </div>
            </div>
            <div className="text-[12px]" style={{ color: C.fgDim }}>
              {c.status}
            </div>
            <div className="text-[11.5px] text-right tabular-nums" style={{ color: C.muted }}>
              {c.last}
            </div>
          </div>
          <ActionButtons onEdit={() => onEdit(c)} onDelete={() => onDelete(c.id)} />
        </div>
      ))}
    </Card>
  );
}

function AgendaWidget() {
  const items = [
    { time: "09:00", title: "Kickoff Porsche", icon: Users },
    { time: "11:30", title: "Gravação Studio A", icon: Video },
    { time: "14:00", title: "Chamada Apple", icon: Phone },
    { time: "16:00", title: "Entrega corte Dior", icon: Send },
  ];
  return (
    <Card>
      <div
        className="flex items-center justify-between px-4 pt-4 pb-3"
        style={{ borderBottom: `1px solid ${C.border}` }}
      >
        <h2 className="text-[14px] font-semibold" style={{ color: C.fg }}>
          Agenda do dia
        </h2>
        <Calendar className="h-4 w-4" style={{ color: C.muted }} strokeWidth={1.75} />
      </div>
      <ul>
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <li
              key={i}
              className="flex items-center gap-3 px-4 py-2.5 transition-colors"
              style={{ borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : "none" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = C.hover)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <span className="text-[11.5px] font-semibold tabular-nums w-10" style={{ color: C.em }}>
                {item.time}
              </span>
              <div
                className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: C.emDim, color: C.em }}
              >
                <Icon className="h-3 w-3" strokeWidth={1.75} />
              </div>
              <span className="text-[12.5px] font-medium" style={{ color: C.fgDim }}>
                {item.title}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function DeadlinesWidget() {
  const items = [
    { project: "Apple — Silence", task: "Aprovação corte final", in: "Em 2 dias", urgent: true },
    { project: "Porsche 911 GTS", task: "Entrega dos brutos", in: "Em 4 dias", urgent: true },
    { project: "Hermès — Carré 90", task: "Color grading", in: "Em 1 sem", urgent: false },
    { project: "Natura — Ekos", task: "Aprovação roteiro", in: "Em 10 dias", urgent: false },
  ];
  return (
    <Card>
      <div
        className="flex items-center justify-between px-4 pt-4 pb-3"
        style={{ borderBottom: `1px solid ${C.border}` }}
      >
        <h2 className="text-[14px] font-semibold" style={{ color: C.fg }}>
          Prazos
        </h2>
        <Clock className="h-4 w-4" style={{ color: C.muted }} strokeWidth={1.75} />
      </div>
      <ul>
        {items.map((d, i) => (
          <li
            key={i}
            className="flex items-start gap-3 px-4 py-3 transition-colors"
            style={{ borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : "none" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = C.hover)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
              style={{ background: d.urgent ? C.danger : C.border }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-medium truncate" style={{ color: C.fg }}>
                {d.project}
              </div>
              <div className="text-[11px] truncate mt-0.5" style={{ color: C.muted }}>
                {d.task}
              </div>
            </div>
            <span
              className="text-[11px] font-semibold whitespace-nowrap"
              style={{ color: d.urgent ? C.danger : C.muted }}
            >
              {d.in}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function FinancialWidget() {
  const rows = [
    { label: "Faturamento", value: "R$ 482.350", delta: "+18,4%" },
    { label: "Mês anterior", value: "R$ 407.420", delta: null },
    { label: "A receber", value: "R$ 96.200", delta: "4 faturas" },
    { label: "Previsto", value: "R$ 612.000", delta: "+27%" },
  ];
  return (
    <Card className="overflow-hidden">
      <div
        className="px-4 pt-4 pb-3"
        style={{ borderBottom: `1px solid ${C.border}`, background: `linear-gradient(135deg,${C.emDim},transparent)` }}
      >
        <div className="text-[9.5px] uppercase tracking-[0.2em] font-semibold mb-1" style={{ color: C.em }}>
          Financeiro
        </div>
        <h2 className="text-[14px] font-semibold" style={{ color: C.fg }}>
          Resumo do mês
        </h2>
      </div>
      <ul>
        {rows.map((r, i) => (
          <li
            key={i}
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none" }}
          >
            <span className="text-[12px]" style={{ color: C.muted }}>
              {r.label}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold tabular-nums" style={{ color: C.fg }}>
                {r.value}
              </span>
              {r.delta && (
                <span
                  className="text-[10px] font-semibold rounded-lg px-1.5 py-0.5"
                  style={{ background: C.emDim, color: C.em }}
                >
                  {r.delta}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ══════════════════════════════════════════
   CLIENTES
══════════════════════════════════════════ */
function ClientesScreen({ clients, onNew, onEdit, onDelete }: any) {
  const [q, setQ] = useState("");
  const filtered = clients.filter((c: Client) => c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PageHeader
        eyebrow="Relacionamento"
        title="Clientes"
        sub={`${clients.length} clientes ativos`}
        action={
          <Btn onClick={onNew}>
            <Plus className="h-4 w-4" strokeWidth={2} />
            Novo cliente
          </Btn>
        }
      />
      <SearchBar value={q} onChange={setQ} placeholder="Buscar cliente…" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        {filtered.map((c: Client) => (
          <Card key={c.id} className="p-5 group hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-[13px] font-semibold shrink-0"
                  style={{ background: `linear-gradient(135deg,${C.em},#00A87A)`, color: "#0D1612" }}
                >
                  {c.name.charAt(0)}
                </div>
                <div>
                  <div className="text-[14px] font-semibold" style={{ color: C.fg }}>
                    {c.name}
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: C.muted }}>
                    {c.project}
                  </div>
                </div>
              </div>
              <ActionButtons onEdit={() => onEdit(c)} onDelete={() => onDelete(c.id)} />
            </div>
            <div className="space-y-2 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
              <div className="flex justify-between">
                <span className="text-[11.5px]" style={{ color: C.muted }}>
                  Status
                </span>
                <span className="text-[12px] font-medium" style={{ color: C.fgDim }}>
                  {c.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[11.5px]" style={{ color: C.muted }}>
                  Última interação
                </span>
                <span className="text-[12px] tabular-nums" style={{ color: C.muted }}>
                  {c.last}
                </span>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 py-20 text-center text-[13px]" style={{ color: C.muted }}>
            Nenhum cliente encontrado.
          </div>
        )}
      </div>
    </div>
  );
}

function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div
      className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] w-full max-w-sm"
      style={{ background: C.card, border: `1px solid ${C.border}`, color: C.muted }}
    >
      <Search className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      <input
        className="flex-1 bg-transparent outline-none placeholder:opacity-50"
        style={{ color: C.fg }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* ══════════════════════════════════════════
   PROJETOS
══════════════════════════════════════════ */
function ProjetosScreen({ projects, clients, onNew, onEdit, onDelete }: any) {
  const [filter, setFilter] = useState("Todos");
  const [q, setQ] = useState("");
  const filtered = projects.filter(
    (p: Project) =>
      (filter === "Todos" || p.status === filter) &&
      (p.name.toLowerCase().includes(q.toLowerCase()) || p.client.toLowerCase().includes(q.toLowerCase())),
  );
  return (
    <div>
      <PageHeader
        eyebrow="Operação"
        title="Projetos"
        sub={`${projects.length} projetos no total`}
        action={
          <Btn onClick={onNew}>
            <Plus className="h-4 w-4" strokeWidth={2} />
            Novo projeto
          </Btn>
        }
      />
      <div className="flex items-center gap-3 flex-wrap mb-6">
        <SearchBar value={q} onChange={setQ} placeholder="Buscar projeto…" />
        <div className="flex gap-1.5 flex-wrap">
          {["Todos", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-3 py-1.5 rounded-full text-[12px] font-medium transition-all"
              style={
                filter === s
                  ? { background: C.em, color: "#0D1612" }
                  : { background: C.card, border: `1px solid ${C.border}`, color: C.muted }
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <Card>
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[13px]" style={{ color: C.muted }}>
            Nenhum projeto encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.muted }}>
                  {["Projeto", "Cliente", "Status", "Prazo", "Responsável", "Progresso", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-[0.15em] font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p: Project, i: number) => (
                  <tr
                    key={p.id}
                    className="group transition-colors"
                    style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = C.hover)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    <td className="px-5 py-3.5 font-medium" style={{ color: C.fg }}>
                      {p.name}
                    </td>
                    <td className="px-5 py-3.5" style={{ color: C.muted }}>
                      {p.client}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge label={p.status} color={statusColor(p.status)} />
                    </td>
                    <td className="px-5 py-3.5 tabular-nums" style={{ color: C.fgDim }}>
                      {p.deadline}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-5 w-5 rounded-full shrink-0"
                          style={{ background: `linear-gradient(135deg,${C.em},#00A87A)` }}
                        />
                        <span style={{ color: C.muted }}>{p.owner}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 w-[140px]">
                      <ProgressBar value={p.progress} />
                    </td>
                    <td className="px-5 py-3.5">
                      <ActionButtons onEdit={() => onEdit(p)} onDelete={() => onDelete(p.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════
   PIPELINE
══════════════════════════════════════════ */
function PipelineScreen({ projects }: any) {
  const stages: ProjectStatus[] = ["Pré-produção", "Gravação", "Edição", "Pós-produção", "Aprovação", "Entregue"];
  return (
    <div>
      <PageHeader eyebrow="Comercial" title="Pipeline de produção" sub="Visão do funil por estágio" />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stages.map((stage) => {
          const sp = projects.filter((p: Project) => p.status === stage);
          return (
            <div key={stage} className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: C.muted }}>
                  {stage}
                </span>
                <span
                  className="text-[10px] font-semibold rounded-lg px-1.5 py-0.5"
                  style={{
                    background: sp.length > 0 ? C.emDim : C.card,
                    color: sp.length > 0 ? C.em : C.muted,
                    border: `1px solid ${sp.length > 0 ? `${C.em}30` : C.border}`,
                  }}
                >
                  {sp.length}
                </span>
              </div>
              <div className="space-y-2 min-h-[100px]">
                {sp.map((p: Project) => (
                  <Card key={p.id} className="p-3 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                    <div className="text-[12.5px] font-semibold leading-snug" style={{ color: C.fg }}>
                      {p.name}
                    </div>
                    <div className="text-[11px] mt-1" style={{ color: C.muted }}>
                      {p.client}
                    </div>
                    <div className="mt-3">
                      <ProgressBar value={p.progress} />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10.5px]" style={{ color: C.muted }}>
                        {p.deadline}
                      </span>
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ background: `linear-gradient(135deg,${C.em},#00A87A)` }}
                      />
                    </div>
                  </Card>
                ))}
                {sp.length === 0 && (
                  <div
                    className="rounded-xl p-4 flex items-center justify-center text-[11px]"
                    style={{ border: `1px dashed ${C.border}`, color: C.muted }}
                  >
                    Vazio
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   AGENDA
══════════════════════════════════════════ */
function AgendaScreen({ gravacoes, clients, onNew, onEdit, onDelete }: any) {
  return (
    <div>
      <PageHeader
        eyebrow="Operação"
        title="Agenda & Gravações"
        sub="Quinta, 11 de junho de 2026"
        action={
          <Btn onClick={onNew}>
            <Plus className="h-4 w-4" strokeWidth={2} />
            Agendar gravação
          </Btn>
        }
      />
      <div className="space-y-4">
        {gravacoes.length === 0 && (
          <div
            className="rounded-2xl p-8 text-center text-[13px]"
            style={{ border: `1px dashed ${C.border}`, color: C.muted }}
          >
            Nenhuma gravação agendada.{" "}
            <button onClick={onNew} style={{ color: C.em }} className="underline ml-1">
              Agendar agora
            </button>
          </div>
        )}
        {gravacoes.map((g: Gravacao) => (
          <Card
            key={g.id}
            className="flex items-start gap-4 p-4 group hover:-translate-y-0.5 transition-all duration-200"
          >
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: C.warnDim, color: C.warn }}
            >
              <Video className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold" style={{ color: C.fg }}>
                {g.title}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[12px]" style={{ color: C.muted }}>
                  {g.client}
                </span>
                <span style={{ color: C.border }}>·</span>
                <span className="text-[12px]" style={{ color: C.muted }}>
                  {g.local}
                </span>
                <span style={{ color: C.border }}>·</span>
                <span className="text-[12px] font-semibold" style={{ color: C.em }}>
                  {g.date} às {g.time}
                </span>
              </div>
              <div className="text-[11.5px] mt-1" style={{ color: C.muted }}>
                Equipe: {g.crew}
              </div>
            </div>
            <ActionButtons onEdit={() => onEdit(g)} onDelete={() => onDelete(g.id)} />
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   ENTREGAS
══════════════════════════════════════════ */
function EntregasScreen({ entregas, projects, onNew, onEdit, onDelete }: any) {
  const statusColor2: Record<string, string> = {
    "Aguardando aprovação": C.warn,
    "Em revisão": C.info,
    Enviado: C.muted,
    Pendente: C.warn,
    Aprovado: C.em,
  };
  return (
    <div>
      <PageHeader
        eyebrow="Operação"
        title="Entregas"
        sub={`${entregas.length} entregas ativas`}
        action={
          <Btn onClick={onNew}>
            <Upload className="h-4 w-4" strokeWidth={2} />
            Nova entrega
          </Btn>
        }
      />
      <Card>
        {entregas.length === 0 ? (
          <div className="py-16 text-center text-[13px]" style={{ color: C.muted }}>
            Nenhuma entrega.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.muted }}>
                  {["Projeto", "Arquivo", "Status", "Prazo", "Tamanho", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-[0.15em] font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entregas.map((e: Entrega, i: number) => (
                  <tr
                    key={e.id}
                    className="group transition-colors"
                    style={{ borderBottom: i < entregas.length - 1 ? `1px solid ${C.border}` : "none" }}
                    onMouseEnter={(x) => ((x.currentTarget as HTMLElement).style.background = C.hover)}
                    onMouseLeave={(x) => ((x.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-medium" style={{ color: C.fg }}>
                        {e.project}
                      </div>
                      <div className="text-[11px]" style={{ color: C.muted }}>
                        {e.client}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11.5px]" style={{ color: C.muted }}>
                      {e.file}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge label={e.status} color={statusColor2[e.status] || C.muted} />
                    </td>
                    <td
                      className="px-5 py-3.5 tabular-nums font-medium"
                      style={{ color: e.urgent ? C.danger : C.fgDim }}
                    >
                      {e.date}
                    </td>
                    <td className="px-5 py-3.5 tabular-nums" style={{ color: C.muted }}>
                      {e.size}
                    </td>
                    <td className="px-5 py-3.5">
                      <ActionButtons onEdit={() => onEdit(e)} onDelete={() => onDelete(e.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════
   PROPOSTAS
══════════════════════════════════════════ */
function PropostasScreen({ propostas, clients, onNew, onEdit, onDelete }: any) {
  const sc: Record<string, string> = {
    Enviada: C.info,
    "Em negociação": C.warn,
    Aprovada: C.em,
    Rascunho: C.muted,
    Recusada: C.danger,
  };
  return (
    <div>
      <PageHeader
        eyebrow="Comercial"
        title="Propostas"
        sub={`${propostas.length} propostas · ${propostas.filter((p: Proposta) => p.status === "Aprovada").length} aprovadas`}
        action={
          <Btn onClick={onNew}>
            <Plus className="h-4 w-4" strokeWidth={2} />
            Nova proposta
          </Btn>
        }
      />
      <div className="space-y-3">
        {propostas.map((p: Proposta) => (
          <Card
            key={p.id}
            className="flex items-center gap-4 p-4 group hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: C.emDim, color: C.em }}
            >
              <FileText className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold" style={{ color: C.fg }}>
                {p.title}
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: C.muted }}>
                {p.client} · {p.date}
              </div>
            </div>
            <div className="text-[15px] font-semibold tabular-nums" style={{ color: C.fg }}>
              {p.value}
            </div>
            <Badge label={p.status} color={sc[p.status] || C.muted} />
            <ActionButtons onEdit={() => onEdit(p)} onDelete={() => onDelete(p.id)} />
          </Card>
        ))}
        {propostas.length === 0 && (
          <div className="py-16 text-center text-[13px]" style={{ color: C.muted }}>
            Nenhuma proposta.
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   FINANCEIRO
══════════════════════════════════════════ */
function FinanceiroScreen() {
  const [tab, setTab] = useState<"resumo" | "lancamentos">("resumo");
  const lancamentos = [
    { desc: "Pagamento — Apple Originals", tipo: "Entrada", valor: "R$ 142.000", data: "10 jun", status: "Recebido" },
    { desc: "Pagamento — Porsche AG (50%)", tipo: "Entrada", valor: "R$ 75.000", data: "08 jun", status: "Recebido" },
    { desc: "Aluguel Studio A — junho", tipo: "Saída", valor: "R$ 8.500", data: "05 jun", status: "Pago" },
    { desc: "Equipamentos — locação externa", tipo: "Saída", valor: "R$ 12.200", data: "07 jun", status: "Pago" },
    { desc: "Fatura — Maison Hermès", tipo: "Entrada", valor: "R$ 96.200", data: "15 jun", status: "Pendente" },
    { desc: "Freelancer — colorista", tipo: "Saída", valor: "R$ 4.800", data: "12 jun", status: "Pendente" },
  ];
  const kpis = [
    { label: "Faturamento", value: "R$ 482.350", delta: "+18,4%", tone: "up" },
    { label: "Despesas", value: "R$ 68.400", delta: "+3,2%", tone: "warn" },
    { label: "Lucro líquido", value: "R$ 413.950", delta: "+22,1%", tone: "up" },
    { label: "A receber", value: "R$ 96.200", delta: "1 fatura", tone: "warn" },
  ];
  return (
    <div>
      <PageHeader eyebrow="Financeiro" title="Financeiro" sub="Junho de 2026" />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <div className="text-[10px] uppercase tracking-[0.16em] font-semibold mb-3" style={{ color: C.muted }}>
              {k.label}
            </div>
            <div className="text-[24px] font-semibold tabular-nums leading-none" style={{ color: C.fg }}>
              {k.value}
            </div>
            <div
              className="text-[11.5px] mt-2 font-semibold flex items-center gap-0.5"
              style={{ color: k.tone === "up" ? C.em : C.warn }}
            >
              {k.tone === "up" && <ArrowUpRight className="h-3 w-3" strokeWidth={2} />}
              {k.delta}
            </div>
          </Card>
        ))}
      </div>
      <div className="flex gap-1 mb-4">
        {(["resumo", "lancamentos"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-xl text-[13px] font-medium transition-all"
            style={
              tab === t
                ? { background: C.em, color: "#0D1612" }
                : { background: C.card, border: `1px solid ${C.border}`, color: C.muted }
            }
          >
            {t === "resumo" ? "Resumo" : "Lançamentos"}
          </button>
        ))}
      </div>
      {tab === "resumo" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="text-[13px] font-semibold mb-5" style={{ color: C.fg }}>
              Receita vs Despesa
            </div>
            {[
              { label: "Receita", v: 482350, max: 612000 },
              { label: "Despesa", v: 68400, max: 612000 },
              { label: "Previsto", v: 612000, max: 612000 },
            ].map((b) => (
              <div key={b.label} className="mb-4">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[12px]" style={{ color: C.muted }}>
                    {b.label}
                  </span>
                  <span className="text-[12px] font-semibold tabular-nums" style={{ color: C.fg }}>
                    R$ {b.v.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.border }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(b.v / b.max) * 100}%`, background: `linear-gradient(90deg,${C.em},#00E8B0)` }}
                  />
                </div>
              </div>
            ))}
          </Card>
          <Card className="p-6">
            <div className="text-[13px] font-semibold mb-5" style={{ color: C.fg }}>
              Status dos pagamentos
            </div>
            {[
              { label: "Recebidos", count: 2, color: C.em },
              { label: "Pendentes", count: 1, color: C.warn },
              { label: "Em atraso", count: 1, color: C.danger },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between py-3"
                style={{ borderBottom: `1px solid ${C.border}` }}
              >
                <span className="text-[13px]" style={{ color: C.fgDim }}>
                  {s.label}
                </span>
                <span className="text-[13px] font-semibold" style={{ color: s.color }}>
                  {s.count} faturas
                </span>
              </div>
            ))}
          </Card>
        </div>
      )}
      {tab === "lancamentos" && (
        <Card>
          <div className="divide-y" style={{ "--tw-divide-opacity": 1 } as any}>
            {lancamentos.map((l, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                style={{ borderBottom: i < lancamentos.length - 1 ? `1px solid ${C.border}` : "none" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = C.hover)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: l.tipo === "Entrada" ? C.emDim : C.dangerDim,
                    color: l.tipo === "Entrada" ? C.em : C.danger,
                  }}
                >
                  {l.tipo === "Entrada" ? (
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                  ) : (
                    <ArrowRight className="h-4 w-4 rotate-180" strokeWidth={1.75} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium" style={{ color: C.fg }}>
                    {l.desc}
                  </div>
                  <div className="text-[11.5px] mt-0.5" style={{ color: C.muted }}>
                    {l.data} · {l.tipo}
                  </div>
                </div>
                <div
                  className="text-[14px] font-semibold tabular-nums"
                  style={{ color: l.tipo === "Entrada" ? C.em : C.danger }}
                >
                  {l.tipo === "Saída" && "−"}
                  {l.valor}
                </div>
                <Badge label={l.status} color={l.status === "Recebido" || l.status === "Pago" ? C.em : C.warn} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MENSAGENS
══════════════════════════════════════════ */
function MensagensScreen({ convs, onSend }: { convs: any[]; onSend: (id: number, text: string) => void }) {
  const [active, setActive] = useState(0);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const conv = convs[active];
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [active, convs]);
  const send = () => {
    if (!draft.trim()) return;
    onSend(conv.id, draft.trim());
    setDraft("");
  };
  return (
    <div>
      <PageHeader eyebrow="Equipe" title="Mensagens" sub="Comunicação com clientes" />
      <Card className="flex overflow-hidden" style={{ height: 560 }}>
        <div className="w-[260px] shrink-0 flex flex-col" style={{ borderRight: `1px solid ${C.border}` }}>
          <div className="p-3" style={{ borderBottom: `1px solid ${C.border}` }}>
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-[12.5px]"
              style={{ background: C.hover, border: `1px solid ${C.border}`, color: C.muted }}
            >
              <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>Buscar…</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {convs.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActive(i)}
                className="w-full text-left px-4 py-3.5 transition-colors"
                style={{ background: active === i ? C.hover : "transparent", borderBottom: `1px solid ${C.border}` }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
                    style={{ background: `linear-gradient(135deg,${C.em},#00A87A)`, color: "#0D1612" }}
                  >
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold truncate" style={{ color: C.fg }}>
                        {c.name}
                      </span>
                      <span className="text-[10.5px] shrink-0 ml-2" style={{ color: C.muted }}>
                        {c.time}
                      </span>
                    </div>
                    <div className="text-[11.5px] truncate mt-0.5" style={{ color: C.muted }}>
                      {c.last}
                    </div>
                  </div>
                  {c.unread > 0 && (
                    <span
                      className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
                      style={{ background: C.em, color: "#0D1612" }}
                    >
                      {c.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="px-5 py-3.5 flex items-center gap-3" style={{ borderBottom: `1px solid ${C.border}` }}>
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-semibold"
              style={{ background: `linear-gradient(135deg,${C.em},#00A87A)`, color: "#0D1612" }}
            >
              {conv.name.charAt(0)}
            </div>
            <div>
              <div className="text-[13.5px] font-semibold" style={{ color: C.fg }}>
                {conv.name}
              </div>
              <div className="text-[11.5px]" style={{ color: C.muted }}>
                {conv.project}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {conv.msgs.map((m: Msg, i: number) => (
              <div key={i} className={`flex ${m.from === "Você" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[70%] rounded-2xl px-4 py-2.5 text-[13px]"
                  style={
                    m.from === "Você"
                      ? {
                          background: `linear-gradient(135deg,${C.em},#00A87A)`,
                          color: "#0D1612",
                          borderRadius: "1rem 1rem 2px 1rem",
                        }
                      : {
                          background: C.card,
                          color: C.fg,
                          border: `1px solid ${C.border}`,
                          borderRadius: "1rem 1rem 1rem 2px",
                        }
                  }
                >
                  <div>{m.text}</div>
                  <div className="text-[10.5px] mt-1" style={{ opacity: 0.6 }}>
                    {m.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="px-5 py-3.5 flex items-center gap-3" style={{ borderTop: `1px solid ${C.border}` }}>
            <input
              className="flex-1 rounded-xl px-4 py-2 text-[13px] outline-none"
              style={{ background: C.card, border: `1px solid ${C.border}`, color: C.fg }}
              placeholder="Escreva uma mensagem…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-opacity hover:opacity-90"
              style={{ background: `linear-gradient(135deg,${C.em},#00A87A)`, color: "#0D1612" }}
            >
              <Send className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Toggle({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className="relative h-6 w-10 rounded-full transition-colors"
      style={{ background: on ? C.em : C.border }}
    >
      <span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
        style={{ left: on ? "18px" : "2px" }}
      />
    </button>
  );
}

function ConfiguracoesScreen() {
  const [nome, setNome] = useState("Élise Marchand");
  const [email, setEmail] = useState("elise@mediaworld.com.br");
  const [empresa, setEmpresa] = useState("Media World");
  const [saved, setSaved] = useState(false);
  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader eyebrow="Sistema" title="Configurações" sub="Preferências da sua conta" />
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 px-6 pt-5 pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <User className="h-4 w-4" style={{ color: C.em }} strokeWidth={1.75} />
          <h2 className="text-[15px] font-semibold" style={{ color: C.fg }}>
            Perfil
          </h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center text-[18px] font-semibold"
              style={{ background: `linear-gradient(135deg,${C.em},#00A87A)`, color: "#0D1612" }}
            >
              {nome.charAt(0)}
            </div>
            <div>
              <div className="text-[14px] font-semibold" style={{ color: C.fg }}>
                {nome}
              </div>
              <div className="text-[12px]" style={{ color: C.muted }}>
                Produtora Executiva
              </div>
            </div>
          </div>
          {[
            ["Nome completo", nome, setNome],
            ["E-mail", email, setEmail],
            ["Produtora", empresa, setEmpresa],
          ].map(([l, v, fn]: any) => (
            <Field key={l} label={l}>
              <input
                className="w-full rounded-xl px-3 py-2 text-[13px] outline-none"
                style={{ background: C.hover, border: `1px solid ${C.border}`, color: C.fg }}
                value={v}
                onChange={(e) => fn(e.target.value)}
              />
            </Field>
          ))}
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 px-6 pt-5 pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <Lock className="h-4 w-4" style={{ color: C.em }} strokeWidth={1.75} />
          <h2 className="text-[15px] font-semibold" style={{ color: C.fg }}>
            Segurança
          </h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          {["Senha atual", "Nova senha", "Confirmar nova senha"].map((l) => (
            <Field key={l} label={l}>
              <input
                type="password"
                className="w-full rounded-xl px-3 py-2 text-[13px] outline-none"
                style={{ background: C.hover, border: `1px solid ${C.border}`, color: C.fg }}
                placeholder="••••••••"
              />
            </Field>
          ))}
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 px-6 pt-5 pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <Bell className="h-4 w-4" style={{ color: C.em }} strokeWidth={1.75} />
          <h2 className="text-[15px] font-semibold" style={{ color: C.fg }}>
            Notificações
          </h2>
        </div>
        <div className="px-6 py-2">
          {[
            { label: "Aprovações pendentes", desc: "Quando um projeto aguarda sua aprovação" },
            { label: "Novas mensagens", desc: "Quando clientes enviam mensagens" },
            { label: "Prazos próximos", desc: "48h antes de um prazo vencer" },
            { label: "Novos pagamentos", desc: "Quando uma fatura é paga" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3.5"
              style={{ borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}
            >
              <div>
                <div className="text-[13px] font-medium" style={{ color: C.fg }}>
                  {item.label}
                </div>
                <div className="text-[11.5px] mt-0.5" style={{ color: C.muted }}>
                  {item.desc}
                </div>
              </div>
              <Toggle defaultOn={i < 3} />
            </div>
          ))}
        </div>
      </Card>
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold shadow-lg transition-opacity hover:opacity-90"
          style={{ background: `linear-gradient(135deg,${C.em},#00A87A)`, color: "#0D1612" }}
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" strokeWidth={2.5} />
              Salvo!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" strokeWidth={1.75} />
              Salvar alterações
            </>
          )}
        </button>
        <button
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-medium"
          style={{ background: C.card, border: `1px solid ${C.border}`, color: C.muted }}
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          Sair
        </button>
      </div>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
  onSave,
  saveLabel = "Salvar",
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  onSave: () => void;
  saveLabel?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="rounded-2xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl"
        style={{ background: C.surface, border: `1px solid ${C.border}` }}
      >
        <div
          className="flex items-center justify-between px-6 pt-6 pb-4"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <h2 className="text-[17px] font-semibold" style={{ color: C.fg }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl flex items-center justify-center"
            style={{ color: C.muted, background: C.card }}
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">{children}</div>
        <div
          className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: `1px solid ${C.border}`, background: C.card }}
        >
          <button onClick={onClose} className="px-4 py-2 text-[13px] rounded-xl" style={{ color: C.muted }}>
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2 text-[13px] font-semibold rounded-xl shadow-lg hover:opacity-90"
            style={{ background: `linear-gradient(135deg,${C.em},#00A87A)`, color: "#0D1612" }}
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function MInput({ label, value, onChange, placeholder, type = "text", list }: any) {
  return (
    <Field label={label}>
      <input
        type={type}
        list={list}
        className="w-full rounded-xl px-3 py-2 text-[13px] outline-none"
        style={{ background: C.card, border: `1px solid ${C.border}`, color: C.fg }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}
function MSelect({ label, value, onChange, options }: any) {
  return (
    <Field label={label}>
      <select
        className="w-full rounded-xl px-3 py-2 text-[13px] outline-none"
        style={{ background: C.card, border: `1px solid ${C.border}`, color: C.fg }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o: string) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </Field>
  );
}

function ProjectModal({ editing, clients, onSave, onClose }: any) {
  const [f, setF] = useState({
    name: editing?.name ?? "",
    client: editing?.client ?? "",
    status: editing?.status ?? "Pré-produção",
    deadline: editing?.deadline ?? "",
    owner: editing?.owner ?? "",
    progress: editing?.progress ?? 0,
  });
  const s = (k: string, v: any) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Modal
      title={editing ? "Editar projeto" : "Novo projeto"}
      onClose={onClose}
      onSave={() => {
        if (f.name.trim()) onSave(f);
      }}
      saveLabel={editing ? "Salvar" : "Criar projeto"}
    >
      <MInput
        label="Nome"
        value={f.name}
        onChange={(v: string) => s("name", v)}
        placeholder="Ex: Nike — Campanha Verão"
      />
      <MInput
        label="Cliente"
        value={f.client}
        onChange={(v: string) => s("client", v)}
        placeholder="Nome do cliente"
        list="p-cl"
      />
      <datalist id="p-cl">
        {clients.map((c: Client) => (
          <option key={c.id} value={c.name} />
        ))}
      </datalist>
      <div className="grid grid-cols-2 gap-4">
        <MSelect label="Status" value={f.status} onChange={(v: string) => s("status", v)} options={STATUS_OPTIONS} />
        <MInput label="Prazo" value={f.deadline} onChange={(v: string) => s("deadline", v)} placeholder="Ex: 30 jun" />
      </div>
      <MInput label="Responsável" value={f.owner} onChange={(v: string) => s("owner", v)} placeholder="Nome" />
      <Field label={`Progresso — ${f.progress}%`}>
        <input
          type="range"
          min={0}
          max={100}
          value={f.progress}
          onChange={(e) => s("progress", Number(e.target.value))}
          className="w-full"
          style={{ accentColor: C.em }}
        />
      </Field>
    </Modal>
  );
}
function ClientModal({ editing, onSave, onClose }: any) {
  const [f, setF] = useState({
    name: editing?.name ?? "",
    project: editing?.project ?? "",
    status: editing?.status ?? "",
    last: editing?.last ?? "agora",
  });
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Modal
      title={editing ? "Editar cliente" : "Novo cliente"}
      onClose={onClose}
      onSave={() => {
        if (f.name.trim()) onSave(f);
      }}
      saveLabel={editing ? "Salvar" : "Adicionar"}
    >
      <MInput label="Nome" value={f.name} onChange={(v: string) => s("name", v)} placeholder="Ex: Nike Brasil" />
      <MInput
        label="Projeto atual"
        value={f.project}
        onChange={(v: string) => s("project", v)}
        placeholder="Nome do projeto"
      />
      <MInput label="Status" value={f.status} onChange={(v: string) => s("status", v)} placeholder="Ex: Em produção" />
    </Modal>
  );
}
function EntregaModal({ editing, projects, onSave, onClose }: any) {
  const [f, setF] = useState({
    project: editing?.project ?? "",
    client: editing?.client ?? "",
    file: editing?.file ?? "",
    status: editing?.status ?? "Pendente",
    date: editing?.date ?? "",
    size: editing?.size ?? "",
    urgent: editing?.urgent ?? false,
  });
  const s = (k: string, v: any) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Modal
      title={editing ? "Editar entrega" : "Nova entrega"}
      onClose={onClose}
      onSave={() => {
        if (f.project.trim()) onSave(f);
      }}
      saveLabel={editing ? "Salvar" : "Criar"}
    >
      <MInput
        label="Projeto"
        value={f.project}
        onChange={(v: string) => s("project", v)}
        placeholder="Nome do projeto"
        list="e-p"
      />
      <datalist id="e-p">
        {projects.map((p: Project) => (
          <option key={p.id} value={p.name} />
        ))}
      </datalist>
      <MInput label="Cliente" value={f.client} onChange={(v: string) => s("client", v)} placeholder="Nome do cliente" />
      <MInput
        label="Arquivo"
        value={f.file}
        onChange={(v: string) => s("file", v)}
        placeholder="Ex: Corte_Final_v3.mp4"
      />
      <div className="grid grid-cols-2 gap-4">
        <MSelect
          label="Status"
          value={f.status}
          onChange={(v: string) => s("status", v)}
          options={["Pendente", "Em revisão", "Aguardando aprovação", "Aprovado", "Enviado"]}
        />
        <MInput label="Prazo" value={f.date} onChange={(v: string) => s("date", v)} placeholder="Ex: 30 jun" />
      </div>
      <MInput label="Tamanho" value={f.size} onChange={(v: string) => s("size", v)} placeholder="Ex: 4.2 GB" />
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={f.urgent}
          onChange={(e) => s("urgent", e.target.checked)}
          style={{ accentColor: C.em }}
        />
        <span className="text-[13px]" style={{ color: C.fgDim }}>
          Urgente
        </span>
      </label>
    </Modal>
  );
}
function PropostaModal({ editing, clients, onSave, onClose }: any) {
  const [f, setF] = useState({
    title: editing?.title ?? "",
    client: editing?.client ?? "",
    value: editing?.value ?? "",
    status: editing?.status ?? "Rascunho",
    date: editing?.date ?? "",
  });
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Modal
      title={editing ? "Editar proposta" : "Nova proposta"}
      onClose={onClose}
      onSave={() => {
        if (f.title.trim()) onSave(f);
      }}
      saveLabel={editing ? "Salvar" : "Criar"}
    >
      <MInput
        label="Título"
        value={f.title}
        onChange={(v: string) => s("title", v)}
        placeholder="Ex: Campanha Verão 2026"
      />
      <MInput
        label="Cliente"
        value={f.client}
        onChange={(v: string) => s("client", v)}
        placeholder="Nome do cliente"
        list="pr-cl"
      />
      <datalist id="pr-cl">
        {clients.map((c: Client) => (
          <option key={c.id} value={c.name} />
        ))}
      </datalist>
      <MInput label="Valor" value={f.value} onChange={(v: string) => s("value", v)} placeholder="Ex: R$ 84.000" />
      <MSelect
        label="Status"
        value={f.status}
        onChange={(v: string) => s("status", v)}
        options={["Rascunho", "Enviada", "Em negociação", "Aprovada", "Recusada"]}
      />
    </Modal>
  );
}
function GravacaoModal({ editing, clients, onSave, onClose }: any) {
  const [f, setF] = useState({
    title: editing?.title ?? "",
    client: editing?.client ?? "",
    local: editing?.local ?? "",
    date: editing?.date ?? "",
    time: editing?.time ?? "",
    crew: editing?.crew ?? "",
  });
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Modal
      title={editing ? "Editar gravação" : "Agendar gravação"}
      onClose={onClose}
      onSave={() => {
        if (f.title.trim()) onSave(f);
      }}
      saveLabel={editing ? "Salvar" : "Agendar"}
    >
      <MInput label="Título" value={f.title} onChange={(v: string) => s("title", v)} placeholder="Ex: Gravação Nike" />
      <MInput
        label="Cliente"
        value={f.client}
        onChange={(v: string) => s("client", v)}
        placeholder="Nome do cliente"
        list="g-cl"
      />
      <datalist id="g-cl">
        {clients.map((c: Client) => (
          <option key={c.id} value={c.name} />
        ))}
      </datalist>
      <MInput label="Local" value={f.local} onChange={(v: string) => s("local", v)} placeholder="Ex: Studio A" />
      <div className="grid grid-cols-2 gap-4">
        <MInput label="Data" value={f.date} onChange={(v: string) => s("date", v)} placeholder="Ex: 20 jun" />
        <MInput label="Horário" value={f.time} onChange={(v: string) => s("time", v)} placeholder="Ex: 09:00" />
      </div>
      <MInput
        label="Equipe"
        value={f.crew}
        onChange={(v: string) => s("crew", v)}
        placeholder="Ex: Léon B., Margaux T."
      />
    </Modal>
  );
}
