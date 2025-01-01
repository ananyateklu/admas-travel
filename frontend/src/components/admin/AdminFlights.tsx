import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { flightService, Flight, FlightConfig } from '../../services/flightService';
import { FlightSearchForm } from './FlightSearchForm';
import { FlightDetailsModal } from './FlightDetailsModal';
import { FlightGrid } from './FlightGrid';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            when: "beforeChildren"
        }
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
            when: "afterChildren"
        }
    }
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            mass: 1
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: -20,
        transition: {
            duration: 0.2,
            ease: "easeOut"
        }
    },
    hover: {
        y: -8,
        scale: 1.02,
        boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25
        }
    },
    tap: {
        scale: 0.98,
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        transition: {
            duration: 0.1,
            ease: "easeIn"
        }
    }
};

const priceVariants = {
    hover: {
        scale: 1.05,
        color: "#1a365d",
        transition: {
            duration: 0.2,
            ease: "easeOut"
        }
    }
};

const buttonVariants = {
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.2,
            ease: "easeOut"
        }
    },
    tap: {
        scale: 0.95,
        transition: {
            duration: 0.1,
            ease: "easeIn"
        }
    }
};

const loadingCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

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

interface FlightCardProps {
    flight: Flight;
    config: FlightConfig;
    onSelect: (flight: Flight) => void;
}

