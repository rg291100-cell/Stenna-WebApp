-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-------------------------------------------------------------------------------
-- CLEANUP (Optional - Uncomment if you want to wipe data first)
-------------------------------------------------------------------------------
-- TRUNCATE TABLE "OrderItem" CASCADE;
-- TRUNCATE TABLE "Order" CASCADE;
-- TRUNCATE TABLE "AssortmentItem" CASCADE;
-- TRUNCATE TABLE "Assortment" CASCADE;
-- TRUNCATE TABLE "Product" CASCADE;
-- TRUNCATE TABLE "Collection" CASCADE;
-- TRUNCATE TABLE "User" CASCADE;

-------------------------------------------------------------------------------
-- 1. Ensure Collections Exist (Upsert)
-------------------------------------------------------------------------------
INSERT INTO "Collection" (id, title, description, image)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Ephemeral Textures', 'A study in tactile subtlety.', 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Modern Minimal', 'Architectural lines meeting negative space.', 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Botanical Dreams', 'Bringing the outside in with organic forms.', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-------------------------------------------------------------------------------
-- 2. Insert Extended Product List (20 Items)
-------------------------------------------------------------------------------
-- Using ON CONFLICT (sku) DO NOTHING to avoid errors if run multiple times

INSERT INTO "Product" (
    id, name, sku, price, description, images, category, "collectionId",
    weight, material, "rollLength", "rollWidth", "designStyle",
    quantity, room, color, theme
) VALUES 
-- TEXTURED COLLECTION
(
    gen_random_uuid(), 'Linen Washed Gray', 'LWG-001', 120.0,
    'Soft, washed linen texture in a muted grayscale palette.',
    '["https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200"]',
    'TEXTURED', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '180gsm', 'Non-woven', '10m', '52cm', 'Textured', 50, 'Bedroom', 'Neutral', 'Minimalist'
),
(
    gen_random_uuid(), 'Sandstone Beige', 'SSB-005', 115.0,
    'Warm earthy tones mimicking natural sandstone patterns.',
    '["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1200"]',
    'TEXTURED', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '180gsm', 'Non-woven', '10m', '52cm', 'Textured', 60, 'Living', 'Warm', 'Modern'
),
(
    gen_random_uuid(), 'Woven Grasscloth', 'WGC-006', 160.0,
    'Authentic grasscloth texture providing depth and warmth.',
    '["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200"]',
    'TEXTURED', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '200gsm', 'Grasscloth', '10m', '90cm', 'Textured', 40, 'Office', 'Warm', 'Nature'
),
(
    gen_random_uuid(), 'Raw Silk Cream', 'RSC-007', 190.0,
    'The elegance of raw silk in a soft cream hue.',
    '["https://images.unsplash.com/photo-1513694203232-7e9a24520dc4?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1507643179173-4463bd0ed3fa?auto=format&fit=crop&q=80&w=1200"]',
    'TEXTURED', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '150gsm', 'Silk', '10m', '53cm', 'Fabric', 25, 'Bedroom', 'White', 'Luxury'
),

-- NATURE COLLECTION
(
    gen_random_uuid(), 'Misty Forest', 'MFR-002', 185.0,
    'Etched tree lines fading into a morning fog.',
    '["https://images.unsplash.com/photo-1628191011893-6e7e63b33075?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200"]',
    'NATURE', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    '220gsm', 'Vinyl', '10m', '53cm', 'Botanical', 30, 'Living', 'Green', 'Nature'
),
(
    gen_random_uuid(), 'Tropical Ferns', 'TRF-008', 175.0,
    'Bold fern patterns for a striking biophilic wall.',
    '["https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1445964047600-cdbdb8736e3d?auto=format&fit=crop&q=80&w=1200"]',
    'NATURE', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    '180gsm', 'Non-woven', '10m', '52cm', 'Botanical', 85, 'Bathroom', 'Green', 'Nature'
),
(
    gen_random_uuid(), 'Floral Watercolor', 'FWC-009', 140.0,
    'Soft watercolor blossoms in pastel hues.',
    '["https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1463947628408-f8581a2f4aca?auto=format&fit=crop&q=80&w=1200"]',
    'NATURE', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    '160gsm', 'Paper', '10m', '52cm', 'Floral', 100, 'Bedroom', 'White', 'Romantic'
),
(
    gen_random_uuid(), 'Deep Ocean', 'DOC-010', 165.0,
    'Fluid blue gradients resembling the depth of the sea.',
    '["https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&q=80&w=1200"]',
    'NATURE', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    '200gsm', 'Vinyl', '10m', '53cm', 'Abstract', 45, 'Bathroom', 'Blue', 'Modern'
),

