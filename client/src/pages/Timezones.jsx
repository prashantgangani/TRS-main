import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Globe2, Clock, Search } from 'lucide-react';
import { API_URL } from '../config';
import { logAdminAction } from '../utils/logger';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Timezones = ({ isAdmin, isSuperAdmin }) => {
    const [timezones, setTimezones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Form State for SuperAdmin
    const [region, setRegion] = useState('');
    const [time, setTime] = useState('');
    const [day, setDay] = useState('');
    const [offset, setOffset] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTimezones = async () => {
        try {
            const response = await fetch(`${API_URL}/timezones`);
            const data = await response.json();
            setTimezones(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch timezones:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTimezones();
    }, []);

    const handleAddTimezone = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/timezones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ region, time, day, offset })
            });
            if (response.ok) {
                await logAdminAction('Added Timezone', `Region: ${region}`);
                fetchTimezones();
                setRegion(''); setTime(''); setDay(''); setOffset('');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${API_URL}/timezones/${id}`, { method: 'DELETE' });
            const deletedTz = timezones.find(tz => tz._id === id);
            await logAdminAction('Deleted Timezone', `Region: ${deletedTz?.region}`);
            setTimezones(timezones.filter(tz => tz._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const filteredTimezones = timezones.filter(tz =>
        tz.region.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-deep-black text-white relative pt-32 pb-32">
            <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-electric-blue/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>
            
            <div className="max-w-6xl mx-auto px-6 md:px-12">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div
className="
flex
items-center
justify-center
gap-3

mb-6
"
>

    <div
    className="
    w-2
    h-2

    rounded-full

    bg-electric-blue

    animate-pulse
    "
    />

    <span
    className="
    text-[10px]

    uppercase

    tracking-[0.4em]

    text-electric-blue/50

    hover:text-electric-blue

    transition-all

    duration-500
    "
    >
        Global Dispatch Network
    </span>

</div>
                    <h1
className="
relative

text-4xl
md:text-6xl

font-black
font-heading

tracking-tight

mb-4

flex
items-center
justify-center
gap-4

text-white
"
>

    <Globe2
        className="
        text-electric-blue

        hidden
        sm:block

        drop-shadow-[0_0_20px_rgba(0,229,255,0.6)]

        animate-pulse
        "
        size={48}
    />

    <span
    className="
    relative

    bg-gradient-to-r
    from-white
    via-electric-blue
    to-white

    bg-clip-text

    text-transparent
    "
    >
        TRS Global Dispatch
    </span>

</h1>
                    <p className="text-white/50 max-w-2xl mx-auto text-sm md:text-base hover:text-white transition-all duration-500">
                        Our crew operates worldwide. Find the exact standard dispatch time for your region below so you never miss a lobby.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-5xl mx-auto group">

    <div className="glass-panel p-4 text-center group-hover:bg-charcoal/50 transition-all duration-500">
        <div className="text-2xl font-black text-electric-blue/50 group-hover:text-electric-blue transition-all duration-500">
            Global
        </div>
        <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-white transition-all duration-500">
            Coverage
        </div>
    </div>

    <div className="glass-panel p-4 text-center group-hover:bg-charcoal/50 transition-all duration-500">
        <div className="text-2xl font-black text-neon-purple/50 group-hover:text-neon-purple transition-all duration-500">
            24/7
        </div>
        <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-white transition-all duration-500">
            Operations
        </div>
    </div>

    <div className="glass-panel p-4 text-center group-hover:bg-charcoal/50 transition-all duration-500">
        <div className="text-2xl font-black text-neon-green/50 group-hover:text-neon-green transition-all duration-500">
            Live
        </div>
        <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-white transition-all duration-500">
            Dispatch
        </div>
    </div>

    <div className="glass-panel p-4 text-center group-hover:bg-charcoal/50 transition-all duration-500">
        <div className="text-2xl font-black text-[#FFD166]/50 group-hover:text-[#FFD166] transition-all duration-500">
            TRS
        </div>
        <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-white transition-all duration-500">
            Network
        </div>
    </div>

</div>
                </motion.div>

                <div className="mb-12 max-w-md mx-auto relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={20} className="text-white/40 group-focus-within:text-electric-blue transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search by region name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-electric-blue/50 focus:shadow-[0_0_25px_rgba(0,229,255,0.25)] focus:bg-black/60 transition-all shadow-inner"
                    />
                </div>

                {isAdmin && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel p-8 rounded-xl border-l-4 border-l-electric-blue mb-16 max-w-4xl mx-auto"
                    >
                         <h3 className="text-xl font-bold mb-6 font-heading text-white flex items-center gap-2">
                            <Plus size={20} className="text-electric-blue" /> Add Regional Timezone
                        </h3>
                        <form onSubmit={handleAddTimezone} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input required type="text" placeholder="Region (e.g. NA East, EU Central, IST)" value={region} onChange={e => setRegion(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-blue" />
                            <input required type="text" placeholder="Time (e.g. 10:00 PM)" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-blue" />
                            <input required type="text" placeholder="Day (e.g. Saturday)" value={day} onChange={e => setDay(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-blue" />
                            <input required type="text" placeholder="UTC Offset (e.g. UTC-5, UTC+5:30)" value={offset} onChange={e => setOffset(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-blue" />
                            
                            <button disabled={isSubmitting} type="submit" className="w-full md:col-span-2 py-4 mt-2 bg-electric-blue hover:bg-electric-blue/80 text-deep-black text-sm font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                                Register Timezone
                            </button>
                        </form>
                    </motion.div>
                )}

                {loading ? (
                    <div className="text-white/50 text-center py-20 tracking-widest uppercase">Syncing Clocks...</div>
                ) : (
                    <>
                        {filteredTimezones.length === 0 ? (
                            <div className="text-center py-12 text-white/50">
                                No timezones found matching "{searchQuery}"
                            </div>
                        ) : (
                            <motion.div 
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                <AnimatePresence>
                                    {filteredTimezones.map(tz => (
                                        <motion.div
    key={tz._id}
    variants={itemVariants}
    whileHover={{
        scale: 0.9,
        y: 4.5
    }}
    
    transition={{
    type: "spring",
    stiffness: 350,
    damping: 20
}}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="
bg-charcoal/40

border
rounded-2xl

p-6

relative
group

overflow-hidden

shadow-[0_10px_30px_rgba(0,0,0,0.25)]

transition-all
duration-100

border-electric-blue/10

hover:shadow-[
0_20px_40px_rgba(0,0,0,0.35),
inset_0_0_30px_rgba(255,255,255,0.03)
]

before:absolute
before:inset-0

before:bg-gradient-to-br
before:from-white/[0.02]
before:to-transparent

before:opacity-0

hover:before:opacity-100

before:transition-opacity
before:duration-500
"
                                >

                                        {/* Backplate */}
    <div
        className="
        absolute

        top-2
        left-2
        right-2
        bottom-0

        rounded-2xl

        bg-black/20

        blur-md

        opacity-0

        group-hover:opacity-100

        transition-all
        duration-500
        "
    />

                                        <div
        className="
        absolute

        top-0
        left-0

        w-full
        h-32

        bg-gradient-to-b
        from-white/[0.06]
        to-transparent

        opacity-0

        group-hover:opacity-100

        transition-opacity
        duration-500

        pointer-events-none
        "
    />

                                    <div
className="
absolute
inset-0

rounded-2xl

bg-gradient-to-br
from-electric-blue/[0.03]
to-transparent

opacity-0

group-hover:opacity-100

transition-all
duration-500
"
/>
    {/* Future Mouse Glow Layer */}
    <div
        className="
        absolute
        inset-0

        opacity-0

        group-hover:opacity-100

        transition-opacity
        duration-300

        pointer-events-none
        "
    />

                                    <div
className="
flex
justify-between
items-start

mb-6

relative
z-10

transition-all
duration-500

group-hover:-translate-y-2
"
>
                                        <div>
                                            <h3 className="
text-2xl

font-bold
font-heading

text-white/80

mb-1

group-hover:text-electric-blue
transition-all
duration-500

drop-shadow-[0_0_0px_rgba(0,229,255,0)]
"
>{tz.region}</h3>
                                            <p className="text-xs uppercase tracking-widest text-electric-blue/50 font-semibold group-hover:text-electric-blue transition-all duration-300">{tz.offset}</p>
                                        </div>
                                        {isAdmin && (
                                            <button 
                                                onClick={() => handleDelete(tz._id)}
                                                className="
p-2

rounded-full

bg-white/5

hover:bg-neon-red/20
hover:text-neon-red

text-white/40

transition-all

z-10
"
                                                title="Delete Timezone"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="
flex
items-center
gap-4

bg-black/50

rounded-xl

p-4

border
border-white/5

transition-all
duration-300
group-hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]
group-hover:bg-black/70
"
>
                                        <Clock
    className="

    flex-shrink-0

    text-electric-blue/25

    group-hover:text-electric-blue/75 
    transition-all 
    duration-500
    "
    size={24}
/>
                                        <div>
                                            <div className="text-white/30 font-bold tracking-wider group-hover:text-white/80 transition-all duration-500">{tz.time}</div>
                                            <div className="text-white/50 text-sm uppercase tracking-wider group-hover:text-white    transition-all duration-500">{tz.day}</div>
                                        </div>
                                    </div>
                                    
                                    {/* Bottom aesthetic line */}
                                    <div className="
absolute

bottom-0
left-0

w-full
h-1

bg-gradient-to-r
from-electric-blue/0
via-electric-blue
to-electric-blue/0

opacity-0

group-hover:opacity-100

transition-all
duration-500

group-hover:shadow-[0_0_20px_rgba(0,229,255,0.8)]
"></div>
                                </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Timezones;
