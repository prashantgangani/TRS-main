const mongoose = require("mongoose");

const tournamentEntrySchema = new mongoose.Schema(
  {
    ownerName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    carName: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, required: true },
    votes: { type: Number, default: 0 },
    voters: [{ type: String, trim: true }],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

tournamentEntrySchema.index({ votes: -1, createdAt: -1 });
tournamentEntrySchema.index({ username: 1 }, { unique: true });

module.exports = mongoose.model("TournamentEntry", tournamentEntrySchema);
