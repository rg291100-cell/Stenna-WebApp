import pkg from 'pg';
const { Pool } = pkg;
let pool = null;
export function getDb() {
    if (!pool) {
        const url = process.env.DATABASE_URL;
        if (!url) {
            throw new Error('DATABASE_URL is not defined');
        }
        pool = new Pool({
            connectionString: url,
            ssl: { rejectUnauthorized: false },
            max: 1
        });
        pool.on('error', (err) => {
            console.error('[DB] Pool error', err);
            pool = null;
        });
    }
    return pool;
}
export async function query(text, params) {
    const db = getDb();
    return db.query(text, params);
}