function renderFlightStatusHelper(departureTime: string, getFlightStatus: typeof getFlightStatusHelper, getStatusStyles: typeof getStatusStylesHelper, getStatusDotColor: typeof getStatusDotColorHelper) {
    const status = getFlightStatus(departureTime);
    return (
        <span
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(status.label)}`}
            title={`Flight ${status.label} ${status.time}`}
        >
            <span className={`flex h-2 w-2 relative ${(status.label === 'Active' || status.label === 'Boarding')
                ? 'animate-pulse shadow-sm' : ''}`}
            >
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${(status.label === 'Active' || status.label === 'Boarding')
                    ? 'animate-ping' : ''
                    } ${getStatusDotColor(status.label)}`}
                />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${getStatusDotColor(status.label)}`} />
            </span>
            <div className="flex items-center gap-1">
                {status.label}
                <span className="text-[10px] opacity-75">
                    {status.time}
                </span>
            </div>
        </span>
    );
}

function getPageButtonClass(pageNum: number | string, currentPage: number): string {
    if (typeof pageNum !== 'number') {
        return 'bg-white text-gray-400 cursor-default font-medium';
    }
    return pageNum === currentPage
        ? 'bg-gradient-to-r from-gold/90 to-gold text-white shadow-sm shadow-gold/20 font-semibold'
        : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gold transition-all duration-200 font-medium';
}

function renderPaginationHelper(currentPage: number, totalFlights: number, pageSize: number, isLoading: boolean, onPageChange: (page: number) => void) {
    // Calculate total pages by dividing total flights by page size and rounding up
    const totalPages = Math.ceil(totalFlights / pageSize);

    // Don't show pagination if there are no flights
    if (totalFlights === 0) return null;

    // Calculate visible page numbers
    const getVisiblePages = () => {
        const delta = 2; // Number of pages to show on each side of current page
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
            className="flex justify-center items-center pt-20"
            variants={paginationVariants}
            initial="hidden"
            animate="visible"
        >
            <nav className="relative z-0 inline-flex rounded-2xl shadow-lg overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-200/50" aria-label="Pagination">
                {/* Previous Button */}
                <motion.button
                    onClick={() => onPageChange(currentPage - 1)}
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
                                onClick={() => typeof pageNum === 'number' ? onPageChange(pageNum) : undefined}
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
                <div className="sm:hidden relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-gold/90 to-gold text-white font-medium shadow-sm">
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
                        <span className="text-sm text-gold-100">of</span>
                        <span className="text-base font-semibold">{totalPages}</span>
                    </div>
                </div>

                {/* Next Button */}
                <motion.button
                    onClick={() => onPageChange(currentPage + 1)}
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
                    {totalFlights.toLocaleString()} total results
                </motion.div>
            </nav>
        </motion.div>
    );
}

function FlightCard({ flight, config, onSelect }: FlightCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const formatDateTime = formatDateTimeHelper;
    const getFlightStatus = getFlightStatusHelper;
    const getStatusStyles = getStatusStylesHelper;
    const getStatusDotColor = getStatusDotColorHelper;
    const renderPriceTrend = renderPriceTrendHelper;
    const renderStopsIndicator = renderStopsIndicatorHelper;

    const renderFlightStatus = (departureTime: string) =>
        renderFlightStatusHelper(departureTime, getFlightStatus, getStatusStyles, getStatusDotColor);

    const departureDateTime = formatDateTime(flight.segments[0]?.departureTime);
    const arrivalDateTime = formatDateTime(flight.segments[0]?.arrivalTime);
    const duration = {
        hours: Math.floor(flight.segments[0]?.totalTime / 3600),
        minutes: Math.floor((flight.segments[0]?.totalTime % 3600) / 60)
    };
    const fromId = flight.segments[0]?.departureAirport.code;
    const toId = flight.segments[0]?.arrivalAirport.code;

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover="hover"
            whileTap="tap"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="bg-white rounded-2xl shadow-[0_3px_12px_rgba(0,0,0,0.12)] border border-gray-300 overflow-hidden group cursor-pointer will-change-transform"
            onClick={() => onSelect(flight)}
            layout
        >
            <motion.div className="p-4" layout="position">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                        {/* Airline Info */}
                        <motion.div
                            className="flex items-center justify-between mb-3 relative"
                            layout="position"
                        >
                            <div className="flex items-center gap-3">
                                {flight.segments[0]?.legs[0]?.carriersData[0]?.logo ? (
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden bg-white p-1.5 border border-gray-100">
                                        <img
                                            src={flight.segments[0]?.legs[0]?.carriersData[0]?.logo}
                                            alt={`${flight.segments[0]?.legs[0]?.carriersData[0]?.name} logo`}
                                            className="w-9 h-9 object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                        <span className="text-base font-semibold text-gray-700">
                                            {flight.segments[0]?.legs[0]?.carriersData[0]?.code}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-0.5">
                                        {flight.segments[0]?.legs[0]?.carriersData[0]?.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                            Flight {flight.segments[0]?.legs[0]?.flightInfo.flightNumber}
                                        </span>
                                        <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full">
                                            {flight.brandedFareInfo?.cabinClass ?? flight.segments[0]?.legs[0]?.cabinClass ?? 'ECONOMY'}
                                        </span>
                                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                                            {flight.token.slice(0, 8)}
                                        </span>
                                        {renderFlightStatus(flight.segments[0]?.departureTime)}
                                    </div>
                                </div>
                            </div>
                            <motion.div
                                className="text-right"
                                variants={priceVariants}
                                animate={isHovered ? "hover" : ""}
                            >
                                <p className="text-xs font-medium text-gray-500">Market Price</p>
                                <div className="flex items-baseline justify-end gap-0.5">
                                    <span className="text-xl font-bold text-gray-900 transition-colors duration-200">
                                        {config.currency} {flight.priceBreakdown.total.units}
                                    </span>
                                    <span className="text-sm text-gray-600">.{String(flight.priceBreakdown.total.nanos).slice(0, 2)}</span>
                                </div>
                                <motion.div
                                    className="flex items-center justify-end gap-1 mt-0.5"
                                    animate={{ scale: isHovered ? 1.05 : 1 }}
                                >
                                    {renderPriceTrend(flight)}
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* Flight Journey */}
                        <motion.div
                            className="flex items-center gap-4 bg-gray-50/80 rounded-lg p-3 relative overflow-hidden"
                            layout="position"
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                animate={{
                                    x: isHovered ? ["-100%", "200%"] : "-100%"
                                }}
                                transition={{
                                    duration: 1.5,
                                    ease: "easeInOut",
                                    repeat: isHovered ? Infinity : 0
                                }}
                            />
                            {/* Departure */}
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl font-bold text-gray-900 tracking-tight">
                                        {departureDateTime.time}
                                    </p>
                                    <p className="text-xs font-medium text-gray-500">{departureDateTime.date}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-800">
                                    {flight.segments[0]?.departureAirport.cityName}
                                </p>
                                <div className="flex items-center gap-1">
                                    <p className="text-xs text-gray-500">
                                        {flight.segments[0]?.departureAirport.countryName}
                                    </p>
                                    <span className="text-xs font-medium text-blue-600">
                                        ({flight.segments[0]?.departureAirport.code})
                                    </span>
                                </div>
                            </div>

                            {/* Duration and Path */}
                            <div className="flex-none flex flex-col items-center relative px-2 min-w-[200px]">
                                <div className="absolute top-[30%] left-0 right-0">
                                    <div className="w-full h-[2px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                                </div>
                                <div className="bg-white rounded-full px-3 py-1 shadow-sm border border-gray-200 z-10 mb-1">
                                    <p className="text-xs font-bold text-gray-900 whitespace-nowrap">
                                        {duration.hours}h {duration.minutes}m
                                    </p>
                                </div>
                                {renderStopsIndicator(flight.segments[0]?.legs || [], fromId, toId)}
                            </div>

                            {/* Arrival */}
                            <div className="flex-1 text-right">
                                <div className="flex items-baseline gap-2 justify-end">
                                    <p className="text-2xl font-bold text-gray-900 tracking-tight">
                                        {arrivalDateTime.time}
                                    </p>
                                    <p className="text-xs font-medium text-gray-500">{arrivalDateTime.date}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-800">
                                    {flight.segments[0]?.arrivalAirport.cityName}
                                </p>
                                <div className="flex items-center justify-end gap-1">
                                    <p className="text-xs text-gray-500">
                                        {flight.segments[0]?.arrivalAirport.countryName}
                                    </p>
                                    <span className="text-xs font-medium text-blue-600">
                                        ({flight.segments[0]?.arrivalAirport.code})
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Connection Details */}
                        {flight.segments[0]?.legs.length > 1 && (
                            <motion.div layout="position">
                                <ConnectionDetails
                                    legs={flight.segments[0]?.legs}
                                    formatDateTime={formatDateTime}
                                />
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
            <motion.div
                className="px-4 py-2 bg-gray-50/90 border-t border-gray-300"
                layout="position"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-600">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {flight.brandedFareInfo?.fareName ?? 'Standard Fare'}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {flight.segments[0]?.legs[0]?.flightInfo.planeType}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </motion.button>
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function formatDateTimeHelper(dateTimeStr: string) {
    const date = new Date(dateTimeStr);
    return {
        time: date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }),
        date: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    };
}

function getFlightStatusHelper(departureTime: string) {
    const now = new Date();
    const departure = new Date(departureTime);
    const timeDiff = departure.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    const minutesDiff = Math.floor((Math.abs(timeDiff) / (1000 * 60)) % 60);

    if (hoursDiff < 0) {
        const hoursAgo = Math.abs(Math.floor(hoursDiff));
        return {
            label: 'Departed',
            color: 'gray',
            time: hoursAgo === 0
                ? `${minutesDiff}m ago`
                : `${hoursAgo}h ${minutesDiff}m ago`
        };
    }
    if (hoursDiff <= 2) {
        const minutesLeft = Math.floor(hoursDiff * 60);
        return {
            label: 'Boarding',
            color: 'amber',
            time: `in ${minutesLeft}m`
        };
    }
    if (hoursDiff <= 24) {
        return {
            label: 'Active',
            color: 'green',
            time: `in ${Math.floor(hoursDiff)}h`
        };
    }
    const daysAhead = Math.floor(hoursDiff / 24);
    return {
        label: 'Scheduled',
        color: 'blue',
        time: `in ${daysAhead}d`
    };
}

function getStatusStylesHelper(statusLabel: string) {
    switch (statusLabel) {
        case 'Active':
            return 'bg-green-50 text-green-700 ring-1 ring-green-600/20';
        case 'Boarding':
            return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
        case 'Departed':
            return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/10';
        default:
            return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
    }
}

function getStatusDotColorHelper(statusLabel: string) {
    switch (statusLabel) {
        case 'Active':
            return 'bg-green-500 shadow-green-500/50';
        case 'Boarding':
            return 'bg-amber-500 shadow-amber-500/50';
        case 'Departed':
            return 'bg-gray-500 shadow-gray-500/50';
        default:
            return 'bg-blue-500 shadow-blue-500/50';
    }
}

function calculatePriceTrendHelper(flight: Flight) {
    const baseFare = flight.priceBreakdown.baseFare.units + (flight.priceBreakdown.baseFare.nanos / 1000000000);
    const total = flight.priceBreakdown.total.units + (flight.priceBreakdown.total.nanos / 1000000000);
    const priceDiff = ((total - baseFare) / baseFare) * 100;

    if (Math.abs(priceDiff) < 0.1) {
        return { trend: 0, isIncrease: false };
    }

    return {
        trend: Math.abs(priceDiff),
        isIncrease: priceDiff > 0
    };
}

function renderPriceTrendHelper(flight: Flight) {
    const { trend, isIncrease } = calculatePriceTrendHelper(flight);
    if (trend === 0) return null;

    return (
        <>
            <svg
                className={`w-3.5 h-3.5 ${isIncrease ? 'text-red-500' : 'text-green-500'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isIncrease
                        ? "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                        : "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    }
                />
            </svg>
            <span className={`text-xs font-medium ${isIncrease ? 'text-red-600' : 'text-green-600'}`}>
                {isIncrease ? '+' : '-'}{trend.toFixed(1)}%
            </span>
        </>
    );
}

