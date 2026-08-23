import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Clock, Smile, Truck, Zap } from 'lucide-react';
import { API_URL } from '../config';

const CountdownBlock = ({ label, value }) => {
    return (
        <motion.div 
            whileHover={{y:-8, scale:1.03, boxShadow: "0 0 15px rgba(176, 38, 255, 0.8" }}
className="
flex flex-col items-center justify-center
bg-black/50 backdrop-blur-lg
border border-electric-blue/30
rounded-xl
py-6 px-4 md:px-8
shadow-[0_0_15px_rgba(0,229,255,0.15)]
hover:border-neon-purple/70
hover:shadow-[0_0_35px_rgba(176,38,255,0.45)]
transition-all duration-50
relative overflow-hidden group
min-w-[90px] md:min-w-[120px]
"
        >
            {/* Background Glow Pulse */}
            <motion.div 
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-electric-blue/20 via-neon-purple/10 to-transparent"
            ></motion.div>
            
            {/* Glowing circle behind numbers */}
            <div className="
absolute top-1/2 left-1/2
-translate-x-1/2 -translate-y-1/2
w-16 h-16
bg-electric-blue/20
group-hover:bg-neon-purple/40
rounded-full
blur-xl
transition-all duration-50
"></div>

            
            <div className="
text-4xl md:text-6xl
font-black font-heading
text-white
drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]
group-hover:text-neon-purple
group-hover:drop-shadow-[0_0_20px_rgba(176,38,255,0.9)]
transition-all duration-50
tabular-nums relative z-10
w-16 md:w-20 text-center
flex justify-center
perspective-[1000px]
">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={value}
                        initial={{ opacity: 0, rotateX: -90, y: 15 }}
                        animate={{ opacity: 1, rotateX: 0, y: 0 }}
                        exit={{ opacity: 0, rotateX: 90, y: -15 }}
                        transition={{ duration: 0.4, type: "spring" }}
                        className="inline-block transform-style-3d origin-center"
                    >
                        {value.toString().padStart(2, '0')}
                    </motion.span>
                </AnimatePresence>
            </div>
            <span className="
text-[10px] md:text-sm
font-bold uppercase tracking-widest
text-electric-blue
group-hover:text-neon-purple
group-hover:drop-shadow-[0_0_10px_rgba(176,38,255,0.8)]
transition-all duration-50
mt-3 relative z-10
">
                {label}
            </span>
        <div
className="
absolute inset-0
opacity-0 group-hover:opacity-100
bg-gradient-to-br
from-neon-purple/10
via-transparent
to-neon-purple/5
transition-opacity duration-50
pointer-events-none
"
/>
        </motion.div>
    );
};

