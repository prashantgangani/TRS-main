import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { API_URL } from '../config';
import { logAdminAction } from '../utils/logger';
import LazyImage from '../components/LazyImage';

const Showroom = ({ isAdmin }) => {
    const [showroomCars, setShowroomCars] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [meetTheme, setMeetTheme] = useState('');
    const [carName, setCarName] = useState('');
    const [carOwner, setCarOwner] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [featuredDate, setFeaturedDate] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Limit visible default to save bandwidth
    const [visibleCount, setVisibleCount] = useState(10);

    // Fetch Cars from Backend
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch(`${API_URL}/cars`);
                const data = await response.json();
                setShowroomCars(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch cars:", error);
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    const handleAddOrUpdateCar = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                meetTheme,
                carName,
                carOwner,
                description,
                image: image || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1920&q=80&auto=format&fit=crop'
            };

            if (editingId) {
                const response = await fetch(`${API_URL}/cars/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const updatedCar = await response.json();
                await logAdminAction('Updated Featured Build', `Car: ${updatedCar.carName} | Owner: ${updatedCar.carOwner}`);
                setShowroomCars(showroomCars.map(c => c._id === editingId ? updatedCar : c));
                setEditingId(null);
            } else {
                const response = await fetch(`${API_URL}/cars`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const newCar = await response.json();
                await logAdminAction('Featured Build in Showroom', `Car: ${newCar.carName} | Owner: ${newCar.carOwner}`);
                setShowroomCars([newCar, ...showroomCars]);
            }

            // Reset form
            setMeetTheme(''); setCarName(''); setCarOwner(''); setDescription(''); setImage('');
        } catch (error) {
            console.error("Error saving car:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (car) => {
        setEditingId(car._id);
        setMeetTheme(car.meetTheme);
        setCarName(car.carName);
        setCarOwner(car.carOwner);
        setDescription(car.description);
        setImage(car.image);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this car?")) return;
        try {
            const response = await fetch(`${API_URL}/cars/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                const deletedCar = showroomCars.find(c => c._id === id);
                await logAdminAction('Deleted Featured Build', `Removed: ${deletedCar?.carName} | Owner: ${deletedCar?.carOwner}`);
                setShowroomCars(showroomCars.filter(c => c._id !== id));
            }
        } catch (error) {
            console.error("Error deleting car:", error);
        }
    };

    return (
        <div className="min-h-screen bg-deep-black text-white relative selection:bg-neon-purple/50 pt-32 pb-32">
            {/* Background Details */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-electric-blue/5 to-transparent pointer-events-none -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="
absolute
top-0
left-0
right-0

h-[500px]

bg-[url('/showroom-bg.jpg')]
bg-cover
bg-center

opacity-[0.08]

pointer-events-none
" />
{/* ================= HERO ================= */}

<section className="relative overflow-hidden text-center py-24 md:py-32">

    {/* Huge Background Logo */}

    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">

        <h1 className="
            text-[7rem]
            md:text-[13rem]
            lg:text-[16rem]
            font-black
            font-heading
            uppercase
            tracking-[0.25em]
            text-white/[0.025]
        ">
            TRS
        </h1>

    </div>

    {/* Glow */}

    <div className="
        absolute
        left-1/2
        top-1/2
        -translate-x-1/2
        -translate-y-1/2

        w-[700px]
        h-[700px]

        rounded-full

        bg-electric-blue/10

        blur-[180px]

        pointer-events-none
    " />

    <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-5xl mx-auto"
    >

        <span className="
            inline-flex
            items-center

            rounded-full

            border

            border-[#FFD700]/30

            bg-[#FFD700]/10

            px-5

            py-2

            uppercase

            tracking-[0.3em]

            text-[11px]

            font-bold

            text-[#FFD700]
        ">

            THE ROYAL SORCERERS • HALL OF FAME

        </span>

        <h1 className="
            mt-8

            text-5xl

            md:text-7xl

            lg:text-8xl

            font-black

            font-heading

            uppercase

            leading-none

            text-transparent

            bg-clip-text

            bg-gradient-to-r

            from-[#FFD700]

            via-white

            to-electric-blue
        ">

            HALL OF FAME

        </h1>

        <p className="
            mt-8

            max-w-3xl

            mx-auto

            text-white/60

            text-base

            md:text-lg

            leading-8
        ">

            The highest honor within The Royal Sorcerers.

            Every machine displayed here earned its place through
            craftsmanship, originality, presentation and community recognition.

        </p>

    </motion.div>

</section>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">

<motion.div
    whileHover={{ y: -5, scale: 1.03 }}
    className="group glass-panel relative overflow-hidden p-6 text-center"
>

    {/* Animated Background */}

    <div
        className="
            absolute
            inset-x-0
            top-0

            h-[2px]

            bg-gradient-to-b

            from-electric-blue

            to-electric-blue/0

            transition-all

            duration-700

            ease-out

            group-hover:h-full

            group-hover:opacity-15
        "
    />

    {/* Content */}

    <div className="relative z-10">

        <div className="text-3xl font-black text-electric-blue font-heading group-hover:text-white transition-all duration-500">
            {showroomCars.length}
        </div>

        <div className="mt-2 text-xs uppercase tracking-[0.25em] text-white/50 group-hover:text-electric-blue transition-all duration-500">
            Featured Builds
        </div>

    </div>

</motion.div>

<motion.div
    whileHover={{ y: -5, scale: 1.03 }}
    className="group glass-panel relative overflow-hidden p-6 text-center"
>

    {/* Animated Background */}

    <div
        className="
            absolute
            inset-x-0
            top-0

            h-[2px]

            bg-gradient-to-b

            from-neon-purple

            to-neon-purple/0

            transition-all

            duration-700

            ease-out

            group-hover:h-full

            group-hover:opacity-15
        "
    />

    {/* Content */}

    <div className="relative z-10">

        <div className="text-3xl font-black text-neon-purple font-heading group-hover:text-white transition-all duration-500">
            TRS
        </div>

        <div className="mt-2 text-xs uppercase tracking-[0.25em] text-white/50 group-hover:text-neon-purple transition-all duration-500">
            Hall Of Fame
        </div>

    </div>

</motion.div>

<motion.div
    whileHover={{ y: -5, scale: 1.03 }}
    className="group glass-panel relative overflow-hidden p-6 text-center"
>

    {/* Animated Background */}

    <div
        className="
            absolute
            inset-x-0
            top-0

            h-[2px]

            bg-gradient-to-b

            from-oracle-gold

            to-oracle-gold/0

            transition-all

            duration-700

            ease-out

            group-hover:h-full

            group-hover:opacity-15
        "
    />

    {/* Content */}

    <div className="relative z-10">

        <div className="text-3xl font-black text-oracle-gold font-heading group-hover:text-white transition-all duration-500">
            Elite
        </div>

        <div className="mt-2 text-xs uppercase tracking-[0.25em] text-white/50 group-hover:text-oracle-gold transition-all duration-500">
            Selection
        </div>

    </div>

</motion.div>

<motion.div
    whileHover={{ y: -5, scale: 1.03 }}
    className="group glass-panel relative overflow-hidden p-6 text-center"
>

    {/* Animated Background */}

    <div
        className="
            absolute
            inset-x-0
            top-0

            h-[2px]

            bg-gradient-to-b

            from-neon-green

            to-neon-green/0

            transition-all

            duration-700

            ease-out

            group-hover:h-full

            group-hover:opacity-15
        "
    />

    {/* Content */}

    <div className="relative z-10">

        <div className="text-3xl font-black text-neon-green font-heading group-hover:text-white transition-all duration-500">
            {showroomCars.length}
        </div>

        <div className="mt-2 text-xs uppercase tracking-[0.25em] text-white/50 group-hover:text-neon-green transition-all duration-500">
            Featured Builds
        </div>

    </div>

</motion.div>

</div>

                {/* Cards List */}
                <div className="space-y-20">
                    {/* ADMIN ONLY: ADD NEW SHOWROOM CAR FORM */}
                    {isAdmin && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="
group

relative

overflow-hidden

glass-panel

max-w-5xl

mx-auto

rounded-3xl

border

border-white/10

bg-gradient-to-br

from-[#0d0d0d]

via-[#090909]

to-black

p-10

md:p-14
"
                        >
                            {/* Animated Accent */}

<div
className="
absolute

top-0
left-0

h-1

w-full

bg-gradient-to-r

from-electric-blue

via-neon-purple

to-electric-blue
"/>
                            <div className="mb-10">

    <p className="
    uppercase
    tracking-[0.35em]
    text-electric-blue
    text-[11px]
    font-bold
    ">

        Showroom Operations

    </p>

    <h2 className="
    mt-4

    text-4xl

    md:text-5xl

    font-heading

    font-black
    ">

        {editingId
            ? "Update Hall of Fame Build"
            : "Feature New Champion"}

    </h2>

    <p className="
    mt-4

    text-white/50

    max-w-2xl
    ">

        Showcase vehicles that deserve a permanent place inside
        the TRS Hall of Fame.

    </p>

</div>
                            <form onSubmit={handleAddOrUpdateCar} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input required type="text" placeholder="Meet Theme (e.g. Neon Nights)" value={meetTheme} onChange={e => setMeetTheme(e.target.value)} className="w-full

rounded-xl

border

border-white/10

bg-white/[0.03]

px-5

py-4

text-white

placeholder:text-white/20

transition-all

duration-300

focus:border-electric-blue

focus:bg-electric-blue/5

focus:outline-none" />
                                    <input required type="text" placeholder="Car Name (e.g. Annis Remus)" value={carName} onChange={e => setCarName(e.target.value)} className="w-full

rounded-xl

border

border-white/10

bg-white/[0.03]

px-5

py-4

text-white

placeholder:text-white/20

transition-all

duration-300

focus:border-electric-blue

focus:bg-electric-blue/5

focus:outline-none" />
                                </div>
                                <input required type="text" placeholder="Car Owner/Builder" value={carOwner} onChange={e => setCarOwner(e.target.value)} className="w-full

rounded-xl

border

border-white/10

bg-white/[0.03]

px-5

py-4

text-white

placeholder:text-white/20

transition-all

duration-300

focus:border-electric-blue

focus:bg-electric-blue/5

focus:outline-none" />
                                <input type="text" placeholder="Image Name/Path (e.g. /images/car1.jpg)" value={image} onChange={e => setImage(e.target.value)} className="w-full

rounded-xl

border

border-white/10

bg-white/[0.03]

px-5

py-4

text-white

placeholder:text-white/20

transition-all

duration-300

focus:border-electric-blue

focus:bg-electric-blue/5

focus:outline-none" />
                                <input
type="text"
placeholder="Featured Date (e.g. May 2026)"
value={featuredDate}
onChange={(e) => setFeaturedDate(e.target.value)}
className="w-full

rounded-xl

border

border-white/10

bg-white/[0.03]

px-5

py-4

text-white

placeholder:text-white/20

transition-all

duration-300

focus:border-electric-blue

focus:bg-electric-blue/5

focus:outline-none"
/>
                                <textarea required placeholder="Machine Details & Lore" value={description} onChange={e => setDescription(e.target.value)} rows="6" className="w-full

rounded-xl

border

border-white/10

bg-white/[0.03]

px-5

py-4

text-white

placeholder:text-white/20

transition-all

duration-300

focus:border-electric-blue

focus:bg-electric-blue/5

focus:outline-none"></textarea>

                                <div className="flex gap-4 mt-8">

<button

className="
flex-1

rounded-xl

bg-gradient-to-r

from-electric-blue

to-neon-purple

py-5

font-bold

uppercase

tracking-[0.3em]

transition-all

hover:scale-[1.01]

hover:shadow-[0_0_35px_rgba(0,229,255,.3)]
"
>

{editingId
? "Update Hall Of Fame Build"
: "Publish To Hall Of Fame"}

</button>

{editingId && (

<button

className="
px-8

rounded-xl

font-bold

border

text-neon-red

border-neon-red/20

hover:border-neon-red/50

hover:bg-neon-red

hover:text-white

transition-all

duration-500
"
>

Cancel

</button>

)}

</div>
                                
                            </form>
                        </motion.div>
                    )}

                    {loading ? (
                        <div className="text-white/50 text-center py-20 tracking-widest uppercase text-lg">Loading TRS Archives...</div>
                    ) : showroomCars.length === 0 ? (
                        <div className="text-white/50 text-center py-20 tracking-widest uppercase">No builds have entered the Hall Of Fame yet.</div>
                    ) : (
                        <>
                            {showroomCars.slice(0, visibleCount).map((car, index) => (
                                <motion.div
                                    key={car._id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8 }}
                                    className={`group
flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} bg-charcoal/40 border border-white/5 hover:-translate-y-4

hover:scale-[1.01]
hover:border-electric-blue/20
hover:shadow-[0_0_50px_rgba(0,229,255,0.08)]
transition-all
duration-500 rounded-xl overflow-hidden shadow-2xl group`}
                                >
                                    {/* Animated Border */}

<div
    className="
        absolute
        inset-0

        rounded-xl

        opacity-0

        group-hover:opacity-100

        transition-opacity

        duration-700

        pointer-events-none
    "
>

    <div
        className="
            absolute
            inset-0

            rounded-xl

            border

            border-electric-blue/40

            shadow-[0_0_40px_rgba(0,229,255,.25)]
        "
    />

</div>
                                    {/* Image Section */}
                                    <div className="w-full lg:w-[55%] h-[300px] sm:h-[400px] lg:h-auto min-h-[400px] relative overflow-hidden">
                                        <LazyImage
                                            src={car.image}
                                            variant="detail" // Since it's huge, 800-1000 width
                                            alt={car.carName}
                                            className="group-hover:scale-110 group-hover:brightness-110 group-hover:saturate-125 transition-all duration-700 filter saturate-50 group-hover:saturate-100"
                                        />
                                        <div className="absolute inset-0 pointer-events-none overflow-hidden">

    <div className="
        absolute
        top-12
        right-10

        w-2
        h-2

        rounded-full

        bg-electric-blue

        opacity-0

        group-hover:opacity-80

        transition-all

        duration-700

        animate-pulse
    "/>

    <div className="
        absolute
        bottom-24
        left-10

        w-1.5
        h-1.5

        rounded-full

        bg-white

        opacity-0

        group-hover:opacity-70

        transition-all

        duration-1000

        delay-300
    "/>

</div>

                                        <div
className="
absolute

inset-y-0

-left-1/2

w-1/3

rotate-12

bg-gradient-to-r

from-transparent

via-white/25

to-transparent

blur-xl

opacity-0

group-hover:opacity-100

group-hover:left-[130%]

transition-all

duration-1000

pointer-events-none
"
/>  
                                        {isAdmin && (
                                            <div className="absolute top-4 right-4 z-20 flex gap-2">
                                                <button onClick={() => handleEdit(car)} className="p-2 bg-black/10 hover:bg-electric-blue/60 text-electric-blue rounded-full hover:text-white transition-colors backdrop-blur-md">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(car._id)} className="p-2 bg-black/10 hover:bg-neon-red/60 text-neon-red rounded-full hover:text-white transition-colors backdrop-blur-md">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                        <div className="absolute top-8 left-8 z-20">

    <p className="
        text-[10px]
        uppercase
        tracking-[0.35em]
        text-white/30
    ">
        Hall Of Fame
    </p>

    <h2 className="
        mt-1
        text-5xl
        font-heading
        font-black
        text-white/15
    ">
        #{String(index + 1).padStart(3,"0")}
    </h2>

</div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-deep-black/60 via-transparent to-transparent"></div>
                                        <div
    className="
        absolute

        inset-0

        bg-electric-blue/5

        opacity-0

        group-hover:opacity-100

        transition-all

        duration-700
    "
/>
                                        <div className="absolute inset-0 bg-neon-purple/5 mix-blend-overlay"></div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="w-full lg:w-[45%] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative bg-charcoal/60 backdrop-blur-md">
                                        <div className="absolute -inset-10 bg-electric-blue/5 blur-[100px] rounded-full pointer-events-none -z-10 group-hover:bg-electric-blue/10 transition-colors duration-500"></div>

                                        <div className="mb-6">
                                            <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-[0.2em] font-semibold mb-3">Meet Theme</p>
                                            <div className="px-3 py-1.5 border border-neon-purple/50 bg-neon-purple/10 rounded-sm inline-block">
                                                <span className="text-neon-purple font-bold tracking-widest uppercase text-[10px] sm:text-xs drop-shadow-[0_0_5px_rgba(176,38,255,0.6)]">{car.meetTheme}</span>
                                            </div>
                                        </div>
                                        <div className="
inline-flex

items-center

gap-2

px-4

py-2

rounded-full

bg-[#FFD700]/10

border

border-[#FFD700]/30
">

<div className="
w-2
h-2

rounded-full

bg-[#FFD700]

animate-pulse
"/>

<span className="
text-[#FFD700]

uppercase

tracking-[0.3em]

text-[10px]

font-bold
">

Hall Of Fame

</span>

</div>
                                        <h2 className="
text-3xl
sm:text-4xl
lg:text-5xl
font-black
font-heading
tracking-tight
mb-6

group-hover:text-electric-blue

group-hover:tracking-wide

group-hover:translate-x-2

group-hover:drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]

transition-all
duration-500
">
                                            {car.carName}
                                        </h2>

                                        <div className="flex gap-12 mb-10 relative
pb-8">
    <div
    className="
        absolute

        bottom-0
        left-0

        h-px

        w-16

        bg-electric-blue

        group-hover:w-full

        transition-all

        duration-700
    "
/>

    <div>

        <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
            Builder
        </p>

        <p className="mt-2 text-lg font-bold">
            {car.carOwner}
        </p>

    </div>

    <div>

        <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
            Featured
        </p>

        <p className="mt-2 text-lg">
            {car.featuredDate || "TRS Archive"}
        </p>

    </div>

</div>

                                        <div>
                                            <p className="text-[10px] text-electric-blue uppercase tracking-widest mb-3 font-bold border-l-2 border-electric-blue pl-2">Build Notes</p>
                                            <p
    className="
        text-white/70

        text-[15px]

        leading-8

        italic

        font-light
    "
>
                                                {car.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {showroomCars.length > visibleCount && (
                                <div className="mt-12 flex justify-center w-full">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const currentScrollY = window.scrollY;
                                            setVisibleCount(prev => prev + 10);
                                            setTimeout(() => {
                                                window.scrollTo({
                                                    top: currentScrollY,
                                                    behavior: "instant"
                                                });
                                            }, 5);
                                        }}
                                        className="px-8 py-4 border border-white/20 hover:border-electric-blue hover:text-electric-blue transition-all uppercase tracking-widest text-sm font-bold rounded-sm text-white"
                                    >
                                        Reveal More Builds
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Showroom;
