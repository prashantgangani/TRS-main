const express = require("express");
const Settings = require("../models/Settings");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({
        ...req.body,
        showTournamentVotes: req.body.showTournamentVotes === true,
        tournamentEntryEnabled: req.body.tournamentEntryEnabled !== false,
      });
      await settings.save();
    } else {
      const updates = { ...req.body };
      if (
        Object.prototype.hasOwnProperty.call(req.body, "showTournamentVotes")
      ) {
        updates.showTournamentVotes = req.body.showTournamentVotes === true;
      }
      if (
        Object.prototype.hasOwnProperty.call(req.body, "tournamentEntryEnabled")
      ) {
        updates.tournamentEntryEnabled =
          req.body.tournamentEntryEnabled !== false;
      }
      settings = await Settings.findOneAndUpdate(
        {},
        { $set: updates },
        { new: true, runValidators: true },
      );
    }
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
