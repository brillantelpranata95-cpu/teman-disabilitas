import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    // GET — list all equipment
    if (req.method === 'GET') {
      const { rows } = await sql`SELECT id, data FROM equipment ORDER BY created_at`;
      return res.status(200).json(rows.map(r => r.data));
    }

    // POST — upsert equipment
    if (req.method === 'POST') {
      if (!hasAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
      const item = req.body;
      if (!item?.id) return res.status(400).json({ error: 'Missing id' });

      await sql`
        INSERT INTO equipment (id, data, updated_at) VALUES (${item.id}, ${JSON.stringify(item)}, NOW())
        ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(item)}, updated_at = NOW()
      `;
      return res.status(200).json({ success: true });
    }

    // DELETE — delete equipment by id
    if (req.method === 'DELETE') {
      if (!hasAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing id' });

      await sql`DELETE FROM equipment WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Equipment API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

function hasAuth(req) {
  const cookie = req.headers.cookie || '';
  const token = cookie.match(/(?:^|;\s*)auth_token=([^;]*)/);
  const headerToken = req.headers['x-auth-token'];
  return !!(token?.[1] || headerToken);
}
