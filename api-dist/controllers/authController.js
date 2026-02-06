import { query } from '../lib/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
export const register = async (req, res) => {
    try {
        const { email, password, companyName, role } = req.body;
        const existing = await query(`SELECT id FROM "User" WHERE email = $1`, [email]);
        if (existing.length) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const rows = await query(`
            INSERT INTO "User"
            (id, email, password, "companyName", role, "updatedAt")
            VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
            RETURNING *
            `, [email, hashedPassword, companyName, role ?? 'RETAILER']);
        const user = rows[0];
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                companyName: user.companyName,
            },
        });
    }
    catch (error) {
        console.error('register error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const rows = await query(`SELECT * FROM "User" WHERE email = $1`, [email]);
        const user = rows[0];
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                companyName: user.companyName,
            },
        });
    }
    catch (error) {
        console.error('login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
