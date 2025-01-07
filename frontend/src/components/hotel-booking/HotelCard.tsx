import { motion } from 'framer-motion';
import { HotelSearchResult } from '../../types/hotelSearch';
import { useState } from 'react';
import { HotelBookingModal } from './HotelBookingModal';
import { HotelDetailsModal } from './HotelDetailsModal';

interface HotelCardProps {
    hotel: HotelSearchResult;
    index: number;
    searchParams: URLSearchParams;
}

export function HotelCard({ hotel, index, searchParams }: HotelCardProps) {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const getLocationFromAccessibilityLabel = (label: string) => {
        const lines = label.split('\n');
        const locationLine = lines.find(line =>
            (line.includes('‎') && line.includes('‬')) ||
            (line.includes('downtown') && !line.includes('USD'))
        );

        if (!locationLine) return 'Location available upon request';

        return locationLine.replace(/[‎‬]/g, '').trim();
    };

    const getRoomDetailsFromAccessibilityLabel = (label: string) => {
        const lines = label.split('\n');
        const roomLine = lines.find(line =>
            line.includes('bed') ||
            line.includes('bedroom') ||
            line.includes('bathroom')
        );
        return roomLine?.trim() ?? '';
    };

    const isNewProperty = hotel.property.reviewCount === 0;
    const hasFreeCancel = hotel.accessibilityLabel.toLowerCase().includes('free cancellation');
    const noPrePayment = hotel.accessibilityLabel.toLowerCase().includes('no prepayment');

    const handleBookingComplete = (bookingId: string) => {
        console.log('Booking completed:', bookingId);
        setIsBookingModalOpen(false);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut"
                }}
                whileHover={{
                    y: -4,
                    transition: { duration: 0.2 }
                }}
                onClick={() => setIsDetailsModalOpen(true)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden h-full flex flex-col cursor-pointer relative"
            >
                {/* Image Section */}
                <div className="aspect-[16/9] relative">
                    <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.6 }}
                        src={hotel.property.photoUrls[0] || '/placeholder-hotel.jpg'}
                        alt={hotel.property.name}
                        className="w-full h-full object-cover"
                    />
                    {/* Rating Badge */}
                    {Boolean(hotel.property.reviewScore) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="absolute top-2 left-2 px-2 py-1 bg-primary text-white rounded text-sm font-medium"
                        >
                            {hotel.property.reviewScore}
                        </motion.div>
                    )}
                    {/* Special Labels */}
                    {(hotel.property.priceBreakdown.benefitBadges?.length > 0 || isNewProperty) && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="absolute top-2 right-2 flex flex-wrap gap-1.5 justify-end max-w-[70%]"
                        >
                            {hotel.property.priceBreakdown.benefitBadges?.map((badge) => {
                                const isSpecialDeal = badge.text.toLowerCase().includes('mobile') ||
                                    badge.text.toLowerCase().includes('secret') ||
                                    badge.text.toLowerCase().includes('deal');

                                return (
                                    <span
                                        key={badge.identifier}
                                        className={`
                                            inline-flex items-center px-2.5 py-1.5 
                                            rounded-md text-xs font-semibold 
                                            whitespace-nowrap shadow-sm
                                            ${isSpecialDeal
                                                ? 'bg-gold-50 text-gold-700 ring-1 ring-gold-600/20'
                                                : 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/10'
                                            }
                                        `}
                                    >
                                        {badge.text}
                                    </span>
                                );
                            })}
                            {isNewProperty && (
                                <span className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-semibold bg-green-50 text-green-700 whitespace-nowrap ring-1 ring-green-600/20 shadow-sm">
                                    New to Booking.com
                                </span>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-2.5 flex flex-col flex-grow">
                    {/* Rating Section */}
                    <div className="flex items-center gap-1.5 mb-1">
                        {hotel.property.propertyClass > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex text-yellow-400 text-[11px]"
                            >
                                {Array.from({ length: hotel.property.propertyClass }).map((_, starIndex) => (
                                    <span key={`${hotel.hotel_id}-star-${starIndex}`}>★</span>
                                ))}
                            </motion.div>
                        )}
                        {hotel.property.reviewCount > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center gap-1 text-[11px]"
                            >
                                <span className="text-gray-600">•</span>
                                <span className="font-medium">
                                    {hotel.property.reviewCount} reviews
                                </span>
                                {hotel.property.reviewScoreWord && (
                                    <>
                                        <span className="text-gray-600">•</span>
                                        <span className="text-primary font-medium">
                                            {hotel.property.reviewScoreWord}
                                        </span>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Hotel Details Group */}
                    <div className="space-y-0.5">
                        {/* Hotel Info */}
                        <motion.h3
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-sm font-medium line-clamp-1"
                        >
                            {hotel.property.name}
                        </motion.h3>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-xs text-gray-600 line-clamp-1"
                        >
                            {getLocationFromAccessibilityLabel(hotel.accessibilityLabel)}
                        </motion.p>

                        {/* Room Details */}
                        {getRoomDetailsFromAccessibilityLabel(hotel.accessibilityLabel) && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-[11px] text-gray-500"
                            >
                                {getRoomDetailsFromAccessibilityLabel(hotel.accessibilityLabel)}
                            </motion.p>
                        )}

                        {/* Check-in/out Times */}
                        {(hotel.property.checkin?.fromTime || hotel.property.checkout?.untilTime) && (
                            <div className="flex gap-3 text-[11px] text-gray-500">
                                {hotel.property.checkin?.fromTime && (
                                    <span>Check-in: {hotel.property.checkin.fromTime}</span>
                                )}
                                {hotel.property.checkout?.untilTime && (
                                    <span>Check-out: {hotel.property.checkout.untilTime}</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Price Section */}
                    <div className="mt-auto pt-2 min-h-[4.5rem]">
                        <div className="flex flex-col">
                            {hotel.property.priceBreakdown.strikethroughPrice && (
                                <div className="text-[11px] text-gray-500 line-through">
                                    {hotel.property.priceBreakdown.strikethroughPrice.value.toFixed(2)} {hotel.property.priceBreakdown.strikethroughPrice.currency}
                                </div>
                            )}
                            <div className="text-base font-semibold text-primary">
                                {hotel.property.priceBreakdown.grossPrice.value.toFixed(2)} {hotel.property.priceBreakdown.grossPrice.currency}
                            </div>
                            <div className="text-[10px] text-gray-500">
                                Includes taxes and fees
                            </div>
                        </div>
                        {/* Cancellation Policy */}
                        <div className="h-8 flex flex-col justify-end">
                            {hasFreeCancel && (
                                <span className="text-[11px] text-green-600 font-medium">
                                    Free cancellation
                                </span>
                            )}
                            {noPrePayment && (
                                <span className="text-[11px] text-green-600 font-medium">
                                    No prepayment needed
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                {/* Add Book Now button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsBookingModalOpen(true);
                    }}
                    className="absolute bottom-4 right-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                    Book Now
                </motion.button>
            </motion.div>

            {/* Hotel Details Modal */}
            {isDetailsModalOpen && (
                <HotelDetailsModal
                    hotel={hotel}
                    onClose={() => setIsDetailsModalOpen(false)}
                    onBook={() => {
                        setIsDetailsModalOpen(false);
                        setIsBookingModalOpen(true);
                    }}
                />
            )}

            {/* Hotel Booking Modal */}
            {isBookingModalOpen && (
                <HotelBookingModal
                    hotelId={String(hotel.hotel_id)}
                    searchParams={searchParams}
                    onClose={() => setIsBookingModalOpen(false)}
                    onBookingComplete={handleBookingComplete}
                />
            )}
        </>
    );
} 