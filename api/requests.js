import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    // GET — list all requests ordered by tanggalPengajuan desc
    if (req.method === 'GET') {
      const { rows } = await sql`
        SELECT id, data FROM requests 
        ORDER BY (data->>'tanggalPengajuan') DESC
      `;
      return res.status(200).json(rows.map(r => r.data));
    }

    // POST — create/upsert request (public can create)
    if (req.method === 'POST') {
      const item = req.body;
      if (!item?.id) return res.status(400).json({ error: 'Missing id' });

      await sql`
        INSERT INTO requests (id, data, updated_at) VALUES (${item.id}, ${JSON.stringify(item)}, NOW())
        ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(item)}, updated_at = NOW()
      `;
      return res.status(200).json({ success: true });
    }

    // PATCH — partial update request (admin only)
    if (req.method === 'PATCH') {
      if (!hasAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
      const { id, updates } = req.body || {};
      if (!id || !updates) return res.status(400).json({ error: 'Missing id or updates' });

      // Fetch current data, merge updates, save back
      const { rows } = await sql`SELECT data FROM requests WHERE id = ${id}`;
      if (rows.length === 0) return res.status(404).json({ error: 'Not found' });

      const merged = { ...rows[0].data, ...updates };
      await sql`
        UPDATE requests SET data = ${JSON.stringify(merged)}, updated_at = NOW() WHERE id = ${id}
      `;
      return res.status(200).json({ success: true });
    }

    // DELETE — delete request (admin only)
    if (req.method === 'DELETE') {
      if (!hasAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing id' });

      await sql`DELETE FROM requests WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Requests API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

function hasAuth(req) {
  const cookie = req.headers.cookie || '';
  const token = cookie.match(/(?:^|;\s*)auth_token=([^;]*)/);
  const headerToken = req.headers['x-auth-token'];
  return !!(token?.[1] || headerToken);
}
