import React, { useEffect, Suspense, lazy, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
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
    const [showTournamentNotification, setShowTournamentNotification] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API_URL}/settings`);
                const data = await res.json();
                if (res.ok) {
                    setShowTournamentNotification(data.showTournamentNotification !== false);
                }
            } catch (error) {
                console.error('Failed to load tournament notification settings', error);
            }
        };

        fetchSettings();
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
            <Hero isAdmin={canEditHero} showTournamentNotification={showTournamentNotification} />

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
