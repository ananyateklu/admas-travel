import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HotelSearchResult } from '../../types/hotelTypes';

interface HotelSearchResultsProps {
    results: HotelSearchResult[];
    isLoading: boolean;
}

export function HotelSearchResults({ results, isLoading }: HotelSearchResultsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!results || results.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hotels found
                </h3>
                <p className="text-gray-600">
                    Try adjusting your search criteria and try again.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto">
            {results.map((hotel) => (
                <Link
                    key={hotel.hotel_id}
                    to={`/hotels/${hotel.hotel_id}`}
                    className="block h-full"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col"
                    >
                        <div className="aspect-[3/1] relative">
                            <img
                                src={hotel.property.photoUrls[0] || '/placeholder-hotel.jpg'}
                                alt={hotel.property.name}
                                className="w-full h-full object-cover"
                            />
                            {hotel.property.reviewScore >= 8.5 && (
                                <div className="absolute top-1 right-1">
                                    <div className="px-1.5 py-0.5 bg-primary text-white rounded text-xs font-medium">
                                        {hotel.property.reviewScore}
                                    </div>
                                </div>
                            )}
                            {hotel.property.priceBreakdown.benefitBadges?.length > 0 && (
                                <div className="absolute bottom-1 left-1">
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {hotel.property.priceBreakdown.benefitBadges[0].text}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="p-1.5 flex flex-col flex-grow">
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        {hotel.property.propertyClass > 0 && (
                                            <div className="flex text-yellow-400 text-xs">
                                                {Array.from({ length: hotel.property.propertyClass }).map((_, starIndex) => (
                                                    <span key={`${hotel.hotel_id}-star-${starIndex}`}>★</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {hotel.property.reviewCount > 0 && (
                                        <span className="text-xs text-gray-600">
                                            {hotel.property.reviewCount} reviews
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-sm font-medium line-clamp-1">
                                    {hotel.property.name}
                                </h3>
                                <p className="text-xs text-gray-600 line-clamp-1">
                                    {hotel.property.location?.address ?? hotel.property.city ?? 'Location available upon request'}
                                </p>
                            </div>
                            <div className="flex items-end justify-between mt-0.5">
                                <div>
                                    {hotel.property.priceBreakdown?.strikethroughPrice && (
                                        <p className="text-xs text-gray-500 line-through">
                                            {hotel.property.priceBreakdown.strikethroughPrice.currency}{' '}
                                            {Math.round(hotel.property.priceBreakdown.strikethroughPrice.value)}
                                        </p>
                                    )}
                                    <div className="flex items-baseline gap-1">
                                        <p className="text-base font-medium text-primary">
                                            {hotel.property.priceBreakdown?.grossPrice?.currency || 'USD'}{' '}
                                            {Math.round(hotel.property.priceBreakdown?.grossPrice?.value || 0)}
                                        </p>
                                        <p className="text-xs text-gray-500">/ night</p>
                                    </div>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-2 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors text-xs font-medium"
                                >
                                    View Details
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </Link>
            ))}
        </div>
    );
} 