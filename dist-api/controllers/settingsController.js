import { query } from '../lib/db.js';
export const getSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const result = await query(`SELECT * FROM "SystemSetting" WHERE key = $1`, [key]);
        res.json(result.rows[0] ?? { key, value: '' });
    }
    catch (error) {
        console.error('getSetting error:', error);
        res.status(500).json({ message: 'Failed to fetch setting' });
    }
};
export const updateSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        const result = await query(`
            INSERT INTO "SystemSetting" (key, value)
            VALUES ($1, $2)
            ON CONFLICT (key)
            DO UPDATE SET value = EXCLUDED.value
            RETURNING *
            `, [key, value]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('updateSetting error:', error);
        res.status(500).json({ message: 'Failed to update setting' });
    }
};
