import { RequestHandler } from 'express';
import db from '../lib/db.js';

export const createAssortment: RequestHandler = async (req, res) => {
    res.json({ message: 'createAssortment OK' });
};

export const getAssortments: RequestHandler = async (req, res) => {
    res.json([]);
};

export const getAssortmentById: RequestHandler = async (req, res) => {
    res.json({});
};

export const updateAssortment: RequestHandler = async (req, res) => {
    res.json({ message: 'updateAssortment OK' });
};

export const deleteAssortment: RequestHandler = async (req, res) => {
    res.json({ message: 'deleteAssortment OK' });
};
