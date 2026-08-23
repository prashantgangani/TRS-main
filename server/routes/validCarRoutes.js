const express = require('express');
const router = express.Router();
const ValidCar = require('../models/ValidCar');

// Get all
router.get('/', async (req, res) => {
    try {
        const cars = await ValidCar.find()
    .sort({ order: 1, createdAt: -1 })
    .lean();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new
// Add Registry
router.post('/', async (req, res) => {
    try {

        let {
            title,
            description,
            vehicles,
            imageUrl,
            isValid
        } = req.body;

        title = (title || "").trim();
        description = (description || "").trim();
        vehicles = (vehicles || "").trim();
        imageUrl = (imageUrl || "").trim();

        if (!title) {
            return res.status(400).json({
                message: "Meet Topic is required."
            });
        }

        const count = await ValidCar.countDocuments();

        const newRegistry = await ValidCar.create({
            title,
            description,
            vehicles,
            imageUrl,
            isValid,
            order: count
        });

        res.status(201).json(newRegistry);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: err.message
        });

    }
});

// Update
router.put('/:id', async (req, res) => {
    try {
        const updatedCar = await ValidCar.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await ValidCar.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete all vehicle lists
router.delete('/', async (req, res) => {
    try {
        await ValidCar.deleteMany({});
        res.json({ message: 'All vehicle lists deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