const CountdownTimer = () => {
    const [targetDate, setTargetDate] = useState(null);
    const [eventName, setEventName] = useState("UPCOMING MEET");
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchNextMeet = async () => {
            try {
                const response = await fetch(`${API_URL}/meets?limit=1`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        setEventName(data[0].theme);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch next meet theme:", error);
            }

            // Always calculate next Saturday at 10:00 PM IST (16:30 UTC)
            const now = new Date();
            const nextSaturday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 16, 30, 0));
            
            // Find how many days to add until it's Saturday (day 6 in getUTCDay)
            let daysUntilSaturday = (6 - nextSaturday.getUTCDay() + 7) % 7;
            
            // If today is Saturday but 16:30 UTC has already passed, target the NEXT Saturday
            if (daysUntilSaturday === 0 && now.getTime() > nextSaturday.getTime()) {
                daysUntilSaturday = 7;
            }
            
            nextSaturday.setUTCDate(nextSaturday.getUTCDate() + daysUntilSaturday);
            
            setTargetDate(nextSaturday);
            setIsLoaded(true);
        };
        fetchNextMeet();
    }, []);

    useEffect(() => {
        if (!targetDate) return;

        const calculateTimeLeft = () => {
            const difference = +targetDate - +new Date();
            
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        // Call immediately right after parsing date
        calculateTimeLeft();

        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    // Progress line animation ratio - pseudo realistic (just continuous loop driving)
    // Or we could map it to actual seconds (0 to 60) just for a repeatable cycle
    const progressPercent = (1 - (timeLeft.seconds / 60)) * 100;

    if (!isLoaded) return null;

    return (
        <section id="countdown-timer" className="py-16 md:py-24 relative overflow-hidden bg-[#050505]">
            {/* Background Effects */}
            <div className="
absolute

top-1/2
left-1/2

-translate-x-1/2
-translate-y-1/2

w-[1200px]
h-[800px]

bg-gradient-to-r
from-neon-purple/10
via-electric-blue/10
to-neon-purple/10

blur-[180px]

pointer-events-none
"
></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-purple/30 to-transparent"></div>
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

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-10 group">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-sm md:text-base font-bold tracking-[0.3em] text-neon-purple/50 uppercase mb-2 flex items-center justify-center gap-2 group-hover:text-neon-purple transition-all duration-500">
                            <Zap size={16} className="text-neon-purple/50 group-hover:text-neon-purple transition-all duration-500"/>
                            Next Crew Meet
                            <Zap size={16} className="text-neon-purple/50 group-hover:text-neon-purple transition-all duration-500" />
                        </h2>
                        <div
className="
inline-flex
items-center
gap-2

px-4
py-2

mb-5

glass-panel
border
border-neon-red

rounded-full

text-[10px]
font-bold
tracking-[0.25em]
uppercase
text-neon-purple/80

group-hover:text-white
group-hover:bg-neon-purple

transition-all
duration-500
"
>
<div className="w-2 h-2 bg-neon-red rounded-full animate-pulse"></div>

Event Broadcast
</div>
                        <h1 className="
text-4xl
md:text-6xl
lg:text-7xl

font-black

text-transparent
bg-clip-text

bg-gradient-to-r
from-neon-purple
via-white
to-electric-blue

bg-[length:200%_auto]

animate-gradient-x
">
                            {eventName}
                        </h1>

                        <div
className="
flex
flex-wrap
justify-center
gap-4

mt-5
mb-6
"
>

<div className="glass-panel px-4 py-2 text-xs uppercase tracking-widest text-[#FFD700]/80 group-hover:bg-[#FFD700] group-hover:text-white transition-all duration-500">
Official Time
</div>

<div className="glass-panel px-4 py-2 text-xs uppercase tracking-widest text-white/80 group-hover:bg-white group-hover:text-white transition-all duration-500">
Saturday
</div>

<div className="glass-panel px-4 py-2 text-xs uppercase tracking-widest text-electric-blue/80 group-hover:bg-electric-blue group-hover:text-white transition-all duration-500">
10:00 PM IST
</div>

<div className="glass-panel px-4 py-2 text-xs uppercase tracking-widest text-neon-purple/80 group-hover:bg-neon-purple group-hover:text-white transition-all duration-500">
PC Platform
</div>

</div>

                        {/* Neon underline animation */}
                        <div className="flex justify-center items-center mt-2 mb-8">
                            <div className="h-0.5 w-12 bg-transparent"></div>
                            <motion.div 
                                className="h-1 w-24 bg-gradient-to-r from-electric-blue via-neon-purple to-electric-blue rounded-full shadow-[0_0_10px_rgba(0,229,255,0.8)]"
                                animate={{ width: ["60px", "480px", "60px"], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <div className="h-0.5 w-12 bg-transparent"></div>
                        </div>
                    </motion.div>
                </div>
                                    <div className="text-center mb-6 group">
    <span className="text-xs uppercase tracking-[0.4em] text-white/40 group-hover:font-bold group-hover:text-white transition-all duration-500">
        NEXT DEPARTURE IN
    </span>
</div>

                <div className="flex flex-col items-center">
                    {/* Timer Blocks */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-12 w-full max-w-4xl"
                    >
                        <CountdownBlock label="Days" value={timeLeft.days} />
                        <CountdownBlock label="Hours" value={timeLeft.hours} />
                        <CountdownBlock label="Minutes" value={timeLeft.minutes} />
                        <CountdownBlock label="Seconds" value={timeLeft.seconds} />
                    </motion.div>

                    {/* Progress Line with Car */}
 
                    <div className="w-full max-w-2xl mt-4 mb-10 relative">
                        <div
className="
h-2
w-full

bg-white/5

rounded-full

overflow-hidden

relative

border
border-white/10

shadow-inner
shadow-black/50
"
>

    {/* NEW BACKGROUND ENERGY LAYER */}
    <div
    className="
    absolute
    inset-0

    bg-gradient-to-r
    from-neon-purple/25
    via-electric-blue/25
    to-oracle-gold/25

    animate-pulse
    "
    />

    {/* Existing Progress Fill */}
<motion.div
    className="
    h-full

    bg-gradient-to-r
    from-oracle-gold
    via-electric-blue
    to-neon-purple

    shadow-[0_0_20px_rgba(0,229,255,0.5)]

    relative
    "
    style={{ width: `${progressPercent}%` }}
>

        {/* Optional shimmer inside progress */}
    <div
    className="
    absolute
    inset-0

    bg-gradient-to-r
    from-transparent
    via-white/30
    to-transparent

    animate-shimmer
    "
    />

    </motion.div>

</div>
                        {/* Car Icon Driving */}
                        {/*<motion.div 
    className="absolute top-1/2 -translate-y-1/2 text-electric-blue drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]"
    style={{ left: `calc(${progressPercent}% - 12px)` }}
> */}

<motion.div
    className="
    absolute
    top-1/2
    -translate-y-1/2

    text-electric-blue

    drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]
    "
    animate={{
        left: `calc(${progressPercent}% - 12px)`
    }}
    transition={{
        duration: 0.8,
        ease: "easeInOut"
    }}
>

    <motion.div
        animate={{
            y: [0, -2, 0]
        }}
        transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }}
        className="
        relative

        flex
        items-center
        justify-center

        w-8
        h-8
        "
    >

        {/* Glow */}
        <div
            className="
            absolute
            top-1/2
            left-1/2

            w-12
            h-12

            bg-electric-blue/30

            rounded-full

            blur-xl

            animate-pulse

            -translate-x-1/2
            -translate-y-1/2
            "
        />

        {/* Car */}
        <Car
            size={25}
            className="relative z-10 top-1/2"
        />

    </motion.div>

</motion.div>

<div
    className="
    flex
    justify-center

    mt-6
    "
    >
    </div>
                    </div> 
                    
                </div>
            </div>
        </section>
    );
};

export default CountdownTimer;
