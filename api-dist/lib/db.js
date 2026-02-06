import pkg from 'pg';
const { Pool } = pkg;
let pool = null;
export function getDb() {
    if (!pool) {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL not set');
        }
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            max: 1
        });
    }
    return pool;
}
export async function query(text, params) {
    return getDb().query(text, params);
}
