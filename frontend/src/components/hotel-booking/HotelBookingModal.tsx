import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../lib/firebase/useAuth';
import { HotelBookingForm } from './HotelBookingForm';
import { hotelService } from '../../lib/api/hotelService';
import { HotelDetailsResponse, HotelDetails, HotelRoomDetails } from '../../types/hotelDetails';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/firebase';

interface UserProfile {
    dateOfBirth?: string;
    nationality?: string;
    idNumber?: string;
    idExpiry?: string;
    phoneNumber?: string;
}

interface HotelBookingFormData {
    checkInDate: string;
    checkOutDate: string;
    numberOfRooms: number;
    numberOfGuests: number;
    numberOfNights: number;
    roomType?: string;
    guests: Array<{
        fullName: string;
        nationality: string;
        dateOfBirth: string;
        idNumber: string;
        idExpiry: string;
    }>;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    specialRequests?: string;
}

interface HotelBookingModalProps {
    hotelId: string | null;
    searchParams: URLSearchParams;
    onClose: () => void;
    onBookingComplete: (bookingId: string) => void;
}

function transformToHotelDetails(response: HotelDetailsResponse): HotelDetails {
    if (!response.data) {
        throw new Error('No hotel data in response');
    }

    const data = response.data;
    const property = {
        id: data.hotel_id,
        name: data.hotel_name,
        reviewScore: data.review_score,
        reviewCount: data.review_nr,
        reviewScoreWord: data.reviewScoreWord,
        propertyClass: data.propertyClass,
        accuratePropertyClass: data.propertyClass,
        latitude: data.latitude,
        longitude: data.longitude,
        currency: data.composite_price_breakdown.gross_amount.currency,
        countryCode: 'US',
        city: data.city,
        photoUrls: Object.values(data.rooms).flatMap((room: HotelRoomDetails) =>
            room.photos?.map((photo) => photo.url_max1280) || []
        ),
        location: {
            address: data.address,
            city: data.city,
            country: data.country_trans
        },
        priceBreakdown: {
            grossPrice: data.composite_price_breakdown.gross_amount,
            benefitBadges: []
        },
        checkin: {
            fromTime: '14:00',
            untilTime: '23:00'
        },
        checkout: {
            fromTime: '00:00',
            untilTime: '12:00'
        }
    };

    const rooms = Object.entries(data.rooms).reduce<HotelDetails['rooms']>((acc, [id, room]: [string, HotelRoomDetails]) => {
        const roomPrice = data.composite_price_breakdown.gross_amount.value / Object.keys(data.rooms).length;

        acc[id] = {
            ...room,
            id,
            price: {
                amount: roomPrice,
                currency: data.composite_price_breakdown.gross_amount.currency,
                per_night: true
            },
            capacity: {
                adults: room.nr_adults ?? 1,
                children: room.nr_children ?? 0
            },
            amenities: room.facilities?.map((f) => f.name) || [],
            images: room.photos?.map((photo) => photo.url_max1280) || [],
            availability: true
        };

        return acc;
    }, {});

    return {
        hotel_id: data.hotel_id,
        accessibilityLabel: '',
        property,
        rooms,
        facilities: data.facilities_block.facilities.map((f) => f.name),
        policies: [],
        reviews: [],
        facilities_block: data.facilities_block,
        property_highlight_strip: data.property_highlight_strip,
        composite_price_breakdown: data.composite_price_breakdown
    };
}

