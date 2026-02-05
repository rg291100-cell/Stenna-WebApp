import pg from 'pg';
import dotenv from 'dotenv';
import { URL } from 'url';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const { Pool } = pg;

// Singleton pattern to prevent connection leaks in Vercel
let poolInstance: pg.Pool | null = null;

const getPool = () => {
    if (!poolInstance) {
        const rawConnectionString = (process.env.DATABASE_URL || '').trim();

        if (!rawConnectionString) {
            console.error('[Database] FATAL: DATABASE_URL is not defined!');
            throw new Error('DATABASE_URL is missing');
        }

        try {
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

            console.log(`[Database] Initializing pool for host: ${config.host}`);
            poolInstance = new Pool(config);

        } catch (err: any) {
            console.error('[Database] Failed to parse connection string:', err.message);
            poolInstance = new Pool({
                connectionString: rawConnectionString.replace(/^["']|["']$/g, ''),
                ssl: { rejectUnauthorized: false },
                max: 1
            });
        }

        poolInstance.on('error', (err) => {
            console.error('[Database] Unexpected pool error:', err);
            poolInstance = null;
        });
    }
    return poolInstance;
};

export const query = (text: string, params?: any[]) => getPool().query(text, params);

export default {
    query,
    getPool,
    // Add a getter for 'pool' to support existing controller syntax
    get pool() {
        return getPool();
    }
};
