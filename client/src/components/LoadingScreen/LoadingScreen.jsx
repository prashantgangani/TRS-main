import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TRSLogo from "/TRS_LOGO.png";
import loading1 from "/loading1.jpg";
import loading2 from "/loading2.jpg";
import loading3 from "/loading3.jpg";
import loading4 from "/loading4.jpg";
import loading5 from "/loading5.jpg";

const loadingSteps = [
  "Initializing Crew Network...",
  "Loading Member Database...",
  "Synchronizing Garage...",
  "Preparing Meet Calendar...",
  "Loading Previous Meets...",
  "Indexing Crew Protocols...",
  "Connecting to Los Santos...",
  "Welcome to TRS"
];

const crewStats = [
  {
    value: "220+",
    label: "Members",
  },
  {
    value: "120+",
    label: "Meets",
  },
  {
    value: "2024",
    label: "Founded",
  },
];

const backgrounds = [
    loading1,
    loading2,
    loading3,
    loading4,
    loading5
];

const glowThemes = [

{
left:"bg-neon-purple/70",
right:"bg-electric-blue/70"
},

{
left:"bg-red-500/60",
right:"bg-orange-400/60"
},

{
left:"bg-sky-500/70",
right:"bg-cyan-400/70"
},

{
left:"bg-fuchsia-500/60",
right:"bg-violet-500/60"
},

{
left:"bg-purple-700/70",
right:"bg-blue-500/60"
}

];

const LoadingScreen = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
const [visible, setVisible] = useState(true);
const [backgroundIndex, setBackgroundIndex] = useState(0);

  const step = useMemo(() => {
    if (progress >= 100) return loadingSteps.length - 1;

    return Math.min(
      Math.floor(progress / (100 / (loadingSteps.length - 1))),
      loadingSteps.length - 2
    );
  }, [progress]);

