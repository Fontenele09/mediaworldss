
CREATE TABLE public.metas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  tipo TEXT NOT NULL DEFAULT 'Financeiro',
  titulo TEXT NOT NULL,
  descricao TEXT,
  valor_atual NUMERIC NOT NULL DEFAULT 0,
  valor_meta NUMERIC NOT NULL DEFAULT 0,
  unidade TEXT NOT NULL DEFAULT 'R$',
  prazo DATE,
  status TEXT NOT NULL DEFAULT 'Em andamento',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.metas TO authenticated;
GRANT ALL ON public.metas TO service_role;

ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own metas" ON public.metas FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER set_metas_updated_at BEFORE UPDATE ON public.metas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
