// Components
import { AirlinesSection } from '../components/home/AirlinesSection';
import { VacationDestinations } from '../components/home/VacationDestinations';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedDestinations } from '../components/home/FeaturedDestinations';
import { Highlights } from '../components/home/Highlights';
import { NaturalWonders } from '../components/home/NaturalWonders';

// Data
import { partnerAirlines } from '../data/airlines';
import { vacationRegions, ethiopianRegions } from '../data/destinations';
import { featuredDestinations } from '../data/featured';
import { highlights } from '../data/highlights';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
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
        </div>
    );
} 