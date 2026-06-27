import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { projectsApi, clientsApi, entregasApi, propostasApi, gravacoesApi, lancamentosApi, metasApi, type LancamentoRow, type MetaRow } from "@/hooks/use-data";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight, ArrowUpRight, Bell, Calendar, CheckCircle2,
  ChevronRight, Clapperboard, Clock, Command, CreditCard,
  FileText, Film, LayoutDashboard, MessageSquare, Phone,
  Plus, Search, Send, Settings, TrendingUp, Upload,
  UserPlus, Users, Video, Wallet, X, Pencil, Trash2,
  AlertCircle, Check, Info, Save, LogOut, Lock, User, Menu,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "MW Studio — Media World" },
      { name: "description", content: "Sistema interno de produção audiovisual — Media World." },
    ],
  }),
  component: App,
});

/* ── Paleta azul royal luxuoso ── */
const C = {
  bg:       "#0A0F1E",
  surface:  "#0F1629",
  card:     "#141E35",
  border:   "#1E2D4A",
  hover:    "#192440",
  em:       "#4F6EF7",
  emDim:    "#4F6EF720",
  emText:   "#4F6EF7",
  muted:    "#5A6E9A",
  fg:       "#E8EEFF",
  fgDim:    "#A0B0D8",
  warn:     "#F5A623",
  warnDim:  "#F5A62320",
  danger:   "#FF5252",
  dangerDim:"#FF525220",
  info:     "#00C8FF",
  infoDim:  "#00C8FF20",
};

type Screen = "dashboard"|"clientes"|"projetos"|"pipeline"|"agenda"|"entregas"|"propostas"|"financeiro"|"metas"|"mensagens"|"configuracoes";
type ProjectStatus = "Pré-produção"|"Gravação"|"Edição"|"Pós-produção"|"Aprovação"|"Entregue";

interface Project { id:string; name:string; client:string; status:ProjectStatus; deadline:string; owner:string; progress:number; }
interface Client  { id:string; name:string; project:string; status:string; last:string; }
interface Entrega { id:string; project:string; client:string; file:string; status:string; date:string; size:string; urgent:boolean; }
interface Proposta{ id:string; title:string; client:string; value:string; status:string; date:string; }
interface Gravacao{ id:string; title:string; client:string; local:string; date:string; time:string; crew:string; }
interface Notif   { id:number; text:string; type:"info"|"warn"|"alert"; read:boolean; time:string; }
interface Msg     { from:string; text:string; time:string; }
interface UserProfile { name:string; email:string; avatar:string|null; }

const STATUS_OPTIONS: ProjectStatus[] = ["Pré-produção","Gravação","Edição","Pós-produção","Aprovação","Entregue"];

const initConvs = [
  {id:1,name:"Maison Hermès",project:"Carré 90",last:"Aprovado o grade final ✓",time:"14:32",unread:2,msgs:[
    {from:"Hermès",text:"Podemos revisar o color grading da cena 3?",time:"14:10"},
    {from:"Você",text:"Claro, vou verificar agora.",time:"14:15"},
    {from:"Hermès",text:"Aprovado o grade final ✓",time:"14:32"},
  ]},
  {id:2,name:"Porsche AG",project:"911 GTS",last:"Quando ficam prontos os brutos?",time:"13:05",unread:1,msgs:[
    {from:"Porsche",text:"Quando ficam prontos os brutos?",time:"13:05"},
  ]},
  {id:3,name:"Apple Originals",project:"Silence",last:"Reunião amanhã às 14h?",time:"11:48",unread:4,msgs:[
    {from:"Apple",text:"Precisamos alinhar o corte final.",time:"11:40"},
    {from:"Você",text:"Pode ser amanhã de manhã?",time:"11:44"},
    {from:"Apple",text:"Reunião amanhã às 14h?",time:"11:48"},
  ]},
];

/* ── Helpers ── */
function Field({ label, children }: { label:string; children:React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label style={{color:C.muted}} className="text-[10.5px] font-semibold uppercase tracking-[0.14em]">{label}</label>
      {children}
    </div>
  );
}
function Badge({ label, color }: { label:string; color:string }) {
  return <span className="inline-flex items-center text-[10.5px] font-semibold rounded-full px-2.5 py-0.5 border" style={{background:`${color}18`,color,borderColor:`${color}35`}}>{label}</span>;
}
function statusColor(s:string) {
  const m: Record<string,string> = {"Pré-produção":C.muted,"Gravação":C.warn,"Edição":C.info,"Pós-produção":"#A78BFA","Aprovação":C.warn,"Entregue":C.em};
  return m[s]||C.muted;
}
function ProgressBar({ value }: { value:number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{background:C.border}}>
        <div className="h-full rounded-full transition-all" style={{width:`${value}%`,background:`linear-gradient(90deg,${C.em},#6B8EFF)`}} />
      </div>
      <span className="text-[11px] tabular-nums w-8 text-right" style={{color:C.fgDim}}>{value}%</span>
    </div>
  );
}
function Card({ children, className="", style }: { children:React.ReactNode; className?:string; style?:React.CSSProperties }) {
  return <div className={`rounded-2xl ${className}`} style={{background:C.card,border:`1px solid ${C.border}`,...style}}>{children}</div>;
}
function ActionButtons({ onEdit, onDelete }: { onEdit:()=>void; onDelete:()=>void }) {
  return (
    <div className="flex items-center gap-1 transition-opacity">
      <button onClick={onEdit} className="h-7 w-7 rounded-lg flex items-center justify-center" style={{color:C.muted}}
        onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color=C.fg}
        onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color=C.muted}>
        <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
      </button>
      <button onClick={onDelete} className="h-7 w-7 rounded-lg flex items-center justify-center" style={{color:C.muted}}
        onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color=C.danger}
        onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color=C.muted}>
        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
      </button>
    </div>
  );
}
function ListSkeleton() {
  return (
    <div className="space-y-3 mt-4">
      {[0,1,2].map(i=>(
        <div key={i} className="rounded-2xl h-20 animate-pulse" style={{background:C.card,border:`1px solid ${C.border}`}} />
      ))}
    </div>
  );
}
function ErrorRetry({ error, onRetry }: { error:any; onRetry:()=>void }) {
  return (
    <div className="rounded-2xl p-6 mt-4 text-center" style={{background:C.dangerDim,border:`1px solid ${C.danger}40`}}>
      <div className="text-[13px] font-medium mb-3" style={{color:C.danger}}>Erro ao carregar: {String(error?.message||error)}</div>
      <button onClick={onRetry} className="rounded-xl px-4 py-2 text-[12.5px] font-semibold" style={{background:C.danger,color:"#fff"}}>Tentar novamente</button>
    </div>
  );
}
function EmptyState({ icon:Icon, title, sub, actionLabel, onAction }: { icon:any; title:string; sub:string; actionLabel:string; onAction:()=>void }) {
  return (
    <div className="rounded-2xl p-10 text-center mt-4" style={{border:`1px dashed ${C.border}`,background:C.card}}>
      <div className="h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{background:C.emDim,color:C.em}}>
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <div className="text-[15px] font-semibold mb-1" style={{color:C.fg}}>{title}</div>
      <div className="text-[12.5px] mb-4" style={{color:C.muted}}>{sub}</div>
      <button onClick={onAction} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[12.5px] font-semibold" style={{background:`linear-gradient(135deg,${C.em},#6B8EFF)`,color:"#fff"}}>
        <Plus className="h-3.5 w-3.5" strokeWidth={2} />{actionLabel}
      </button>
    </div>
  );
}
function ConfirmModal({ msg, onCancel, onConfirm }: { msg:string; onCancel:()=>void; onConfirm:()=>void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4" style={{background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)"}} onClick={e=>{if(e.target===e.currentTarget)onCancel();}}>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden" style={{background:C.surface,border:`1px solid ${C.border}`}}>
        <div className="px-5 py-5">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-3" style={{background:C.dangerDim,color:C.danger}}>
            <AlertCircle className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="text-[15px] font-semibold mb-1" style={{color:C.fg}}>Confirmar exclusão</div>
          <div className="text-[13px]" style={{color:C.muted}}>{msg}</div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3" style={{background:C.card,borderTop:`1px solid ${C.border}`}}>
          <button onClick={onCancel} className="px-4 py-2 text-[13px] rounded-xl" style={{color:C.muted}}>Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 text-[13px] font-semibold rounded-xl" style={{background:C.danger,color:"#fff"}}>Excluir</button>
        </div>
      </div>
    </div>
  );
}
function PageHeader({ eyebrow, title, sub, action }: { eyebrow:string; title:string; sub:string; action?:React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-1" style={{color:C.em}}>{eyebrow}</div>
        <h1 className="text-[24px] md:text-[30px] font-light tracking-[-0.02em]" style={{color:C.fg}}>{title}</h1>
        <p className="text-[13px] mt-1" style={{color:C.muted}}>{sub}</p>
      </div>
      {action}
    </div>
  );
}
function Btn({ children, onClick }: { children:React.ReactNode; onClick?:()=>void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold shadow-lg transition-opacity hover:opacity-90 active:scale-95"
      style={{background:`linear-gradient(135deg,${C.em},#6B8EFF)`,color:"#fff"}}>
      {children}
    </button>
  );
}
function SearchBar({ value, onChange, placeholder }: { value:string; onChange:(v:string)=>void; placeholder:string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] w-full max-w-sm" style={{background:C.card,border:`1px solid ${C.border}`,color:C.muted}}>
      <Search className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      <input className="flex-1 bg-transparent outline-none placeholder:opacity-50" style={{color:C.fg}} placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)} />
    </div>
  );
}
function Avatar({ user, size=8 }: { user:UserProfile; size?:number }) {
  const px = size * 4;
  if (user.avatar) {
    return <img src={user.avatar} alt={user.name} className={`h-${size} w-${size} rounded-full object-cover shrink-0`} style={{width:px,height:px,borderRadius:"50%"}} />;
  }
  return (
    <div className={`h-${size} w-${size} rounded-full flex items-center justify-center font-semibold shrink-0`}
      style={{width:px,height:px,background:`linear-gradient(135deg,${C.em},#6B8EFF)`,color:"#fff",fontSize:px*0.35}}>
      {user.name.charAt(0).toUpperCase()}
    </div>
  );
}

