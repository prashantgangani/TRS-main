function calculateWinner(entries = []) {
  if (!entries.length) {
    return null;
  }

  return entries.reduce((leader, entry) => {
    if (!leader || (entry.votes ?? 0) > (leader.votes ?? 0)) {
      return entry;
    }
    return leader;
  }, null);
}

function getTournamentSummary(entries = []) {
  const totalVotes = entries.reduce(
    (sum, entry) => sum + (entry.votes ?? 0),
    0,
  );

  return {
    totalVotes,
    topEntry: calculateWinner(entries),
  };
}

function hasUserAlreadyVoted(entry = {}, username = "") {
  if (!username) return false;
  const voters = Array.isArray(entry.voters) ? entry.voters : [];
  return voters.some(
    (voter) => String(voter).toLowerCase() === String(username).toLowerCase(),
  );
}

function hasUserAlreadyVotedInTournament(entries = [], username = "") {
  if (!username) return false;
  if (!Array.isArray(entries)) return false;

  return entries.some((entry) => {
    const voters = Array.isArray(entry?.voters) ? entry.voters : [];
    return voters.some(
      (voter) => String(voter).toLowerCase() === String(username).toLowerCase(),
    );
  });
}

function canUserVoteOnEntry(entry = {}, username = "") {
  if (!username) return false;
  if (!entry || typeof entry !== "object") return false;
  if (
    String(entry.username || "").toLowerCase() ===
    String(username).toLowerCase()
  ) {
    return false;
  }
  if (hasUserAlreadyVoted(entry, username)) {
    return false;
  }
  return true;
}

function moveUserVote(entries = [], username = "", targetEntryId = "") {
  if (!username || !targetEntryId || !Array.isArray(entries)) {
    return { entries, moved: false, previousEntryId: null };
  }

  const normalizedUsername = String(username).trim();
  const normalizedTargetId = String(targetEntryId).trim();
  const nextEntries = entries.map((entry) => ({
    ...entry,
    voters: Array.isArray(entry.voters) ? entry.voters : [],
    votes: Number(entry.votes || 0),
  }));

  const previousEntry = nextEntries.find((entry) =>
    hasUserAlreadyVoted(entry, normalizedUsername),
  );

  let movedEntries = nextEntries;

  if (previousEntry) {
    movedEntries = movedEntries.map((entry) => {
      if (!hasUserAlreadyVoted(entry, normalizedUsername)) {
        return entry;
      }

      const filteredVoters = (entry.voters || []).filter(
        (voter) =>
          String(voter).toLowerCase() !== normalizedUsername.toLowerCase(),
      );

      return {
        ...entry,
        voters: filteredVoters,
        votes: Math.max(0, (entry.votes || 0) - 1),
      };
    });
  }

  const targetEntry = movedEntries.find(
    (entry) => String(entry._id) === normalizedTargetId,
  );

  if (!targetEntry) {
    return {
      entries: movedEntries,
      moved: false,
      previousEntryId: previousEntry ? String(previousEntry._id) : null,
    };
  }

  if (
    String(targetEntry.username || "").toLowerCase() ===
    normalizedUsername.toLowerCase()
  ) {
    return {
      entries: movedEntries,
      moved: false,
      previousEntryId: previousEntry ? String(previousEntry._id) : null,
    };
  }

  const finalEntries = movedEntries.map((entry) => {
    if (String(entry._id) !== normalizedTargetId) {
      return entry;
    }

    const existingVoters = Array.isArray(entry.voters) ? entry.voters : [];
    const uniqueVoters = existingVoters.filter(
      (voter) =>
        String(voter).toLowerCase() !== normalizedUsername.toLowerCase(),
    );

    return {
      ...entry,
      voters: [...uniqueVoters, normalizedUsername],
      votes: (entry.votes || 0) + 1,
    };
  });

  return {
    entries: finalEntries,
    moved: true,
    previousEntryId: previousEntry ? String(previousEntry._id) : null,
  };
}

module.exports = {
  calculateWinner,
  getTournamentSummary,
  hasUserAlreadyVoted,
  hasUserAlreadyVotedInTournament,
  canUserVoteOnEntry,
  moveUserVote,
};
