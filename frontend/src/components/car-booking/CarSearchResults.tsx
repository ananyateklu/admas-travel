import { motion } from 'framer-motion';
import { CarSearchResult } from '../../types/carSearch';
import { CarCard } from './CarCard';
import { CarLoadingState } from './CarLoadingState';

interface CarSearchResultsProps {
    results: CarSearchResult[];
    isLoading?: boolean;
    onSelect: (car: CarSearchResult) => void;
    className?: string;
}

export function CarSearchResults({
    results,
    isLoading = false,
    onSelect,
    className = ''
}: CarSearchResultsProps) {
    if (isLoading) {
        return <CarLoadingState count={3} />;
    }

    if (!results.length) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
            >
                <svg
                    className="w-16 h-16 text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No cars available
                </h3>
                <p className="text-sm text-gray-500 max-w-md">
                    We couldn't find any cars matching your search criteria. Try adjusting your search parameters or try a different location.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 ${className}`}
        >
            {results.map((car) => (
                <motion.div
                    key={car.vehicle_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <CarCard car={car} onSelect={onSelect} />
                </motion.div>
            ))}
        </motion.div>
    );
} 