useEffect(() => {

    if (!visible) return;

    const interval = setInterval(() => {

        setBackgroundIndex((prev) =>
            (prev + 1) % backgrounds.length
        );

    }, 3000);

    return () => clearInterval(interval);

}, [visible]);

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (!isLoading) {
          return Math.min(prev + 8, 100);
        }

        if (prev < 70) {
          return Math.min(prev + Math.random() * 5 + 2, 70);
        }

        if (prev < 90) {
          return Math.min(prev + Math.random() * 2 + 0.8, 90);
        }

        if (prev < 99) {
          return Math.min(prev + 0.15, 99);
        }

        return 99;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [isLoading, visible]);

  useEffect(() => {
    if (isLoading || progress < 100) return;

    const timer = setTimeout(() => {
      setVisible(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [isLoading, progress]);

  if (!visible) return null;

return (
    <AnimatePresence>
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                scale: 0.985,
                filter: "blur(4px)",
            }}
            transition={{
                duration: 0.8,
                ease: "easeInOut",
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-deep-black"
        >

<div
    className="
        absolute
        inset-0

        bg-black/70
    "
/>

           <AnimatePresence mode="sync">

<motion.img
    key={backgroundIndex}
    src={backgrounds[backgroundIndex]}
    alt=""

    initial={{
        opacity:0,
        scale:1.15
    }}

    animate={{
        opacity:.44,
        scale:1.08,
        x:[-20,20,-20],
        y:[10,-10,10]
    }}

    exit={{
        opacity:0,
        scale:1
    }}

    transition={{
        opacity:{duration:1.2},
        scale:{duration:18},
        x:{
            duration:18,
            repeat:Infinity,
            ease:"linear"
        },
        y:{
            duration:18,
            repeat:Infinity,
            ease:"linear"
        }
    }}

    className="
absolute
inset-0
w-full
h-full
object-cover
blur-[2px]
pointer-events-none
select-none
"
/>

</AnimatePresence>

            {/* Purple Glow */}

            <motion.div
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.18, 0.28, 0.18],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                }}
                className={`absolute -left-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full blur-[120px] opacity-20 ${glowThemes[backgroundIndex].left}`}
            />

            {/* Blue Glow */}

            <motion.div
                animate={{
                    scale: [1.15, 1, 1.15],
                    opacity: [0.16, 0.25, 0.16],
                }}
                transition={{
                    duration: 9,
                    repeat: Infinity,
                }}
                className={`absolute -left-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full blur-[120px] opacity-20 ${glowThemes[backgroundIndex].right}`}
            />

            {/* Moving Grid */}

            <motion.div
                animate={{
                    backgroundPosition: ["0px 0px", "60px 60px"],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] bg-[size:60px_60px]"
            />

            <div
className="
absolute
inset-0
pointer-events-none
opacity-[0.035]
mix-blend-soft-light
bg-[url('/noise.png')]
"
/>

            {/* Main */}

            <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 md:px-10">

                {/* Badge */}

                <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="
                        mb-8

                        inline-flex
                        items-center
                        gap-2

                        rounded-full

                        border

                        border-neon-purple/30

                        bg-neon-purple/10

                        px-5

                        py-2

                        text-[11px]

                        font-bold

                        uppercase

                        tracking-[0.35em]

                        text-neon-purple

                        hover:text-white
                        hover:bg-neon-purple
                        hover:tracking-[0.5em]
                        transition-all
                        duration-500
                    "
                >

                    Crew Portal

                </motion.div>

                {/* Logo */}

                <motion.div
                    initial={{
                        opacity: 0,
                        scale: .8
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1
                    }}
                    transition={{
                        duration: .8
                    }}
                    className="relative"
                >

                    <motion.div
                        animate={{
                            scale: [1, 1.12, 1],
                            opacity: [0.35, 0.65, 0.35]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="
                            absolute
                            inset-0

                            rounded-full

                            bg-neon-purple/30

                            blur-3xl
                        "
                    />

                    <img
                        src={TRSLogo}
                        alt="TRS"
                        className="
                            relative

                            w-32
                            md:w-36

                            drop-shadow-[0_0_45px_rgba(176,38,255,.55)]
                        "
                    />

                </motion.div>

                {/* Title */}

                <motion.h1
                    initial={{
                        opacity: 0,
                        y: 15
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        delay: .25
                    }}
                    className="
                        mt-8

                        text-center
                        text-white

                        text-4xl
                        md:text-5xl

                        font-heading

                        font-bold

                        uppercase

                        tracking-[0.35em]
                    "
                >

                    THE ROYAL{" "}

                    <span className="gradient-text tracking-[0.5em]">

                        SORCERERS

                    </span>

                </motion.h1>

                {/* Subtitle */}

                <motion.p
                    initial={{
                        opacity: 0,
                        y: 15
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        delay: .4
                    }}
                    className="
                        mt-4

                        text-center

                        text-sm

                        uppercase

                        tracking-[0.45em]

                        text-white/45

                        hover:text-white/90
                        transition-all
                        duration-500
                    "
                >

                    GTA Online Car Meet Community

                </motion.p>

                {/* Loading Card */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 25
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        delay: .6
                    }}
                    className="
                        mt-14

                        w-full

                        transparent

                        rounded-3xl

                        border

                        border-transparent

                        p-6 md:p-8
                    "
                >
                                      {/* Header */}

                    <div className="flex items-start justify-between gap-6 bg-transparent">

                        <div>

                            <p className="text-[11px] uppercase tracking-[0.35em] text-white">
                                Crew Initialization
                            </p>

                            <AnimatePresence mode="wait">

                                <motion.h3
                                    key={loadingSteps[step]}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: .25 }}
                                    className={`mt-3 text-2xl gradient-text font-bold transition-colors duration-500 ${
                                        progress >= 100
                                            ? "text-neon-green"
                                            : "text-white"
                                    }`}
                                >

                                    {loadingSteps[step]}

                                </motion.h3>

                            </AnimatePresence>

                        </div>

                        <div className="text-right">

                            <div className="text-5xl font-black gradient-text">

                                {Math.round(progress)}%

                            </div>

                        </div>

                    </div>

                    {/* Progress */}

                    <div className="mt-8">

                        <div className="relative h-3 overflow-hidden rounded-full border border-white/10 bg-white/5">

                            <motion.div
    initial={{ width: 0 }}
    animate={{ width: `${progress}%` }}
    transition={{ ease: "easeInOut", duration: 0.2 }}
    style={{
        transformOrigin: "left center",
    }}
    className={`absolute left-0 top-0 h-full ${
        progress >= 100
            ? "bg-neon-green shadow-[0_0_25px_rgba(92,207,69,.8)]"
            : "bg-gradient-to-r from-neon-purple via-electric-blue to-neon-purple"
    }`}
/>

                        </div>

                        <div className="mt-3 flex justify-between text-[11px] uppercase tracking-[0.35em] text-white">

                            <span>Initializing</span>

                            <span className={`${progress >= 100? "text-neon-green" : "text-white"}`}>Ready</span>

                        </div>

                    </div>

                    {/* Stats */}

                    <div className="mt-10 grid grid-cols-3 gap-4">

                        {crewStats.map((stat) => (

                            <div
                                key={stat.label}
                                className="
                                    bg-transparent

                                    rounded-2xl

                                    py-5

                                    text-center

                                    transition-all

                                    duration-500

                                    hover:-translate-y-1

                                    hover:bg-neon-purple/10
                                "
                            >

                                <h3 className="text-3xl font-black gradient-text">

                                    {stat.value}

                                </h3>

                                <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-white">

                                    {stat.label}

                                </p>

                            </div>

                        ))}

                    </div>

                </motion.div>

                {/* Footer */}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/30 hover:text-white/80 transition-all duration-500"
                >

                    <span>TRS Crew Portal</span>

                </motion.div>

            </div>

        </motion.div>

    </AnimatePresence>
);
};

export default LoadingScreen;