export function HotelBookingModal({ hotelId, searchParams, onClose, onBookingComplete }: HotelBookingModalProps) {
    const [hotel, setHotel] = useState<HotelDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user) return;
            try {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUserProfile(userDoc.data());
                }
            } catch (err) {
                console.error('Error fetching user profile:', err);
            }
        };

        fetchUserProfile();
    }, [user]);

    useEffect(() => {
        const fetchHotelDetails = async () => {
            if (!hotelId) return;

            try {
                setIsLoading(true);
                const checkIn = searchParams.get('checkIn') ?? new Date().toISOString().split('T')[0];
                const checkOut = searchParams.get('checkOut') ?? new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
                const adults = searchParams.get('adults') ?? '1';

                const response = await hotelService.getHotelDetails(hotelId, {
                    arrival_date: checkIn,
                    departure_date: checkOut,
                    adults,
                    children_age: '',
                    room_qty: '1',
                    page_number: '1',
                    units: 'metric',
                    temperature_unit: 'c',
                    languagecode: 'en-us',
                    currency_code: 'USD'
                });

                if (!response.status || !response.data) {
                    throw new Error('Failed to fetch hotel details');
                }

                setHotel(transformToHotelDetails(response));
            } catch (err) {
                setError('Failed to load hotel details');
                console.error('Error fetching hotel details:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHotelDetails();
    }, [hotelId, searchParams]);

    const handleSubmit = async (formData: HotelBookingFormData) => {
        try {
            if (!hotel || !user) return;

            // Calculate number of nights
            const checkIn = new Date(formData.checkInDate);
            const checkOut = new Date(formData.checkOutDate);
            const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

            const selectedRoom = hotel.rooms[formData.roomType || ''];
            if (!selectedRoom) throw new Error('Room not found');

            console.log('Selected Room:', selectedRoom); // Debug log

            // Calculate total price based on per-night rate
            const pricePerNight = selectedRoom.price.amount;
            const totalPrice = pricePerNight * numberOfNights * formData.numberOfRooms;

            // Create booking data
            const bookingData = {
                ...formData,
                hotelId: hotel.hotel_id,
                hotelName: hotel.property.name,
                totalPrice: {
                    amount: totalPrice,
                    currency: selectedRoom.price.currency
                },
                status: 'pending',
                createdAt: new Date().toISOString(),
                userId: user.uid,
                type: 'hotel',
                room: {
                    id: formData.roomType,
                    name: selectedRoom.room_name || 'Standard Room',
                    description: selectedRoom.facilities?.map(f => f.name).join(', ') || 'No description available',
                    amenities: selectedRoom.facilities?.map(f => f.name) || [],
                    price: {
                        amount: pricePerNight,
                        currency: selectedRoom.price.currency,
                        perNight: true
                    }
                },
                location: {
                    address: hotel.property.location?.address ?? '',
                    city: hotel.property.location?.city ?? '',
                    country: hotel.property.location?.country ?? ''
                },
                dates: {
                    checkIn: formData.checkInDate,
                    checkOut: formData.checkOutDate,
                    numberOfNights
                },
                numberOfRooms: formData.numberOfRooms,
                numberOfGuests: formData.numberOfGuests
            };

            // Save to Firestore
            const bookingsRef = collection(db, 'bookings');
            const docRef = await addDoc(bookingsRef, bookingData);

            // Close modal and notify parent
            onBookingComplete(docRef.id);
            onClose();
        } catch (err) {
            console.error('Error submitting booking:', err);
            setError('Failed to submit booking. Please try again.');
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[100] overflow-y-auto"
                onClick={onClose}
            >
                <div className="min-h-screen px-4 py-20 flex items-center justify-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={modalVariants}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="w-full max-w-4xl max-h-[calc(100vh-8rem)] overflow-y-auto bg-white rounded-2xl shadow-xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-gray-500 transition-colors bg-white/80 backdrop-blur-sm rounded-full"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {isLoading ? (
                            <div className="h-96 flex items-center justify-center">
                                <div className="w-16 h-16 relative">
                                    <div className="absolute inset-0 rounded-full border-4 border-primary border-opacity-25"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="h-96 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-6 text-red-500">
                                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{error}</h3>
                                    <button
                                        onClick={onClose}
                                        className="text-primary hover:text-primary-dark transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        ) : hotel && (
                            <>
                                {/* Hero Image */}
                                <div className="relative h-64 sm:h-72">
                                    <img
                                        src={hotel.property.photoUrls[0]}
                                        alt={hotel.property.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-6 text-white">
                                        <h2 className="text-2xl sm:text-3xl font-serif mb-2">{hotel.property.name}</h2>
                                        <p className="text-base sm:text-lg opacity-90">
                                            {hotel.property.location?.city}, {hotel.property.location?.country}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <HotelBookingForm
                                        hotel={hotel}
                                        initialData={{
                                            checkInDate: searchParams.get('checkIn') ?? new Date().toISOString().split('T')[0],
                                            checkOutDate: searchParams.get('checkOut') ?? new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
                                            numberOfRooms: 1,
                                            numberOfGuests: parseInt(searchParams.get('adults') ?? '1'),
                                            numberOfNights: Math.ceil(
                                                (new Date(searchParams.get('checkOut') ?? new Date(new Date().setDate(new Date().getDate() + 1))).getTime() -
                                                    new Date(searchParams.get('checkIn') ?? new Date()).getTime()) / (1000 * 60 * 60 * 24)
                                            ),
                                            guests: [{
                                                fullName: '',
                                                dateOfBirth: '',
                                                nationality: '',
                                                idNumber: '',
                                                idExpiry: ''
                                            }],
                                            contactName: '',
                                            contactEmail: '',
                                            contactPhone: '',
                                            specialRequests: '',
                                            roomType: Object.keys(hotel.rooms)[0] || ''
                                        }}
                                        onSubmit={handleSubmit}
                                        showAutoFill={!!user}
                                        onAutoFillGuest={() => {
                                            if (!user || !userProfile) return null;
                                            return {
                                                fullName: user.displayName ?? '',
                                                dateOfBirth: userProfile.dateOfBirth ?? '',
                                                nationality: userProfile.nationality ?? '',
                                                idNumber: userProfile.idNumber ?? '',
                                                idExpiry: userProfile.idExpiry ?? ''
                                            };
                                        }}
                                        onAutoFillContact={(field) => {
                                            if (!user || !userProfile) return '';
                                            switch (field) {
                                                case 'name':
                                                    return user.displayName ?? '';
                                                case 'email':
                                                    return user.email ?? '';
                                                case 'phone':
                                                    return userProfile.phoneNumber ?? user.phoneNumber ?? '';
                                                default:
                                                    return '';
                                            }
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
} 