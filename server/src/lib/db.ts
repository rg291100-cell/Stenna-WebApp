import pg from 'pg';
import dotenv from 'dotenv';
import { URL } from 'url';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const { Pool } = pg;

// Singleton pattern to prevent connection leaks in Vercel
let pool: pg.Pool | null = null;

const getPool = () => {
    if (!pool) {
        const rawConnectionString = (process.env.DATABASE_URL || '').trim();

        if (!rawConnectionString) {
            console.error('[Database] FATAL: DATABASE_URL is not defined!');
            throw new Error('DATABASE_URL is missing');
        }

        try {
            // Senior Approach: Parse the URL and create a config object
            // This avoids all encoding issues with '@' or special characters
            const dbUrl = new URL(rawConnectionString.replace(/^["']|["']$/g, ''));

            const config: pg.PoolConfig = {
                host: dbUrl.hostname,
                port: parseInt(dbUrl.port || '5432'),
                database: dbUrl.pathname.split('/')[1] || 'postgres',
                user: decodeURIComponent(dbUrl.username),
                password: decodeURIComponent(dbUrl.password),
                ssl: {
                    rejectUnauthorized: false
                },
                max: 1,
                connectionTimeoutMillis: 10000,
                idleTimeoutMillis: 15000,
            };

            console.log(`[Database] Initializing pool for host: ${config.host} (Port: ${config.port})`);
            pool = new Pool(config);

        } catch (err: any) {
            console.error('[Database] Failed to parse connection string:', err.message);
            // Fallback to raw string if parsing fails, but this is unlikely
            pool = new Pool({
                connectionString: rawConnectionString.replace(/^["']|["']$/g, ''),
                ssl: { rejectUnauthorized: false },
                max: 1
            });
        }

        pool.on('error', (err) => {
            console.error('[Database] Unexpected pool error:', err);
            pool = null;
        });
    }
    return pool;
};

export const query = (text: string, params?: any[]) => getPool().query(text, params);

export default {
    query,
    getPool
};
