import { createClient, type Client } from '@libsql/client'
import { join } from 'path'
import { mkdirSync } from 'fs'

let _client: Client | null = null

export function getDb(): Client {
  if (_client) return _client

  // Ensure data directory exists
  const dataDir = join(process.cwd(), 'data')
  mkdirSync(dataDir, { recursive: true })

  const dbPath = join(dataDir, 'briefs.db')

  _client = createClient({
    url: `file:${dbPath}`,
  })

  console.log('[DB] LibSQL initialized at', dbPath)
  return _client
}

export interface BriefRecord {
  id: number
  name: string
  email: string
  phone: string
  company: string | null
  project_type: string
  budget: string | null
  description: string | null
  timeline: string | null
  ip_address: string | null
  user_agent: string | null
  status: string
  created_at: string
  updated_at: string
}

// Initialize schema (call once on startup)
export async function initDb(): Promise<void> {
  const db = getDb()
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS briefs (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      name         TEXT    NOT NULL,
      email        TEXT    NOT NULL,
      phone        TEXT    NOT NULL,
      company      TEXT,
      project_type TEXT    NOT NULL,
      budget       TEXT,
      description  TEXT,
      timeline     TEXT,
      ip_address   TEXT,
      user_agent   TEXT,
      status       TEXT    NOT NULL DEFAULT 'new',
      created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_briefs_email      ON briefs(email);
    CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON briefs(created_at);
    CREATE INDEX IF NOT EXISTS idx_briefs_status     ON briefs(status);
  `)
}

export async function insertBrief(
  data: Omit<BriefRecord, 'id' | 'status' | 'created_at' | 'updated_at'>,
): Promise<BriefRecord> {
  const db = getDb()

  const result = await db.execute({
    sql: `INSERT INTO briefs
            (name, email, phone, company, project_type, budget, description, timeline, ip_address, user_agent)
          VALUES
            (:name, :email, :phone, :company, :project_type, :budget, :description, :timeline, :ip_address, :user_agent)`,
    args: {
      name:         data.name,
      email:        data.email,
      phone:        data.phone,
      company:      data.company,
      project_type: data.project_type,
      budget:       data.budget,
      description:  data.description,
      timeline:     data.timeline,
      ip_address:   data.ip_address,
      user_agent:   data.user_agent,
    },
  })

  const id = Number(result.lastInsertRowid)
  const row = await db.execute({ sql: 'SELECT * FROM briefs WHERE id = ?', args: [id] })
  return rowToRecord(row.rows[0])
}

export async function updateBriefStatus(id: number, status: string): Promise<void> {
  const db = getDb()
  await db.execute({
    sql: `UPDATE briefs SET status = ?, updated_at = datetime('now') WHERE id = ?`,
    args: [status, id],
  })
}

export async function getAllBriefs(): Promise<BriefRecord[]> {
  const db = getDb()
  const result = await db.execute('SELECT * FROM briefs ORDER BY created_at DESC')
  return result.rows.map(rowToRecord)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToRecord(row: any): BriefRecord {
  return {
    id:           Number(row.id),
    name:         String(row.name),
    email:        String(row.email),
    phone:        String(row.phone),
    company:      row.company ? String(row.company) : null,
    project_type: String(row.project_type),
    budget:       row.budget ? String(row.budget) : null,
    description:  row.description ? String(row.description) : null,
    timeline:     row.timeline ? String(row.timeline) : null,
    ip_address:   row.ip_address ? String(row.ip_address) : null,
    user_agent:   row.user_agent ? String(row.user_agent) : null,
    status:       String(row.status),
    created_at:   String(row.created_at),
    updated_at:   String(row.updated_at),
  }
}
