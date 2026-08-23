import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Search, ShieldAlert, KeyRound, Users, RefreshCw, Save } from 'lucide-react';
import { API_URL } from '../config';

const StaffManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [newName, setNewName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newSmartName, setNewSmartName] = useState('');
    const [newSmartPassword, setNewSmartPassword] = useState('');
    
    const [newPassManagerName, setNewPassManagerName] = useState('');
    const [newPassManagerPassword, setNewPassManagerPassword] = useState('');

    const [newSuperName, setNewSuperName] = useState('');
    const [newSuperPassword, setNewSuperPassword] = useState('');
    const [superError, setSuperError] = useState('');
    
    // Member generation state
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberPassword, setNewMemberPassword] = useState('');
    const [memberError, setMemberError] = useState('');
    const [memberSuccess, setMemberSuccess] = useState('');
    const [crewMembers, setCrewMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [garageLimit, setGarageLimit] = useState(3);
    const [isSavingLimit, setIsSavingLimit] = useState(false);
    const [searchCrew, setSearchCrew] = useState('');

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [smartError, setSmartError] = useState('');
    const [passManagerError, setPassManagerError] = useState('');
    
    // Retrieve token for authenticated SuperAdmin requests
    const token = localStorage.getItem('trs_token');

    const fetchAdmins = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/admins`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setAdmins(data);
            } else {
                console.error("Auth error:", data.message);
            }
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch admins:", error);
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('trs_token');
            const res = await fetch(`${API_URL}/settings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.garageUpdateLimit !== undefined) {
                    setGarageLimit(data.garageUpdateLimit);
                }
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
        }
    };

    const handleUpdateLimit = async () => {
        setIsSavingLimit(true);
        try {
            const token = localStorage.getItem('trs_token');
            const res = await fetch(`${API_URL}/settings`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ garageUpdateLimit: parseInt(garageLimit) })
            });
            if (!res.ok) throw new Error('Failed to update limit');
            setMemberSuccess('Garage update limit saved successfully');
            setTimeout(() => setMemberSuccess(''), 3000);
            fetchSettings();
        } catch (err) {
            setMemberError(err.message);
            setTimeout(() => setMemberError(''), 3000);
        } finally {
            setIsSavingLimit(false);
        }
    };

    const handleResetAllLimits = async () => {
        if (!window.confirm('Are you sure you want to reset the push update limits for ALL members to 0?')) return;
        try {
            const token = localStorage.getItem('trs_token');
            const res = await fetch(`${API_URL}/member-system/superadmin/reset-push-limits`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to reset limits');
            setMemberSuccess('All member push limits have been reset to 0.');
            setTimeout(() => setMemberSuccess(''), 3000);
            fetchMembers();
        } catch (err) {
            setMemberError(err.message);
            setTimeout(() => setMemberError(''), 3000);
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await fetch(`${API_URL}/member-system/superadmin/members`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setCrewMembers(data);
            }
            setLoadingMembers(false);
        } catch (error) {
            console.error("Failed to fetch members:", error);
            setLoadingMembers(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchAdmins();
            fetchMembers();
        }
    }, [token]);

    const handleAddAdmin = async (e, roleType = 'admin') => {
        e.preventDefault();
        setIsSubmitting(true);
        if (roleType === 'admin') setError('');
        else if (roleType === 'smartadmin') setSmartError('');
        else if (roleType === 'passwordmanager') setPassManagerError('');
        else if (roleType === 'superadmin') setSuperError('');

        try {
            let reqName, reqPass;
            if (roleType === 'admin') { reqName = newName; reqPass = newPassword; }
            else if (roleType === 'smartadmin') { reqName = newSmartName; reqPass = newSmartPassword; }
            else if (roleType === 'passwordmanager') { reqName = newPassManagerName; reqPass = newPassManagerPassword; }
            else if (roleType === 'superadmin') { reqName = newSuperName; reqPass = newSuperPassword; }

            const response = await fetch(`${API_URL}/auth/register-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: reqName, password: reqPass, role: roleType })
            });
            const data = await response.json();

            if (response.ok) {
                fetchAdmins();
                if (roleType === 'admin') {
                    setNewName('');
                    setNewPassword('');
                } else if (roleType === 'smartadmin') {
                    setNewSmartName('');
                    setNewSmartPassword('');
                } else if (roleType === 'passwordmanager') {
                    setNewPassManagerName('');
                    setNewPassManagerPassword('');
                } else if (roleType === 'superadmin') {
                    setNewSuperName('');
                    setNewSuperPassword('');
                }
            } else {
                if (roleType === 'admin') setError(data.message || 'Failed to create admin');
                else if (roleType === 'smartadmin') setSmartError(data.message || 'Failed to create admin');
                else if (roleType === 'passwordmanager') setPassManagerError(data.message || 'Failed to create admin');
                else if (roleType === 'superadmin') setSuperError(data.message || 'Failed to create admin');
            }
        } catch (err) {
            if (roleType === 'admin') setError('Server error.');
            else if (roleType === 'smartadmin') setSmartError('Server error.');
            else if (roleType === 'passwordmanager') setPassManagerError('Server error.');
            else if (roleType === 'superadmin') setSuperError('Server error.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMemberError('');
        setMemberSuccess('');
        
        try {
            const response = await fetch(`${API_URL}/member-system/superadmin/members`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ username: newMemberName, password: newMemberPassword })
            });
            const data = await response.json();
            
            if (response.ok) {
                setMemberSuccess('Member & Garage Card Generated.');
                setNewMemberName('');
                setNewMemberPassword('');
                fetchMembers();
                setTimeout(() => setMemberSuccess(''), 4000);
            } else {
                setMemberError(data.message || 'Failed to create member');
            }
        } catch (err) {
            setMemberError('Server error.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Revoke admin access for this user?")) return;
        
        try {
            const response = await fetch(`${API_URL}/auth/admins/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setAdmins(admins.filter(admin => admin._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteMember = async (id) => {
        if (!window.confirm("Revoke member access for this user? Their garage card will become orphaned.")) return;
        try {
            const response = await fetch(`${API_URL}/member-system/superadmin/members/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setCrewMembers(crewMembers.filter(m => m._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleResetMemberPassword = async (id) => {
        const newPassword = window.prompt("Enter new password for this member:");
        if (!newPassword) return;
        
        try {
            const response = await fetch(`${API_URL}/member-system/superadmin/members/${id}/reset-password`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ password: newPassword })
            });
            if (response.ok) {
                alert("Password updated successfully.");
            } else {
                alert("Failed to reset password.");
            }
        } catch (error) {
            console.error(error);
            alert("Error resetting password.");
        }
    };

    const filteredCrewMembers = crewMembers.filter(member => 
        member.username.toLowerCase().includes(searchCrew.toLowerCase())
    );

    return (
        <div className="mt-32 max-w-5xl mx-auto border-t border-white/10 pt-16">
            <div className="mb-12">

    {/* Badge */}
    <div className="flex justify-center mb-6">
        <span className="px-4 py-2 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red text-xs uppercase tracking-[0.35em] font-bold hover:bg-neon-red/60 hover:text-white/80 transition-all duration-500 hover:tracking-[0.5em] animate-pulse-slow">
            TRS Operations
        </span>
    </div>

    {/* Heading */}
    <h1 className="text-center text-4xl md:text-6xl font-black font-heading uppercase tracking-wider text-transparent bg-clip-text bg-[length:400%_auto] animate-gradient-x bg-gradient-to-l from-transparent via-neon-purple to-transparent">
        Control Center
    </h1>

    <p className="text-center text-white/50 uppercase tracking-[0.3em] text-xs mt-4 hover:text-white transition-all duration-300">
        Staff • Members • Permissions • System
    </p>

    {/* Divider */}
    <div className="flex justify-center items-center gap-4 my-8">

        <div className="h-px w-24 bg-gradient-to-l from-transparent to-neon-purple"></div>

        <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse"></div>

        <div className="h-px w-24 bg-gradient-to-r from-transparent to-electric-blue"></div>

    </div>

    {/* Statistics */}
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 group">

        <div className="glass-panel p-5 text-center">
            <div className="text-3xl font-black text-neon-red group-hover:text-white transition-all duration-300">
                {admins.filter(a => a.role === 'superadmin').length}
            </div>

            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 group-hover:text-neon-red transition-all duration-300 mt-2">
                Super Admins
            </div>
        </div>

        <div className="glass-panel p-5 text-center">
            <div className="text-3xl font-black text-neon-purple group-hover:text-white transition-all duration-300">
                {admins.filter(a => a.role === 'admin').length}
            </div>

            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-2 group-hover:text-neon-purple transition-all duration-300">
                Admins
            </div>
        </div>

        <div className="glass-panel p-5 text-center">
            <div className="text-3xl font-black text-orange-400 group-hover:text-white transition-all duration-300">
                {admins.filter(a => a.role === 'smartadmin').length}
            </div>

            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-2 group-hover:text-orange-400 transition-all duration-300">
                Smart Admins
            </div>
        </div>

        <div className="glass-panel p-5 text-center">
            <div className="text-3xl font-black text-electric-blue group-hover:text-white transition-all duration-300">
                {admins.filter(a => a.role === 'passwordmanager').length}
            </div>

            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-2 group-hover:text-electric-blue transition-all duration-300">
                Password Managers
            </div>
        </div>

        <div className="glass-panel p-5 text-center">
            <div className="text-3xl font-black text-neon-green group-hover:text-white transition-all duration-300">
                {crewMembers.length}
            </div>

            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-2 group-hover:text-neon-green transition-all duration-300">
                Crew Members
            </div>
        </div>

    </div>

    {/* System Status */}
<div className="glass-panel mt-8 p-6 border border-white/10 group">

    <div className="flex items-center justify-between flex-wrap gap-4">

        <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/40 group-hover:text-white transition-all duration-300">
                System Status
            </p>

            <h2 className="text-2xl font-black uppercase mt-2 group-hover:text-neon-green group-hover:tracking-wide transition-all duration-300">
                Operations Network
            </h2>
        </div>

        <div className="px-4 py-2 rounded-full bg-neon-green/10 border border-green-500/30 text-green-400 text-xs uppercase tracking-[0.3em] group-hover:bg-neon-green/80 group-hover:text-white group-hover:tracking-[0.4em] transition-all duration-300 font-bold">
            All Systems Operational
        </div>

    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">

        <div className="bg-black/30 rounded-lg p-4 border border-white/5">
            <p className="text-neon-green/50 font-bold text-sm group-hover:text-neon-green transition-all duration-300">
                ● Authentication
            </p>

            <p className="text-white/50 text-xs mt-2 group-hover:text-white transition-all duration-300">
                Online
            </p>
        </div>

        <div className="bg-black/30 rounded-lg p-4 border border-white/5">
            <p className="text-neon-green/50 font-bold text-sm group-hover:text-neon-green transition-all duration-300">
                ● Database
            </p>

            <p className="text-white/50 text-xs mt-2 group-hover:text-white transition-all duration-300">
                Connected
            </p>
        </div>

        <div className="bg-black/30 rounded-lg p-4 border border-white/5">
            <p className="text-neon-green/50 font-bold text-sm group-hover:text-neon-green transition-all duration-300">
                ● Member Portal
            </p>

            <p className="text-white/50 text-xs mt-2 group-hover:text-white transition-all duration-300">
                Online
            </p>
        </div>

        <div className="bg-black/30 rounded-lg p-4 border border-white/5">
            <p className="text-neon-green/50 font-bold text-sm group-hover:text-neon-green transition-all duration-300">
                ● Garage Sync
            </p>

            <p className="text-white/50 text-xs mt-2 group-hover:text-white transition-all duration-300">
                Enabled
            </p>
        </div>

        <div className="bg-black/30 rounded-lg p-4 border border-white/5">
            <p className="text-electric-blue font-bold text-sm group-hover:text-white transition-all duration-300">
                Garage Limit
            </p>

            <p className="text-2xl font-black text-electric-blue mt-2 group-hover:text-white transition-all duration-300">
                {garageLimit}
            </p>
        </div>

    </div>

</div>

</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Generation Terminal */}
                <div className="md:col-span-1">
                    <div className="glass-panel p-6 rounded-xl border border-neon-red/30 bg-neon-red/5 group">
                        <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2 mb-6 group-hover:text-neon-red/80 transition-all duration-400">
                            <KeyRound className="text-neon-red group-hover:text-white transition-all duration-400" size={20} /> Grant Access
                        </h3>
                        
                        <form onSubmit={handleAddAdmin} className="space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2 group-hover:text-white transition-all duration-400">Assign Alias</label>
                                <input required type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-red/50" placeholder="Officer Name" />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2 group-hover:text-white transition-all duration-400">Assign Passcode</label>
                                <input required type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-red/50" placeholder="••••••••" />
                            </div>
                            
                            {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
                            
                            <button disabled={isSubmitting} type="submit" className="w-full py-3 mt-2 bg-neon-red/90 hover:bg-neon-red/40 text-white/80 text-xs font-bold uppercase tracking-widest rounded group-hover:text-white transition-all duration-400 shadow-[0_0_15px_rgba(255,51,102,0.4)]">
                                {isSubmitting ? 'Encrypting...' : 'Generate Credentials'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Active Credentials Log */}
                <div className="md:col-span-2">
                    <div className="glass-panel rounded-xl border border-white/10 overflow-hidden h-full flex flex-col">
                        <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-white/80">Active Admin Network</h3>
                            <span className="text-xs text-neon-red font-bold px-2 py-1 bg-neon-red/20 rounded">{admins.filter(a => a.role === 'admin').length} Systems Online</span>
                        </div>
                        
                        <div className="p-4 flex-1 overflow-y-auto max-h-[300px] space-y-3">
                            {loading ? (
                                <div className="text-white/30 text-xs uppercase tracking-widest text-center py-10">Accessing Mainframe...</div>
                            ) : admins.filter(a => a.role === 'admin').length === 0 ? (
                                <div className="text-white/30 text-xs uppercase tracking-widest text-center py-10">No active administrators found.</div>
                            ) : (
                                <AnimatePresence>
                                    {admins.filter(a => a.role === 'admin').map(admin => (
                                        <motion.div 
                                            key={admin._id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded hover:border-neon-red/50 transition-all duration-400 group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shadow-[0_0_10px_rgba(255,51,102,0.1)] group-hover:bg-neon-red/50 transition-all duration-400 ${admin.role === 'smartadmin' ? 'text-neon-purple' : 'text-neon-red'}`}>
                                                    <ShieldAlert size={14} className='group-hover:border-neon-red group-hover:text-white transition-all duration-400' />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold group-hover:text-neon-red transition-all duration-400">{admin.name} <span className="text-[9px] uppercase ml-2 text-white/40 bg-black px-1.5 py-0.5 group-hover:text-neon-red/50 transition-all duration-400">{admin.role}</span></div>
                                                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">ID: {admin._id.slice(-6)}</div>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={() => handleDelete(admin._id)}
                                                className="
px-3 py-1.5
text-[10px]
text-white/50
hover:text-white
bg-black
border border-white/10
hover:bg-neon-red

rounded-lg
uppercase
tracking-widest
transition-all duration-300
font-bold
"
                                            >
                                                Revoke
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Generation Terminals - Smart Admin */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Smart Admin Generation Terminal */}
                <div className="md:col-span-1 glass-panel p-6 rounded-xl border border-neon-purple/30 bg-neon-purple/5 group">
                    <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2 mb-2 justify-center group-hover:text-neon-purple transition-all duration-400">
                        <KeyRound className="text-neon-purple group-hover:text-white transition-all duration-400" size={20} /> Smart Admin Access
                    </h3>
                    <p className="text-[10px] text-center text-white/50 uppercase tracking-widest mb-6 group-hover:text-white transition-all duration-400">Create credentials restricted strictly to the Smart Admin Panel.</p>
                    
                    <form onSubmit={(e) => handleAddAdmin(e, 'smartadmin')} className="space-y-4">
                        <div>
                            <input required type="text" value={newSmartName} onChange={e => setNewSmartName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-purple/50 text-center" placeholder="Smart Admin Alias" />
                        </div>
                        <div>
                            <input required type="password" value={newSmartPassword} onChange={e => setNewSmartPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-purple/50 text-center" placeholder="••••••••" />
                        </div>
                        
                        {smartError && <p className="text-red-400 text-xs font-bold text-center">{smartError}</p>}
                        
                        <button disabled={isSubmitting} type="submit" className="w-full py-3 mt-2 bg-neon-purple/80 hover:bg-neon-purple/30 text-white text-xs font-bold uppercase tracking-widest rounded group-hover:text-white transition-all duration-400 shadow-[0_0_15px_rgba(176,38,255,0.4)]">
                            {isSubmitting ? 'Encrypting...' : 'Generate Smart Admin'}
                        </button>
                    </form>
                </div>

                {/* Active Smart Admin Log */}
                <div className="md:col-span-2">
                    <div className="glass-panel rounded-xl border border-white/10 overflow-hidden h-full flex flex-col">
                        <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-white/80">Smart Admin Network</h3>
                            <span className="text-xs text-neon-purple font-bold px-2 py-1 bg-neon-purple/20 rounded">{admins.filter(a => a.role === 'smartadmin').length} Systems Online</span>
                        </div>
                        
                        <div className="p-4 flex-1 overflow-y-auto max-h-[300px] space-y-3">
                            {loading ? (
                                <div className="text-white/30 text-xs uppercase tracking-widest text-center py-10">Accessing Mainframe...</div>
                            ) : admins.filter(a => a.role === 'smartadmin').length === 0 ? (
                                <div className="text-white/30 text-xs uppercase tracking-widest text-center py-10">No active smart administrators found.</div>
                            ) : (
                                <AnimatePresence>
                                    {admins.filter(a => a.role === 'smartadmin').map(admin => (
                                        <motion.div 
                                            key={admin._id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded hover:border-neon-purple/50 group transition-all duration-400"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shadow-[0_0_10px_rgba(176,38,255,0.1)] text-neon-purple group-hover:text-white group-hover:bg-neon-purple/50 transition-all duration-400">
                                                    <ShieldAlert size={14} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
    <span className="text-white font-bold group-hover:text-neon-purple transition-all duration-400">
        {admin.name}
    </span>

    {admin.name === 'JOYBOY' && (
        <span className="text-[9px] px-2 py-1 rounded bg-neon-red/20 text-neon-red uppercase tracking-widest">
            Founder
        </span>
    )}

    {admin.name === 'Tarun-a' && (
        <span className="text-[9px] px-2 py-1 rounded bg-electric-blue/20 text-electric-blue uppercase tracking-widest">
            Owner
        </span>
    )}
</div>                                                    
                                                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">ID: {admin._id.slice(-6)}</div>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={() => handleDelete(admin._id)}
                                                className="px-3 py-1.5 text-[10px] text-white/50 hover:text-white hover:bg-neon-purple bg-black border border-white/10 rounded-lg uppercase tracking-widest transition-colors font-bold"
                                            >
                                                Revoke
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Password Manager Generation Terminal */}
                <div className="md:col-span-1 glass-panel p-6 rounded-xl border border-electric-blue/30 bg-electric-blue/5 group">
                    <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2 mb-2 justify-center group-hover:text-electric-blue transition-all duration-400">
                        <KeyRound className="text-electric-blue group-hover:text-white transition-all duration-400" size={20} /> Password Manager Setup
                    </h3>
                    <p className="text-[10px] text-center text-white/50 uppercase tracking-widest mb-6 group-hover:text-white transition-all duration-400">Create credentials restricted strictly to the Password Manager Panel.</p>
                    
                    <form onSubmit={(e) => handleAddAdmin(e, 'passwordmanager')} className="space-y-4">
                        <div>
                            <input required type="text" value={newPassManagerName} onChange={e => setNewPassManagerName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-electric-blue/50 text-center" placeholder="Manager Alias" />
                        </div>
                        <div>
                            <input required type="password" value={newPassManagerPassword} onChange={e => setNewPassManagerPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-electric-blue/50 text-center" placeholder="••••••••" />
                        </div>
                        
                        {passManagerError && <p className="text-red-400 text-xs font-bold text-center">{passManagerError}</p>}
                        
                        <button disabled={isSubmitting} type="submit" className="w-full py-3 mt-2 bg-electric-blue/80 hover:bg-electric-blue/30 text-white text-xs font-bold uppercase tracking-widest rounded group-hover:text-white transition-all duration-400">
                            {isSubmitting ? 'Encrypting...' : 'Generate Password Manager'}
                        </button>
                    </form>
                </div>

                {/* Active Password Manager Log */}
                <div className="md:col-span-2">
                    <div className="glass-panel rounded-xl border border-white/10 overflow-hidden h-full flex flex-col">
                        <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-white/80">Password Manager Network</h3>
                            <span className="text-xs text-electric-blue font-bold px-2 py-1 bg-electric-blue/20 rounded">{admins.filter(a => a.role === 'passwordmanager').length} Systems Online</span>
                        </div>
                        
                        <div className="p-4 flex-1 overflow-y-auto max-h-[300px] space-y-3">
                            {loading ? (
                                <div className="text-white/30 text-xs uppercase tracking-widest text-center py-10">Accessing Mainframe...</div>
                            ) : admins.filter(a => a.role === 'passwordmanager').length === 0 ? (
                                <div className="text-white/30 text-xs uppercase tracking-widest text-center py-10">No active password managers found.</div>
                            ) : (
                                <AnimatePresence>
                                    {admins.filter(a => a.role === 'passwordmanager').map(admin => (
                                        <motion.div 
                                            key={admin._id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded hover:border-white/20 transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shadow-[0_0_10px_rgba(255,215,0,0.1)] text-electric-blue group-hover:text-white group-hover:bg-electric-blue/50 transition-all duration-400">
                                                    <ShieldAlert size={14} />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold group-hover:text-electric-blue transition-all duration-400">{admin.name} <span className="text-[9px] uppercase ml-2 text-white/40 bg-black px-1.5 py-0.5 rounded group-hover:text-electric-blue/40 transition-all duration-400">{admin.role}</span></div>
                                                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">ID: {admin._id.slice(-6)}</div>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={() => handleDelete(admin._id)}
                                                className="px-3 py-1.5 text-[10px] text-white/50 hover:text-white hover:bg-electric-blue/80 bg-black border border-white/10 rounded-lg uppercase tracking-widest transition-colors font-bold"
                                            >
                                                Revoke
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Super Admin Generation Terminal */}
                <div className="md:col-span-1 glass-panel p-6 rounded-xl border border-neon-red/30 bg-neon-red/5 group">
                    <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2 mb-2 justify-center group-hover:text-neon-red transition-all duration-400">
                        <KeyRound className="text-neon-red group-hover:text-white transition-all duration-400" size={20} /> Super Admin Setup
                    </h3>
                    <p className="text-[10px] text-center text-white/50 uppercase tracking-widest mb-6 group-hover:text-white transition-all duration-400">Create top-level credentials with full system access.</p>
                    
                    <form onSubmit={(e) => handleAddAdmin(e, 'superadmin')} className="space-y-4">
                        <div>
                            <input required type="text" value={newSuperName} onChange={e => setNewSuperName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-red/50 text-center" placeholder="Super Admin Alias" />
                        </div>
                        <div>
                            <input required type="password" value={newSuperPassword} onChange={e => setNewSuperPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-red/50   text-center" placeholder="••••••••" />
                        </div>
                        
                        {superError && <p className="text-red-400 text-xs font-bold text-center">{superError}</p>}
                        
                        <button disabled={isSubmitting} type="submit" className="
px-3 py-1.5
text-[10px]
text-white/50
bg-black
border border-white/10
group-hover:border-neon-red
group-hover:text-white
hover:bg-neon-red/80
rounded
uppercase
tracking-widest
transition-all duration-300
font-bold
">
                            {isSubmitting ? 'Encrypting...' : 'Generate Super Admin'}
                        </button>
                    </form>
                </div>

                {/* Active Super Admin Log */}
                <div className="md:col-span-2">
                    <div className="glass-panel rounded-xl border border-white/10 overflow-hidden h-full flex flex-col">
                        <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-white/80">Super Admin Network</h3>
                            <span className="text-xs text-neon-red font-bold px-2 py-1 bg-neon-red/20 rounded">{admins.filter(a => a.role === 'superadmin').length} Systems Online</span>
                        </div>
                        
                        <div className="p-4 flex-1 overflow-y-auto max-h-[300px] space-y-3">
                            {loading ? (
                                <div className="text-white/30 text-xs uppercase tracking-widest text-center py-10">Accessing Mainframe...</div>
                            ) : admins.filter(a => a.role === 'superadmin').length === 0 ? (
                                <div className="text-white/30 text-xs uppercase tracking-widest text-center py-10">No active super administrators found.</div>
                            ) : (
                                <AnimatePresence>
                                    {admins.filter(a => a.role === 'superadmin').map(admin => (
                                        <motion.div 
                                            key={admin._id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded hover:border-white/20 transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shadow-[0_0_10px_rgba(255,51,102,0.1)] text-neon-red group-hover:bg-neon-red/50 group-hover:text-white transition-all duration-400">
                                                    <ShieldAlert size={14} />
                                                </div>
                                                <div>
<div className="flex items-center gap-2">
    <span className="text-white font-bold group-hover:text-neon-red transition-all duration-800">
        {admin.name}
    </span>

    {admin.name === 'JOYBOY' && (
        <span className="text-[9px] px-2 py-1 rounded bg-neon-red/20 text-neon-red uppercase group-hover:bg-neon-red group-hover:text-white transition-all duration-400 tracking-widest">
            Founder
        </span>
    )}

    {admin.name === 'Tarun-a' && (
        <span className="text-[9px] px-2 py-1 rounded bg-neon-red/20 text-neon-red uppercase group-hover:bg-neon-red group-hover:text-white transition-all duration-400 tracking-widest">
            Partner
        </span>
    )}
</div>                                                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">ID: {admin._id.slice(-6)}</div>
                                                </div>
                                            </div>
                                            
                                            {['JOYBOY', 'Tarun-a'].includes(admin.name) ? (
                                                <span className="px-3 py-1.5 text-[10px] text-neon-red/50 border border-neon-red/20 rounded uppercase tracking-widest font-bold">
                                                    Protected
                                                </span>
                                            ) : (
                                                <button 
                                                    onClick={() => handleDelete(admin._id)}
                                                    className="
px-3 py-1.5
text-[10px]
text-white/50
hover:text-white
bg-black
border border-white/10
hover:border-neon-red
rounded-lg
uppercase
tracking-widest
transition-all duration-300
font-bold
"
                                                >
                                                    Revoke
                                                </button>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Crew Member Access Module */}
            <div className="mt-16 text-center mb-8 border-t border-white/10 pt-16">
                <span className="glassmorphism px-3 py-1 rounded-sm text-xs uppercase tracking-widest text-electric-blue border-electric-blue/30 mb-4 inline-block shadow-[0_0_10px_rgba(0,255,255,0.2)]">
                    Crew Matrix
                </span>
                <h2 className="text-3xl font-bold font-heading text-white flex items-center justify-center gap-3 drop-shadow-lg">
                    <Users className="text-electric-blue" size={32} /> Crew Member Access
                </h2>
                <p className="text-[10px] uppercase tracking-widest text-white/50 mt-2">Manage restricted credentials allowing members to sync their own Garage Cards.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {/* Crew Member Generation Terminal */}
                <div className="md:col-span-1 space-y-6">
                    {/* Crew Member Generation Terminal */}
                    <div className="glass-panel p-6 rounded-xl border border-electric-blue/30 bg-electric-blue/5 group">
                        <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2 mb-6 justify-center group-hover:text-electric-blue transition-all duration-400">
                            <KeyRound className="text-electric-blue group-hover:text-white transition-all duration-400" size={20} /> Grant Sync Access
                        </h3>
                    
                    <form onSubmit={handleAddMember} className="space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2 group-hover:text-white transition-all duration-400">Assign Alias</label>
                            <input required type="text" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-electric-blue/50" placeholder="Discord Tag" />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2 group-hover:text-white transition-all duration-400">Assign Passcode</label>
                            <input required type="password" value={newMemberPassword} onChange={e => setNewMemberPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-electric-blue/50" placeholder="••••••••" />
                        </div>
                        
                        {memberError && <p className="text-red-400 text-xs font-bold">{memberError}</p>}
                        {memberSuccess && <p className="text-electric-blue text-xs font-bold">{memberSuccess}</p>}
                        
                        <button disabled={isSubmitting} type="submit" className="w-full py-3 mt-2 bg-electric-blue/80 hover:bg-electric-blue/30 text-black text-xs hover:text-white font-bold uppercase tracking-widest rounded transition-all duration-400 shadow-[0_0_15px_rgba(0,255,255,0.4)]">
                            {isSubmitting ? 'Provisioning...' : 'Generate Member Setup'}
                        </button>
                    </form>
                </div>

                {/* Sync Limits Controller */}
                <div className="glass-panel p-6 rounded-xl border border-electric-blue/30 bg-electric-blue/5 group">
                    <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2 mb-6 justify-center group-hover:text-electric-blue transition-all duration-400">
                        <ShieldAlert className="text-electric-blue group-hover:text-white transition-all duration-400" size={20} /> Sync Limits
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2 group-hover:text-white transition-all duration-400">Max Pushes Allowed (Global)</label>
                            <div className="flex gap-2">
                                <input 
                                    type="number" 
                                    min="1" 
                                    value={garageLimit} 
                                    onChange={e => setGarageLimit(Number(e.target.value))} 
                                    className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-electric-blue" 
                                />
                                <button 
                                    onClick={handleUpdateLimit}
                                    disabled={isSavingLimit}
                                    className="bg-electric-blue/20 hover:bg-electric-blue/50 hover:text-white transition-all duration-400 text-electric-blue border border-electric-blue/50 px-4 py-2 rounded flex items-center justify-center disabled:opacity-50"
                                    title="Save Limit"
                                >
                                    <Save size={18} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="pt-4 border-t border-white/10">
                            <button 
                                onClick={handleResetAllLimits}
                                className="w-full py-3 flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest rounded hover:bg-neon-red/60 hover:text-white transition-all duration-400"
                            >
                                <RefreshCw size={16} />
                                Reset All Members' Pushes
                            </button>
                            <p className="text-center text-[10px] text-white/40 mt-2 hover:text-white transition-all duration-400">
                                Sets everyone's used pushes back to 0. Limit stays exactly the same.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

                {/* Active Crew Network */}
                <div className="md:col-span-2">
                    <div className="glass-panel rounded-xl border border-white/10 overflow-hidden h-full flex flex-col">
                        <div className="bg-white/5 p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-white/80">Active Crew Network</h3>
                            <span className="text-xs text-electric-blue font-bold px-2 py-1 bg-electric-blue/20 rounded whitespace-nowrap">{crewMembers.length} Accounts Active</span>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="p-4 border-b border-white/5 bg-black/20">
                            <div className="relative flex items-center">
                                <Search className="absolute left-3 text-electric-blue/50" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search crew members by alias..."
                                    value={searchCrew}
                                    onChange={(e) => setSearchCrew(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-blue/50 transition-colors placeholder:text-white/30"
                                />
                            </div>
                        </div>
                        
                        <div className="p-4 flex-1 overflow-y-auto max-h-[300px] space-y-3">
                            {loadingMembers ? (
                                <div className="text-white/30 text-xs uppercase tracking-widest text-center py-10">Accessing Mainframe...</div>
                            ) : filteredCrewMembers.length === 0 ? (
                                <div className="text-white/30 text-xs uppercase tracking-widest text-center py-10">
                                    {searchCrew ? 'No matching crew members found.' : 'No active members found.'}
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {filteredCrewMembers.map(member => (
                                        <motion.div 
                                            key={member._id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded hover:border-white/20 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shadow-[0_0_10px_rgba(0,255,255,0.1)] text-electric-blue group-hover:text-white group-hover:bg-electric-blue/50 transition-all duration-400`}>
                                                    <Users size={14} />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold group-hover:text-electric-blue transition-all duration-400">{member.username}</div>
                                                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono group-hover:text-white transition-all duration-400">STATUS: <span className={member.isActive ? 'text-green-400' : 'text-red-400'}>{member.isActive ? 'ONLINE' : 'OFFLINE'}</span> <span className="mx-2 text-white/20 group-hover:text-white transition-all duration-400">|</span> PUSHES: <span className={(member.usedPushUpdates || 0) >= garageLimit ? 'text-red-400 font-bold' : 'text-electric-blue'}>{member.usedPushUpdates || 0} / {garageLimit}</span></div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleResetMemberPassword(member._id)}
                                                    className="px-3 py-1.5 text-[10px] text-white/50 hover:bg-electric-blue/50 hover:text-white bg-black border border-white/10 rounded-lg uppercase tracking-widest transition-colors font-bold flex items-center gap-1"
                                                >
                                                    <KeyRound size={12} /> Reset
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteMember(member._id)}
                                                    className="px-3 py-1.5 text-[10px] text-white/50 hover:text-white hover:bg-neon-red bg-black border border-white/10 rounded-lg uppercase tracking-widest transition-colors font-bold flex items-center gap-1"
                                                >
                                                    <Trash2 size={12} /> Revoke
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffManagement;
