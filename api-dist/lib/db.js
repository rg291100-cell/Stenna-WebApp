import pg from 'pg';
const { Pool } = pg;
let pool = null;
console.log('DATABASE_URL =', process.env.DATABASE_URL);
function getPool() {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        });
        pool.on('connect', () => {
            console.log('✅ PostgreSQL connected');
        });
        pool.on('error', (err) => {
            console.error('❌ PostgreSQL error', err);
            pool = null;
        });
    }
    return pool;
}
export async function query(text, params) {
    const result = await getPool().query(text, params);
    return result.rows;
}
