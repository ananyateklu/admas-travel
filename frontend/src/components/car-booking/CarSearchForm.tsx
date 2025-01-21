import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CarSearchInput } from './CarSearchInput';
import { LocationSearchResult } from '../../types/carSearch';
import { DatePicker } from '../common/DatePicker';
import { TimePicker } from '../common/TimePicker';
import { carService } from '../../lib/api/carService';
import { useCarBookingForm } from '../../hooks/useCarBookingForm';

interface CarSearchFormData {
    pickupLocation: LocationSearchResult;
    dropoffLocation: LocationSearchResult;
    pickupDate: Date;
    dropoffDate: Date;
    pickupTime: string;
    dropoffTime: string;
    driverAge: string;
}

interface CarSearchFormProps {
    onSubmit: (data: CarSearchFormData) => Promise<void>;
    isLoading?: boolean;
    initialData?: Partial<CarSearchFormData>;
}

export function CarSearchForm({
    onSubmit,
    isLoading = false,
    initialData
}: CarSearchFormProps) {
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof CarSearchFormData, string>>>({});

    // Use the new hook for form state management
    const { formData, updateFormData } = useCarBookingForm({
        pickupLocation: initialData?.pickupLocation || null,
        dropoffLocation: initialData?.dropoffLocation || null,
        pickupDate: initialData?.pickupDate?.toISOString() ?? (() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toISOString();
        })(),
        dropoffDate: initialData?.dropoffDate?.toISOString() ?? (() => {
            const dayAfterTomorrow = new Date();
            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
            return dayAfterTomorrow.toISOString();
        })(),
        pickupTime: initialData?.pickupTime ?? '10:00',
        dropoffTime: initialData?.dropoffTime ?? '10:00',
        driverAge: initialData?.driverAge ?? '25'
    });

    const getCurrentLocation = useCallback(async () => {
        setIsLocating(true);
        setLocationError(null);

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
            });

            const { latitude, longitude } = position.coords;

            // Get the address from coordinates
            const cityResponse = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const cityData = await cityResponse.json();

            if (cityData.address) {
                // Get the most specific location name
                const locationName = cityData.address.city ||
                    cityData.address.town ||
                    cityData.address.village ||
                    cityData.address.county ||
                    cityData.address.state;

                if (locationName) {
                    // Search for locations using the city/town name
                    const response = await carService.searchDestination(locationName);
                    if (response.status && response.data && response.data.length > 0) {
                        const nearestLocation = response.data[0];
                        updateFormData({ pickupLocation: nearestLocation });
                        setLocationError(null);
                        return;
                    }
                }
            }

            throw new Error('No locations found nearby');
        } catch (error) {
            console.error('Error getting location:', error);
            setLocationError(
                error instanceof GeolocationPositionError
                    ? 'Unable to get your location. Please check your browser permissions.'
                    : 'Unable to find nearby locations. Please enter manually.'
            );
        } finally {
            setIsLocating(false);
        }
    }, [updateFormData]);

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof CarSearchFormData, string>> = {};

        if (!formData.pickupLocation?.name || !formData.pickupLocation.latitude || !formData.pickupLocation.longitude) {
            newErrors.pickupLocation = 'Please select a pickup location';
        }

        if (!formData.dropoffLocation?.name || !formData.dropoffLocation.latitude || !formData.dropoffLocation.longitude) {
            newErrors.dropoffLocation = 'Please select a drop-off location';
        }

        if (!formData.driverAge || parseInt(formData.driverAge) < 18) {
            newErrors.driverAge = 'Driver must be at least 18 years old';
        }

        const pickupDateTime = new Date(`${formData.pickupDate}`);
        const dropoffDateTime = new Date(`${formData.dropoffDate}`);
        const pickupTime = formData.pickupTime.split(':').map(Number);
        const dropoffTime = formData.dropoffTime.split(':').map(Number);

        pickupDateTime.setHours(pickupTime[0], pickupTime[1], 0);
        dropoffDateTime.setHours(dropoffTime[0], dropoffTime[1], 0);

        if (isNaN(pickupDateTime.getTime())) {
            newErrors.pickupDate = 'Please select a valid pickup date';
        }

        if (isNaN(dropoffDateTime.getTime())) {
            newErrors.dropoffDate = 'Please select a valid drop-off date';
        }

        if (pickupDateTime >= dropoffDateTime) {
            newErrors.dropoffTime = 'Drop-off must be after pickup';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted', formData);

        if (!validateForm()) {
            console.log('Form validation failed', errors);
            return;
        }

        if (!formData.pickupLocation || !formData.dropoffLocation) {
            console.log('Missing location data', { pickup: formData.pickupLocation, dropoff: formData.dropoffLocation });
            setErrors(prev => ({
                ...prev,
                pickupLocation: !formData.pickupLocation ? 'Please select a pickup location' : undefined,
                dropoffLocation: !formData.dropoffLocation ? 'Please select a drop-off location' : undefined
            }));
            return;
        }

        try {
            // Convert ISO date strings back to Date objects for the onSubmit handler
            await onSubmit({
                pickupLocation: {
                    ...formData.pickupLocation,
                    dest_id: formData.pickupLocation.dest_id ?? '',
                    type: formData.pickupLocation.type ?? '',
                    city: formData.pickupLocation.city ?? '',
                    country: formData.pickupLocation.country ?? '',
                    address: formData.pickupLocation.address ?? ''
                },
                dropoffLocation: {
                    ...formData.dropoffLocation,
                    dest_id: formData.dropoffLocation.dest_id ?? '',
                    type: formData.dropoffLocation.type ?? '',
                    city: formData.dropoffLocation.city ?? '',
                    country: formData.dropoffLocation.country ?? '',
                    address: formData.dropoffLocation.address ?? ''
                },
                pickupDate: new Date(formData.pickupDate),
                dropoffDate: new Date(formData.dropoffDate),
                pickupTime: formData.pickupTime,
                dropoffTime: formData.dropoffTime,
                driverAge: formData.driverAge
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleSameAsPickup = () => {
        if (formData.pickupLocation) {
            updateFormData({ dropoffLocation: formData.pickupLocation });
            setErrors(prev => ({ ...prev, dropoffLocation: undefined }));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Pickup Location */}
                    <div className="col-span-12 md:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pick-up Location
                        </label>
                        <label className="block text-xs text-gray-400 mb-0.5">City or Airport</label>
                        <div className="space-y-2">
                            <CarSearchInput
                                label=""
                                id="pickup-location"
                                value={formData.pickupLocation?.name ?? ''}
                                onChange={(location) => {
                                    updateFormData({ pickupLocation: location });
                                    setErrors(prev => ({ ...prev, pickupLocation: undefined }));
                                }}
                                type="pickup"
                                required
                            />
                            <motion.button
                                type="button"
                                onClick={getCurrentLocation}
                                disabled={isLocating}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark focus:outline-none"
                            >
                                {isLocating ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <span>Locating your position...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>Use my current location</span>
                                    </>
                                )}
                            </motion.button>
                            {locationError && (
                                <p className="text-xs text-red-500">{locationError}</p>
                            )}
                            {errors.pickupLocation && (
                                <p className="text-xs text-red-500">{errors.pickupLocation}</p>
                            )}
                        </div>
                    </div>

                    {/* Pickup Date & Time */}
                    <div className="col-span-12 md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pick-up Date & Time
                        </label>
                        <label className="block text-xs text-gray-400 mb-0.5">Select date and time</label>
                        <div className="flex items-start gap-2">
                            <div className="flex-1">
                                <DatePicker
                                    label=""
                                    selected={new Date(formData.pickupDate)}
                                    onChange={(date: Date | null) => date && updateFormData({ pickupDate: date.toISOString() })}
                                    minDate={new Date()}
                                    required
                                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg 
                                        focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                />
                            </div>
                            <div className="w-24">
                                <TimePicker
                                    label=""
                                    value={formData.pickupTime}
                                    onChange={(time: string) => {
                                        updateFormData({ pickupTime: time });
                                        setErrors(prev => ({ ...prev, pickupTime: undefined, dropoffTime: undefined }));
                                    }}
                                    required
                                    className={`w-full px-2 py-1.5 text-xs border rounded-lg transition-all duration-200 
                                        ${errors.pickupTime
                                            ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                                            : 'border-gray-300 focus:ring-primary/20 focus:border-primary'}`}
                                />
                                {errors.pickupTime && (
                                    <p className="mt-0.5 text-[10px] text-red-500 whitespace-nowrap absolute">{errors.pickupTime}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dropoff Date & Time */}
                    <div className="col-span-12 md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Drop-off Date & Time
                        </label>
                        <label className="block text-xs text-gray-400 mb-0.5">Select date and time</label>
                        <div className="flex items-start gap-2">
                            <div className="flex-1">
                                <DatePicker
                                    label=""
                                    selected={new Date(formData.dropoffDate)}
                                    onChange={(date: Date | null) => date && updateFormData({ dropoffDate: date.toISOString() })}
                                    minDate={new Date(formData.pickupDate)}
                                    required
                                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg 
                                        focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                />
                            </div>
                            <div className="w-24">
                                <TimePicker
                                    label=""
                                    value={formData.dropoffTime}
                                    onChange={(time: string) => {
                                        updateFormData({ dropoffTime: time });
                                        setErrors(prev => ({ ...prev, pickupTime: undefined, dropoffTime: undefined }));
                                    }}
                                    required
                                    className={`w-full px-2 py-1.5 text-xs border rounded-lg transition-all duration-200 
                                        ${errors.dropoffTime
                                            ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                                            : 'border-gray-300 focus:ring-primary/20 focus:border-primary'}`}
                                />
                                {errors.dropoffTime && (
                                    <p className="mt-0.5 text-[10px] text-red-500 whitespace-nowrap absolute">{errors.dropoffTime}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="col-span-12 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search
                        </label>
                        <label className="block text-xs text-gray-400 mb-0.5">Find your car</label>
                        <div className="flex items-start">
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-1.5 rounded-lg text-white font-medium text-xs
                                    transition-all duration-200 overflow-hidden
                                    ${isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-primary hover:bg-primary-dark'
                                    }`}
                            >
                                <div className="relative flex items-center justify-center gap-1.5">
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            <span>Searching...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <span>Search</span>
                                        </>
                                    )}
                                </div>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Drop-off Location */}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-5">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Drop-off Location
                            </label>
                            <label className="block text-xs text-gray-400 mb-0.5">City or Airport</label>
                            <div className="flex items-end gap-2">
                                <div className="flex-1">
                                    <CarSearchInput
                                        label=""
                                        id="dropoff-location"
                                        value={formData.dropoffLocation?.name ?? ''}
                                        onChange={(location) => {
                                            updateFormData({ dropoffLocation: location });
                                            setErrors(prev => ({ ...prev, dropoffLocation: undefined }));
                                        }}
                                        type="dropoff"
                                        required
                                    />
                                </div>
                                <motion.button
                                    type="button"
                                    onClick={handleSameAsPickup}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="mb-[2px] px-1 py-1.5 text-[10px] text-primary hover:text-primary-dark hover:underline focus:outline-none whitespace-nowrap"
                                >
                                    Same as pickup
                                </motion.button>
                            </div>
                            {errors.dropoffLocation && (
                                <p className="mt-1 text-xs text-red-500">{errors.dropoffLocation}</p>
                            )}
                        </div>
                    </div>

                    {/* Additional Options */}
                    <div className="col-span-12 md:col-span-7">
                        <div className="grid grid-cols-12 gap-4 md:justify-end">
                            <div className="col-span-4 md:col-span-4 space-y-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Driver Age
                                </label>
                                <label className="block text-xs text-gray-400 mb-0.5">Enter age</label>
                                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                    <input
                                        type="number"
                                        value={formData.driverAge}
                                        onChange={(e) => updateFormData({ driverAge: e.target.value })}
                                        min="18"
                                        max="99"
                                        className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg 
                                            focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                        required
                                    />
                                </motion.div>
                                {errors.driverAge && (
                                    <p className="mt-1 text-xs text-red-500">{errors.driverAge}</p>
                                )}
                            </div>

                            <div className="col-span-4 md:col-span-4 space-y-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Car Type
                                </label>
                                <label className="block text-xs text-gray-400 mb-0.5">Select type</label>
                                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                    <select
                                        className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg 
                                            focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="economy">Economy</option>
                                        <option value="compact">Compact</option>
                                        <option value="suv">SUV</option>
                                        <option value="luxury">Luxury</option>
                                    </select>
                                </motion.div>
                            </div>

                            <div className="col-span-4 md:col-span-4 space-y-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Currency
                                </label>
                                <label className="block text-xs text-gray-400 mb-0.5">Select currency</label>
                                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                    <select
                                        className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg 
                                            focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                    >
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                    </select>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Quick Links */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">Quick Links:</span>
                    {[
                        {
                            label: 'Today',
                            onClick: () => {
                                const today = new Date();
                                const tomorrow = new Date();
                                tomorrow.setDate(today.getDate() + 1);
                                updateFormData({
                                    pickupDate: today.toISOString(),
                                    dropoffDate: tomorrow.toISOString()
                                });
                            }
                        },
                        {
                            label: 'Tomorrow',
                            onClick: () => {
                                const tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                const dayAfter = new Date();
                                dayAfter.setDate(tomorrow.getDate() + 1);
                                updateFormData({
                                    pickupDate: tomorrow.toISOString(),
                                    dropoffDate: dayAfter.toISOString()
                                });
                            }
                        },
                        {
                            label: 'Next Week',
                            onClick: () => {
                                const nextWeek = new Date();
                                nextWeek.setDate(nextWeek.getDate() + 7);
                                const dayAfterNextWeek = new Date();
                                dayAfterNextWeek.setDate(nextWeek.getDate() + 1);
                                updateFormData({
                                    pickupDate: nextWeek.toISOString(),
                                    dropoffDate: dayAfterNextWeek.toISOString()
                                });
                            }
                        }
                    ].map((link) => (
                        <motion.button
                            key={link.label}
                            type="button"
                            onClick={link.onClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-primary hover:text-primary-dark text-xs font-medium"
                        >
                            {link.label}
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
} 