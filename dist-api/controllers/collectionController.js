import { query } from '../lib/db.js';
export const getCollections = async (_req, res) => {
    try {
        const result = await query(`SELECT * FROM "Collection" ORDER BY title ASC`);
        res.json(result.rows);
    }
    catch (error) {
        console.error('getCollections error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getCollectionById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query(`SELECT * FROM "Collection" WHERE id = $1`, [id]);
        if (!result.rows.length) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('getCollectionById error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
