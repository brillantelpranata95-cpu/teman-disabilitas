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
        .from('requests')
        .select('*')
        .order('tanggalPengajuan', { ascending: false });
      
      if (error) throw error;
      return res.status(200).json(data.map(r => r.data));
    }

    if (req.method === 'POST') {
      const item = req.body;
      if (!item?.id) return res.status(400).json({ error: 'Missing id' });

      const { error } = await supabase
        .from('requests')
        .upsert({ 
          id: item.id, 
          data: item, 
          updated_at: new Date().toISOString() 
        }, { onConflict: 'id' });
      
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (req.method === 'PATCH') {
      if (!hasAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
      const { id, updates } = req.body || {};
      if (!id || !updates) return res.status(400).json({ error: 'Missing id or updates' });

      const { data: currentData, error: fetchError } = await supabase
        .from('requests')
        .select('data')
        .eq('id', id)
        .single();
      
      if (fetchError || !currentData) return res.status(404).json({ error: 'Not found' });

      const merged = { ...currentData.data, ...updates };
      
      const { error } = await supabase
        .from('requests')
        .upsert({ 
          id: id, 
          data: merged, 
          updated_at: new Date().toISOString() 
        }, { onConflict: 'id' });
      
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      if (!hasAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing id' });

      const { error } = await supabase.from('requests').delete().eq('id', id);
      if (error) throw error;
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