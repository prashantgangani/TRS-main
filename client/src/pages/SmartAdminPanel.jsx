    import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Shield, Check, X, Users } from 'lucide-react';
    import { API_URL } from '../config';
    import { Link } from 'react-router-dom';

    const SmartAdminPanel = () => {
        const [settings, setSettings] = useState(null);
        const [loading, setLoading] = useState(true);

        const fetchSettings = async () => {
            try {
                const response = await fetch(`${API_URL}/settings`);
                const data = await response.json();
                setSettings(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch settings", error);
                setLoading(false);
            }
        };

        useEffect(() => {
            let mounted = true;
            fetchSettings().then(() => {
                if (!mounted) return;
            });
            return () => { mounted = false };
        }, []);

        const handleToggle = async (key) => {
            // Handle defaults based on key since older db entries might not have them
            const defaultValues = {
                memberLoginEnabled: false,
                allowAdminCarArrange: true,
                hideGarageCars: true,
                showTournamentVotes: false,
                tournamentEntryEnabled: true,
                showTournamentNotification: true
            };
            const currentValue = Object.prototype.hasOwnProperty.call(settings, key) ? settings[key] : (defaultValues[key] !== undefined ? defaultValues[key] : true);
            const newSettings = { ...settings, [key]: !currentValue };
            setSettings(newSettings);

            try {
                await fetch(`${API_URL}/settings`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newSettings)
                });
            } catch (error) {
                console.error("Failed to update settings", error);
                // Revert on error
                setSettings({ ...settings, [key]: settings[key] });
            }
        };

        if (loading) {
            return <div className="min-h-screen bg-deep-black text-white flex items-center justify-center pt-32 pb-32 uppercase tracking-widest text-lg">Loading Protocol...</div>;
        }

        const features = [
            { key: 'editHero', name: 'Hero Management' },
            { key: 'publishMeet', name: 'Meet Publishing' },
            { key: 'updateValidCars', name: 'Update Valid Cars List' },
            { key: 'manageGarage', name: 'Garage Operations' },
            { key: 'manageShowroom', name: 'Showroom Management' },
            { key: 'manageLaws', name: 'Crew Regulations' },
            { key: 'manageTimezones', name: 'Timezone Directory' },
            { key: 'managePreviousMeets', name: 'Previous Meets' },
            { key: 'manageMasterLibrary', name: 'Master Car Library Access' },
            { key: 'manageMemes', name: 'Manage Memes' },
            { key: 'memberLoginEnabled', name: 'Member Login' },
            { key: 'allowAdminCarArrange', name: 'Admin Arrange Garage Cars' },
            { key: 'hideGarageCars', name: 'Admin Hide Garage Cars' },
            { key: 'tournamentEntryEnabled', name: 'Tournament Participation' },
            { key: 'showTournamentNotification', name: 'Home Tournament Notification' }
        ];

        const enabledCount = features.filter((feature) => {
    const defaultValues = {
        memberLoginEnabled: false,
        allowAdminCarArrange: true,
        hideGarageCars: true,
        showTournamentVotes: false,
        tournamentEntryEnabled: true
    };

    return Object.prototype.hasOwnProperty.call(settings, feature.key)
        ? settings[feature.key]
        : (defaultValues[feature.key] !== undefined
            ? defaultValues[feature.key]
            : true);
}).length;