-- MODERN COLLECTION
(
    gen_random_uuid(), 'Geometric Concrete', 'GCO-003', 145.0,
    'Raw concrete texture with precise geometric gold inlays.',
    '["https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?auto=format&fit=crop&q=80&w=1200"]',
    'MODERN', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    '150gsm', 'Paper', '10m', '52cm', 'Geometric', 100, 'Dining', 'Dark', 'Modern'
),
(
    gen_random_uuid(), 'Brushed Copper', 'GCO-003-V2', 155.0,
    'Warm metallic accents on industrial gray.',
    '["https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=1200"]',
    'MODERN', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    '160gsm', 'Paper', '10m', '52cm', 'Industrial', 80, 'Dining', 'Warm', 'Industrial'
),
(
    gen_random_uuid(), 'Midnight Hexagon', 'MHX-011', 180.0,
    'Dark navy hexagons with fine silver detailing.',
    '["https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200"]',
    'MODERN', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    '180gsm', 'Non-woven', '10m', '52cm', 'Geometric', 70, 'Living', 'Dark', 'Modern'
),
(
    gen_random_uuid(), 'Abstract Charcoal', 'ACH-012', 130.0,
    'Expressive charcoal strokes on a white canvas.',
    '["https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&q=80&w=1200"]',
    'MODERN', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    '160gsm', 'Paper', '10m', '53cm', 'Abstract', 90, 'Office', 'White', 'Artistic'
),

-- CLASSIC COLLECTION
(
    gen_random_uuid(), 'Silk Plaster', 'SPL-004', 210.0,
    'Hand-applied plaster effect with a silk finish.',
    '["https://images.unsplash.com/photo-1505691938895-1758d7bab58d?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1507643179173-4463bd0ed3fa?auto=format&fit=crop&q=80&w=1200"]',
    'CLASSIC', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    '200gsm', 'Silk Blend', '10m', '70cm', 'Plain', 20, 'Living', 'White', 'Luxury'
),
(
    gen_random_uuid(), 'Velvet Noir', 'SPL-004-V2', 240.0,
    'Deep, rich black texture with a velvet-like finish.',
    '["https://images.unsplash.com/photo-1507643179173-4463bd0ed3fa?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1505691938895-1758d7bab58d?auto=format&fit=crop&q=80&w=1200"]',
    'CLASSIC', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    '220gsm', 'Silk Blend', '10m', '70cm', 'Plain', 15, 'Living', 'Dark', 'Luxury'
),
(
    gen_random_uuid(), 'Royal Damask', 'RDM-013', 250.0,
    'Intricate damask pattern in muted gold and cream.',
    '["https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=1200"]',
    'CLASSIC', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '240gsm', 'Textured Vinyl', '10m', '70cm', 'Damask', 10, 'Dining', 'Warm', 'Luxury'
),
(
    gen_random_uuid(), 'Vintage Rose', 'VRS-014', 195.0,
    'Faded rose patterns evoking a sense of nostalgia.',
    '["https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&q=80&w=1200"]',
    'CLASSIC', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '180gsm', 'Paper', '10m', '53cm', 'Floral', 55, 'Bedroom', 'Warm', 'Vintage'
)

ON CONFLICT (sku) DO UPDATE 
SET price = EXCLUDED.price, 
    quantity = EXCLUDED.quantity,
    images = EXCLUDED.images;
