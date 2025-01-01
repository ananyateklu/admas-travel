import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flight, FlightConfig } from '../../services/flightService';

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
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
    hover: {
        y: -8,
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25
        }
    },
    tap: { scale: 0.98 }
};

interface FlightGridProps {
    flights: Flight[];
    config: FlightConfig;
    onSelect: (flight: Flight) => void;
    isLoading?: boolean;
}

function BaggageInfo({ flight }: { flight: Flight }) {
    const checkedLuggage = flight.segments[0]?.travellerCheckedLuggage?.[0];
    const cabinLuggage = flight.segments[0]?.travellerCabinLuggage?.[0];

    return (
        <div className="flex items-center gap-2 text-xs">
            {/* Checked Baggage */}
            <div className="inline-flex items-center gap-1 text-gray-600 whitespace-nowrap">
                <svg className="w-4 h-4 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="1.5" />
                    <path d="M8 4v16M16 4v16" strokeWidth="1.5" />
                    <path d="M4 12h16" strokeWidth="1.5" />
                </svg>
                {checkedLuggage ? (
                    <span className="inline-flex items-center gap-0.5">
                        <span className="text-green-600 font-medium">{checkedLuggage.luggageAllowance.maxPiece}x</span>
                        {checkedLuggage.luggageAllowance.maxWeightPerPiece && checkedLuggage.luggageAllowance.massUnit && (
                            <span className="text-gray-500">
                                ({checkedLuggage.luggageAllowance.maxWeightPerPiece}{checkedLuggage.luggageAllowance.massUnit})
                            </span>
                        )}
                    </span>
                ) : (
                    <span className="text-gray-500">No checked</span>
                )}
            </div>

            <span className="text-gray-300">|</span>

            {/* Cabin Baggage */}
            <div className="inline-flex items-center gap-1 text-gray-600 whitespace-nowrap">
                <svg className="w-4 h-4 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M7 8h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8a2 2 0 012-2z" strokeWidth="1.5" />
                    <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth="1.5" />
                </svg>
                {cabinLuggage ? (
                    <span className="inline-flex items-center gap-0.5">
                        <span className="text-green-600 font-medium">{cabinLuggage.luggageAllowance.maxPiece}x</span>
                        {cabinLuggage.luggageAllowance.maxWeightPerPiece && cabinLuggage.luggageAllowance.massUnit && (
                            <span className="text-gray-500">
                                ({cabinLuggage.luggageAllowance.maxWeightPerPiece}{cabinLuggage.luggageAllowance.massUnit})
                            </span>
                        )}
                        {cabinLuggage.personalItem && (
                            <>
                                <span className="text-gray-300 mx-0.5">+</span>
                                <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="6" y="6" width="12" height="12" rx="1" strokeWidth="1.5" />
                                    <path d="M9 6v12" strokeWidth="1.5" />
                                </svg>
                                <span className="text-blue-600">+1 personal item</span>
                            </>
                        )}
                    </span>
                ) : (
                    <span className="text-gray-500">No cabin</span>
                )}
            </div>
        </div>
    );
}

function Tooltip({ content, isVisible }: { content: string; isVisible: boolean }) {
    return (
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg transition-all z-[100] pointer-events-none ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            {content}
        </div>
    );
}

function InfoIcon({ content }: { content: string }) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <span
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onClick={(e) => e.stopPropagation()}
        >
            <svg className="w-4 h-4 text-gray-400 cursor-help" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                <path d="M12 16v-4M12 8h.01" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <Tooltip content={content} isVisible={isVisible} />
        </span>
    );
}