const disabledCount = features.length - enabledCount;

        return (
            <div className="min-h-screen bg-deep-black text-white relative selection:bg-neon-purple/50 pt-32 pb-32">
                <div className="max-w-4xl mx-auto px-6 md:px-12">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <span className="glassmorphism px-3 py-1 rounded-sm text-xs uppercase tracking-widest text-electric-blue border-neon-purple/30 mb-4 inline-flex items-center gap-2 hover:text-white hover:bg-electric-blue/50 hover:tracking-[0.2em] transition-all duration-500 shadow-[0_0_10px_rgba(176,38,255,0.2)]">
                            <Shield size={14} /> Super Admin Only
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white drop-shadow-lg">
                            Smart Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-electric-blue">Panel</span>
                        </h1>
                        <p className="text-white/60 max-w-xl mx-auto text-sm hover:text-white transition-all duration-500">
                            Toggle admin access to specific features across the crew system.
                        </p>
                        <div className="mt-8 flex justify-center">
                            <Link to="/controls" className="inline-flex items-center gap-2 px-6 py-3 bg-deep-black/5 border border-deep-black/10 hover:border-electric-blue rounded-lg transition-all text-sm font-bold uppercase tracking-wider text-electric-blue hover:text-white hover:bg-electric-blue/50 hover:tracking-[0.2em] transition-all duration-500">
                                Back to Controls
                            </Link>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 group">

    <div className="glass-panel p-6 text-center rounded-lg border border-neon-purple/25 group-hover:bg-neon-purple/50 transition-all duration-500">

        <p className="text-4xl font-black text-neon-purple group-hover:text-white transition-all duration-500">
            {features.length}
        </p>

        <p className="mt-2 text-xs uppercase tracking-[0.35em] text-neon-purple group-hover:text-white transition-all duration-500">
            Total Features
        </p>

    </div>

    <div className="glass-panel p-6 text-center rounded-lg border border-electric-blue/20 group-hover:bg-electric-blue/50 transition-all duration-500">

        <p className="text-4xl font-black text-electric-blue group-hover:text-white transition-all duration-500">
            {enabledCount}
        </p>

        <p className="mt-2 text-xs uppercase tracking-[0.35em] text-electric-blue group-hover:text-white transition-all duration-500">
            Enabled
        </p>

    </div>

    <div className="glass-panel p-6 text-center rounded-lg border border-neon-red/20 group-hover:bg-neon-red/50 transition-all duration-500">

        <p className="text-4xl font-black text-neon-red group-hover:text-white transition-all duration-500">
            {disabledCount}
        </p>

        <p className="mt-2 text-xs uppercase tracking-[0.35em] text-neon-red group-hover:text-white transition-all duration-500">
            Disabled
        </p>

    </div>

</div>

                    <div className="space-y-4">
                        {features.map((feature, i) => {
                            const defaultValues = { memberLoginEnabled: false, allowAdminCarArrange: true, hideGarageCars: true, showTournamentVotes: false, tournamentEntryEnabled: true, showTournamentNotification: true };
                            const isEnabled = Object.prototype.hasOwnProperty.call(settings, feature.key) 
                                ? settings[feature.key]
                                : (defaultValues[feature.key] !== undefined ? defaultValues[feature.key] : true);
                            return (
                                <motion.div 
                                    key={feature.key}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-panel p-6 rounded-xl border border-white/5 bg-charcoal/40 flex items-center justify-between group hover:border-electric-blue/30 transition-colors"
                                >
                                    <span className="text-lg font-bold font-heading uppercase tracking-wide text-white group-hover:text-electric-blue transition-colors">
                                        {feature.name}
                                    </span>
                                    
                                    <div className="flex items-center gap-4">

    <button
        onClick={() => handleToggle(feature.key)}
        className={`
            relative
            inline-flex
            h-10
            w-20
            items-center
            rounded-lg
            border
            transition-all
            duration-500
            focus:outline-none
            ${
                isEnabled
                    ? "bg-electric-blue/20 border-electric-blue shadow-[0_0_20px_rgba(0,240,255,.35)]"
                    : "bg-white/5 border-white/10"
            }
        `}
    >
        <span className="sr-only">
            Toggle {feature.name}
        </span>

        <span
            className={`
                flex
                items-center
                justify-center
                h-8
                w-8
                rounded-md
                bg-white
                shadow-lg
                transition-all
                duration-500
                ${
                    isEnabled
                        ? "translate-x-11"
                        : "translate-x-1"
                }
            `}
        >
            {isEnabled ? (
                <Check
                    size={13}
                    strokeWidth={3}
                    className="text-electric-blue"
                />
            ) : (
                <X
                    size={13}
                    strokeWidth={3}
                    className="text-deep-black"
                />
            )}
        </span>

    </button>

    <span
        className={`
            text-xs
            font-bold
            uppercase
            tracking-[0.3em]
            transition-all
            duration-300
            ${
                isEnabled
                    ? "text-electric-blue"
                    : "text-white/30"
            }
        `}
    >
        {isEnabled ? "ON" : "OFF"}
    </span>

</div>

                                    
                                </motion.div>
                            );
                        })}

                        
                    </div>
                </div>
            </div>
        );
    };

    export default SmartAdminPanel;