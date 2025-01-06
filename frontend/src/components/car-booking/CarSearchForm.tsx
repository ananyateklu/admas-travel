import { useState } from 'react';
import { motion } from 'framer-motion';
import { CarSearchInput } from './CarSearchInput';
import { LocationSearchResult } from '../../types/carSearch';
import { DatePicker } from '../common/DatePicker';
import { TimePicker } from '../common/TimePicker';

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
    const [formData, setFormData] = useState<CarSearchFormData>({
        pickupLocation: initialData?.pickupLocation || {
            dest_id: '',
            name: '',
            type: '',
            latitude: '',
            longitude: '',
            city: '',
            country: '',
            address: ''
        },
        dropoffLocation: initialData?.dropoffLocation || {
            dest_id: '',
            name: '',
            type: '',
            latitude: '',
            longitude: '',
            city: '',
            country: '',
            address: ''
        },
        pickupDate: initialData?.pickupDate || new Date(),
        dropoffDate: initialData?.dropoffDate || new Date(Date.now() + 24 * 60 * 60 * 1000),
        pickupTime: initialData?.pickupTime ?? '10:00',
        dropoffTime: initialData?.dropoffTime ?? '10:00',
        driverAge: initialData?.driverAge ?? '25'
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CarSearchFormData, string>>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof CarSearchFormData, string>> = {};

        if (!formData.pickupLocation.name || !formData.pickupLocation.latitude || !formData.pickupLocation.longitude) {
            newErrors.pickupLocation = 'Please select a pickup location from the suggestions';
        }

        if (!formData.dropoffLocation.name || !formData.dropoffLocation.latitude || !formData.dropoffLocation.longitude) {
            newErrors.dropoffLocation = 'Please select a drop-off location from the suggestions';
        }

        if (!formData.driverAge || parseInt(formData.driverAge) < 18) {
            newErrors.driverAge = 'Driver must be at least 18 years old';
        }

        const pickupDateTime = new Date(
            `${formData.pickupDate.toDateString()} ${formData.pickupTime}`
        );
        const dropoffDateTime = new Date(
            `${formData.dropoffDate.toDateString()} ${formData.dropoffTime}`
        );

        if (dropoffDateTime <= pickupDateTime) {
            newErrors.dropoffDate = 'Drop-off time must be after pickup time';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        await onSubmit(formData);
    };

    const handleSameAsPickup = () => {
        setFormData(prev => ({
            ...prev,
            dropoffLocation: prev.pickupLocation
        }));
    };

    return (
        <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6"
        >
            <div className="space-y-6">
                {/* Locations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <CarSearchInput
                            label="Pickup Location"
                            id="pickup-location"
                            value={formData.pickupLocation.name}
                            onChange={(location) => {
                                setFormData(prev => ({ ...prev, pickupLocation: location }));
                                setErrors(prev => ({ ...prev, pickupLocation: undefined }));
                            }}
                            type="pickup"
                            required
                        />
                        {errors.pickupLocation && (
                            <p className="mt-1 text-xs text-red-500">{errors.pickupLocation}</p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <CarSearchInput
                                    label="Drop-off Location"
                                    id="dropoff-location"
                                    value={formData.dropoffLocation.name}
                                    onChange={(location) => {
                                        setFormData(prev => ({ ...prev, dropoffLocation: location }));
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
                                className="mb-[2px] px-2 py-1.5 text-[10px] text-primary hover:text-primary-dark hover:underline focus:outline-none"
                            >
                                Same as pickup
                            </motion.button>
                        </div>
                        {errors.dropoffLocation && (
                            <p className="mt-1 text-xs text-red-500">{errors.dropoffLocation}</p>
                        )}
                    </div>
                </div>

                {/* Dates and Times */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <DatePicker
                            label="Pickup Date"
                            selected={formData.pickupDate}
                            onChange={(date: Date | null) => date && setFormData(prev => ({ ...prev, pickupDate: date }))}
                            minDate={new Date()}
                            required
                        />
                        <TimePicker
                            label="Pickup Time"
                            value={formData.pickupTime}
                            onChange={(time: string) => setFormData(prev => ({ ...prev, pickupTime: time }))}
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <DatePicker
                            label="Drop-off Date"
                            selected={formData.dropoffDate}
                            onChange={(date: Date | null) => date && setFormData(prev => ({ ...prev, dropoffDate: date }))}
                            minDate={formData.pickupDate}
                            required
                        />
                        <TimePicker
                            label="Drop-off Time"
                            value={formData.dropoffTime}
                            onChange={(time: string) => setFormData(prev => ({ ...prev, dropoffTime: time }))}
                            required
                        />
                        {errors.dropoffDate && (
                            <p className="mt-1 text-xs text-red-500">{errors.dropoffDate}</p>
                        )}
                    </div>
                </div>

                {/* Driver Age */}
                <div className="max-w-[200px]">
                    <label htmlFor="driver-age" className="block text-sm font-medium text-gray-700 mb-1">
                        Driver Age
                    </label>
                    <input
                        type="number"
                        id="driver-age"
                        value={formData.driverAge}
                        onChange={(e) => setFormData(prev => ({ ...prev, driverAge: e.target.value }))}
                        min="18"
                        max="99"
                        className="w-full px-3 py-1.5 text-xs text-gray-900 bg-white border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                    />
                    {errors.driverAge && (
                        <p className="mt-1 text-xs text-red-500">{errors.driverAge}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Searching...</span>
                            </div>
                        ) : (
                            'Search Cars'
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.form>
    );
} 