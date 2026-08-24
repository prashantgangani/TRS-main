import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { Edit2, X, Save } from 'lucide-react';
// import { API_URL } from '../config';
import OptimizedImage from './OptimizedImage';
import { useNavigate } from "react-router-dom";

import {
    ArrowRight,
    CarFront,
    GalleryHorizontal,
    Radio
} from "lucide-react";


const Hero = ({ isAdmin, showTournamentNotification = true }) => {
    const [heroData, setHeroData] = useState({
        tonightsMeetTitle: 'Weekly Venue',
        tonightsMeetLocation: 'Los Santos Custom',
        tonightsMeetTime: '8:00 PM',
        leftSideImage: '/leftside.jpg',
        rightSideImage: '/rightside.jpg',
        featuredBuildImage: 'middle.jpg',
featuredBuildName: 'Founder',
featuredBuildOwner: 'JOYBOY',

partnerTitle: 'Partner',
partnerName: 'TARUN',
partnerImage: '/tarun.jpg',
partnerRole: 'Website & Operations'
    });

    const navigate = useNavigate();
    // const [isEditing, setIsEditing] = useState(false);
    // const [editForm, setEditForm] = useState(heroData);
    // const [isSaving, setIsSaving] = useState(false);
    /*
    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const res = await fetch(`${API_URL}/hero`);
                const data = await res.json();
                if (data && data._id) {
                    setHeroData(data);
                    setEditForm(data);
                }
            } catch (error) {
                console.error("Failed to load hero data", error);
            }
        };
        fetchHeroData();
    }, []); */
    /*
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch(`${API_URL}/hero`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            const data = await res.json();
            if (res.ok) {
                setHeroData(data);
                setIsEditing(false);
                alert("Hero section updated successfully!");
            } else {
                alert(`Error: ${data.message || 'Failed to update'}`);
            }
        } catch (error) {
            console.error("Failed to update hero data", error);
            alert("Network error. Please make sure the server is running.");
        } finally {
            setIsSaving(false);
        }
    };*/
    // Stagger text animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    // Stagger car animations for the lineup
    const carVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: (custom) => ({
            opacity: 1,
            scale: 1,
            transition: { duration: 1.2, ease: "easeOut", delay: custom * 0.2 + 0.6 }
        })
    };

    // New Parallax hover effect for the entire right side composition
    const handleMouseMove = (e) => {
    const collage = document.getElementById('hero-collage');

    if (!collage) return;

    const rect = collage.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;

collage.style.transform = `
    perspective(1200px)
translateX(${x * 2}px)
translateY(${y * 2}px)
rotateY(${x}deg)
rotateX(${-y}deg)
`;
};

