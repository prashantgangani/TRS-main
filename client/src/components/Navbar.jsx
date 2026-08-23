import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { API_URL } from '../config';
import { ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const Navbar = ({ role, setRole }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeHash, setActiveHash] = useState('');
    const [memberLoginEnabled, setMemberLoginEnabled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

const desktopNav = `
group

relative

flex
items-center
justify-center

px-3
2xl:px-2

py-2

rounded-xl

overflow-hidden

text-sm
uppercase

tracking-[0.05em]

transition-all
duration-300
ease-out

hover:-translate-y-2
hover:scale-[1.08]

active:scale-95
hover:tracking-[0.22em]

hover:bg-white/[0.05]

hover:border-white/10

border
border-transparent

whitespace-nowrap
`;

const mobileNav = `
group

flex
items-center
justify-between

rounded-xl

px-4
py-3

border
border-transparent

transition-all

duration-300

hover:bg-white/[0.04]

hover:border-white/10

hover:text-white

hover:translate-x-1
`;

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${API_URL}/settings`);
                if (response.ok) {
                    const data = await response.json();
                    setMemberLoginEnabled(data.memberLoginEnabled || false);
                }
            } catch (error) {
                console.error("Failed to fetch settings for navbar", error);
            }
        };
        fetchSettings();
    }, []);

    // Helper to handle smooth scrolling or cross-page hash navigation
    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        setActiveHash(targetId || '');

        if (location.pathname !== '/') {
            // Unconditionally navigate to home first, then append hash if needed
            navigate(`/${targetId ? `#${targetId}` : ''}`);
        } else {
            // If already on home, just scroll
            if (targetId) {
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
<>
<nav
className={`
fixed
top-4
left-1/2
-translate-x-1/2
overflow-visible
z-50

w-[96%]
max-w-[1760px]

rounded-[26px]

transition-all
duration-300
ease-[cubic-bezier(.22,.61,.36,1)]

${
scrolled
? `
py-3

xl:bg-transparent
xl:backdrop-blur-lg

bg-gradient-to-r

from-black/25

via-black/10

to-black/25
backdrop-blur-2xl

border
border-white/10

shadow-[0_20px_60px_rgba(0,0,0,.55),0_0_30px_rgba(176,38,255,.08)]

scale-[0.950]
`
:`
py-5

xl:bg-transparent

bg-gradient-to-r

from-black/25

via-black/10

to-black/25
backdrop-blur-2xl

border
border-white/10

shadow-[0_10px_40px_rgba(0,0,0,.25)]

scale-100
`
}
`}
>

    <div
    className="
    absolute
    inset-[1px]
    rounded-[25px]
    border
    border-white/[0.04]
    pointer-events-none
    "
/>
{/* NEW - Inner Glass Depth */}
<div
    className="
        absolute
        inset-[1px]

        rounded-[25px]

        shadow-[

            inset_0_1px_0_rgba(255,255,255,0.08),

            inset_0_-1px_0_rgba(0,0,0,0.35)

        ]

        pointer-events-none
    "
/>
    <div
className="
absolute
inset-0

rounded-[26px]

bg-gradient-to-r

from-neon-purple/[0.09]

via-transparent

to-electric-blue/[0.09]

pointer-events-none
animate-pulse
"
/>

<div
className="
absolute

bottom-0
left-1/2

-translate-x-1/2

w-[35%]
h-px

bg-gradient-to-r

from-transparent

via-neon-purple

to-transparent

animate-pulse

pointer-events-none
"
/>

<div
className="
absolute

bottom-0
left-1/2

-translate-x-1/2

w-[70%]
h-px

bg-gradient-to-r

from-transparent

via-neon-purple/30

to-transparent

pointer-events-none
"
/>

            <div className="
relative

w-full

max-w-[1800px]

mx-auto

px-5
lg:px-8

flex

items-center

">
                {/* Logo */}
                <Link to="/" onClick={(e) => handleNavClick(e, null)} className="flex items-center gap-2 sm:gap-3 cursor-pointer group flex-shrink-0 mr-8">
                    <div className={`
relative
w-8 h-8

sm:w-10 sm:h-10

${scrolled ? "lg:w-10 lg:h-10" : "lg:w-12 lg:h-12"}
flex-shrink-0
rounded-full
overflow-hidden
border-2
border-white/20
shadow-[

0_10px_25px_rgba(0,0,0,.45),

0_0_18px_rgba(176,38,255,.12)

]
group-hover:ring-4
group-hover:ring-neon-purple/20
group-hover:brightness-110
group-hover:scale-[1.25]
group-hover:-rotate-6
group-hover:border-neon-purple
group-hover:shadow-[

0_20px_40px_rgba(0,0,0,.45),

0_0_28px_rgba(176,38,255,.28)

]
transition-all
duration-500
`}>
    <div
className="
absolute
inset-0

rounded-2xl

bg-gradient-to-br

from-neon-purple/10

via-transparent

to-electric-blue/10

opacity-0

group-hover:opacity-100

transition-all

duration-500
"
/>
                        <div
className="
absolute

inset-0

rounded-full

blur-xl

bg-neon-purple/20

opacity-0

group-hover:opacity-100

transition-all

duration-700
"
/>

<div
className="
absolute

top-0
left-0

w-full
h-1/2

rounded-full

bg-gradient-to-b

from-white/15

to-transparent

opacity-0

group-hover:opacity-100

transition-all

duration-500
"
/>
                        <img src="/TRS_LOGO.png" alt="TRS Logo" className="w-full h-full object-contain bg-black group-hover:scale-125 transition-all
duration-500" />
                    </div>
                    <div className="flex flex-col justify-center">
    <span className={`font-heading font-black text-[12px] sm:text-sm md:text-lg ${scrolled ? "lg:text-xl" : "lg:text-2xl"} tracking-widest sm:tracking-[0.2em] text-white group-hover:text-glow group-hover:tracking-[0.28em] drop-shadow-[0_0_20px_rgba(255,255,255,.25)] leading-none transition-all whitespace-nowrap duration-500 overflow-hidden text-ellipsis`}>
                {scrolled
    ? "TRS"
    : "TRS Crew"}
    </span>

    <span className="hidden md:block text-[10px] uppercase tracking-[0.35em] text-white/40 mt-1 group-hover:text-electric-blue/60 transition-all duration-500">
        EST. 2024
    </span>
</div>
                </Link>

                {/* Desktop Links */}
                <div
    className="
        hidden
        2xl:block

        ml-0
        mr-8

        w-px
        h-10

        bg-gradient-to-b

        from-transparent
        via-white/15
        to-transparent
    "
/>
                <div className="hidden xl:flex flex-shrink-0 items-center justify-end gap-2 xl:gap-3 2xl:gap-5 ml-auto">
                    <div className="hidden 2xl:flex items-center gap-4 mr-6 group">

    <div
className="
flex
items-center
gap-3

px-4
py-2

rounded-2xl

bg-white/[0.03]

border
border-white/10

backdrop-blur-xl

transition-all
duration-500

hover:border-neon-purple/40

group
"
>

<div className="relative">

<span className="w-2 h-2 rounded-full bg-neon-green block group-hover:bg-neon-red transition-all duration-500"/>

<span
className="
absolute
inset-0

rounded-full

bg-neon-green

group-hover:bg-neon-red

transition-all

duration-500

animate-ping

opacity-40
"
/>

</div>

<div className="flex flex-col">

<span
className="
text-[8px]

tracking-[0.35em]

uppercase

text-neon-green

group-hover:text-neon-red

transition-all

duration-500
"
>
LIVE
</span>

<span
className="
text-[10px]

tracking-[0.18em]

text-white/80

group-hover:text-neon-purple

transition-all

duration-500
"
>
Crew Online
</span>

</div>

</div>
    </div>
                    {role !== 'smartadmin' && (
                        <>
                            <a href="#meets" onClick={(e) => handleNavClick(e, 'meets')} className={`${desktopNav} ${location.pathname === '/' && activeHash === 'meets' ? 'text-neon-purple text-glow-purple' : 'text-white/70 hover:text-white hover:text-glow'}`}><span className="relative"> Meets</span></a>
                            <a href="#event-archives" onClick={(e) => handleNavClick(e, 'event-archives')} className={`${desktopNav} ${location.pathname === '/' && activeHash === 'event-archives' ? 'text-neon-purple text-glow-purple' : 'text-white/70 hover:text-white hover:text-glow'}`}><span className="relative"> Events</span></a>
                            <a href="#community" onClick={(e) => handleNavClick(e, 'community')} className={`${desktopNav} ${location.pathname === '/' && activeHash === 'community' ? 'text-neon-purple text-glow-blue' : 'text-white/70 hover:text-white hover:text-glow'}`}>Community</a>
                            <Link
  to="/members"
  onClick={() => setActiveHash('')}
  className={`${desktopNav}  ${
    location.pathname === '/members'
      ? 'gradient-text'
      : 'text-white/70 hover:text-white hover:text-glow'
  }`}
>
  Members
</Link>
                            <Link to="/tournament" onClick={() => setActiveHash('')} className={`${desktopNav} ${location.pathname.startsWith('/tournament') ? 'text-neon-purple text-glow-purple' : 'text-white/70 hover:text-white hover:text-glow'}`}>Tournament</Link>
                            <Link to="/laws" onClick={() => setActiveHash('')} className={`${desktopNav} ${location.pathname === '/laws' ? 'text-neon-red text-glow-red' : 'text-white/70 hover:text-white hover:text-glow'}`}>Laws</Link>
                            <Link to="/memes" onClick={() => setActiveHash('')} className={`${desktopNav} ${location.pathname === '/memes' ? 'text-[#FF00FF] text-glow-purple' : 'text-white/70 hover:text-white hover:text-glow'}`}>Memes</Link>
                            <Link to="/timezones" onClick={() => setActiveHash('')} className={`${desktopNav} ${location.pathname === '/timezones' ? 'active bg-gradient-to-r from-electric-blue via-white to-electric-blue bg-clip-text text-transparent' : 'text-white/70 hover:text-white hover:text-glow'}`}>Timezone</Link>
                        </>
                    )}
                    {role === 'user' && (

                        <>
                            <Link to="/feedback" onClick={() => setActiveHash('')} className={`${desktopNav} ${location.pathname === '/feedback' ? 'active bg-gradient-to-l from-electric-blue via-white to-neon-purple bg-clip-text text-transparent' : 'text-white/70 hover:text-white hover:text-glow'}`}>Feedbacks</Link>                            
                            {memberLoginEnabled && (
                                <Link to="/member-login" onClick={() => setActiveHash('')} className={`${desktopNav} ${location.pathname === '/member-login' ? 'bg-neon-purple/20 text-white border-neon-purple shadow-[0_0_15px_rgba(176,38,255,0.4)]' : 'bg-transparent text-white/90 border-white/20 hover:border-neon-purple hover:shadow-[0_0_20px_rgba(176,38,255,0.5)]'}`}>
                                        <div
        className="
        absolute
        inset-0

        bg-gradient-to-r
        from-neon-purple/0
        via-neon-purple/10
        to-neon-purple/0

        opacity-0

        group-hover:opacity-100

        transition-opacity
        duration-500

        pointer-events-none
        "
    />
                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-purple/0 via-neon-purple/20 to-neon-purple/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></span>
                                    <span className="relative z-10 flex items-center gap-2">
                                        <ShieldCheck
    size={14}
    className="
    text-neon-purple

    group-hover:rotate-12

    transition-transform
    duration-300
    "
/>


    <span className="flex flex-col leading-none">
        <span className="text-[11px] uppercase tracking-[0.2em]">
            Crew Portal
        </span>

        <span className="text-[8px] text-white/40 tracking-widest mt-1">
            Authorized Members
        </span>
    </span>
                                    </span>
                                </Link>
                            )}
                        </>
                    )}
                    {role === 'member' && (
                        <Link to="/member-dashboard" onClick={() => setActiveHash('')} className={`${desktopNav} ${location.pathname === '/member-dashboard' ? 'text-neon-purple text-glow-purple' : 'text-neon-purple/70 hover:text-neon-purple hover:text-glow-purple'}`}>Garage Sync</Link>
                    )}
                    {role !== 'user' && role !== 'smartadmin' && role !== 'member' && (
    <Link
        to="/manage-feedbacks"
        onClick={() => setActiveHash('')}
        className={`${desktopNav} ${
            location.pathname === '/manage-feedbacks'
                ? 'active bg-gradient-to-l from-electric-blue via-white to-neon-purple bg-clip-text text-transparent'
                : 'text-white/70 hover:text-white hover:text-glow'
        }`}
    >
        Feedbacks
    </Link>
)}
                    {role === 'superadmin' && (
                        <Link to="/controls" onClick={() => setActiveHash('')} className={`${desktopNav} ${location.pathname === '/controls' ? 'text-neon-purple text-glow-purple' : 'text-white/70 hover:text-white hover:text-glow'}`}>Controls</Link>
                    )}
                    {role === 'smartadmin' && (
                        <span className={`group relative text-sm uppercase tracking-widest transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.1]
rounded-xl px-2 py-1 hover:scale-[1.1] whitespace-nowrap text-neon-purple text-glow-purple`}>Smart Controls</span>
                    )}

                    {role === 'user' && (

<Link
    to="/admin-login"
    onClick={() => setActiveHash('')}
    className={`
        group

        flex
        items-center
        gap-2

        px-3
        py-2

        rounded-full

        border

        transition-all
        duration-500
        overflow-hidden

        ${
            location.pathname === "/admin-login"
                ? "border-red-500 bg-red-500/10 text-red-400"
                : "border-white/10 text-white/50 hover:border-red-500 hover:text-red-400 hover:bg-red-500/10"
        }
    `}
>

    <ShieldCheck
    size={15}
    className="
        group-hover:rotate-12
        group-hover:scale-110
        transition-all
        duration-300
    "
/>
<div className="relative">

    <span className="block w-2 h-2 rounded-full bg-red-500" />

    <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />

</div>

    <span
    className="
        max-w-0
        overflow-hidden
        whitespace-nowrap

        group-hover:max-w-20

        transition-all
        duration-500

        text-[10px]
        font-black
        uppercase
        tracking-[0.35em]
    "
>
    ADMIN
</span>

</Link>

)}

                    {role !== "user" && (
  <div
    className="
      ml-5

      flex
      items-center

      rounded-2xl

      border
      border-white/10

      bg-white/[0.03]

      backdrop-blur-xl

      shadow-[0_10px_30px_rgba(0,0,0,.35)]

      overflow-hidden

      transition-all
      duration-500

      hover:border-neon-red/40
      hover:shadow-[0_15px_40px_rgba(255,51,102,.18)]
    "
  >
    {/* Role */}

    <div
  className="
    flex
    items-center
    gap-3

    px-4
    py-2.5
  "
>

  <div className="relative">

    <span className="block w-2 h-2 rounded-full bg-neon-green" />

    <span
      className="
        absolute
        inset-0

        rounded-full

        bg-neon-green

        animate-ping

        opacity-60
      "
    />

  </div>

  <div className="flex flex-col leading-none">

    <span className="text-[8px] uppercase tracking-[0.3em] text-white/40">
      Logged In
    </span>

    <span
      className="
        text-[11px]
        font-black

        uppercase

        tracking-[0.22em]

        text-electric-blue
      "
    >
      {role}
    </span>

  </div>

</div>

    {/* Divider */}

    <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

    {/* Logout */}

    <button
      onClick={() => {
        localStorage.removeItem("trs_role");
                localStorage.removeItem("token");
                localStorage.removeItem("trs_username");
                localStorage.removeItem("trs_tournament_member_role");
                localStorage.removeItem("trs_tournament_acceptance");
                localStorage.removeItem("trs_tournament_participant");
        setRole("user");
        navigate("/");
      }}
      className="
        group

        flex
        items-center
        gap-2

        px-4
        py-2.5

        text-[10px]
        font-bold
        uppercase
        tracking-[0.25em]

        text-neon-red

        hover:bg-neon-red/50
        hover:text-white

        transition-all
        duration-300
      "
    >
      <span>Logout</span>

<svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
>
    <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
</svg>
    </button>
  </div>
)}
                </div>

                {/* Mobile Toggle */}
                <div className="xl:hidden ml-auto">
    <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="
            group

            w-11
            h-11

            rounded-2xl

            border
            border-white/10

            bg-transparent

            backdrop-blur-2xl

            shadow-[0_10px_25px_rgba(0,0,0,.35)]

            flex
            items-center
            justify-center

            transition-all
            duration-300

            hover:border-neon-purple
            hover:bg-neon-purple/10
            hover:shadow-[0_0_20px_rgba(176,38,255,.18)]
        "
    >
        <div
className="
absolute

inset-0

rounded-2xl

bg-gradient-to-br

from-neon-purple/10

to-electric-blue/10

opacity-0

group-hover:opacity-100

transition-all
"
/>
<div
className={`
transition-all
duration-500

${
mobileMenuOpen
?
"rotate-180 scale-110"
:
"rotate-0 scale-100 group-hover:rotate-90 group-hover:scale-110"
}
`}
>
            {mobileMenuOpen ? (
                <X size={22} />
            ) : (
                <Menu size={22} />
            )}
        </div>
    </button>
</div>
            </div>                
        </nav>

        {/* Mobile Menu */}
            <div
className={`
xl:hidden

fixed
z-[60]
top-24

left-1/2
-translate-x-1/2

w-[92%]
max-w-md

rounded-[26px]

border
border-white/10

bg-gradient-to-r

from-black/25

via-black/10

to-black/25

backdrop-blur-3xl

shadow-[0_20px_50px_rgba(0,0,0,.35)]

overflow-hidden

p-6

flex
flex-col
gap-3

origin-top

transition-all
duration-500
ease-[cubic-bezier(.22,.61,.36,1)]

${
mobileMenuOpen
? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
: "opacity-0 scale-95 -translate-y-3 pointer-events-none"
}
`}
>

    <div
    className="
        absolute
        inset-[1px]

        rounded-[25px]

        border
        border-white/[0.04]

        pointer-events-none
    "
/>

<div
    className="
        absolute
        inset-0

        rounded-[26px]

        bg-gradient-to-br

        from-neon-purple/[0.03]

        via-transparent

        to-electric-blue/[0.03]

        pointer-events-none
    "
/>
                    <div className="relative z-10 mb-6">

    <div className="flex items-center justify-between">

        <div>
            <div className="text-2xl font-black tracking-[0.35em] text-white">
                TRS
            </div>

            <div className="text-[10px] uppercase tracking-[0.35em] text-white/40 mt-1">
                Crew Navigation
            </div>
        </div>

        <div className="flex items-center gap-2">

            <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-70 animate-ping"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-green"></span>
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-neon-green">
                LIVE
            </span>

        </div>

    </div>

    <div className="mt-5 h-px w-full bg-gradient-to-r from-neon-purple/50 via-white/20 to-electric-blue/50" />

</div>

{role !== 'smartadmin' && (
                        <>
                            <a href="#meets" className={`${mobileNav} ${location.pathname === '/' && activeHash === 'meets' ? 'text-neon-purple' : 'text-white/80 hover:text-white'}`} onClick={(e) => handleNavClick(e, 'meets')}><span className="relative"> Meets</span></a>
                            <a href="#event-archives" className={`${mobileNav} ${location.pathname === '/' && activeHash === 'garage-intro' ? 'text-neon-purple' : 'text-white/80 hover:text-white'}`} onClick={(e) => handleNavClick(e, 'event-archives')}><span className="relative">Events</span></a>
                            <a href="#community" className={`${mobileNav} ${location.pathname === '/' && activeHash === 'community' ? 'text-neon-purple' : 'text-white/80 hover:text-white'}`}onClick={(e) => handleNavClick(e, 'community')}>Community</a>
                            <Link to="/members" className={`nav-link-premium ${mobileNav} ${location.pathname === '/members' ? 'text-electric-blue' : 'text-white/80 hover:text-white'}`} onClick={() => { setMobileMenuOpen(false); setActiveHash(''); }}>Members</Link>
                            <Link to="/laws" className={`nav-link-premium ${mobileNav} ${location.pathname === '/laws' ? 'text-neon-red/75' : 'text-white/80 hover:text-white'}`} onClick={() => { setMobileMenuOpen(false); setActiveHash(''); }}>Laws</Link>
                            <Link to="/memes" className={`nav-link-premium ${mobileNav} ${location.pathname === '/memes' ? 'text-[#FF00FF]' : 'text-white/80 hover:text-white'}`} onClick={() => { setMobileMenuOpen(false); setActiveHash(''); }}>Memes</Link>
                            <Link to="/timezones" className={`nav-link-premium ${mobileNav} ${location.pathname === '/timezones' ? 'text-white' : 'text-white/80 hover:text-white'}`} onClick={() => { setMobileMenuOpen(false); setActiveHash(''); }}>Timezone</Link>
                        </>
                    )}
                    
                    {role === 'user' && (

                        <>
                            <Link to="/feedback" className={`nav-link-premium ${mobileNav} ${location.pathname === '/feedback' ? 'text-electric-blue' : 'text-white/80 hover:text-white'}`} onClick={() => { setMobileMenuOpen(false); setActiveHash(''); }}>Feedback</Link>
                            {memberLoginEnabled && (
                                <Link to="/member-login" className={`relative overflow-hidden mt-2 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest rounded-2xl border transition-all duration-300 ${location.pathname === '/member-login' ? 'bg-neon-purple/20 text-white border-neon-purple shadow-[0_0_15px_rgba(176,38,255,0.4)]' : 'bg-black/30 text-white/90 border-white/20 hover:border-neon-purple hover:bg-neon-purple/10'}`} onClick={() => { setMobileMenuOpen(false); setActiveHash(''); }}>
                                    <span className="w-2 h-2 bg-neon-purple animate-pulse shadow-[0_0_8px_rgba(176,38,255,1)] rounded-2xl

bg-gradient-to-r

from-neon-purple/15

to-electric-blue/10

border

border-neon-purple/30"></span>
                                    Member Access
                                </Link>
                            )}

                            <Link
    to="/admin-login"
    onClick={() => {
        setMobileMenuOpen(false);
        setActiveHash('');
    }}
    className={`
group

relative

flex
justify-center
items-center
gap-2

px-3
py-2

rounded-2xl

border
border-red-500/20

bg-red-500/[0.03]

text-red-400/70

hover:text-red-300

hover:border-red-500

hover:bg-red-500/10

hover:shadow-[0_0_20px_rgba(239,68,68,.35)]

transition-all
duration-500
`}
>

    <ShieldCheck
    size={14}
    className="
    group-hover:rotate-12
    group-hover:scale-110
    transition-all
    duration-300
    "
/>


    Admin Login


</Link>
                        </>

                        
                    )}
                    {role === 'member' && (
                        <Link to="/member-dashboard" className={`nav-link-premium text-sm font-bold uppercase tracking-widest ${location.pathname === '/member-dashboard' ? 'text-neon-purple' : 'text-neon-purple/80 hover:text-neon-purple'}`} onClick={() => { setMobileMenuOpen(false); setActiveHash(''); }}>Garage Sync</Link>
                    )}
                    {role !== 'user' && role !== 'smartadmin' && role !== 'member' && (
                        <Link to="/manage-feedbacks" className={`nav-link-premium ${mobileNav} ${location.pathname === '/manage-feedbacks' ? 'text-green-400' : 'text-white/80 hover:text-white'}`} onClick={() => { setMobileMenuOpen(false); setActiveHash(''); }}>Feedbacks</Link>
                    )}
                    {role === 'superadmin' && (
                        <Link to="/controls" className={`nav-link-premium ${mobileNav} ${location.pathname === '/controls' ? 'text-neon-purple' : 'text-white/80 hover:text-white'}`} onClick={() => { setMobileMenuOpen(false); setActiveHash(''); }}>Controls</Link>
                    )}
                    {role === 'smartadmin' && (
                        <span className={`${mobileNav} text-neon-purple`} onClick={() => setMobileMenuOpen(false)}>Smart Controls</span>
                    )}

                    {role !== 'user' && (
                        <div className="mt-4 flex flex-col gap-2">
                            <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Logged in as {role}</span>
                            <button onClick={() => { localStorage.removeItem('trs_role'); localStorage.removeItem('token'); localStorage.removeItem('trs_username'); localStorage.removeItem('trs_tournament_member_role'); localStorage.removeItem('trs_tournament_acceptance'); localStorage.removeItem('trs_tournament_participant'); setRole('user'); setMobileMenuOpen(false); navigate('/'); }} className="w-full py-2 bg-neon-red/20 text-neon-red text-xs hover:tracking-[0.25em] font-bold uppercase tracking-widest rounded border border-neon-red/50 hover:text-white hover:bg-neon-red/60 transition-all duration-500">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
        </>
    );
};

export default Navbar;
