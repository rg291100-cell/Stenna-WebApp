import pg from 'pg';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const { Pool } = pg;

// Connection Singleton for Serverless
let pool: pg.Pool | null = null;

const getPool = () => {
    if (!pool) {
        const connectionString = process.env.DATABASE_URL;

        // Diagnostic Logging (Password Masked)
        if (connectionString) {
            const masked = connectionString.replace(/:[^:@]+@/, ':****@');
            console.log(`[Database] Attempting connection to: ${masked}`);
        } else {
            console.error('[Database] FATAL: DATABASE_URL is not defined in environment!');
        }

        pool = new Pool({
            connectionString,
            ssl: { rejectUnauthorized: false },
            max: 1, // Crucial for Vercel: only one connection per "awake" function
            connectionTimeoutMillis: 5000,
            idleTimeoutMillis: 10000,
        });

        pool.on('error', (err) => {
            console.error('Unexpected pool error', err);
            pool = null; // Reset pool on fatal error so next request recreates it
        });
    }
    return pool;
};

// Raw query helper
export const query = (text: string, params?: any[]) => getPool().query(text, params);

export default {
    query,
    getPool
};