const scrollToSection = (id) => {
    const element = document.getElementById(id);

    if (element) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
};

    return (
        <section className="relative w-full min-h-[100svh] bg-[#050505] overflow-hidden flex flex-col lg:flex-row items-center pt-36 lg:pt-10">

            {/* --- Background Atmosphere --- */}
            {/* Base dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-[#050505] to-[#010101] -z-20"></div>

            {/* Background Grid Pattern (Technical Vibe) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30 pointer-events-none -z-20 mask-image-radial-center"></div>

            {/* Ambient Neon Glows behind the scene */}
            <div className="absolute top-[20%] right-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-neon-purple/15 blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2 opacity-70"></div>
            <div className="absolute bottom-[-10%] right-[30%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-electric-blue/15 blur-[100px] rounded-full pointer-events-none -z-10 translate-x-1/2 opacity-70"></div>

            {/* subtle Vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] pointer-events-none -z-10"></div>

            {showTournamentNotification && (
                <motion.button
                    type="button"
                    onClick={() => navigate('/tournament')}
                    initial={{ opacity: 0, y: -24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.35, duration: 0.7, ease: 'easeOut' }}
                    className="group absolute left-1/2 top-28 z-30 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 items-center gap-4 overflow-hidden rounded-2xl border border-red-500/60 bg-gradient-to-br from-[#28070b] via-[#12080b] to-[#321006] px-4 py-4 text-left shadow-[0_0_45px_rgba(239,68,68,0.24)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_0_65px_rgba(249,115,22,0.42)] sm:gap-5 sm:px-6 sm:py-5 lg:left-8 lg:w-[min(44vw,620px)] lg:max-w-none lg:translate-x-0"
                >
                    <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent bg-[length:200%_auto] animate-gradient-x" />
                    <span className="absolute bottom-0 left-0 h-0.5 w-1/3 bg-gradient-to-r from-red-500 via-orange-400 to-red-500 bg-[length:200%_auto] animate-gradient-x transition-all duration-700 group-hover:w-full" />
                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-400/50 bg-red-500/10 text-red-300 sm:h-14 sm:w-14">
                        <Radio size={25} />
                        <span className="absolute right-1 top-1 h-2.5 w-2.5 animate-ping rounded-full bg-orange-400" />
                        <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-orange-400" />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-orange-300">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" /> Live event
                        </span>
                        <span className="mt-1 block text-xl font-black uppercase leading-tight text-white sm:text-3xl">Tournament is ongoing</span>
                        <span className="mt-1 block text-xs font-medium text-white/55 sm:text-sm">Bring your best build. Join the competition now.</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 via-orange-400 to-red-600 bg-[length:200%_auto] animate-gradient-x px-3 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all group-hover:shadow-[0_0_28px_rgba(249,115,22,0.5)] sm:px-5 sm:text-xs">
                        Join now <ArrowRight size={16} />
                    </span>
                </motion.button>
            )}

{/* Giant TRS Watermark */}
<div
    className="
    absolute
    top-[50%]
    left-[50%]

    -translate-x-1/2
    -translate-y-1/2

    text-[36vw]

    font-black
    font-heading

    pointer-events-none
    select-none

    z-0

    text-transparent
    bg-clip-text

    bg-gradient-to-r
    from-neon-purple/25
    via-white/20
    to-electric-blue/30
    "
    style={{
        letterSpacing: '0.15em',
        filter: 'blur(10px)',
        textShadow: `
            0 0 60px rgba(176,38,255,0.15),
            0 0 120px rgba(0,229,255,0.10)
        `,
        opacity: 0.30
    }}
>
    TRS
</div>


            {/* --- Left Side: Content --- */}
            <div className="w-full lg:w-[45%] lg:min-h-[100svh] flex flex-col justify-center px-6 sm:px-12 lg:pl-16 xl:pl-24 pt-10 pb-16 lg:py-0 lg:translate-y-16 z-20 relative shrink-0">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-2xl"
                >
                    <motion.div variants={itemVariants} className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap items-center">
                        <div className="flex items-center gap-2 pr-4 border-r border-white/20">
                            <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse shadow-[0_0_10px_#b026ff]"></span>
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-all duration-500">ESTABLISHED 2024</span>
                        </div>
                        <span className="glassmorphism px-3 py-1.5 rounded-sm text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/50 border border-white/10 shadow-sm hover:text-white hover:border-neon-purple/50 hover:bg-neon-purple/20 transition-all duration-500">
                            PC AUTOMOTIVE COMMUNITY
                        </span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.div variants={itemVariants} className="relative mb-6">
                        <div className="absolute -left-6 top-2 bottom-2 w-1 bg-gradient-to-b from-neon-purple via-electric-blue to-transparent hidden sm:block rounded-full shadow-[0_0_15px_rgba(0,229,255,0.5)]"></div>
                        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black font-heading leading-[0.95] tracking-tight">

    <span className="block text-white">
        THE ROYAL
    </span>

    <span
className="
block

text-transparent
bg-clip-text

bg-gradient-to-l
from-neon-purple
via-[#FFD166]
to-electric-blue

bg-[length:400%_auto]

animate-gradient-x

hover:drop-shadow-[0_0_25px_rgba(176,38,255,0.5)]

transition-all
duration-500
"
>
        SORCERERS
    </span>

</h1>
                    </motion.div>

                    {/* Description */}
                    <motion.p
    variants={itemVariants}
    className="text-base sm:text-lg lg:text-xl text-white/70 max-w-xl mb-10 leading-relaxed font-light drop-shadow-md hover:text-white transition-all duration-500"
>
A PC-based GTA Online automotive community
hosting theme-based car and bike meets since 2024.

More than 220 members.
More than 120 hosted events.

Built around creativity,
presentation and community.
</motion.p>

<div
    className="
    absolute
    inset-0
    rounded-full

    bg-gradient-to-r
    from-neon-purple/5
    via-transparent
    to-electric-blue/5

    opacity-0
    group-hover:opacity-100

    transition-opacity
    duration-500

    pointer-events-none
    "
/>
                    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.5, duration: 1 }}
    className="
    relative

    w-[400px]

    glass-panel

    border
    border-white/10

    hover:border-neon-purple/30
    hover:shadow-[0_0_30px_rgba(176,38,255,0.2)]

    bg-black/40
    backdrop-blur-xl

    rounded-full

    py-3
    px-6

    flex
    items-center
    justify-center

    gap-3
    sm:gap-6

    group

    transition-all
    duration-500

    mb-10
    "
>
                        <div className="flex flex-col items-center">
                            <span className="text-sm sm:text-base font-black text-white/50 group-hover:text-white transition-colors duration-300">220+</span>
                            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/40 whitespace-nowrap group-hover:scale-110 group-hover:text-white transition-all duration-300">Members</span>
                        </div>
                        <div
className="
w-[1px]
h-6
sm:h-8

bg-white/10

group-hover:bg-white/80
group-hover:h-10

transition-all
duration-300
"
/>
                        <div className="flex flex-col items-center">
                            <span className="
text-sm
sm:text-base
font-black
text-electric-blue/50
group-hover:text-electric-blue
group-hover:scale-110
transition-all
duration-300
">120+</span>
                            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/40 whitespace-nowrap group-hover:scale-105 group-hover:text-white transition-all duration-300">Events Hosted</span>
                        </div>
                        <div
className="
w-[1px]
h-6
sm:h-8

bg-white/10

group-hover:bg-white/80
group-hover:h-10

transition-all
duration-300
"
/>
                        <div className="flex flex-col items-center">
                            <span className="
text-sm
sm:text-base
font-black
text-neon-purple/50
group-hover:text-neon-purple
group-hover:scale-110
transition-all
duration-300
">2024</span>
                            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/40 whitespace-nowrap group-hover:scale-105 group-hover:text-white transition-all duration-300">Founded</span>
                        </div>
                    </motion.div>


                    {/* CTA Buttons */}

                    <motion.div
    variants={itemVariants}
    className="flex flex-wrap justify-left gap-4 mt-10"
>

{/* GARAGE */}

<motion.button
    onClick={() => navigate("/garage")}
    whileHover={{ y: -3 }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: "spring", stiffness: 350 }}
    className="
