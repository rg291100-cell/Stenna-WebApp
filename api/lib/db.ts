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
            idleTimeoutMillis: 10000,
        };
    } catch (e) {
        return { connectionString: urlStr, ssl: { rejectUnauthorized: false }, max: 1 };
    }
};

const getPool = () => {
    if (!poolInstance) {
        const rawUrl = (process.env.DATABASE_URL || '').trim();
        if (!rawUrl) throw new Error('DATABASE_URL is missing');
        poolInstance = new Pool(createConfig(rawUrl));
        poolInstance.on('error', (err) => {
            console.error('[Database] Fatal pool error:', err.message);
            poolInstance = null;
        });
    }
    return poolInstance;
};

// Super Resilient Query Helper
export const query = async (text: string, params?: any[]) => {
    const pool = getPool();
    try {
        return await pool.query(text, params);
    } catch (err: any) {
        console.error('[Database] Primary connection failed:', err.message);

        // RECOVERY LOGIC for Supabase "Tenant not found"
        if (err.message.includes('Tenant') || err.message.includes('user not found')) {
            const rawUrl = (process.env.DATABASE_URL || '').trim();
            try {
                const dbUrl = new URL(rawUrl.replace(/^["']|["']$/g, ''));
                const username = decodeURIComponent(dbUrl.username);

                // If we have a project ref in the username (postgres.abc), try the direct host
                if (username.includes('.')) {
                    const projectRef = username.split('.')[1];
                    const directHost = `${projectRef}.supabase.co`;

                    console.warn(`[Database] Attempting direct connection bypass to: ${directHost}`);

                    const fallbackConfig = createConfig(rawUrl);
                    fallbackConfig.host = directHost;
                    fallbackConfig.port = 5432;

                    const fallbackPool = new Pool(fallbackConfig);
                    const result = await fallbackPool.query(text, params);
                    await fallbackPool.end();
                    return result;
                }
            } catch (fallbackErr: any) {
                console.error('[Database] Fallback failed:', fallbackErr.message);
                throw err; // Throw the original error if fallback also fails
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
