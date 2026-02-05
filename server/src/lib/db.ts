import pg from 'pg';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const { Pool } = pg;

// Singleton pattern to prevent connection leaks in Vercel
let pool: pg.Pool | null = null;

const getPool = () => {
    if (!pool) {
        let connectionString = (process.env.DATABASE_URL || '').trim();

        // Remove trailing quotes if accidental
        connectionString = connectionString.replace(/^["']|["']$/g, '');

        if (connectionString) {
            const masked = connectionString.replace(/:[^:@]+@/, ':****@');
            console.log(`[Database] Initializing pool with: ${masked}`);
        }

        pool = new Pool({
            connectionString,
            ssl: {
                rejectUnauthorized: false // Required for Supabase/Vercel
            },
            max: 1, // Serverless: One connection per lambda instance
            connectionTimeoutMillis: 10000,
            idleTimeoutMillis: 15000,
        });

        pool.on('error', (err) => {
            console.error('[Database] Unexpected pool error:', err);
            pool = null; // Kill the pool so next request re-tries
        });
    }
    return pool;
};

export const query = (text: string, params?: any[]) => getPool().query(text, params);

export default {
    query,
    getPool
};