group
relative

flex
items-center
gap-4

overflow-hidden

rounded-full

border
border-white/10

bg-white/[0.03]
backdrop-blur-xl

px-6
py-3

transition-all
duration-500

hover:border-electric-blue/60
hover:shadow-[0_0_25px_rgba(0,229,255,.18)]
"
>

<div
className="
absolute
left-0
top-0
bottom-0

w-0

bg-gradient-to-r
from-electric-blue/10
to-transparent

transition-all
duration-500

group-hover:w-full
"
/>

<div
className="
relative

w-10
h-10

rounded-full

border
border-white/20

bg-white/10

flex
items-center
justify-center

text-white

group-hover:text-electric-blue
group-hover:bg-electric-blue/10
group-hover:border-electric-blue/20

transition-all
duration-500

group-hover:rotate-12
group-hover:scale-110
"
>

<CarFront size={18}/>

</div>

<div className="relative text-left">

<p className="text-white font-bold tracking-wide group-hover:text-electric-blue transition-all duration-500">

Vehicle Garage

</p>

<p className="text-xs text-white/45 group-hover:text-electric-blue/45 transition-all duration-500">

Browse Registry

</p>

</div>

<ArrowRight
size={18}
className="
relative
ml-2

text-electric-blue/50

group-hover:text-electric-blue

