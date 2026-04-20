/**
 * cleanup-tasks — Supabase Edge Function
 *
 * Deletes tasks whose completed_at is older than 30 days.
 *
 * Deploy:  supabase functions deploy cleanup-tasks
 * Schedule via Supabase Dashboard → Database → Cron jobs:
 *   cron: "0 3 * * *"  (daily at 03:00 UTC)
 *   command: select net.http_post(
 *     url := 'https://<project>.supabase.co/functions/v1/cleanup-tasks',
 *     headers := '{"Authorization":"Bearer <service_role_key>"}'::jsonb
 *   );
 *
 * Or use pg_cron directly:
 *   select cron.schedule(
 *     'cleanup-expired-tasks',
 *     '0 3 * * *',
 *     $$
 *       delete from public.tasks
 *       where completed_at is not null
 *         and completed_at < now() - interval '30 days';
 *     $$
 *   );
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req: Request) => {
  // Verify the request is authorised
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 30)

  const { error, count } = await supabase
    .from('tasks')
    .delete({ count: 'exact' })
    .not('completed_at', 'is', null)
    .lt('completed_at', cutoff.toISOString())

  if (error) {
    console.error('cleanup-tasks error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  console.log(`cleanup-tasks: deleted ${count ?? 0} expired task(s)`)
  return new Response(
    JSON.stringify({ deleted: count ?? 0, cutoff: cutoff.toISOString() }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
})
