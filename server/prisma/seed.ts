
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Clean up
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.assortmentItem.deleteMany();
    await prisma.assortment.deleteMany();
    await prisma.product.deleteMany();
    await prisma.collection.deleteMany();
    await prisma.user.deleteMany();

    // 2. Create Collections
    const collections = [
        {
            title: 'Ephemeral Textures',
            description: 'A study in tactile subtlety and organic decay.',
            image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80',
        },
        {
            title: 'Modern Minimal',
            description: 'Architectural lines meeting negative space.',
            image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80',
        },
    ];

    const createdCollections = await Promise.all(
        collections.map((c) => prisma.collection.create({ data: c }))
    );

    // 3. Create Products with 8 Images each
    const products = [
        {
            name: 'Linen Washed Gray',
            sku: 'LWG-001',
            price: 120.0,
            description: 'Soft, washed linen texture in a muted grayscale palette. Perfect for creating a calm, grounded atmosphere.',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1505691938895-1758d7bab58d?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1513694203232-7e9a24520dc4?auto=format&fit=crop&q=80&w=1200'
            ]),
            category: 'TEXTURED',
            collectionId: createdCollections[0].id,
            weight: '180gsm', material: 'Non-woven',
            rollLength: '10m', rollWidth: '52cm', designStyle: 'Textured',
            quantity: 50,
            room: 'Bedroom',
            color: 'Neutral',
            theme: 'Minimalist'
        },
        {
            name: 'Misty Forest',
            sku: 'MFR-002',
            price: 185.0,
            description: 'Etched tree lines fading into a morning fog. A visual poem for the walls.',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1628191011893-6e7e63b33075?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1445964047600-cdbdb8736e3d?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1463947628408-f8581a2f4aca?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1518098268026-4e1877433641?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200'
            ]),
            category: 'NATURE',
            collectionId: createdCollections[0].id,
            weight: '220gsm', material: 'Vinyl',
            rollLength: '10m', rollWidth: '53cm', designStyle: 'Botanical',
            quantity: 30,
            room: 'Living',
            color: 'Green',
            theme: 'Nature'
        },
        {
            name: 'Geometric Concrete',
            sku: 'GCO-003',
            price: 145.0,
            description: 'Raw concrete texture with precise geometric gold inlays.',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1518005052304-a32d1719b3a6?auto=format&fit=crop&q=80&w=1200'
            ]),
            category: 'MODERN',
            collectionId: createdCollections[1].id,
            weight: '150gsm', material: 'Paper',
            rollLength: '10m', rollWidth: '52cm', designStyle: 'Geometric',
            quantity: 100,
            room: 'Dining',
            color: 'Dark',
            theme: 'Modern'
        },
        {
            name: 'Silk Plaster',
            sku: 'SPL-004',
            price: 210.0,
            description: 'Hand-applied plaster effect with a silk finish. Exudes pure luxury.',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1505691938895-1758d7bab58d?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1507643179173-4463bd0ed3fa?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1523309259846-95383921ae9b?auto=format&fit=crop&q=80&w=1200'
            ]),
            category: 'CLASSIC',
            collectionId: createdCollections[1].id,
            weight: '200gsm', material: 'Silk Blend',
            rollLength: '10m', rollWidth: '70cm', designStyle: 'Plain',
            quantity: 20,
            room: 'Living',
            color: 'White',
            theme: 'Luxury'
        },
        {
            name: 'Parchment White',
            sku: 'LWG-001-V2',
            price: 135.0,
            description: 'A lighter, airier variant of our classic linen texture. Brings a sense of expanding space and morning light.',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1505691938895-1758d7bab58d?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1513694203232-7e9a24520dc4?auto=format&fit=crop&q=80&w=1200'
            ]),
            category: 'TEXTURED',
            collectionId: createdCollections[0].id,
            weight: '160gsm', material: 'Non-woven',
            rollLength: '10m', rollWidth: '52cm', designStyle: 'Textured',
            quantity: 75,
            room: 'Bedroom',
            color: 'White',
            theme: 'Minimalist'
        },
        {
            name: 'Nordic Pine',
            sku: 'MFR-002-V2',
            price: 195.0,
            description: 'Deep forest greens and abstract pine needles creating a sanctuary of calm biophilia.',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1628191011893-6e7e63b33075?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1445964047600-cdbdb8736e3d?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1463947628408-f8581a2f4aca?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1518098268026-4e1877433641?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200'
            ]),
            category: 'NATURE',
            collectionId: createdCollections[0].id,
            weight: '240gsm', material: 'Vinyl',
            rollLength: '10m', rollWidth: '53cm', designStyle: 'Botanical',
            quantity: 40,
            room: 'Office',
            color: 'Green',
            theme: 'Nature'
        },
        {
            name: 'Brushed Copper',
            sku: 'GCO-003-V2',
            price: 155.0,
            description: 'Warm metallic accents on a cool industrial gray base. A striking balance of warmth and minimalism.',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1518005052304-a32d1719b3a6?auto=format&fit=crop&q=80&w=1200'
            ]),
            category: 'MODERN',
            collectionId: createdCollections[1].id,
            weight: '160gsm', material: 'Paper',
            rollLength: '10m', rollWidth: '52cm', designStyle: 'Industrial',
            quantity: 80,
            room: 'Dining',
            color: 'Warm',
            theme: 'Industrial'
        },
        {
            name: 'Velvet Noir',
            sku: 'SPL-004-V2',
            price: 240.0,
            description: 'Deep, rich black texture with a velvet-like finish. The ultimate statement of luxury.',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1507643179173-4463bd0ed3fa?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1505691938895-1758d7bab58d?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1523309259846-95383921ae9b?auto=format&fit=crop&q=80&w=1200'
            ]),
            category: 'CLASSIC',
            collectionId: createdCollections[1].id,
            weight: '220gsm', material: 'Silk Blend',
            rollLength: '10m', rollWidth: '70cm', designStyle: 'Plain',
            quantity: 15,
            room: 'Living',
            color: 'Dark',
            theme: 'Luxury'
        }
    ];

    for (const p of products) {
        // @ts-ignore
        await prisma.product.create({ data: p });
    }

    // 4. Create Admin User
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
        data: {
            email: 'admin@stenna.com',
            password: hashedPassword,
            role: 'ADMIN',
            companyName: 'Stenna HQ'
        }
    });
    console.log('Admin user created: admin@stenna.com / password123');

    console.log('Seeding started.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
