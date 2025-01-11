import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../lib/firebase/useAuth';
import { HotelBookingForm } from '../../components/hotel-booking/HotelBookingForm';
import { HotelBookingHero } from '../../components/hotel-booking/HotelBookingHero';
import { BookingConfirmationPopup } from '../../components/common/BookingConfirmationPopup';
import bookPic from '../../assets/book.jpg';
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

export default function HotelBookingPage() {
    const { hotelId } = useParams<{ hotelId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState<HotelDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<{
        name: string;
        reference: string;
        email: string;
    } | null>(null);

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

    // Add function to generate booking reference
    const generateBookingReference = () => {
        const prefix = 'ADMAS'; // Full company name prefix
        const year = new Date().getFullYear().toString().slice(-2); // Last 2 digits of year
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0'); // Current month
        const random = Math.random().toString(36).substring(2, 5).toUpperCase(); // 3 random chars
        const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3 digit sequence
        return `${prefix}-${year}${month}-${random}${sequence}`;
    };

    const handleSubmit = async (formData: HotelBookingFormData) => {
        try {
            if (!hotel || !user) return;

            setIsSubmitting(true);
            console.log('Starting hotel booking submission...'); // Debug log

            // Generate booking reference
            const bookingReference = generateBookingReference();
            console.log('Generated booking reference:', bookingReference); // Debug log

            // Calculate number of nights
            const checkIn = new Date(formData.checkInDate);
            const checkOut = new Date(formData.checkOutDate);
            const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

            const selectedRoom = hotel.rooms[formData.roomType ?? ''];
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

            console.log('Saving booking to Firestore...'); // Debug log

            // Save to Firestore
            const bookingsRef = collection(db, 'bookings');
            await addDoc(bookingsRef, bookingData);

            console.log('Booking saved successfully, setting popup details...'); // Debug log

            // Show confirmation popup
            const details = {
                name: hotel.property.name,
                reference: bookingReference,
                email: formData.contactEmail
            };
            console.log('Setting booking details:', details); // Debug log

            setBookingDetails(details);
            setShowConfirmation(true);

            console.log('Show confirmation set to true'); // Debug log
        } catch (err) {
            console.error('Error submitting booking:', err);
            setError('Failed to submit booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmationClose = () => {
        console.log('Closing confirmation popup'); // Debug log
        setShowConfirmation(false);
        setBookingDetails(null);
        // Navigate to bookings page
        navigate('/bookings');
    };

    // Add debug log for render
    console.log('Current state:', { showConfirmation, bookingDetails }); // Debug log

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
        roomType: Object.keys(hotel.rooms)[0] || ''
    };

    return (
        <>
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
                                isSubmitting={isSubmitting}
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

            {/* Confirmation Popup */}
            {bookingDetails && (
                <BookingConfirmationPopup
                    isOpen={showConfirmation}
                    onClose={handleConfirmationClose}
                    bookingType="hotel"
                    bookingDetails={bookingDetails}
                />
            )}
        </>
    );
}