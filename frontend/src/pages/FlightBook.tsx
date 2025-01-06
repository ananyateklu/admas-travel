import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/firebase/useAuth';
import { db } from '../lib/firebase';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import bookPic from '../assets/book.jpg';
import { TravelPreference } from '../hooks/useTravelPreferences';
import { BookingHero } from '../components/flight-booking/FlightBookingHero';
import { BookingForm } from '../components/flight-booking/FlightBookingForm';
import { Airport } from '../services/flightService';
import emailjs from '@emailjs/browser';
import { NotificationToggle } from '../components/notifications/NotificationToggle';
import { BookingConfirmationPopup } from '../components/common/BookingConfirmationPopup';

interface PassengerInfo {
    type: 'adult' | 'child';
    fullName: string;
    dateOfBirth: string;
    passportNumber: string;
    passportExpiry: string;
    nationality: string;
}

interface BookingFormData {
    tripType: 'roundtrip' | 'oneway';
    from: Airport | null;
    to: Airport | null;
    departureDate: string;
    departureTime: string;
    returnDate?: string;
    returnTime?: string;
    adults: number;
    children: number;
    class: 'economy' | 'business' | 'first';
    passengers: PassengerInfo[];
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    specialRequests?: string;
}

interface AccountData {
    displayName: string;
    email: string;
    phone: string;
    nationality: string;
    passportNumber: string;
    passportExpiry: string;
    dateOfBirth: string;
}