transition-all
duration-300

group-hover:translate-x-2
"
/>

</motion.button>





{/* SHOWROOM */}

<motion.button
    onClick={() => navigate("/showroom")}
    whileHover={{ y: -3 }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: "spring", stiffness: 350, damping: 22}}
    className="
group
relative

flex
items-center
gap-4

overflow-hidden

rounded-full

border
border-white/10

bg-white/[0.03]
backdrop-blur-xl

px-6
py-3

transition-all
duration-500

hover:border-neon-purple/60
hover:shadow-[0_0_25px_rgba(176,38,255,.18)]
"
>

<div
className="
absolute
left-0
top-0
bottom-0

w-0

bg-gradient-to-r
from-neon-purple/10
to-transparent

transition-all
duration-500

group-hover:w-full
"
/>

<div
className="
relative

w-10
h-10

rounded-full

border
border-white/20

bg-white/10

flex
items-center
justify-center

text-white

group-hover:text-neon-purple
group-hover:bg-neon-purple/10
group-hover:border-neon-purple/20

transition-all
duration-500

group-hover:rotate-12
group-hover:scale-110
"
>

<GalleryHorizontal size={18}/>

</div>

<div className="relative text-left">

<p className="text-white font-bold tracking-wide group-hover:text-neon-purple transition-all duration-500">

Crew Showroom

</p>

<p className="text-xs text-white/45 group-hover:text-neon-purple/45 transition-all duration-500">

Featured Collections

</p>

</div>

<ArrowRight
size={18}
className="
relative
ml-2

text-neon-purple/50

group-hover:text-neon-purple


transition-all
duration-300

group-hover:translate-x-2
"
/>

</motion.button>

