import React from 'react';
import { motion } from 'framer-motion';

const themes = [
    {
        title: 'JDM NIGHT',
        description: 'Japanese icons, tuner culture, and neon-lit streets.',
        image: '/themes/jdm.jpg',
        glow: 'rgba(139,92,246,0.35)'
    },
    {
        title: 'DARK VS NEON',
        description: 'Stealthy dark builds clash with vibrant neon machines under the city lights.',
        image: '/themes/dark-vs-neon.jpg',
        glow: 'rgba(255,0,255,0.35)'
    },
    {
        title: 'SUPERCAR MEET',
        description: 'The most exotic builds gathered in one location.',
        image: '/themes/supercar.jpg',
        glow: 'rgba(34,197,94,0.35)'
    },
    {
        title: 'RETRO LEGENDS',
        description: 'Celebrating automotive history through timeless classics.',
        image: '/themes/retro.jpg',
        glow: 'rgba(255,255,255,0.25)'
    },
    {
        title: 'BIKE NIGHT',
        description: 'Two wheels. One road. Endless atmosphere.',
        image: '/themes/bike.jpg',
        glow: 'rgba(56,189,248,0.35)'
    },
    {
        title: 'OFFROAD EXPEDITION',
        description: 'Mud, mountains, trails, and adventure.',
        image: '/themes/offroad.jpg',
        glow: 'rgba(255,209,102,0.35)'
    }
];

const MeetThemesShowcase = () => {
    return (
        <section
            id="event-archives"
            className="relative py-32 bg-[#040404] overflow-hidden"
        >
            {/* Ambient Background */}
            
            <div className="absolute inset-0">
                <div className="absolute left-0 top-0 w-[600px] h-[600px] bg-electric-blue/10 blur-[180px]" />
                <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-neon-purple/10 blur-[180px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

                {/* Header */}

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="max-w-4xl mb-20"
                >
                    <span className="text-electric-blue uppercase tracking-[0.35em] hover:tracking-[0.5em] text-xs font-bold transition-all duration-500">
                        EVENT ARCHIVES
                    </span>

                    <h2 className="mt-6 text-5xl md:text-7xl font-black leading-tight">
                        More Than
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-white to-neon-purple animate-gradient-x bg-[length:800%_auto]">
                            120 Meets Hosted
                        </span>
                    </h2>

                    <p className="mt-8 text-white/60 text-lg max-w-3xl hover:text-white transition-all duration-500">
                        Every meet follows a unique theme. From JDM nights
                        to off-road expeditions, TRS events are designed
                        around creativity, presentation, and community.
                    </p>
                </motion.div>

                {/* Theme Grid */}

                <div
className="
absolute
inset-0
flex
items-center
justify-center

pointer-events-none
select-none

text-[45vw]
font-black

text-white/[0.08]

z-0
"
>
TRS
</div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                    {themes.map((theme, index) => (
                        <motion.div
    key={theme.title}
    initial={{ opacity: 0, y: 40 }}
    style={{
        '--theme-glow': theme.glow
    }}
    whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.08
                            }}
                            className="
group
relative
h-[420px]
overflow-hidden
rounded-2xl
border
border-white/10
transition-all
duration-500
hover:border-white/30
hover:-translate-y-2
"                        >
                            {/* Background */}

                            <img
                                src={theme.image}
                                alt={theme.title}
                                className="
                                    absolute inset-0
                                    w-full h-full
                                    object-cover
                                    transition-transform
                                    duration-700
                                    group-hover:scale-110
                                "
                            />

                            {/* Overlay */}
                            <div
    className="
        absolute
        inset-0
        opacity-0
        group-hover:opacity-100
        transition-opacity
        duration-500
        pointer-events-none
    "
    style={{
        boxShadow: 'inset 0 0 120px var(--theme-glow)'
    }}
/>
                            {/* Content */}

                            <div className="absolute bottom-0 p-8">

                                <div className="
    inline-block
    mb-4
    px-3
    py-1
    text-xs
    font-bold
    tracking-widest
    uppercase
    border
    border-white/20
    backdrop-blur-md
    transition-all
    duration-500
    group-hover:border-white/40
    group-hover:bg-white/10
    group-hover:backdrop-blur-2xl
">
                                    Theme Event
                                </div>
                                <h3
    className="
        text-3xl
        font-black
        mb-3
        transition-all
        duration-500
        group-hover:tracking-[0.08em]
    "
>
                                    {theme.title}
                                </h3>

                                <p className="text-white/60 leading-relaxed">
                                    {theme.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}

                </div>

            </div>
        </section>
    );
};

export default MeetThemesShowcase;