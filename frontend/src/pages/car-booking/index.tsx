import { useState } from 'react';
import { motion } from 'framer-motion';
import { CarSearchForm } from '../../components/car-booking/CarSearchForm';
import { CarSearchResults } from '../../components/car-booking/CarSearchResults';
import { CarDetailsModal } from '../../components/car-booking/CarDetailsModal';
import { CarBookingModal } from '../../components/car-booking/CarBookingModal';
import { CarSearchResult, CarSearchParams } from '../../types/carSearch';
import { carService } from '../../lib/api/carService';
import { useAuth } from '../../lib/firebase/useAuth';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/common/Toast';

interface SearchFormData {
    pickupLocation: {
        latitude: string;
        longitude: string;
    };
    dropoffLocation: {
        latitude: string;
        longitude: string;
    };
    pickupDate: Date;
    dropoffDate: Date;
    pickupTime: string;
    dropoffTime: string;
    driverAge: string;
}

interface BookingFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests?: string;
    agreeToTerms: boolean;
}

export default function CarBookingPage() {
    const { user } = useAuth();
    const { toasts, showToast } = useToast();
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<CarSearchResult[]>([]);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [selectedCar, setSelectedCar] = useState<CarSearchResult | null>(null);
    const [searchKey, setSearchKey] = useState<string>('');
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

    const handleSearch = async (formData: SearchFormData) => {
        setIsSearching(true);
        setSearchError(null);

        try {
            // Format dates to match API requirements (YYYY-MM-DD)
            const pickupDate = formData.pickupDate.toISOString().split('T')[0];
            const dropoffDate = formData.dropoffDate.toISOString().split('T')[0];

            const searchParams: CarSearchParams = {
                pick_up_latitude: String(parseFloat(formData.pickupLocation.latitude).toFixed(6)),
                pick_up_longitude: String(parseFloat(formData.pickupLocation.longitude).toFixed(6)),
                drop_off_latitude: String(parseFloat(formData.dropoffLocation.latitude).toFixed(6)),
                drop_off_longitude: String(parseFloat(formData.dropoffLocation.longitude).toFixed(6)),
                pick_up_time: `${pickupDate}T${formData.pickupTime}:00`,
                drop_off_time: `${dropoffDate}T${formData.dropoffTime}:00`,
                driver_age: formData.driverAge,
                currency_code: 'USD'
            };

            // Validate coordinates before making the API call
            if (!searchParams.pick_up_latitude || !searchParams.pick_up_longitude ||
                !searchParams.drop_off_latitude || !searchParams.drop_off_longitude ||
                isNaN(parseFloat(searchParams.pick_up_latitude)) || isNaN(parseFloat(searchParams.pick_up_longitude)) ||
                isNaN(parseFloat(searchParams.drop_off_latitude)) || isNaN(parseFloat(searchParams.drop_off_longitude))) {
                throw new Error(JSON.stringify({
                    message: "Please select valid pickup and drop-off locations"
                }));
            }

            const response = await carService.searchCarRentals(searchParams);

            if (response.status && response.data.vehicles) {
                setSearchResults(response.data.vehicles);
                setSearchKey(response.data.search_key);
            } else {
                setSearchError('Failed to fetch car rentals. Please try again.');
                setSearchResults([]);
            }
        } catch (error) {
            if (error instanceof Error && error.message.startsWith('{')) {
                const validationErrors = JSON.parse(error.message);
                setSearchError(validationErrors.message || 'Invalid search parameters. Please check your inputs and try again.');
                console.error('Validation errors:', validationErrors);
            } else {
                setSearchError('An error occurred while searching for cars. Please try again.');
            }
        } finally {
            setIsSearching(false);
        }
    };

    const handleCarSelect = (car: CarSearchResult) => {
        setSelectedCar(car);
    };

    const handleCloseModal = () => {
        setSelectedCar(null);
    };

    const handleBookCar = async () => {
        if (!selectedCar || !user) {
            showToast({
                title: 'Error',
                message: 'Please sign in to book a car',
                type: 'error'
            });
            return;
        }

        setIsBookingModalOpen(true);
    };

    const handleBookingConfirm = async (formData: BookingFormData) => {
        if (!selectedCar || !user) return;

        setIsBooking(true);
        try {
            const response = await carService.bookCar({
                vehicle_id: selectedCar.vehicle_id,
                search_key: searchKey,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                specialRequests: formData.specialRequests,
                userId: user.uid,
                totalPrice: selectedCar.pricing.total_price
            });

            if (response.status) {
                showToast({
                    title: 'Success',
                    message: 'Your booking has been confirmed!',
                    type: 'success'
                });

                setIsBookingModalOpen(false);
                setSelectedCar(null);
            } else {
                throw new Error(response.message || 'Failed to complete your booking');
            }
        } catch (error) {
            showToast({
                title: 'Error',
                message: error instanceof Error ? error.message : 'Failed to complete your booking',
                type: 'error'
            });
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50"
        >
            {/* Toast Notifications */}
            <Toast toasts={toasts} />

            {/* Hero Section */}
            <div className="relative bg-primary text-white py-12 mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-serif mb-4"
                        >
                            Find Your Perfect Rental Car
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-white/90 max-w-2xl mx-auto"
                        >
                            Compare prices from top rental companies and find the perfect car for your journey
                        </motion.p>
                    </div>

                    {/* Search Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="max-w-5xl mx-auto"
                    >
                        <CarSearchForm
                            onSubmit={handleSearch}
                            isLoading={isSearching}
                        />
                    </motion.div>
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {searchError ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-50 text-red-500 p-4 rounded-lg text-center mb-8"
                    >
                        {searchError}
                    </motion.div>
                ) : (
                    <CarSearchResults
                        results={searchResults}
                        isLoading={isSearching}
                        onSelect={handleCarSelect}
                    />
                )}
            </div>

            {/* Car Details Modal */}
            {selectedCar && (
                <CarDetailsModal
                    car={selectedCar}
                    isOpen={!!selectedCar}
                    onClose={handleCloseModal}
                    onBook={handleBookCar}
                    searchKey={searchKey}
                />
            )}

            {/* Booking Modal */}
            {selectedCar && (
                <CarBookingModal
                    car={selectedCar}
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    onConfirm={handleBookingConfirm}
                    isLoading={isBooking}
                />
            )}
        </motion.div>
    );
} 