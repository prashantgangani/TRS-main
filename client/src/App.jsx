import { Link } from "react-router-dom";
import { Users, CalendarDays, Camera, ArrowUp } from "lucide-react";
import FooterBG from "/footer.png";
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Members from './pages/Members';
import Showroom from './pages/Showroom';
import Garage from './pages/Garage';
import AdminAddMeet from './pages/AdminAddMeet';
import ScrollToTop from './components/ScrollToTop';
import Laws from './pages/Laws';
import Timezones from './pages/Timezones';
import AdminLogin from './pages/AdminLogin';
import SubmitFeedback from './pages/SubmitFeedback';
import ManageFeedbacks from './pages/ManageFeedbacks';
import AdminLogs from './pages/AdminLogs';
import ValidCars from './pages/ValidCars';
import AdminCarLibrary from './pages/AdminCarLibrary';
import PreviousMeets from './pages/PreviousMeets';
import SmartAdminPanel from './pages/SmartAdminPanel';
import Controls from './pages/Controls';
import VotingSystem from './pages/VotingSystem';
import StaffCredentials from './pages/StaffCredentials';
import PasswordManager from './pages/PasswordManager';
import ManageCrewMembers from './pages/ManageCrewMembers';
import MemberLogin from './pages/MemberLogin';
import MemberDashboard from './pages/MemberDashboard';
import Memes from './pages/Memes';
import Tournament from './pages/Tournament';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import { API_URL } from './config';
import CursorRing from './components/CursorRing';

