-- Enable UUID extension if not already enabled (standard in Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up existing data
TRUNCATE TABLE "OrderItem" CASCADE;
TRUNCATE TABLE "Order" CASCADE;
TRUNCATE TABLE "AssortmentItem" CASCADE;
TRUNCATE TABLE "Assortment" CASCADE;
TRUNCATE TABLE "Product" CASCADE;
TRUNCATE TABLE "Collection" CASCADE;
TRUNCATE TABLE "User" CASCADE;

-------------------------------------------------------------------------------
-- 1. Create Admin User
-- Password is 'password123' hashed with bcrypt
-------------------------------------------------------------------------------
INSERT INTO "User" (id, email, password, role, "companyName", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(), 
    'admin@stenna.com', 
    '$2a$10$EpRnTzVlqHNP0.fUbXUwSOyuixe/P1x10tTE5gRLMkjqqZ1JAPZQq', 
    'ADMIN', 
    'Stenna HQ', 
    NOW(), 
    NOW()
);

-------------------------------------------------------------------------------
-- 2. Create Collections
-------------------------------------------------------------------------------
-- We use fixed UUIDs for collections so we can reference them in products easily
-- Collection 1: Ephemeral Textures
INSERT INTO "Collection" (id, title, description, image, "createdAt", "updatedAt")
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Ephemeral Textures',
    'A study in tactile subtlety and organic decay.',
    'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80',
    NOW(),
    NOW()
);

-- Collection 2: Modern Minimal
INSERT INTO "Collection" (id, title, description, image, "createdAt", "updatedAt")
VALUES (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'Modern Minimal',
    'Architectural lines meeting negative space.',
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80',
    NOW(),
    NOW()
);

-------------------------------------------------------------------------------
-- 3. Create Products
-------------------------------------------------------------------------------

-- Product 1: Linen Washed Gray
INSERT INTO "Product" (
    id, name, sku, price, description, images, category, "collectionId",
    weight, material, "rollLength", "rollWidth", "designStyle",
    quantity, room, color, theme
) VALUES (
    gen_random_uuid(),
    'Linen Washed Gray',
    'LWG-001',
    120.0,
    'Soft, washed linen texture in a muted grayscale palette. Perfect for creating a calm, grounded atmosphere.',
    '["https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200"]',
    'TEXTURED',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '180gsm', 'Non-woven', '10m', '52cm', 'Textured',
    50, 'Bedroom', 'Neutral', 'Minimalist'
);

-- Product 2: Misty Forest
INSERT INTO "Product" (
    id, name, sku, price, description, images, category, "collectionId",
    weight, material, "rollLength", "rollWidth", "designStyle",
    quantity, room, color, theme
) VALUES (
    gen_random_uuid(),
    'Misty Forest',
    'MFR-002',
    185.0,
    'Etched tree lines fading into a morning fog. A visual poem for the walls.',
    '["https://images.unsplash.com/photo-1628191011893-6e7e63b33075?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200"]',
    'NATURE',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '220gsm', 'Vinyl', '10m', '53cm', 'Botanical',
    30, 'Living', 'Green', 'Nature'
);

-- Product 3: Geometric Concrete
INSERT INTO "Product" (
    id, name, sku, price, description, images, category, "collectionId",
    weight, material, "rollLength", "rollWidth", "designStyle",
    quantity, room, color, theme
) VALUES (
    gen_random_uuid(),
    'Geometric Concrete',
    'GCO-003',
    145.0,
    'Raw concrete texture with precise geometric gold inlays.',
    '["https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?auto=format&fit=crop&q=80&w=1200"]',
    'MODERN',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    '150gsm', 'Paper', '10m', '52cm', 'Geometric',
    100, 'Dining', 'Dark', 'Modern'
);

-- Product 4: Silk Plaster
INSERT INTO "Product" (
    id, name, sku, price, description, images, category, "collectionId",
    weight, material, "rollLength", "rollWidth", "designStyle",
    quantity, room, color, theme
) VALUES (
    gen_random_uuid(),
    'Silk Plaster',
    'SPL-004',
    210.0,
    'Hand-applied plaster effect with a silk finish. Exudes pure luxury.',
    '["https://images.unsplash.com/photo-1505691938895-1758d7bab58d?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1507643179173-4463bd0ed3fa?auto=format&fit=crop&q=80&w=1200"]',
    'CLASSIC',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    '200gsm', 'Silk Blend', '10m', '70cm', 'Plain',
    20, 'Living', 'White', 'Luxury'
);

-- Product 5: Parchment White
INSERT INTO "Product" (
    id, name, sku, price, description, images, category, "collectionId",
    weight, material, "rollLength", "rollWidth", "designStyle",
    quantity, room, color, theme
) VALUES (
    gen_random_uuid(),
    'Parchment White',
    'LWG-001-V2',
    135.0,
    'A lighter, airier variant of our classic linen texture. Brings a sense of expanding space and morning light.',
    '["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&q=80&w=1200"]',
    'TEXTURED',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '160gsm', 'Non-woven', '10m', '52cm', 'Textured',
    75, 'Bedroom', 'White', 'Minimalist'
);

-- Product 6: Nordic Pine
INSERT INTO "Product" (
    id, name, sku, price, description, images, category, "collectionId",
    weight, material, "rollLength", "rollWidth", "designStyle",
    quantity, room, color, theme
) VALUES (
    gen_random_uuid(),
    'Nordic Pine',
    'MFR-002-V2',
    195.0,
    'Deep forest greens and abstract pine needles creating a sanctuary of calm biophilia.',
    '["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1628191011893-6e7e63b33075?auto=format&fit=crop&q=80&w=1200"]',
    'NATURE',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '240gsm', 'Vinyl', '10m', '53cm', 'Botanical',
    40, 'Office', 'Green', 'Nature'
);

-------------------------------------------------------------------------------
-- 4. Initial System Settings (Homepage Content)
-------------------------------------------------------------------------------
INSERT INTO "SystemSetting" (key, value) VALUES
('homepage_video_url', 'https://videos.pexels.com/video-files/7578552/7578552-uhd_2560_1440_30fps.mp4'),
('homepage_hero_image', 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2680'),
('homepage_transform_image', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80'),
('homepage_color_image', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80'),
('homepage_room_image', 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

