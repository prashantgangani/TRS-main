import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Settings, Key, FileText, Lock, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const Controls = () => {
    const options = [
        {
    title: 'Smart Admin Panel',
    description: 'Toggle admin access down to granular features.',
    icon: <Settings size={28} className="text-neon-purple" />,
    link: '/smart-admin',

    colorClass: 'group-hover:text-neon-purple',
    borderClass: 'hover:border-neon-purple/30',
    bgClass: 'hover:bg-neon-purple/50',
    glowClass: 'hover:shadow-[0_0_40px_rgba(176,38,255,0.15)]'
},
        {
            title: 'Credential Management',
            description: 'Generate, manage, and revoke administrator access.',
            icon: <Settings size={28} className="text-neon-red" />,
            link: '/staff-credentials',
            colorClass: 'group-hover:text-neon-red',
borderClass: 'hover:border-neon-red/30',
bgClass: 'hover:bg-neon-red/50',
glowClass: 'hover:shadow-[0_0_40px_rgba(255,51,102,0.15)]'
        },
        {
            title: 'Password Manager',
            description: 'Manage secure passwords for crew systems.',
            icon: <Settings size={28} className="text-electric-blue" />,
            link: '/password-manager',
            colorClass: 'group-hover:text-electric-blue',
borderClass: 'hover:border-electric-blue/30',
bgClass: 'hover:bg-electric-blue/50',
glowClass: 'hover:shadow-[0_0_40px_rgba(0,229,255,0.15)]'
        },
        {
    title: 'Crew Members',
    description: 'Manage member logins, passwords, garage limits and network status.',
    icon: <Settings size={28} className="text-green-400" />,
    link: '/manage-crew-members',
    colorClass: 'group-hover:text-green-400',
borderClass: 'hover:border-green-400/30',
bgClass: 'hover:bg-green-400/50',
glowClass: 'hover:shadow-[0_0_40px_rgba(74,222,128,0.15)]'
},
        {
            title: 'Voting System',
            description: 'Review tournament participants, vote totals, and voter accounts.',
            icon: <Trophy size={28} className="text-[#FFD166]" />,
            link: '/voting-system',
            colorClass: 'group-hover:text-[#FFD166]',
            borderClass: 'hover:border-[#FFD166]/30',
            bgClass: 'hover:bg-[#FFD166]/50',
            glowClass: 'hover:shadow-[0_0_40px_rgba(255,209,102,0.15)]'
        },
        {
            title: 'System Logs',
            description: 'Review crew access and activity logs.',
            icon: <Settings size={28} className="text-[#FFD700]" />,
            link: '/logs',
            colorClass: 'group-hover:text-[#FFD700]',
borderClass: 'hover:border-[#FFD700]/30',
bgClass: 'hover:bg-[#FFD700]/50',
glowClass: 'hover:shadow-[0_0_40px_rgba(255,215,0,0.15)]'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-deep-black text-white relative selection:bg-neon-purple/50 pt-32 pb-32">
            <div className="max-w-6xl mx-auto px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="px-3 py-1 rounded-sm text-xs uppercase tracking-widest text-[#FF00FF] border-[#FF00FF]/30 mb-4 inline-flex items-center hover:text-white hover:bg-[#FF00FF]/50 hover:tracking-[0.2em] transition-all duration-500 gap-2 shadow-[0_0_10px_rgba(255,0,255,0.2)]">
                        <Shield size={14} /> Master Terminal
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white drop-shadow-lg">
                        TRS <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-[#FF00FF]">Command Center</span>
                    </h1>
                    <p className="text-white/50 max-w-xl mx-auto text-sm hover:text-white transition-all duration-300">
                        Manage crew systems, staff access, security controls, and operational settings from a single command center.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 group">

    <div className="glass-panel p-4 text-center bg-charcoal/50 group-hover:bg-deep-black transition-all duration-500">
        <div className="text-2xl font-black text-[#FFD166]/50 group-hover:text-[#FFD166] transition-all duration-500 ">
            4
        </div>
        <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-white transition-all duration-500">
            Systems
        </div>
    </div>

    <div className="glass-panel p-4 text-center bg-charcoal/50 group-hover:bg-deep-black transition-all duration-500">
        <div className="text-2xl font-black text-electric-blue/50 group-hover:text-electric-blue transition-all duration-500">
            Live
        </div>
        <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-white transition-all duration-500">
            Status
        </div>
    </div>

    <div className="glass-panel p-4 text-center bg-charcoal/50 group-hover:bg-deep-black transition-all duration-500">
        <div className="text-2xl font-black text-neon-purple/50 group-hover:text-neon-purple transition-all duration-500">
            TRS
        </div>
        <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-white transition-all duration-500">
            Crew
        </div>
    </div>

    <div className="glass-panel p-4 text-center bg-charcoal/50 group-hover:bg-deep-black transition-all duration-500">
        <div className="text-2xl font-black text-neon-green/50 group-hover:text-neon-green transition-all duration-500">
            Secure
        </div>
        <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-white transition-all duration-500">
            Access
        </div>
    </div>

</div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {options.map((opt, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Link 
                                to={opt.link}
                                className={`
block h-full
glass-panel
p-8
rounded-2xl
border border-white/10
bg-charcoal/40
group
relative
overflow-hidden

hover:-translate-y-2
transition-all
duration-300

${opt.borderClass}
${opt.bgClass}
${opt.glowClass}
`}
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-${opt.color}/10 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500`}></div>
                                
                                <div className="mb-6 relative z-10 glassmorphism w-14 h-14 rounded-lg flex items-center justify-center border-white/10 group-hover:scale-110 transition-transform duration-300">
                                    {opt.icon}
                                </div>
                                <h3
className={`
text-xl
font-bold
font-heading
uppercase
tracking-wide
text-white
transition-colors
mb-3
${opt.colorClass}
`}
>
                                    {opt.title}
                                </h3>
                                <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                                    {opt.description}
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </div>
    );
};

export default Controls;