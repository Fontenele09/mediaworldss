import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import { toast } from "sonner";
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
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command as CommandRoot,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atelier — Sistema de Produção Audiovisual" },
      {
        name: "description",
        content: "Sistema operacional para agências de produção audiovisual de alto padrão.",
      },
    ],
  }),
  component: Dashboard,
});

/* ============================== Domain types ============================== */

type ProjectStatus = "Pré-produção" | "Gravação" | "Edição" | "Pós-produção" | "Aprovação" | "Entregue";

type Project = {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  deadline: string;
  owner: string;
  progress: number;
};

type Period = "Hoje" | "Semana" | "Mês";

type NavKey =
  | "overview"
  | "projects"
  | "clients"
  | "shoots"
  | "deliveries"
  | "proposals"
  | "financial"
  | "pipeline"
  | "calendar"
  | "messages"
  | "settings";

/* ================================ Seed data ================================ */

const initialProjects: Project[] = [
  { id: "p1", name: "Hermès — Carré 90", client: "Maison Hermès", status: "Pós-produção", deadline: "25 jun", owner: "Léon B.", progress: 72 },
  { id: "p2", name: "Porsche 911 GTS", client: "Porsche AG", status: "Gravação", deadline: "18 jun", owner: "Margaux T.", progress: 41 },
  { id: "p3", name: "Dior — Couture FW26", client: "Christian Dior", status: "Pré-produção", deadline: "03 jul", owner: "Carla V.", progress: 18 },
  { id: "p4", name: "Apple — Silence", client: "Apple Originals", status: "Aprovação", deadline: "15 jun", owner: "Élise M.", progress: 88 },
  { id: "p5", name: "Natura — Ekos", client: "Natura & Co.", status: "Edição", deadline: "22 jun", owner: "Rafael S.", progress: 56 },
];

/* ================================ Component ================================ */

