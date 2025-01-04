import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TripTypeSelector } from './TripTypeSelector';
import { FlightDetails } from './FlightDetails';
import { PassengerCount } from './PassengerCount';
import { PassengerInformation } from './PassengerInformation';
import { ContactInformation } from './ContactInformation';
import { SpecialRequests } from './SpecialRequests';
import { BookingReview } from './BookingReview';
import { Airport } from '../../services/flightService';

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

interface BookingFormProps {
    initialData: BookingFormData;
    onSubmit: (data: BookingFormData) => Promise<void>;
    isSubmitting: boolean;
    onAutoFillPassenger?: (index: number) => PassengerInfo | null;
    onAutoFillContact?: (field: 'name' | 'email' | 'phone') => string;
    showAutoFill?: boolean;
}

const FORM_STEPS = [
    { id: 'trip', title: 'Flight Details', description: 'Select your journey details' },
    { id: 'passengers', title: 'Passengers', description: 'Add passenger information' },
    { id: 'contact', title: 'Contact', description: 'Your contact details' },
    { id: 'review', title: 'Review', description: 'Review your booking' }
] as const;

type FormStep = typeof FORM_STEPS[number]['id'];

export function BookingForm({
    initialData,
    onSubmit,
    isSubmitting,
    onAutoFillPassenger,
    onAutoFillContact,
    showAutoFill = false
}: BookingFormProps) {
    const [currentStep, setCurrentStep] = useState<FormStep>('trip');
    const [formData, setFormData] = useState<BookingFormData>({
        ...initialData,
        departureTime: initialData.departureTime ?? '09:00', // Default to 9 AM
        returnTime: initialData.returnTime ?? '09:00' // Default to 9 AM
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Auto-populate data when form loads
    useEffect(() => {
        if (showAutoFill) {
            // Auto-fill contact information
            if (onAutoFillContact) {
                const name = onAutoFillContact('name');
                const email = onAutoFillContact('email');
                const phone = onAutoFillContact('phone');

                updateFormData({
                    contactName: name || formData.contactName,
                    contactEmail: email || formData.contactEmail,
                    contactPhone: phone || formData.contactPhone
                });
            }

            // Auto-fill first passenger information (assuming it's the user)
            if (onAutoFillPassenger && formData.passengers.length > 0) {
                const passengerData = onAutoFillPassenger(0);
                if (passengerData) {
                    const newPassengers = [...formData.passengers];
                    newPassengers[0] = {
                        ...newPassengers[0],
                        fullName: passengerData.fullName,
                        dateOfBirth: passengerData.dateOfBirth,
                        passportNumber: passengerData.passportNumber,
                        passportExpiry: passengerData.passportExpiry,
                        nationality: passengerData.nationality,
                        type: newPassengers[0].type
                    };
                    updateFormData({ passengers: newPassengers });
                }
            }
        }
    }, [showAutoFill, onAutoFillPassenger, onAutoFillContact]);

    const updateFormData = (updates: Partial<BookingFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
        // Clear validation errors for updated fields
        const updatedFields = Object.keys(updates);
        if (updatedFields.length > 0) {
            setValidationErrors(prev => {
                const next = { ...prev };
                updatedFields.forEach(field => delete next[field]);
                return next;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    };

    const handleConfirmBooking = async () => {
        if (currentStep === 'review' && validateStep(currentStep)) {
            await onSubmit(formData);
        }
    };

    const handlePassengerChange = (index: number, field: keyof PassengerInfo, value: string) => {
        const newPassengers = [...formData.passengers];
        newPassengers[index] = {
            ...newPassengers[index],
            [field]: value
        };
        updateFormData({ passengers: newPassengers });
    };

    const handleAutoFillPassenger = (index: number) => {
        if (!onAutoFillPassenger) {
            console.log('onAutoFillPassenger is not provided');
            return;
        }

        const autoFilledData = onAutoFillPassenger(index);
        console.log('Auto-filled passenger data:', autoFilledData);
        if (!autoFilledData) {
            console.log('No auto-fill data returned');
            return;
        }

        const newPassengers = [...formData.passengers];
        newPassengers[index] = {
            ...newPassengers[index],
            fullName: autoFilledData.fullName,
            dateOfBirth: autoFilledData.dateOfBirth,
            passportNumber: autoFilledData.passportNumber,
            passportExpiry: autoFilledData.passportExpiry,
            nationality: autoFilledData.nationality,
            type: newPassengers[index].type // Preserve the original passenger type
        };
        console.log('Updating passengers with:', newPassengers);
        updateFormData({ passengers: newPassengers });
    };

    const handleAutoFillContact = (field: 'name' | 'email' | 'phone') => {
        if (!onAutoFillContact) {
            console.log('onAutoFillContact is not provided');
            return;
        }

        const value = onAutoFillContact(field);
        console.log('Auto-filled contact value:', { field, value });
        if (typeof value !== 'string') {
            console.log('Invalid auto-fill value returned');
            return;
        }

        switch (field) {
            case 'name':
                updateFormData({ contactName: value });
                break;
            case 'email':
                updateFormData({ contactEmail: value });
                break;
            case 'phone':
                updateFormData({ contactPhone: value });
                break;
        }
    };

    const handleContactChange = (field: 'contactName' | 'contactEmail' | 'contactPhone', value: string) => {
        updateFormData({ [field]: value });
    };

    const validateStep = (step: FormStep): boolean => {
        const errors = getStepValidationErrors(step, formData);
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    function getStepValidationErrors(step: FormStep, data: BookingFormData): Record<string, string> {
        switch (step) {
            case 'trip':
                return validateTripStep(data);
            case 'passengers':
                return validatePassengersStep(data);
            case 'contact':
                return validateContactStep(data);
            case 'review':
                return validateReviewStep();
            default:
                return {};
        }
    }

    function validateTripStep(data: BookingFormData): Record<string, string> {
        const errors: Record<string, string> = {};
        if (!data.tripType) errors.tripType = 'Trip type is required';
        if (!data.from) errors.from = 'Departure airport is required';
        if (!data.to) errors.to = 'Arrival airport is required';
        if (!data.departureDate) errors.departureDate = 'Departure date is required';
        if (data.tripType === 'roundtrip' && !data.returnDate) {
            errors.returnDate = 'Return date is required';
        }
        return errors;
    }

    function validatePassengersStep(data: BookingFormData): Record<string, string> {
        const errors: Record<string, string> = {};
        data.passengers.forEach((passenger, index) => {
            if (!passenger.fullName) errors[`passenger${index}Name`] = 'Name is required';
            if (!passenger.dateOfBirth) errors[`passenger${index}Birth`] = 'Date of birth is required';
            if (!passenger.nationality) errors[`passenger${index}Nationality`] = 'Nationality is required';
            if (!passenger.passportNumber) errors[`passenger${index}Passport`] = 'Passport number is required';
            if (!passenger.passportExpiry) errors[`passenger${index}Expiry`] = 'Passport expiry is required';
        });
        return errors;
    }

    function validateContactStep(data: BookingFormData): Record<string, string> {
        const errors: Record<string, string> = {};
        if (!data.contactName) errors.contactName = 'Name is required';
        if (!data.contactEmail) errors.contactEmail = 'Email is required';
        if (!data.contactPhone) errors.contactPhone = 'Phone number is required';
        return errors;
    }

    function validateReviewStep(): Record<string, string> {
        return {};
    }

    const handleNext = () => {
        const currentIndex = FORM_STEPS.findIndex(step => step.id === currentStep);
        if (currentIndex < FORM_STEPS.length - 1 && validateStep(currentStep)) {
            setCurrentStep(FORM_STEPS[currentIndex + 1].id);
        }
    };

    const handleBack = () => {
        const currentIndex = FORM_STEPS.findIndex(step => step.id === currentStep);
        if (currentIndex > 0) {
            setCurrentStep(FORM_STEPS[currentIndex - 1].id);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm">
            {/* Progress Bar */}
            <div className="border-b border-gray-200">
                <div className="px-4 py-2">
                    <div className="flex items-center justify-between relative">
                        {FORM_STEPS.map((step, index) => {
                            const stepIndex = FORM_STEPS.findIndex(s => s.id === currentStep);
                            const isActive = step.id === currentStep;
                            const isCompleted = index < stepIndex;

                            return (
                                <React.Fragment key={step.id}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${getStepClassName(isActive, isCompleted)}`}>
                                            {isCompleted ? (
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <span className="text-xs font-medium">{index + 1}</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className={`text-xs font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                                                {step.title}
                                            </div>
                                            <div className="text-[10px] text-gray-400 hidden md:block">
                                                {step.description}
                                            </div>
                                        </div>
                                    </div>
                                    {index < FORM_STEPS.length - 1 && (
                                        <div className="flex-1 h-0.5 bg-gray-200 relative mx-3">
                                            <div
                                                className="absolute inset-0 bg-gold transition-all duration-300"
                                                style={{
                                                    transform: `scaleX(${isCompleted ? 1 : 0})`,
                                                    transformOrigin: 'left'
                                                }}
                                            />
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="p-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                    >
                        {currentStep === 'trip' && (
                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-12 lg:col-span-3">
                                    <TripTypeSelector
                                        value={formData.tripType}
                                        onChange={(value) => updateFormData({ tripType: value })}
                                    />
                                </div>
                                <div className="col-span-12 lg:col-span-9">
                                    <FlightDetails
                                        from={formData.from}
                                        to={formData.to}
                                        departureDate={formData.departureDate}
                                        departureTime={formData.departureTime}
                                        returnDate={formData.returnDate}
                                        returnTime={formData.returnTime}
                                        isRoundTrip={formData.tripType === 'roundtrip'}
                                        onFromChange={(airport) => updateFormData({ from: airport })}
                                        onToChange={(airport) => updateFormData({ to: airport })}
                                        onDepartureDateChange={(date) => updateFormData({ departureDate: date })}
                                        onDepartureTimeChange={(time) => updateFormData({ departureTime: time })}
                                        onReturnDateChange={(date) => updateFormData({ returnDate: date })}
                                        onReturnTimeChange={(time) => updateFormData({ returnTime: time })}
                                        errors={validationErrors}
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 'passengers' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12 lg:col-span-4">
                                        <PassengerCount
                                            adults={formData.adults}
                                            childCount={formData.children}
                                            onAdultsChange={(count) => {
                                                const newPassengers: PassengerInfo[] = Array(count).fill(null).map((_, i) => ({
                                                    type: 'adult',
                                                    fullName: formData.passengers[i]?.fullName || '',
                                                    dateOfBirth: formData.passengers[i]?.dateOfBirth || '',
                                                    passportNumber: formData.passengers[i]?.passportNumber || '',
                                                    passportExpiry: formData.passengers[i]?.passportExpiry || '',
                                                    nationality: formData.passengers[i]?.nationality || ''
                                                }));
                                                updateFormData({ adults: count, passengers: [...newPassengers, ...formData.passengers.slice(count).filter(p => p.type === 'child')] });
                                            }}
                                            onChildrenChange={(count) => {
                                                const adultPassengers = formData.passengers.filter(p => p.type === 'adult');
                                                const newChildPassengers: PassengerInfo[] = Array(count).fill(null).map((_, i) => ({
                                                    type: 'child',
                                                    fullName: formData.passengers[i + adultPassengers.length]?.fullName || '',
                                                    dateOfBirth: formData.passengers[i + adultPassengers.length]?.dateOfBirth || '',
                                                    passportNumber: formData.passengers[i + adultPassengers.length]?.passportNumber || '',
                                                    passportExpiry: formData.passengers[i + adultPassengers.length]?.passportExpiry || '',
                                                    nationality: formData.passengers[i + adultPassengers.length]?.nationality || ''
                                                }));
                                                updateFormData({ children: count, passengers: [...adultPassengers, ...newChildPassengers] });
                                            }}
                                            cabinClass={formData.class}
                                            onCabinClassChange={(value) => updateFormData({ class: value })}
                                        />
                                    </div>
                                    <div className="col-span-12 lg:col-span-8">
                                        <PassengerInformation
                                            passengers={formData.passengers}
                                            onPassengerChange={handlePassengerChange}
                                            onAutoFill={handleAutoFillPassenger}
                                            showAutoFill={showAutoFill}
                                            errors={validationErrors}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 'contact' && (
                            <div className="space-y-4">
                                <ContactInformation
                                    contactName={formData.contactName}
                                    contactEmail={formData.contactEmail}
                                    contactPhone={formData.contactPhone}
                                    onContactChange={handleContactChange}
                                    onAutoFill={handleAutoFillContact}
                                    showAutoFill={showAutoFill}
                                    errors={validationErrors}
                                />
                                <SpecialRequests
                                    value={formData.specialRequests ?? ''}
                                    onChange={(value) => updateFormData({ specialRequests: value })}
                                />
                            </div>
                        )}

                        {currentStep === 'review' && (
                            <div className="space-y-6">
                                <BookingReview formData={formData} />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="px-4 py-2 border-t border-gray-200 flex justify-between items-center">
                <motion.button
                    type="button"
                    onClick={handleBack}
                    className={`px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1.5
                        ${currentStep === 'trip' ? 'invisible' : ''}`}
                    whileHover={{ x: -4 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </motion.button>

                <motion.button
                    type="button"
                    onClick={currentStep === 'review' ? handleConfirmBooking : handleNext}
                    disabled={isSubmitting}
                    className="px-4 py-1.5 bg-gold text-white text-sm rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                    whileHover={{ x: currentStep === 'review' ? 0 : 4 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isSubmitting ? (
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
                            <span>Processing...</span>
                        </>
                    ) : getButtonContent(currentStep)}
                </motion.button>
            </div>
        </form>
    );
}

function getButtonContent(step: FormStep) {
    if (step === 'review') {
        return (
            <>
                <span>Confirm Booking</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </>
        );
    }
    return (
        <>
            <span>Continue</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </>
    );
}

function getStepClassName(isActive: boolean, isCompleted: boolean): string {
    if (isActive) return 'border-gold bg-gold text-white';
    if (isCompleted) return 'border-gold bg-gold/10 text-gold';
    return 'border-gray-300 text-gray-500';
} 