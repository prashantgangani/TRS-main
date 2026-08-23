import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ShieldAlert } from 'lucide-react';
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

const Laws = ({ isAdmin, isSuperAdmin }) => {
    const [laws, setLaws] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State for SuperAdmin
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchLaws = async () => {
        try {
            const response = await fetch(`${API_URL}/laws`);
            const data = await response.json();
            setLaws(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch laws:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLaws();
    }, []);

    const handleAddLaw = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/laws`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, category, order: laws.length })
            });
            if (response.ok) {
                await logAdminAction('Added Law', `Title: ${title} | Category: ${category}`);
                fetchLaws();
                setTitle(''); setDescription('');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
    if (!window.confirm("Delete this protocol permanently?")) return;

    try {
        const deletedLaw = laws.find((law) => law._id === id);

        const response = await fetch(`${API_URL}/laws/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete protocol.");
        }

        await logAdminAction(
            "Deleted Law",
            `Title: ${deletedLaw?.title} | Category: ${deletedLaw?.category}`
        );

        // Remove from UI immediately
        setLaws((prev) => prev.filter((law) => law._id !== id));

    } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete protocol.");
    }
};

    return (
        <div className="min-h-screen bg-deep-black text-white relative pt-32 pb-32 overflow-x-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-red/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
            <div
className="
absolute
top-1/2
left-1/2

-translate-x-1/2
-translate-y-1/2

text-[10rem] md:text-[14rem]

font-black
font-heading

text-neon-red/5

pointer-events-none
select-none

z-0
"
>
LAWBOOK
</div>
            <div className="max-w-5xl mx-auto px-6 md:px-12">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="glassmorphism px-3 py-1 rounded-sm text-xs uppercase tracking-widest text-neon-red border-neon-red/30 mb-4 hover:text-white hover:bg-neon-red/50 transition-all duration-500 hover:tracking-[0.2em] inline-block shadow-[0_0_10px_rgba(255,51,102,0.2)]">
                        Crew Protocol
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight mb-4 flex items-center justify-center gap-4 text-glow group hover:text-neon-red transition-all duration-500">
                        <ShieldAlert className="text-neon-red hidden sm:block group-hover:text-white transition-all duration-500" size={48} /> The Laws
                    </h1>
                    <p className="text-white/50 max-w-2xl mx-auto text-sm md:text-base hover:text-white transition-all duration-500">
                        Violating crew protocols will result in immediate termination or blacklisting from all Los Santos meets. Read carefully.
                    </p>
                    <div
className="
glass-panel

border
border-neon-red/20

mt-8

p-4

text-center

group
"
>
<span className="text-neon-red/50 font-bold group-hover:text-neon-red transition-all duration-500">
⚠ Crew Enforcement Active
</span>

<p className="text-white/50 text-xs mt-2 group-hover:text-white transition-all duration-500">
Repeated violations may result in strikes,
temporary suspension or permanent removal.
</p>
</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 group">

    <div className="glass-panel p-4 text-center">
        <div className="text-2xl font-black text-neon-red group-hover:text-white transition-all duration-500">
            {laws.length}
        </div>
        <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-neon-red transition-all duration-500">
            Protocols
        </div>
    </div>

    <div className="glass-panel p-4 text-center">
        <div className="text-2xl font-black text-electric-blue group-hover:text-white transition-all duration-500">
            Active
        </div>
        <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-electric-blue transition-all duration-500">
            Status
        </div>
    </div>

    <div className="glass-panel p-4 text-center">
        <div className="text-2xl font-black text-yellow-400 group-hover:text-white transition-all duration-500">
            TRS
        </div>
        <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-yellow-400 transition-all duration-500">
            Standards
        </div>
    </div>

    <div className="glass-panel p-4 text-center">
        <div className="text-2xl font-black text-neon-green group-hover:text-white transition-all duration-500">
            Crew
        </div>
        <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-neon-green transition-all duration-500">
            Integrity
        </div>
    </div>

</div>
<div
className="
glass-panel

mt-6

flex
items-center
justify-center

gap-4

p-4

border
border-neon-red/20

overflow-hidden

relative

group
"
>

    <div
    className="
    absolute
    inset-0

    bg-gradient-to-r
    from-transparent
    via-neon-red/5
    to-transparent

    animate-shimmer
    pointer-events-none
    "
    />

    <div className="relative">
        <div
        className="
        w-2.5
        h-2.5

        rounded-full

        bg-green-400

        group-hover:bg-neon-red transition-all duration-500
        "
        />

        <div
        className="
        absolute
        inset-0

        rounded-full

        bg-green-400

        animate-ping

        group-hover:bg-neon-red transition-all duration-500
        "
        />
    </div>

<div className="flex flex-wrap items-center justify-center gap-4 ">
    <span className="text-[11px] uppercase tracking-[0.35em] text-white/60 font-bold group-hover:text-neon-red transition-all duration-500">
        TRS PROTOCOL DATABASE : ACTIVE
    </span>

    <span className="text-[11px] uppercase tracking-[0.35em] text-neon-red font-bold group-hover:text-white transition-all duration-500">
        ENFORCEMENT READY
    </span>
</div>

</div>
                </motion.div>

                {isAdmin && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel p-8 rounded-xl border-l-4 border-l-neon-red mb-16"
                    >
                         <h3 className="text-xl font-bold mb-6 font-heading text-white flex items-center gap-2">
                            <Plus size={20} className="text-neon-red" /> Establish New Protocol
                        </h3>
                        <form onSubmit={handleAddLaw} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required type="text" placeholder="Protocol Title (e.g. No Weaponized Vehicles)" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-red" />
                                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:bg-deep-black focus:border-neon-red">
                                    <option value="General">General 📜</option>
                                    <option value="Meets">Meets 🚗</option>
                                    <option value="Conduct">Conduct 🤝</option>
                                    <option value="Bans">Bans ⛔</option>
                                </select>
                            </div>
                            <textarea required placeholder="Detailed Description of the Rule..." value={description} onChange={e => setDescription(e.target.value)} rows="3" className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-red resize-none"></textarea>
                            <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-neon-red hover:bg-neon-red/80 text-white text-sm font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(255,51,102,0.4)]">
                                Encode Law
                            </button>
                        </form>
                    </motion.div>
                )}
                {loading ? (
                    <div className="text-white/50 text-center py-20 tracking-widest uppercase">Accessing Database...</div>
                ) : (
                    
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        <AnimatePresence>
                            {laws.map((law, index) => (
                                <motion.div 
                                    key={law._id}
                                    variants={itemVariants}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="
bg-charcoal/40
border border-white/10
rounded-2xl
p-6 md:p-8
relative
group

hover:bg-neon-red/5
hover:border-neon-red/20
hover:-translate-y-1

transition-all
duration-300
"
                                >
                                    <div
className="
absolute
inset-0

bg-gradient-to-r
from-transparent
via-white/10
to-transparent

-translate-x-full

group-hover:animate-shimmer

pointer-events-none

rounded-2xl
"
/>

{isAdmin && (
    <button
        type="button"
        onClick={() => handleDelete(law._id)}
        title="Delete Protocol"
        className="
            absolute
            top-5
            right-5

            z-20

            group/delete

            flex
            items-center
            justify-center

            h-10
            w-10

            rounded-full

            border
            border-white/10

            bg-black/40
            backdrop-blur-md

            text-white/40

            hover:bg-red-500/15
            hover:border-red-500/40
            hover:text-red-400

            hover:scale-110
            active:scale-95

            transition-all
            duration-300
        "
    >

        <Trash2
    size={17}
    className="
        group-hover/delete:rotate-12
        transition-transform
        duration-300
    "
/>

<span
    className="
        absolute

        right-12

        opacity-0

        group-hover/delete:opacity-100

        group-hover/delete:translate-x-0

        translate-x-2

        transition-all
        duration-300

        whitespace-nowrap

        rounded-full

        bg-red-500

        px-3
        py-1

        text-[10px]

        font-bold

        uppercase

        tracking-[0.25em]

        text-white

        pointer-events-none
    "
>
    Delete
</span>

    </button>
)}
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 group">
                                        <div className="flex items-start gap-6">
                                            <div
className="
w-28
shrink-0

flex
flex-col
items-center
justify-center

rounded-xl

border
border-white/10

bg-white/[0.02]

py-5

transition-all
duration-500

group-hover:border-neon-red/30
group-hover:bg-neon-red/5
"
>

    <span
        className="
        text-[10px]

        uppercase

        tracking-[0.35em]

        text-white/30

        group-hover:text-neon-red/80
        "
    >
        Protocol
    </span>

    <span
        className="
        mt-2

        text-4xl

        font-black

        font-heading

        text-neon-red/70

        group-hover:text-neon-red

        transition-colors
        duration-500
        "
    >
        #{String(index + 1).padStart(3,"0")}
    </span>

</div>
                                            <div className="pr-16">
                                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                                    <h3 className="text-xl md:text-2xl font-bold font-heading text-white group-hover:text-neon-red transition-all duration-500">{law.title}</h3>
                                                    <span className="
text-[10px]
uppercase
tracking-widest
px-3 py-1
rounded-full

bg-white/5
border border-white/10

text-white/60

group-hover:bg-neon-red 

group-hover:text-white
group-hover:font-bold
group-hover:tracking-[0.2em]
transition-all
duration-500
">{law.category}</span>
                                                </div>
                                                <p className="text-white/70

text-sm
md:text-base

leading-8

whitespace-pre-wrap group-hover:text-white transition-all duration-500">
                                                    {law.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-red opacity-0 group-hover:opacity-100 transition-opacity rounded-l-lg"></div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {laws.length === 0 && !loading && (
                            <div className="text-white/50 text-center py-20 tracking-widest uppercase">No protocols found. Complete Anarchy.</div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Laws;