function renderStopDotsHelper(legs: Flight['segments'][0]['legs']) {
    return legs.slice(0, -1).map((leg) => (
        <div
            key={`${leg.flightInfo.flightNumber}-${leg.arrivalTime}`}
            className="w-1 h-1 rounded-full bg-current opacity-60"
        />
    ));
}

function getStopsTextHelper(legs: Flight['segments'][0]['legs'], fromId: string, toId: string) {
    const isDirect = legs.length === 1 &&
        legs[0].departureAirport.code === fromId &&
        legs[0].arrivalAirport.code === toId;

    if (isDirect) return 'Direct';

    const stopCount = legs.length - 1;
    return `${stopCount} stop${stopCount !== 1 ? 's' : ''}`;
}

function renderStopsIndicatorHelper(legs: Flight['segments'][0]['legs'], fromId: string, toId: string) {
    const stopsText = getStopsTextHelper(legs, fromId, toId);
    const isDirect = stopsText === 'Direct';
    return (
        <div className={`px-2 py-0.5 rounded-full text-xs font-medium z-10
            ${isDirect
                ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                : 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'}`
        }>
            {!isDirect && (
                <div className="inline-flex items-center gap-1 mr-1">
                    {renderStopDotsHelper(legs)}
                </div>
            )}
            {stopsText}
        </div>
    );
}

