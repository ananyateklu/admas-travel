import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../lib/firebase/useAuth';
import { HotelBookingForm } from './HotelBookingForm';
import { hotelService } from '../../lib/api/hotelService';
import { HotelDetailsResponse, HotelDetails } from '../../types/hotelDetails';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/firebase';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
    dateOfBirth?: string;
    nationality?: string;
    idNumber?: string;
    idExpiry?: string;
    phone?: string;
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
        photoUrls: Object.values(data.rooms).flatMap((room) =>
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

    const rooms = Object.entries(data.rooms).reduce<HotelDetails['rooms']>((acc, [id, room]) => {
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

// Add function to generate booking reference
function generateBookingReference(): string {
    const prefix = 'ADMAS'; // Full company name prefix
    const year = new Date().getFullYear().toString().slice(-2); // Last 2 digits of year
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0'); // Current month
    const random = Math.random().toString(36).substring(2, 5).toUpperCase(); // 3 random chars
    const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3 digit sequence
    return `${prefix}-${year}${month}-${random}${sequence}`;
}

export function HotelBookingModal({ hotelId, searchParams, onClose, onBookingComplete }: HotelBookingModalProps) {
    const [hotel, setHotel] = useState<HotelDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user) return;
            try {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    console.log('Fetched user profile:', data);
                    setUserProfile(data);
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
            if (!hotel || !user) {
                throw new Error('Missing hotel or user data');
            }

            // Generate booking reference
            const bookingReference = generateBookingReference();
            console.log('Generated booking reference:', bookingReference);

            // Calculate number of nights
            const checkIn = new Date(formData.checkInDate);
            const checkOut = new Date(formData.checkOutDate);
            const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

            const selectedRoom = hotel.rooms[formData.roomType ?? ''];
            if (!selectedRoom) throw new Error('Room not found');

            // Calculate total price based on per-night rate
            const pricePerNight = selectedRoom.price.amount;
            const totalPrice = pricePerNight * numberOfNights * formData.numberOfRooms;

            // Create booking data
            const bookingData = {
                ...formData,
                hotelId: hotel.hotel_id,
                hotelName: hotel.property.name,
                bookingReference,
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
                    description: selectedRoom.facilities?.map(f => f.name).join(', ') ?? 'No description available',
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

            // Add booking to Firestore
            const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);
            console.log('Booking saved with ID:', bookingRef.id);

            // Add booking to user's bookings subcollection
            const userBookingRef = doc(db, 'users', user.uid, 'bookings', bookingRef.id);
            await setDoc(userBookingRef, bookingData);
            console.log('Booking added to user subcollection');

            // Return the result without closing the modal
            return {
                bookingId: bookingRef.id,
                bookingReference
            };
        } catch (err) {
            console.error('Error creating booking:', err);
            setError('Failed to create booking');
            throw err;
        }
    };

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
                <div className="min-h-screen py-8 px-4 flex items-start justify-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={modalVariants}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="w-[95%] lg:w-[70%] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-500 transition-colors bg-white/80 backdrop-blur-sm rounded-full"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {isLoading && (
                            <div className="h-96 flex items-center justify-center">
                                <div className="w-16 h-16 relative">
                                    <div className="absolute inset-0 rounded-full border-4 border-primary border-opacity-25"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="h-96 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-6 text-red-500">
                                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
                                    <button
                                        onClick={onClose}
                                        className="text-primary hover:text-primary-dark transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}

                        {!isLoading && !error && hotel && (
                            <>
                                {/* Hero Image */}
                                <div className="relative h-56 sm:h-64 w-full">
                                    <div className="absolute inset-0 rounded-t-2xl overflow-hidden">
                                        <img
                                            src={hotel.property.photoUrls[0]}
                                            alt={hotel.property.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 p-5 text-white">
                                        <h2 className="text-lg sm:text-xl font-serif mb-1">{hotel.property.name}</h2>
                                        <p className="text-xs opacity-90">
                                            {hotel.property.location?.address && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {hotel.property.location.address}, {hotel.property.location.city}, {hotel.property.location.country}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-5">
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
                                        onClose={onClose}
                                        onBookingComplete={(bookingId) => {
                                            onBookingComplete?.(bookingId);
                                            // Navigate to hotel bookings page after completion
                                            navigate('/bookings/hotels');
                                        }}
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
                                            if (!user || !userProfile) {
                                                console.log('No user or profile data for auto-fill');
                                                return '';
                                            }
                                            console.log('Auto-fill contact field:', field, 'userProfile:', userProfile);

                                            switch (field) {
                                                case 'name':
                                                    return user.displayName ?? '';
                                                case 'email':
                                                    return user.email ?? '';
                                                case 'phone': {
                                                    // Try userProfile.phone first, then user.phoneNumber, then empty string
                                                    const phoneNumber = userProfile.phone || user.phoneNumber || '';
                                                    console.log('Auto-filling phone number:', phoneNumber);
                                                    return phoneNumber;
                                                }
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
        </AnimatePresence>,
        document.body
    );
} 