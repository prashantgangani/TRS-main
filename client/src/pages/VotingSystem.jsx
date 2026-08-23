import React, { useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw, Shield, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const VotingSystem = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showVotes, setShowVotes] = useState(false);
    const [settingsLoading, setSettingsLoading] = useState(true);

    const loadOverview = async () => {
        setLoading(true);
        try {
            const adminToken = localStorage.getItem('trs_token') || localStorage.getItem('token');
            const response = await fetch(`${API_URL}/tournament/admin/overview`, {
                headers: { Authorization: `Bearer ${adminToken || ''}` }
            });
            const contentType = response.headers.get('content-type') || '';
            const responseText = await response.text();
            let data;

            try {
                data = contentType.includes('application/json') ? JSON.parse(responseText) : null;
            } catch {
                data = null;
            }

            if (!response.ok) {
                throw new Error(data?.message || responseText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180) || 'Unable to load voting overview.');
            }

            if (!data) {
                throw new Error('Voting overview returned an unexpected response.');
            }

            setEntries(data.entries || []);
            setError('');
        } catch (loadError) {
            setError(loadError.message || 'Unable to load voting overview.');
        } finally {
            setLoading(false);
        }
    };

    const loadSettings = async () => {
        try {
            const response = await fetch(`${API_URL}/settings`);
            const data = await response.json();
            setShowVotes(data.showTournamentVotes === true);
        } catch (loadError) {
            setError(loadError.message || 'Unable to load voting settings.');
        } finally {
            setSettingsLoading(false);
        }
    };

    const togglePublicVotes = async () => {
        const nextValue = !showVotes;
        setShowVotes(nextValue);
        try {
            const response = await fetch(`${API_URL}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ showTournamentVotes: nextValue })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Unable to update public vote visibility.');
            setShowVotes(data.showTournamentVotes === true);
        } catch (toggleError) {
            setShowVotes(!nextValue);
            setError(toggleError.message);
        }
    };

    useEffect(() => {
        loadOverview();
        loadSettings();
    }, []);

    return (
        <div className="min-h-screen bg-deep-black text-white relative selection:bg-neon-purple/50 pt-32 pb-32">
            <div className="max-w-6xl mx-auto px-6 md:px-12">
                <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <Link to="/controls" className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 hover:text-white">
                            <ArrowLeft size={14} /> Command Center
                        </Link>
                        <div className="flex items-center gap-3">
                            <Trophy className="text-[#FFD166]" size={28} />
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.35em] text-[#FFD166]">Super Admin</p>
                                <h1 className="mt-2 text-4xl font-bold font-heading md:text-5xl">Voting System</h1>
                            </div>
                        </div>
                        <p className="mt-4 max-w-2xl text-sm text-white/50">Review every tournament participant, their vote count, and the accounts that voted for them.</p>
                    </div>
                    <button type="button" onClick={loadOverview} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/70 hover:border-[#FFD166]/50 hover:text-[#FFD166]">
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>

                <section className="glass-panel rounded-2xl border border-white/10 bg-charcoal/40 p-6 md:p-8">
                    <div className="mb-6 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4">
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-white">Show votes publicly</h2>
                            <p className="mt-1 text-xs text-white/50">Allow everyone to see vote totals on tournament cards.</p>
                        </div>
                        <button type="button" disabled={settingsLoading} onClick={togglePublicVotes} className={`relative inline-flex h-9 w-16 items-center rounded-lg border transition ${showVotes ? 'border-emerald-400 bg-emerald-400/20' : 'border-white/15 bg-white/5'}`} aria-label="Toggle public vote visibility">
                            <span className={`h-7 w-7 rounded-md bg-white transition-transform ${showVotes ? 'translate-x-8' : 'translate-x-1'}`} />
                        </button>
                    </div>
                    <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5">
                        <Shield size={20} className="text-neon-purple" />
                        <h2 className="text-lg font-bold uppercase tracking-widest">Tournament Vote Records</h2>
                    </div>

                    {loading ? (
                        <p className="py-10 text-center text-sm text-white/50">Loading voting records...</p>
                    ) : error ? (
                        <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>
                    ) : entries.length === 0 ? (
                        <p className="py-10 text-center text-sm text-white/50">No tournament entries yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px] text-left text-sm">
                                <thead className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/40">
                                    <tr>
                                        <th className="px-3 py-3">Participant</th>
                                        <th className="px-3 py-3">Car</th>
                                        <th className="px-3 py-3 text-center">Votes</th>
                                        <th className="px-3 py-3">Voted By</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {entries.map((entry) => (
                                        <tr key={entry.id} className="align-top hover:bg-white/[0.03]">
                                            <td className="px-3 py-4">
                                                <div className="font-semibold text-white">{entry.ownerName}</div>
                                                <div className="mt-1 text-xs text-white/40">@{entry.username}</div>
                                            </td>
                                            <td className="px-3 py-4 text-white/80">{entry.carName}</td>
                                            <td className="px-3 py-4 text-center font-black text-[#FFD166]">{entry.votes}</td>
                                            <td className="px-3 py-4 text-white/65">
                                                {entry.voters.length ? entry.voters.map((voter) => `@${voter}`).join(', ') : 'No votes yet'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default VotingSystem;