function Dashboard() {
  // Global UI state
  const [activeNav, setActiveNav] = useState<NavKey>("overview");
  const [period, setPeriod] = useState<Period>("Hoje");
  const [searchOpen, setSearchOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Modal type for the unified "action" modal
  const [actionModal, setActionModal] = useState<null | "project" | "client" | "shoot" | "delivery" | "proposal">(null);

  // ⌘K to open palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleCreateProject = (data: { name: string; client: string }) => {
    const newP: Project = {
      id: `p${Date.now()}`,
      name: data.name,
      client: data.client,
      status: "Pré-produção",
      deadline: "—",
      owner: "Élise M.",
      progress: 0,
    };
    setProjects((p) => [newP, ...p]);
    toast.success("Projeto criado", { description: `${data.name} adicionado ao pipeline.` });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="flex min-h-screen">
        <Sidebar active={activeNav} onChange={setActiveNav} onOpenSearch={() => setSearchOpen(true)} />
        <main className="flex-1 min-w-0">
          <TopBar
            section={activeNav}
            onOpenSearch={() => setSearchOpen(true)}
            onNewProject={() => setActionModal("project")}
          />
          <div className="px-8 lg:px-10 py-8 lg:py-10 space-y-10 max-w-[1480px]">
            <Header period={period} onPeriodChange={setPeriod} />
            <KpiGrid />
            <QuickActions
              onNewProject={() => setActionModal("project")}
              onNewClient={() => setActionModal("client")}
              onNewShoot={() => setActionModal("shoot")}
              onNewDelivery={() => setActionModal("delivery")}
              onNewProposal={() => setActionModal("proposal")}
            />
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 xl:col-span-8 space-y-6">
                <RecentProjects
                  projects={projects}
                  onSelect={setSelectedProject}
                  onViewAll={() => {
                    setActiveNav("projects");
                    toast("Abrindo lista completa de projetos");
                  }}
                />
                <ProductionPipeline
                  projects={projects}
                  onOpen={() => {
                    setActiveNav("pipeline");
                    toast("Abrindo pipeline comercial");
                  }}
                />
                <ActiveClients
                  onViewAll={() => {
                    setActiveNav("clients");
                    toast("Abrindo lista de clientes");
                  }}
                />
              </div>
              <div className="col-span-12 xl:col-span-4 space-y-6">
                <TodayAgenda />
                <UpcomingDeadlines />
                <NotificationsCenter onNavigate={(key) => setActiveNav(key)} />
                <FinancialSummary onOpenReport={() => toast.success("Relatório financeiro gerado", { description: "Disponível em Financeiro › Relatórios." })} />
              </div>
            </div>
            <Footer />
          </div>
        </main>
      </div>

      {/* Command palette */}
      <CommandPalette
        open={searchOpen}
        onOpenChange={setSearchOpen}
        projects={projects}
        onPickProject={(p) => {
          setSearchOpen(false);
          setSelectedProject(p);
        }}
        onAction={(key) => {
          setSearchOpen(false);
          if (key === "new-project") setActionModal("project");
          if (key === "new-client") setActionModal("client");
          if (key === "new-shoot") setActionModal("shoot");
          if (key === "new-delivery") setActionModal("delivery");
          if (key === "new-proposal") setActionModal("proposal");
        }}
        onNavigate={(key) => {
          setSearchOpen(false);
          setActiveNav(key);
        }}
      />

      {/* Project detail */}
      <ProjectDetailDialog project={selectedProject} onClose={() => setSelectedProject(null)} />

      {/* Action modals */}
      <NewProjectDialog
        open={actionModal === "project"}
        onClose={() => setActionModal(null)}
        onSubmit={handleCreateProject}
      />
      <SimpleFormDialog
        open={actionModal === "client"}
        title="Novo cliente"
        description="Cadastre um novo cliente para iniciar relacionamento."
        fields={[
          { name: "name", label: "Razão social", placeholder: "Ex.: Maison Hermès" },
          { name: "contact", label: "Contato principal", placeholder: "nome@empresa.com" },
        ]}
        cta="Cadastrar cliente"
        onClose={() => setActionModal(null)}
        onSubmit={(d) => toast.success("Cliente cadastrado", { description: d.name })}
      />
      <SimpleFormDialog
        open={actionModal === "shoot"}
        title="Agendar gravação"
        description="Reserve studio, equipe e datas para uma nova gravação."
        fields={[
          { name: "project", label: "Projeto", placeholder: "Selecione um projeto" },
          { name: "date", label: "Data", placeholder: "DD/MM/AAAA", type: "date" },
          { name: "studio", label: "Estúdio / Locação", placeholder: "Studio A" },
        ]}
        cta="Confirmar agendamento"
        onClose={() => setActionModal(null)}
        onSubmit={(d) => toast.success("Gravação agendada", { description: `${d.project} · ${d.date}` })}
      />
      <SimpleFormDialog
        open={actionModal === "delivery"}
        title="Enviar entrega"
        description="Compartilhe o corte com o cliente em link seguro."
        fields={[
          { name: "project", label: "Projeto", placeholder: "Ex.: Apple — Silence" },
          { name: "version", label: "Versão", placeholder: "v3 — corte final" },
          { name: "email", label: "E-mail do cliente", placeholder: "cliente@marca.com" },
        ]}
        cta="Enviar entrega"
        onClose={() => setActionModal(null)}
        onSubmit={(d) => toast.success("Entrega enviada", { description: `${d.project} · ${d.version}` })}
      />
      <SimpleFormDialog
        open={actionModal === "proposal"}
        title="Gerar proposta"
        description="Crie uma proposta comercial em poucos cliques."
        fields={[
          { name: "client", label: "Cliente", placeholder: "Selecione o cliente" },
          { name: "title", label: "Título da proposta", placeholder: "Filme institucional 2026" },
          { name: "value", label: "Valor estimado (R$)", placeholder: "150.000", type: "number" },
        ]}
        cta="Gerar proposta"
        onClose={() => setActionModal(null)}
        onSubmit={(d) => toast.success("Proposta gerada", { description: `${d.title} · R$ ${d.value}` })}
      />
    </div>
  );
}

/* ================================== Sidebar ================================ */

const navSections: { label: string; items: { key: NavKey; icon: ComponentType<{ className?: string; strokeWidth?: number }>; label: string; badge?: string }[] }[] = [
  {
    label: "Operação",
    items: [
      { key: "overview", icon: LayoutDashboard, label: "Visão geral" },
      { key: "projects", icon: Clapperboard, label: "Projetos", badge: "12" },
      { key: "clients", icon: Users, label: "Clientes" },
      { key: "shoots", icon: Video, label: "Gravações" },
      { key: "deliveries", icon: Send, label: "Entregas", badge: "3" },
    ],
  },
  {
    label: "Comercial",
    items: [
      { key: "proposals", icon: FileText, label: "Propostas" },
      { key: "financial", icon: Wallet, label: "Financeiro" },
      { key: "pipeline", icon: TrendingUp, label: "Pipeline" },
    ],
  },
  {
    label: "Equipe",
    items: [
      { key: "calendar", icon: Calendar, label: "Agenda" },
      { key: "messages", icon: MessageSquare, label: "Mensagens", badge: "7" },
      { key: "settings", icon: Settings, label: "Configurações" },
    ],
  },
];

