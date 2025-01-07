import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HotelDetails } from '../../types/hotelDetails';
import { GuestInformation } from './HotelBookingGuestInformation';
import { HotelContactInformation } from './HotelBookingContactInformation';
import { HotelBookingReview } from './HotelBookingReview';

interface HotelBookingFormProps {
    hotel: HotelDetails;
    initialData?: HotelBookingFormData;
    onSubmit: (data: HotelBookingFormData) => Promise<void>;
    isSubmitting?: boolean;
    onAutoFillGuest?: () => GuestInfo | null;
    onAutoFillContact?: (field: 'name' | 'email' | 'phone') => string;
    showAutoFill?: boolean;
}

export interface GuestInfo {
    fullName: string;
    dateOfBirth: string;
    nationality: string;
    idNumber: string;
    idExpiry: string;
}

export interface HotelBookingFormData {
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

const steps = [
    { id: 'guest-info', label: 'Guest Information' },
    { id: 'contact', label: 'Contact Details' },
    { id: 'review', label: 'Review & Book' }
];

export function HotelBookingForm({
    hotel,
    initialData,
    onSubmit,
    isSubmitting,
    onAutoFillGuest,
    onAutoFillContact,
    showAutoFill
}: HotelBookingFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<HotelBookingFormData>(initialData || {
        checkInDate: '',
        checkOutDate: '',
        numberOfRooms: 1,
        numberOfGuests: 1,
        numberOfNights: 1,
        roomType: Object.keys(hotel.rooms)[0] || '',
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
        specialRequests: ''
    });

    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep < steps.length - 1) {
            handleNext();
        } else {
            console.log('Submitting form data:', formData); // Debug log
            try {
                await onSubmit(formData);
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
    };

    const updateFormData = (updates: Partial<HotelBookingFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const getButtonText = () => {
        if (isSubmitting) return 'Processing...';
        if (currentStep === steps.length - 1) return 'Confirm Booking';
        return 'Next';
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Progress Steps */}
            <div className="mb-4">
                <div className="flex items-center justify-between relative">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-medium
                                        ${index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}
                                >
                                    {index + 1}
                                </div>
                                <span className="mt-1 text-[10px] text-gray-600">{step.label}</span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-0.5 bg-gray-200">
                                    <div
                                        className="h-full bg-primary transition-all duration-300"
                                        style={{ width: index < currentStep ? '100%' : '0%' }}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="mt-4">
                {currentStep === 0 && (
                    <GuestInformation
                        hotel={hotel}
                        formData={formData}
                        onChange={updateFormData}
                        onAutoFill={onAutoFillGuest}
                        showAutoFill={showAutoFill}
                    />
                )}

                {currentStep === 1 && (
                    <div className="space-y-4">
                        <HotelContactInformation
                            formData={formData}
                            onChange={updateFormData}
                            onAutoFill={onAutoFillContact}
                            showAutoFill={showAutoFill}
                        />
                    </div>
                )}

                {currentStep === 2 && (
                    <HotelBookingReview
                        hotel={hotel}
                        formData={formData}
                    />
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
                {currentStep > 0 && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="px-3 py-1.5 text-[11px] font-medium text-gray-700 hover:text-gray-900"
                    >
                        Back
                    </button>
                )}
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="ml-auto px-3 py-1.5 bg-primary text-white text-[11px] rounded-lg hover:bg-primary-dark disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Processing...</span>
                        </div>
                    ) : (
                        getButtonText()
                    )}
                </motion.button>
            </div>
        </form>
    );
} 