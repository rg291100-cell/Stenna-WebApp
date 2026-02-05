import pg from 'pg';
import dotenv from 'dotenv';
import { URL } from 'url';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Global override for self-signed certs in this specific environment
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { Pool } = pg;

let poolInstance: pg.Pool | null = null;

const getPool = () => {
    if (!poolInstance) {
        let connectionString = (process.env.DATABASE_URL || '').trim().replace(/^["']|["']$/g, '');

        if (!connectionString) throw new Error('DATABASE_URL is missing');

        // Force identification for Supabase Pooler
        if (connectionString.includes('pooler.supabase.com')) {
            const url = new URL(connectionString);
            const user = decodeURIComponent(url.username);

            // Force identification port
            if (connectionString.includes(':5432')) {
                connectionString = connectionString.replace(':5432', ':6543');
            }

            // Inject Mandatory Project ID
            if (user.includes('.') && !connectionString.includes('options=project')) {
                const projectRef = user.split('.')[1];
                const separator = connectionString.includes('?') ? '&' : '?';
                connectionString += `${separator}options=project%3D${projectRef}`;
            }
        }

        // REMOVE sslmode from the string to prevent it from overriding our ssl object logic
        connectionString = connectionString.replace(/[&?]sslmode=[^&]*/g, '');

        poolInstance = new Pool({
            connectionString,
            ssl: {
                rejectUnauthorized: false // This finally takes priority
            },
            max: 1,
            connectionTimeoutMillis: 15000,
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
        // Handle common transients
        if (err.message.includes('terminated') || err.message.includes('Tenant')) {
            poolInstance = null;
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
