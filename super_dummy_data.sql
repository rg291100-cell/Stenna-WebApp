-- 1. Ensure the Collections exist first to maintain foreign key integrity
INSERT INTO "Collection" (id, title, description, image)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'The Artisanal Series', 'Hand-finished textures and organic pigments.', 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Architectural Minimal', 'Clean lines and structural depth.', 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert/Update Products with 8 unique images each
-- This uses ON CONFLICT (sku) to update existing products if they already exist
INSERT INTO "Product" (
    id, name, sku, price, description, images, category, "collectionId",
    weight, material, "rollLength", "rollWidth", "designStyle",
    quantity, room, color, theme
) VALUES 
(
    gen_random_uuid(), 'Linen Washed Gray', 'LWG-PRO-001', 145.0,
    'A soft, washed linen texture that brings a sense of calm and tactile depth to modern bedrooms.',
    '[
        "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1560448130-1c05634584ae?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1513694203232-7e9a24520dc4?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1594498653385-d5172b532c00?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1592591502744-9ec489cb003b?auto=format&fit=crop&q=80&w=1200"
    ]',
    'TEXTURED', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '180gsm', 'Non-woven', '10m', '52cm', 'Textured', 50, 'Bedroom', 'Neutral', 'Minimalist'
),
(
    gen_random_uuid(), 'Midnight Emerald', 'MEM-PRO-002', 195.0,
    'Deep emerald forest tones with a matte finish, creating a sophisticated sanctuary in living spaces.',
    '[
        "https://images.unsplash.com/photo-1628191011893-6e7e63b33075?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1445964047600-cdbdb8736e3d?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1463947628408-f8581a2f4aca?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200"
    ]',
    'NATURE', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '220gsm', 'Vinyl', '10m', '53cm', 'Botanical', 30, 'Living', 'Green', 'Nature'
),
(
    gen_random_uuid(), 'Aura Charcoal', 'ACH-PRO-003', 165.0,
    'A minimalist study of shadow and light, this charcoal texture adds architectural depth to any room.',
    '[
        "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1505691938895-1758d7bab58d?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1510322295825-998ca4841961?auto=format&fit=crop&q=80&w=1200"
    ]',
    'MODERN', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    '200gsm', 'Paper', '10m', '52cm', 'Minimalist', 100, 'Living', 'Dark', 'Modern'
),
(
    gen_random_uuid(), 'Abstract Alabaster', 'AAL-PRO-004', 180.0,
    'Subtle plaster-like movements in pure alabaster white, perfect for brightening up open-plan dining areas.',
    '[
        "https://images.unsplash.com/photo-1507643179173-4463bd0ed3fa?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1510322295825-998ca4841961?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1513694203232-7e9a24520dc4?auto=format&fit=crop&q=80&w=1200"
    ]',
    'CLASSIC', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    '160gsm', 'Silk Blend', '10m', '70cm', 'Abstract', 20, 'Dining', 'White', 'Luxury'
)
ON CONFLICT (sku) DO UPDATE 
SET images = EXCLUDED.images,
    description = EXCLUDED.description,
    price = EXCLUDED.price;
