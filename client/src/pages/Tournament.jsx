import React, { useEffect, useState } from 'react';
import { Trophy, ShieldCheck, Camera, ChevronRight, CheckCircle2, Star, Users, CarFront, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const RULES = [
  'If you choose to participate, you must upload a picture of your car.',
  'Tournament participants can upload their car and compete for votes.',
  'Non-participants can still vote for participating cars.',
  'Each participant must follow the tournament guidelines while uploading.',
  'The car with the highest vote count will be featured on the homepage.',
  'The winning car will remain highlighted for a limited time.'
];

const parseApiResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const rawText = await response.text();

    let message = 'Server returned an unexpected response.';
    if (rawText) {
      const cleanedText = rawText.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      if (cleanedText) {
        message = cleanedText.slice(0, 180);
      }
    }

    throw new Error(message);
  }

  return response.json();
};

const Tournament = ({ setAuthContext }) => {
  const location = useLocation();
  const path = location.pathname;

  if (path === '/tournament/login') return <TournamentLoginPage setAuthContext={setAuthContext} />;
  if (path === '/tournament/upload') return <TournamentUploadPage />;
  if (path === '/tournament/vote') return <TournamentVotePage />;

  return <TournamentRulesPage />;
};

const TournamentRulesPage = () => {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [hasEntry, setHasEntry] = useState(false);

  useEffect(() => {
    const memberRole = localStorage.getItem('trs_role');
    const token = localStorage.getItem('token');
    const hasMemberSession = memberRole === 'member' && Boolean(token);
    const isAccepted = hasMemberSession && Boolean(token) && localStorage.getItem('trs_tournament_acceptance') === 'true';
    setAccepted(isAccepted);

    if (hasMemberSession && token) {
      fetch(`${API_URL}/tournament/mine`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(parseApiResponse)
        .then(({ entry }) => setHasEntry(Boolean(entry)))
        .catch(() => {
          setHasEntry(false);
          localStorage.removeItem('trs_tournament_acceptance');
          localStorage.removeItem('trs_tournament_participant');
        });
    } else {
      setHasEntry(false);
      setAccepted(false);
      localStorage.removeItem('trs_tournament_acceptance');
      localStorage.removeItem('trs_tournament_participant');
      localStorage.removeItem('trs_tournament_member_role');
    }
  }, []);

  const handleAccept = async () => {
    const token = localStorage.getItem('token');

    if (token && localStorage.getItem('trs_role') === 'member') {
      localStorage.setItem('trs_tournament_acceptance', 'true');
      try {
        const response = await fetch(`${API_URL}/tournament/mine`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const { entry } = await parseApiResponse(response);
        navigate(entry ? '/tournament/vote' : '/tournament/upload');
      } catch (error) {
        navigate('/tournament/upload');
      }
      return;
    }

    localStorage.removeItem('trs_tournament_acceptance');
    setAccepted(false);
    navigate('/tournament/login?redirect=/tournament/upload');
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-neon-purple/40 bg-neon-purple/10 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-neon-purple">
            <Trophy size={14} /> Car Tournament
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-black tracking-tight">Rules &amp; Guidelines</h1>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">Read the tournament rules before joining the competition. Once you accept, you’ll move to the registration and upload flow.</p>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-neon-purple" />
              <h2 className="text-2xl font-semibold">Tournament rules</h2>
            </div>
            <ul className="space-y-4">
              {RULES.map((rule) => (
                <li key={rule} className="flex items-start gap-3 text-white/80">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-neon-purple" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-neon-purple/15 via-white/[0.02] to-electric-blue/15 p-8">
            <h3 className="text-xl font-semibold mb-4">Participation steps</h3>
            <div className="space-y-4 text-sm text-white/70">
              <div className="flex items-center gap-3"><span className="rounded-full bg-neon-purple/20 px-2 py-1 text-neon-purple">1</span> Accept the rules</div>
              <div className="flex items-center gap-3"><span className="rounded-full bg-neon-purple/20 px-2 py-1 text-neon-purple">2</span> Log in with your username and password</div>
              <div className="flex items-center gap-3"><span className="rounded-full bg-neon-purple/20 px-2 py-1 text-neon-purple">3</span> Upload your car and submit it to the tournament</div>
              <div className="flex items-center gap-3"><span className="rounded-full bg-neon-purple/20 px-2 py-1 text-neon-purple">4</span> Let the community vote for the winner</div>
            </div>

            <button
              onClick={handleAccept}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-neon-purple to-purple-600 px-5 py-4 font-black uppercase tracking-[0.25em] text-white transition hover:scale-[1.01] disabled:opacity-60"
            >
              {hasEntry ? 'Edit your car' : accepted ? 'Continue to upload' : 'I Accept & Continue'}
            </button>

            <div className="mt-6 flex gap-3">
              <Link
                to="/tournament/vote"
                onClick={(event) => {
                  const hasSession = Boolean(localStorage.getItem('token')) &&
                    (localStorage.getItem('trs_role') === 'member' || localStorage.getItem('trs_tournament_member_role') === 'member');
                  if (!hasSession) {
                    event.preventDefault();
                    navigate('/tournament/login?redirect=/tournament/vote');
                  }
                }}
                className="w-full rounded-xl border border-white/10 px-4 py-3 text-center text-sm uppercase tracking-[0.15em] text-white/80 hover:border-neon-purple/50"
              >Vote now</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TournamentLoginPage = ({ setAuthContext }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const redirectPath = new URLSearchParams(location.search).get('redirect') === '/tournament/vote'
    ? '/tournament/vote'
    : '/tournament/upload';

  useEffect(() => {
    const hasMemberSession = localStorage.getItem('trs_role') === 'member' && Boolean(localStorage.getItem('token'));

    if (hasMemberSession && localStorage.getItem('token')) {
      fetch(`${API_URL}/tournament/mine`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(parseApiResponse)
        .then(({ entry }) => navigate(entry && redirectPath === '/tournament/upload' ? '/tournament/vote' : redirectPath))
        .catch(() => navigate(redirectPath));
    }
  }, [navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Please enter both your username and password.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/member-system/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() })
      });

      const data = await parseApiResponse(res);
      if (!res.ok) throw new Error(data.message || 'Invalid member login');

      const member = data.member;
      if (!member || member.role !== 'member') {
        throw new Error('Only valid member credentials can participate in the tournament.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('trs_role', member.role);
      localStorage.setItem('trs_tournament_member_role', member.role);
      localStorage.setItem('trs_username', member.username);
      localStorage.setItem('trs_tournament_acceptance', 'true');
      localStorage.setItem('trs_tournament_participant', JSON.stringify({ username: member.username }));
      if (setAuthContext) setAuthContext(member.role);
      setError('');

      if (redirectPath === '/tournament/upload') {
        const entryResponse = await fetch(`${API_URL}/tournament/mine`, {
          headers: { Authorization: `Bearer ${data.token}` }
        });
        const { entry } = await parseApiResponse(entryResponse);
        navigate(entry ? '/tournament/vote' : '/tournament/upload');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      localStorage.removeItem('trs_tournament_acceptance');
      localStorage.removeItem('trs_tournament_participant');
      setError(err.message || 'Invalid login credentials.');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neon-purple/15 text-neon-purple">
            <ShieldCheck />
          </div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-neon-purple/80">Participant Login</p>
          <h2 className="mt-4 text-3xl font-black">Join the tournament</h2>
        </div>

        {error && <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">User ID / Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-white/20 focus:border-neon-purple/60 focus:outline-none" placeholder="Enter username" required />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-white/20 focus:border-neon-purple/60 focus:outline-none" placeholder="••••••••" required />
          </div>

          <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-electric-blue to-neon-purple px-5 py-4 font-black uppercase tracking-[0.25em] text-black transition hover:scale-[1.01]">Login</button>
        </form>
      </div>
    </div>
  );
};

const TournamentUploadPage = () => {
  const navigate = useNavigate();
  const [participant, setParticipant] = useState(null);
  const [existingEntry, setExistingEntry] = useState(null);
  const [formData, setFormData] = useState({
    ownerName: '',
    carName: '',
    description: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const username = localStorage.getItem('trs_username');
    const saved = localStorage.getItem('trs_tournament_participant');

    if (!username || !localStorage.getItem('token') || (localStorage.getItem('trs_role') !== 'member' && localStorage.getItem('trs_tournament_member_role') !== 'member')) {
      navigate('/tournament/login');
      return;
    }

    if (!saved) {
      localStorage.setItem('trs_tournament_participant', JSON.stringify({ username }));
    }

    setParticipant({ username });

    fetch(`${API_URL}/tournament/mine`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(parseApiResponse)
      .then(({ entry }) => {
        if (entry) {
          setExistingEntry(entry);
          setFormData({
            ownerName: entry.ownerName || '',
            carName: entry.carName || '',
            description: entry.description || '',
            image: entry.image || ''
          });
        }
      })
      .catch((error) => setError(error.message || 'Unable to load your tournament card.'));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!participant) {
      setError('Please log in before uploading your car.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/tournament${existingEntry ? `/${existingEntry._id}` : ''}`, {
        method: existingEntry ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ownerName: formData.ownerName || participant.username,
          username: participant.username,
          carName: formData.carName,
          description: formData.description,
          image: formData.image
        })
      });

      const data = await parseApiResponse(res);
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      setExistingEntry(data);
      setSuccess(existingEntry ? 'Your tournament card has been updated!' : 'Your car has been submitted to the tournament!');
      if (!existingEntry) {
        setFormData({ ownerName: '', carName: '', description: '', image: '' });
      }
      setTimeout(() => navigate('/tournament/vote'), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <button type="button" onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 transition hover:text-white">
              <ArrowLeft size={14} /> Back
            </button>
            <p className="text-[10px] uppercase tracking-[0.35em] text-electric-blue/80">Upload</p>
            <h2 className="mt-2 text-3xl font-black">Submit your car</h2>
          </div>
          <div className="rounded-full border border-neon-purple/40 bg-neon-purple/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-neon-purple">{participant?.username || 'Participant'}</div>
        </div>

        {error && <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
        {success && <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{success}</div>}

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">Owner name</label>
            <input name="ownerName" value={formData.ownerName} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white" placeholder="Your name or nickname" required />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">Car name / model</label>
            <input name="carName" value={formData.carName} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white" placeholder="e.g. Nissan Skyline R34" required />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">Image URL</label>
            <input name="image" value={formData.image} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white" placeholder="https://example.com/car.jpg" required />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">Short description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white" placeholder="Briefly describe your build" />
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-gradient-to-r from-neon-purple to-purple-600 px-5 py-4 font-black uppercase tracking-[0.2em] text-white disabled:opacity-60">
              {loading ? 'Saving...' : existingEntry ? 'Update my tournament card' : 'Submit to tournament'}
            </button>
            <Link to="/tournament/vote" className="flex items-center justify-center rounded-xl border border-white/10 px-5 py-4 text-sm uppercase tracking-[0.2em] text-white/75">View votes</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const TournamentVotePage = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [votedEntryId, setVotedEntryId] = useState(null);
  const [hasParticipantEntry, setHasParticipantEntry] = useState(false);
  const [error, setError] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const [editForm, setEditForm] = useState({
    ownerName: '',
    carName: '',
    description: '',
    image: '',
  });

  const isSuperAdmin = localStorage.getItem('trs_role') === 'superadmin';

  const fetchEntries = async () => {
    try {
      const res = await fetch(`${API_URL}/tournament`);
      const data = await parseApiResponse(res);
      setEntries(data || []);
    } catch (error) {
      console.error('Failed to load tournament entries', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();

    const role = localStorage.getItem('trs_role');
    const hasMemberSession = role === 'member' || localStorage.getItem('trs_tournament_member_role') === 'member';

    if (hasMemberSession && localStorage.getItem('token')) {
      const username = localStorage.getItem('trs_username');
      const authHeaders = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const savedVote = localStorage.getItem(`trs_tournament_vote_${username}`);

      if (savedVote) {
        setVotedEntryId(savedVote);
      }

      fetch(`${API_URL}/tournament/my-vote`, {
        headers: authHeaders
      })
        .then(parseApiResponse)
        .then(({ entryId }) => {
          const normalizedEntryId = entryId ? String(entryId) : null;
          setVotedEntryId(normalizedEntryId);
          if (normalizedEntryId) {
            localStorage.setItem(`trs_tournament_vote_${username}`, normalizedEntryId);
          } else {
            localStorage.removeItem(`trs_tournament_vote_${username}`);
          }
        })
        .catch(() => {});

      fetch(`${API_URL}/tournament/mine`, { headers: authHeaders })
        .then(parseApiResponse)
        .then(({ entry }) => setHasParticipantEntry(Boolean(entry)))
        .catch(() => setHasParticipantEntry(false));
    }
  }, []);

  const handleVote = async (id) => {
    const role = localStorage.getItem('trs_role');
    const username = localStorage.getItem('trs_username');
    const hasMemberSession = role === 'member' || localStorage.getItem('trs_tournament_member_role') === 'member';

    if (!username || !localStorage.getItem('token') || !hasMemberSession) {
      navigate('/tournament/login?redirect=/tournament/vote');
      return;
    }

    setVoting(true);
    try {
      const res = await fetch(`${API_URL}/tournament/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await parseApiResponse(res);
      if (!res.ok) throw new Error(data.message || 'Vote failed');
      const normalizedEntryId = String(id);
      setVotedEntryId(normalizedEntryId);
      localStorage.setItem(`trs_tournament_vote_${username}`, normalizedEntryId);
      await fetchEntries();
    } catch (error) {
      console.error(error);
      setError(error.message || 'Voting failed');
    } finally {
      setVoting(false);
    }
  };

  const handleDelete = async (id) => {
    const role = localStorage.getItem('trs_role');

    if (role !== 'superadmin') {
      setError('Only the super admin can delete tournament cards.');
      return;
    }

    if (!window.confirm('Delete this tournament card?')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/tournament/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await parseApiResponse(res);
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      setEntries((prev) => prev.filter((entry) => entry._id !== id));
      setError('');
    } catch (error) {
      console.error(error);
      setError(error.message || 'Delete failed');
    }
  };

  const startEdit = (entry) => {
    setEditingEntry(entry);
    setEditForm({
      ownerName: entry.ownerName || '',
      carName: entry.carName || '',
      description: entry.description || '',
      image: entry.image || '',
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const role = localStorage.getItem('trs_role');

    if (role !== 'superadmin') {
      setError('Only the super admin can edit tournament cards.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/tournament/${editingEntry._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editForm, role })
      });
      const data = await parseApiResponse(res);
      if (!res.ok) throw new Error(data.message || 'Update failed');

      setEntries((prev) => prev.map((entry) => entry._id === data._id ? data : entry));
      setEditingEntry(null);
      setError('');
    } catch (error) {
      console.error(error);
      setError(error.message || 'Update failed');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-neon-purple/80">Community voting</p>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">Vote for your favorite car</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/tournament" className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/80">Rules</Link>
            <Link to={hasParticipantEntry ? "/tournament/upload" : "/tournament"} className="rounded-xl bg-gradient-to-r from-neon-purple to-purple-600 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white">
              {hasParticipantEntry ? 'Edit your car' : 'Participate'}
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center text-white/60">Loading tournament entries...</div>
        ) : entries.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-12 text-center text-white/60">No cars are in the tournament yet. Be the first to join.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry, index) => (
              <div key={entry._id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-lg shadow-black/20">
                <div className="relative h-64 overflow-hidden">
                  <img src={entry.image} alt={entry.carName} className="h-full w-full object-cover" />
                  <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white/80">#{index + 1}</div>
                </div>
                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="mt-2 text-2xl font-black">{entry.carName}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-white/60">{entry.ownerName}</p>
                  {typeof entry.votes === 'number' && <p className="mt-2 text-sm font-bold text-[#FFD166]">{entry.votes} {entry.votes === 1 ? 'vote' : 'votes'}</p>}
                  {entry.description && <p className="mt-3 text-sm text-white/70">{entry.description}</p>}

                  {isSuperAdmin && (
                    <div className="mt-5 flex gap-2">
                      <button type="button" onClick={() => startEdit(entry)} className="flex-1 rounded-xl border border-electric-blue/50 bg-electric-blue/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-electric-blue">Edit</button>
                      <button type="button" onClick={() => handleDelete(entry._id)} className="flex-1 rounded-xl border border-red-500/50 bg-red-500/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-red-300">Delete</button>
                    </div>
                  )}

                  <button onClick={() => handleVote(entry._id)} disabled={voting} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black uppercase tracking-[0.2em] disabled:opacity-60 ${votedEntryId === entry._id ? 'border border-emerald-400/50 bg-emerald-400/15 text-emerald-300' : 'bg-gradient-to-r from-electric-blue to-neon-purple text-black'}`}>
                    <Star size={16} /> {votedEntryId === entry._id ? 'Voted' : 'Vote now'}
                  </button>
                </div>

                {editingEntry && editingEntry._id === entry._id && (
                  <form onSubmit={handleEditSubmit} className="border-t border-white/10 bg-black/20 p-5">
                    <div className="mb-3">
                      <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/50">Owner</label>
                      <input value={editForm.ownerName} onChange={(e) => setEditForm((prev) => ({ ...prev, ownerName: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white" />
                    </div>
                    <div className="mb-3">
                      <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/50">Car name</label>
                      <input value={editForm.carName} onChange={(e) => setEditForm((prev) => ({ ...prev, carName: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white" />
                    </div>
                    <div className="mb-3">
                      <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/50">Image URL</label>
                      <input value={editForm.image} onChange={(e) => setEditForm((prev) => ({ ...prev, image: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white" />
                    </div>
                    <div className="mb-4">
                      <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/50">Description</label>
                      <textarea value={editForm.description} onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))} rows="3" className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white" />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 rounded-xl bg-gradient-to-r from-neon-purple to-purple-600 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">Save</button>
                      <button type="button" onClick={() => setEditingEntry(null)} className="flex-1 rounded-xl border border-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/80">Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournament;
