import { motion, AnimatePresence } from 'framer-motion';
import { HotelSearchResult } from '../../types/hotelSearch';
import { createPortal } from 'react-dom';

interface HotelDetailsModalProps {
    hotel: HotelSearchResult;
    onClose: () => void;
    onBook: () => void;
}

export function HotelDetailsModal({ hotel, onClose, onBook }: HotelDetailsModalProps) {
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 }
    };

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ zIndex: 99999 }}
                className="fixed inset-0 bg-black/50 overflow-y-auto"
                onClick={onClose}
            >
                <div className="min-h-screen w-full flex items-center sm:items-start justify-center p-4">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={modalVariants}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="w-full max-w-3xl bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-500 transition-colors bg-white/80 backdrop-blur-sm rounded-full"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Hero Image */}
                        <div className="relative h-48 sm:h-56 w-full">
                            <div className="absolute inset-0">
                                <img
                                    src={hotel.property.photoUrls[0]}
                                    alt={hotel.property.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                            <div className="absolute bottom-0 left-0 p-4">
                                <h2 className="text-base sm:text-lg font-serif mb-1 text-white">{hotel.property.name}</h2>
                                <div className="space-y-0.5">
                                    {hotel.accessibilityLabel.split('\n').map((line) => {
                                        if (line.includes('bed') || line.includes('room') || line.includes('bathroom')) {
                                            return (
                                                <p key={`room-${line.trim()}`} className="text-[11px] text-white/90">
                                                    {line.trim()}
                                                </p>
                                            );
                                        }
                                        return null;
                                    })}
                                    <p className="text-xs opacity-90 text-white">
                                        {hotel.property.location?.address && (
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {hotel.property.location.address}, {hotel.property.location.city}, {hotel.property.location.country}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4">
                            {/* Price and Book Button */}
                            <div className="flex items-center justify-between pb-3 border-b">
                                <div>
                                    {hotel.property.priceBreakdown.strikethroughPrice && (
                                        <div className="text-[11px] text-gray-500 line-through">
                                            {hotel.property.priceBreakdown.strikethroughPrice.value.toFixed(2)} {hotel.property.priceBreakdown.strikethroughPrice.currency}
                                        </div>
                                    )}
                                    <div className="text-lg font-bold text-primary">
                                        {hotel.property.priceBreakdown.grossPrice.value.toFixed(2)} {hotel.property.priceBreakdown.grossPrice.currency}
                                    </div>
                                    <div className="text-[11px] text-gray-500">per night • Includes taxes and fees</div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onBook}
                                    className="px-4 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                    Book Now
                                </motion.button>
                            </div>

                            {/* Rating and Reviews */}
                            <div className="flex items-center space-x-3">
                                {Boolean(hotel.property.reviewScore) && (
                                    <div className="px-1.5 py-0.5 bg-primary text-white text-xs rounded">
                                        {hotel.property.reviewScore.toFixed(1)}
                                    </div>
                                )}
                                <span className="text-xs text-gray-600">
                                    {hotel.property.reviewCount} reviews • {hotel.property.reviewScoreWord}
                                </span>
                            </div>

                            {/* Special Badges */}
                            {hotel.property.priceBreakdown.benefitBadges?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {hotel.property.priceBreakdown.benefitBadges.map((badge) => (
                                        <div
                                            key={`badge-${badge.text}`}
                                            className={`px-2 py-0.5 rounded text-[11px] ${badge.variant === 'constructive'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-blue-100 text-blue-700'
                                                }`}
                                        >
                                            {badge.text}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Photo Gallery - Mobile Optimized */}
                            <div>
                                <h3 className="text-sm font-medium mb-2">Photo Gallery</h3>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {[
                                        ...hotel.property.photoUrls.slice(0, 6),
                                        ...(Object.values(hotel.rooms || {})
                                            .flatMap(room => room.photos?.map(photo => photo.url_max1280) || [])
                                            .slice(0, 3))
                                    ].map((photo, index) => (
                                        <motion.div
                                            key={`photo-${photo}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="aspect-square rounded overflow-hidden"
                                        >
                                            <img
                                                src={photo}
                                                alt={`${hotel.property.name} ${index + 1}`}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Property Details */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <h3 className="text-sm font-medium mb-1.5">Property Details</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                            </svg>
                                            <span className="text-xs">{hotel.property.propertyClass} Star Hotel</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-xs">Check-in: {hotel.property.checkin?.fromTime} - {hotel.property.checkin?.untilTime}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-xs">Check-out: {hotel.property.checkout?.fromTime} - {hotel.property.checkout?.untilTime}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Policies */}
                                <div>
                                    <h3 className="text-sm font-medium mb-1.5">Booking Policies</h3>
                                    <div className="space-y-2">
                                        {hotel.accessibilityLabel.toLowerCase().includes('free cancellation') && (
                                            <div className="flex items-center space-x-1.5 text-green-600">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-xs">Free cancellation available</span>
                                            </div>
                                        )}
                                        {hotel.accessibilityLabel.toLowerCase().includes('no prepayment') && (
                                            <div className="flex items-center space-x-1.5 text-green-600">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-xs">No prepayment needed</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Location Map */}
                            {hotel.property.location && (
                                <div>
                                    <h3 className="text-sm font-medium mb-1.5">Location</h3>
                                    <motion.div
                                        className="aspect-video rounded overflow-hidden shadow-sm border border-gray-100"
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <iframe
                                            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d${hotel.property.longitude}!3d${hotel.property.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s${encodeURIComponent(hotel.property.name)}!5e0!3m2!1sen!2sus!4v1704007169799!5m2!1sen!2sus`}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title={`${hotel.property.name} Location Map`}
                                        />
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
} 