/* ══════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════ */
function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({name:"",email:"",avatar:null});

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{
      if (data.user) {
        setUserProfile({
          name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split("@")[0] || "Usuário",
          email: data.user.email || "",
          avatar: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || null,
        });
      }
    });
  },[]);

  const projectsQ = projectsApi.useList();
  const clientsQ  = clientsApi.useList();
  const entregasQ = entregasApi.useList();
  const propostasQ= propostasApi.useList();
  const gravacoesQ= gravacoesApi.useList();
  const lancamentosQ = lancamentosApi.useList();
  const metasQ       = metasApi.useList();

  const projects  = (projectsQ.data  ?? []) as unknown as Project[];
  const clients   = (clientsQ.data   ?? []) as unknown as Client[];
  const entregas  = (entregasQ.data  ?? []) as unknown as Entrega[];
  const propostas = (propostasQ.data ?? []) as unknown as Proposta[];
  const gravacoes = (gravacoesQ.data ?? []) as unknown as Gravacao[];
  const lancamentos = (lancamentosQ.data ?? []) as LancamentoRow[];

  const saveProjectM   = projectsApi.useSave();
  const deleteProjectM = projectsApi.useRemove();
  const saveClientM    = clientsApi.useSave();
  const deleteClientM  = clientsApi.useRemove();
  const saveEntregaM   = entregasApi.useSave();
  const deleteEntregaM = entregasApi.useRemove();
  const savePropostaM  = propostasApi.useSave();
  const deletePropostaM= propostasApi.useRemove();
  const saveGravacaoM  = gravacoesApi.useSave();
  const deleteGravacaoM= gravacoesApi.useRemove();
  const saveLancamentoM  = lancamentosApi.useSave();
  const deleteLancamentoM= lancamentosApi.useRemove();

  const [notifs,   setNotifs]   = useState<Notif[]>([]);
  const [convs,    setConvs]    = useState(initConvs);
  const [searchQ,  setSearchQ]  = useState("");
  const [showSearch,setShowSearch] = useState(false);
  const [showNotifs,setShowNotifs] = useState(false);
  const [confirm, setConfirm] = useState<{open:boolean;msg:string;onConfirm:()=>void}>({open:false,msg:"",onConfirm:()=>{}});
  const askDelete = (msg:string, fn:()=>void) => setConfirm({open:true,msg,onConfirm:fn});

  const [projModal,   setProjModal]   = useState<{open:boolean;e:Project|null}>({open:false,e:null});
  const [clientModal, setClientModal] = useState<{open:boolean;e:Client|null}>({open:false,e:null});
  const [entregaModal,setEntregaModal]= useState<{open:boolean;e:Entrega|null}>({open:false,e:null});
  const [propModal,   setPropModal]   = useState<{open:boolean;e:Proposta|null}>({open:false,e:null});
  const [gravModal,   setGravModal]   = useState<{open:boolean;e:Gravacao|null}>({open:false,e:null});
  const [lancModal,   setLancModal]   = useState<{open:boolean;e:LancamentoRow|null}>({open:false,e:null});

  const unread = notifs.filter(n=>!n.read).length;

  // Auto-popular notificações a partir dos dados reais
  const notifSig = JSON.stringify({
    p: projects.map(p=>[p.id,p.status]),
    e: entregas.map(e=>[e.id,e.urgent]),
    l: lancamentos.map(l=>[l.id,l.tipo,l.status]),
  });
  useEffect(()=>{
    const list: Notif[] = [];
    let id = 1;
    projects.filter(p=>p.status==="Aprovação").forEach(p=>list.push({id:id++,type:"warn",text:`Aprovação pendente: ${p.name}`,read:false,time:"agora"}));
    entregas.filter(e=>e.urgent).forEach(e=>list.push({id:id++,type:"alert",text:`Entrega urgente: ${e.project}`,read:false,time:"agora"}));
    lancamentos.filter(l=>l.tipo==="Entrada"&&l.status==="Pendente").forEach(l=>list.push({id:id++,type:"info",text:`A receber: ${l.descricao}`,read:false,time:"agora"}));
    setNotifs(list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[notifSig]);

  const saveProject  = async (d:Omit<Project,"id">)  => { await saveProjectM.mutateAsync(projModal.e?{...d,id:projModal.e.id}:d);    setProjModal({open:false,e:null}); };
  const saveClient   = async (d:Omit<Client,"id">)   => { await saveClientM.mutateAsync(clientModal.e?{...d,id:clientModal.e.id}:d); setClientModal({open:false,e:null}); };
  const saveEntrega  = async (d:Omit<Entrega,"id">)  => { await saveEntregaM.mutateAsync(entregaModal.e?{...d,id:entregaModal.e.id}:d); setEntregaModal({open:false,e:null}); };
  const saveProposta = async (d:Omit<Proposta,"id">) => { await savePropostaM.mutateAsync(propModal.e?{...d,id:propModal.e.id}:d);   setPropModal({open:false,e:null}); };
  const saveGravacao = async (d:Omit<Gravacao,"id">) => { await saveGravacaoM.mutateAsync(gravModal.e?{...d,id:gravModal.e.id}:d);   setGravModal({open:false,e:null}); };
  const saveLancamento = async (d:Omit<LancamentoRow,"id">) => { await saveLancamentoM.mutateAsync(lancModal.e?{...d,id:lancModal.e.id}:d as any); setLancModal({open:false,e:null}); };

  const delProject  = (id:string) => askDelete("Excluir este projeto? Esta ação não pode ser desfeita.",   ()=>deleteProjectM.mutate(id));
  const delClient   = (id:string) => askDelete("Excluir este cliente? Esta ação não pode ser desfeita.",   ()=>deleteClientM.mutate(id));
  const delEntrega  = (id:string) => askDelete("Excluir esta entrega? Esta ação não pode ser desfeita.",  ()=>deleteEntregaM.mutate(id));
  const delProposta = (id:string) => askDelete("Excluir esta proposta? Esta ação não pode ser desfeita.", ()=>deletePropostaM.mutate(id));
  const delGravacao = (id:string) => askDelete("Excluir esta gravação? Esta ação não pode ser desfeita.", ()=>deleteGravacaoM.mutate(id));
  const delLancamento = (id:string) => askDelete("Excluir este lançamento? Esta ação não pode ser desfeita.", ()=>deleteLancamentoM.mutate(id));

  const sendMsg = (cid:number,text:string) => {
    const now=new Date(); const t=`${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
    setConvs(p=>p.map(c=>c.id===cid?{...c,last:text,time:t,msgs:[...c.msgs,{from:"Você",text,time:t}]}:c));
  };

  const handleSignOut = async () => { await supabase.auth.signOut(); window.location.href="/auth"; };

  const searchResults = searchQ.length>1 ? [
    ...projects.filter(p=>p.name.toLowerCase().includes(searchQ.toLowerCase())||p.client.toLowerCase().includes(searchQ.toLowerCase())).map(p=>({type:"Projeto",label:p.name,sub:p.client})),
    ...clients.filter(c=>c.name.toLowerCase().includes(searchQ.toLowerCase())).map(c=>({type:"Cliente",label:c.name,sub:c.project})),
  ] : [];

  const nav=(s:Screen)=>{ setScreen(s); setShowSearch(false); setShowNotifs(false); setSidebarOpen(false); };

  const renderScreen = (q:any, screenEl:React.ReactNode) => {
    if (q.isLoading) return <ListSkeleton />;
    if (q.error) return <ErrorRetry error={q.error} onRetry={()=>q.refetch()} />;
    return screenEl;
  };


  return (
    <div style={{background:C.bg,color:C.fg,minHeight:"100vh",fontFamily:"Inter,sans-serif"}}>
      <div className="flex min-h-screen">
        <div className="hidden lg:block">
          <Sidebar current={screen} onNavigate={nav} user={userProfile} onSignOut={handleSignOut} />
        </div>
        {sidebarOpen&&(
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={()=>setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full">
              <Sidebar current={screen} onNavigate={nav} user={userProfile} onSignOut={handleSignOut} />
            </div>
          </div>
        )}
        <main className="flex-1 min-w-0 flex flex-col">
          <TopBar screen={screen} unread={unread} notifs={notifs} showNotifs={showNotifs}
            onToggleNotifs={()=>{setShowNotifs(v=>!v);setShowSearch(false);}}
            onMarkRead={()=>setNotifs(n=>n.map(x=>({...x,read:true})))}
            showSearch={showSearch} searchQ={searchQ} searchResults={searchResults}
            onToggleSearch={()=>{setShowSearch(v=>!v);setShowNotifs(false);}}
            onSearchChange={setSearchQ}
            onNewProject={()=>setProjModal({open:true,e:null})}
            onMenuOpen={()=>setSidebarOpen(true)}
            user={userProfile}
          />
          <div className="flex-1 px-4 md:px-8 py-6 md:py-8 max-w-[1480px] w-full pb-24 lg:pb-8">
            {screen==="dashboard"    && <DashboardScreen projects={projects} clients={clients} gravacoes={gravacoes} entregas={entregas} lancamentos={lancamentos} onNewProject={()=>setProjModal({open:true,e:null})} onNewClient={()=>setClientModal({open:true,e:null})} onNewGravacao={()=>setGravModal({open:true,e:null})} onEditProject={(p:any)=>setProjModal({open:true,e:p})} onDeleteProject={delProject} onEditClient={(c:any)=>setClientModal({open:true,e:c})} onDeleteClient={delClient} user={userProfile} />}
            {screen==="clientes"     && renderScreen(clientsQ,  <ClientesScreen clients={clients} onNew={()=>setClientModal({open:true,e:null})} onEdit={(c:any)=>setClientModal({open:true,e:c})} onDelete={delClient} />)}
            {screen==="projetos"     && renderScreen(projectsQ, <ProjetosScreen projects={projects} clients={clients} onNew={()=>setProjModal({open:true,e:null})} onEdit={(p:any)=>setProjModal({open:true,e:p})} onDelete={delProject} />)}
            {screen==="pipeline"     && renderScreen(projectsQ, <PipelineScreen projects={projects} />)}
            {screen==="agenda"       && renderScreen(gravacoesQ,<AgendaScreen gravacoes={gravacoes} clients={clients} onNew={()=>setGravModal({open:true,e:null})} onEdit={(g:any)=>setGravModal({open:true,e:g})} onDelete={delGravacao} />)}
            {screen==="entregas"     && renderScreen(entregasQ, <EntregasScreen entregas={entregas} projects={projects} onNew={()=>setEntregaModal({open:true,e:null})} onEdit={(e:any)=>setEntregaModal({open:true,e:e})} onDelete={delEntrega} />)}
            {screen==="propostas"    && renderScreen(propostasQ,<PropostasScreen propostas={propostas} clients={clients} onNew={()=>setPropModal({open:true,e:null})} onEdit={(p:any)=>setPropModal({open:true,e:p})} onDelete={delProposta} />)}
            {screen==="financeiro"   && renderScreen(lancamentosQ,<FinanceiroScreen lancamentos={lancamentos} onNew={()=>setLancModal({open:true,e:null})} onEdit={(l:LancamentoRow)=>setLancModal({open:true,e:l})} onDelete={delLancamento} />)}
            {screen==="mensagens"    && <MensagensScreen convs={convs} onSend={sendMsg} />}
            {screen==="configuracoes"&& <ConfiguracoesScreen user={userProfile} onSignOut={handleSignOut} />}
          </div>
          <MobileNav current={screen} onNavigate={nav} />
        </main>
      </div>
      {projModal.open    && <ProjectModal   editing={projModal.e}    clients={clients}   onSave={saveProject}  onClose={()=>setProjModal({open:false,e:null})} />}
      {clientModal.open  && <ClientModal    editing={clientModal.e}                      onSave={saveClient}   onClose={()=>setClientModal({open:false,e:null})} />}
      {entregaModal.open && <EntregaModal   editing={entregaModal.e} projects={projects} onSave={saveEntrega}  onClose={()=>setEntregaModal({open:false,e:null})} />}
      {propModal.open    && <PropostaModal  editing={propModal.e}    clients={clients}   onSave={saveProposta} onClose={()=>setPropModal({open:false,e:null})} />}
      {gravModal.open    && <GravacaoModal  editing={gravModal.e}    clients={clients}   onSave={saveGravacao} onClose={()=>setGravModal({open:false,e:null})} />}
      {lancModal.open    && <LancamentoModal editing={lancModal.e}                       onSave={saveLancamento} onClose={()=>setLancModal({open:false,e:null})} />}
      {confirm.open && <ConfirmModal msg={confirm.msg} onCancel={()=>setConfirm({open:false,msg:"",onConfirm:()=>{}})} onConfirm={()=>{confirm.onConfirm(); setConfirm({open:false,msg:"",onConfirm:()=>{}});}} />}
    </div>
  );
}

/* ══ MOBILE NAV ══ */
function MobileNav({ current, onNavigate }: { current:Screen; onNavigate:(s:Screen)=>void }) {
  const items = [
    {icon:LayoutDashboard,label:"Início",    screen:"dashboard"  as Screen},
    {icon:Clapperboard,   label:"Projetos",  screen:"projetos"   as Screen},
    {icon:Users,          label:"Clientes",  screen:"clientes"   as Screen},
    {icon:FileText,       label:"Propostas", screen:"propostas"  as Screen},
    {icon:Wallet,         label:"Financeiro",screen:"financeiro" as Screen},
  ];
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2"
      style={{background:C.surface,borderTop:`1px solid ${C.border}`,backdropFilter:"blur(16px)"}}>
      {items.map(({icon:Icon,label,screen})=>{
        const active=current===screen;
        return (
          <button key={screen} onClick={()=>onNavigate(screen)} className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all active:scale-95"
            style={{color:active?C.em:C.muted,background:active?C.emDim:"transparent"}}>
            <Icon className="h-5 w-5" strokeWidth={active?2:1.75} />
            <span className="text-[9.5px] font-medium tracking-[0.05em]">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ══ SIDEBAR ══ */
function Sidebar({ current, onNavigate, user, onSignOut }: { current:Screen; onNavigate:(s:Screen)=>void; user:UserProfile; onSignOut:()=>void }) {
  const sections = [
    { label:"Operação", items:[
      {icon:LayoutDashboard,label:"Visão geral", screen:"dashboard"  as Screen},
      {icon:Clapperboard,   label:"Projetos",    screen:"projetos"   as Screen},
      {icon:Users,          label:"Clientes",    screen:"clientes"   as Screen},
      {icon:Video,          label:"Gravações",   screen:"agenda"     as Screen},
      {icon:Send,           label:"Entregas",    screen:"entregas"   as Screen},
    ]},
    { label:"Comercial", items:[
      {icon:FileText,   label:"Propostas",  screen:"propostas"   as Screen},
      {icon:Wallet,     label:"Financeiro", screen:"financeiro"  as Screen},
      {icon:TrendingUp, label:"Pipeline",   screen:"pipeline"    as Screen},
    ]},
    { label:"Equipe", items:[
      {icon:MessageSquare, label:"Mensagens",     screen:"mensagens"     as Screen},
      {icon:Settings,      label:"Configurações", screen:"configuracoes" as Screen},
    ]},
  ];
  return (
    <aside style={{width:248,background:C.surface,borderRight:`1px solid ${C.border}`}} className="shrink-0 sticky top-0 h-screen flex flex-col">
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center shadow-lg" style={{background:`linear-gradient(135deg,${C.em},#6B8EFF)`}}>
            <Film className="h-4 w-4 text-white" strokeWidth={1.75} />
          </div>
          <div className="leading-tight">
            <div className="text-[14px] font-semibold tracking-tight" style={{color:C.fg}}>MW Studio</div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{color:C.muted}}>Media World</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-2 space-y-5 overflow-y-auto">
        {sections.map(sec=>(
          <div key={sec.label}>
            <div className="px-2 mb-2 text-[9.5px] uppercase tracking-[0.2em] font-semibold" style={{color:C.muted}}>{sec.label}</div>
            <div className="space-y-0.5">
              {sec.items.map(({icon:Icon,label,screen}:any)=>{
                const active=current===screen;
                return (
                  <button key={label} onClick={()=>onNavigate(screen)}
                    style={{background:active?C.emDim:"transparent",color:active?C.em:C.fgDim,border:`1px solid ${active?`${C.em}30`:"transparent"}`}}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] transition-all"
                    onMouseEnter={e=>{if(!active)(e.currentTarget as HTMLElement).style.background=C.hover;}}
                    onMouseLeave={e=>{if(!active)(e.currentTarget as HTMLElement).style.background="transparent";}}>
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={active?2:1.75} />
                    <span className={active?"font-medium":""}>{label}</span>
                    {active&&<span className="ml-auto h-1.5 w-1.5 rounded-full" style={{background:C.em}} />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-3" style={{borderTop:`1px solid ${C.border}`}}>
        <div className="rounded-xl p-3 flex items-center gap-3" style={{background:C.card,border:`1px solid ${C.border}`}}>
          <Avatar user={user} size={8} />
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-medium truncate" style={{color:C.fg}}>{user.name||"Carregando…"}</div>
            <div className="text-[11px] truncate" style={{color:C.muted}}>{user.email||"Media World"}</div>
          </div>
          <button onClick={onSignOut} title="Sair">
            <LogOut className="h-3.5 w-3.5 shrink-0" style={{color:C.muted}} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ══ TOPBAR ══ */
const screenLabels: Record<Screen,string> = {
  dashboard:"Visão geral", clientes:"Clientes", projetos:"Projetos",
  pipeline:"Pipeline", agenda:"Agenda", entregas:"Entregas",
  propostas:"Propostas", financeiro:"Financeiro", metas:"Metas", mensagens:"Mensagens", configuracoes:"Configurações",
};

function TopBar({ screen, unread, notifs, showNotifs, onToggleNotifs, onMarkRead, showSearch, searchQ, searchResults, onToggleSearch, onSearchChange, onNewProject, onMenuOpen, user }: any) {
  const nRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const h=(e:MouseEvent)=>{ if(nRef.current&&!nRef.current.contains(e.target as Node)&&showNotifs) onToggleNotifs(); };
    document.addEventListener("mousedown",h); return ()=>document.removeEventListener("mousedown",h);
  },[showNotifs]);

  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-8 py-3"
      style={{background:`${C.surface}E8`,borderBottom:`1px solid ${C.border}`,backdropFilter:"blur(16px)"}}>
      <button onClick={onMenuOpen} className="lg:hidden h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
        style={{background:C.card,border:`1px solid ${C.border}`,color:C.muted}}>
        <Menu className="h-4 w-4" strokeWidth={1.75} />
      </button>
      <div className="flex items-center gap-2 text-[12px] min-w-0" style={{color:C.muted}}>
        <span className="hidden md:block font-medium" style={{color:C.em}}>MW</span>
        <ChevronRight className="h-3 w-3 hidden md:block" strokeWidth={1.75} />
        <span className="font-medium truncate" style={{color:C.fg}}>{screenLabels[screen as Screen]}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden sm:block">
          <div className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-[12.5px] cursor-text"
            style={{background:C.card,border:`1px solid ${C.border}`,color:C.muted,width:showSearch?"200px":"160px",transition:"width 0.2s"}}
            onClick={onToggleSearch}>
            <Search className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            {showSearch
              ? <input autoFocus className="flex-1 bg-transparent outline-none text-[12.5px] min-w-0" style={{color:C.fg}} placeholder="Buscar…" value={searchQ} onChange={e=>onSearchChange(e.target.value)} onClick={e=>e.stopPropagation()} />
              : <span className="text-[12px]">Buscar…</span>
            }
          </div>
          {searchQ.length>1&&(
            <div className="absolute top-full left-0 mt-2 w-[280px] rounded-2xl overflow-hidden z-50 shadow-2xl" style={{background:C.card,border:`1px solid ${C.border}`}}>
              {searchResults.length===0
                ? <div className="px-4 py-6 text-center text-[13px]" style={{color:C.muted}}>Nenhum resultado.</div>
                : searchResults.map((r:any,i:number)=>(
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer" style={{borderBottom:`1px solid ${C.border}`}}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=C.hover}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] w-12" style={{color:C.em}}>{r.type}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium truncate" style={{color:C.fg}}>{r.label}</div>
                      <div className="text-[11.5px] truncate" style={{color:C.muted}}>{r.sub}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
        <div ref={nRef} className="relative">
          <button onClick={onToggleNotifs} className="relative h-8 w-8 rounded-xl flex items-center justify-center" style={{background:C.card,border:`1px solid ${C.border}`,color:C.muted}}>
            <Bell className="h-4 w-4" strokeWidth={1.75} />
            {unread>0&&<span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full" style={{background:C.em}} />}
          </button>
          {showNotifs&&(
            <div className="absolute top-full right-0 mt-2 w-[280px] rounded-2xl overflow-hidden z-50 shadow-2xl" style={{background:C.card,border:`1px solid ${C.border}`}}>
              <div className="flex items-center justify-between px-4 py-3" style={{borderBottom:`1px solid ${C.border}`}}>
                <span className="text-[13px] font-semibold" style={{color:C.fg}}>Notificações</span>
                <button onClick={onMarkRead} className="text-[11.5px]" style={{color:C.em}}>Marcar lidas</button>
              </div>
              {notifs.length===0
                ? <div className="px-4 py-6 text-center text-[13px]" style={{color:C.muted}}>Nenhuma notificação.</div>
                : notifs.map((n:Notif)=>(
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3" style={{borderBottom:`1px solid ${C.border}`,opacity:n.read?0.4:1}}>
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{background:n.type==="alert"?C.dangerDim:n.type==="warn"?C.warnDim:C.infoDim,color:n.type==="alert"?C.danger:n.type==="warn"?C.warn:C.info}}>
                      {n.type==="alert"?<AlertCircle className="h-3.5 w-3.5" strokeWidth={1.75}/>:n.type==="warn"?<Clock className="h-3.5 w-3.5" strokeWidth={1.75}/>:<Info className="h-3.5 w-3.5" strokeWidth={1.75}/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px]" style={{color:C.fg}}>{n.text}</div>
                      <div className="text-[11px] mt-0.5" style={{color:C.muted}}>{n.time}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
        <button onClick={onNewProject} className="flex items-center gap-2 rounded-xl px-3 md:px-4 py-2 text-[12.5px] font-semibold shadow-lg active:scale-95"
          style={{background:`linear-gradient(135deg,${C.em},#6B8EFF)`,color:"#fff"}}>
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          <span className="hidden sm:block">Novo projeto</span>
        </button>
      </div>
    </div>
  );
}

/* ══ DASHBOARD ══ */
function DashboardScreen({ projects, clients, gravacoes, entregas, lancamentos, onNewProject, onNewClient, onNewGravacao, onEditProject, onDeleteProject, onEditClient, onDeleteClient, user }: any) {
  const active   = projects.filter((p:Project)=>p.status!=="Entregue").length;
  const pending  = projects.filter((p:Project)=>p.status==="Aprovação").length;
  const delivered= projects.filter((p:Project)=>p.status==="Entregue").length;
  const lanc     = (lancamentos ?? []) as LancamentoRow[];
  const num      = (l:LancamentoRow) => Number(l.valor) || 0;
  const faturamento = lanc.filter(l=>l.tipo==="Entrada"&&l.status==="Recebido").reduce((s,l)=>s+num(l),0);
  const aReceber    = lanc.filter(l=>l.tipo==="Entrada"&&l.status==="Pendente").reduce((s,l)=>s+num(l),0);
  const aReceberCt  = lanc.filter(l=>l.tipo==="Entrada"&&l.status==="Pendente").length;
  const fmtK = (n:number) => n>=1000 ? `R$ ${(n/1000).toFixed(n>=10000?0:1)}k` : `R$ ${n.toFixed(0)}`;
  const kpis = [
    {label:"Clientes",     value:String(clients.length),  delta:`${clients.length} ativos`,    tone:"up",   icon:Users},
    {label:"Em andamento", value:String(active),           delta:`${projects.length} no total`, tone:"up",   icon:Clapperboard},
    {label:"Aprovação",    value:String(pending),          delta:pending>0?"Atenção":"OK",       tone:pending>0?"warn":"up", icon:CheckCircle2},
    {label:"Entregues",    value:String(delivered),        delta:"Concluídos",                   tone:"neutral",icon:Send},
    {label:"Gravações",    value:String(gravacoes.length), delta:"Agendadas",                    tone:"neutral",icon:Video},
    {label:"Faturamento",  value:fmtK(faturamento),        delta:faturamento>0?"Recebido":"—",   tone:"up",   icon:TrendingUp},
    {label:"A receber",    value:fmtK(aReceber),           delta:`${aReceberCt} ${aReceberCt===1?"fatura":"faturas"}`, tone:"warn", icon:Wallet},
  ];
  const greeting = () => { const h=new Date().getHours(); return h<12?"Bom dia":h<18?"Boa tarde":"Boa noite"; };
  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2" style={{color:C.em}}>Visão geral</div>
        <h1 className="text-[28px] md:text-[36px] font-light tracking-[-0.025em]" style={{color:C.fg}}>
          {greeting()}{user.name?`, ${user.name.split(" ")[0]}`:""}. 👋
        </h1>
        <p className="text-[13px] mt-1" style={{color:C.muted}}>Panorama da operação hoje.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        {kpis.map(k=>{const Icon=k.icon; return(
          <Card key={k.label} className="p-4">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center mb-3" style={{background:C.emDim,color:C.em}}>
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            </div>
            <div className="text-[22px] font-semibold tabular-nums leading-none" style={{color:C.fg}}>{k.value}</div>
            <div className="text-[10.5px] mt-1.5 font-medium" style={{color:C.muted}}>{k.label}</div>
            <div className="text-[10.5px] mt-1 font-semibold flex items-center gap-0.5" style={{color:k.tone==="up"?C.em:k.tone==="warn"?C.warn:C.muted}}>
              {k.tone==="up"&&<ArrowUpRight className="h-3 w-3" strokeWidth={2} />}{k.delta}
            </div>
          </Card>
        );})}
      </div>
      <div className="flex flex-wrap items-center gap-2 rounded-2xl p-3" style={{background:C.card,border:`1px solid ${C.border}`}}>
        <span className="text-[10px] uppercase tracking-[0.18em] font-semibold px-2 w-full md:w-auto" style={{color:C.muted}}>Ações rápidas</span>
        {[
          {icon:Plus,    label:"Novo projeto",     onClick:onNewProject,  primary:true},
          {icon:UserPlus,label:"Novo cliente",     onClick:onNewClient,   primary:false},
          {icon:Video,   label:"Agendar gravação", onClick:onNewGravacao, primary:false},
        ].map(({icon:Icon,label,onClick,primary})=>(
          <button key={label} onClick={onClick} className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-[12.5px] font-medium transition-all active:scale-95"
            style={primary?{background:`linear-gradient(135deg,${C.em},#6B8EFF)`,color:"#fff"}:{background:C.hover,border:`1px solid ${C.border}`,color:C.fgDim}}>
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />{label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <ProjectsTable projects={projects} onEdit={onEditProject} onDelete={onDeleteProject} />
          <PipelineMini projects={projects} />
          <ClientsTable clients={clients} onEdit={onEditClient} onDelete={onDeleteClient} />
        </div>
        <div className="xl:col-span-4 space-y-4">
          <AgendaWidget gravacoes={gravacoes} />
          <DeadlinesWidget projects={projects} />
          <FinancialWidget lancamentos={lanc} />
        </div>
      </div>
    </div>
  );
}


function ProjectsTable({ projects, onEdit, onDelete }: any) {
  return (
    <Card>
      <div className="flex items-center justify-between px-4 md:px-5 pt-5 pb-4" style={{borderBottom:`1px solid ${C.border}`}}>
        <div>
          <div className="text-[9.5px] uppercase tracking-[0.2em] font-semibold mb-1" style={{color:C.em}}>Operação</div>
          <h2 className="text-[16px] font-semibold" style={{color:C.fg}}>Projetos recentes</h2>
        </div>
      </div>
      {projects.length===0
        ? <div className="py-12 text-center text-[13px]" style={{color:C.muted}}>Nenhum projeto.</div>
        : <>
          <div className="md:hidden divide-y" style={{"--tw-divide-color":C.border} as any}>
            {projects.map((p:Project)=>(
              <div key={p.id} className="p-4 group" onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=C.hover} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}>
                <div className="flex items-start justify-between mb-2">
                  <div><div className="text-[13.5px] font-semibold" style={{color:C.fg}}>{p.name}</div><div className="text-[12px] mt-0.5" style={{color:C.muted}}>{p.client}</div></div>
                  <Badge label={p.status} color={statusColor(p.status)} />
                </div>
                <ProgressBar value={p.progress} />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px]" style={{color:C.muted}}>Prazo: {p.deadline}</span>
                  <ActionButtons onEdit={()=>onEdit(p)} onDelete={()=>onDelete(p.id)} />
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead><tr style={{borderBottom:`1px solid ${C.border}`,color:C.muted}}>
                {["Projeto","Cliente","Status","Prazo","Progresso",""].map(h=><th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-[0.15em] font-semibold">{h}</th>)}
              </tr></thead>
              <tbody>
                {projects.map((p:Project,i:number)=>(
                  <tr key={p.id} className="group transition-colors" style={{borderBottom:i<projects.length-1?`1px solid ${C.border}`:"none"}}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=C.hover}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}>
                    <td className="px-5 py-3.5 font-medium" style={{color:C.fg}}>{p.name}</td>
                    <td className="px-5 py-3.5" style={{color:C.muted}}>{p.client}</td>
                    <td className="px-5 py-3.5"><Badge label={p.status} color={statusColor(p.status)} /></td>
                    <td className="px-5 py-3.5 tabular-nums" style={{color:C.fgDim}}>{p.deadline}</td>
                    <td className="px-5 py-3.5 w-[140px]"><ProgressBar value={p.progress} /></td>
                    <td className="px-5 py-3.5"><ActionButtons onEdit={()=>onEdit(p)} onDelete={()=>onDelete(p.id)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      }
    </Card>
  );
}

function PipelineMini({ projects }: any) {
  const stages: ProjectStatus[] = ["Pré-produção","Gravação","Edição","Pós-produção","Aprovação","Entregue"];
  const max=Math.max(...stages.map(s=>projects.filter((p:Project)=>p.status===s).length),1);
  return (
    <Card className="p-4 md:p-5">
      <div className="text-[9.5px] uppercase tracking-[0.2em] font-semibold mb-1" style={{color:C.em}}>Comercial</div>
      <h2 className="text-[16px] font-semibold mb-4" style={{color:C.fg}}>Pipeline</h2>
      <div className="grid grid-cols-3 md:flex gap-2">
        {stages.map((stage)=>{
          const count=projects.filter((p:Project)=>p.status===stage).length;
          const intensity=0.08+(count/max)*0.18;
          return (
            <div key={stage} className="flex-1 min-w-0 rounded-xl p-3 transition-all cursor-pointer"
              style={{background:`rgba(79,110,247,${intensity})`,border:`1px solid ${count>0?`${C.em}30`:C.border}`}}>
              <div className="text-[18px] md:text-[20px] font-semibold tabular-nums leading-none" style={{color:count>0?C.em:C.muted}}>{count}</div>
              <div className="text-[10px] md:text-[10.5px] font-medium mt-1.5 leading-tight" style={{color:count>0?C.fgDim:C.muted}}>{stage}</div>
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
      <div className="px-4 md:px-5 pt-5 pb-4" style={{borderBottom:`1px solid ${C.border}`}}>
        <div className="text-[9.5px] uppercase tracking-[0.2em] font-semibold mb-1" style={{color:C.em}}>Relacionamento</div>
        <h2 className="text-[16px] font-semibold" style={{color:C.fg}}>Clientes ativos</h2>
      </div>
      {clients.length===0?<div className="py-8 text-center text-[13px]" style={{color:C.muted}}>Nenhum cliente.</div>:clients.map((c:Client)=>(
        <div key={c.id} className="flex items-center gap-3 px-4 md:px-5 py-3.5 group transition-colors" style={{borderBottom:`1px solid ${C.border}`}}
          onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=C.hover}
          onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}>
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0" style={{background:`linear-gradient(135deg,${C.em},#6B8EFF)`,color:"#fff"}}>{c.name.charAt(0)}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold truncate" style={{color:C.fg}}>{c.name}</div>
            <div className="text-[11px] truncate" style={{color:C.muted}}>{c.project} · {c.status}</div>
          </div>
          <div className="text-[11px] shrink-0 hidden sm:block" style={{color:C.muted}}>{c.last}</div>
          <ActionButtons onEdit={()=>onEdit(c)} onDelete={()=>onDelete(c.id)} />
        </div>
      ))}
    </Card>
  );
}

function AgendaWidget({ gravacoes = [] }: { gravacoes?: Gravacao[] }) {
  // próximas 4 gravações ordenadas por data
  const items = [...gravacoes]
    .sort((a,b)=>String(a.date||"").localeCompare(String(b.date||"")))
    .slice(0,4);
  return (
    <Card>
      <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{borderBottom:`1px solid ${C.border}`}}>
        <h2 className="text-[14px] font-semibold" style={{color:C.fg}}>Próximas gravações</h2>
        <Calendar className="h-4 w-4" style={{color:C.muted}} strokeWidth={1.75} />
      </div>
      {items.length === 0 ? (
        <div className="px-4 py-6 text-center text-[12px]" style={{color:C.muted}}>Nenhuma gravação agendada.</div>
      ) : (
        <ul>
          {items.map((g,i)=>(
            <li key={g.id} className="flex items-center gap-3 px-4 py-2.5 transition-colors" style={{borderBottom:i<items.length-1?`1px solid ${C.border}`:"none"}}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=C.hover}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}>
              <span className="text-[11.5px] font-semibold tabular-nums w-12" style={{color:C.em}}>{g.time || "—"}</span>
              <div className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0" style={{background:C.emDim,color:C.em}}><Video className="h-3 w-3" strokeWidth={1.75} /></div>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-medium truncate" style={{color:C.fgDim}}>{g.title}</div>
                <div className="text-[11px] truncate" style={{color:C.muted}}>{g.date} · {g.client}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function DeadlinesWidget({ projects = [] }: { projects?: Project[] }) {
  // 3 projetos mais próximos do prazo, status diferente de "Entregue"
  const items = [...projects]
    .filter(p=>p.status!=="Entregue")
    .sort((a,b)=>String(a.deadline||"").localeCompare(String(b.deadline||"")))
    .slice(0,3);
  return (
    <Card>
      <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{borderBottom:`1px solid ${C.border}`}}>
        <h2 className="text-[14px] font-semibold" style={{color:C.fg}}>Prazos</h2>
        <Clock className="h-4 w-4" style={{color:C.muted}} strokeWidth={1.75} />
      </div>
      {items.length === 0 ? (
        <div className="px-4 py-6 text-center text-[12px]" style={{color:C.muted}}>Sem prazos ativos.</div>
      ) : (
        <ul>
          {items.map((d,i)=>{
            const urgent = d.status==="Aprovação";
            return (
              <li key={d.id} className="flex items-start gap-3 px-4 py-3 transition-colors" style={{borderBottom:i<items.length-1?`1px solid ${C.border}`:"none"}}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=C.hover}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}>
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{background:urgent?C.danger:C.border}} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium truncate" style={{color:C.fg}}>{d.name}</div>
                  <div className="text-[11px] truncate mt-0.5" style={{color:C.muted}}>{d.client} · {d.status}</div>
                </div>
                <span className="text-[11px] font-semibold whitespace-nowrap" style={{color:urgent?C.danger:C.muted}}>{d.deadline || "—"}</span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function FinancialWidget({ lancamentos = [] }: { lancamentos?: LancamentoRow[] }) {
  const num = (l:LancamentoRow) => Number(l.valor) || 0;
  const faturamento = lancamentos.filter(l=>l.tipo==="Entrada"&&l.status==="Recebido").reduce((s,l)=>s+num(l),0);
  const despesas    = lancamentos.filter(l=>l.tipo==="Saída"&&l.status==="Pago").reduce((s,l)=>s+num(l),0);
  const aReceber    = lancamentos.filter(l=>l.tipo==="Entrada"&&l.status==="Pendente").reduce((s,l)=>s+num(l),0);
  const aReceberCt  = lancamentos.filter(l=>l.tipo==="Entrada"&&l.status==="Pendente").length;
  const fmt = (n:number) => `R$ ${n.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  const rows = [
    {label:"Faturamento", value:fmt(faturamento), delta:null as string|null},
    {label:"Despesas",    value:fmt(despesas),    delta:null as string|null},
    {label:"A receber",   value:fmt(aReceber),    delta:aReceberCt>0?`${aReceberCt} ${aReceberCt===1?"fatura":"faturas"}`:null},
  ];
  return (
    <Card className="overflow-hidden">
      <div className="px-4 pt-4 pb-3" style={{borderBottom:`1px solid ${C.border}`,background:`linear-gradient(135deg,${C.emDim},transparent)`}}>
        <div className="text-[9.5px] uppercase tracking-[0.2em] font-semibold mb-1" style={{color:C.em}}>Financeiro</div>
        <h2 className="text-[14px] font-semibold" style={{color:C.fg}}>Resumo</h2>
      </div>
      <ul>
        {rows.map((r,i)=>(
          <li key={i} className="flex items-center justify-between px-4 py-3" style={{borderBottom:i<rows.length-1?`1px solid ${C.border}`:"none"}}>
            <span className="text-[12px]" style={{color:C.muted}}>{r.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold tabular-nums" style={{color:C.fg}}>{r.value}</span>
              {r.delta&&<span className="text-[10px] font-semibold rounded-lg px-1.5 py-0.5" style={{background:C.emDim,color:C.em}}>{r.delta}</span>}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ══ CLIENTES ══ */
function ClientesScreen({ clients, onNew, onEdit, onDelete }: any) {
  const [q,setQ]=useState("");
  const filtered=clients.filter((c:Client)=>c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PageHeader eyebrow="Relacionamento" title="Clientes" sub={`${clients.length} clientes ativos`}
        action={<Btn onClick={onNew}><Plus className="h-4 w-4" strokeWidth={2} />Novo cliente</Btn>} />
      <SearchBar value={q} onChange={setQ} placeholder="Buscar cliente…" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        {filtered.map((c:Client)=>(
          <Card key={c.id} className="p-5 group hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-[13px] font-semibold shrink-0" style={{background:`linear-gradient(135deg,${C.em},#6B8EFF)`,color:"#fff"}}>{c.name.charAt(0)}</div>
                <div><div className="text-[14px] font-semibold" style={{color:C.fg}}>{c.name}</div><div className="text-[12px] mt-0.5" style={{color:C.muted}}>{c.project}</div></div>
              </div>
              <ActionButtons onEdit={()=>onEdit(c)} onDelete={()=>onDelete(c.id)} />
            </div>
            <div className="space-y-2 pt-4" style={{borderTop:`1px solid ${C.border}`}}>
              <div className="flex justify-between"><span className="text-[11.5px]" style={{color:C.muted}}>Status</span><span className="text-[12px] font-medium" style={{color:C.fgDim}}>{c.status}</span></div>
              <div className="flex justify-between"><span className="text-[11.5px]" style={{color:C.muted}}>Última interação</span><span className="text-[12px] tabular-nums" style={{color:C.muted}}>{c.last}</span></div>
            </div>
          </Card>
        ))}
        {filtered.length===0 && clients.length===0 && (
          <div className="col-span-3"><EmptyState icon={UserPlus} title="Sem clientes ainda" sub="Cadastre seu primeiro cliente para começar a organizar projetos." actionLabel="Adicionar cliente" onAction={onNew} /></div>
        )}
        {filtered.length===0 && clients.length>0 && <div className="col-span-3 py-20 text-center text-[13px]" style={{color:C.muted}}>Nenhum cliente encontrado.</div>}
      </div>
    </div>
  );
}

/* ══ PROJETOS ══ */
function ProjetosScreen({ projects, clients, onNew, onEdit, onDelete }: any) {
  const [filter,setFilter]=useState("Todos");
  const [q,setQ]=useState("");
  const filtered=projects.filter((p:Project)=>(filter==="Todos"||p.status===filter)&&(p.name.toLowerCase().includes(q.toLowerCase())||p.client.toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <PageHeader eyebrow="Operação" title="Projetos" sub={`${projects.length} projetos no total`}
        action={<Btn onClick={onNew}><Plus className="h-4 w-4" strokeWidth={2} />Novo projeto</Btn>} />
      <div className="space-y-3 mb-5">
        <SearchBar value={q} onChange={setQ} placeholder="Buscar projeto…" />
        <div className="flex gap-1.5 flex-wrap">
          {["Todos",...STATUS_OPTIONS].map(s=>(
            <button key={s} onClick={()=>setFilter(s)} className="px-3 py-1.5 rounded-full text-[12px] font-medium transition-all active:scale-95"
              style={filter===s?{background:C.em,color:"#fff"}:{background:C.card,border:`1px solid ${C.border}`,color:C.muted}}>{s}</button>
          ))}
        </div>
      </div>
      {projects.length===0 ? (
        <EmptyState icon={Clapperboard} title="Sem projetos ainda" sub="Crie seu primeiro projeto para acompanhar produção, prazos e entregas." actionLabel="Criar projeto" onAction={onNew} />
      ) : <>
      <div className="md:hidden space-y-3">
        {filtered.map((p:Project)=>(
          <Card key={p.id} className="p-4 group">
            <div className="flex items-start justify-between mb-3">
              <div><div className="text-[14px] font-semibold" style={{color:C.fg}}>{p.name}</div><div className="text-[12px] mt-0.5" style={{color:C.muted}}>{p.client}</div></div>
              <Badge label={p.status} color={statusColor(p.status)} />
            </div>
            <ProgressBar value={p.progress} />
            <div className="flex items-center justify-between mt-3">
              <span className="text-[12px]" style={{color:C.muted}}>{p.owner} · {p.deadline}</span>
              <ActionButtons onEdit={()=>onEdit(p)} onDelete={()=>onDelete(p.id)} />
            </div>
          </Card>
        ))}
        {filtered.length===0&&<div className="py-16 text-center text-[13px]" style={{color:C.muted}}>Nenhum projeto encontrado.</div>}
      </div>
      <Card className="hidden md:block">
        {filtered.length===0?<div className="py-16 text-center text-[13px]" style={{color:C.muted}}>Nenhum projeto encontrado.</div>:(
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead><tr style={{borderBottom:`1px solid ${C.border}`,color:C.muted}}>
                {["Projeto","Cliente","Status","Prazo","Responsável","Progresso",""].map(h=><th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-[0.15em] font-semibold">{h}</th>)}
              </tr></thead>
              <tbody>
                {filtered.map((p:Project,i:number)=>(
                  <tr key={p.id} className="group transition-colors" style={{borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none"}}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=C.hover}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}>
                    <td className="px-5 py-3.5 font-medium" style={{color:C.fg}}>{p.name}</td>
                    <td className="px-5 py-3.5" style={{color:C.muted}}>{p.client}</td>
                    <td className="px-5 py-3.5"><Badge label={p.status} color={statusColor(p.status)} /></td>
                    <td className="px-5 py-3.5 tabular-nums" style={{color:C.fgDim}}>{p.deadline}</td>
                    <td className="px-5 py-3.5"><div className="flex items-center gap-2"><div className="h-5 w-5 rounded-full shrink-0" style={{background:`linear-gradient(135deg,${C.em},#6B8EFF)`}} /><span style={{color:C.muted}}>{p.owner}</span></div></td>
                    <td className="px-5 py-3.5 w-[140px]"><ProgressBar value={p.progress} /></td>
                    <td className="px-5 py-3.5"><ActionButtons onEdit={()=>onEdit(p)} onDelete={()=>onDelete(p.id)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      </>}
    </div>
  );
}

/* ══ PIPELINE ══ */
function PipelineScreen({ projects }: any) {
  const stages: ProjectStatus[] = ["Pré-produção","Gravação","Edição","Pós-produção","Aprovação","Entregue"];
  return (
    <div>
      <PageHeader eyebrow="Comercial" title="Pipeline" sub="Visão do funil por estágio" />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stages.map(stage=>{
          const sp=projects.filter((p:Project)=>p.status===stage);
          return (
            <div key={stage} className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{color:C.muted}}>{stage}</span>
                <span className="text-[10px] font-semibold rounded-lg px-1.5 py-0.5" style={{background:sp.length>0?C.emDim:C.card,color:sp.length>0?C.em:C.muted,border:`1px solid ${sp.length>0?`${C.em}30`:C.border}`}}>{sp.length}</span>
              </div>
              <div className="space-y-2 min-h-[80px]">
                {sp.map((p:Project)=>(
                  <Card key={p.id} className="p-3 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                    <div className="text-[12px] font-semibold leading-snug" style={{color:C.fg}}>{p.name}</div>
                    <div className="text-[11px] mt-1" style={{color:C.muted}}>{p.client}</div>
                    <div className="mt-2"><ProgressBar value={p.progress} /></div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10.5px]" style={{color:C.muted}}>{p.deadline}</span>
                      <div className="h-4 w-4 rounded-full" style={{background:`linear-gradient(135deg,${C.em},#6B8EFF)`}} />
                    </div>
                  </Card>
                ))}
                {sp.length===0&&<div className="rounded-xl p-3 flex items-center justify-center text-[11px]" style={{border:`1px dashed ${C.border}`,color:C.muted}}>Vazio</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══ AGENDA ══ */
function AgendaScreen({ gravacoes, clients, onNew, onEdit, onDelete }: any) {
  return (
    <div>
      <PageHeader eyebrow="Operação" title="Agenda & Gravações" sub="Gravações agendadas"
        action={<Btn onClick={onNew}><Plus className="h-4 w-4" strokeWidth={2} />Agendar</Btn>} />
      <div className="space-y-3">
        {gravacoes.length===0&&(
          <EmptyState icon={Video} title="Sem gravações agendadas" sub="Agende sua primeira gravação para organizar a equipe e os locais." actionLabel="Agendar gravação" onAction={onNew} />
        )}
        {gravacoes.map((g:Gravacao)=>(
          <Card key={g.id} className="p-4 group hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{background:C.warnDim,color:C.warn}}><Video className="h-5 w-5" strokeWidth={1.75} /></div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold" style={{color:C.fg}}>{g.title}</div>
                <div className="text-[12px] mt-1" style={{color:C.muted}}>{g.client} · {g.local}</div>
                <div className="text-[12px] font-semibold mt-0.5" style={{color:C.em}}>{g.date} às {g.time}</div>
                <div className="text-[11.5px] mt-1" style={{color:C.muted}}>Equipe: {g.crew}</div>
              </div>
              <ActionButtons onEdit={()=>onEdit(g)} onDelete={()=>onDelete(g.id)} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ══ ENTREGAS ══ */
function EntregasScreen({ entregas, projects, onNew, onEdit, onDelete }: any) {
  const sc2: Record<string,string> = {"Aguardando aprovação":C.warn,"Em revisão":C.info,"Enviado":C.muted,"Pendente":C.warn,"Aprovado":C.em};
  return (
    <div>
      <PageHeader eyebrow="Operação" title="Entregas" sub={`${entregas.length} entregas ativas`}
        action={<Btn onClick={onNew}><Upload className="h-4 w-4" strokeWidth={2} />Nova entrega</Btn>} />
      {entregas.length===0 ? (
        <EmptyState icon={Send} title="Sem entregas registradas" sub="Adicione sua primeira entrega para acompanhar arquivos e prazos." actionLabel="Nova entrega" onAction={onNew} />
      ) : <>
      <div className="md:hidden space-y-3">
        {entregas.map((e:Entrega)=>(
          <Card key={e.id} className="p-4 group">
            <div className="flex items-start justify-between mb-2">
              <div><div className="text-[13.5px] font-semibold" style={{color:C.fg}}>{e.project}</div><div className="text-[12px] mt-0.5 font-mono" style={{color:C.muted}}>{e.file}</div></div>
              <Badge label={e.status} color={sc2[e.status]||C.muted} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px]" style={{color:e.urgent?C.danger:C.muted}}>Prazo: {e.date} · {e.size}</span>
              <ActionButtons onEdit={()=>onEdit(e)} onDelete={()=>onDelete(e.id)} />
            </div>
          </Card>
        ))}
      </div>
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead><tr style={{borderBottom:`1px solid ${C.border}`,color:C.muted}}>
              {["Projeto","Arquivo","Status","Prazo","Tamanho",""].map(h=><th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-[0.15em] font-semibold">{h}</th>)}
            </tr></thead>
            <tbody>
              {entregas.map((e:Entrega,i:number)=>(
                <tr key={e.id} className="group transition-colors" style={{borderBottom:i<entregas.length-1?`1px solid ${C.border}`:"none"}}
                  onMouseEnter={x=>(x.currentTarget as HTMLElement).style.background=C.hover}
                  onMouseLeave={x=>(x.currentTarget as HTMLElement).style.background="transparent"}>
                  <td className="px-5 py-3.5"><div className="font-medium" style={{color:C.fg}}>{e.project}</div><div className="text-[11px]" style={{color:C.muted}}>{e.client}</div></td>
                  <td className="px-5 py-3.5 font-mono text-[11.5px]" style={{color:C.muted}}>{e.file}</td>
                  <td className="px-5 py-3.5"><Badge label={e.status} color={sc2[e.status]||C.muted} /></td>
                  <td className="px-5 py-3.5 tabular-nums font-medium" style={{color:e.urgent?C.danger:C.fgDim}}>{e.date}</td>
                  <td className="px-5 py-3.5 tabular-nums" style={{color:C.muted}}>{e.size}</td>
                  <td className="px-5 py-3.5"><ActionButtons onEdit={()=>onEdit(e)} onDelete={()=>onDelete(e.id)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      </>}
    </div>
  );
}

/* ══ PROPOSTAS ══ */
function PropostasScreen({ propostas, clients, onNew, onEdit, onDelete }: any) {
  const sc: Record<string,string> = {"Enviada":C.info,"Em negociação":C.warn,"Aprovada":C.em,"Rascunho":C.muted,"Recusada":C.danger};
  return (
    <div>
      <PageHeader eyebrow="Comercial" title="Propostas" sub={`${propostas.length} propostas · ${propostas.filter((p:Proposta)=>p.status==="Aprovada").length} aprovadas`}
        action={<Btn onClick={onNew}><Plus className="h-4 w-4" strokeWidth={2} />Nova proposta</Btn>} />
      <div className="space-y-3">
        {propostas.map((p:Proposta)=>(
          <Card key={p.id} className="flex items-center gap-4 p-4 group hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{background:C.emDim,color:C.em}}><FileText className="h-5 w-5" strokeWidth={1.75} /></div>
            <div className="flex-1 min-w-0"><div className="text-[14px] font-semibold truncate" style={{color:C.fg}}>{p.title}</div><div className="text-[12px] mt-0.5" style={{color:C.muted}}>{p.client} · {p.date}</div></div>
            <div className="text-[14px] font-semibold tabular-nums hidden sm:block" style={{color:C.fg}}>{p.value}</div>
            <Badge label={p.status} color={sc[p.status]||C.muted} />
            <ActionButtons onEdit={()=>onEdit(p)} onDelete={()=>onDelete(p.id)} />
          </Card>
        ))}
        {propostas.length===0 && (
          <EmptyState icon={FileText} title="Sem propostas ainda" sub="Crie sua primeira proposta comercial para enviar a clientes." actionLabel="Nova proposta" onAction={onNew} />
        )}
      </div>
    </div>
  );
}

/* ══ FINANCEIRO ══ */
function FinanceiroScreen({ lancamentos, onNew, onEdit, onDelete }: { lancamentos:LancamentoRow[]; onNew:()=>void; onEdit:(l:LancamentoRow)=>void; onDelete:(id:string)=>void }) {
  const [tab,setTab]=useState<"resumo"|"lancamentos">("resumo");
  const fmt = (n:number) => `R$ ${n.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  const fmtDate = (d:string) => { try { const [y,m,day]=d.split("-"); const months=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"]; return `${day} ${months[+m-1]}`; } catch { return d; } };
  const num = (l:LancamentoRow) => Number(l.valor) || 0;
  const faturamento = lancamentos.filter(l=>l.tipo==="Entrada"&&l.status==="Recebido").reduce((s,l)=>s+num(l),0);
  const despesas = lancamentos.filter(l=>l.tipo==="Saída"&&l.status==="Pago").reduce((s,l)=>s+num(l),0);
  const lucro = faturamento - despesas;
  const aReceber = lancamentos.filter(l=>l.tipo==="Entrada"&&l.status==="Pendente").reduce((s,l)=>s+num(l),0);
  const aReceberCount = lancamentos.filter(l=>l.tipo==="Entrada"&&l.status==="Pendente").length;
  const recebidosCount = lancamentos.filter(l=>l.status==="Recebido").length;
  const pagosCount = lancamentos.filter(l=>l.status==="Pago").length;
  const pendentesCount = lancamentos.filter(l=>l.status==="Pendente").length;
  const kpis=[
    {label:"Faturamento",value:fmt(faturamento),tone:"up" as const, delta:`${recebidosCount} recebidos`},
    {label:"Despesas",value:fmt(despesas),tone:"warn" as const, delta:`${pagosCount} pagos`},
    {label:"Lucro",value:fmt(lucro),tone:lucro>=0?"up" as const:"warn" as const, delta:faturamento>0?`${((lucro/faturamento)*100).toFixed(1)}% margem`:"—"},
    {label:"A receber",value:fmt(aReceber),tone:"warn" as const, delta:`${aReceberCount} ${aReceberCount===1?"fatura":"faturas"}`},
  ];
  const maxBar = Math.max(faturamento,despesas,1);
  return (
    <div>
      <PageHeader eyebrow="Financeiro" title="Financeiro" sub={`${lancamentos.length} ${lancamentos.length===1?"lançamento":"lançamentos"}`}
        action={<Btn onClick={onNew}><Plus className="h-4 w-4" strokeWidth={2} />Novo lançamento</Btn>} />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
        {kpis.map(k=>(
          <Card key={k.label} className="p-4">
            <div className="text-[10px] uppercase tracking-[0.16em] font-semibold mb-3" style={{color:C.muted}}>{k.label}</div>
            <div className="text-[20px] md:text-[24px] font-semibold tabular-nums leading-none" style={{color:C.fg}}>{k.value}</div>
            <div className="text-[11.5px] mt-2 font-semibold flex items-center gap-0.5" style={{color:k.tone==="up"?C.em:C.warn}}>
              {k.tone==="up"&&<ArrowUpRight className="h-3 w-3" strokeWidth={2} />}{k.delta}
            </div>
          </Card>
        ))}
      </div>
      <div className="flex gap-1 mb-4">
        {(["resumo","lancamentos"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className="px-4 py-2 rounded-xl text-[13px] font-medium transition-all active:scale-95"
            style={tab===t?{background:C.em,color:"#fff"}:{background:C.card,border:`1px solid ${C.border}`,color:C.muted}}>
            {t==="resumo"?"Resumo":"Lançamentos"}
          </button>
        ))}
      </div>
      {tab==="resumo"&&(
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5">
            <div className="text-[13px] font-semibold mb-4" style={{color:C.fg}}>Receita vs Despesa</div>
            {[{label:"Receita",v:faturamento},{label:"Despesa",v:despesas},{label:"Lucro",v:Math.max(lucro,0)}].map(b=>(
              <div key={b.label} className="mb-4">
                <div className="flex justify-between mb-1.5"><span className="text-[12px]" style={{color:C.muted}}>{b.label}</span><span className="text-[12px] font-semibold tabular-nums" style={{color:C.fg}}>{fmt(b.v)}</span></div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{background:C.border}}><div className="h-full rounded-full" style={{width:`${Math.min((b.v/maxBar)*100,100)}%`,background:`linear-gradient(90deg,${C.em},#6B8EFF)`}} /></div>
              </div>
            ))}
          </Card>
          <Card className="p-5">
            <div className="text-[13px] font-semibold mb-4" style={{color:C.fg}}>Status dos pagamentos</div>
            {[{label:"Recebidos",count:recebidosCount,color:C.em},{label:"Pagos",count:pagosCount,color:C.info},{label:"Pendentes",count:pendentesCount,color:C.warn}].map(s=>(
              <div key={s.label} className="flex items-center justify-between py-3" style={{borderBottom:`1px solid ${C.border}`}}>
                <span className="text-[13px]" style={{color:C.fgDim}}>{s.label}</span>
                <span className="text-[13px] font-semibold" style={{color:s.color}}>{s.count} {s.count===1?"lançamento":"lançamentos"}</span>
              </div>
            ))}
          </Card>
        </div>
      )}
      {tab==="lancamentos"&&(
        lancamentos.length===0 ? (
          <EmptyState icon={Wallet} title="Sem lançamentos" sub="Registre seu primeiro lançamento financeiro para começar a acompanhar receitas e despesas." actionLabel="Novo lançamento" onAction={onNew} />
        ) : (
          <Card>
            {lancamentos.map((l,i)=>(
              <div key={l.id} className="flex items-center gap-3 px-4 py-3.5 transition-colors" style={{borderBottom:i<lancamentos.length-1?`1px solid ${C.border}`:"none"}}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=C.hover}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}>
                <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0" style={{background:l.tipo==="Entrada"?C.emDim:C.dangerDim,color:l.tipo==="Entrada"?C.em:C.danger}}>
                  {l.tipo==="Entrada"?<ArrowUpRight className="h-4 w-4" strokeWidth={1.75}/>:<ArrowRight className="h-4 w-4 rotate-180" strokeWidth={1.75}/>}
                </div>
                <div className="flex-1 min-w-0"><div className="text-[13px] font-medium truncate" style={{color:C.fg}}>{l.descricao}</div><div className="text-[11.5px] mt-0.5" style={{color:C.muted}}>{fmtDate(l.data)} · {l.tipo}</div></div>
                <div className="text-[13px] font-semibold tabular-nums" style={{color:l.tipo==="Entrada"?C.em:C.danger}}>{l.tipo==="Saída"&&"−"}{fmt(num(l))}</div>
                <Badge label={l.status} color={l.status==="Recebido"?C.em:l.status==="Pago"?C.info:C.warn} />
                <ActionButtons onEdit={()=>onEdit(l)} onDelete={()=>onDelete(l.id)} />
              </div>
            ))}
          </Card>
        )
      )}
    </div>
  );
}

/* ══ MENSAGENS ══ */
function MensagensScreen({ convs, onSend }: { convs:any[]; onSend:(id:number,text:string)=>void }) {
  const [active,setActive]=useState(0);
  const [draft,setDraft]=useState("");
  const [showList,setShowList]=useState(true);
  const endRef=useRef<HTMLDivElement>(null);
  const conv=convs[active];
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[active,convs]);
  const send=()=>{ if(!draft.trim()) return; onSend(conv.id,draft.trim()); setDraft(""); };
  const selectConv=(i:number)=>{ setActive(i); setShowList(false); };
  return (
    <div>
      <PageHeader eyebrow="Equipe" title="Mensagens" sub="Comunicação com clientes" />
      <div className="md:hidden">
        {showList?(
          <Card>
            {convs.map((c,i)=>(
              <button key={c.id} onClick={()=>selectConv(i)} className="w-full text-left px-4 py-3.5 transition-colors active:scale-[0.98]" style={{borderBottom:`1px solid ${C.border}`}}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0" style={{background:`linear-gradient(135deg,${C.em},#6B8EFF)`,color:"#fff"}}>{c.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between"><span className="text-[13px] font-semibold" style={{color:C.fg}}>{c.name}</span><span className="text-[10.5px]" style={{color:C.muted}}>{c.time}</span></div>
                    <div className="text-[11.5px] truncate mt-0.5" style={{color:C.muted}}>{c.last}</div>
                  </div>
                  {c.unread>0&&<span className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-semibold" style={{background:C.em,color:"#fff"}}>{c.unread}</span>}
                </div>
              </button>
            ))}
          </Card>
        ):(
          <Card className="flex flex-col" style={{height:"calc(100vh - 200px)"}}>
            <div className="px-4 py-3 flex items-center gap-3" style={{borderBottom:`1px solid ${C.border}`}}>
              <button onClick={()=>setShowList(true)} className="h-8 w-8 rounded-xl flex items-center justify-center" style={{background:C.hover,color:C.muted}}><ChevronRight className="h-4 w-4 rotate-180" strokeWidth={1.75} /></button>
              <div className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-semibold" style={{background:`linear-gradient(135deg,${C.em},#6B8EFF)`,color:"#fff"}}>{conv.name.charAt(0)}</div>
              <div><div className="text-[13.5px] font-semibold" style={{color:C.fg}}>{conv.name}</div><div className="text-[11.5px]" style={{color:C.muted}}>{conv.project}</div></div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {conv.msgs.map((m:Msg,i:number)=>(
                <div key={i} className={`flex ${m.from==="Você"?"justify-end":"justify-start"}`}>
                  <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px]" style={m.from==="Você"?{background:`linear-gradient(135deg,${C.em},#6B8EFF)`,color:"#fff",borderRadius:"1rem 1rem 2px 1rem"}:{background:C.card,color:C.fg,border:`1px solid ${C.border}`,borderRadius:"1rem 1rem 1rem 2px"}}>
                    <div>{m.text}</div><div className="text-[10.5px] mt-1" style={{opacity:0.6}}>{m.time}</div>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="px-4 py-3 flex items-center gap-2" style={{borderTop:`1px solid ${C.border}`}}>
              <input className="flex-1 rounded-xl px-4 py-2.5 text-[13px] outline-none" style={{background:C.card,border:`1px solid ${C.border}`,color:C.fg}} placeholder="Escreva uma mensagem…" value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} />
              <button onClick={send} className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{background:`linear-gradient(135deg,${C.em},#6B8EFF)`,color:"#fff"}}><Send className="h-4 w-4" strokeWidth={1.75} /></button>
            </div>
          </Card>
        )}
      </div>
      <Card className="hidden md:flex overflow-hidden" style={{height:560}}>
        <div className="w-[260px] shrink-0 flex flex-col" style={{borderRight:`1px solid ${C.border}`}}>
          <div className="p-3" style={{borderBottom:`1px solid ${C.border}`}}>
            <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-[12.5px]" style={{background:C.hover,border:`1px solid ${C.border}`,color:C.muted}}><Search className="h-3.5 w-3.5" strokeWidth={1.75} /><span>Buscar…</span></div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {convs.map((c,i)=>(
              <button key={c.id} onClick={()=>setActive(i)} className="w-full text-left px-4 py-3.5 transition-colors" style={{background:active===i?C.hover:"transparent",borderBottom:`1px solid ${C.border}`}}>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0" style={{background:`linear-gradient(135deg,${C.em},#6B8EFF)`,color:"#fff"}}>{c.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between"><span className="text-[13px] font-semibold truncate" style={{color:C.fg}}>{c.name}</span><span className="text-[10.5px] shrink-0 ml-2" style={{color:C.muted}}>{c.time}</span></div>
                    <div className="text-[11.5px] truncate mt-0.5" style={{color:C.muted}}>{c.last}</div>
                  </div>
                  {c.unread>0&&<span className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0" style={{background:C.em,color:"#fff"}}>{c.unread}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="px-5 py-3.5 flex items-center gap-3" style={{borderBottom:`1px solid ${C.border}`}}>
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-semibold" style={{background:`linear-gradient(135deg,${C.em},#6B8EFF)`,color:"#fff"}}>{conv.name.charAt(0)}</div>
            <div><div className="text-[13.5px] font-semibold" style={{color:C.fg}}>{conv.name}</div><div className="text-[11.5px]" style={{color:C.muted}}>{conv.project}</div></div>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {conv.msgs.map((m:Msg,i:number)=>(
              <div key={i} className={`flex ${m.from==="Você"?"justify-end":"justify-start"}`}>
                <div className="max-w-[70%] rounded-2xl px-4 py-2.5 text-[13px]" style={m.from==="Você"?{background:`linear-gradient(135deg,${C.em},#6B8EFF)`,color:"#fff",borderRadius:"1rem 1rem 2px 1rem"}:{background:C.card,color:C.fg,border:`1px solid ${C.border}`,borderRadius:"1rem 1rem 1rem 2px"}}>
                  <div>{m.text}</div><div className="text-[10.5px] mt-1" style={{opacity:0.6}}>{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="px-5 py-3.5 flex items-center gap-3" style={{borderTop:`1px solid ${C.border}`}}>
            <input className="flex-1 rounded-xl px-4 py-2 text-[13px] outline-none" style={{background:C.card,border:`1px solid ${C.border}`,color:C.fg}} placeholder="Escreva uma mensagem…" value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} />
            <button onClick={send} className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 hover:opacity-90" style={{background:`linear-gradient(135deg,${C.em},#6B8EFF)`,color:"#fff"}}><Send className="h-4 w-4" strokeWidth={1.75} /></button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ══ CONFIGURAÇÕES ══ */
function Toggle({ defaultOn }: { defaultOn:boolean }) {
  const [on,setOn]=useState(defaultOn);
  return (
    <button onClick={()=>setOn(v=>!v)} className="relative h-6 w-10 rounded-full transition-colors" style={{background:on?C.em:C.border}}>
      <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" style={{left:on?"18px":"2px"}} />
    </button>
  );
}

function ConfiguracoesScreen({ user, onSignOut }: { user:UserProfile; onSignOut:()=>void }) {
  const [nome,setNome]=useState(user.name||"");
  const [email]=useState(user.email||"");
  const [saved,setSaved]=useState(false);
  useEffect(()=>{ if(user.name) setNome(user.name); },[user.name]);
  const save=()=>{ setSaved(true); setTimeout(()=>setSaved(false),2000); };
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader eyebrow="Sistema" title="Configurações" sub="Preferências da sua conta" />
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 px-5 pt-5 pb-4" style={{borderBottom:`1px solid ${C.border}`}}>
          <User className="h-4 w-4" style={{color:C.em}} strokeWidth={1.75} />
          <h2 className="text-[15px] font-semibold" style={{color:C.fg}}>Perfil</h2>
        </div>
        <div className="px-5 py-5 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Avatar user={user} size={14} />
            <div>
              <div className="text-[14px] font-semibold" style={{color:C.fg}}>{user.name||"Carregando…"}</div>
              <div className="text-[12px]" style={{color:C.muted}}>{user.email}</div>
              <div className="text-[11px] mt-1 flex items-center gap-1" style={{color:C.muted}}>
                <span className="h-2 w-2 rounded-full inline-block" style={{background:C.em}} />
                Conta Google conectada
              </div>
            </div>
          </div>
          <Field label="Nome de exibição">
            <input className="w-full rounded-xl px-3 py-2 text-[13px] outline-none" style={{background:C.hover,border:`1px solid ${C.border}`,color:C.fg}} value={nome} onChange={e=>setNome(e.target.value)} />
          </Field>
          <Field label="E-mail">
            <input className="w-full rounded-xl px-3 py-2 text-[13px] outline-none opacity-60" style={{background:C.hover,border:`1px solid ${C.border}`,color:C.fg}} value={email} readOnly />
          </Field>
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 px-5 pt-5 pb-4" style={{borderBottom:`1px solid ${C.border}`}}>
          <Bell className="h-4 w-4" style={{color:C.em}} strokeWidth={1.75} />
          <h2 className="text-[15px] font-semibold" style={{color:C.fg}}>Notificações</h2>
        </div>
        <div className="px-5 py-2">
          {[{label:"Aprovações pendentes",desc:"Quando um projeto aguarda sua aprovação"},{label:"Novas mensagens",desc:"Quando clientes enviam mensagens"},{label:"Prazos próximos",desc:"48h antes de um prazo vencer"},{label:"Novos pagamentos",desc:"Quando uma fatura é paga"}].map((item,i)=>(
            <div key={i} className="flex items-center justify-between py-3.5" style={{borderBottom:i<3?`1px solid ${C.border}`:"none"}}>
              <div><div className="text-[13px] font-medium" style={{color:C.fg}}>{item.label}</div><div className="text-[11.5px] mt-0.5" style={{color:C.muted}}>{item.desc}</div></div>
              <Toggle defaultOn={i<3} />
            </div>
          ))}
        </div>
      </Card>
      <div className="flex items-center gap-3">
        <button onClick={save} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold shadow-lg transition-opacity hover:opacity-90 active:scale-95"
          style={{background:`linear-gradient(135deg,${C.em},#6B8EFF)`,color:"#fff"}}>
          {saved?<><Check className="h-4 w-4" strokeWidth={2.5} />Salvo!</>:<><Save className="h-4 w-4" strokeWidth={1.75} />Salvar alterações</>}
        </button>
        <button onClick={onSignOut} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-medium" style={{background:C.card,border:`1px solid ${C.border}`,color:C.muted}}>
          <LogOut className="h-4 w-4" strokeWidth={1.75} />Sair da conta
        </button>
      </div>
    </div>
  );
}

/* ══ MODALS ══ */
function Modal({ title, onClose, children, onSave, saveLabel="Salvar" }: { title:string; onClose:()=>void; children:React.ReactNode; onSave:()=>void; saveLabel?:string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" style={{background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)"}} onClick={(e)=>{ if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full md:max-w-lg md:mx-4 overflow-hidden shadow-2xl md:rounded-2xl rounded-t-2xl" style={{background:C.surface,border:`1px solid ${C.border}`}}>
        <div className="flex items-center justify-between px-5 pt-5 pb-4" style={{borderBottom:`1px solid ${C.border}`}}>
          <h2 className="text-[17px] font-semibold" style={{color:C.fg}}>{title}</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-xl flex items-center justify-center" style={{color:C.muted,background:C.card}}><X className="h-4 w-4" strokeWidth={1.75} /></button>
        </div>
        <div className="px-5 py-5 space-y-4 max-h-[70vh] overflow-y-auto">{children}</div>
        <div className="flex items-center justify-end gap-3 px-5 py-4" style={{borderTop:`1px solid ${C.border}`,background:C.card}}>
          <button onClick={onClose} className="px-4 py-2 text-[13px] rounded-xl" style={{color:C.muted}}>Cancelar</button>
          <button onClick={onSave} className="px-5 py-2.5 text-[13px] font-semibold rounded-xl shadow-lg hover:opacity-90 active:scale-95" style={{background:`linear-gradient(135deg,${C.em},#6B8EFF)`,color:"#fff"}}>{saveLabel}</button>
        </div>
      </div>
    </div>
  );
}
function MInput({ label, value, onChange, placeholder, type="text", list }: any) {
  return (
    <Field label={label}>
      <input type={type} list={list} className="w-full rounded-xl px-3 py-2.5 text-[13px] outline-none" style={{background:C.card,border:`1px solid ${C.border}`,color:C.fg}} placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)} />
    </Field>
  );
}
function MSelect({ label, value, onChange, options }: any) {
  return (
    <Field label={label}>
      <select className="w-full rounded-xl px-3 py-2.5 text-[13px] outline-none" style={{background:C.card,border:`1px solid ${C.border}`,color:C.fg}} value={value} onChange={e=>onChange(e.target.value)}>
        {options.map((o:string)=><option key={o}>{o}</option>)}
      </select>
    </Field>
  );
}
function ProjectModal({ editing, clients, onSave, onClose }: any) {
  const [f,setF]=useState({name:editing?.name??"",client:editing?.client??"",status:editing?.status??"Pré-produção",deadline:editing?.deadline??"",owner:editing?.owner??"",progress:editing?.progress??0});
  const s=(k:string,v:any)=>setF(p=>({...p,[k]:v}));
  return (
    <Modal title={editing?"Editar projeto":"Novo projeto"} onClose={onClose} onSave={()=>{if(f.name.trim())onSave(f);}} saveLabel={editing?"Salvar":"Criar projeto"}>
      <MInput label="Nome" value={f.name} onChange={(v:string)=>s("name",v)} placeholder="Ex: Nike — Campanha Verão" />
      <MInput label="Cliente" value={f.client} onChange={(v:string)=>s("client",v)} placeholder="Nome do cliente" list="p-cl" />
      <datalist id="p-cl">{clients.map((c:Client)=><option key={c.id} value={c.name}/>)}</datalist>
      <div className="grid grid-cols-2 gap-3">
        <MSelect label="Status" value={f.status} onChange={(v:string)=>s("status",v)} options={STATUS_OPTIONS} />
        <MInput label="Prazo" value={f.deadline} onChange={(v:string)=>s("deadline",v)} placeholder="Ex: 30 jun" />
      </div>
      <MInput label="Responsável" value={f.owner} onChange={(v:string)=>s("owner",v)} placeholder="Nome" />
      <Field label={`Progresso — ${f.progress}%`}>
        <input type="range" min={0} max={100} value={f.progress} onChange={e=>s("progress",Number(e.target.value))} className="w-full" style={{accentColor:C.em}} />
      </Field>
    </Modal>
  );
}
function ClientModal({ editing, onSave, onClose }: any) {
  const [f,setF]=useState({name:editing?.name??"",project:editing?.project??"",status:editing?.status??"",last:editing?.last??"agora"});
  const s=(k:string,v:string)=>setF(p=>({...p,[k]:v}));
  return (
    <Modal title={editing?"Editar cliente":"Novo cliente"} onClose={onClose} onSave={()=>{if(f.name.trim())onSave(f);}} saveLabel={editing?"Salvar":"Adicionar"}>
      <MInput label="Nome" value={f.name} onChange={(v:string)=>s("name",v)} placeholder="Ex: Nike Brasil" />
      <MInput label="Projeto atual" value={f.project} onChange={(v:string)=>s("project",v)} placeholder="Nome do projeto" />
      <MInput label="Status" value={f.status} onChange={(v:string)=>s("status",v)} placeholder="Ex: Em produção" />
    </Modal>
  );
}
function EntregaModal({ editing, projects, onSave, onClose }: any) {
  const [f,setF]=useState({project:editing?.project??"",client:editing?.client??"",file:editing?.file??"",status:editing?.status??"Pendente",date:editing?.date??"",size:editing?.size??"",urgent:editing?.urgent??false});
  const s=(k:string,v:any)=>setF(p=>({...p,[k]:v}));
  return (
    <Modal title={editing?"Editar entrega":"Nova entrega"} onClose={onClose} onSave={()=>{if(f.project.trim())onSave(f);}} saveLabel={editing?"Salvar":"Criar"}>
      <MInput label="Projeto" value={f.project} onChange={(v:string)=>s("project",v)} placeholder="Nome do projeto" list="e-p" />
      <datalist id="e-p">{projects.map((p:Project)=><option key={p.id} value={p.name}/>)}</datalist>
      <MInput label="Cliente" value={f.client} onChange={(v:string)=>s("client",v)} placeholder="Nome do cliente" />
      <MInput label="Arquivo" value={f.file} onChange={(v:string)=>s("file",v)} placeholder="Ex: Corte_Final_v3.mp4" />
      <div className="grid grid-cols-2 gap-3">
        <MSelect label="Status" value={f.status} onChange={(v:string)=>s("status",v)} options={["Pendente","Em revisão","Aguardando aprovação","Aprovado","Enviado"]} />
        <MInput label="Prazo" value={f.date} onChange={(v:string)=>s("date",v)} placeholder="Ex: 30 jun" />
      </div>
      <MInput label="Tamanho" value={f.size} onChange={(v:string)=>s("size",v)} placeholder="Ex: 4.2 GB" />
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={f.urgent} onChange={e=>s("urgent",e.target.checked)} style={{accentColor:C.em}} />
        <span className="text-[13px]" style={{color:C.fgDim}}>Urgente</span>
      </label>
    </Modal>
  );
}
function PropostaModal({ editing, clients, onSave, onClose }: any) {
  const [f,setF]=useState({title:editing?.title??"",client:editing?.client??"",value:editing?.value??"",status:editing?.status??"Rascunho",date:editing?.date??""});
  const s=(k:string,v:string)=>setF(p=>({...p,[k]:v}));
  return (
    <Modal title={editing?"Editar proposta":"Nova proposta"} onClose={onClose} onSave={()=>{if(f.title.trim())onSave(f);}} saveLabel={editing?"Salvar":"Criar"}>
      <MInput label="Título" value={f.title} onChange={(v:string)=>s("title",v)} placeholder="Ex: Campanha Verão 2026" />
      <MInput label="Cliente" value={f.client} onChange={(v:string)=>s("client",v)} placeholder="Nome do cliente" list="pr-cl" />
      <datalist id="pr-cl">{clients.map((c:Client)=><option key={c.id} value={c.name}/>)}</datalist>
      <MInput label="Valor" value={f.value} onChange={(v:string)=>s("value",v)} placeholder="Ex: R$ 84.000" />
      <MSelect label="Status" value={f.status} onChange={(v:string)=>s("status",v)} options={["Rascunho","Enviada","Em negociação","Aprovada","Recusada"]} />
    </Modal>
  );
}
function GravacaoModal({ editing, clients, onSave, onClose }: any) {
  const [f,setF]=useState({title:editing?.title??"",client:editing?.client??"",local:editing?.local??"",date:editing?.date??"",time:editing?.time??"",crew:editing?.crew??""});
  const s=(k:string,v:string)=>setF(p=>({...p,[k]:v}));
  return (
    <Modal title={editing?"Editar gravação":"Agendar gravação"} onClose={onClose} onSave={()=>{if(f.title.trim())onSave(f);}} saveLabel={editing?"Salvar":"Agendar"}>
      <MInput label="Título" value={f.title} onChange={(v:string)=>s("title",v)} placeholder="Ex: Gravação Nike" />
      <MInput label="Cliente" value={f.client} onChange={(v:string)=>s("client",v)} placeholder="Nome do cliente" list="g-cl" />
      <datalist id="g-cl">{clients.map((c:Client)=><option key={c.id} value={c.name}/>)}</datalist>
      <MInput label="Local" value={f.local} onChange={(v:string)=>s("local",v)} placeholder="Ex: Studio A" />
      <div className="grid grid-cols-2 gap-3">
        <MInput label="Data" value={f.date} onChange={(v:string)=>s("date",v)} placeholder="Ex: 20 jun" />
        <MInput label="Horário" value={f.time} onChange={(v:string)=>s("time",v)} placeholder="Ex: 09:00" />
      </div>
      <MInput label="Equipe" value={f.crew} onChange={(v:string)=>s("crew",v)} placeholder="Ex: Léon B., Margaux T." />
    </Modal>
  );
}
function LancamentoModal({ editing, onSave, onClose }: { editing:LancamentoRow|null; onSave:(d:Omit<LancamentoRow,"id">)=>void; onClose:()=>void }) {
  const today = new Date().toISOString().slice(0,10);
  const [f,setF]=useState<{descricao:string;tipo:"Entrada"|"Saída";valor:string;data:string;status:"Recebido"|"Pago"|"Pendente"}>({
    descricao:editing?.descricao??"",
    tipo:(editing?.tipo as "Entrada"|"Saída")??"Entrada",
    valor:editing?String(editing.valor):"",
    data:editing?.data??today,
    status:(editing?.status as "Recebido"|"Pago"|"Pendente")??"Pendente",
  });
  const s=(k:string,v:any)=>setF(p=>({...p,[k]:v}));
  return (
    <Modal title={editing?"Editar lançamento":"Novo lançamento"} onClose={onClose}
      onSave={()=>{ if(!f.descricao.trim()) return; onSave({descricao:f.descricao.trim(),tipo:f.tipo,valor:Number(String(f.valor).replace(",","."))||0,data:f.data,status:f.status}); }}
      saveLabel={editing?"Salvar":"Criar"}>
      <MInput label="Descrição" value={f.descricao} onChange={(v:string)=>s("descricao",v)} placeholder="Ex: Pagamento — Cliente X" />
      <div className="grid grid-cols-2 gap-3">
        <MSelect label="Tipo" value={f.tipo} onChange={(v:string)=>s("tipo",v)} options={["Entrada","Saída"]} />
        <MInput label="Valor (R$)" type="number" value={f.valor} onChange={(v:string)=>s("valor",v)} placeholder="0,00" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <MInput label="Data" type="date" value={f.data} onChange={(v:string)=>s("data",v)} />
        <MSelect label="Status" value={f.status} onChange={(v:string)=>s("status",v)} options={["Recebido","Pago","Pendente"]} />
      </div>
    </Modal>
  );
}