</motion.div>
                    
                </motion.div>
            </div>



            {/* --- Right Side: Cinematic Interactive Showcase --- */}
            <div
    className="w-full lg:w-[55%] h-[60vh] sm:h-[70vh] lg:h-[100svh] relative z-10 flex items-center justify-center mt-8 lg:mt-0 lg:pr-12 perspective-1000"
    //onMouseMove={handleMouseMove}
    onMouseLeave={() => {
    const collage = document.getElementById('hero-collage');

    if (collage) {
        collage.style.transform =
            'perspective(1200px) rotateY(0deg) rotateX(0deg)';
    }
}}
            >
                {/* 3D Container */}
                <div className=" absolute w-[700px] h-[700px] rounded-full bg-gradient-to-r from-neon-purple/10 via-electric-blue/10 to-neon-purple/10 blur-[140px] pointer-events-none animate-hero-float hover:scale-[1.01] hover:-translate-y-2"></div>  
                <div id="hero-collage" style={{
  transformStyle: "preserve-3d"
}} className="relative w-full max-w-[850px] aspect-square sm:aspect-video lg:aspect-auto lg:h-[70%] flex items-center justify-center will-change-transform transition-transform duration-700 ease-out preserve-3d">   

                    {/* Floor Reflection Effect */}
                    <div className="absolute -bottom-[20%] w-[120%] h-32 bg-white/[0.02] blur-2xl rounded-[100%] pointer-events-none transform rotate-x-60"></div>

                    {/* Floating Particles (CSS only) */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transform translate-z-[-50px]">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full bg-white transition-opacity duration-1000 animate-float-slow"
                                style={{
                                    width: Math.random() * 4 + 1 + 'px',
                                    height: Math.random() * 4 + 1 + 'px',
                                    left: Math.random() * 100 + '%',
                                    top: Math.random() * 100 + '%',
                                    animationDelay: `${Math.random() * 5}s`,
                                    animationDuration: `${Math.random() * 10 + 10}s`,
                                    opacity: Math.random() * 0.4 + 0.1,
                                    boxShadow: Math.random() > 0.5 ? '0 0 12px 2px rgba(176,38,255,0.6)' : '0 0 12px 2px rgba(0,229,255,0.6)'
                                }}
                            />
                        ))}
                    </div>

                    {/* Card 1: Back Left (Atmosphere/Secondary) */}
                    <motion.div
                        custom={1}
                        variants={carVariants}
                        initial="hidden"
                        animate="visible"
                        className="absolute left-[0%] top-[48%] w-[45%] lg:w-[45%] z-10 group transform transition-transform duration-500 hover:z-50 group-hover:shadow-[0_0_80px_rgba(176,38,255,0.45)] group-hover:scale-[1.02] hover:translate-z-10 hover:border-neon-purple/50 hover:shadow-[0_0_20px_rgba(176,38,255,0.25)]"
                    >
                        <div className="absolute -inset-2 bg-gradient-to-r from-neon-purple/40 via-transparent to-neon-purple/40 blur-xl  opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>
                        <div className="relative w-full aspect-[4/3] bg-black rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden">
                            <OptimizedImage src={heroData.leftSideImage} alt="Night Drive Atmosphere" className="w-full h-full object-cover object-center opacity-25 group-hover:opacity-100 group-hover:saturate-100 transition-all duration-700 group-hover:scale-[1.03]" />
<div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className=" absolute bottom-4 left-4 glass-panel px-3 py-2 text-[10px] font-bold uppercase tracking-[0.25em] translate-x-0 translate-y-0 border border-white/10 text-white/50 group-hover:text-white transition-all duration-700">
NIGHT DRIVE
</div>


                        </div>
                    </motion.div>

                    {/* Card 2: Top Right (Meet/Secondary) */}
                    <motion.div
                        custom={2}
                        variants={carVariants}
                        initial="hidden"
                        animate="visible"
                        className="absolute left-[65%] top-[-2%] w-[45%] lg:w-[45%] z-20 group transform transition-transform duration-500 hover:z-50 group-hover:scale-[1.02] group-hover:shadow-[0_0_80px_rgba(176,38,255,0.45)] hover:translate-z-20 hover:border-neon-purple/50 hover:shadow-[0_0_20px_rgba(176,38,255,0.25)]"
                    >
                        <div className="absolute -inset-2 bg-gradient-to-l from-neon-purple/40 via-transparent to-neon-purple/40 blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>
                        <div className="relative w-full aspect-square sm:aspect-[4/3] bg-black rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden">
                            <OptimizedImage src={heroData.rightSideImage} alt="Meet Scene" className="w-full h-full object-cover object-center opacity-25

group-hover:opacity-100
group-hover:saturate-100
transition-all
duration-700
group-hover:scale-[1.03]" />
<div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                            <div
className="
absolute
top-4
right-4

translate-y-0
translate-x-0
glass-panel

px-3
py-2

text-[10px]
font-bold
uppercase
tracking-[0.25em]

border
border-white/10

