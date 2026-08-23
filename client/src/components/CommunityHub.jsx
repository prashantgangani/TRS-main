import React from 'react';
import { motion } from 'framer-motion';
import { Users, CalendarDays, Camera, Send, Instagram } from 'lucide-react';

const photos = [
    '/community/community-1.jpg',
    '/community/community-2.jpg',
    '/community/community-3.jpg',
    '/community/community-4.jpg'
];

const CommunityHub = () => {
    return (
        <section
    id="community"
    className="relative py-32 overflow-hidden bg-[#050505] border-t border-white/5"
>
            {/* Ambient Lighting */}

<div
className="
absolute
inset-0

flex
items-center
justify-center

pointer-events-none
select-none

text-[30vw]
font-black

text-white/[0.04]

z-0
"
>
TRS
</div>
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-neon-purple/10 blur-[160px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-electric-blue/10 blur-[160px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Side */}

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="text-electric-blue uppercase tracking-[0.35em] text-xs font-bold hover:tracking-[0.5em] transition-all duration-500">
                            COMMUNITY HUB
                        </span>

                        <h2 className="mt-6 text-5xl md:text-7xl font-black leading-tight">
                            Join The
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-electric-blue to-neon-green animate-gradient-x bg-[length:800%_auto]">
                                Conversation
                            </span>
                        </h2>

                        <p className="mt-8 text-white/60 text-lg leading-relaxed max-w-2xl hover:text-white transition-all duration-500">
                            The Royal Sorcerers is more than a meet schedule.
                            It is a growing automotive community built around
                            creativity, friendship, photography, and unforgettable
                            themed events.
                        </p>

                        {/* Community Stats */}

                        <div className="grid grid-cols-3 gap-4 mt-12">

                            <div className="glass-panel p-5 border hover:-translate-y-3 hover:scale-[1.1] border-white/10 hover:bg-neon-purple/95 transition-all duration-500 group">
                                <Users
                                    size={20}
                                    className="text-neon-purple mb-3 group-hover:text-white transition-all duration-500"
                                />
                                <div className="text-2xl font-black group-hover:text-neon-purple transition-all duration-500">
                                    220+
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-white/50 group-hover:text-neon-purple transition-all duration-500">
                                    Members
                                </div>
                            </div>

                            <div className="glass-panel p-5 border hover:-translate-y-3 hover:scale-[1.1] border-white/10 hover:bg-electric-blue/95 transition-all duration-500 group">
                                <CalendarDays
                                    size={20}
                                    className="text-electric-blue mb-3 group-hover:text-white transition-all duration-500"
                                />
                                <div className="text-2xl font-black group-hover:text-electric-blue transition-all duration-500">
                                    120+
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-white/50 group-hover:text-electric-blue transition-all duration-500">
                                    Events
                                </div>
                            </div>

                            <div className="glass-panel p-5 border hover:-translate-y-3 hover:scale-[1.1] border-white/10 hover:bg-neon-green/95 transition-all duration-500 group">
                                <Camera
                                    size={20}
                                    className="text-neon-green mb-3 group-hover:text-white transition-all duration-500"
                                />
                                <div className="text-2xl font-black group-hover:text-neon-green transition-all duration-500">
                                    1000+
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-white/50 group-hover:text-neon-green transition-all duration-500">
                                    Photos
                                </div>
                            </div>

                        </div>

                        {/* Buttons */}

                        <div className="flex flex-wrap gap-4 mt-12">

                            <a
    href="https://discord.gg/wRP8uDYeeq"
    target="_blank"
    rel="noreferrer"
    className="
        group
        relative
        overflow-hidden
        px-8 py-4
        font-bold
        uppercase
        tracking-widest
        rounded-sm
        flex items-center gap-3
        transition-all duration-700
        bg-white
        text-black
        hover:text-white
        hover:shadow-[0_0_30px_rgba(88,101,242,0.6)]
    "
>
    {/* Discord background */}

    <div
        className="
            absolute inset-0
            bg-[#5865F2]
            -translate-x-full
            group-hover:translate-x-0
            transition-all
            duration-700
        "
    />

    <span className="relative z-10 flex items-center gap-3">

        <Send
            size={18}
            className="
                transition-all
                duration-700
                group-hover:-translate-y-2
                group-hover:translate-x-2
                group-hover:rotate-12
            "
        />

        <span
            className="
                transition-all
                duration-700
                group-hover:tracking-[0.18em]
            "
        >
            Join Discord
        </span>

    </span>

</a>

                            <a
    href="https://www.instagram.com/theroyalsorcerers"
    target="_blank"
    rel="noreferrer"
    className="
        group
        relative
        overflow-hidden
        px-8 py-4
        border border-white/20
        text-white
        font-bold
        uppercase
        tracking-widest
        rounded-sm
        flex items-center gap-3
        transition-all duration-700
    "
>

    {/* Instagram gradient */}

    <div
        className="
            absolute inset-0
            opacity-0
            group-hover:opacity-100
            transition-opacity
            duration-700
            bg-gradient-to-r
            from-[#833AB4]
            via-[#FD1D1D]
            to-[#FCAF45]
        "
    />

    {/* Inner panel */}

    <div
        className="
            absolute
            inset-[2px]
            bg-[#050505]
            group-hover:bg-black/70
            transition-all
            duration-700
        "
    />

    <span className="relative z-10 flex items-center gap-3">

        <Instagram
            size={18}
            className="
                transition-all
                duration-700
                group-hover:scale-125
                group-hover:rotate-12
            
                "
        />

        <span
            className="
                transition-all
                duration-700
                group-hover:-translate-y-[1px]
                group-hover:tracking-[0.27em]
            "
        >
            Instagram
        </span>

    </span>

</a>

                        </div>
                    </motion.div>

                    {/* Right Side Gallery */}

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        {photos.map((photo, index) => (
                            <div
                                key={index}
                                className="
                                    group
                                    relative
                                    overflow-hidden
                                    rounded-2xl
                                    border border-white/10
                                    aspect-square
                                "
                            >
                                <img
                                    src={photo}
                                    alt="TRS Community"
                                    className="
                                        w-full
                                        h-full
                                        object-cover
                                        transition-transform
                                        duration-700
                                        group-hover:scale-110
                                    "
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            </div>
                        ))}
                    </motion.div>

                </div>

            </div>
        </section>
    );
};

export default CommunityHub;