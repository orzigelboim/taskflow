-- Restrict access to authenticated users only
drop policy if exists "allow all lists" on public.lists;
drop policy if exists "allow all tasks" on public.tasks;

create policy "authenticated users lists" on public.lists
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated users tasks" on public.tasks
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
