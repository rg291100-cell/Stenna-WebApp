import pg from 'pg';
import dotenv from 'dotenv';
import { URL } from 'url';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const { Pool } = pg;

let poolInstance: pg.Pool | null = null;

const createConfig = (urlStr: string) => {
    try {
        const dbUrl = new URL(urlStr.replace(/^["']|["']$/g, ''));
        return {
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
        };
    } catch (e) {
        return { connectionString: urlStr, ssl: { rejectUnauthorized: false }, max: 1 };
    }
};

const getPool = () => {
    if (!poolInstance) {
        const rawUrl = (process.env.DATABASE_URL || '').trim();
        if (!rawUrl) throw new Error('DATABASE_URL is missing');

        const config = createConfig(rawUrl);
        console.log(`[Database] Connecting to: ${config.host || 'string-url'}`);

        poolInstance = new Pool(config);

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
        // RESCUE LOGIC: If port 6543 is failing with Tenant error, attempt a session-mode fallback
        if (err.message.includes('Tenant') || err.message.includes('user not found')) {
            const rawUrl = (process.env.DATABASE_URL || '').trim();
            if (rawUrl.includes(':6543')) {
                console.warn('[Database] Transaction pooler rejected us. Falling back to Session Mode (5432)...');
                const fallbackUrl = rawUrl.replace(':6543', ':5432');
                const fallbackPool = new Pool(createConfig(fallbackUrl));
                const result = await fallbackPool.query(text, params);
                await fallbackPool.end();
                return result;
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
