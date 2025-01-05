import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../lib/firebase/useAuth';
import { HotelBookingForm } from '../../components/hotel-booking/HotelBookingForm';
import { HotelBookingHero } from '../../components/hotel-booking/HotelBookingHero';
import bookPic from '../../assets/book.jpg';
import { hotelService } from '../../lib/api/hotelService';
import { HotelDetails, HotelDetailsResponse, HotelProperty } from '../../types/hotelTypes';
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

function transformToHotelDetails(response: HotelDetailsResponse): HotelDetails {
    const property: HotelProperty = {
        id: response.hotel_id,
        name: response.hotel_name,
        reviewScore: response.review_score,
        reviewCount: response.review_nr,
        reviewScoreWord: response.reviewScoreWord,
        propertyClass: response.propertyClass,
        accuratePropertyClass: response.propertyClass,
        latitude: response.latitude,
        longitude: response.longitude,
        currency: response.composite_price_breakdown.gross_amount.currency,
        countryCode: 'US',
        city: response.city,
        photoUrls: Object.values(response.rooms).flatMap(room =>
            room.photos?.map(photo => photo.url_max1280) || []
        ),
        location: {
            address: response.address,
            city: response.city,
            country: response.country_trans
        },
        priceBreakdown: {
            grossPrice: response.composite_price_breakdown.gross_amount,
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

    const rooms = Object.entries(response.rooms).map(([id, room]) => {
        // Use the raw room price from the API response
        const roomPrice = response.composite_price_breakdown.gross_amount.value / Object.keys(response.rooms).length;

        return {
            id,
            name: room.room_name,
            description: room.facilities?.map(f => f.name).join(', ') ?? '',
            price: {
                amount: roomPrice,
                currency: response.composite_price_breakdown.gross_amount.currency,
                per_night: true
            },
            capacity: {
                adults: room.nr_adults ?? 1,
                children: room.nr_children ?? 0
            },
            amenities: room.facilities?.map(f => f.name) || [],
            images: room.photos?.map(photo => photo.url_max1280) || [],
            availability: true
        };
    });

    return {
        hotel_id: response.hotel_id,
        accessibilityLabel: '',
        property,
        policies: [],
        reviews: [],
        facilities: response.facilities_block.facilities.map(f => f.name),
        rooms
    };
}

export default function HotelBookingPage() {
    const { hotelId } = useParams<{ hotelId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
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

                setHotel(transformToHotelDetails(response.data));
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

            const selectedRoom = hotel.rooms.find(room => room.id === formData.roomType);
            if (!selectedRoom) throw new Error('Room not found');

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
                    id: selectedRoom.id,
                    name: selectedRoom.name || 'Standard Room',
                    description: selectedRoom.description || '',
                    amenities: selectedRoom.amenities || [],
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

            // Navigate to confirmation page with booking ID
            navigate(`/bookings/${docRef.id}`);
        } catch (err) {
            console.error('Error submitting booking:', err);
            setError('Failed to submit booking. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center"
            >
                <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-opacity-25"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 text-gray-600"
                >
                    Loading hotel details...
                </motion.p>
            </motion.div>
        );
    }

    if (error || !hotel) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-screen pt-32 pb-12 px-4"
            >
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="w-16 h-16 mx-auto mb-6 text-red-500">
                            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </motion.div>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl font-semibold text-gray-900 mb-4"
                    >
                        {error ?? 'Hotel not found'}
                    </motion.h1>
                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => navigate('/hotels')}
                        className="text-primary hover:text-primary-dark transition-colors"
                    >
                        Return to hotel search
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    const initialFormData: HotelBookingFormData = {
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
        roomType: hotel?.rooms[0]?.id || ''
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
        >
            <HotelBookingHero
                backgroundImage={bookPic}
                title="Book Your Perfect Stay"
                subtitle="Experience comfort and luxury at your dream destination"
            />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 pb-12"
            >
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <motion.h2
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-xl font-semibold text-gray-900 mb-6"
                        >
                            {hotel.property.name}
                        </motion.h2>
                        <HotelBookingForm
                            hotel={hotel}
                            initialData={initialFormData}
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
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}