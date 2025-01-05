import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { hotelService } from '../../lib/api/hotelService';
import { HotelDetailsResponse } from '../../types/hotelTypes';

export default function HotelDetailsPage() {
    const { hotelId } = useParams<{ hotelId: string }>();
    const [hotel, setHotel] = useState<HotelDetailsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotelDetails = async () => {
            if (!hotelId) return;

            setIsLoading(true);
            setError(null);

            try {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                const params = {
                    adults: '2',
                    room_qty: '1',
                    page_number: '1',
                    units: 'metric',
                    temperature_unit: 'c',
                    languagecode: 'en-us',
                    currency_code: 'USD',
                    arrival_date: today.toISOString().split('T')[0],
                    departure_date: tomorrow.toISOString().split('T')[0]
                };

                const response = await hotelService.getHotelDetails(hotelId, params);
                if (response.status) {
                    setHotel(response.data);
                } else {
                    setError('Hotel not found');
                }
            } catch (err) {
                setError('Failed to load hotel details. Please try again later.');
                console.error('Error fetching hotel details:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHotelDetails();
    }, [hotelId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-gray-200 rounded w-1/4" />
                        <div className="aspect-video bg-gray-200 rounded-lg" />
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !hotel) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-medium text-gray-900 mb-2">
                        {error ?? 'Hotel not found'}
                    </h2>
                    <p className="text-gray-600">
                        Please try again later or go back to search for other hotels.
                    </p>
                </div>
            </div>
        );
    }

    // Get all photos from all rooms
    const photos = Object.values(hotel.rooms)
        .flatMap(room => room.photos || [])
        .filter((photo, index, self) =>
            // Remove duplicates based on photo_id
            index === self.findIndex(p => p.photo_id === photo.photo_id)
        );

    const facilities = hotel.facilities_block?.facilities || [];
    // Get all rooms with their keys
    const rooms = Object.entries(hotel.rooms).map(([roomKey, room]) => ({ ...room, roomKey }));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hotel Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-serif mb-2">{hotel.hotel_name}</h1>
                    <div className="flex items-center gap-4">
                        {hotel.propertyClass > 0 && (
                            <div className="flex items-center">
                                <span className="text-yellow-400">
                                    {'★'.repeat(hotel.propertyClass)}
                                </span>
                            </div>
                        )}
                        {hotel.review_score > 0 && (
                            <div className="flex items-center gap-1">
                                <span className="px-2 py-1 bg-primary text-white rounded-lg font-medium">
                                    {hotel.review_score}
                                </span>
                                <span className="text-gray-600">
                                    {hotel.reviewScoreWord} • {hotel.review_nr} reviews
                                </span>
                            </div>
                        )}
                    </div>
                    <p className="text-gray-600 mt-2">
                        {hotel.address}, {hotel.city}, {hotel.country_trans}
                    </p>
                </div>

                {/* Property Highlights */}
                {hotel.property_highlight_strip && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <h3 className="text-lg font-medium mb-4">Property Highlights</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {hotel.property_highlight_strip.map((highlight) => (
                                <div
                                    key={`highlight-${highlight.name}-${highlight.icon_list.map(i => i.icon).join('-')}`}
                                    className="flex items-center gap-2"
                                >
                                    <span className="text-primary">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M9 12l2 2 4-4"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>
                                    <span className="text-gray-600">{highlight.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Photo Gallery */}
                {photos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {photos.map((photo, index) => (
                            <motion.div
                                key={photo.photo_id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="aspect-video rounded-lg overflow-hidden"
                            >
                                <img
                                    src={photo.url_max750}
                                    alt={`${hotel.hotel_name} ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Available Rooms */}
                {rooms.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <h3 className="text-lg font-medium mb-4">Available Rooms</h3>
                        <div className="space-y-6">
                            {rooms.map((room) => (
                                <div key={room.roomKey} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                                    <h4 className="font-medium mb-2">{room.room_name}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h5 className="text-sm font-medium text-gray-600 mb-2">Room Amenities</h5>
                                            <div className="grid grid-cols-2 gap-2">
                                                {room.facilities?.map((facility) => (
                                                    <div key={`${room.roomKey}-facility-${facility.name}`} className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-600">{facility.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {room.mealplan && (
                                            <div>
                                                <h5 className="text-sm font-medium text-gray-600 mb-2">Meal Plan</h5>
                                                <p className="text-sm text-gray-600 whitespace-pre-line">{room.mealplan}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Price and Booking Section */}
                {hotel.composite_price_breakdown && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-medium">
                                    {hotel.composite_price_breakdown.gross_amount.currency}{' '}
                                    {Math.round(hotel.composite_price_breakdown.gross_amount.value)}
                                </h2>
                                {hotel.hotel_include_breakfast === 1 && (
                                    <p className="text-green-600 text-sm">Breakfast included</p>
                                )}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                onClick={() => navigate(`/hotels/${hotelId}/book`)}
                            >
                                Book Now
                            </motion.button>
                        </div>
                    </div>
                )}

                {/* Facilities */}
                {facilities.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <h3 className="text-lg font-medium mb-4">{hotel.facilities_block?.name || 'Facilities'}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {facilities.map((facility) => (
                                <div key={`facility-${facility.name}`} className="flex items-center gap-2">
                                    <span className="text-gray-600">{facility.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Location */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h3 className="text-lg font-medium mb-4">Location</h3>
                    <p className="text-gray-600 mb-4">
                        {hotel.address}, {hotel.city}, {hotel.country_trans}
                    </p>
                    <motion.div
                        className="aspect-[16/9] rounded-lg overflow-hidden shadow-md border border-gray-100"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <iframe
                            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d${hotel.longitude}!3d${hotel.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s${encodeURIComponent(hotel.hotel_name)}!5e0!3m2!1sen!2sus!4v1704007169799!5m2!1sen!2sus`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`${hotel.hotel_name} Location Map`}
                        />
                    </motion.div>
                </div>
            </div>
        </motion.div >
    );
} 