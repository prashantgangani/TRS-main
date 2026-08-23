import React, { useEffect, Suspense, lazy, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import Hero from './Hero';
import CountdownTimer from './CountdownTimer';
import UpcomingMeets from './UpcomingMeets';
import { API_URL } from '../config';

// Lazy load below-the-fold components
const MeetThemesShowcase = lazy(() => import('./MeetThemesShowcase'));
const TRSLegacy = lazy(() => import('./TRSLegacy'));
const CommunityHub = lazy(() => import('./CommunityHub'));

const FallbackLoader = () => (
    <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-2 border-white/10 border-t-electric-blue rounded-full animate-spin"></div>
    </div>
);

const Home = ({ canEditHero, canPublishMeet }) => {
    const location = useLocation();
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        const fetchWinner = async () => {
            try {
                const res = await fetch(`${API_URL}/tournament/featured`);
                const data = await res.json();
                if (res.ok && data?.winner) {
                    setWinner(data.winner);
                }
            } catch (error) {
                console.error('Failed to load tournament winner', error);
            }
        };

        fetchWinner();
    }, []);

    useEffect(() => {
        if (location.hash) {
            const elementId = location.hash.replace('#', '');
            
            const scrollToElement = () => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            };

            // Attempt scrolling at multiple intervals to account for 
            // data fetching (UpcomingMeets, Countdown) and lazy-loaded components
            // changing the DOM height
            const timeout1 = setTimeout(scrollToElement, 100);
            const timeout2 = setTimeout(scrollToElement, 600);
            const timeout3 = setTimeout(scrollToElement, 1500);

            return () => {
                clearTimeout(timeout1);
                clearTimeout(timeout2);
                clearTimeout(timeout3);
            };
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location]);

    return (
        <main>
            <Hero isAdmin={canEditHero} />
            <section className="mx-auto max-w-6xl px-6 pb-8 pt-2">
                <div className="rounded-3xl border border-neon-purple/30 bg-gradient-to-r from-neon-purple/15 via-white/[0.03] to-electric-blue/15 p-6 md:p-8">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neon-purple/15 text-neon-purple shadow-[0_0_30px_rgba(176,38,255,0.25)]">
                                <Trophy size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.35em] text-neon-purple/80">Community Feature</p>
                                <h2 className="mt-2 text-2xl font-black md:text-4xl">Participate in the Car Tournament</h2>
                                <p className="mt-2 max-w-2xl text-sm text-white/70 md:text-base">Upload your car, collect votes, and get a chance to be featured on the homepage.</p>
                            </div>
                        </div>
                        <Link to="/tournament" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-neon-purple to-purple-600 px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition hover:scale-[1.02]">
                            Participate Now
                        </Link>
                    </div>
                </div>
            </section>

            {winner && (
                <section className="mx-auto max-w-6xl px-6 pb-8">
                    <div className="overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-r from-amber-400/10 via-white/[0.02] to-neon-purple/10">
                        <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
                            <div className="relative h-72 md:h-full min-h-[280px]">
                                <img src={winner.image} alt={winner.carName} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-col justify-center p-6 md:p-8">
                                <p className="text-[10px] uppercase tracking-[0.35em] text-amber-300">🏆 Car of the Tournament</p>
                                <h3 className="mt-4 text-3xl font-black md:text-5xl">{winner.carName}</h3>
                                <p className="mt-3 text-white/70">Congratulations to {winner.ownerName}! This car received the highest number of votes.</p>
                                <div className="mt-5 inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm font-semibold text-amber-200">
                                    {winner.votes || 0} total votes
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            <CountdownTimer />
            <UpcomingMeets isAdmin={canPublishMeet} />
            <Suspense fallback={<FallbackLoader />}>
                <MeetThemesShowcase />
                <TRSLegacy />
                <CommunityHub />
            </Suspense>
        </main>
    );
};

export default Home;
