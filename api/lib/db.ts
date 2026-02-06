import pg from 'pg';

const { Pool } = pg;

let pool: pg.Pool | null = null;

function getPool(): pg.Pool {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        });

        pool.on('connect', () => {
            console.log('✅ PostgreSQL connected');
        });

        pool.on('error', (err: Error) => {
            console.error('❌ PostgreSQL error', err);
            pool = null;
        });
    }

    return pool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const result = await getPool().query(text, params);
    return result.rows;
}

