// api/lib/db.ts
import pg from 'pg';

const { Pool } = pg;

let pool: pg.Pool | null = null;

function getPool(): pg.Pool {
    if (!pool) {
        const url = process.env.DATABASE_URL;

        if (!url) {
            throw new Error('DATABASE_URL is not defined');
        }

        console.log('[DB] Initializing PostgreSQL pool');

        pool = new Pool({
            connectionString: url,
            ssl: { rejectUnauthorized: false }, // REQUIRED for Supabase
            max: 1, // REQUIRED for Vercel
            idleTimeoutMillis: 10000,
            connectionTimeoutMillis: 10000,
        });

        pool.on('error', (err) => {
            console.error('[DB] Pool error', err);
            pool = null;
        });
    }

    return pool;
}

export async function query(text: string, params?: any[]) {
    const pool = getPool();
    return pool.query(text, params);
}
