const express = require("express");
const Meet = require("../models/Meet");
const PreviousMeet = require("../models/PreviousMeet");

const router = express.Router();

// GET all upcoming meets
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;

    let query = Meet.find().sort({ order: 1, date: 1 }).lean();

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const meets = await query;

    res.json(meets);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// CREATE meet
router.post("/", async (req, res) => {
  const meet = new Meet({
    theme: req.body.theme,
    date: req.body.date,
    time: req.body.time,
    location: req.body.location,
    dressCode: req.body.dressCode,
    car: req.body.car,
    cmlLead: req.body.cmlLead,
    host: req.body.host,
    description: req.body.description,
    rules: req.body.rules,
    image:
      req.body.image ||
      "https://images.unsplash.com/photo-1511407397940-d57f68e81203?w=800&auto=format&fit=crop",
  });

  try {
    const newMeet = await meet.save();
    res.status(201).json(newMeet);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// DELETE & archive meet
router.delete("/:id", async (req, res) => {
  try {
    const meet = await Meet.findById(req.params.id);

    if (!meet) {
      return res.status(404).json({
        message: "Meet not found",
      });
    }

    const count = await PreviousMeet.countDocuments();

    await PreviousMeet.create({
      themeName: meet.theme,

      date: meet.date,
      time: meet.time,
      location: meet.location,

      dressCode: meet.dressCode,
      car: meet.car,

      cmlLead: meet.cmlLead,
      host: meet.host,

      description: meet.description,
      rules: meet.rules,

      imageUrl: meet.image,
      imageUrls: [meet.image],

      order: count,
    });

    await Meet.findByIdAndDelete(req.params.id);

    const total = await PreviousMeet.countDocuments();

    if (total > 4) {
      const oldest = await PreviousMeet.findOne().sort({
        createdAt: 1,
      });

      if (oldest) {
        await PreviousMeet.findByIdAndDelete(oldest._id);
      }
    }

    res.json({
      message: "Meet archived successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// UPDATE meet order
router.put("/update-order", async (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!orderedIds || !Array.isArray(orderedIds)) {
      return res.status(400).json({
        message: "Invalid payload",
      });
    }

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: {
          order: index,
        },
      },
    }));

    await Meet.bulkWrite(bulkOps);

    res.json({
      message: "Order updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// UPDATE meet
router.put("/:id", async (req, res) => {
  try {
    const updatedMeet = await Meet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updatedMeet);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = router;
