import React from 'react';
import { motion } from 'framer-motion';
import { TripTypeSelector } from './TripTypeSelector';
import { FlightDetails } from './FlightDetails';
import { PassengerCount } from './PassengerCount';
import { PassengerInformation } from './PassengerInformation';
import { ContactInformation } from './ContactInformation';
import { SpecialRequests } from './SpecialRequests';
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
    returnDate?: string;
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

export function BookingForm({
    initialData,
    onSubmit,
    isSubmitting,
    onAutoFillPassenger,
    onAutoFillContact,
    showAutoFill = false
}: BookingFormProps) {
    const [formData, setFormData] = React.useState<BookingFormData>(initialData);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    const updateFormData = (updates: Partial<BookingFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
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
        if (!onAutoFillPassenger) return;

        const autoFilledData = onAutoFillPassenger(index);
        if (!autoFilledData) return;

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
        updateFormData({ passengers: newPassengers });
    };

    const handleAutoFillContact = (field: 'name' | 'email' | 'phone') => {
        if (!onAutoFillContact) return;

        const value = onAutoFillContact(field);
        if (typeof value !== 'string') return;

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

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
            <TripTypeSelector
                value={formData.tripType}
                onChange={(value) => updateFormData({ tripType: value })}
            />

            <FlightDetails
                from={formData.from}
                to={formData.to}
                departureDate={formData.departureDate}
                returnDate={formData.returnDate}
                isRoundTrip={formData.tripType === 'roundtrip'}
                onFromChange={(airport) => updateFormData({ from: airport })}
                onToChange={(airport) => updateFormData({ to: airport })}
                onDepartureDateChange={(date) => updateFormData({ departureDate: date })}
                onReturnDateChange={(date) => updateFormData({ returnDate: date })}
            />

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

            <PassengerInformation
                passengers={formData.passengers}
                onPassengerChange={handlePassengerChange}
                onAutoFill={handleAutoFillPassenger}
                showAutoFill={showAutoFill}
            />

            <ContactInformation
                contactName={formData.contactName}
                contactEmail={formData.contactEmail}
                contactPhone={formData.contactPhone}
                onContactChange={handleContactChange}
                onAutoFill={handleAutoFillContact}
                showAutoFill={showAutoFill}
            />

            <SpecialRequests
                value={formData.specialRequests ?? ''}
                onChange={(value) => updateFormData({ specialRequests: value })}
            />

            <div className="text-center">
                <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                            <span>Submitting Booking Request...</span>
                        </div>
                    ) : (
                        'Submit Booking Request'
                    )}
                </motion.button>
            </div>
        </form>
    );
} 