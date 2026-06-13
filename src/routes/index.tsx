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
  ChevronDown,
  Filter,
  BarChart2,
  LogOut,
  User,
  Lock,
  Palette,
  Globe,
  Save,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Media World — Sistema de Produção Audiovisual" },
      { name: "description", content: "Sistema operacional para agências de produção audiovisual de alto padrão." },
    ],
  }),
  component: App,
});

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
interface Notification {
  id: number;
  text: string;
  type: "info" | "warn" | "alert";
  read: boolean;
  time: string;
}
interface Message {
  from: string;
  text: string;
  time: string;
}

const STATUS_OPTIONS: ProjectStatus[] = ["Pré-produção", "Gravação", "Edição", "Pós-produção", "Aprovação", "Entregue"];
const inputCls =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#111] transition-shadow";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11.5px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">{label}</label>
      {children}
    </div>
  );
}

function statusStyle(s: string) {
  const map: Record<string, string> = {
    "Pós-produção": "bg-[#eef2ff] text-[#3949ab] border-[#dde3fa]",
    Gravação: "bg-[#fff4e5] text-[#a8651f] border-[#f5e3c3]",
    "Pré-produção": "bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]",
    Aprovação: "bg-[#fef3c7] text-[#854d0e] border-[#fde68a]",
    Edição: "bg-[#ecfdf5] text-[#15803d] border-[#d1fae5]",
    Entregue: "bg-[#f5f5f5] text-[#525252] border-[#e5e5e5]",
  };
  return map[s] || "bg-[#f5f5f5] text-[#525252] border-[#e5e5e5]";
}