function App() {
  const location = useLocation();
  const [role, setRole] = useState(localStorage.getItem('trs_role') || 'user');
  const [settings, setSettings] = useState(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  
  // Skip loader for login paths so direct URL visits don't force a 5 second wait
  const skipLoaderPaths = ['/admin-login', '/member-login'];
const hasSeenLoader = sessionStorage.getItem("trs-loader-shown");

const [showLoader, setShowLoader] = useState(
    !skipLoaderPaths.includes(location.pathname) && !hasSeenLoader
);
  
  useEffect(() => {
    const handleStorageChange = () => {
      const storedRole = localStorage.getItem('trs_role') || 'user';
      if (storedRole !== role) {
        setRole(storedRole);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [role]);

  useEffect(() => {
    const minimumLoaderTime = 0;

Promise.all([
    fetch(`${API_URL}/settings`).then(res => res.json()),
    new Promise(resolve => setTimeout(resolve, minimumLoaderTime))
])
      .then(([data]) => {
        setSettings(data);
        setIsAppLoading(false);
      })
      .catch(err => {
        console.error("Failed to load settings:", err);
        setIsAppLoading(false);
      });
  }, []);

  const isAdmin = role === 'admin' || role === 'superadmin';
  const isSuperAdmin = role === 'superadmin';
  const isSmartAdmin = role === 'smartadmin';
  const isPasswordManager = role === 'passwordmanager';

  // Smart Admin Feature Toggles
  const canEditHero = isSuperAdmin || (isAdmin && settings?.editHero !== false);
  const canPublishMeet = isSuperAdmin || (isAdmin && settings?.publishMeet !== false);
  const canUpdateValidCars = isSuperAdmin || (isAdmin && settings?.updateValidCars !== false);
  const canManageGarage = isSuperAdmin || (isAdmin && settings?.manageGarage !== false);
  const canManageShowroom = isSuperAdmin || (isAdmin && settings?.manageShowroom !== false);
  const canManageLaws = isSuperAdmin || (isAdmin && settings?.manageLaws !== false);
  const canManageTimezones = isSuperAdmin || (isAdmin && settings?.manageTimezones !== false);
  const canManagePreviousMeets = isSuperAdmin || (isAdmin && settings?.managePreviousMeets !== false);
  const canArrangeGarage = isSuperAdmin || (isAdmin && settings?.allowAdminCarArrange !== false);
  const canHideGarageCars = isSuperAdmin || (isAdmin && settings?.hideGarageCars !== false);
  const canManageMemes = isSuperAdmin || (isAdmin && settings?.manageMemes !== false);

  const [clickCount, setClickCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  const handleSecretClick = () => {

    const nextCount = clickCount + 1;

    if (nextCount >= 5) {

        setShowSecret(true);
        setClickCount(0);

        setTimeout(() => {
            setShowSecret(false);
        }, 5000);

    } else {

        setClickCount(nextCount);

    }

};
  if (isSmartAdmin) {
    return (
      <>
        {showLoader && (
          <LoadingScreen 
            isLoading={isAppLoading} 
            onComplete={() => {

    sessionStorage.setItem("trs-loader-shown", "true");

    setShowLoader(false);

}}
          />
        )}
        <div className="relative w-full min-h-screen bg-deep-black text-white selection:bg-neon-purple/50 transition-all duration-500">
        <CursorRing />
          {location.pathname !== "/password-manager" && <Navbar role={role} setRole={setRole} />}
          <Routes>
            {/* Force routing all unhandled smartadmin paths back to their control panel */}
            <Route path="*" element={<SmartAdminPanel />} />
          </Routes>
        </div>
      </>
    );
  }

  if (isPasswordManager) {
    return (
      <>
        {showLoader && (
          <LoadingScreen 
            isLoading={isAppLoading} 
            onComplete={() => setShowLoader(false)} 
          />
        )}
        <div className="relative w-full min-h-screen bg-deep-black text-white selection:bg-electric-blue/50">
          {location.pathname !== "/password-manager" && <Navbar role={role} setRole={setRole} />}
          <Routes>
            {/* Force routing all unhandled passwordmanager paths back to their control panel */}
            <Route path="*" element={<PasswordManager />} />
          </Routes>
        </div>
      </>
    );
  }

  return (
  <>
    {showLoader && (
      <LoadingScreen
        isLoading={isAppLoading}
        onComplete={() => setShowLoader(false)}
      />
    )}

    <div className="relative w-full min-h-screen bg-deep-black text-white selection:bg-neon-purple/50">

      <CursorRing />

      <ScrollToTop />

      {location.pathname !== "/password-manager" &&
        <Navbar role={role} setRole={setRole} />
      }

      <Routes>
        <Route path="/" element={<Home canEditHero={canEditHero} canPublishMeet={canPublishMeet} />} />
        <Route path="/garage" element={<Garage isAdmin={canManageGarage} isSuperAdmin={isSuperAdmin} canArrangeGarage={canArrangeGarage} canHideGarageCars={canHideGarageCars} />} />
        <Route path="/garage/hidden" element={<Garage isAdmin={canManageGarage} isSuperAdmin={isSuperAdmin} canArrangeGarage={canArrangeGarage} canHideGarageCars={canHideGarageCars} isHiddenMode={true} />} />
        <Route path="/members" element={<Members isSuperAdmin={isSuperAdmin} />} />
        <Route path="/laws" element={<Laws isAdmin={canManageLaws} isSuperAdmin={isSuperAdmin} />} />
        <Route path="/timezones" element={<Timezones isAdmin={canManageTimezones} isSuperAdmin={isSuperAdmin} />} />
        <Route path="/memes" element={<Memes isAdmin={canManageMemes} isSuperAdmin={isSuperAdmin} />} />
        <Route path="/showroom" element={<Showroom isAdmin={canManageShowroom} />} />
        <Route path="/admin/add-meet" element={<AdminAddMeet isAdmin={canPublishMeet} />} />
        <Route path="/valid-cars" element={<ValidCars isAdmin={canUpdateValidCars} />} />
        <Route path="/admin/car-library" element={<AdminCarLibrary isAdmin={canUpdateValidCars} />} />
        <Route path="/previous-meets" element={<PreviousMeets isAdmin={canManagePreviousMeets} />} />
        <Route path="/admin-login" element={<AdminLogin setAuthContext={setRole} />} />
        <Route path="/feedback" element={<SubmitFeedback />} />
        <Route path="/manage-feedbacks" element={isAdmin ? <ManageFeedbacks /> : <Home />} />
        <Route path="/logs" element={isSuperAdmin ? <AdminLogs /> : <Home />} />
        <Route path="/controls" element={isSuperAdmin ? <Controls /> : <Home />} />
        <Route path="/voting-system" element={isSuperAdmin ? <VotingSystem /> : <Home />} />
        <Route path="/smart-admin" element={isSuperAdmin ? <SmartAdminPanel /> : <Home />} />
        <Route path="/staff-credentials" element={isSuperAdmin ? <StaffCredentials /> : <Home />} />
        <Route path="/password-manager" element={isSuperAdmin || role === 'passwordmanager' ? <PasswordManager /> : <Home />} />
        <Route path="/manage-crew-members" element={isSuperAdmin ? <ManageCrewMembers /> : <Home />} />
        <Route path="/member-login" element={<MemberLogin setAuthContext={setRole} />} />
        <Route path="/member-dashboard" element={role === 'member' ? <MemberDashboard setAuthContext={setRole} /> : <Home />} />
        <Route path="/tournament" element={<Tournament setAuthContext={setRole} />} />
        <Route path="/tournament/login" element={<Tournament setAuthContext={setRole} />} />
        <Route path="/tournament/upload" element={<Tournament setAuthContext={setRole} />} />
        <Route path="/tournament/vote" element={<Tournament setAuthContext={setRole} />} />
      </Routes>

<footer className="relative overflow-hidden border-t border-white/10 bg-[#090909]">

{/* Background Image */}

<div className="absolute inset-0 z-0 overflow-hidden">

    <img
        src={FooterBG}
        alt=""
        className="
            h-full
            w-full
            object-cover

            opacity-25

            blur-[2px]

            scale-110

            select-none
            pointer-events-none
        "
    />

</div>
{/* 
<div
    className="
        absolute
        inset-0
        z-0

        bg-gradient-to-b

        from-deep-black/50

        via-deep-black/25

        to-[#050505]
    "
/>
*/}
    {/* Background Glow */}
<div className="absolute inset-0 z-[1] pointer-events-none">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-neon-purple/10 blur-[140px]" />
        <div className="absolute left-0 top-1/2 w-72 h-72 bg-electric-blue/5 blur-[160px]" />

<div className="absolute right-0 bottom-0 w-72 h-72 bg-neon-purple/5 blur-[160px]" />

        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-[18rem] font-black text-white/[0.02] select-none">
            TRS
        </div>

    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">

        {/* Crew Name */}

        <div className="text-center">

            <p className="text-[11px] uppercase tracking-[0.45em] text-neon-purple hover:tracking-[0.6em] transition-all duration-500">
                Since 2024
            </p>

<img
    src="/TRS_LOGO.png"
    alt="TRS"
    className="w-20 md:w-24 mx-auto mb-8 opacity-90 hover:scale-110 hover:-rotate-6 transition duration-500"
/>
            <h2
    onClick={handleSecretClick}
    className="
        mt-4
        text-5xl
        md:text-6xl
        font-black
        font-heading
        text-transparent
        uppercase
        tracking-wider
        bg-clip-text
        bg-gradient-to-r
        from-electric-blue
        via-neon-purple
        to-neon-green
        animate-gradient-x
        bg-[length:400%_auto]
        transition-all
        duration-500
    "
>
    The Royal Sorcerers
</h2>

            <p className="mt-6 text-white/50 max-w-xl mx-auto leading-relaxed hover:text-white transition-all duration-500">
            {showSecret && (

    <div
        className="
            mt-8

            mb-8
            animate-pulse

            rounded-xl

            border

            border-neon-purple/30

            bg-neon-purple/10

            px-8

            py-6

            backdrop-blur-md
        "
    >

        <p className="text-neon-purple uppercase tracking-[0.35em] text-xs mb-3">
            Hidden Transmission
        </p>

        <h3 className="text-2xl font-black text-white">
            🚗 See you at the next meet.
        </h3>

        <p className="mt-3 text-white/60">
            Every road in Los Santos eventually leads back to TRS.
        </p>

    </div>

)}
                More than cars. More than meets.
                <br />
                Every cruise, every convoy and every late-night drive adds another page to our story.
            </p>

        </div>

        {/* Divider */}

        <div className="flex justify-center items-center gap-4 my-14">

            <div className="h-px w-24 bg-gradient-to-l from-transparent to-neon-purple" />

            <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />

            <div className="h-px w-24 bg-gradient-to-r from-transparent to-electric-blue" />

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

            <div
className="
relative
overflow-hidden

p-6

text-center

rounded-xl

bg-transparent

hover:-translate-y-3
hover:scale-[1.03]
hover:backdrop-blur-md

transition-all
duration-500

group
"
>
    <div className="
absolute
-top-10
-left-10

w-32
h-32

rounded-full

bg-neon-purple

blur-3xl

opacity-0

group-hover:opacity-100

transition-all
duration-700
"/>

<div
className="
absolute

-right-4
-bottom-4

text-8xl

font-black

text-white/[0.05]

group-hover:text-white/25

select-none

transition-all

duration-500

group-hover:scale-125
group-hover:rotate-12
"
>
TRS
</div>



                <Users className="mx-auto mb-4 text-neon-purple group-hover:scale-125
group-hover:rotate-12 transition group-hover:text-white" />

                <h3 className="text-5xl group-hover:scale-125 group-hover:rotate-12 font-black group-hover:text-neon-purple transition">
                    220+
                </h3>

                <p className="mt-2 text-xs uppercase tracking-[0.3em] group-hover:rotate-12 text-white/40 group-hover:text-neon-purple transition">
                    Members
                </p>

            </div>

            <div
className="
relative
overflow-hidden

p-6

text-center

rounded-xl

bg-transparent

hover:-translate-y-3
hover:scale-[1.03]
hover:backdrop-blur-md

transition-all
duration-500

group
"
>
    <div className="
absolute
-top-10
-left-10

w-32
h-32

rounded-full

bg-electric-blue

blur-3xl

opacity-0

group-hover:opacity-100

transition-all
duration-700
"/>

<div
className="
absolute

-right-4
-bottom-4

text-8xl

font-black

text-white/[0.05]

group-hover:text-white/25

select-none

transition-all

duration-500

group-hover:scale-125
group-hover:rotate-12
"
>
TRS
</div>

                <CalendarDays className="mx-auto mb-4 text-electric-blue group-hover:scale-125
group-hover:rotate-12 transition group-hover:text-white" />

                <h3 className="text-5xl group-hover:scale-125 group-hover:rotate-12 font-black group-hover:text-electric-blue transition">
                    120+
                </h3>

                <p className="mt-2 text-xs uppercase tracking-[0.3em] group-hover:rotate-12 text-white/40 group-hover:text-electric-blue transition">
                    Meets
                </p>

            </div>

            <div 
className="
relative
overflow-hidden

p-6

text-center

rounded-xl

bg-transparent

hover:-translate-y-3
hover:scale-[1.03]
hover:backdrop-blur-md

transition-all
duration-500

group
"
>
    <div className="
absolute
-top-10
-left-10

w-32
h-32

rounded-full

bg-neon-green

blur-3xl

opacity-0

group-hover:opacity-100

transition-all
duration-700
"/>

<div
className="
absolute

-right-4
-bottom-4

text-8xl

font-black

text-white/[0.05]

group-hover:text-white/25

select-none

transition-all

duration-500

group-hover:scale-125
group-hover:rotate-12
"
>
TRS
</div>

                <Camera className="mx-auto mb-4 text-neon-green group-hover:scale-125
group-hover:rotate-12 transition group-hover:text-white" />

                <h3 className="text-5xl group-hover:scale-125 group-hover:rotate-12 font-black group-hover:text-neon-green transition">
                    1000+
                </h3>

                <p className="mt-2 text-xs uppercase tracking-[0.3em] group-hover:rotate-12 text-white/40 group-hover:text-neon-green transition">
                    Photos
                </p>

            </div>

            <div
className="
relative
overflow-hidden

p-6

text-center

rounded-xl

bg-transparent

hover:-translate-y-3
hover:scale-[1.03]
hover:backdrop-blur-md

transition-all
duration-500

group
"
>
    <div className="
absolute
-top-10
-left-10

w-32
h-32

rounded-full

bg-oracle-gold

blur-3xl

opacity-0

group-hover:opacity-100

transition-all
duration-700
"/>

<div
className="
absolute

-right-4
-bottom-4

text-8xl

font-black

text-white/[0.05]

group-hover:text-white/25

select-none

transition-all

duration-500

group-hover:scale-125
group-hover:rotate-12
"
>
TRS
</div>

                <div className="text-3xl mb-4 group-hover:scale-125
group-hover:rotate-12 transition">
                    🎮
                </div>

                <h3 className="text-5xl group-hover:scale-125 group-hover:rotate-12 font-black bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r from-oracle-gold to-black transition">
                    PC
                </h3>

                <p className="mt-2 text-xs uppercase tracking-[0.3em] group-hover:rotate-12 text-white/40 group-hover:text-oracle-gold transition">
                    Platform
                </p>

            </div>

        </div>

        {/*GTA Road */}

<div className="relative my-14">

    <div className="border-t border-white/10"></div>

    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">

        <div className="border-t border-dashed border-white/40"></div>

    </div>

</div>

        {/* Navigation */}

        <div className="flex flex-wrap justify-center gap-8 mt-16 uppercase tracking-[0.25em] text-xs text-white/40">

            <Link to="/" className="hover:text-neon-purple hover:tracking-[0.35em] hover:-translate-y-1 transition-all duration-500">
                Home
            </Link>

            <Link to="/members" className="bg-clip-text hover:bg-gradient-to-r from-neon-purple to-electric-blue hover:tracking-[0.35em] hover:-translate-y-1 transition-all duration-500">
                Member
            </Link>

            <Link to="/laws" className="hover:text-neon-red hover:tracking-[0.35em] hover:-translate-y-1 transition-all duration-500">
                Laws
            </Link>

            <Link to="/memes" className="hover:text-[#FF00FF] hover:tracking-[0.35em] hover:-translate-y-1 transition-all duration-500">
                Meme
            </Link>

            <Link to="/timezones" className="bg-clip-text hover:bg-gradient-to-r from-electric-blue via-transparent to-electric-blue hover:tracking-[0.35em] hover:-translate-y-1 transition-all duration-500">
                Timezone
            </Link>

            <Link to="/feedback" className="bg-clip-text hover:bg-gradient-to-l from-electric-blue via-white to-neon-purple hover:tracking-[0.35em] hover:-translate-y-1 transition-all duration-500">
                Feedback
            </Link>

        </div>

        {/* Quote */}

        <div className="text-center mt-16">

            <p className="italic text-white/30 text-lg hover:text-white transition-all duration-500">
                "Every legendary crew started with one drive."
            </p>

            <p className="text-white/30 text-lg mt-8 hover:text-white transition-all duration-500">
              Crafted with ❤️ for the TRS Community            
            </p>

        </div>

        {/* Bottom */}

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">

            <div className="text-white/30 text-xs uppercase tracking-[0.25em] hover:text-white transition-all duration-500">

                © {new Date().getFullYear()} THE ROYAL SORCERERS

            </div>

            <div className="text-white/25 text-xs uppercase tracking-[0.25em] hover:text-white transition-all duration-500">

                Developed & Designed by <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-neon-purple to-neon-green bg-[length:400%_auto] animate-gradient-x"> Joyboy & Tarun</span>

            </div>

            <button
                onClick={() =>
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                    })
                }
                className="w-11 h-11 rounded-full hover:border-white hover:bg-gradient-to-b from-neon-purple/80 via-electric-blue/80 to-neon-green/80 transition flex items-center justify-center group"
            >

                <ArrowUp
                    size={18}
                    className="group-hover:-translate-y-1 group-hover:text-white group-hover:scale-125 transition-all duration-300"
                />

            </button>

        </div>

    </div>

</footer>

    </div>
    </>
  );
}

export default App;