export function Book() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [accountData, setAccountData] = useState<AccountData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const preferences = location.state?.preferences as TravelPreference | undefined;
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<{
        name: string;
        reference: string;
        email: string;
    } | null>(null);

    // Add function to generate booking reference
    const generateBookingReference = () => {
        const prefix = 'ADMAS'; // Full company name prefix
        const year = new Date().getFullYear().toString().slice(-2); // Last 2 digits of year
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0'); // Current month
        const random = Math.random().toString(36).substring(2, 5).toUpperCase(); // 3 random chars
        const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3 digit sequence
        return `${prefix}-${year}${month}-${random}${sequence}`;
    };

    const getDurationDays = (duration?: string) => {
        switch (duration) {
            case 'short': return 7;
            case 'medium': return 14;
            case 'long': return 21;
            default: return 7;
        }
    };

    const getTravelClass = (travelStyle?: string) => {
        switch (travelStyle) {
            case 'luxury': return 'first';
            case 'comfort': return 'business';
            default: return 'economy';
        }
    };

    const [initialFormData] = useState<BookingFormData>(() => {
        // Calculate suggested dates based on preferences
        const today = new Date();
        const suggestedDeparture = new Date(today);
        suggestedDeparture.setDate(today.getDate() + 14); // Default to 2 weeks ahead

        const suggestedReturn = new Date(suggestedDeparture);
        suggestedReturn.setDate(suggestedDeparture.getDate() + getDurationDays(preferences?.duration));

        // Format dates to YYYY-MM-DD
        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        return {
            tripType: 'roundtrip',
            from: null,
            to: null,
            departureDate: formatDate(suggestedDeparture),
            departureTime: '09:00', // Default departure time to 9 AM
            returnDate: formatDate(suggestedReturn),
            returnTime: '09:00', // Default return time to 9 AM
            adults: 1,
            children: 0,
            class: getTravelClass(preferences?.travelStyle),
            passengers: [{
                type: 'adult',
                fullName: '',
                dateOfBirth: '',
                passportNumber: '',
                passportExpiry: '',
                nationality: ''
            }],
            contactName: '',
            contactEmail: '',
            contactPhone: '',
            specialRequests: preferences ? `Travel Style: ${preferences.travelStyle}
Interests: ${preferences.interests.join(', ')}
Budget Range: ${preferences.budget}
Duration: ${preferences.duration}` : ''
        };
    });

    // Fetch user profile data when component mounts
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const profileData = {
                            ...userDoc.data(),
                            displayName: user.displayName ?? '',
                            email: user.email ?? '',
                            dateOfBirth: userDoc.data().dateOfBirth ?? '',
                            passportNumber: userDoc.data().passportNumber ?? '',
                            passportExpiry: userDoc.data().passportExpiry ?? '',
                            nationality: userDoc.data().nationality ?? ''
                        } as AccountData;
                        setAccountData(profileData);
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            }
        };

        fetchUserProfile();
    }, [user]);

    const handleAutoFillPassenger = () => {
        if (user && accountData) {
            // Use the date string directly since it's already in YYYY-MM-DD format
            const passengerInfo = {
                fullName: accountData.displayName,
                nationality: accountData.nationality,
                passportNumber: accountData.passportNumber,
                passportExpiry: accountData.passportExpiry,
                dateOfBirth: accountData.dateOfBirth,
                type: 'adult' as const
            };

            return passengerInfo;
        }
        return null;
    };

    const handleAutoFillContact = (field: 'name' | 'email' | 'phone') => {
        if (user && accountData) {
            switch (field) {
                case 'name':
                    return accountData.displayName || '';
                case 'email':
                    return accountData.email || '';
                case 'phone':
                    return accountData.phone || '';
                default:
                    return '';
            }
        }
        return '';
    };

    const sendBookingEmails = async (bookingData: BookingFormData & { createdAt: string; status: string; }) => {
        try {
            // Check if user has enabled email notifications
            const settingsDoc = await getDoc(doc(db, `users/${user!.uid}/settings/preferences`));
            const settings = settingsDoc.data();

            if (!settings?.notifications?.emailNotifications) {
                console.log('Email notifications are disabled for this user');
                return;
            }

            // Initialize EmailJS
            emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

            // Format booking details for email
            const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const bookingDetails = `
Flight Booking Details:
------------------------
Trip Type: ${bookingData.tripType}
From: ${bookingData.from?.name ?? bookingData.from}
To: ${bookingData.to?.name ?? bookingData.to}
Departure: ${formatDate(bookingData.departureDate)}
${bookingData.returnDate ? `Return: ${formatDate(bookingData.returnDate)}` : ''}
Class: ${bookingData.class}
Number of Passengers: ${bookingData.adults + bookingData.children}
Contact Information: ${bookingData.contactName} (${bookingData.contactPhone})

Special Requests:
${bookingData.specialRequests ?? 'None'}

Passenger Details:
${bookingData.passengers.map((p, i) => `
Passenger ${i + 1}:
- Name: ${p.fullName}
- Type: ${p.type}
- Nationality: ${p.nationality}
- Passport: ${p.passportNumber}
- Passport Expiry: ${p.passportExpiry}
- Date of Birth: ${p.dateOfBirth}
`).join('\n')}
            `.trim();

            // Send booking notification (auto-reply will handle customer confirmation)
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_BOOKING_TEMPLATE_ID,
                {
                    to_name: bookingData.contactName,
                    to_email: bookingData.contactEmail,
                    customer_name: bookingData.contactName,
                    customer_email: bookingData.contactEmail,
                    customer_phone: bookingData.contactPhone,
                    booking_details: bookingDetails
                }
            );

        } catch (error) {
            console.error('Error sending booking emails:', error);
            // Don't throw the error - we don't want to interrupt the booking process
            // just because email sending failed
        }
    };

    const handleSubmit = async (formData: BookingFormData) => {
        if (!user) {
            toast.error('Please sign in to make a booking');
            return;
        }

        try {
            setIsSubmitting(true);

            // Generate booking reference
            const bookingReference = generateBookingReference();

            // Prepare the booking data with airport strings instead of objects
            const bookingData = {
                ...formData,
                from: formData.from,
                to: formData.to,
                preferences: preferences ?? null,
                status: 'pending',
                createdAt: new Date().toISOString(),
                bookingReference,
                totalPassengers: formData.adults + formData.children
            };

            // Save user profile data
            await setDoc(doc(db, 'users', user.uid), {
                displayName: formData.contactName,
                email: formData.contactEmail,
                phone: formData.contactPhone,
                nationality: formData.passengers[0].nationality,
                passportNumber: formData.passengers[0].passportNumber,
                passportExpiry: formData.passengers[0].passportExpiry,
                dateOfBirth: formData.passengers[0].dateOfBirth,
                preferences: preferences || null
            }, { merge: true });

            // Create booking document with preferences
            const bookingRef = await addDoc(collection(db, 'bookings'), {
                userId: user.uid,
                userEmail: user.email,
                ...bookingData
            });

            // Add booking to user's bookings subcollection
            await setDoc(doc(db, 'users', user.uid, 'bookings', bookingRef.id), {
                userId: user.uid,
                userEmail: user.email,
                ...bookingData
            });

            // Send confirmation emails if notifications are enabled
            await sendBookingEmails(bookingData);

            // Set booking details for confirmation popup
            setBookingDetails({
                name: `${formData.from?.city} to ${formData.to?.city}`,
                reference: bookingReference,
                email: formData.contactEmail
            });
            setShowConfirmation(true);

            // Don't navigate immediately, let the user see the confirmation
            // The navigation will happen when they close the popup
        } catch (error) {
            console.error('Error submitting booking:', error);
            toast.error('Failed to submit booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
        navigate('/bookings');
    };

    return (
        <>
            <div className="min-h-screen bg-white">
                <BookingHero backgroundImage={bookPic} />

                <section className="py-6">
                    <div className="max-w-5xl mx-auto px-4">
                        <div className="mb-3 flex justify-end">
                            <NotificationToggle className="bg-white shadow-sm border border-gray-300 rounded-lg px-3 py-1.5" />
                        </div>
                        <div className="border border-gray-300 hover:border-gray-400 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md">
                            <BookingForm
                                initialData={initialFormData}
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                onAutoFillPassenger={handleAutoFillPassenger}
                                onAutoFillContact={handleAutoFillContact}
                                showAutoFill={!!user}
                            />
                        </div>
                    </div>
                </section>

                {/* Additional Information */}
                <section className="py-6 bg-gray-50">
                    <div className="max-w-5xl mx-auto px-4">
                        <div className="bg-white border border-gray-300 hover:border-gray-400 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md p-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center bg-white rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md p-4 group">
                                    <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center bg-gold/10 rounded-full group-hover:scale-110 group-hover:bg-gold/20 transition-all duration-300">
                                        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-semibold mb-1.5 text-gray-900">Email Support</h3>
                                    <p className="text-xs text-gray-600 hover:text-gray-900 transition-colors">ananya.meseret@gmail.com</p>
                                </div>
                                <div className="text-center bg-white rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md p-4 group">
                                    <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center bg-gold/10 rounded-full group-hover:scale-110 group-hover:bg-gold/20 transition-all duration-300">
                                        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-semibold mb-1.5 text-gray-900">Phone Support</h3>
                                    <p className="text-xs text-gray-600 hover:text-gray-900 transition-colors">+1 (612) 743-7243</p>
                                </div>
                                <div className="text-center bg-white rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md p-4 group">
                                    <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center bg-gold/10 rounded-full group-hover:scale-110 group-hover:bg-gold/20 transition-all duration-300">
                                        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-semibold mb-1.5 text-gray-900">Business Hours</h3>
                                    <p className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Mon-Fri: 9AM-6PM CST</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            {bookingDetails && (
                <BookingConfirmationPopup
                    isOpen={showConfirmation}
                    onClose={handleConfirmationClose}
                    bookingType="flight"
                    bookingDetails={bookingDetails}
                />
            )}
        </>
    );
} 