// api/lib/db.ts
import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool(): Pool {
    if (!pool) {
        const url = process.env.DATABASE_URL;

        if (!url) {
            throw new Error('DATABASE_URL is not defined');
        }

        pool = new Pool({
            connectionString: url,
            ssl: { rejectUnauthorized: false },
            max: 1,
            idleTimeoutMillis: 10000,
            connectionTimeoutMillis: 10000,
        });
    }

    return pool;
}

export async function query(text: string, params?: any[]) {
    return getPool().query(text, params);
}
