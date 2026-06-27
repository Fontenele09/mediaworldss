
DROP POLICY "Users can delete own mensagens" ON public.mensagens;
DROP POLICY "Users can insert own mensagens" ON public.mensagens;
DROP POLICY "Users can update own mensagens" ON public.mensagens;
DROP POLICY "Users can view own mensagens" ON public.mensagens;

CREATE POLICY "Users can view own mensagens" ON public.mensagens FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mensagens" ON public.mensagens FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mensagens" ON public.mensagens FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own mensagens" ON public.mensagens FOR DELETE TO authenticated USING (auth.uid() = user_id);
