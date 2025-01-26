import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HotelDetails } from '../../types/hotelDetails';
import { GuestInformation } from './HotelBookingGuestInformation';
import { HotelContactInformation } from './HotelBookingContactInformation';
import { HotelBookingReview } from './HotelBookingReview';
import { HotelBookingRoomStep } from './HotelBookingRoomStep';

interface HotelBookingFormProps {
    hotel: HotelDetails;
    initialData?: HotelBookingFormData;
    onSubmit: (data: HotelBookingFormData) => Promise<{
        bookingId: string;
        bookingReference: string;
    }>;
    isSubmitting?: boolean;
    onAutoFillGuest?: () => GuestInfo | null;
    onAutoFillContact?: (field: 'name' | 'email' | 'phone') => string;
    showAutoFill?: boolean;
    onClose?: () => void;
    onBookingComplete?: (bookingId: string) => void;
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
    { id: 'room', label: 'Room Selection' },
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
    showAutoFill,
    onClose,
    onBookingComplete
}: HotelBookingFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<{
        hotelName: string;
        reference: string;
        email: string;
        bookingId: string;
    } | null>(null);
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
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const validateStep = (step: number): boolean => {
        const errors: Record<string, string> = {};

        switch (step) {
            case 0: // Room Selection
                if (!formData.roomType) errors.roomType = 'Please select a room type';
                if (!formData.checkInDate) errors.checkInDate = 'Please select check-in date';
                if (!formData.checkOutDate) errors.checkOutDate = 'Please select check-out date';
                if (formData.numberOfRooms < 1) errors.numberOfRooms = 'Please select number of rooms';
                if (formData.numberOfGuests < 1) errors.numberOfGuests = 'Please select number of guests';
                break;

            case 1: // Guest Information
                formData.guests.forEach((guest, index) => {
                    if (!guest.fullName) errors[`guest${index}Name`] = 'Please enter guest name';
                    if (!guest.nationality) errors[`guest${index}Nationality`] = 'Please enter nationality';
                    if (!guest.dateOfBirth) errors[`guest${index}DateOfBirth`] = 'Please enter date of birth';
                });
                break;

            case 2: // Contact Details
                if (!formData.contactName) errors.contactName = 'Please enter contact name';
                if (!formData.contactEmail) errors.contactEmail = 'Please enter contact email';
                if (!formData.contactPhone) errors.contactPhone = 'Please enter contact phone';
                break;

            case 3: // Review
                // Validate all fields before final submission
                if (!formData.roomType) errors.roomType = 'Room type is required';
                if (!formData.checkInDate) errors.checkInDate = 'Check-in date is required';
                if (!formData.checkOutDate) errors.checkOutDate = 'Check-out date is required';
                if (formData.numberOfRooms < 1) errors.numberOfRooms = 'Number of rooms is required';
                if (formData.numberOfGuests < 1) errors.numberOfGuests = 'Number of guests is required';

                formData.guests.forEach((guest, index) => {
                    if (!guest.fullName) errors[`guest${index}Name`] = 'Guest name is required';
                    if (!guest.nationality) errors[`guest${index}Nationality`] = 'Guest nationality is required';
                    if (!guest.dateOfBirth) errors[`guest${index}DateOfBirth`] = 'Guest date of birth is required';
                });

                if (!formData.contactName) errors.contactName = 'Contact name is required';
                if (!formData.contactEmail) errors.contactEmail = 'Contact email is required';
                if (!formData.contactPhone) errors.contactPhone = 'Contact phone is required';
                break;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted, current step:', currentStep); // Debug log

        if (currentStep === steps.length - 1) {
            console.log('Validating final step before submission'); // Debug log
            if (validateStep(currentStep)) {
                console.log('Validation passed, submitting form data:', formData); // Debug log
                try {
                    const result = await onSubmit(formData);
                    console.log('Form submission completed successfully:', result); // Debug log

                    // Show confirmation popup
                    setBookingDetails({
                        hotelName: hotel.property.name,
                        reference: result.bookingReference,
                        email: formData.contactEmail,
                        bookingId: result.bookingId
                    });
                    console.log('Setting confirmation popup with details:', {
                        hotelName: hotel.property.name,
                        reference: result.bookingReference,
                        email: formData.contactEmail,
                        bookingId: result.bookingId
                    });
                    setShowConfirmation(true);
                    console.log('Confirmation popup should now be visible');
                } catch (error) {
                    console.error('Error submitting form:', error);
                    setValidationErrors({
                        submit: 'Failed to submit booking. Please try again.'
                    });
                }
            } else {
                console.log('Final validation failed, errors:', validationErrors); // Debug log
            }
        } else {
            console.log('Moving to next step'); // Debug log
            handleNext();
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            console.log(`Step ${currentStep + 1} validation passed, moving to next step`);
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        } else {
            console.log(`Step ${currentStep + 1} validation failed:`, validationErrors);
        }
    };

    const handleBack = () => {
        console.log(`Moving back to step ${currentStep}`);
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const updateFormData = (updates: Partial<HotelBookingFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
        // Clear validation errors for updated fields
        const updatedFields = Object.keys(updates);
        if (updatedFields.length > 0) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                updatedFields.forEach(field => {
                    delete newErrors[field];
                });
                return newErrors;
            });
        }
    };

    const getButtonText = () => {
        if (isSubmitting) return 'Processing...';
        if (currentStep === steps.length - 1) return 'Confirm Booking';
        return 'Next';
    };

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
        if (bookingDetails?.bookingId) {
            // Call onBookingComplete and onClose
            onBookingComplete?.(bookingDetails.bookingId);
            onClose?.();
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Progress Steps */}
                <div className="mb-4">
                    <div className="flex items-center justify-between relative">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-medium
                                            ${index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}
                                    >
                                        {index + 1}
                                    </div>
                                    <span className="mt-1 text-[9px] sm:text-[10px] text-gray-600 text-center max-w-[60px] sm:max-w-none">{step.label}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="flex-1 mx-2 sm:mx-4 h-0.5 bg-gray-200">
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

                {/* Validation Errors */}
                {Object.keys(validationErrors).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 text-red-500 p-3 rounded-lg mb-4"
                    >
                        <h4 className="font-medium mb-2">Please fix the following errors:</h4>
                        <ul className="list-disc list-inside text-sm">
                            {Object.values(validationErrors).map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {/* Step Content */}
                <div className="mt-4">
                    {currentStep === 0 && (
                        <HotelBookingRoomStep
                            hotel={hotel}
                            formData={formData}
                            onChange={updateFormData}
                            errors={validationErrors}
                        />
                    )}

                    {currentStep === 1 && (
                        <GuestInformation
                            hotel={hotel}
                            formData={formData}
                            onChange={updateFormData}
                            onAutoFill={onAutoFillGuest}
                            showAutoFill={showAutoFill}
                            errors={validationErrors}
                        />
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-3">
                            <HotelContactInformation
                                formData={formData}
                                onChange={updateFormData}
                                onAutoFill={onAutoFillContact}
                                showAutoFill={showAutoFill}
                                errors={validationErrors}
                            />
                        </div>
                    )}

                    {currentStep === 3 && (
                        <HotelBookingReview
                            hotel={hotel}
                            formData={formData}
                            errors={validationErrors}
                        />
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-gray-200">
                    {currentStep > 0 && (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-3 py-1.5 text-[11px] sm:text-xs font-medium text-gray-700 hover:text-gray-900"
                        >
                            Back
                        </button>
                    )}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="ml-auto px-4 py-2 bg-primary text-white text-[11px] sm:text-xs rounded-lg hover:bg-primary-dark disabled:opacity-50"
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

            {/* Confirmation Popup */}
            {showConfirmation && bookingDetails && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            handleConfirmationClose();
                        }
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Success Banner */}
                        <div className="bg-forest-400/10 rounded-t-lg p-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-[13px] font-medium text-gray-900">Booking Confirmed</h2>
                                    <p className="text-[11px] text-gray-500">Your hotel stay has been successfully booked</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Booking Details */}
                            <div className="space-y-3">
                                {/* Hotel Details */}
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-forest-400/10 flex items-center justify-center">
                                        <svg className="w-2.5 h-2.5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[11px] text-gray-500">Hotel</div>
                                        <div className="text-[12px] font-medium text-gray-900">{hotel.property.name}</div>
                                        <div className="text-[11px] text-gray-500">{hotel.property.location?.city}, {hotel.property.location?.country}</div>
                                    </div>
                                </div>

                                {/* Room Details */}
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-forest-400/10 flex items-center justify-center">
                                        <svg className="w-2.5 h-2.5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[11px] text-gray-500">Room Type</div>
                                        <div className="text-[12px] font-medium text-gray-900">
                                            {hotel.rooms[formData.roomType ?? '']?.room_name || 'Standard Room'}
                                            <span className="text-[11px] text-gray-500 ml-1">({formData.numberOfRooms} room{formData.numberOfRooms > 1 ? 's' : ''})</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-forest-400/10 flex items-center justify-center">
                                        <svg className="w-2.5 h-2.5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[11px] text-gray-500">Stay Dates</div>
                                        <div className="text-[12px] font-medium text-gray-900 flex items-center gap-1.5">
                                            <span>{new Date(formData.checkInDate).toLocaleDateString()}</span>
                                            <svg className="w-3 h-3 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                            <span>{new Date(formData.checkOutDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Reference */}
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-forest-400/10 flex items-center justify-center">
                                        <svg className="w-2.5 h-2.5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[11px] text-gray-500">Booking Reference</div>
                                        <div className="text-[12px] font-medium text-gray-900">{bookingDetails.reference}</div>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-forest-400/10 flex items-center justify-center">
                                        <svg className="w-2.5 h-2.5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[11px] text-gray-500">Contact Details</div>
                                        <div className="text-[12px] font-medium text-gray-900">{formData.contactEmail}</div>
                                        <div className="text-[11px] text-gray-500">{formData.contactPhone}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Next Steps Card */}
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-4 h-4 rounded-full bg-forest-400/10 flex items-center justify-center">
                                        <svg className="w-2.5 h-2.5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-[11px] font-medium text-gray-900">Next Steps</h3>
                                        <p className="text-[10px] text-gray-500">What happens next</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-forest-400/60"></div>
                                        <p className="text-[11px] text-gray-600">Confirmation email will be sent to your inbox</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-forest-400/60"></div>
                                        <p className="text-[11px] text-gray-600">Our team will review and process your booking</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-forest-400/60"></div>
                                        <p className="text-[11px] text-gray-600">You'll receive final confirmation within 24 hours</p>
                                    </div>
                                </div>
                            </div>

                            {/* Close Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleConfirmationClose}
                                className="w-full px-4 py-2 bg-forest-400 text-white rounded-lg hover:bg-forest-400/90 transition-colors text-[11px] font-medium"
                            >
                                Close
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
} 