import { query } from '../lib/db.js';
export const getColors = async (_req, res) => {
    try {
        const rows = await query(`SELECT * FROM "Color" ORDER BY name ASC`);
        res.json(rows);
    }
    catch (error) {
        console.error('getColors error:', error);
        res.status(500).json({ message: 'Failed to fetch colors' });
    }
};
export const createColor = async (req, res) => {
    try {
        const { name, hexCode } = req.body;
        const existing = await query(`SELECT 1 FROM "Color" WHERE name = $1`, [name]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Color already exists' });
        }
        const rows = await query(`
            INSERT INTO "Color" (id, name, "hexCode")
            VALUES (gen_random_uuid(), $1, $2)
            RETURNING *
            `, [name, hexCode]);
        res.status(201).json(rows[0]);
    }
    catch (error) {
        console.error('createColor error:', error);
        res.status(500).json({ message: 'Failed to create color' });
    }
};
