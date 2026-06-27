CREATE TABLE public.mensagens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversa_id TEXT NOT NULL,
  conversa_nome TEXT NOT NULL,
  conversa_projeto TEXT,
  remetente TEXT NOT NULL,
  texto TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mensagens TO authenticated;
GRANT ALL ON public.mensagens TO service_role;

ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mensagens"
  ON public.mensagens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mensagens"
  ON public.mensagens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mensagens"
  ON public.mensagens FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mensagens"
  ON public.mensagens FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER set_mensagens_updated_at
  BEFORE UPDATE ON public.mensagens
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX mensagens_user_conversa_idx ON public.mensagens(user_id, conversa_id, created_at);