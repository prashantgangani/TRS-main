const test = require("node:test");
const assert = require("node:assert/strict");

const {
  calculateWinner,
  getTournamentSummary,
  canUserVoteOnEntry,
  hasUserAlreadyVoted,
  hasUserAlreadyVotedInTournament,
  moveUserVote,
} = require("../utils/tournament");

test("calculateWinner picks the car with the highest vote count", () => {
  const cars = [
    { name: "Alpha", votes: 12 },
    { name: "Bravo", votes: 18 },
    { name: "Charlie", votes: 16 },
  ];

  assert.deepEqual(calculateWinner(cars), { name: "Bravo", votes: 18 });
});

test("getTournamentSummary includes total votes and top entry", () => {
  const cars = [
    { name: "Alpha", votes: 12 },
    { name: "Bravo", votes: 18 },
    { name: "Charlie", votes: 16 },
  ];

  assert.deepEqual(getTournamentSummary(cars), {
    totalVotes: 46,
    topEntry: { name: "Bravo", votes: 18 },
  });
});

test("user can vote when they have not voted before and are not the participant", () => {
  const entry = { username: "jason", voters: ["alex"] };

  assert.equal(canUserVoteOnEntry(entry, "sam"), true);
});

test("user cannot vote twice and cannot self vote", () => {
  const entry = { username: "jason", voters: ["sam", "alex"] };

  assert.equal(hasUserAlreadyVoted(entry, "sam"), true);
  assert.equal(canUserVoteOnEntry(entry, "jason"), false);
  assert.equal(canUserVoteOnEntry(entry, "sam"), false);
});

test("user cannot vote again after already voting for another car", () => {
  const entries = [
    { username: "alpha", voters: ["sam", "alex"] },
    { username: "bravo", voters: ["mia"] },
  ];

  assert.equal(hasUserAlreadyVotedInTournament(entries, "sam"), true);
  assert.equal(hasUserAlreadyVotedInTournament(entries, "zoe"), false);
});

test("user can change a vote from one car to another without keeping two active votes", () => {
  const entries = [
    { _id: "a", username: "alpha", votes: 3, voters: ["sam"] },
    { _id: "b", username: "bravo", votes: 2, voters: ["mia"] },
  ];

  const result = moveUserVote(entries, "sam", "b");

  assert.equal(result.moved, true);
  assert.equal(result.entries[0].votes, 2);
  assert.equal(result.entries[1].votes, 3);
  assert.deepEqual(result.entries[0].voters, []);
  assert.deepEqual(result.entries[1].voters, ["mia", "sam"]);
});
