import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { Film, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
});

function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.navigate({ to: "/", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.navigate({ to: "/", replace: true });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  async function handleGoogle() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setLoading(false);
      toast.error("Não foi possível entrar com o Google. Tente novamente.");
      return;
    }
    if (result.redirected) return;
    router.navigate({ to: "/", replace: true });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05080a] text-white">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-emerald-500/20 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-52 -right-32 h-[520px] w-[520px] rounded-full bg-emerald-400/10 blur-[160px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-between gap-16 px-8 py-16">
        {/* Left brand */}
        <div className="hidden flex-1 lg:block">
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-emerald-300/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_2px_rgba(16,185,129,0.7)]" />
            Sistema interno · v1.0
          </div>
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight">
            O centro de comando da sua{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
              produtora audiovisual
            </span>
            .
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/55">
            Clientes, projetos, gravações, entregas e financeiro — orquestrados em uma única
            interface, feita para quem dirige a operação.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-xs text-white/40">
            <div>
              <div className="text-2xl font-semibold text-white">100%</div>
              <div className="mt-1 uppercase tracking-[0.16em]">Privado</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">SSO</div>
              <div className="mt-1 uppercase tracking-[0.16em]">Google</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">24/7</div>
              <div className="mt-1 uppercase tracking-[0.16em]">Disponível</div>
            </div>
          </div>
        </div>

        {/* Right card */}
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-emerald-500/15 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-10 shadow-[0_32px_100px_-20px_rgba(16,185,129,0.25)] backdrop-blur-xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-black shadow-lg shadow-emerald-500/30">
                <Film className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-tight">sistemamedia</div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Acesso restrito
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">Entrar na plataforma</h2>
            <p className="mt-2 text-sm text-white/50">
              Use sua conta corporativa para acessar o painel da operação.
            </p>

            <button
              onClick={handleGoogle}
              disabled={loading}
              className="group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white px-5 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg shadow-black/40 transition hover:bg-white/95 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon className="h-4 w-4" />
              )}
              {loading ? "Conectando..." : "Continuar com Google"}
            </button>

            <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/30">
              <span className="h-px flex-1 bg-white/10" />
              Seguro
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <p className="text-center text-xs leading-relaxed text-white/40">
              Ao entrar, você concorda com as políticas internas de uso da plataforma.
            </p>
          </div>

          <div className="mt-6 text-center text-[11px] uppercase tracking-[0.22em] text-white/30">
            © {new Date().getFullYear()} · Núcleo de operações
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.45c-.28 1.5-1.12 2.77-2.39 3.62v3h3.86c2.26-2.08 3.57-5.15 3.57-8.86z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.92l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.21 7.21 0 0 1 0-4.56V6.63H1.29a12 12 0 0 0 0 10.74l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.63l3.98 3.09C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}
