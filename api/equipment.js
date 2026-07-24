import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase env vars not set. API routes will fail until configured.');
}

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export default async function handler(req, res) {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' });
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return res.status(200).json(data.map(r => r.data));
    }

    if (req.method === 'POST') {
      if (!hasAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
      const item = req.body;
      if (!item?.id) return res.status(400).json({ error: 'Missing id' });

      const { error } = await supabase
        .from('equipment')
        .upsert({ 
          id: item.id, 
          data: item, 
          updated_at: new Date().toISOString() 
        }, { onConflict: 'id' });
      
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      if (!hasAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing id' });

      const { error } = await supabase.from('equipment').delete().eq('id', id);
      if (error) throw error;
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