interface ConnectionDetailsProps {
    legs: Flight['segments'][0]['legs'];
    formatDateTime: (dateTimeStr: string) => { time: string; date: string };
}

function formatFlightForLogging(flight: Flight) {
    return {
        token: flight.token.slice(0, 8),
        segments: flight.segments.map(s => ({
            legs: s.legs.map(l => `${l.departureAirport.code} → ${l.arrivalAirport.code}`),
            totalLegs: s.legs.length
        }))
    };
}

function formatFilteredResultsForLogging(flight: Flight, fromId: string, toId: string) {
    return {
        token: flight.token.slice(0, 8),
        route: flight.segments[0]?.legs.map(leg => `${leg.departureAirport.code} → ${leg.arrivalAirport.code}`),
        totalLegs: flight.segments[0]?.legs.length,
        isDirect: flight.segments[0]?.legs.length === 1 &&
            flight.segments[0]?.legs[0]?.departureAirport.code === fromId &&
            flight.segments[0]?.legs[0]?.arrivalAirport.code === toId
    };
}

function renderConnectionDetails(leg: Flight['segments'][0]['legs'][0], index: number, formatDateTime: (dateTimeStr: string) => { time: string; date: string }) {
    const connectionDateTime = formatDateTime(leg.arrivalTime);
    return (
        <div key={`${leg.flightInfo.flightNumber}-${leg.arrivalTime}-${index}`} className="inline-flex items-center gap-1.5 bg-gray-50/80 px-2 py-1 rounded-md text-xs text-gray-600">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            <span className="font-medium">Connection {index + 1}</span>
            <span className="text-gray-400">•</span>
            <span>Flight {leg.flightInfo.flightNumber}</span>
            <span className="text-gray-400">•</span>
            <span>{connectionDateTime.time}</span>
            <span className="text-[10px] text-gray-500">{connectionDateTime.date}</span>
        </div>
    );
}

function ConnectionDetails({ legs, formatDateTime }: ConnectionDetailsProps) {
    if (legs.length <= 1) return null;

    return (
        <div className="mt-2">
            <div className="flex flex-wrap gap-2">
                {legs.slice(0, -1).map((leg, index) => renderConnectionDetails(leg, index, formatDateTime))}
            </div>
        </div>
    );
}

