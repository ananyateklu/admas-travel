import { motion } from 'framer-motion';
import { HotelSearchResult } from '../../types/hotelTypes';
import { HotelLoadingState } from './HotelLoadingState';
import { HotelCard } from './HotelCard';

interface HotelSearchResultsProps {
    results: HotelSearchResult[];
    isLoading: boolean;
}

export function HotelSearchResults({ results, isLoading }: HotelSearchResultsProps) {
    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <HotelLoadingState count={6} />
            </motion.div>
        );
    }

    if (!results || results.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
            >
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hotels found
                </h3>
                <p className="text-gray-600">
                    Try adjusting your search criteria and try again.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-[90rem] mx-auto">
            {results.map((hotel, index) => (
                <HotelCard
                    key={hotel.hotel_id}
                    hotel={hotel}
                    index={index}
                />
            ))}
        </div>
    );
} 