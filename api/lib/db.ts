import pg from 'pg';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Hard-reset TLS check to be absolutely sure
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { Pool } = pg;

let poolInstance: pg.Pool | null = null;

const getPool = () => {
    if (!poolInstance) {
        let rawUrl = (process.env.DATABASE_URL || '').trim().replace(/^["']|["']$/g, '');

        if (!rawUrl) throw new Error('DATABASE_URL is missing');

        // Senior Strategy: Manually reconstruct the URL to avoid any parser quirks
        // 1. Separate protocol, auth, and the rest
        const [protocol, rest] = rawUrl.split('://');
        if (!rest) throw new Error('Invalid DATABASE_URL format');

        const parts = rest.split('@');
        const auth = parts[0];
        const hostPath = parts.slice(1).join('@'); // Handle cases where host might have @ (rare)

        let finalHostPath = hostPath;

        // 2. Supabase Pooler Hardening
        if (hostPath.includes('pooler.supabase.com')) {
            // Force Transaction Port
            if (finalHostPath.includes(':5432')) {
                finalHostPath = finalHostPath.replace(':5432', ':6543');
            }

            // Inject Project Identification if missing
            const user = auth.split(':')[0];
            if (user.includes('.') && !finalHostPath.includes('options=project')) {
                const projectRef = user.split('.')[1];
                const separator = finalHostPath.includes('?') ? '&' : '?';
                finalHostPath += `${separator}options=project%3D${projectRef}`;
            }
        }

        // 3. SSL Sanitization: Remove ANY trace of ssl/sslmode from the string
        finalHostPath = finalHostPath.replace(/[?&]sslmode=[^&]*/g, '');
        finalHostPath = finalHostPath.replace(/[?&]ssl=[^&]*/g, '');

        const finalConnectionString = `${protocol}://${auth}@${finalHostPath}`;

        console.log('[Database] Bootstrapping Pool...');

        poolInstance = new Pool({
            connectionString: finalConnectionString,
            ssl: {
                rejectUnauthorized: false
            },
            max: 1,
            connectionTimeoutMillis: 10000,
            idleTimeoutMillis: 10000,
        });

        poolInstance.on('error', (err) => {
            console.error('[Database] Critical Pool Error:', err.message);
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
        // If it's a tenant error or certificate error, try a clean reset once
        if (err.message.includes('Tenant') || err.message.includes('certificate') || err.message.includes('terminated')) {
            console.log('[Database] Retrying resilient connection...');
            poolInstance = null;
            const newPool = getPool();
            return await newPool.query(text, params);
        }
        throw err;
    }
};

export default {
    query,
    getPool,
    get pool() { return getPool(); }
};
