import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const MemberLogin = ({ setAuthContext }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const redirectPath = new URLSearchParams(location.search).get('redirect') || '/member-dashboard';

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/member-system/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('trs_role', data.member.role);
            localStorage.setItem('trs_username', data.member.username);
            
            if (setAuthContext) setAuthContext(data.member.role);
            navigate(redirectPath || '/member-dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">

    <div className="absolute top-20 left-20 w-72 h-72 bg-neon-purple/5 rounded-full blur-[120px]" />

    <div className="absolute bottom-20 right-20 w-72 h-72 bg-electric-blue/5 rounded-full blur-[120px]" />

</div>
            <div className="max-w-md w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-8 md:p-12 rounded-2xl relative overflow-hidden shadow-2xl shadow-neon-purple/5 border border-white/5"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                    <div className="flex flex-col items-center justify-center mb-8">
                        <div
className="
relative

w-20
h-20

rounded-full

bg-neon-purple/10

border
border-neon-purple/30

flex
items-center
justify-center

mb-6

shadow-[0_0_30px_rgba(176,38,255,0.25)]
"
>
                            <LogIn size={24} className="text-neon-purple" />
                            <div
className="
absolute
inset-0

rounded-full

border
border-neon-purple/20

animate-ping
"
/>
                        </div>
                        <div className="flex items-center gap-3 mb-2">

    <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />

    <span className="text-[10px] uppercase tracking-[0.3em] text-neon-purple/80">
        TRS NETWORK
    </span>

</div>

<h2 className="text-3xl font-heading font-medium text-white tracking-[0.2em] text-center">
    CREW PORTAL
</h2>

<p className="text-sm text-white/40 mt-3 text-center uppercase tracking-widest">
    Authorized Member Access
</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-500/90 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
                            <AlertCircle size={16} className="shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white/90 placeholder-white/20 focus:outline-none focus:border-neon-purple/50 hover:border-neon-purple/20

hover:bg-white/[0.03]

focus:shadow-[0_0_20px_rgba(176,38,255,0.15)] focus:bg-white/5 transition-all text-sm"
                                placeholder="Your discord tag"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white/90 placeholder-white/20 focus:outline-none focus:border-neon-purple/50 hover:border-neon-purple/20

hover:bg-white/[0.03]

focus:shadow-[0_0_20px_rgba(176,38,255,0.15)] focus:bg-white/5 transition-all text-sm mb-2"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
className="
relative

w-full

py-4

overflow-hidden

rounded-xl

border
border-neon-purple/40

bg-gradient-to-r
from-neon-purple
to-purple-500

text-white

font-black

tracking-[0.2em]

transition-all
duration-500

hover:scale-[1.02]

hover:shadow-[0_0_40px_rgba(176,38,255,0.5)]

active:scale-[0.98]

disabled:opacity-50
"                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">

    <span
    className="
    w-2
    h-2

    rounded-full

    bg-white

    animate-pulse
    "
    />

    {loading ? 'AUTHENTICATING...' : 'ENTER CREW PORTAL'}

</span>
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default MemberLogin;