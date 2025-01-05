import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HotelSearch } from '../../components/hotel-booking/HotelBookingSearch';
import { HotelSearchResults } from '../../components/hotel-booking/HotelBookingSearchResults';
import { HotelSearchResult, HotelSearchResponse } from '../../types/hotelTypes';
import { HotelBookingHero } from '../../components/hotel-booking/HotelBookingHero';
import bookPic from '../../assets/book.jpg';

// Animation variants for pagination
const paginationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            delayChildren: 0.2,
            staggerChildren: 0.05
        }
    }
};

const pageButtonVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20
        }
    },
    exit: { scale: 0.95, opacity: 0 },
    hover: {
        scale: 1.05,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
        }
    },
    tap: { scale: 0.95 }
};

function getPageButtonClass(pageNum: number | string, currentPage: number): string {
    if (typeof pageNum !== 'number') {
        return 'bg-white text-gray-400 cursor-default font-medium';
    }
    return pageNum === currentPage
        ? 'bg-primary text-white shadow-sm shadow-primary/20 font-semibold hover:bg-primary'
        : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-primary transition-all duration-200 font-medium';
}

export default function HotelSearchPage() {
    const [searchResults, setSearchResults] = useState<HotelSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const pageSize = 12;

    const handleSearch = async (results: HotelSearchResponse) => {
        if (results.status && results.data?.hotels) {
            setSearchResults(results.data.hotels);
            setTotalResults(results.data.hotels.length);
            setCurrentPage(1);
        } else {
            setSearchResults([]);
            setTotalResults(0);
        }
        setHasSearched(true);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(totalResults / pageSize);

        if (totalResults === 0) return null;

        const getVisiblePages = () => {
            const delta = 2;
            const range: number[] = [];
            const rangeWithDots: (number | string)[] = [];
            let l: number | undefined;

            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                    range.push(i);
                }
            }

            range.forEach(i => {
                if (l) {
                    if (i - l === 2) {
                        rangeWithDots.push(l + 1);
                    } else if (i - l !== 1) {
                        rangeWithDots.push('...');
                    }
                }
                rangeWithDots.push(i);
                l = i;
            });

            return rangeWithDots;
        };

        return (
            <motion.div
                className="flex justify-center items-center pt-8"
                variants={paginationVariants}
                initial="hidden"
                animate="visible"
            >
                <nav className="relative z-0 inline-flex rounded-2xl shadow-lg overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-200/50" aria-label="Pagination">
                    {/* Previous Button */}
                    <motion.button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isLoading}
                        className="relative inline-flex items-center px-4 py-3 border-r border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-900 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:hover:bg-white disabled:text-gray-400 group"
                        whileHover={{ scale: 1.02, x: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <svg
                            className="h-5 w-5 mr-2 text-gray-400 group-hover:text-white transition-colors"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Previous
                    </motion.button>

                    {/* Page Numbers */}
                    <AnimatePresence mode="wait">
                        <div className="hidden sm:flex divide-x divide-gray-200">
                            {getVisiblePages().map((pageNum, index) => (
                                <motion.button
                                    key={`${pageNum}-${index}`}
                                    onClick={() => typeof pageNum === 'number' ? handlePageChange(pageNum) : undefined}
                                    disabled={isLoading || pageNum === '...'}
                                    className={`relative inline-flex items-center px-4 py-3 text-sm transition-all duration-200 min-w-[45px] justify-center ${getPageButtonClass(pageNum, currentPage)}`}
                                    variants={pageButtonVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    whileHover={typeof pageNum === 'number' ? "hover" : undefined}
                                    whileTap={typeof pageNum === 'number' ? "tap" : undefined}
                                >
                                    {pageNum}
                                </motion.button>
                            ))}
                        </div>
                    </AnimatePresence>

                    {/* Current Page Indicator (Mobile) */}
                    <div className="sm:hidden relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/90 to-primary text-white font-medium shadow-sm">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm">Page</span>
                            <motion.span
                                key={currentPage}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{
                                    y: 0,
                                    opacity: 1,
                                    transition: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20
                                    }
                                }}
                                exit={{ y: -10, opacity: 0 }}
                                className="text-base font-semibold"
                            >
                                {currentPage}
                            </motion.span>
                            <span className="text-sm text-primary-100">of</span>
                            <span className="text-base font-semibold">{totalPages}</span>
                        </div>
                    </div>

                    {/* Next Button */}
                    <motion.button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages || isLoading}
                        className="relative inline-flex items-center px-4 py-3 border-l border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-900 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:hover:bg-white disabled:text-gray-400 group"
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Next
                        <svg
                            className="h-5 w-5 ml-2 text-gray-400 group-hover:text-white transition-colors"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </motion.button>

                    {/* Total Results */}
                    <motion.div
                        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-gray-200/50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                                delay: 0.3,
                                duration: 0.2
                            }
                        }}
                    >
                        {totalResults.toLocaleString()} total results
                    </motion.div>
                </nav>
            </motion.div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50"
        >
            <HotelBookingHero
                backgroundImage={bookPic}
                title="Find Your Perfect Stay"
                subtitle="Search through thousands of hotels worldwide"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="mb-8">
                    <HotelSearch
                        onSearch={handleSearch}
                        isLoading={isLoading}
                        onLoadingChange={setIsLoading}
                        currentPage={currentPage}
                    />
                </div>

                {(hasSearched || isLoading) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="pb-10"
                    >
                        <HotelSearchResults
                            results={searchResults.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                            isLoading={isLoading}
                        />
                        {renderPagination()}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
} 