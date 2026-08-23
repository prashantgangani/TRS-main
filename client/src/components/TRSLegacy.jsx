import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Calendar,
    Monitor,
    Trophy
} from 'lucide-react';

const stats = [
    {
        icon: Users,
        value: '220+',
        label: 'Members'
    },
    {
        icon: Calendar,
        value: '120+',
        label: 'Hosted Meets'
    },
    {
        icon: Monitor,
        value: 'PC',
        label: 'Platform'
    },
    {
        icon: Trophy,
        value: '2024',
        label: 'Founded'
    }
];

const TRSLegacy = () => {
    return (
        <section
            id="trs-legacy"
            className="relative py-32 overflow-hidden bg-[#050505]"
        >
            {/* Ambient Background */}

            <div
className="
absolute
inset-0

flex
items-center
justify-center

pointer-events-none
select-none

text-[35vw]
font-black

text-white/[0.05]

z-0
"
>
TRS
</div>
            <div className="absolute inset-0">
                <div className="absolute left-0 top-0 w-[500px] h-[500px] bg-neon-purple/10 blur-[150px]" />
                <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-electric-blue/10 blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

                {/* Header */}

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mb-20"
                >
                    <span className="text-electric-blue uppercase tracking-[0.4em] text-xs font-bold hover:text-neon-purple hover:tracking-[0.5em] transition-all duration-500">
                        THE ROYAL SORCERERS
                    </span>

                    <h2 className="
block
text-transparent
bg-clip-text

bg-gradient-to-r
from-neon-purple
via-[#FFD166]
to-electric-blue

bg-[length:400%_auto]

animate-gradient-x

hover:tracking-wide

mt-6
text-5xl
md:text-7xl
font-black
leading-tight
transition-all
duration-500
">
                        Built Around
                        <br />
                        The Meet.
                    </h2>

                    <p className="mt-8 text-white/60 text-lg leading-relaxed max-w-3xl hover:text-white transition-all duration-500">
                        TRS is a PC-based GTA Online community focused on
                        organized theme-based car and bike meets.
                        Since 2024, we have brought together hundreds of
                        enthusiasts through carefully planned events,
                        community culture, and a shared passion for
                        automotive creativity.
                    </p>
                </motion.div>

                {/* Stats Grid */}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">

                    {stats.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1
                                }}
                                className="group bg-white/[0.03]
                                border border-white/10
                                rounded-2xl
                                p-8
                                backdrop-blur-xl
                                hover:border-neon-purple/40
                                hover:bg-neon-purple/10
                                hover:backdrop-blur-sm
                                transition-all duration-300 group"
                            >
                                <Icon
                                    size={26}
                                    className="text-neon-purple mb-6 group-hover:text-white transition-all duration-500"
                                />

                                <h3 className="text-4xl font-black mb-2 group-hover:text-neon-purple transition-all duration-500">
                                    {item.value}
                                </h3>

                                <p className="uppercase tracking-widest text-xs text-white/50 group-hover:text-neon-purple transition-all duration-500">
                                    {item.label}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Values */}

                <div className="grid md:grid-cols-3 gap-8 group">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="border-l-2 border-neon-purple pl-6 group-hover:border-white transition-all duration-500"
                    >
                        <h3 className="text-2xl font-bold mb-4 group-hover:text-neon-purple transition-all duration-500">
                            Theme-Based Events
                        </h3>

                        <p className="text-white/60 leading-relaxed group-hover:text-white transition-all duration-500">
                            Every meet is built around a specific theme.
                            From JDM nights to muscle showcases,
                            creativity and presentation matter.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="border-l-2 border-electric-blue pl-6 group-hover:border-white transition-all duration-500"
                    >
                        <h3 className="text-2xl font-bold mb-4 group-hover:text-electric-blue transition-all duration-500">
                            Community First
                        </h3>

                        <p className="text-white/60 leading-relaxed group-hover:text-white transition-all duration-500">
                            TRS isn't about winning races.
                            It's about bringing enthusiasts together,
                            sharing builds, and creating memorable events.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="border-l-2 border-neon-green pl-6 group-hover:border-white transition-all duration-500"
                    >
                        <h3 className="text-2xl font-bold mb-4 group-hover:text-neon-green transition-all duration-500">
                            Built To Last
                        </h3>

                        <p className="text-white/60 leading-relaxed group-hover:text-white transition-all duration-500">
                            More than 120 meets hosted since 2024 and
                            still growing. Every event adds another chapter
                            to the story of TRS.
                        </p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default TRSLegacy;