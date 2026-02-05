import pg from 'pg';
import dotenv from 'dotenv';
import { URL } from 'url';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const { Pool } = pg;

let poolInstance: pg.Pool | null = null;

const getPool = () => {
    if (!poolInstance) {
        let connectionString = (process.env.DATABASE_URL || '').trim().replace(/^["']|["']$/g, '');

        if (!connectionString) throw new Error('DATABASE_URL is missing');

        // Senior Intelligence: Auto-fix Supabase Pooler strings
        if (connectionString.includes('pooler.supabase.com')) {
            const url = new URL(connectionString);
            const user = decodeURIComponent(url.username);

            // Extract project ref if it's in the username (postgres.ref)
            if (user.includes('.') && !connectionString.includes('options=project')) {
                const projectRef = user.split('.')[1];
                console.log(`[Database] Auto-injecting project identification: ${projectRef}`);

                // Append the mandatory identification parameter for Supabase Pooler
                const separator = connectionString.includes('?') ? '&' : '?';
                connectionString += `${separator}options=project%3D${projectRef}`;
            }
        }

        poolInstance = new Pool({
            connectionString,
            ssl: {
                rejectUnauthorized: false
            },
            max: 1,
            connectionTimeoutMillis: 10000,
        });

        poolInstance.on('error', (err) => {
            console.error('[Database] Fatal pool error:', err.message);
            poolInstance = null;
        });
    }
    return poolInstance;
};

export const query = async (text: string, params?: any[]) => {
    const pool = getPool();
    try {
        return await pool.query(text, params);
    } catch (err: any) {
        // If it still says Tenant not found, it might be Port 6543 vs 5432 conflict
        if (err.message.includes('Tenant') || err.message.includes('user not found')) {
            console.error('[Database] Tenant identification failed. Retrying with session mode...');
            // One-time fallback logic
            const rawUrl = (process.env.DATABASE_URL || '').trim().replace(/^["']|["']$/g, '');
            if (rawUrl.includes(':6543')) {
                const sessionUrl = rawUrl.replace(':6543', ':5432');
                const sessionPool = new Pool({ connectionString: sessionUrl, ssl: { rejectUnauthorized: false }, max: 1 });
                try {
                    const res = await sessionPool.query(text, params);
                    await sessionPool.end();
                    return res;
                } catch (e) {
                    await sessionPool.end();
                    throw e;
                }
            }
        }
        throw err;
    }
};

export default {
    query,
    getPool,
    get pool() { return getPool(); }
};