function LoadingCard() {
    return (
        <motion.div
            variants={loadingCardVariants}
            className="bg-white rounded-2xl shadow-[0_3px_12px_rgba(0,0,0,0.12)] border border-gray-300 overflow-hidden"
        >
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                            <div className="flex gap-2">
                                <div className="h-4 w-20 bg-gray-200 rounded-full animate-pulse" />
                                <div className="h-4 w-24 bg-gray-200 rounded-full animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1" />
                        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="h-7 w-28 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex-none flex flex-col items-center px-8">
                            <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse mb-1" />
                            <div className="w-full h-[2px] bg-gray-200 animate-pulse" />
                        </div>
                        <div className="space-y-2 text-right">
                            <div className="h-7 w-28 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse ml-auto" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-300">
                <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function renderLoadingState() {
    const loadingCardIds = ['primary', 'secondary', 'tertiary'];
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
        >
            {loadingCardIds.map((id) => (
                <LoadingCard key={`loading-card-${id}`} />
            ))}
        </motion.div>
    );
}

function renderErrorState(error: string) {
    return (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
            {error}
        </div>
    );
}

function renderNoFlightsMessage(isInitialState: boolean, hasError: boolean) {
    return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Flights Found</h3>
            <p className="text-gray-600">
                {isInitialState ? "Search for flights to see results" : "We couldn't find any flights matching your search criteria."}
            </p>
            {hasError && (
                <p className="text-gray-600 mt-2">
                    Try adjusting your search criteria or selecting different dates.
                </p>
            )}
        </div>
    );
}

function checkCabinClass(flight: Flight, requestedClass: string) {
    const normalizedRequestedClass = requestedClass.toUpperCase().replace(/[^A-Z]/g, '');
    const brandedClass = flight.brandedFareInfo?.cabinClass?.toUpperCase().replace(/[^A-Z]/g, '');
    const hasRequestedClass = flight.segments[0]?.legs.some(leg => {
        const legClass = leg.cabinClass?.toUpperCase().replace(/[^A-Z]/g, '');
        return legClass === normalizedRequestedClass;
    });

    if (normalizedRequestedClass === 'FIRST') {
        return hasRequestedClass;
    }

    return brandedClass === normalizedRequestedClass ||
        (hasRequestedClass && flight.segments[0]?.legs.every(leg => {
            const legClass = leg.cabinClass?.toUpperCase().replace(/[^A-Z]/g, '');
            return legClass === normalizedRequestedClass;
        }));
}

function checkDirectFlight(flight: Flight, fromId: string, toId: string) {
    if (flight.segments.length !== 1) {
        return false;
    }

    const segment = flight.segments[0];
    if (!segment || segment.legs.length !== 1) {
        return false;
    }

    const leg = segment.legs[0];
    return leg.departureAirport.code === fromId && leg.arrivalAirport.code === toId;
}

