import { query } from '../lib/db.js';
export const createAssortment = async (req, res) => {
    try {
        const { name, description, products } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Assortment name is required' });
        }
        const result = await query(`
            INSERT INTO "Assortment" (id, name, description)
            VALUES (gen_random_uuid(), $1, $2)
            RETURNING *
            `, [name, description ?? null]);
        const assortment = result.rows[0];
        if (Array.isArray(products)) {
            for (const productId of products) {
                await query(`
                    INSERT INTO "AssortmentProduct"
                    (id, "assortmentId", "productId")
                    VALUES (gen_random_uuid(), $1, $2)
                    `, [assortment.id, productId]);
            }
        }
        res.status(201).json(assortment);
    }
    catch (error) {
        console.error('createAssortment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getAssortments = async (_req, res) => {
    try {
        const result = await query(`SELECT * FROM "Assortment" ORDER BY "createdAt" DESC`);
        res.json(result.rows);
    }
    catch (error) {
        console.error('getAssortments error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getAssortmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const assortment = await query(`SELECT * FROM "Assortment" WHERE id = $1`, [id]);
        if (!assortment.rows.length) {
            return res.status(404).json({ message: 'Assortment not found' });
        }
        const products = await query(`
            SELECT p.*
            FROM "AssortmentProduct" ap
            JOIN "Product" p ON ap."productId" = p.id
            WHERE ap."assortmentId" = $1
            `, [id]);
        res.json({
            ...assortment.rows[0],
            products: products.rows,
        });
    }
    catch (error) {
        console.error('getAssortmentById error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const updateAssortment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const result = await query(`
            UPDATE "Assortment"
            SET name = COALESCE($2, name),
                description = COALESCE($3, description),
                "updatedAt" = NOW()
            WHERE id = $1
            RETURNING *
            `, [id, name, description]);
        if (!result.rows.length) {
            return res.status(404).json({ message: 'Assortment not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('updateAssortment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const deleteAssortment = async (req, res) => {
    try {
        const { id } = req.params;
        await query(`DELETE FROM "AssortmentProduct" WHERE "assortmentId" = $1`, [id]);
        const result = await query(`DELETE FROM "Assortment" WHERE id = $1 RETURNING id`, [id]);
        if (!result.rows.length) {
            return res.status(404).json({ message: 'Assortment not found' });
        }
        res.json({ message: 'Assortment deleted successfully' });
    }
    catch (error) {
        console.error('deleteAssortment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
