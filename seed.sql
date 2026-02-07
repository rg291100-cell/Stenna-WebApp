-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up existing tables if they exist (to ensure fresh start)
DROP TABLE IF EXISTS "OrderItem" CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "AssortmentItem" CASCADE;
DROP TABLE IF EXISTS "Assortment" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "Collection" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "SystemSetting" CASCADE;
DROP TABLE IF EXISTS "Color" CASCADE;

-------------------------------------------------------------------------------
-- 1. Create Tables (DDL)
-------------------------------------------------------------------------------

CREATE TABLE "User" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'RETAILER',
    "companyName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Collection" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Product" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "specs" TEXT,
    "images" TEXT NOT NULL,
    "videos" TEXT,
    "category" TEXT NOT NULL,
    "weight" TEXT,
    "material" TEXT,
    "rollLength" TEXT,
    "rollWidth" TEXT,
    "designStyle" TEXT,
    "room" TEXT,
    "color" TEXT,
    "theme" TEXT,
    "collectionId" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

CREATE TABLE "Assortment" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assortment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AssortmentItem" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "assortmentId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "AssortmentItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Order" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SystemSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("key")
);

CREATE TABLE "Color" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "hexCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Color_name_key" ON "Color"("name");

-------------------------------------------------------------------------------
-- 2. Add Foreign Keys
-------------------------------------------------------------------------------

ALTER TABLE "Product" ADD CONSTRAINT "Product_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Assortment" ADD CONSTRAINT "Assortment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "AssortmentItem" ADD CONSTRAINT "AssortmentItem_assortmentId_fkey" FOREIGN KEY ("assortmentId") REFERENCES "Assortment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "AssortmentItem" ADD CONSTRAINT "AssortmentItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-------------------------------------------------------------------------------
-- 3. Seed Data (Content)
-------------------------------------------------------------------------------

-- Create Admin User (password: password123)
INSERT INTO "User" (id, email, password, role, "companyName", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(), 
    'admin@stenna.com', 
    '$2b$10$mpEETBMKoFucI4lh522.6OXqIU17ieGBKJJdekn/Hijef2ej/.jui', 
    'ADMIN', 
    'Stenna HQ', 
    NOW(), 
    NOW()
);

-- Create Collections
INSERT INTO "Collection" (id, title, description, image)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Ephemeral Textures',
    'A study in tactile subtlety and organic decay.',
    'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80'
), (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'Modern Minimal',
    'Architectural lines meeting negative space.',
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80'
);

-- Create Products
INSERT INTO "Product" (
    id, name, sku, price, description, images, category, "collectionId",
    weight, material, "rollLength", "rollWidth", "designStyle",
    quantity, room, color, theme
) VALUES (
    gen_random_uuid(), 'Linen Washed Gray', 'LWG-001', 120.0,
    'Soft, washed linen texture in a muted grayscale palette.',
    '["https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200"]',
    'TEXTURED', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '180gsm', 'Non-woven', '10m', '52cm', 'Textured', 50, 'Bedroom', 'Neutral', 'Minimalist'
), (
    gen_random_uuid(), 'Misty Forest', 'MFR-002', 185.0,
    'Etched tree lines fading into a morning fog.',
    '["https://images.unsplash.com/photo-1628191011893-6e7e63b33075?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200"]',
    'NATURE', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '220gsm', 'Vinyl', '10m', '53cm', 'Botanical', 30, 'Living', 'Green', 'Nature'
), (
    gen_random_uuid(), 'Geometric Concrete', 'GCO-003', 145.0,
    'Raw concrete texture with precise geometric gold inlays.',
    '["https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?auto=format&fit=crop&q=80&w=1200"]',
    'MODERN', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    '150gsm', 'Paper', '10m', '52cm', 'Geometric', 100, 'Dining', 'Dark', 'Modern'
), (
    gen_random_uuid(), 'Silk Plaster', 'SPL-004', 210.0,
    'Hand-applied plaster effect with a silk finish.',
    '["https://images.unsplash.com/photo-1505691938895-1758d7bab58d?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1507643179173-4463bd0ed3fa?auto=format&fit=crop&q=80&w=1200"]',
    'CLASSIC', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    '200gsm', 'Silk Blend', '10m', '70cm', 'Plain', 20, 'Living', 'White', 'Luxury'
), (
    gen_random_uuid(), 'Parchment White', 'LWG-001-V2', 135.0,
    'A lighter, airier variant of our classic linen texture.',
    '["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&q=80&w=1200"]',
    'TEXTURED', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '160gsm', 'Non-woven', '10m', '52cm', 'Textured', 75, 'Bedroom', 'White', 'Minimalist'
), (
    gen_random_uuid(), 'Nordic Pine', 'MFR-002-V2', 195.0,
    'Deep forest greens and abstract pine needles creating a sanctuary of calm.',
    '["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1628191011893-6e7e63b33075?auto=format&fit=crop&q=80&w=1200"]',
    'NATURE', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '240gsm', 'Vinyl', '10m', '53cm', 'Botanical', 40, 'Office', 'Green', 'Nature'
), (
    gen_random_uuid(), 'Brushed Copper', 'GCO-003-V2', 155.0,
    'Warm metallic accents on a cool industrial gray base.',
    '["https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=1200"]',
    'MODERN', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    '160gsm', 'Paper', '10m', '52cm', 'Industrial', 80, 'Dining', 'Warm', 'Industrial'
), (
    gen_random_uuid(), 'Velvet Noir', 'SPL-004-V2', 240.0,
    'Deep, rich black texture with a velvet-like finish.',
    '["https://images.unsplash.com/photo-1507643179173-4463bd0ed3fa?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1505691938895-1758d7bab58d?auto=format&fit=crop&q=80&w=1200"]',
    'CLASSIC', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    '220gsm', 'Silk Blend', '10m', '70cm', 'Plain', 15, 'Living', 'Dark', 'Luxury'
);

-- Set Home Screen Settings
INSERT INTO "SystemSetting" (key, value) VALUES
('homepage_video_url', 'https://videos.pexels.com/video-files/7578552/7578552-uhd_2560_1440_30fps.mp4'),
('homepage_hero_image', 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2680'),
('homepage_transform_image', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80'),
('homepage_color_image', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80'),
('homepage_room_image', 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
