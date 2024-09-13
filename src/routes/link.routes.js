import express from 'express';
import Link from '../models/link.models.js';

const router = express.Router();

// POST route to create a new link
router.post('/', async (req, res) => {
    const link = new Link({
        link: req.body.link,
        topic: req.body.topic,
    });

    try {
        const newLink = await link.save();
        res.status(201).json(newLink);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all links
router.get('/', async (req, res) => {
    try {
        const links = await Link.find();
        res.json(links);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router; // Use export default