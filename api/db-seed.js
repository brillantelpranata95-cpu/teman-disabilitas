import { sql } from '@vercel/postgres';

// Production: No seed data - admin adds via dashboard
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { secret } = req.body || {};
  if (secret !== process.env.SETUP_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Tables already exist from db-setup, just confirm
    const { rows: equipmentCount } = await sql`SELECT COUNT(*) FROM equipment`;
    const { rows: requestsCount } = await sql`SELECT COUNT(*) FROM requests`;
    
    return res.status(200).json({ 
      message: 'Database ready for production - no demo data seeded',
      equipmentCount: equipmentCount[0]?.count || 0,
      requestsCount: requestsCount[0]?.count || 0
    });
  } catch (error) {
    console.error('Seed error:', error);
    return res.status(500).json({ error: error.message });
  }
}