text-white/50 group-hover:text-white transition-all duration-700
"
>
MEET ATMOSPHERE
</div>

                        </div>
                    </motion.div>

                    {/* Card 3: Center Featured Profile (Dominant) */}
                    <motion.div
                        custom={0}
                        variants={carVariants}
                        initial="hidden"
                        animate="visible"
                        className="absolute right-[8%] lg:right-[12%] bottom-[5%] lg:bottom-[10%] w-[72%] lg:w-[66%] z-40 hover:z-50 group transform transition-transform duration-500 group-hover:scale-[1.05] group-hover:saturate-100 group-hover:shadow-[0_0_80px_rgba(176,38,255,0.45)] hover:translate-z-40"
                    >
                        {/* Dynamic Core Shadow/Underglow */}
                        <div className="absolute -inset-3 bg-gradient-to-br from-neon-purple/40 via-transparent to-neon-purple/40 rounded-xl opacity-20 blur-2xl group-hover:opacity-70 group-hover:blur-3xl transition-all duration-700"></div>

                        <div className="relative w-full aspect-[4/5] sm:aspect-square bg-[#0a0a0a] rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.9)] border border-white/20 group-hover:border-white/40 group-hover:shadow-[0_0_60px_rgba(176,38,255,0.35)] overflow-hidden transition-all duration-700">
                            <OptimizedImage src={heroData.featuredBuildImage} variant="hero" loading="eager" alt="Featured Build" className="w-full h-full object-cover object-center group-hover:scale-[1.08] group-hover:rotate-[1deg] transition-transform duration-[1.5s] ease-out saturate-150 contrast-125 bg-black" />

                            {/* Glass tint overlay */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>

                            {/* Glossy top reflection */}
                            <div
className="
absolute
inset-0

bg-gradient-to-r
from-transparent
via-white/10
to-transparent

-skew-x-12

-translate-x-full

group-hover:animate-shimmer

pointer-events-none
"
/>
                            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent mix-blend-overlay pointer-events-none"></div>

                            {/* Info Plate Overlay */}
                            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent -translate-x-2 translate-y-4 transition-all duration-500">
                                <div className="inline-block px-2 py-1 bg-black backdrop-blur-md rounded border border-white/20 mb-2">
                                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-white text-white/50 group-hover:text-white transition-all duration-700">TRS Crew</span>
                                </div>
                            </div>

                            {/* Interactive Scanline Sheen */}
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-y-full group-hover:animate-scanline pointer-events-none"></div>
                        </div>

                        {/* Floating Micro-Panel: Top Left "Tonight's Theme" attached to featured card */}
                        <div
className="
absolute
-left-18
sm:-left-14
-top-12

w-[240px]

glass-panel

border
border-electric-blue/30

rounded-xl

overflow-hidden

z-50

group

transition-all
duration-500

hover:-translate-y-2
hover:scale-[1.03]

hover:border-electric-blue/60

hover:shadow-[0_0_35px_rgba(0,229,255,0.35)]

group-hover:tracking-wide
"
>

    <div className="relative h-[180px] overflow-hidden">

        <OptimizedImage
    src="/joyboy.jpg"
    alt="Founder"
    className="
    w-full
    h-full

    object-cover


    transition-all
    duration-700

    group-hover:opacity-100

    group-hover:scale-[1.08]
"
/>


        <div className="
        absolute
        inset-0
        bg-gradient-to-t
        from-black
        via-black/40
        to-transparent
        " />

        <div className="
        absolute
        bottom-3
        left-3
        ">
            <p className="
text-[12px]

text-white/50


uppercase
tracking-widest

mt-2

transition-all
duration-500


group-hover:text-white/80
"
>
    {heroData.featuredBuildName}
            </p>

            <h4 className="
text-[16px]

font-black
font-heading

tracking-tight

text-white

group-hover:text-electric-blue

transition-all
duration-500

group-hover:tracking-wide

drop-shadow-[0_0_10px_rgba(176,38,255,0.25)]
"
>
    {heroData.featuredBuildOwner}
            </h4>
            <div
className="
absolute

left-1/2
bottom-10

-w-40
h-20

bg-electric-blue/20

blur-3xl

opacity-0

group-hover:opacity-100

transition-opacity
duration-700

-translate-x-1/2

group
"
/>
        </div>
        <span
className="
absolute
top-3
right-3

text-[8px]
text-white/50
uppercase
tracking-widest

px-2
py-1

rounded-full

bg-electric-blue/20
border
border-electric-blue/30

group-hover:bg-electric-blue/50
group-hover:text-white

transition-all
duration-50"
>
2024
</span>

    </div>

    <div className="p-3">

        <div className="
        flex
        items-center
        gap-2
        mb-2
        ">
            <div className="
            w-2
            h-2
            rounded-full
            bg-neon-red
            animate-pulse
            " />

            <span className="
            text-[9px]
            uppercase
            tracking-widest
            text-white/60
            group-hover:text-white
            transition-all
            duration-500
            ">
                Meet Radar
            </span>
        </div>

        <p className="
        text-electric-blue
        text-xs
        font-bold
        ">
            {heroData.tonightsMeetTitle}
        </p>

        <p className="
        text-[10px]
        text-white/40
        mt-1
        ">
            {heroData.tonightsMeetLocation}
        </p>

    </div>

</div>

<div
className="
absolute
-right-40
sm:-right-32
-bottom-24

w-[240px]

glass-panel

border
border-neon-purple/30

rounded-xl

overflow-hidden

z-50

group

transition-all
duration-500

hover:-translate-y-2
hover:scale-[1.03]

hover:border-neon-purple/60

hover:shadow-[0_0_35px_rgba(176,38,255,0.35)]
"
>

    <div className="relative h-[180px] overflow-hidden">

        <OptimizedImage
            src={heroData.partnerImage}
            alt="Partner"
            className="
            w-full
            h-full
            object-cover
            transition-all
            duration-700
            group-hover:scale-[1.08]
            "
        />

        <div
        className="
        absolute
        inset-0
        bg-gradient-to-t
        from-black
        via-black/40
        to-transparent
        "
        />

        <div
        className="
        absolute
        bottom-3
        left-3
        "
        >

            <p
            className="
            text-[12px]
            text-white/50
            uppercase
            tracking-widest
            mt-2
            transition-all
            duration-500
            group-hover:text-white/80
            "
            >
                {heroData.partnerTitle}
            </p>

            <h4
            className="
            text-[16px]
            font-black
            font-heading
            tracking-tight
            text-white
            group-hover:text-neon-purple
            transition-all
            duration-500
            drop-shadow-[0_0_10px_rgba(176,38,255,0.25)]
            group
            "
            >
                {heroData.partnerName}
            </h4>

        </div>

        <span
        className="
        absolute
        top-3
        right-3

        text-[8px]
        text-white/50
        uppercase
        tracking-widest

        px-2
        py-1

        rounded-full

        bg-neon-purple/20
        border
        border-neon-purple/30

        group-hover:bg-neon-purple/50
group-hover:text-white

transition-all
duration-500
        "
        >
            TRS
        </span>

    </div>

    <div className="p-3">

        <div
        className="
        flex
        items-center
        gap-2
        mb-2
        
        "
        >

            <div
            className="
            w-2
            h-2
            rounded-full
            bg-neon-purple
            animate-pulse
            "
            />

            <span
            className="
            text-[9px]
            uppercase
            tracking-widest
            text-white/60

            group-hover:text-white
            transition-all
            duration-500
            
            "
            >
                Operations
            </span>

        </div>

<p
className="
text-neon-purple
text-xs
font-bold

transition-all
duration-500

group-hover:text-neon-purple
group-hover:tracking-wide

drop-shadow-[0_0_0px_rgba(176,38,255,0)]
group-hover:drop-shadow-[0_0_12px_rgba(176,38,255,0.5)]
"
>
    {heroData.partnerRole}
</p>

    </div>

</div>
                        
                    </motion.div>

                    {/* Lower Status Strip Component */}

                </div>
            </div>


            {/* Bottom Floating Scroll Cue */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-4 md:bottom-6 left-1/2 lg:left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 group"
            >
<div
className="
text-white/40

animate-bounce

text-xs
"
>
⌄
</div>

<div
className="
text-[10px]
sm:text-xs

uppercase
tracking-[0.3em]

font-bold

text-white/50

drop-shadow-md

group-hover:text-white

transition-all
duration-300

animate-pulse
"
>
    Begin the Journey
</div>                
<div
className="
w-[2px]

h-10
md:h-14

relative

overflow-hidden

bg-gradient-to-b
from-white/20
to-white/5

rounded-full
"
>
    
    
                    <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent animate-scanline"></div>
                    
                </div>
            </motion.div>

            {/* --- Admin Edit Controls --- */}
            {/*
            {isAdmin && (
                <div className="absolute top-28 right-6 z-[100]">
                    <button
                        onClick={() => {
                            console.log("Edit button clicked, current heroData:", heroData);
                            setEditForm(heroData);
                            setIsEditing(true);
                        }}
                        className="bg-neon-purple p-3 rounded-full shadow-[0_0_20px_rgba(176,38,255,0.6)] hover:scale-110 active:scale-95 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-5 border border-white/20"
                    >
                        <Edit2 size={14} /> Admin: Edit Hero
                    </button>
                </div>
            )}*/}

            {/* --- Edit Modal --- */}
            {/*
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass-panel w-full max-w-2xl p-8 rounded-lg border border-white/20 relative max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setIsEditing(false)}
                                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-black font-heading tracking-tight mb-8 text-glow">
                                Dispatch Console: <span className="text-neon-purple font-black">Hero Update</span>
                            </h2>

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* This Week's Meet Info */}
                                    {/*}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-neon-purple border-b border-white/10 pb-2">Meet Radar</h3>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Meet Theme</label>
                                            <input
                                                type="text"
                                                value={editForm.tonightsMeetTitle}
                                                onChange={(e) => setEditForm({ ...editForm, tonightsMeetTitle: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-sm focus:border-neon-purple outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Location</label>
                                            <input
                                                type="text"
                                                value={editForm.tonightsMeetLocation}
                                                onChange={(e) => setEditForm({ ...editForm, tonightsMeetLocation: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-sm focus:border-neon-purple outline-none"
                                                placeholder="e.g. Vinewood Hills"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Time</label>
                                            <input
                                                type="text"
                                                value={editForm.tonightsMeetTime}
                                                onChange={(e) => setEditForm({ ...editForm, tonightsMeetTime: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-sm focus:border-neon-purple outline-none"
                                                placeholder="e.g. 10:30 PM"
                                            />
                                        </div>
                                    </div> */}

                                    {/* Featured Build Info */}
                                    {/*}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-electric-blue border-b border-white/10 pb-2">Community Showcase</h3>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Display Title</label>
                                            <input
                                                type="text"
                                                value={editForm.featuredBuildName}
                                                onChange={(e) => setEditForm({ ...editForm, featuredBuildName: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-sm focus:border-electric-blue outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Subtitle</label>
                                            <input
                                                type="text"
                                                value={editForm.featuredBuildOwner}
                                                onChange={(e) => setEditForm({ ...editForm, featuredBuildOwner: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-sm focus:border-electric-blue outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>*/}

                                {/* Asset Logic */} {/*
                                <div className="space-y-4 mt-8 pt-4 border-t border-white/10">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Asset Dispatch (URLs)</h3>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Featured Build Image (Center Card)</label>
                                        <input
                                            type="text"
                                            value={editForm.featuredBuildImage}
                                            onChange={(e) => setEditForm({ ...editForm, featuredBuildImage: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-sm focus:border-white/40 outline-none"
                                            placeholder="Paste Image URL here..."
                                        />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full py-4 bg-white text-deep-black font-black uppercase tracking-widest text-sm rounded-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <span className="animate-pulse">Saving Updates...</span>
                                        ) : (
                                            <>
                                                <Save size={18} /> Update Hero Content
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence> */}
        </section>
    );
};

export default Hero;