const ViewToggle = ({ view, onViewChange }: { view: 'list' | 'grid', onViewChange: (view: 'list' | 'grid') => void }) => (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-1">
        <button
            onClick={() => onViewChange('list')}
            className={`px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${view === 'list'
                ? 'bg-gold text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            List
        </button>
        <button
            onClick={() => onViewChange('grid')}
            className={`px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${view === 'grid'
                ? 'bg-gold text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Grid
        </button>
    </div>
);

export function AdminFlights() {
    const [config, setConfig] = useState<FlightConfig>({
        market: 'US',
        currency: 'USD',
        locale: 'en-US'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [flights, setFlights] = useState<Flight[]>(() => {
        const cached = localStorage.getItem('adminFlightResults');
        return cached ? JSON.parse(cached) : [];
    });
    const [currentPage, setCurrentPage] = useState(() => {
        return Number(localStorage.getItem('adminFlightCurrentPage')) || 1;
    });
    const [totalFlights, setTotalFlights] = useState(() => {
        return Number(localStorage.getItem('adminFlightTotalCount')) || 0;
    });
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const pageSize = 10;
    const [view, setView] = useState<'list' | 'grid'>(() => {
        return localStorage.getItem('adminFlightView') as 'list' | 'grid' || 'list';
    });

    // Initialize config
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await flightService.getConfig();
                setConfig(config);
            } catch (err) {
                console.error('Error fetching config:', err);
            }
        };

        fetchConfig();
    }, []);

    // Save flight results to localStorage
    useEffect(() => {
        if (flights.length > 0) {
            localStorage.setItem('adminFlightResults', JSON.stringify(flights));
        } else {
            localStorage.removeItem('adminFlightResults');
        }
    }, [flights]);

    useEffect(() => {
        localStorage.setItem('adminFlightCurrentPage', currentPage.toString());
    }, [currentPage]);

    useEffect(() => {
        if (totalFlights > 0) {
            localStorage.setItem('adminFlightTotalCount', totalFlights.toString());
        } else {
            localStorage.removeItem('adminFlightTotalCount');
        }
    }, [totalFlights]);

    useEffect(() => {
        localStorage.setItem('adminFlightView', view);
    }, [view]);

    const handleSearch = async (params: {
        fromId: string;
        toId: string;
        departDate: string;
        page: number;
        pageSize: number;
        cabinClass?: string;
        directFlightsOnly?: boolean;
        passengers?: {
            adults: number;
            children: number;
            infants: number;
        };
    }) => {
        setIsLoading(true);
        setError(null);
        setCurrentPage(1); // Reset to first page on new search

        try {
            const { flights: results, totalCount } = await flightService.searchFlights(params);
            console.log('Raw API results:', results.map(formatFlightForLogging));

            // Apply additional filtering on the client side
            const filteredResults = results.filter(flight => {
                if (params.cabinClass) {
                    return checkCabinClass(flight, params.cabinClass);
                }
                if (params.directFlightsOnly) {
                    return checkDirectFlight(flight, params.fromId, params.toId);
                }
                return true;
            });

            console.log('\nFiltered results:', filteredResults.map(f => formatFilteredResultsForLogging(f, params.fromId, params.toId)));

            setFlights(filteredResults);
            // Always set a minimum total count equal to the number of filtered results
            setTotalFlights(Math.max(filteredResults.length, totalCount || 0));
        } catch (err) {
            setError('Failed to fetch flights. Please try again.');
            console.error('Error fetching flights:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = async (page: number) => {
        if (flights.length === 0) return;

        const firstFlight = flights[0];
        const params = {
            fromId: firstFlight.segments[0]?.departureAirport.code,
            toId: firstFlight.segments[0]?.arrivalAirport.code,
            departDate: firstFlight.segments[0]?.departureTime.split('T')[0],
            page,
            pageSize,
            // Preserve the current filter settings
            cabinClass: firstFlight.segments[0]?.legs[0]?.cabinClass,
            directFlightsOnly: firstFlight.segments[0]?.legs.length === 1,
            passengers: {
                adults: 1,
                children: 0,
                infants: 0
            }
        };

        setCurrentPage(page);
        setIsLoading(true);
        try {
            const { flights: results, totalCount } = await flightService.searchFlights(params);

            // Apply the same filtering logic as in handleSearch
            const filteredResults = results.filter(flight => {
                if (params.cabinClass) {
                    return checkCabinClass(flight, params.cabinClass);
                }
                if (params.directFlightsOnly) {
                    return checkDirectFlight(flight, params.fromId, params.toId);
                }
                return true;
            });

            setFlights(filteredResults);
            setTotalFlights(totalCount || filteredResults.length); // Use totalCount from API if available
        } catch (error) {
            setError('Failed to fetch flights. Please try again.');
            console.error('Error fetching flights:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderSearchResults = () => {
        if (isLoading) return renderLoadingState();
        if (error) return renderErrorState(error);
        if (flights.length === 0) return renderNoFlightsMessage(!error && !isLoading, !!error);

        return (
            <>
                <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing {flights.length} of {totalFlights} flights
                    </div>
                    <ViewToggle view={view} onViewChange={setView} />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {view === 'list' ? (
                            <div className="space-y-4">
                                {flights.map((flight, index) => (
                                    <motion.div
                                        key={flight.token}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                type: "spring",
                                                bounce: 0.2,
                                                duration: 0.8,
                                                delay: index * 0.1
                                            }
                                        }}
                                        viewport={{ once: true, margin: "-100px" }}
                                    >
                                        <FlightCard
                                            flight={flight}
                                            config={config}
                                            onSelect={setSelectedFlight}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <FlightGrid
                                flights={flights}
                                config={config}
                                onSelect={setSelectedFlight}
                                isLoading={isLoading}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>

                {renderPaginationHelper(currentPage, totalFlights, pageSize, isLoading, handlePageChange)}
            </>
        );
    };

    return (
        <div className="space-y-4 pb-10">
            <FlightSearchForm
                onSearch={handleSearch}
                isLoading={isLoading}
                error={error}
            />

            {/* Results Section */}
            <div>
                {renderSearchResults()}
            </div>

            {/* Flight Details Modal */}
            <FlightDetailsModal
                flight={selectedFlight}
                onClose={() => setSelectedFlight(null)}
            />
        </div>
    );
} 