function PriceBreakdown({ priceBreakdown, brandedFareInfo }: {
    priceBreakdown: Flight['priceBreakdown'];
    brandedFareInfo?: Flight['brandedFareInfo'];
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-1">
                    Base fare
                    <InfoIcon content="Initial ticket price before taxes and additional fees" />
                </span>
                <span className="font-medium">
                    {priceBreakdown.baseFare.currencyCode} {priceBreakdown.baseFare.units}
                </span>
            </div>
            {priceBreakdown.fee.units > 0 && (
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                        Fees & taxes
                        <InfoIcon content="Additional charges including airport fees, taxes, and other surcharges" />
                    </span>
                    <span className="font-medium">
                        {priceBreakdown.fee.currencyCode} {priceBreakdown.fee.units}
                    </span>
                </div>
            )}
            <div className="pt-1.5 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm text-gray-500">
                            {brandedFareInfo?.fareName ?? 'Standard Fare'}
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                            {priceBreakdown.total.currencyCode} {priceBreakdown.total.units}
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors shadow-sm"
                    >
                        Select
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

export function FlightGrid({ flights, config, onSelect, isLoading = false }: FlightGridProps) {
    const LOADING_SKELETONS = Array.from({ length: 6 }, (_, i) => `skeleton-${i}`);

    const formatDateTime = (dateTimeStr: string) => {
        const date = new Date(dateTimeStr);
        return {
            time: date.toLocaleTimeString(config.locale, {
                hour: '2-digit',
                minute: '2-digit',
            }),
            date: date.toLocaleDateString(config.locale, {
                month: 'short',
                day: 'numeric',
                weekday: 'short',
            }),
        };
    };

    const getFlightStatus = (flight: Flight) => {
        const now = new Date();
        const departure = new Date(flight.segments[0]?.departureTime);
        const timeDiff = departure.getTime() - now.getTime();
        const hoursToFlight = timeDiff / (1000 * 60 * 60);

        if (hoursToFlight < 0) return { label: 'Departed', color: 'gray' };
        if (hoursToFlight < 2) return { label: 'Boarding Soon', color: 'yellow' };
        if (hoursToFlight < 24) return { label: 'Today', color: 'green' };
        if (hoursToFlight < 48) return { label: 'Tomorrow', color: 'blue' };
        return { label: 'Scheduled', color: 'indigo' };
    };

    const getLayoverInfo = (flight: Flight) => {
        if (!flight.segments[0] || flight.segments[0].legs.length <= 1) return null;

        const layovers = flight.segments[0].legs.slice(1).map((leg) => ({
            airport: leg.departureAirport.code,
            duration: `${Math.floor((new Date(leg.departureTime).getTime() - new Date(flight.segments[0].legs[0].arrivalTime).getTime()) / (1000 * 60 * 60))}h`,
            city: leg.departureAirport.cityName
        }));

        return layovers;
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {LOADING_SKELETONS.map((skeletonId) => (
                    <motion.div
                        key={skeletonId}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        className="bg-white rounded-2xl shadow-[0_3px_12px_rgba(0,0,0,0.12)] border border-gray-300 overflow-hidden"
                    >
                        <div className="flex items-center gap-4 mb-4 p-6">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="w-20 h-8 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="space-y-4 px-6 pb-6">
                            <div className="h-32 bg-gray-200 rounded"></div>
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-8 bg-gray-200 rounded w-24"></div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
                {flights.map((flight) => {
                    const departureDateTime = formatDateTime(flight.segments[0]?.departureTime);
                    const arrivalDateTime = formatDateTime(flight.segments[0]?.arrivalTime);
                    const status = getFlightStatus(flight);
                    const layovers = getLayoverInfo(flight);
                    const duration = {
                        hours: Math.floor(flight.segments[0]?.totalTime / 60),
                        minutes: flight.segments[0]?.totalTime % 60
                    };

                    return (
                        <motion.div
                            key={flight.token}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => onSelect(flight)}
                            className="bg-white rounded-2xl shadow-[0_3px_12px_rgba(0,0,0,0.12)] border border-gray-300 overflow-hidden group will-change-transform"
                        >
                            {/* Airline Info */}
                            <div className="p-4 border-b border-gray-300 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {flight.segments[0]?.legs[0]?.carriersData[0]?.logo ? (
                                            <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden bg-white p-1.5 border border-gray-200 shadow-sm">
                                                <img
                                                    src={flight.segments[0]?.legs[0]?.carriersData[0]?.logo}
                                                    alt={`${flight.segments[0]?.legs[0]?.carriersData[0]?.name} logo`}
                                                    className="w-9 h-9 object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
                                                <span className="text-base font-semibold text-gray-700">
                                                    {flight.segments[0]?.legs[0]?.carriersData[0]?.code}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900 mb-1">
                                                {flight.segments[0]?.legs[0]?.carriersData[0]?.name}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full shadow-sm">
                                                    Flight {flight.segments[0]?.legs[0]?.flightInfo.flightNumber}
                                                </span>
                                                <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full shadow-sm">
                                                    {flight.brandedFareInfo?.cabinClass ?? flight.segments[0]?.legs[0]?.cabinClass ?? 'ECONOMY'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-700 shadow-sm ring-1 ring-${status.color}-500/20`}>
                                        {status.label}
                                    </div>
                                </div>
                            </div>

                            {/* Flight Route */}
                            <div className="p-4 bg-gradient-to-b from-white to-gray-50/40">
                                <div className="flex items-center justify-between mb-4">
                                    {/* Departure */}
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 mb-1">
                                            {departureDateTime.time}
                                        </div>
                                        <div className="text-sm font-medium text-gray-600">
                                            {departureDateTime.date}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {flight.segments[0]?.departureAirport.cityName}
                                            <span className="text-xs ml-1 text-blue-600 font-medium">
                                                ({flight.segments[0]?.departureAirport.code})
                                            </span>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className="text-center px-4">
                                        <div className="text-xs font-medium text-gray-500 mb-2">
                                            {duration.hours}h {duration.minutes}m
                                        </div>
                                        <div className="relative">
                                            <div className="border-t-2 border-gray-300 w-20"></div>
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        {layovers && (
                                            <div className="mt-1 text-xs text-gray-500">
                                                {layovers.length} stop{layovers.length > 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>

                                    {/* Arrival */}
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-900 mb-1">
                                            {arrivalDateTime.time}
                                        </div>
                                        <div className="text-sm font-medium text-gray-600">
                                            {arrivalDateTime.date}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {flight.segments[0]?.arrivalAirport.cityName}
                                            <span className="text-xs ml-1 text-blue-600 font-medium">
                                                ({flight.segments[0]?.arrivalAirport.code})
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Layover Information */}
                                {layovers && layovers.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                        <div className="flex flex-wrap gap-2">
                                            {layovers.map((layover) => (
                                                <div
                                                    key={`${layover.airport}-${layover.duration}`}
                                                    className="px-2 py-1 bg-white rounded-lg text-xs border border-gray-200 shadow-sm"
                                                >
                                                    <span className="font-medium text-gray-700">{layover.airport}</span>
                                                    <span className="mx-1 text-gray-400">·</span>
                                                    <span className="text-gray-500">{layover.duration}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Price and Actions */}
                            <div className="p-4 bg-gray-50/90 border-t border-gray-300">
                                <div className="flex flex-col gap-3">
                                    <PriceBreakdown
                                        priceBreakdown={flight.priceBreakdown}
                                        brandedFareInfo={flight.brandedFareInfo}
                                    />
                                    <BaggageInfo flight={flight} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
} 