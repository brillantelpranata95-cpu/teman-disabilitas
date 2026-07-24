-- Supabase Database Setup for PERISAI Temon - Teman Disabilitas
-- Run this in Supabase Dashboard > SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: equipment
CREATE TABLE IF NOT EXISTS equipment (
  id VARCHAR(50) PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: requests
CREATE TABLE IF NOT EXISTS requests (
  id VARCHAR(50) PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_equipment_updated_at ON equipment (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_tanggal ON requests ((data->>'tanggalPengajuan') DESC);
CREATE INDEX IF NOT EXISTS idx_requests_stage ON requests ((data->>'stage'));
CREATE INDEX IF NOT EXISTS idx_requests_archived ON requests ((data->>'isArchived'));

-- Enable Row Level Security (RLS)
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read equipment (for catalog)
CREATE POLICY "Public read equipment" ON equipment
  FOR SELECT USING (true);

-- Policy: Public can read requests (for admin dashboard - read only)
CREATE POLICY "Public read requests" ON requests
  FOR SELECT USING (true);

-- Policy: Authenticated users (service role) can insert/update equipment
CREATE POLICY "Service role write equipment" ON equipment
  FOR ALL USING (auth.role() = 'service_role');

-- Policy: Authenticated users (service role) can insert/update/delete requests
CREATE POLICY "Service role write requests" ON requests
  FOR ALL USING (auth.role() = 'service_role');

-- Optional: Trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify setup
SELECT 'equipment' as table_name, count(*) as row_count FROM equipment
UNION ALL
SELECT 'requests' as table_name, count(*) as row_count FROM requests;