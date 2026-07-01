-- Add categoria column to lancamentos
ALTER TABLE public.lancamentos
  ADD COLUMN IF NOT EXISTS categoria text NOT NULL DEFAULT 'Freelancer';

ALTER TABLE public.lancamentos
  DROP CONSTRAINT IF EXISTS lancamentos_categoria_check;
ALTER TABLE public.lancamentos
  ADD CONSTRAINT lancamentos_categoria_check
  CHECK (categoria IN ('Freelancer','Recorrente','Fixo','Avulso','Outro'));

-- dividas_fixas
CREATE TABLE IF NOT EXISTS public.dividas_fixas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  descricao text NOT NULL,
  valor numeric NOT NULL DEFAULT 0,
  vencimento int CHECK (vencimento BETWEEN 1 AND 31),
  status text NOT NULL DEFAULT 'Em dia' CHECK (status IN ('Em dia','Atrasada','Paga')),
  recorrente boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.dividas_fixas TO authenticated;
GRANT ALL ON public.dividas_fixas TO service_role;

ALTER TABLE public.dividas_fixas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dividas_fixas_select_own" ON public.dividas_fixas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "dividas_fixas_insert_own" ON public.dividas_fixas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "dividas_fixas_update_own" ON public.dividas_fixas FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "dividas_fixas_delete_own" ON public.dividas_fixas FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER dividas_fixas_set_updated_at BEFORE UPDATE ON public.dividas_fixas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- prolabore
CREATE TABLE IF NOT EXISTS public.prolabore (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  socio text NOT NULL,
  valor numeric NOT NULL DEFAULT 0,
  mes text NOT NULL,
  status text NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente','Pago')),
  observacao text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.prolabore TO authenticated;
GRANT ALL ON public.prolabore TO service_role;

ALTER TABLE public.prolabore ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prolabore_select_own" ON public.prolabore FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "prolabore_insert_own" ON public.prolabore FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "prolabore_update_own" ON public.prolabore FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "prolabore_delete_own" ON public.prolabore FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER prolabore_set_updated_at BEFORE UPDATE ON public.prolabore
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();