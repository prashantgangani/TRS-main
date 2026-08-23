const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const router = express.Router();
const TournamentEntry = require("../models/TournamentEntry");
const Settings = require("../models/Settings");
const { calculateWinner } = require("../utils/tournament");

const JWT_SECRET = process.env.JWT_SECRET || "trs_underground_secret_key_999!";

const requireSuperAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res
      .status(401)
      .json({ message: "Super admin authentication is required." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "superadmin") {
      return res
        .status(403)
        .json({ message: "Only the super admin can view voting details." });
    }
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Your admin login has expired. Please log in again." });
  }
};

const requireMember = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res
      .status(401)
      .json({ message: "Please log in with a valid member account." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "member" || !decoded.username) {
      return res.status(403).json({
        message: "Only valid member accounts can use the tournament.",
      });
    }
    req.member = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Your member login has expired. Please log in again." });
  }
};

router.get("/", async (req, res) => {
  try {
    const settings = await Settings.findOne().lean();
    const showVotes = settings?.showTournamentVotes === true;
    const entries = await TournamentEntry.find()
      .sort({ votes: -1, createdAt: -1 })
      .select(
        "ownerName username carName description image votes isFeatured createdAt",
      )
      .lean();
    res.json(
      entries.map((entry) => {
        if (showVotes) return { ...entry, votes: entry.votes || 0 };
        const { votes, ...publicEntry } = entry;
        return publicEntry;
      }),
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/winner", async (req, res) => {
  try {
    const entries = await TournamentEntry.find()
      .sort({ votes: -1, createdAt: -1 })
      .lean();
    const winner = calculateWinner(entries);
    if (winner) {
      delete winner.votes;
      delete winner.voters;
    }
    res.json({ winner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const entries = await TournamentEntry.find()
      .sort({ votes: -1, createdAt: -1 })
      .lean();
    const winner = calculateWinner(entries);
    if (winner) {
      delete winner.votes;
      delete winner.voters;
    }
    res.json({ winner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/admin/overview", requireSuperAdmin, async (req, res) => {
  try {
    const entries = await TournamentEntry.find()
      .sort({ votes: -1, createdAt: -1 })
      .select("ownerName username carName votes voters createdAt")
      .lean();

    res.json({
      entries: entries.map((entry) => ({
        id: entry._id,
        ownerName: entry.ownerName,
        username: entry.username,
        carName: entry.carName,
        votes: entry.votes || 0,
        voters: Array.isArray(entry.voters) ? entry.voters : [],
        createdAt: entry.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/mine", requireMember, async (req, res) => {
  try {
    const entry = await TournamentEntry.findOne({
      username: req.member.username,
    }).lean();
    res.json({ entry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/my-vote", requireMember, async (req, res) => {
  try {
    const entries = await TournamentEntry.find().select("_id voters").lean();
    const normalizedUsername = req.member.username.toLowerCase();
    const entry = entries.find(
      (candidate) =>
        Array.isArray(candidate.voters) &&
        candidate.voters.some(
          (voter) => String(voter).toLowerCase() === normalizedUsername,
        ),
    );
    res.json({ entryId: entry ? String(entry._id) : null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id", requireMember, async (req, res) => {
  try {
    const entry = await TournamentEntry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Tournament entry not found." });
    }

    if (
      String(entry.username).toLowerCase() !== req.member.username.toLowerCase()
    ) {
      return res
        .status(403)
        .json({ message: "You can only edit your own tournament card." });
    }

    const { ownerName, carName, description, image } = req.body;
    if (!ownerName || !carName || !image) {
      return res
        .status(400)
        .json({ message: "Owner name, car name and image are required." });
    }

    entry.ownerName = String(ownerName).trim();
    entry.carName = String(carName).trim();
    entry.description = String(description || "").trim();
    entry.image = String(image).trim();
    await entry.save();
    res.json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/", requireMember, async (req, res) => {
  try {
    const settings = await Settings.findOne().lean();
    if (settings?.tournamentEntryEnabled === false) {
      return res
        .status(403)
        .json({ message: "Tournament participation is currently disabled." });
    }

    const { ownerName, carName, description, image } = req.body;
    const username = req.member.username;

    if (!ownerName || !username || !carName || !image) {
      return res.status(400).json({
        message: "Owner name, username, car name and image are required.",
      });
    }

    const existingEntry = await TournamentEntry.findOne({ username });
    if (existingEntry) {
      return res.status(409).json({
        message: "Each member can upload only one car to the tournament.",
      });
    }

    const entry = await TournamentEntry.create({
      ownerName: ownerName.trim(),
      username: username.trim(),
      carName: carName.trim(),
      description: description || "",
      image,
    });

    res.status(201).json(entry);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Each member can upload only one car to the tournament.",
      });
    }
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const role = String(req.body?.role || "").trim();

    if (role !== "superadmin") {
      return res
        .status(403)
        .json({ message: "Only the super admin can edit tournament cards." });
    }

    const { ownerName, carName, description, image } = req.body;
    const updateFields = {};

    if (ownerName) updateFields.ownerName = String(ownerName).trim();
    if (carName) updateFields.carName = String(carName).trim();
    if (typeof description !== "undefined")
      updateFields.description = String(description).trim();
    if (image) updateFields.image = String(image).trim();

    const entry = await TournamentEntry.findByIdAndUpdate(
      req.params.id,
      updateFields,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!entry) {
      return res.status(404).json({ message: "Tournament entry not found." });
    }

    res.json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const role = String(req.body?.role || "").trim();

    if (role !== "superadmin") {
      return res
        .status(403)
        .json({ message: "Only the super admin can delete tournament cards." });
    }

    const entry = await TournamentEntry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Tournament entry not found." });
    }

    await TournamentEntry.findByIdAndDelete(req.params.id);
    res.json({ message: "Tournament card deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/:id/vote", requireMember, async (req, res) => {
  try {
    const voterUsername = req.member.username;
    const session = await mongoose.startSession();
    let result;

    try {
      await session.withTransaction(async () => {
        const targetEntry = await TournamentEntry.findById(
          req.params.id,
        ).session(session);
        if (!targetEntry) {
          const error = new Error("Tournament entry not found.");
          error.status = 404;
          throw error;
        }

        if (
          String(targetEntry.username).toLowerCase() ===
          voterUsername.toLowerCase()
        ) {
          const error = new Error(
            "You cannot vote for your own tournament entry.",
          );
          error.status = 403;
          throw error;
        }

        const previousEntries = await TournamentEntry.find({
          voters: voterUsername,
        }).session(session);
        if (
          previousEntries.length === 1 &&
          String(previousEntries[0]._id) === req.params.id
        ) {
          result = previousEntries[0];
          return;
        }

        for (const previousEntry of previousEntries) {
          if (String(previousEntry._id) === req.params.id) {
            continue;
          }

          previousEntry.voters = previousEntry.voters.filter(
            (voter) =>
              String(voter).toLowerCase() !== voterUsername.toLowerCase(),
          );
          previousEntry.votes = Math.max(0, (previousEntry.votes || 0) - 1);
          await previousEntry.save({ session });
        }

        targetEntry.voters = Array.isArray(targetEntry.voters)
          ? targetEntry.voters
          : [];
        targetEntry.voters.push(voterUsername);
        targetEntry.votes = (targetEntry.votes || 0) + 1;
        result = await targetEntry.save({ session });
      });
    } finally {
      await session.endSession();
    }

    res.json(result);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
});

module.exports = router;
