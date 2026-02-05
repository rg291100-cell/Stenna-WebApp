import pg from 'pg';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const { Pool } = pg;

// Singleton to prevent "Too many connections" on Vercel
let poolInstance: pg.Pool | null = null;

const getPool = () => {
    if (!poolInstance) {
        const connectionString = (process.env.DATABASE_URL || '').trim().replace(/^["']|["']$/g, '');

        if (!connectionString) {
            throw new Error('DATABASE_URL is missing in environment variables');
        }

        // Senior Design: Use raw string to preserve all Supabase-specific query params
        poolInstance = new Pool({
            connectionString,
            ssl: {
                rejectUnauthorized: false
            },
            max: 1, // Crucial for Serverless (1 connection per function instance)
            connectionTimeoutMillis: 10000,
            idleTimeoutMillis: 10000,
        });

        poolInstance.on('error', (err) => {
            console.error('[Database] Unexpected pool error:', err);
            poolInstance = null; // Force recreation on next request
        });
    }
    return poolInstance;
};

// Robust Query Helper with 1-time Automatic Retry
export const query = async (text: string, params?: any[]) => {
    const pool = getPool();
    try {
        return await pool.query(text, params);
    } catch (err: any) {
        // If connection was lost or tenant not found, try one more time
        if (err.message.includes('terminated') || err.message.includes('Tenant')) {
            console.warn('[Database] Connection glitch, retrying once...');
            return await pool.query(text, params);
        }
        throw err;
    }
};

export default {
    query,
    getPool,
    get pool() {
        return getPool();
    }
};
