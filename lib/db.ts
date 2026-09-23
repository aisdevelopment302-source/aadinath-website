import 'server-only'
import postgres from 'postgres'

// Connection for Postgres role website_app, which may only INSERT visitor
// columns into schema `website` (no reads, no other schema). The URL is a
// server-only secret set in Vercel; never expose it as NEXT_PUBLIC_*.
// Supabase's transaction pooler (port 6543) does not support prepared statements.
const globalForDb = globalThis as unknown as { websiteSql?: postgres.Sql }

export function db(): postgres.Sql {
  if (!globalForDb.websiteSql) {
    const url = process.env.WEBSITE_DATABASE_URL
    if (!url) throw new Error('WEBSITE_DATABASE_URL is not set')
    globalForDb.websiteSql = postgres(url, { prepare: false, max: 1, idle_timeout: 20, connect_timeout: 10 })
  }
  return globalForDb.websiteSql
}
