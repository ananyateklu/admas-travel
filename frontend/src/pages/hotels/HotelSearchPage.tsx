import { useState } from 'react';
import { motion } from 'framer-motion';
import { HotelSearch } from '../../components/hotels/HotelSearch';
import { HotelSearchResults } from '../../components/hotels/HotelSearchResults';
import { HotelSearchResult, HotelSearchResponse } from '../../types/hotelTypes';

export default function HotelSearchPage() {
    const [searchResults, setSearchResults] = useState<HotelSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (results: HotelSearchResponse) => {
        setIsLoading(true);
        try {
            if (results.status && results.data?.hotels) {
                setSearchResults(results.data.hotels);
            } else {
                setSearchResults([]);
            }
            setHasSearched(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-serif mb-4">Find Your Perfect Stay</h1>
                    <p className="text-lg text-gray-600">
                        Search through thousands of hotels worldwide
                    </p>
                </div>

                <div className="mb-8">
                    <HotelSearch onSearch={handleSearch} isLoading={isLoading} />
                </div>

                {hasSearched && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <HotelSearchResults results={searchResults} isLoading={isLoading} />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
} 