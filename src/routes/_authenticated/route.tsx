import { createFileRoute, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user } = Route.useRouteContext();
  const router = useRouter();
  const [needsName, setNeedsName] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("preferred_name, full_name")
        .eq("id", user.id)
        .maybeSingle();
      if (!active) return;
      if (!data) {
        // trigger may have failed; create row
        await supabase.from("profiles").insert({ id: user.id, email: user.email });
        setNeedsName(true);
      } else {
        setNeedsName(!data.preferred_name);
        setName(data.full_name?.split(" ")[0] ?? "");
      }
    })();
    return () => {
      active = false;
    };
  }, [user.id, user.email]);

  async function savePreferredName(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ preferred_name: name.trim() })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Não foi possível salvar seu nome. Tente novamente.");
      return;
    }
    toast.success(`Bem-vindo, ${name.trim()}!`);
    setNeedsName(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.navigate({ to: "/auth", replace: true });
  }

  return (
    <>
      <Outlet />
      <button
        onClick={handleSignOut}
        className="fixed top-3 right-3 z-40 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur transition hover:text-foreground hover:border-foreground/30"
      >
        <LogOut className="h-3.5 w-3.5" /> Sair
      </button>

      {needsName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <form
            onSubmit={savePreferredName}
            className="w-full max-w-md rounded-2xl border border-emerald-500/20 bg-[#0b0f0d] p-8 shadow-[0_24px_80px_-20px_rgba(16,185,129,0.35)]"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-black">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Como devemos te chamar?</h2>
                <p className="text-xs text-white/50">Esse nome aparece no painel.</p>
              </div>
            </div>
            <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-white/40">
              Nome preferido
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Lucas"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-emerald-400/60 focus:bg-white/10"
            />
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="mt-5 w-full rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-500 px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:from-emerald-300 hover:to-emerald-400 disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Continuar"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
