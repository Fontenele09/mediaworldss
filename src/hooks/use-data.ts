import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Table = "projects" | "clients" | "entregas" | "propostas" | "gravacoes" | "lancamentos" | "metas" | "mensagens";

async function getUid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not authenticated");
  return data.user.id;
}

function makeHooks<T extends { id: string }>(table: Table, orderBy = "created_at") {
  const key = [table] as const;

  function useList() {
    return useQuery({
      queryKey: key,
      queryFn: async () => {
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .order(orderBy, { ascending: false });
        if (error) throw error;
        return (data ?? []) as unknown as T[];
      },
    });
  }

  function useSave() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: async (input: Partial<T> & { id?: string }) => {
        const { id, ...rest } = input as any;
        if (id) {
          const { error } = await supabase.from(table).update(rest).eq("id", id);
          if (error) throw error;
        } else {
          const user_id = await getUid();
          const { error } = await supabase.from(table).insert({ ...rest, user_id });
          if (error) throw error;
        }
      },
      onSuccess: () => qc.invalidateQueries({ queryKey: key }),
      onError: (e: any) => toast.error(e.message ?? "Erro ao salvar"),
    });
  }

  function useRemove() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from(table).delete().eq("id", id);
        if (error) throw error;
      },
      onSuccess: () => qc.invalidateQueries({ queryKey: key }),
      onError: (e: any) => toast.error(e.message ?? "Erro ao excluir"),
    });
  }

  return { useList, useSave, useRemove };
}

export type ProjectRow = {
  id: string; name: string; client: string | null; status: string | null;
  deadline: string | null; owner: string | null; progress: number;
};
export type ClientRow = {
  id: string; name: string; project: string | null; status: string | null; last: string | null;
};
export type EntregaRow = {
  id: string; project: string | null; client: string | null; file: string | null;
  status: string | null; date: string | null; size: string | null; urgent: boolean;
};
export type PropostaRow = {
  id: string; title: string; client: string | null; value: string | null;
  status: string | null; date: string | null;
};
export type GravacaoRow = {
  id: string; title: string; client: string | null; local: string | null;
  date: string | null; time: string | null; crew: string | null;
};
export type LancamentoRow = {
  id: string; descricao: string; tipo: "Entrada" | "Saída"; valor: number;
  data: string; status: "Recebido" | "Pago" | "Pendente";
};
export type MetaRow = {
  id: string; tipo: "Financeiro" | "Equipamento" | "Cliente" | "Customizada";
  titulo: string; descricao: string | null;
  valor_atual: number; valor_meta: number;
  unidade: string; prazo: string | null;
  status: "Em andamento" | "Concluída" | "Atrasada";
};
export type MensagemRow = {
  id: string;
  conversa_id: string;
  conversa_nome: string;
  conversa_projeto: string | null;
  remetente: string;
  texto: string;
  created_at: string;
};

export const projectsApi = makeHooks<ProjectRow>("projects");
export const clientsApi = makeHooks<ClientRow>("clients");
export const entregasApi = makeHooks<EntregaRow>("entregas");
export const propostasApi = makeHooks<PropostaRow>("propostas");
export const gravacoesApi = makeHooks<GravacaoRow>("gravacoes");
export const lancamentosApi = makeHooks<LancamentoRow>("lancamentos", "data");
export const metasApi = makeHooks<MetaRow>("metas");
export const mensagensApi = makeHooks<MensagemRow>("mensagens");
