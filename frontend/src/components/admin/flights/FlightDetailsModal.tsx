import { motion, AnimatePresence } from 'framer-motion';
import { Flight } from '../../../types/flight';
import { createPortal } from 'react-dom';

interface TravellerLuggage {
    travellerReference: string;
    luggageAllowance: {
        luggageType: 'CHECKED_IN' | 'HAND';
        maxPiece: number;
        maxWeightPerPiece?: number;
        massUnit?: string;
        sizeRestrictions?: {
            maxLength: number;
            maxWidth: number;
            maxHeight: number;
            sizeUnit: string;
        };
    };
    personalItem?: boolean;
}

interface FlightDetailsModalProps {
    flight: Flight | null;
    onClose: () => void;
}

const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
        y: 20
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            duration: 0.3,
            bounce: 0.1
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: {
            duration: 0.2,
            ease: "easeOut"
        }
    }
};

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.2,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.15,
            ease: "easeIn"
        }
    }
};

export function FlightDetailsModal({ flight, onClose }: FlightDetailsModalProps) {
    if (!flight) return null;

    const formatDateTime = (dateTimeStr: string) => {
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
    };

    const modalContent = (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={onClose}
            >
                <motion.div
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-6 max-h-[90vh] overflow-hidden will-change-transform"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header - Fixed at top */}
                    <motion.div
                        className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10"
                        layoutId={`flight-header-${flight.token}`}
                    >
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Flight Details</h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Flight Token: {flight.token.slice(0, 8)}
                            </p>
                        </div>
                        <motion.button
                            onClick={onClose}
                            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>
                    </motion.div>

                    {/* Content - Scrollable */}
                    <motion.div
                        className="overflow-y-auto"
                        style={{ maxHeight: 'calc(90vh - 140px)' }} // Account for header and footer
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                                delay: 0.1,
                                duration: 0.3
                            }
                        }}
                    >
                        <div className="p-4">
                            {/* Price Information */}
                            <div className="bg-gradient-to-r from-gold/10 to-gold/5 rounded-lg p-3 mb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-gray-600">Total Price</p>
                                        <div className="flex items-baseline gap-0.5">
                                            <span className="text-xl font-bold text-gray-900">
                                                {flight.priceBreakdown.total.currencyCode} {flight.priceBreakdown.total.units}
                                            </span>
                                            <span className="text-gray-500">.{String(flight.priceBreakdown.total.nanos).slice(0, 2)}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-gray-600">Base Fare</p>
                                        <div className="flex items-baseline gap-0.5">
                                            <span className="text-base font-semibold text-gray-700">
                                                {flight.priceBreakdown.baseFare.currencyCode} {flight.priceBreakdown.baseFare.units}
                                            </span>
                                            <span className="text-gray-500">.{String(flight.priceBreakdown.baseFare.nanos).slice(0, 2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Flight Segments */}
                            <div className="space-y-4">
                                {flight.segments.map((segment, segmentIndex) => {
                                    const departureDateTime = formatDateTime(segment.departureTime);
                                    const arrivalDateTime = formatDateTime(segment.arrivalTime);
                                    const duration = {
                                        hours: Math.floor(segment.totalTime / 3600),
                                        minutes: Math.floor((segment.totalTime % 3600) / 60)
                                    };

                                    return (
                                        <div key={`${flight.token}-${segmentIndex}`} className="border border-gray-100 rounded-lg overflow-hidden">
                                            {/* Segment Header */}
                                            <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-100">
                                                <span className="text-xs font-medium text-gray-700">
                                                    Segment {segmentIndex + 1} of {flight.segments.length}
                                                </span>
                                            </div>

                                            {/* Segment Content */}
                                            <div className="p-3">
                                                {/* Flight Route */}
                                                <div className="flex items-center gap-3">
                                                    {/* Departure */}
                                                    <div className="flex-1">
                                                        <div className="flex items-baseline gap-1.5">
                                                            <p className="text-lg font-bold text-gray-900">
                                                                {departureDateTime.time}
                                                            </p>
                                                            <p className="text-xs text-gray-500">{departureDateTime.date}</p>
                                                        </div>
                                                        <p className="text-xs font-medium text-gray-800">
                                                            {segment.departureAirport.cityName}
                                                        </p>
                                                        <div className="flex items-center gap-1">
                                                            <p className="text-[11px] text-gray-500">
                                                                {segment.departureAirport.countryName}
                                                            </p>
                                                            <span className="text-[11px] font-medium text-blue-600">
                                                                ({segment.departureAirport.code})
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Duration */}
                                                    <div className="flex-none flex flex-col items-center px-2">
                                                        <div className="bg-white rounded-full px-2 py-0.5 shadow-sm border border-gray-200 mb-1">
                                                            <p className="text-[11px] font-bold text-gray-900">
                                                                {duration.hours}h {duration.minutes}m
                                                            </p>
                                                        </div>
                                                        <div className="w-24 h-[2px] bg-gray-300 relative">
                                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gray-400" />
                                                        </div>
                                                    </div>

                                                    {/* Arrival */}
                                                    <div className="flex-1 text-right">
                                                        <div className="flex items-baseline gap-1.5 justify-end">
                                                            <p className="text-lg font-bold text-gray-900">
                                                                {arrivalDateTime.time}
                                                            </p>
                                                            <p className="text-xs text-gray-500">{arrivalDateTime.date}</p>
                                                        </div>
                                                        <p className="text-xs font-medium text-gray-800">
                                                            {segment.arrivalAirport.cityName}
                                                        </p>
                                                        <div className="flex items-center justify-end gap-1">
                                                            <p className="text-[11px] text-gray-500">
                                                                {segment.arrivalAirport.countryName}
                                                            </p>
                                                            <span className="text-[11px] font-medium text-blue-600">
                                                                ({segment.arrivalAirport.code})
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Flight Legs */}
                                                <div className="mt-4 space-y-3">
                                                    {segment.legs.map((leg, legIndex) => (
                                                        <div
                                                            key={`${flight.token}-${segmentIndex}-${legIndex}`}
                                                            className="bg-gray-50 rounded-lg p-3"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                {/* Airline Info */}
                                                                <div className="flex items-center gap-2">
                                                                    {leg.carriersData[0]?.logo ? (
                                                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-white p-1.5 border border-gray-100">
                                                                            <img
                                                                                src={leg.carriersData[0].logo}
                                                                                alt={`${leg.carriersData[0].name} logo`}
                                                                                className="w-7 h-7 object-contain"
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-10 h-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                                                            <span className="text-sm font-semibold text-gray-700">
                                                                                {leg.carriersData[0]?.code}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <p className="text-xs font-medium text-gray-900">
                                                                            {leg.carriersData[0]?.name}
                                                                        </p>
                                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-medium rounded-full">
                                                                                Flight {leg.flightInfo.flightNumber}
                                                                            </span>
                                                                            <span className="px-1.5 py-0.5 bg-gray-50 text-gray-600 text-[10px] font-medium rounded-full">
                                                                                {leg.cabinClass}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Aircraft Info */}
                                                                <div className="ml-auto text-right">
                                                                    <p className="text-[11px] text-gray-600">Aircraft</p>
                                                                    <p className="text-xs font-medium text-gray-900">
                                                                        {leg.flightInfo.planeType ?? 'Not specified'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Additional Information */}
                            <div className="mt-4 space-y-3">
                                {/* Fare Information */}
                                {flight.brandedFareInfo && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xs font-medium text-gray-900">Fare Information</h3>
                                            {flight.isVirtualInterlining && (
                                                <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-medium rounded-full">
                                                    Virtual Interlining
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-[11px] text-gray-600">
                                                    <span className="font-medium">Fare Type:</span> {flight.brandedFareInfo.fareName}
                                                </p>
                                                <p className="text-[11px] text-gray-600">
                                                    <span className="font-medium">Cabin Class:</span> {flight.brandedFareInfo.cabinClass}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-gray-600">
                                                    <span className="font-medium">ATOL Protected:</span> {flight.isAtolProtected ? 'Yes' : 'No'}
                                                </p>
                                                {flight.priceBreakdown.fee && (
                                                    <p className="text-[11px] text-gray-600">
                                                        <span className="font-medium">Fees:</span> {flight.priceBreakdown.fee.currencyCode} {flight.priceBreakdown.fee.units}
                                                        {flight.priceBreakdown.fee.nanos > 0 && `.${String(flight.priceBreakdown.fee.nanos).slice(0, 2)}`}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Luggage Information */}
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <h3 className="text-xs font-medium text-gray-900 mb-2">Luggage Allowance</h3>
                                    <div className="space-y-2">
                                        {/* Checked Luggage */}
                                        {flight.segments[0].travellerCheckedLuggage?.map((luggage: TravellerLuggage, idx: number) => (
                                            <div key={`checked-${luggage.travellerReference}-${idx}`} className="bg-white rounded-lg p-2 border border-gray-100">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                    <p className="text-[11px] font-medium text-gray-900">
                                                        Checked Baggage - Traveller {luggage.travellerReference}
                                                    </p>
                                                </div>
                                                <div className="text-[10px] text-gray-600 space-y-0.5">
                                                    <p>
                                                        <span className="font-medium">Pieces:</span> {luggage.luggageAllowance.maxPiece}
                                                    </p>
                                                    {luggage.luggageAllowance.maxWeightPerPiece && (
                                                        <p>
                                                            <span className="font-medium">Max Weight per Piece:</span>{' '}
                                                            {luggage.luggageAllowance.maxWeightPerPiece} {luggage.luggageAllowance.massUnit}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Cabin Luggage */}
                                        {flight.segments[0].travellerCabinLuggage?.map((luggage: TravellerLuggage, idx: number) => (
                                            <div key={`cabin-${luggage.travellerReference}-${idx}`} className="bg-white rounded-lg p-2 border border-gray-100">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="text-[11px] font-medium text-gray-900">
                                                        Cabin Baggage - Traveller {luggage.travellerReference}
                                                    </p>
                                                </div>
                                                <div className="text-[10px] text-gray-600 space-y-0.5">
                                                    <p>
                                                        <span className="font-medium">Hand Luggage:</span>{' '}
                                                        {luggage.luggageAllowance.maxPiece > 0 ? `${luggage.luggageAllowance.maxPiece} piece` : 'Not included'}
                                                    </p>
                                                    {luggage.luggageAllowance.maxWeightPerPiece && (
                                                        <p>
                                                            <span className="font-medium">Max Weight:</span>{' '}
                                                            {luggage.luggageAllowance.maxWeightPerPiece} {luggage.luggageAllowance.massUnit}
                                                        </p>
                                                    )}
                                                    {luggage.luggageAllowance.sizeRestrictions && (
                                                        <p>
                                                            <span className="font-medium">Size:</span>{' '}
                                                            {luggage.luggageAllowance.sizeRestrictions.maxLength} x{' '}
                                                            {luggage.luggageAllowance.sizeRestrictions.maxWidth} x{' '}
                                                            {luggage.luggageAllowance.sizeRestrictions.maxHeight}{' '}
                                                            {luggage.luggageAllowance.sizeRestrictions.sizeUnit}
                                                        </p>
                                                    )}
                                                    <p>
                                                        <span className="font-medium">Personal Item:</span>{' '}
                                                        {luggage.personalItem ? 'Allowed' : 'Not allowed'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Taxes & Fees Breakdown */}
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <h3 className="text-xs font-medium text-gray-900 mb-2">Taxes & Fees</h3>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                        {flight.priceBreakdown.fee && (
                                            <p className="text-[11px] text-gray-600">
                                                <span className="font-medium">Service Fee:</span>{' '}
                                                {flight.priceBreakdown.fee.currencyCode} {flight.priceBreakdown.fee.units}
                                                {flight.priceBreakdown.fee.nanos > 0 && `.${String(flight.priceBreakdown.fee.nanos).slice(0, 2)}`}
                                            </p>
                                        )}
                                        {flight.priceBreakdown.tax && (
                                            <p className="text-[11px] text-gray-600">
                                                <span className="font-medium">Taxes:</span>{' '}
                                                {flight.priceBreakdown.tax.currencyCode} {flight.priceBreakdown.tax.units}
                                                {flight.priceBreakdown.tax.nanos > 0 && `.${String(flight.priceBreakdown.tax.nanos).slice(0, 2)}`}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Flight Amenities */}
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <h3 className="text-xs font-medium text-gray-900 mb-2">Flight Amenities</h3>
                                    <div className="space-y-2">
                                        {flight.segments.map((segment, segmentIndex) => (
                                            segment.legs.map((leg, legIndex) => leg.amenities && leg.amenities.length > 0 && (
                                                <div key={`amenities-${segmentIndex}-${legIndex}`} className="bg-white rounded-lg p-2 border border-gray-100">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <div className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center">
                                                            <span className="text-[10px] font-medium text-gray-700">{legIndex + 1}</span>
                                                        </div>
                                                        <p className="text-[11px] font-medium text-gray-900">
                                                            {leg.carriersData[0]?.name} - Flight {leg.flightInfo.flightNumber}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {leg.amenities.map((amenity) => (
                                                            <div key={`amenity-${amenity.category}-${amenity.type ?? ''}-${amenity.cost ?? ''}`} className="flex items-center gap-1.5">
                                                                {amenity.category === 'WIFI' && (
                                                                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                                                                    </svg>
                                                                )}
                                                                {amenity.category === 'ENTERTAINMENT' && (
                                                                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                    </svg>
                                                                )}
                                                                {amenity.category === 'POWER' && (
                                                                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                    </svg>
                                                                )}
                                                                {amenity.category === 'FOOD' && (
                                                                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                                    </svg>
                                                                )}
                                                                <span className="text-[10px] text-gray-600">
                                                                    {amenity.category.charAt(0) + amenity.category.slice(1).toLowerCase()}
                                                                    {amenity.cost && ` (${amenity.cost})`}
                                                                    {amenity.type && typeof amenity.type === 'string' && ` - ${amenity.type}`}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))
                                        ))}
                                    </div>
                                </div>

                                {/* Warnings & Notices */}
                                {(flight.segments.some(s => s.showWarningOriginAirport || s.showWarningDestinationAirport)) && (
                                    <div className="bg-amber-50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <h3 className="text-xs font-medium text-amber-800">Important Notices</h3>
                                        </div>
                                        <div className="space-y-1">
                                            {flight.segments.map((segment) => (
                                                <div key={`warning-${segment.departureAirport.code}-${segment.arrivalAirport.code}-${segment.departureTime}`}>
                                                    {segment.showWarningOriginAirport && (
                                                        <p className="text-[11px] text-amber-700">
                                                            • Please check travel requirements for {segment.departureAirport.cityName} ({segment.departureAirport.code})
                                                        </p>
                                                    )}
                                                    {segment.showWarningDestinationAirport && (
                                                        <p className="text-[11px] text-amber-700">
                                                            • Please check travel requirements for {segment.arrivalAirport.cityName} ({segment.arrivalAirport.code})
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Footer - Fixed at bottom */}
                    <motion.div
                        className="p-3 bg-gray-50 border-t border-gray-100 sticky bottom-0 z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                                delay: 0.2,
                                duration: 0.3
                            }
                        }}
                    >
                        <div className="flex justify-end gap-2">
                            <motion.button
                                onClick={onClose}
                                className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Close
                            </motion.button>
                            <motion.button
                                className="px-3 py-1.5 text-sm bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Book Flight
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );

    // Render the modal using a portal
    return createPortal(modalContent, document.body);
} 