function Sidebar({
  active,
  onChange,
  onOpenSearch,
}: {
  active: NavKey;
  onChange: (k: NavKey) => void;
  onOpenSearch: () => void;
}) {
  return (
    <aside className="w-[252px] shrink-0 border-r border-border bg-[#F8F8F8] sticky top-0 h-screen flex flex-col">
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-[#111111] flex items-center justify-center shadow-sm">
            <Film className="h-4 w-4 text-white" strokeWidth={1.75} />
          </div>
          <div className="leading-tight">
            <div className="text-[14px] font-semibold tracking-tight text-foreground">Atelier</div>
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
              Production OS
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 mb-2">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-[12.5px] text-muted-foreground hover:text-foreground hover:border-[#d4d4d4] transition-colors shadow-xs"
        >
          <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span>Buscar…</span>
          <span className="ml-auto flex items-center gap-0.5 text-[10.5px] text-muted-foreground/80">
            <Command className="h-2.5 w-2.5" strokeWidth={2} />K
          </span>
        </button>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-5 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="px-3 mb-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80 font-semibold">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map(({ key, icon: Icon, label, badge }) => {
                const isActive = active === key;
                return (
                  <button
                    key={key}
                    onClick={() => onChange(key)}
                    className={`group w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors ${
                      isActive
                        ? "bg-white text-foreground border border-border shadow-xs font-medium"
                        : "text-[#444] hover:text-foreground hover:bg-white border border-transparent"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                    <span>{label}</span>
                    {badge && (
                      <span
                        className={`ml-auto text-[10.5px] font-semibold rounded-md px-1.5 py-0.5 ${
                          isActive ? "bg-[#111] text-white" : "bg-[#eaeaea] text-[#444]"
                        }`}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full rounded-xl bg-white border border-border p-3 shadow-xs flex items-center gap-3 hover:border-[#d4d4d4] transition-colors text-left">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#111] shrink-0 flex items-center justify-center text-white text-[12px] font-semibold">
                EM
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-medium truncate">Élise Marchand</div>
                <div className="text-[11px] text-muted-foreground truncate">Produtora Executiva</div>
              </div>
              <Settings className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.75} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Conta</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => toast("Perfil em breve")}>Meu perfil</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Preferências em breve")}>Preferências</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.success("Sessão encerrada")}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

/* ================================== TopBar ================================= */

const navLabels: Record<NavKey, string> = {
  overview: "Visão geral",
  projects: "Projetos",
  clients: "Clientes",
  shoots: "Gravações",
  deliveries: "Entregas",
  proposals: "Propostas",
  financial: "Financeiro",
  pipeline: "Pipeline",
  calendar: "Agenda",
  messages: "Mensagens",
  settings: "Configurações",
};

function TopBar({
  section,
  onOpenSearch,
  onNewProject,
}: {
  section: NavKey;
  onOpenSearch: () => void;
  onNewProject: () => void;
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur-xl">
      <div className="flex items-center gap-6 px-8 lg:px-10 py-3.5">
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <span>Workspace</span>
          <ChevronRight className="h-3 w-3" strokeWidth={1.75} />
          <span>Atelier</span>
          <ChevronRight className="h-3 w-3" strokeWidth={1.75} />
          <span className="text-foreground font-medium">{navLabels[section]}</span>
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-2.5 rounded-lg border border-border bg-white px-3.5 py-1.5 text-[12.5px] text-muted-foreground hover:text-foreground hover:border-[#d4d4d4] transition-colors shadow-xs w-[280px]"
          >
            <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>Buscar projetos, clientes, arquivos…</span>
            <span className="ml-auto flex items-center gap-0.5 text-[10.5px] border border-border rounded px-1.5 py-0.5">
              <Command className="h-2.5 w-2.5" strokeWidth={2} />K
            </span>
          </button>
          <NotificationsBell />
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

function NotificationsBell() {
  const items = [
    { title: "Apple — Silence aguarda sua aprovação", time: "há 5min" },
    { title: "Porsche AG enviou um novo briefing", time: "há 32min" },
    { title: "Entrega Hermès programada para hoje, 16h", time: "há 1h" },
    { title: "Margaux confirmou a gravação de amanhã", time: "há 2h" },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-9 w-9 rounded-lg border border-border bg-white flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[#d4d4d4] transition-colors shadow-xs">
          <Bell className="h-4 w-4" strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#111]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
          <div className="text-[12.5px] font-semibold">Notificações</div>
          <button
            onClick={() => toast.success("Marcadas como lidas")}
            className="text-[11px] text-muted-foreground hover:text-foreground"
          >
            Marcar todas como lidas
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {items.map((n, i) => (
            <button
              key={i}
              onClick={() => toast(n.title)}
              className="w-full text-left px-3 py-2.5 hover:bg-[#fafafa] transition-colors border-b border-border last:border-0"
            >
              <div className="text-[12.5px] text-foreground">{n.title}</div>
              <div className="text-[10.5px] text-muted-foreground mt-0.5">{n.time}</div>
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ================================== Header ================================= */

function Header({ period, onPeriodChange }: { period: Period; onPeriodChange: (p: Period) => void }) {
  const periods: Period[] = ["Hoje", "Semana", "Mês"];
  return (
    <section className="flex items-end justify-between gap-6 flex-wrap">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
            Visão geral · Sexta, 12 de junho de 2026
          </span>
        </div>
        <h1 className="text-[40px] leading-[1.1] font-light tracking-[-0.025em] text-foreground">
          Boa noite, Élise.
        </h1>
        <p className="text-[15px] text-muted-foreground mt-2 max-w-xl">
          Aqui está o panorama da operação — 12 projetos em andamento, 3 aguardando sua aprovação.
        </p>
      </div>
      <div className="flex items-center gap-1 text-[12.5px] rounded-lg border border-border bg-white p-1 shadow-xs">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => onPeriodChange(p)}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              period === p ? "bg-[#111] text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </section>
  );
}

/* ==================================== KPIs ================================= */

function KpiGrid() {
  const kpis = [
    { label: "Clientes ativos", value: "38", delta: "+4 este mês", tone: "up", icon: Users },
    { label: "Projetos em andamento", value: "12", delta: "+2 esta semana", tone: "up", icon: Clapperboard },
    { label: "Aguardando aprovação", value: "3", delta: "Sua atenção", tone: "warn", icon: CheckCircle2 },
    { label: "Entregas da semana", value: "7", delta: "2 hoje", tone: "neutral", icon: Send },
    { label: "Gravações agendadas", value: "5", delta: "Próximos 14 dias", tone: "neutral", icon: Video },
    { label: "Faturamento do mês", value: "R$ 482.350", delta: "+18,4% vs. mês anterior", tone: "up", icon: TrendingUp },
    { label: "Pagamentos pendentes", value: "R$ 96.200", delta: "4 faturas em aberto", tone: "warn", icon: Wallet },
  ];

  return (
    <section>
      <SectionHeader eyebrow="Visão geral" title="Indicadores principais" />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <button
              key={k.label}
              onClick={() => toast(k.label, { description: `${k.value} · ${k.delta}` })}
              className="group relative rounded-2xl border border-border bg-white p-5 shadow-sm hover:shadow-md hover:border-[#d4d4d4] hover:-translate-y-0.5 transition-all duration-300 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">
                  {k.label}
                </div>
                <div className="h-7 w-7 rounded-lg bg-[#f5f5f5] flex items-center justify-center text-foreground group-hover:bg-[#111] group-hover:text-white transition-colors">
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                </div>
              </div>
              <div className="mt-4 text-[28px] font-semibold tracking-[-0.02em] text-foreground tabular-nums leading-none">
                {k.value}
              </div>
              <div
                className={`mt-3 flex items-center gap-1 text-[11.5px] font-medium ${
                  k.tone === "up" ? "text-[#1f7a4d]" : k.tone === "warn" ? "text-[#a8651f]" : "text-muted-foreground"
                }`}
              >
                {k.tone === "up" && <ArrowUpRight className="h-3 w-3" strokeWidth={2} />}
                {k.delta}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* =============================== Quick actions ============================= */

function QuickActions({
  onNewProject,
  onNewClient,
  onNewShoot,
  onNewDelivery,
  onNewProposal,
}: {
  onNewProject: () => void;
  onNewClient: () => void;
  onNewShoot: () => void;
  onNewDelivery: () => void;
  onNewProposal: () => void;
}) {
  const actions = [
    { icon: Plus, label: "Novo projeto", onClick: onNewProject, primary: true },
    { icon: UserPlus, label: "Novo cliente", onClick: onNewClient },
    { icon: Video, label: "Agendar gravação", onClick: onNewShoot },
    { icon: Upload, label: "Enviar entrega", onClick: onNewDelivery },
    { icon: FileText, label: "Gerar proposta", onClick: onNewProposal },
  ];
  return (
    <section className="rounded-2xl border border-border bg-[#fafafa] p-2 flex flex-wrap items-center gap-2">
      <div className="px-3 py-1.5 text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
        Ações rápidas
      </div>
      <div className="h-5 w-px bg-border mx-1" />
      {actions.map(({ icon: Icon, label, onClick, primary }) => (
        <button
          key={label}
          onClick={onClick}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-all ${
            primary
              ? "bg-[#111] text-white hover:bg-black shadow-sm"
              : "bg-white text-foreground border border-border hover:border-[#d4d4d4] hover:shadow-sm"
          }`}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
          {label}
        </button>
      ))}
    </section>
  );
}

/* ============================ Recent projects ============================== */

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

function RecentProjects({
  projects,
  onSelect,
  onViewAll,
}: {
  projects: Project[];
  onSelect: (p: Project) => void;
  onViewAll: () => void;
}) {
  return (
    <section className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-1">
            Operação
          </div>
          <h2 className="text-[18px] font-semibold tracking-[-0.015em]">Projetos recentes</h2>
        </div>
        <button
          onClick={onViewAll}
          className="text-[12.5px] text-foreground font-medium flex items-center gap-1 hover:gap-1.5 transition-all"
        >
          Ver todos <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground font-semibold bg-[#fafafa] border-b border-border">
              <th className="px-6 py-3 font-semibold">Projeto</th>
              <th className="px-4 py-3 font-semibold">Cliente</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Prazo</th>
              <th className="px-4 py-3 font-semibold">Responsável</th>
              <th className="px-6 py-3 font-semibold w-[180px]">Progresso</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <tr
                key={p.id}
                onClick={() => onSelect(p)}
                className={`group hover:bg-[#fafafa] transition-colors cursor-pointer ${
                  i < projects.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <td className="px-6 py-4 font-medium text-foreground">{p.name}</td>
                <td className="px-4 py-4 text-muted-foreground">{p.client}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center text-[11px] font-medium rounded-full border px-2.5 py-1 ${statusStyle(p.status)}`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-foreground tabular-nums">{p.deadline}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#3a3a3a] to-[#111]" />
                    <span className="text-muted-foreground">{p.owner}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#eee] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#111] rounded-full transition-all"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <span className="text-[11.5px] text-foreground font-medium tabular-nums w-9 text-right">
                      {p.progress}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ============================ Production pipeline ========================== */

function ProductionPipeline({ projects, onOpen }: { projects: Project[]; onOpen: () => void }) {
  const stages = useMemo(() => {
    const fixed: { label: string; status?: ProjectStatus; base: number }[] = [
      { label: "Lead", base: 9 },
      { label: "Proposta", base: 6 },
      { label: "Pré-produção", status: "Pré-produção", base: 3 },
      { label: "Gravação", status: "Gravação", base: 2 },
      { label: "Edição", status: "Edição", base: 4 },
      { label: "Aprovação", status: "Aprovação", base: 2 },
      { label: "Entregue", status: "Entregue", base: 14 },
    ];
    return fixed.map((s) => ({
      label: s.label,
      count: s.base + (s.status ? projects.filter((p) => p.status === s.status).length : 0),
    }));
  }, [projects]);
  const max = Math.max(...stages.map((s) => s.count));

  return (
    <section className="rounded-2xl border border-border bg-white shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-1">
            Comercial · Operação
          </div>
          <h2 className="text-[18px] font-semibold tracking-[-0.015em]">Pipeline de produção</h2>
          <p className="text-[12.5px] text-muted-foreground mt-1">
            Quantidade de projetos por estágio do funil
          </p>
        </div>
        <button
          onClick={onOpen}
          className="text-[12.5px] text-foreground font-medium flex items-center gap-1 hover:gap-1.5 transition-all"
        >
          Abrir pipeline <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex items-stretch gap-2">
        {stages.map((s, i) => {
          const intensity = 0.25 + (s.count / max) * 0.75;
          return (
            <button
              key={s.label}
              onClick={() => toast(`${s.label}: ${s.count} projetos`)}
              className="flex-1 min-w-0 group text-left"
            >
              <div
                className="rounded-xl border border-border p-4 transition-all duration-300 hover:border-[#111] hover:shadow-md cursor-pointer h-full flex flex-col justify-between min-h-[120px]"
                style={{
                  background: `linear-gradient(180deg, rgba(17,17,17,${intensity * 0.06}) 0%, rgba(17,17,17,0.01) 100%)`,
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {i < stages.length - 1 && (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" strokeWidth={2} />
                  )}
                </div>
                <div>
                  <div className="text-[24px] font-semibold tracking-tight text-foreground tabular-nums leading-none">
                    {s.count}
                  </div>
                  <div className="text-[12px] text-foreground font-medium mt-1.5">{s.label}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ============================== Active clients ============================= */

function ActiveClients({ onViewAll }: { onViewAll: () => void }) {
  const clients = [
    { name: "Maison Hermès", project: "Carré 90", status: "Em produção", last: "há 2h" },
    { name: "Porsche AG", project: "911 Carrera GTS", status: "Gravando", last: "há 35min" },
    { name: "Christian Dior", project: "Couture FW26", status: "Reunião amanhã", last: "ontem" },
    { name: "Apple Originals", project: "Silence — long form", status: "Aguardando aprovação", last: "há 4h" },
    { name: "Natura & Co.", project: "Ekos — Filme institucional", status: "Edição", last: "há 1d" },
  ];

  return (
    <section className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-1">
            Relacionamento
          </div>
          <h2 className="text-[18px] font-semibold tracking-[-0.015em]">Clientes ativos</h2>
        </div>
        <button
          onClick={onViewAll}
          className="text-[12.5px] text-foreground font-medium flex items-center gap-1 hover:gap-1.5 transition-all"
        >
          Ver todos <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>
      <div className="divide-y divide-border">
        {clients.map((c) => (
          <button
            key={c.name}
            onClick={() => toast(c.name, { description: `${c.project} · ${c.status}` })}
            className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-[#fafafa] transition-colors group text-left"
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#3a3a3a] to-[#111] shrink-0 flex items-center justify-center text-white text-[12px] font-semibold">
              {c.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0 grid grid-cols-3 gap-4 items-center">
              <div>
                <div className="text-[13.5px] font-semibold text-foreground truncate">{c.name}</div>
                <div className="text-[11.5px] text-muted-foreground truncate">{c.project}</div>
              </div>
              <div className="text-[12.5px] text-foreground">{c.status}</div>
              <div className="text-[12px] text-muted-foreground text-right tabular-nums">
                Última interação · {c.last}
              </div>
            </div>
            <ArrowUpRight
              className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              strokeWidth={1.75}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

/* ============================== Today's agenda ============================= */

function TodayAgenda() {
  const items = [
    { time: "09:00", title: "Reunião — kickoff Porsche", type: "Reunião", icon: Users },
    { time: "11:30", title: "Gravação Studio A — Hermès", type: "Gravação", icon: Video },
    { time: "14:00", title: "Chamada com cliente — Apple", type: "Chamada", icon: Phone },
    { time: "16:00", title: "Entrega — corte Dior", type: "Entrega", icon: Send },
    { time: "18:30", title: "Prazo — proposta Natura", type: "Prazo", icon: Clock },
  ];
  return (
    <section className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-1">
            Hoje
          </div>
          <h2 className="text-[16px] font-semibold tracking-[-0.015em]">Agenda do dia</h2>
        </div>
        <Calendar className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
      </div>
      <ul className="divide-y divide-border">
        {items.map((i, idx) => {
          const Icon = i.icon;
          return (
            <li key={idx}>
              <button
                onClick={() => toast(i.title, { description: `${i.time} · ${i.type}` })}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#fafafa] transition-colors text-left"
              >
                <div className="text-[12px] font-semibold text-foreground tabular-nums w-12">{i.time}</div>
                <div className="h-7 w-7 rounded-lg bg-[#f5f5f5] flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5 text-foreground" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium text-foreground truncate">{i.title}</div>
                  <div className="text-[11px] text-muted-foreground">{i.type}</div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ============================ Upcoming deadlines =========================== */

function UpcomingDeadlines() {
  const deadlines = [
    { project: "Apple — Silence", task: "Aprovação do corte final", in: "Em 2 dias", urgent: true },
    { project: "Porsche 911 GTS", task: "Entrega dos brutos", in: "Em 4 dias", urgent: true },
    { project: "Hermès — Carré 90", task: "Color grading final", in: "Em 1 semana", urgent: false },
    { project: "Natura — Ekos", task: "Aprovação roteiro", in: "Em 10 dias", urgent: false },
  ];
  return (
    <section className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-1">
            Atenção
          </div>
          <h2 className="text-[16px] font-semibold tracking-[-0.015em]">Próximos prazos</h2>
        </div>
        <Clock className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
      </div>
      <ul className="divide-y divide-border">
        {deadlines.map((d, i) => (
          <li key={i}>
            <button
              onClick={() => toast(d.project, { description: `${d.task} · ${d.in}` })}
              className="w-full flex items-start gap-3 px-5 py-3.5 hover:bg-[#fafafa] transition-colors text-left"
            >
              <span
                className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                  d.urgent ? "bg-[#dc2626] pulse-soft" : "bg-[#d4d4d4]"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-medium text-foreground truncate">{d.project}</div>
                <div className="text-[11.5px] text-muted-foreground truncate mt-0.5">{d.task}</div>
              </div>
              <div
                className={`text-[11px] font-semibold whitespace-nowrap ${
                  d.urgent ? "text-[#b91c1c]" : "text-muted-foreground"
                }`}
              >
                {d.in}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* =========================== Notifications center ========================== */

function NotificationsCenter({ onNavigate }: { onNavigate: (k: NavKey) => void }) {
  const groups: { label: string; count: number; icon: ComponentType<{ className?: string; strokeWidth?: number }>; tone: "warn" | "alert" | "neutral"; nav: NavKey }[] = [
    { label: "Aprovações pendentes", count: 3, icon: CheckCircle2, tone: "warn", nav: "deliveries" },
    { label: "Novas mensagens", count: 7, icon: MessageSquare, tone: "neutral", nav: "messages" },
    { label: "Alterações em projetos", count: 4, icon: Clapperboard, tone: "neutral", nav: "projects" },
    { label: "Prazos próximos", count: 2, icon: Clock, tone: "alert", nav: "calendar" },
  ];
  return (
    <section className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-1">
            Inbox
          </div>
          <h2 className="text-[16px] font-semibold tracking-[-0.015em]">Central de notificações</h2>
        </div>
        <Bell className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
      </div>
      <ul>
        {groups.map((g, i) => {
          const Icon = g.icon;
          return (
            <li key={i}>
              <button
                onClick={() => {
                  onNavigate(g.nav);
                  toast(g.label, { description: `${g.count} item(ns)` });
                }}
                className="w-full flex items-center gap-3 px-5 py-3 border-b border-border last:border-0 hover:bg-[#fafafa] transition-colors cursor-pointer group text-left"
              >
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                    g.tone === "warn"
                      ? "bg-[#fef3c7] text-[#854d0e]"
                      : g.tone === "alert"
                        ? "bg-[#fee2e2] text-[#b91c1c]"
                        : "bg-[#f5f5f5] text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div className="flex-1 text-[12.5px] font-medium text-foreground">{g.label}</div>
                <span className="text-[11px] font-semibold rounded-md bg-[#111] text-white px-1.5 py-0.5 min-w-[22px] text-center">
                  {g.count}
                </span>
                <ChevronRight
                  className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  strokeWidth={2}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ============================ Financial summary ============================ */

function FinancialSummary({ onOpenReport }: { onOpenReport: () => void }) {
  const rows = [
    { label: "Faturamento do mês", value: "R$ 482.350", delta: "+18,4%" },
    { label: "Mês anterior", value: "R$ 407.420", delta: null },
    { label: "Pagamentos pendentes", value: "R$ 96.200", delta: "4 faturas" },
    { label: "Receita prevista", value: "R$ 612.000", delta: "+27%" },
  ];
  return (
    <section className="rounded-2xl border border-border bg-[#111] text-white shadow-md overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/10">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-white/50 font-semibold mb-1">
            Financeiro
          </div>
          <h2 className="text-[16px] font-semibold tracking-[-0.015em]">Resumo do mês</h2>
        </div>
        <CreditCard className="h-4 w-4 text-white/70" strokeWidth={1.75} />
      </div>
      <ul>
        {rows.map((r, i) => (
          <li key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 last:border-0">
            <div className="text-[12.5px] text-white/70">{r.label}</div>
            <div className="flex items-center gap-2">
              <div className="text-[14px] font-semibold tabular-nums">{r.value}</div>
              {r.delta && (
                <span className="text-[10.5px] font-semibold rounded-md bg-white/10 px-1.5 py-0.5 text-white/80">
                  {r.delta}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="px-5 py-3.5 bg-white/5">
        <button
          onClick={onOpenReport}
          className="w-full flex items-center justify-center gap-2 text-[12.5px] font-medium text-white hover:opacity-80 transition-opacity"
        >
          Abrir relatório financeiro
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}

/* ================================ Small atoms ============================== */

function SectionHeader({ eyebrow, title, caption }: { eyebrow?: string; title: string; caption?: string }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        {eyebrow && (
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-1.5">
            {eyebrow}
          </div>
        )}
        <h2 className="text-[20px] font-semibold tracking-[-0.02em]">{title}</h2>
        {caption && <div className="text-[12.5px] text-muted-foreground mt-1">{caption}</div>}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="pt-6 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#1f7a4d]" />
        Sistemas operacionais · Última sincronização há instantes
      </div>
      <div className="tabular-nums">v 2.4.1 · Atelier Production OS</div>
    </div>
  );
}

/* ============================== Command palette =========================== */

function CommandPalette({
  open,
  onOpenChange,
  projects,
  onPickProject,
  onAction,
  onNavigate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  projects: Project[];
  onPickProject: (p: Project) => void;
  onAction: (k: "new-project" | "new-client" | "new-shoot" | "new-delivery" | "new-proposal") => void;
  onNavigate: (k: NavKey) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Buscar</DialogTitle>
          <DialogDescription>Busca rápida e ações.</DialogDescription>
        </DialogHeader>
        <CommandRoot className="rounded-lg">
          <CommandInput placeholder="Buscar projetos, clientes, ações…" />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup heading="Ações rápidas">
              <CommandItem onSelect={() => onAction("new-project")}>
                <Plus className="h-3.5 w-3.5" /> Novo projeto
              </CommandItem>
              <CommandItem onSelect={() => onAction("new-client")}>
                <UserPlus className="h-3.5 w-3.5" /> Novo cliente
              </CommandItem>
              <CommandItem onSelect={() => onAction("new-shoot")}>
                <Video className="h-3.5 w-3.5" /> Agendar gravação
              </CommandItem>
              <CommandItem onSelect={() => onAction("new-delivery")}>
                <Upload className="h-3.5 w-3.5" /> Enviar entrega
              </CommandItem>
              <CommandItem onSelect={() => onAction("new-proposal")}>
                <FileText className="h-3.5 w-3.5" /> Gerar proposta
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Navegação">
              {(Object.keys(navLabels) as NavKey[]).map((k) => (
                <CommandItem key={k} onSelect={() => onNavigate(k)}>
                  <ChevronRight className="h-3.5 w-3.5" /> {navLabels[k]}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Projetos">
              {projects.map((p) => (
                <CommandItem key={p.id} onSelect={() => onPickProject(p)}>
                  <Clapperboard className="h-3.5 w-3.5" /> {p.name}
                  <span className="ml-auto text-[11px] text-muted-foreground">{p.client}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandRoot>
      </DialogContent>
    </Dialog>
  );
}

/* =========================== Project detail dialog ========================= */

function ProjectDetailDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  return (
    <Dialog open={!!project} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        {project && (
          <>
            <DialogHeader>
              <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-1">
                Projeto
              </div>
              <DialogTitle className="text-[22px] font-semibold tracking-[-0.02em]">
                {project.name}
              </DialogTitle>
              <DialogDescription>{project.client}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Stat label="Status" value={project.status} />
              <Stat label="Prazo" value={project.deadline} />
              <Stat label="Responsável" value={project.owner} />
              <Stat label="Progresso" value={`${project.progress}%`} />
            </div>
            <div>
              <div className="h-1.5 bg-[#eee] rounded-full overflow-hidden">
                <div className="h-full bg-[#111] rounded-full" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-2">
              <button
                onClick={() => {
                  toast("Mensagem enviada à equipe");
                  onClose();
                }}
                className="rounded-lg border border-border bg-white px-3.5 py-2 text-[12.5px] font-medium hover:border-[#d4d4d4]"
              >
                Mensagem à equipe
              </button>
              <button
                onClick={() => {
                  toast.success("Projeto aberto");
                  onClose();
                }}
                className="rounded-lg bg-[#111] text-white px-3.5 py-2 text-[12.5px] font-semibold hover:bg-black"
              >
                Abrir projeto
              </button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-[#fafafa] p-3">
      <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-1">
        {label}
      </div>
      <div className="text-[13.5px] font-medium text-foreground">{value}</div>
    </div>
  );
}

/* ============================== New project dialog ========================= */

function NewProjectDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (d: { name: string; client: string }) => void;
}) {
  const [name, setName] = useState("");
  const [client, setClient] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setClient("");
    }
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !client.trim()) {
      toast.error("Preencha nome e cliente.");
      return;
    }
    onSubmit({ name, client });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-1">
            Novo
          </div>
          <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">Novo projeto</DialogTitle>
          <DialogDescription>Crie um novo projeto e adicione ao pipeline.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <Field label="Nome do projeto" value={name} onChange={setName} placeholder="Ex.: Hermès — Carré 90" />
          <Field label="Cliente" value={client} onChange={setClient} placeholder="Ex.: Maison Hermès" />
          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-white px-3.5 py-2 text-[12.5px] font-medium hover:border-[#d4d4d4]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#111] text-white px-3.5 py-2 text-[12.5px] font-semibold hover:bg-black"
            >
              Criar projeto
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ============================ Generic form dialog ========================== */

function SimpleFormDialog({
  open,
  title,
  description,
  fields,
  cta,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  description: string;
  fields: { name: string; label: string; placeholder?: string; type?: string }[];
  cta: string;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) setValues({});
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    for (const f of fields) {
      if (!values[f.name]?.trim()) {
        toast.error(`Preencha ${f.label.toLowerCase()}.`);
        return;
      }
    }
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-1">
            Ação rápida
          </div>
          <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          {fields.map((f) => (
            <Field
              key={f.name}
              label={f.label}
              value={values[f.name] || ""}
              onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))}
              placeholder={f.placeholder}
              type={f.type}
            />
          ))}
          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-white px-3.5 py-2 text-[12.5px] font-medium hover:border-[#d4d4d4]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#111] text-white px-3.5 py-2 text-[12.5px] font-semibold hover:bg-black"
            >
              {cta}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-semibold mb-1.5">
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111] transition-colors shadow-xs"
      />
    </label>
  );
}
