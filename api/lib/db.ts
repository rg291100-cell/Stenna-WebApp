import pg from 'pg';
import dotenv from 'dotenv';
import { URL } from 'url';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const { Pool } = pg;

// Singleton pattern
let poolInstance: pg.Pool | null = null;

const getPool = () => {
    if (!poolInstance) {
        let connectionString = (process.env.DATABASE_URL || '').trim().replace(/^["']|["']$/g, '');

        if (!connectionString) throw new Error('DATABASE_URL is missing');

        // Senior Intelligence: Supabase Pooler Hardening
        if (connectionString.includes('pooler.supabase.com')) {
            const url = new URL(connectionString);
            const user = decodeURIComponent(url.username);

            // 1. Force Port 6543 if it's the pooler (much more stable for identification)
            if (connectionString.includes(':5432')) {
                console.warn('[Database] Correcting port 5432 -> 6543 for Supabase Pooler');
                connectionString = connectionString.replace(':5432', ':6543');
            }

            // 2. Ensure project identification parameter is present
            if (user.includes('.') && !connectionString.includes('options=project')) {
                const projectRef = user.split('.')[1];
                const separator = connectionString.includes('?') ? '&' : '?';
                connectionString += `${separator}options=project%3D${projectRef}`;
                console.log(`[Database] Injected project ID: ${projectRef}`);
            }
        }

        console.log(`[Database] Initializing Pool...`);
        poolInstance = new Pool({
            connectionString,
            ssl: {
                rejectUnauthorized: false
            },
            max: 1, // Crucial for Vercel
            connectionTimeoutMillis: 15000,
            idleTimeoutMillis: 15000,
        });

        poolInstance.on('error', (err) => {
            console.error('[Database] Fatal pool error:', err.message);
            poolInstance = null;
        });
    }
    return poolInstance;
};

export const query = async (text: string, params?: any[]) => {
    try {
        const pool = getPool();
        return await pool.query(text, params);
    } catch (err: any) {
        console.error('[Database] Query failed:', err.message);

        // Final desperate attempt: if it's a connection error, try one immediate retry
        if (err.message.includes('Tenant') || err.message.includes('terminated') || err.message.includes('password')) {
            console.log('[Database] Identification or Auth failed. Attempting clean retry...');
            poolInstance = null; // Reset pool
            const pool = getPool();
            return await pool.query(text, params);
        }
        throw err;
    }
};

export default {
    query,
    getPool,
    get pool() { return getPool(); }
};
