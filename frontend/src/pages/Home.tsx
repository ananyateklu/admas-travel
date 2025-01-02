import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

// Components
const AirlinesSection = lazy(() => import('../components/home/AirlinesSection').then(module => ({ default: module.AirlinesSection })));
const VacationDestinations = lazy(() => import('../components/home/VacationDestinations').then(module => ({ default: module.VacationDestinations })));
const HeroSection = lazy(() => import('../components/home/discover-section/HeroSection').then(module => ({ default: module.HeroSection })));
const FeaturedDestinations = lazy(() => import('../components/home/FeaturedDestinations').then(module => ({ default: module.FeaturedDestinations })));
const Highlights = lazy(() => import('../components/home/Highlights').then(module => ({ default: module.Highlights })));
const NaturalWonders = lazy(() => import('../components/home/NaturalWonders').then(module => ({ default: module.NaturalWonders })));

// Data
import { partnerAirlines } from '../data/airlines';
import { vacationRegions, ethiopianRegions } from '../data/destinations';
import { featuredDestinations } from '../data/featured';
import { highlights } from '../data/highlights';

// Loading fallback component
function SectionLoader() {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-gray-50">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

export default function Home() {
    return (
        <div
            className="min-h-screen bg-white"
            style={{
                transform: 'translate3d(0,0,0)',
                backfaceVisibility: 'hidden',
                perspective: '1000px'
            }}
        >
            <Suspense fallback={<SectionLoader />}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Partner Airlines */}
                    <AirlinesSection airlines={partnerAirlines} />

                    {/* Vacation Destinations */}
                    <VacationDestinations
                        regions={vacationRegions}
                        ethiopianRegions={ethiopianRegions}
                    />

                    {/* Hero Section */}
                    <HeroSection />

                    {/* Featured Destinations */}
                    <FeaturedDestinations destinations={featuredDestinations} />

                    {/* Highlights */}
                    <Highlights highlights={highlights} />

                    {/* Natural Wonders */}
                    <NaturalWonders />
                </motion.div>
            </Suspense>
        </div>
    );
} 