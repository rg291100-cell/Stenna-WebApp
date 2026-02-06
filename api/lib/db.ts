// api/lib/db.ts
import pkg from 'pg';
const { Pool } = pkg;

let pool: Pool | null = null;

function getDb(): Pool {
    if (!pool) {
        const url = process.env.DATABASE_URL;

        if (!url) {
            throw new Error('DATABASE_URL is not defined');
        }

        console.log('[DB] Initializing PostgreSQL pool');

        pool = new Pool({
            connectionString: url,
            ssl: { rejectUnauthorized: false },
            max: 1,
            idleTimeoutMillis: 10000,
            connectionTimeoutMillis: 10000,
        });

        pool.on('error', (err) => {
            console.error('[DB] Pool error:', err);
            pool = null;
        });
    }

    return pool;
}

export async function query(text: string, params?: any[]) {
    const db = getDb();
    return db.query(text, params);
}
