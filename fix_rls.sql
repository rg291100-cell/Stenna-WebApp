-------------------------------------------------------------------------------
-- FIX: Enable Public Read Access (Row Level Security)
-- Supabase hides data by default. We must explicitly allow public access.
-------------------------------------------------------------------------------

-- 1. Enable RLS on tables (good practice, often on by default)
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Collection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Color" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SystemSetting" ENABLE ROW LEVEL SECURITY;

-- 2. Create Policies to Allow PUBLIC "SELECT" (Read access)
-- We use "IF NOT EXISTS" logic by dropping first to avoid errors on re-run

DROP POLICY IF EXISTS "Public Read Products" ON "Product";
CREATE POLICY "Public Read Products" ON "Product" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Collections" ON "Collection";
CREATE POLICY "Public Read Collections" ON "Collection" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Colors" ON "Color";
CREATE POLICY "Public Read Colors" ON "Color" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Settings" ON "SystemSetting";
CREATE POLICY "Public Read Settings" ON "SystemSetting" FOR SELECT USING (true);

-------------------------------------------------------------------------------
-- 3. Verify Data Exists (Optional re-seed just in case)
-------------------------------------------------------------------------------
-- This part ensures at least one product exists if the previous seed failed silently.
INSERT INTO "Product" (
    id, name, sku, price, description, images, category,
    weight, material, "rollLength", "rollWidth", "designStyle",
    quantity, room, color, theme
) VALUES (
    'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 
    'Debug Test Wallpaper', 
    'DBG-001', 
    99.0,
    'If you can see this, the database connection and RLS are working.',
    '["https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80"]',
    'TEXTURED',
    '150gsm', 'Paper', '10m', '53cm', 'Debug', 10, 'Office', 'White', 'Debug'
) ON CONFLICT (sku) DO NOTHING;