/* ══════════════ INITIAL DATA ══════════════ */
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
  {
    id: 5,
    project: "Dior — Couture FW26",
    client: "Christian Dior",
    file: "Dior_Roteiro_v1.pdf",
    status: "Aprovado",
    date: "03 jul",
    size: "2.4 MB",
    urgent: false,
  },
];
const initPropostas: Proposta[] = [
  { id: 1, title: "Campanha Verão 2026", client: "Nike Brasil", value: "R$ 84.000", status: "Enviada", date: "10 jun" },
  {
    id: 2,
    title: "Série documental — Sustentabilidade",
    client: "Natura & Co.",
    value: "R$ 210.000",
    status: "Em negociação",
    date: "08 jun",
  },
  {
    id: 3,
    title: "Conteúdo redes sociais Q3",
    client: "Havaianas",
    value: "R$ 36.500",
    status: "Aprovada",
    date: "05 jun",
  },
  {
    id: 4,
    title: "Filme institucional 2026",
    client: "Itaú BBA",
    value: "R$ 320.000",
    status: "Rascunho",
    date: "12 jun",
  },
  {
    id: 5,
    title: "Campanha lançamento produto",
    client: "Ambev",
    value: "R$ 155.000",
    status: "Recusada",
    date: "01 jun",
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
const initNotifications: Notification[] = [
  { id: 1, text: "Apple aprovou o corte final de Silence.", type: "info", read: false, time: "há 10min" },
  { id: 2, text: "Prazo de entrega Porsche em 4 dias.", type: "warn", read: false, time: "há 1h" },
  { id: 3, text: "Nova mensagem de Maison Hermès.", type: "info", read: false, time: "há 2h" },
  { id: 4, text: "Fatura de Hermès vence em 2 dias.", type: "alert", read: false, time: "há 3h" },
  { id: 5, text: "Dior enviou revisão do roteiro.", type: "info", read: true, time: "ontem" },
];
const initConvs: {
  id: number;
  name: string;
  project: string;
  last: string;
  time: string;
  unread: number;
  msgs: Message[];
}[] = [
  {
    id: 1,
    name: "Maison Hermès",
    project: "Carré 90",
    last: "Aprovado o grade final ✓",
    time: "14:32",
    unread: 2,
    msgs: [
      { from: "Hermès", text: "Olá! Podemos revisar o color grading da cena 3?", time: "14:10" },
      { from: "Você", text: "Claro, vou verificar agora e te retorno em breve.", time: "14:15" },
      { from: "Hermès", text: "Perfeito. O tom dourado ficou incrível!", time: "14:28" },
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
    msgs: [{ from: "Porsche", text: "Boa tarde! Quando ficam prontos os brutos?", time: "13:05" }],
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
  {
    id: 4,
    name: "Christian Dior",
    project: "Couture FW26",
    last: "Aguardando roteiro revisado",
    time: "ontem",
    unread: 0,
    msgs: [{ from: "Dior", text: "Aguardando roteiro revisado", time: "ontem" }],
  },
];

/* ══════════════ ROOT ══════════════ */
function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [projects, setProjects] = useState(initProjects);
  const [clients, setClients] = useState(initClients);
  const [entregas, setEntregas] = useState(initEntregas);
  const [propostas, setPropostas] = useState(initPropostas);
  const [gravacoes, setGravacoes] = useState(initGravacoes);
  const [notifications, setNotifications] = useState(initNotifications);
  const [convs, setConvs] = useState(initConvs);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  // Modals
  const [projectModal, setProjectModal] = useState<{ open: boolean; editing: Project | null }>({
    open: false,
    editing: null,
  });
  const [clientModal, setClientModal] = useState<{ open: boolean; editing: Client | null }>({
    open: false,
    editing: null,
  });
  const [entregaModal, setEntregaModal] = useState<{ open: boolean; editing: Entrega | null }>({
    open: false,
    editing: null,
  });
  const [propostaModal, setPropostaModal] = useState<{ open: boolean; editing: Proposta | null }>({
    open: false,
    editing: null,
  });
  const [gravacaoModal, setGravacaoModal] = useState<{ open: boolean; editing: Gravacao | null }>({
    open: false,
    editing: null,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Project CRUD
  const saveProject = (data: Omit<Project, "id">) => {
    if (projectModal.editing)
      setProjects((p) => p.map((x) => (x.id === projectModal.editing!.id ? { ...data, id: x.id } : x)));
    else setProjects((p) => [...p, { ...data, id: Date.now() }]);
    setProjectModal({ open: false, editing: null });
  };
  // Client CRUD
  const saveClient = (data: Omit<Client, "id">) => {
    if (clientModal.editing)
      setClients((c) => c.map((x) => (x.id === clientModal.editing!.id ? { ...data, id: x.id } : x)));
    else setClients((c) => [...c, { ...data, id: Date.now() }]);
    setClientModal({ open: false, editing: null });
  };
  // Entrega CRUD
  const saveEntrega = (data: Omit<Entrega, "id">) => {
    if (entregaModal.editing)
      setEntregas((e) => e.map((x) => (x.id === entregaModal.editing!.id ? { ...data, id: x.id } : x)));
    else setEntregas((e) => [...e, { ...data, id: Date.now() }]);
    setEntregaModal({ open: false, editing: null });
  };
  // Proposta CRUD
  const saveProposta = (data: Omit<Proposta, "id">) => {
    if (propostaModal.editing)
      setPropostas((p) => p.map((x) => (x.id === propostaModal.editing!.id ? { ...data, id: x.id } : x)));
    else setPropostas((p) => [...p, { ...data, id: Date.now() }]);
    setPropostaModal({ open: false, editing: null });
  };
  // Gravacao CRUD
  const saveGravacao = (data: Omit<Gravacao, "id">) => {
    if (gravacaoModal.editing)
      setGravacoes((g) => g.map((x) => (x.id === gravacaoModal.editing!.id ? { ...data, id: x.id } : x)));
    else setGravacoes((g) => [...g, { ...data, id: Date.now() }]);
    setGravacaoModal({ open: false, editing: null });
  };
  // Messages
  const sendMessage = (convId: number, text: string) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setConvs((prev) =>
      prev.map((c) =>
        c.id === convId ? { ...c, last: text, time, msgs: [...c.msgs, { from: "Você", text, time }] } : c,
      ),
    );
  };
  // Mark notifs read
  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, read: true })));

  // Search results
  const searchResults =
    searchQuery.length > 1
      ? [
          ...projects
            .filter(
              (p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.client.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .map((p) => ({ type: "Projeto", label: p.name, sub: p.client })),
          ...clients
            .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((c) => ({ type: "Cliente", label: c.name, sub: c.project })),
          ...propostas
            .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((p) => ({ type: "Proposta", label: p.title, sub: p.client })),
        ]
      : [];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="flex min-h-screen">
        <Sidebar
          current={screen}
          onNavigate={(s) => {
            setScreen(s);
            setShowSearch(false);
            setShowNotifs(false);
          }}
        />
        <main className="flex-1 min-w-0">
          <TopBar
            screen={screen}
            unreadCount={unreadCount}
            showNotifs={showNotifs}
            notifications={notifications}
            onToggleNotifs={() => {
              setShowNotifs((v) => !v);
              setShowSearch(false);
            }}
            onMarkAllRead={markAllRead}
            showSearch={showSearch}
            searchQuery={searchQuery}
            searchResults={searchResults}
            onToggleSearch={() => {
              setShowSearch((v) => !v);
              setShowNotifs(false);
            }}
            onSearchChange={setSearchQuery}
            onNewProject={() => setProjectModal({ open: true, editing: null })}
          />
          <div className="px-8 lg:px-10 py-8 lg:py-10 max-w-[1480px]">
            {screen === "dashboard" && (
              <DashboardScreen
                projects={projects}
                clients={clients}
                gravacoes={gravacoes}
                onNewProject={() => setProjectModal({ open: true, editing: null })}
                onNewClient={() => setClientModal({ open: true, editing: null })}
                onNewGravacao={() => setGravacaoModal({ open: true, editing: null })}
                onEditProject={(p: Project) => setProjectModal({ open: true, editing: p })}
                onDeleteProject={(id: number) => setProjects((p) => p.filter((x) => x.id !== id))}
                onEditClient={(c: Client) => setClientModal({ open: true, editing: c })}
                onDeleteClient={(id: number) => setClients((c) => c.filter((x) => x.id !== id))}
              />
            )}
            {screen === "clientes" && (
              <ClientesScreen
                clients={clients}
                onNew={() => setClientModal({ open: true, editing: null })}
                onEdit={(c: Client) => setClientModal({ open: true, editing: c })}
                onDelete={(id: number) => setClients((c) => c.filter((x) => x.id !== id))}
              />
            )}
            {screen === "projetos" && (
              <ProjetosScreen
                projects={projects}
                clients={clients}
                onNew={() => setProjectModal({ open: true, editing: null })}
                onEdit={(p: Project) => setProjectModal({ open: true, editing: p })}
                onDelete={(id: number) => setProjects((p) => p.filter((x) => x.id !== id))}
              />
            )}
            {screen === "pipeline" && <PipelineScreen projects={projects} />}
            {screen === "agenda" && (
              <AgendaScreen
                gravacoes={gravacoes}
                onNew={() => setGravacaoModal({ open: true, editing: null })}
                onEdit={(g: Gravacao) => setGravacaoModal({ open: true, editing: g })}
                onDelete={(id: number) => setGravacoes((g) => g.filter((x) => x.id !== id))}
              />
            )}
            {screen === "entregas" && (
              <EntregasScreen
                entregas={entregas}
                onNew={() => setEntregaModal({ open: true, editing: null })}
                onEdit={(e: Entrega) => setEntregaModal({ open: true, editing: e })}
                onDelete={(id: number) => setEntregas((e) => e.filter((x) => x.id !== id))}
              />
            )}
            {screen === "propostas" && (
              <PropostasScreen
                propostas={propostas}
                onNew={() => setPropostaModal({ open: true, editing: null })}
                onEdit={(p) => setPropostaModal({ open: true, editing: p })}
                onDelete={(id) => setPropostas((p) => p.filter((x) => x.id !== id))}
              />
            )}
            {screen === "financeiro" && <FinanceiroScreen />}
            {screen === "mensagens" && <MensagensScreen convs={convs} onSend={sendMessage} />}
            {screen === "configuracoes" && <ConfiguracoesScreen />}
          </div>
        </main>
      </div>

      {projectModal.open && (
        <ProjectModal
          editing={projectModal.editing}
          clients={clients}
          onSave={saveProject}
          onClose={() => setProjectModal({ open: false, editing: null })}
        />
      )}
      {clientModal.open && (
        <ClientModal
          editing={clientModal.editing}
          onSave={saveClient}
          onClose={() => setClientModal({ open: false, editing: null })}
        />
      )}
      {entregaModal.open && (
        <EntregaModal
          editing={entregaModal.editing}
          projects={projects}
          onSave={saveEntrega}
          onClose={() => setEntregaModal({ open: false, editing: null })}
        />
      )}
      {propostaModal.open && (
        <PropostaModal
          editing={propostaModal.editing}
          clients={clients}
          onSave={saveProposta}
          onClose={() => setPropostaModal({ open: false, editing: null })}
        />
      )}
      {gravacaoModal.open && (
        <GravacaoModal
          editing={gravacaoModal.editing}
          clients={clients}
          onSave={saveGravacao}
          onClose={() => setGravacaoModal({ open: false, editing: null })}
        />
      )}
    </div>
  );
}

/* ══════════════ SIDEBAR ══════════════ */
function Sidebar({ current, onNavigate }: { current: Screen; onNavigate: (s: Screen) => void }) {
  const sections = [
    {
      label: "Operação",
      items: [
        { icon: LayoutDashboard, label: "Visão geral", screen: "dashboard" as Screen },
        { icon: Clapperboard, label: "Projetos", screen: "projetos" as Screen, badge: "" },
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
    <aside className="w-[252px] shrink-0 border-r border-border bg-[#F8F8F8] sticky top-0 h-screen flex flex-col">
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-[#111111] flex items-center justify-center shadow-sm">
            <Film className="h-4 w-4 text-white" strokeWidth={1.75} />
          </div>
          <div className="leading-tight">
            <div className="text-[14px] font-semibold tracking-tight">Media World</div>
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
              Production Studio
            </div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-5 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.label}>
            <div className="px-3 mb-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80 font-semibold">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map(({ icon: Icon, label, screen, badge }: any) => {
                const active = current === screen;
                return (
                  <button
                    key={label}
                    onClick={() => onNavigate(screen)}
                    className={`group w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors ${active ? "bg-white text-foreground border border-border shadow-xs font-medium" : "text-[#444] hover:text-foreground hover:bg-white border border-transparent"}`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                    <span>{label}</span>
                    {badge && (
                      <span
                        className={`ml-auto text-[10.5px] font-semibold rounded-md px-1.5 py-0.5 ${active ? "bg-[#111] text-white" : "bg-[#eaeaea] text-[#444]"}`}
                      >
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <div className="rounded-xl bg-white border border-border p-3 shadow-xs flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#111] shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-medium truncate">Élise Marchand</div>
            <div className="text-[11px] text-muted-foreground truncate">Produtora Executiva</div>
          </div>
          <Settings className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.75} />
        </div>
      </div>
    </aside>
  );
}

/* ══════════════ TOPBAR ══════════════ */
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
  unreadCount,
  showNotifs,
  notifications,
  onToggleNotifs,
  onMarkAllRead,
  showSearch,
  searchQuery,
  searchResults,
  onToggleSearch,
  onSearchChange,
  onNewProject,
}: any) {
  const searchRef = useRef<HTMLDivElement>(null);
  const notifsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) onSearchChange("");
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node) && showNotifs) onToggleNotifs();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifs]);

  return (
    <div className="sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur-xl">
      <div className="flex items-center gap-6 px-8 lg:px-10 py-3.5">
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <span>Media World</span>
          <ChevronRight className="h-3 w-3" strokeWidth={1.75} />
          <span className="text-foreground font-medium">{screenLabels[screen]}</span>
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          {/* Search */}
          <div ref={searchRef} className="relative">
            <button
              onClick={onToggleSearch}
              className="hidden md:flex items-center gap-2.5 rounded-lg border border-border bg-white px-3.5 py-1.5 text-[12.5px] text-muted-foreground hover:text-foreground hover:border-[#d4d4d4] transition-colors shadow-xs w-[240px]"
            >
              <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
              {showSearch ? (
                <input
                  autoFocus
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  placeholder="Buscar…"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span>Buscar projetos, clientes…</span>
              )}
              <span className="ml-auto flex items-center gap-0.5 text-[10.5px] border border-border rounded px-1.5 py-0.5">
                <Command className="h-2.5 w-2.5" strokeWidth={2} />K
              </span>
            </button>
            {searchQuery.length > 1 && (
              <div className="absolute top-full left-0 mt-2 w-[320px] bg-white border border-border rounded-xl shadow-xl overflow-hidden z-50">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-6 text-center text-[13px] text-muted-foreground">
                    Nenhum resultado encontrado.
                  </div>
                ) : (
                  searchResults.map((r: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#fafafa] cursor-pointer transition-colors"
                    >
                      <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted-foreground w-14">
                        {r.type}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-medium text-foreground truncate">{r.label}</div>
                        <div className="text-[11.5px] text-muted-foreground truncate">{r.sub}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div ref={notifsRef} className="relative">
            <button
              onClick={onToggleNotifs}
              className="relative h-9 w-9 rounded-lg border border-border bg-white flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-xs"
            >
              <Bell className="h-4 w-4" strokeWidth={1.75} />
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#111]" />}
            </button>
            {showNotifs && (
              <div className="absolute top-full right-0 mt-2 w-[320px] bg-white border border-border rounded-xl shadow-xl overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="text-[13px] font-semibold">Notificações</span>
                  <button
                    onClick={onMarkAllRead}
                    className="text-[11.5px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Marcar todas como lidas
                  </button>
                </div>
                <div className="divide-y divide-border max-h-[320px] overflow-y-auto">
                  {notifications.map((n: Notification) => (
                    <div key={n.id} className={`flex items-start gap-3 px-4 py-3 ${n.read ? "opacity-50" : ""}`}>
                      <div
                        className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${n.type === "alert" ? "bg-[#fee2e2] text-[#b91c1c]" : n.type === "warn" ? "bg-[#fef3c7] text-[#854d0e]" : "bg-[#eef2ff] text-[#3949ab]"}`}
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
                        <div className="text-[12.5px] text-foreground">{n.text}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{n.time}</div>
                      </div>
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-[#111] shrink-0 mt-1.5" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onNewProject}
            className="flex items-center gap-2 rounded-lg bg-[#111] text-white px-3.5 py-2 text-[12.5px] font-semibold hover:bg-black transition-colors shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            Novo projeto
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ DASHBOARD ══════════════ */
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
    {
      label: "Clientes ativos",
      value: String(clients.length),
      delta: `${clients.length} cadastrados`,
      tone: "up",
      icon: Users,
    },
    {
      label: "Projetos em andamento",
      value: String(active),
      delta: `${projects.length} no total`,
      tone: "up",
      icon: Clapperboard,
    },
    {
      label: "Aguardando aprovação",
      value: String(pending),
      delta: pending > 0 ? "Sua atenção" : "Tudo ok",
      tone: pending > 0 ? "warn" : "neutral",
      icon: CheckCircle2,
    },
    { label: "Entregas realizadas", value: String(delivered), delta: "Concluídos", tone: "neutral", icon: Send },
    { label: "Gravações agendadas", value: String(gravacoes.length), delta: "Próximas", tone: "neutral", icon: Video },
    { label: "Faturamento do mês", value: "R$ 482.350", delta: "+18,4%", tone: "up", icon: TrendingUp },
    { label: "Pagamentos pendentes", value: "R$ 96.200", delta: "4 faturas", tone: "warn", icon: Wallet },
  ];
  return (
    <div className="space-y-10">
      <section className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-3">
            Visão geral · Quinta, 11 de junho de 2026
          </div>
          <h1 className="text-[40px] leading-[1.1] font-light tracking-[-0.025em]">Boa noite, Élise.</h1>
          <p className="text-[15px] text-muted-foreground mt-2 max-w-xl">Aqui está o panorama da operação hoje.</p>
        </div>
      </section>
      <section>
        <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-4">
          Indicadores principais
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div
                key={k.label}
                className="group rounded-2xl border border-border bg-white p-5 shadow-sm hover:shadow-md hover:border-[#d4d4d4] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">
                    {k.label}
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-[#f5f5f5] flex items-center justify-center group-hover:bg-[#111] group-hover:text-white transition-colors">
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="mt-4 text-[28px] font-semibold tracking-[-0.02em] tabular-nums leading-none">
                  {k.value}
                </div>
                <div
                  className={`mt-3 flex items-center gap-1 text-[11.5px] font-medium ${k.tone === "up" ? "text-[#1f7a4d]" : k.tone === "warn" ? "text-[#a8651f]" : "text-muted-foreground"}`}
                >
                  {k.tone === "up" && <ArrowUpRight className="h-3 w-3" strokeWidth={2} />}
                  {k.delta}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="rounded-2xl border border-border bg-[#fafafa] p-2 flex flex-wrap items-center gap-2">
        <div className="px-3 py-1.5 text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
          Ações rápidas
        </div>
        <div className="h-5 w-px bg-border mx-1" />
        {[
          { icon: Plus, label: "Novo projeto", onClick: onNewProject, primary: true },
          { icon: UserPlus, label: "Novo cliente", onClick: onNewClient, primary: false },
          { icon: Video, label: "Agendar gravação", onClick: onNewGravacao, primary: false },
          { icon: FileText, label: "Nova proposta", onClick: () => {}, primary: false },
        ].map(({ icon: Icon, label, onClick, primary }) => (
          <button
            key={label}
            onClick={onClick}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-all ${primary ? "bg-[#111] text-white hover:bg-black shadow-sm" : "bg-white text-foreground border border-border hover:border-[#d4d4d4] hover:shadow-sm"}`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            {label}
          </button>
        ))}
      </section>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <ProjectsTable projects={projects} onEdit={onEditProject} onDelete={onDeleteProject} />
          <PipelineMini projects={projects} />
          <ClientsTable clients={clients} onEdit={onEditClient} onDelete={onDeleteClient} />
        </div>
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <AgendaWidget gravacoes={gravacoes} />
          <DeadlinesWidget />
          <NotificationsWidget />
          <FinancialWidget />
        </div>
      </div>
    </div>
  );
}

/* ══════════════ CLIENTES ══════════════ */
function ClientesScreen({ clients, onNew, onEdit, onDelete }: any) {
  const [q, setQ] = useState("");
  const filtered = clients.filter((c: Client) => c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-2">
            Relacionamento
          </div>
          <h1 className="text-[32px] font-light tracking-[-0.025em]">Clientes</h1>
          <p className="text-[14px] text-muted-foreground mt-1">{clients.length} clientes ativos</p>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 rounded-lg bg-[#111] text-white px-4 py-2.5 text-[13px] font-semibold hover:bg-black transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Novo cliente
        </button>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3.5 py-2 text-[13px] text-muted-foreground w-full max-w-sm shadow-xs">
        <Search className="h-4 w-4" strokeWidth={1.75} />
        <input
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
          placeholder="Buscar cliente…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c: Client) => (
          <div
            key={c.id}
            className="group rounded-2xl border border-border bg-white p-5 shadow-sm hover:shadow-md hover:border-[#d4d4d4] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#3a3a3a] to-[#111] flex items-center justify-center text-white text-[14px] font-semibold shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <div className="text-[14px] font-semibold">{c.name}</div>
                  <div className="text-[12px] text-muted-foreground mt-0.5">{c.project}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(c)}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[#f0f0f0] transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] text-muted-foreground">Status</span>
                <span className="text-[12px] font-medium">{c.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] text-muted-foreground">Última interação</span>
                <span className="text-[12px] text-muted-foreground tabular-nums">{c.last}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 py-20 text-center text-[13px] text-muted-foreground">
            Nenhum cliente encontrado.
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════ PROJETOS ══════════════ */
function ProjetosScreen({ projects, clients, onNew, onEdit, onDelete }: any) {
  const [filter, setFilter] = useState("Todos");
  const [q, setQ] = useState("");
  const filtered = projects.filter(
    (p: Project) =>
      (filter === "Todos" || p.status === filter) &&
      (p.name.toLowerCase().includes(q.toLowerCase()) || p.client.toLowerCase().includes(q.toLowerCase())),
  );
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-2">
            Operação
          </div>
          <h1 className="text-[32px] font-light tracking-[-0.025em]">Projetos</h1>
          <p className="text-[14px] text-muted-foreground mt-1">{projects.length} projetos no total</p>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 rounded-lg bg-[#111] text-white px-4 py-2.5 text-[13px] font-semibold hover:bg-black transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Novo projeto
        </button>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 text-[13px] text-muted-foreground shadow-xs">
          <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
          <input
            className="bg-transparent outline-none placeholder:text-muted-foreground text-foreground w-40"
            placeholder="Buscar…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {["Todos", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${filter === s ? "bg-[#111] text-white" : "border border-border text-muted-foreground hover:text-foreground bg-white"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[13px] text-muted-foreground">Nenhum projeto encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground font-semibold bg-[#fafafa] border-b border-border">
                  <th className="px-6 py-3">Projeto</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Prazo</th>
                  <th className="px-4 py-3">Responsável</th>
                  <th className="px-6 py-3 w-[160px]">Progresso</th>
                  <th className="px-4 py-3 w-[80px]"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p: Project, i: number) => (
                  <tr
                    key={p.id}
                    className={`group hover:bg-[#fafafa] transition-colors ${i < filtered.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <td className="px-6 py-4 font-medium">{p.name}</td>
                    <td className="px-4 py-4 text-muted-foreground">{p.client}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex text-[11px] font-medium rounded-full border px-2.5 py-1 ${statusStyle(p.status)}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 tabular-nums">{p.deadline}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#3a3a3a] to-[#111]" />
                        <span className="text-muted-foreground">{p.owner}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#eee] rounded-full overflow-hidden">
                          <div className="h-full bg-[#111] rounded-full" style={{ width: `${p.progress}%` }} />
                        </div>
                        <span className="text-[11.5px] font-medium tabular-nums w-9 text-right">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(p)}
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[#f0f0f0] transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                        <button
                          onClick={() => onDelete(p.id)}
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════ PIPELINE ══════════════ */
function PipelineScreen({ projects }: any) {
  const stages: ProjectStatus[] = ["Pré-produção", "Gravação", "Edição", "Pós-produção", "Aprovação", "Entregue"];
  return (
    <div className="space-y-8">
      <div>
        <div className="text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-2">
          Comercial
        </div>
        <h1 className="text-[32px] font-light tracking-[-0.025em]">Pipeline de produção</h1>
        <p className="text-[14px] text-muted-foreground mt-1">Visão do funil por estágio</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stages.map((stage, i) => {
          const sp = projects.filter((p: Project) => p.status === stage);
          return (
            <div key={stage} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {stage}
                </span>
                <span className="text-[11px] font-semibold bg-[#eee] text-[#444] rounded-md px-1.5 py-0.5">
                  {sp.length}
                </span>
              </div>
              <div className="space-y-2 min-h-[120px]">
                {sp.map((p: Project) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-border bg-white p-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    <div className="text-[12.5px] font-semibold leading-snug">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">{p.client}</div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10.5px] text-muted-foreground">Progresso</span>
                        <span className="text-[10.5px] font-semibold tabular-nums">{p.progress}%</span>
                      </div>
                      <div className="h-1 bg-[#eee] rounded-full overflow-hidden">
                        <div className="h-full bg-[#111] rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[10.5px] text-muted-foreground">{p.deadline}</span>
                      <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#3a3a3a] to-[#111]" />
                    </div>
                  </div>
                ))}
                {sp.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border p-4 flex items-center justify-center">
                    <span className="text-[11px] text-muted-foreground/50">Vazio</span>
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

/* ══════════════ AGENDA ══════════════ */
function AgendaScreen({ gravacoes, onNew, onEdit, onDelete }: any) {
  const staticEvents = [
    {
      time: "09:00",
      title: "Kickoff — Porsche 911 GTS",
      type: "Reunião",
      client: "Porsche AG",
      local: "Google Meet",
      icon: Users,
      color: "bg-[#eef2ff] text-[#3949ab]",
    },
    {
      time: "14:00",
      title: "Chamada de aprovação — Apple",
      type: "Chamada",
      client: "Apple Originals",
      local: "Zoom",
      icon: Phone,
      color: "bg-[#f1f5f9] text-[#475569]",
    },
    {
      time: "16:00",
      title: "Entrega corte Dior",
      type: "Entrega",
      client: "Christian Dior",
      local: "Frame.io",
      icon: Send,
      color: "bg-[#ecfdf5] text-[#15803d]",
    },
  ];
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-2">
            Operação
          </div>
          <h1 className="text-[32px] font-light tracking-[-0.025em]">Agenda & Gravações</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Quinta, 11 de junho de 2026</p>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 rounded-lg bg-[#111] text-white px-4 py-2.5 text-[13px] font-semibold hover:bg-black transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Agendar gravação
        </button>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8 space-y-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
            Compromissos do dia
          </div>
          {staticEvents.map((e, i) => {
            const Icon = e.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="text-[13px] font-semibold tabular-nums w-12 pt-0.5 shrink-0">{e.time}</div>
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${e.color}`}>
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold">{e.title}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[12px] text-muted-foreground">{e.client}</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-[12px] text-muted-foreground">{e.local}</span>
                  </div>
                </div>
                <span className={`text-[11px] font-medium rounded-full px-2.5 py-1 border ${e.color}`}>{e.type}</span>
              </div>
            );
          })}
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mt-6">
            Gravações agendadas
          </div>
          {gravacoes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-[13px] text-muted-foreground">
              Nenhuma gravação agendada.
            </div>
          ) : (
            gravacoes.map((g: Gravacao) => (
              <div
                key={g.id}
                className="flex items-start gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="text-[13px] font-semibold tabular-nums w-12 pt-0.5 shrink-0">{g.time}</div>
                <div className="h-9 w-9 rounded-xl bg-[#fff4e5] text-[#a8651f] flex items-center justify-center shrink-0">
                  <Video className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold">{g.title}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[12px] text-muted-foreground">{g.client}</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-[12px] text-muted-foreground">{g.local}</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-[12px] text-muted-foreground">{g.date}</span>
                  </div>
                  <div className="text-[11.5px] text-muted-foreground mt-1">Equipe: {g.crew}</div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(g)}
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[#f0f0f0] transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                  <button
                    onClick={() => onDelete(g.id)}
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="col-span-12 xl:col-span-4">
          <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-3 border-b border-border">
              <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-1">
                Próximos
              </div>
              <h2 className="text-[16px] font-semibold tracking-[-0.015em]">Próximos eventos</h2>
            </div>
            {[
              { date: "13 jun", title: "Gravação campanha Dior", local: "Studio B" },
              { date: "15 jun", title: "Entrega final Apple — Silence", local: "Frame.io" },
              { date: "18 jun", title: "Reunião Natura — aprovação roteiro", local: "Zoom" },
              { date: "20 jun", title: "Gravação Porsche — externa SP", local: "São Paulo" },
            ].map((u, i) => (
              <div
                key={i}
                className="px-5 py-3.5 border-b border-border last:border-0 hover:bg-[#fafafa] transition-colors"
              >
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.1em] mb-1">
                  {u.date}
                </div>
                <div className="text-[13px] font-medium">{u.title}</div>
                <div className="text-[11.5px] text-muted-foreground mt-0.5">{u.local}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ ENTREGAS ══════════════ */
function EntregasScreen({ entregas, onNew, onEdit, onDelete }: any) {
  const statusE: Record<string, string> = {
    "Aguardando aprovação": "bg-[#fef3c7] text-[#854d0e] border-[#fde68a]",
    "Em revisão": "bg-[#eef2ff] text-[#3949ab] border-[#dde3fa]",
    Enviado: "bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]",
    Pendente: "bg-[#fff4e5] text-[#a8651f] border-[#f5e3c3]",
    Aprovado: "bg-[#ecfdf5] text-[#15803d] border-[#d1fae5]",
  };
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-2">
            Operação
          </div>
          <h1 className="text-[32px] font-light tracking-[-0.025em]">Entregas</h1>
          <p className="text-[14px] text-muted-foreground mt-1">{entregas.length} entregas ativas</p>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 rounded-lg bg-[#111] text-white px-4 py-2.5 text-[13px] font-semibold hover:bg-black transition-colors shadow-sm"
        >
          <Upload className="h-4 w-4" strokeWidth={2} />
          Nova entrega
        </button>
      </div>
      <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
        {entregas.length === 0 ? (
          <div className="py-16 text-center text-[13px] text-muted-foreground">Nenhuma entrega cadastrada.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground font-semibold bg-[#fafafa] border-b border-border">
                  <th className="px-6 py-3">Projeto</th>
                  <th className="px-4 py-3">Arquivo</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Prazo</th>
                  <th className="px-4 py-3">Tamanho</th>
                  <th className="px-4 py-3 w-[80px]"></th>
                </tr>
              </thead>
              <tbody>
                {entregas.map((e: Entrega, i: number) => (
                  <tr
                    key={e.id}
                    className={`group hover:bg-[#fafafa] transition-colors ${i < entregas.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium">{e.project}</div>
                      <div className="text-[11.5px] text-muted-foreground">{e.client}</div>
                    </td>
                    <td className="px-4 py-4 font-mono text-[12px] text-muted-foreground">{e.file}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex text-[11px] font-medium rounded-full border px-2.5 py-1 ${statusE[e.status] || "bg-[#f5f5f5] text-[#525252] border-[#e5e5e5]"}`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className={`px-4 py-4 tabular-nums font-medium ${e.urgent ? "text-[#b91c1c]" : ""}`}>
                      {e.date}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground tabular-nums">{e.size}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(e)}
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[#f0f0f0] transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                        <button
                          onClick={() => onDelete(e.id)}
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════ PROPOSTAS ══════════════ */
function PropostasScreen({ propostas, onNew, onEdit, onDelete }: any) {
  const statusP: Record<string, string> = {
    Enviada: "bg-[#eef2ff] text-[#3949ab] border-[#dde3fa]",
    "Em negociação": "bg-[#fff4e5] text-[#a8651f] border-[#f5e3c3]",
    Aprovada: "bg-[#ecfdf5] text-[#15803d] border-[#d1fae5]",
    Rascunho: "bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]",
    Recusada: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
  };
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-2">
            Comercial
          </div>
          <h1 className="text-[32px] font-light tracking-[-0.025em]">Propostas</h1>
          <p className="text-[14px] text-muted-foreground mt-1">
            {propostas.length} propostas · {propostas.filter((p: Proposta) => p.status === "Aprovada").length} aprovadas
          </p>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 rounded-lg bg-[#111] text-white px-4 py-2.5 text-[13px] font-semibold hover:bg-black transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Nova proposta
        </button>
      </div>
      <div className="space-y-3">
        {propostas.map((p: Proposta) => (
          <div
            key={p.id}
            className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm hover:shadow-md hover:border-[#d4d4d4] transition-all group cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-[#f5f5f5] flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold">{p.title}</div>
              <div className="text-[12px] text-muted-foreground mt-0.5">
                {p.client} · {p.date}
              </div>
            </div>
            <div className="text-[15px] font-semibold tabular-nums">{p.value}</div>
            <span className={`text-[11px] font-medium rounded-full border px-2.5 py-1 ${statusP[p.status] || ""}`}>
              {p.status}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(p)}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[#f0f0f0] transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
              <button
                onClick={() => onDelete(p.id)}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        ))}
        {propostas.length === 0 && (
          <div className="py-16 text-center text-[13px] text-muted-foreground">Nenhuma proposta cadastrada.</div>
        )}
      </div>
    </div>
  );
}

/* ══════════════ FINANCEIRO ══════════════ */
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
    { label: "Faturamento do mês", value: "R$ 482.350", delta: "+18,4%", tone: "up" },
    { label: "Despesas do mês", value: "R$ 68.400", delta: "+3,2%", tone: "warn" },
    { label: "Lucro líquido", value: "R$ 413.950", delta: "+22,1%", tone: "up" },
    { label: "A receber", value: "R$ 96.200", delta: "1 fatura", tone: "warn" },
  ];
  return (
    <div className="space-y-8">
      <div>
        <div className="text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-2">
          Financeiro
        </div>
        <h1 className="text-[32px] font-light tracking-[-0.025em]">Financeiro</h1>
        <p className="text-[14px] text-muted-foreground mt-1">Junho de 2026</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">{k.label}</div>
            <div className="mt-4 text-[26px] font-semibold tracking-[-0.02em] tabular-nums leading-none">{k.value}</div>
            <div
              className={`mt-3 flex items-center gap-1 text-[11.5px] font-medium ${k.tone === "up" ? "text-[#1f7a4d]" : "text-[#a8651f]"}`}
            >
              {k.tone === "up" && <ArrowUpRight className="h-3 w-3" strokeWidth={2} />}
              {k.delta}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1">
        {(["resumo", "lancamentos"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${tab === t ? "bg-[#111] text-white" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t === "resumo" ? "Resumo" : "Lançamentos"}
          </button>
        ))}
      </div>
      {tab === "resumo" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-white shadow-sm p-6">
            <div className="text-[13px] font-semibold mb-4">Receita vs Despesa</div>
            {[
              { label: "Receita", value: 482350, max: 612000, color: "bg-[#111]" },
              { label: "Despesa", value: 68400, max: 612000, color: "bg-[#e5e5e5]" },
              { label: "Previsto", value: 612000, max: 612000, color: "bg-[#d4d4d4]" },
            ].map((b) => (
              <div key={b.label} className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] text-muted-foreground">{b.label}</span>
                  <span className="text-[12px] font-semibold tabular-nums">R$ {b.value.toLocaleString("pt-BR")}</span>
                </div>
                <div className="h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                  <div className={`h-full ${b.color} rounded-full`} style={{ width: `${(b.value / b.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-white shadow-sm p-6">
            <div className="text-[13px] font-semibold mb-4">Status dos pagamentos</div>
            {[
              { label: "Recebidos", count: 2, total: 4, color: "text-[#15803d]" },
              { label: "Pendentes", count: 1, total: 4, color: "text-[#a8651f]" },
              { label: "Em atraso", count: 1, total: 4, color: "text-[#b91c1c]" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <span className="text-[13px] text-foreground">{s.label}</span>
                <span className={`text-[13px] font-semibold ${s.color}`}>{s.count} faturas</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "lancamentos" && (
        <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="divide-y divide-border">
            {lancamentos.map((l, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#fafafa] transition-colors">
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${l.tipo === "Entrada" ? "bg-[#ecfdf5] text-[#15803d]" : "bg-[#fef2f2] text-[#b91c1c]"}`}
                >
                  {l.tipo === "Entrada" ? (
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                  ) : (
                    <ArrowRight className="h-4 w-4 rotate-180" strokeWidth={1.75} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium">{l.desc}</div>
                  <div className="text-[11.5px] text-muted-foreground mt-0.5">
                    {l.data} · {l.tipo}
                  </div>
                </div>
                <div
                  className={`text-[14px] font-semibold tabular-nums ${l.tipo === "Entrada" ? "text-[#15803d]" : "text-[#b91c1c]"}`}
                >
                  {l.tipo === "Saída" && "−"}
                  {l.valor}
                </div>
                <span
                  className={`text-[11px] font-medium rounded-full border px-2.5 py-1 ${l.status === "Recebido" || l.status === "Pago" ? "bg-[#ecfdf5] text-[#15803d] border-[#d1fae5]" : "bg-[#fef3c7] text-[#854d0e] border-[#fde68a]"}`}
                >
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════ MENSAGENS ══════════════ */
function MensagensScreen({ convs, onSend }: { convs: any[]; onSend: (id: number, text: string) => void }) {
  const [active, setActive] = useState(0);
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conv = convs[active];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active, convs]);

  const send = () => {
    if (!draft.trim()) return;
    onSend(conv.id, draft.trim());
    setDraft("");
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-2">Equipe</div>
        <h1 className="text-[32px] font-light tracking-[-0.025em]">Mensagens</h1>
      </div>
      <div
        className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden flex"
        style={{ height: "560px" }}
      >
        <div className="w-[280px] shrink-0 border-r border-border flex flex-col">
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-[#fafafa] px-3 py-2 text-[12.5px] text-muted-foreground">
              <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>Buscar conversa…</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {convs.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActive(i)}
                className={`w-full text-left px-4 py-3.5 hover:bg-[#fafafa] transition-colors ${active === i ? "bg-[#f5f5f5]" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#3a3a3a] to-[#111] flex items-center justify-center text-white text-[12px] font-semibold shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold truncate">{c.name}</span>
                      <span className="text-[11px] text-muted-foreground shrink-0 ml-2">{c.time}</span>
                    </div>
                    <div className="text-[11.5px] text-muted-foreground truncate mt-0.5">{c.last}</div>
                  </div>
                  {c.unread > 0 && (
                    <span className="h-5 w-5 rounded-full bg-[#111] text-white text-[10px] font-semibold flex items-center justify-center shrink-0">
                      {c.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="px-5 py-3.5 border-b border-border flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3a3a3a] to-[#111] flex items-center justify-center text-white text-[11px] font-semibold">
              {conv.name.charAt(0)}
            </div>
            <div>
              <div className="text-[13.5px] font-semibold">{conv.name}</div>
              <div className="text-[11.5px] text-muted-foreground">{conv.project}</div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {conv.msgs.map((m: Message, i: number) => (
              <div key={i} className={`flex ${m.from === "Você" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-[13px] ${m.from === "Você" ? "bg-[#111] text-white rounded-br-sm" : "bg-[#f5f5f5] text-foreground rounded-bl-sm"}`}
                >
                  <div>{m.text}</div>
                  <div
                    className={`text-[10.5px] mt-1 ${m.from === "Você" ? "text-white/50" : "text-muted-foreground"}`}
                  >
                    {m.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="px-5 py-3.5 border-t border-border flex items-center gap-3">
            <input
              className={inputCls}
              placeholder="Escreva uma mensagem…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              className="h-9 w-9 rounded-lg bg-[#111] text-white flex items-center justify-center shrink-0 hover:bg-black transition-colors"
            >
              <Send className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ CONFIGURAÇÕES ══════════════ */
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
    <div className="space-y-8 max-w-2xl">
      <div>
        <div className="text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-2">
          Sistema
        </div>
        <h1 className="text-[32px] font-light tracking-[-0.025em]">Configurações</h1>
      </div>
      <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
            <h2 className="text-[15px] font-semibold">Perfil</h2>
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#111] flex items-center justify-center text-white text-[20px] font-semibold">
              {nome.charAt(0)}
            </div>
            <div>
              <div className="text-[14px] font-semibold">{nome}</div>
              <div className="text-[12px] text-muted-foreground">Produtora Executiva</div>
            </div>
          </div>
          <Field label="Nome completo">
            <input className={inputCls} value={nome} onChange={(e) => setNome(e.target.value)} />
          </Field>
          <Field label="E-mail">
            <input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Nome da produtora">
            <input className={inputCls} value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
          </Field>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
            <h2 className="text-[15px] font-semibold">Segurança</h2>
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          <Field label="Senha atual">
            <input type="password" className={inputCls} placeholder="••••••••" />
          </Field>
          <Field label="Nova senha">
            <input type="password" className={inputCls} placeholder="••••••••" />
          </Field>
          <Field label="Confirmar nova senha">
            <input type="password" className={inputCls} placeholder="••••••••" />
          </Field>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
            <h2 className="text-[15px] font-semibold">Notificações</h2>
          </div>
        </div>
        <div className="px-6 py-5 divide-y divide-border">
          {[
            { label: "Aprovações pendentes", desc: "Quando um projeto aguarda sua aprovação" },
            { label: "Novas mensagens", desc: "Quando clientes enviam mensagens" },
            { label: "Prazos próximos", desc: "48h antes de um prazo vencer" },
            { label: "Novos pagamentos", desc: "Quando uma fatura é paga" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3.5">
              <div>
                <div className="text-[13px] font-medium">{item.label}</div>
                <div className="text-[11.5px] text-muted-foreground mt-0.5">{item.desc}</div>
              </div>
              <Toggle defaultOn={i < 3} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          className="flex items-center gap-2 rounded-lg bg-[#111] text-white px-5 py-2.5 text-[13px] font-semibold hover:bg-black transition-colors shadow-sm"
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
        <button className="flex items-center gap-2 rounded-lg border border-border bg-white text-muted-foreground px-5 py-2.5 text-[13px] font-medium hover:text-foreground transition-colors shadow-xs">
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          Sair
        </button>
      </div>
    </div>
  );
}

function Toggle({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`relative h-6 w-10 rounded-full transition-colors ${on ? "bg-[#111]" : "bg-[#d4d4d4]"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`}
      />
    </button>
  );
}

/* ══════════════ MODALS ══════════════ */
function ModalShell({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-border shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-[#f5f5f5] transition-colors"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">{children}</div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-[#fafafa]">
          {footer}
        </div>
      </div>
    </div>
  );
}

function ProjectModal({ editing, clients, onSave, onClose }: any) {
  const [form, setForm] = useState({
    name: editing?.name ?? "",
    client: editing?.client ?? "",
    status: editing?.status ?? "Pré-produção",
    deadline: editing?.deadline ?? "",
    owner: editing?.owner ?? "",
    progress: editing?.progress ?? 0,
  });
  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <ModalShell
      title={editing ? "Editar projeto" : "Novo projeto"}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (form.name.trim()) onSave(form);
            }}
            className="px-5 py-2 text-[13px] font-semibold bg-[#111] text-white rounded-lg hover:bg-black transition-colors"
          >
            {editing ? "Salvar" : "Criar projeto"}
          </button>
        </>
      }
    >
      <Field label="Nome do projeto">
        <input
          className={inputCls}
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Ex: Nike — Campanha Verão"
        />
      </Field>
      <Field label="Cliente">
        <input
          className={inputCls}
          value={form.client}
          onChange={(e) => set("client", e.target.value)}
          list="cl-list"
          placeholder="Nome do cliente"
        />
        <datalist id="cl-list">
          {clients.map((c: Client) => (
            <option key={c.id} value={c.name} />
          ))}
        </datalist>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Status">
          <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Prazo">
          <input
            className={inputCls}
            value={form.deadline}
            onChange={(e) => set("deadline", e.target.value)}
            placeholder="Ex: 30 jun"
          />
        </Field>
      </div>
      <Field label="Responsável">
        <input
          className={inputCls}
          value={form.owner}
          onChange={(e) => set("owner", e.target.value)}
          placeholder="Nome do responsável"
        />
      </Field>
      <Field label={`Progresso — ${form.progress}%`}>
        <input
          type="range"
          min={0}
          max={100}
          value={form.progress}
          onChange={(e) => set("progress", Number(e.target.value))}
          className="w-full accent-[#111]"
        />
      </Field>
    </ModalShell>
  );
}

function ClientModal({ editing, onSave, onClose }: any) {
  const [form, setForm] = useState({
    name: editing?.name ?? "",
    project: editing?.project ?? "",
    status: editing?.status ?? "",
    last: editing?.last ?? "agora",
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <ModalShell
      title={editing ? "Editar cliente" : "Novo cliente"}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (form.name.trim()) onSave(form);
            }}
            className="px-5 py-2 text-[13px] font-semibold bg-[#111] text-white rounded-lg hover:bg-black transition-colors"
          >
            {editing ? "Salvar" : "Adicionar cliente"}
          </button>
        </>
      }
    >
      <Field label="Nome do cliente">
        <input
          className={inputCls}
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Ex: Nike Brasil"
        />
      </Field>
      <Field label="Projeto atual">
        <input
          className={inputCls}
          value={form.project}
          onChange={(e) => set("project", e.target.value)}
          placeholder="Nome do projeto"
        />
      </Field>
      <Field label="Status do relacionamento">
        <input
          className={inputCls}
          value={form.status}
          onChange={(e) => set("status", e.target.value)}
          placeholder="Ex: Em produção, Aguardando briefing…"
        />
      </Field>
    </ModalShell>
  );
}

function EntregaModal({ editing, projects, onSave, onClose }: any) {
  const [form, setForm] = useState({
    project: editing?.project ?? "",
    client: editing?.client ?? "",
    file: editing?.file ?? "",
    status: editing?.status ?? "Pendente",
    date: editing?.date ?? "",
    size: editing?.size ?? "",
    urgent: editing?.urgent ?? false,
  });
  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <ModalShell
      title={editing ? "Editar entrega" : "Nova entrega"}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (form.project.trim()) onSave(form);
            }}
            className="px-5 py-2 text-[13px] font-semibold bg-[#111] text-white rounded-lg hover:bg-black transition-colors"
          >
            {editing ? "Salvar" : "Criar entrega"}
          </button>
        </>
      }
    >
      <Field label="Projeto">
        <input
          className={inputCls}
          value={form.project}
          onChange={(e) => set("project", e.target.value)}
          list="proj-list"
          placeholder="Nome do projeto"
        />
        <datalist id="proj-list">
          {projects.map((p: Project) => (
            <option key={p.id} value={p.name} />
          ))}
        </datalist>
      </Field>
      <Field label="Cliente">
        <input
          className={inputCls}
          value={form.client}
          onChange={(e) => set("client", e.target.value)}
          placeholder="Nome do cliente"
        />
      </Field>
      <Field label="Nome do arquivo">
        <input
          className={inputCls}
          value={form.file}
          onChange={(e) => set("file", e.target.value)}
          placeholder="Ex: Corte_Final_v3.mp4"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Status">
          <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
            {["Pendente", "Em revisão", "Aguardando aprovação", "Aprovado", "Enviado"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Prazo">
          <input
            className={inputCls}
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            placeholder="Ex: 30 jun"
          />
        </Field>
      </div>
      <Field label="Tamanho do arquivo">
        <input
          className={inputCls}
          value={form.size}
          onChange={(e) => set("size", e.target.value)}
          placeholder="Ex: 4.2 GB"
        />
      </Field>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.urgent}
          onChange={(e) => set("urgent", e.target.checked)}
          className="accent-[#111]"
        />
        <span className="text-[13px] text-foreground">Marcar como urgente</span>
      </label>
    </ModalShell>
  );
}

function PropostaModal({ editing, clients, onSave, onClose }: any) {
  const [form, setForm] = useState({
    title: editing?.title ?? "",
    client: editing?.client ?? "",
    value: editing?.value ?? "",
    status: editing?.status ?? "Rascunho",
    date: editing?.date ?? "",
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <ModalShell
      title={editing ? "Editar proposta" : "Nova proposta"}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (form.title.trim()) onSave(form);
            }}
            className="px-5 py-2 text-[13px] font-semibold bg-[#111] text-white rounded-lg hover:bg-black transition-colors"
          >
            {editing ? "Salvar" : "Criar proposta"}
          </button>
        </>
      }
    >
      <Field label="Título da proposta">
        <input
          className={inputCls}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Ex: Campanha Verão 2026"
        />
      </Field>
      <Field label="Cliente">
        <input
          className={inputCls}
          value={form.client}
          onChange={(e) => set("client", e.target.value)}
          list="cl2-list"
          placeholder="Nome do cliente"
        />
        <datalist id="cl2-list">
          {clients.map((c: Client) => (
            <option key={c.id} value={c.name} />
          ))}
        </datalist>
      </Field>
      <Field label="Valor">
        <input
          className={inputCls}
          value={form.value}
          onChange={(e) => set("value", e.target.value)}
          placeholder="Ex: R$ 84.000"
        />
      </Field>
      <Field label="Status">
        <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
          {["Rascunho", "Enviada", "Em negociação", "Aprovada", "Recusada"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Field>
    </ModalShell>
  );
}

function GravacaoModal({ editing, clients, onSave, onClose }: any) {
  const [form, setForm] = useState({
    title: editing?.title ?? "",
    client: editing?.client ?? "",
    local: editing?.local ?? "",
    date: editing?.date ?? "",
    time: editing?.time ?? "",
    crew: editing?.crew ?? "",
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <ModalShell
      title={editing ? "Editar gravação" : "Agendar gravação"}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (form.title.trim()) onSave(form);
            }}
            className="px-5 py-2 text-[13px] font-semibold bg-[#111] text-white rounded-lg hover:bg-black transition-colors"
          >
            {editing ? "Salvar" : "Agendar"}
          </button>
        </>
      }
    >
      <Field label="Título">
        <input
          className={inputCls}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Ex: Gravação campanha Nike"
        />
      </Field>
      <Field label="Cliente">
        <input
          className={inputCls}
          value={form.client}
          onChange={(e) => set("client", e.target.value)}
          list="cl3-list"
          placeholder="Nome do cliente"
        />
        <datalist id="cl3-list">
          {clients.map((c: Client) => (
            <option key={c.id} value={c.name} />
          ))}
        </datalist>
      </Field>
      <Field label="Local">
        <input
          className={inputCls}
          value={form.local}
          onChange={(e) => set("local", e.target.value)}
          placeholder="Ex: Studio A, São Paulo"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Data">
          <input
            className={inputCls}
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            placeholder="Ex: 20 jun"
          />
        </Field>
        <Field label="Horário">
          <input
            className={inputCls}
            value={form.time}
            onChange={(e) => set("time", e.target.value)}
            placeholder="Ex: 09:00"
          />
        </Field>
      </div>
      <Field label="Equipe">
        <input
          className={inputCls}
          value={form.crew}
          onChange={(e) => set("crew", e.target.value)}
          placeholder="Ex: Léon B., Margaux T."
        />
      </Field>
    </ModalShell>
  );
}
