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
                className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg shadow-sm"
            >
                <div className="rounded-full bg-gray-50 p-3 mb-4">
                    <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 16l-3 3m0 0l3 3m-3-3h14m-5-3v6m0 0l3-3m-3 3l-3-3M3 8l3-3m0 0l3 3m-3-3v14m5-3h6m0 0l3 3m-3-3l-3 3"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Available Cars Found
                </h3>
                <p className="text-sm text-gray-500 text-center max-w-md">
                    We couldn't find any cars matching your criteria. Try adjusting your dates,
                    location, or search parameters for more options.
                </p>
                <div className="mt-6 space-x-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        Modify Search
                    </motion.button>
                </div>
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