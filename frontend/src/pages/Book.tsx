import { useState, useEffect, useRef } from 'react';
import airplaineWindow from '../assets/airplaine-window.jpg';

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
    from: string;
    to: string;
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

export default function Book() {
    const [formData, setFormData] = useState<BookingFormData>({
        tripType: 'roundtrip',
        from: '',
        to: '',
        departureDate: '',
        returnDate: '',
        adults: 1,
        children: 0,
        class: 'economy',
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
        specialRequests: ''
    });

    const passengersRef = useRef(formData.passengers);
    passengersRef.current = formData.passengers;

    useEffect(() => {
        // Create new array of passengers
        const newPassengers: PassengerInfo[] = [];

        // Add adult passengers first
        for (let i = 0; i < formData.adults; i++) {
            newPassengers.push({
                type: 'adult',
                fullName: passengersRef.current[i]?.fullName || '',
                dateOfBirth: passengersRef.current[i]?.dateOfBirth || '',
                passportNumber: passengersRef.current[i]?.passportNumber || '',
                passportExpiry: passengersRef.current[i]?.passportExpiry || '',
                nationality: passengersRef.current[i]?.nationality || ''
            });
        }

        // Then add child passengers
        for (let i = 0; i < formData.children; i++) {
            newPassengers.push({
                type: 'child',
                fullName: passengersRef.current[i + formData.adults]?.fullName || '',
                dateOfBirth: passengersRef.current[i + formData.adults]?.dateOfBirth || '',
                passportNumber: passengersRef.current[i + formData.adults]?.passportNumber || '',
                passportExpiry: passengersRef.current[i + formData.adults]?.passportExpiry || '',
                nationality: passengersRef.current[i + formData.adults]?.nationality || ''
            });
        }

        setFormData(prev => ({ ...prev, passengers: newPassengers }));
    }, [formData.adults, formData.children]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePassengerChange = (index: number, field: keyof PassengerInfo, value: string) => {
        setFormData(prev => {
            const newPassengers = [...prev.passengers];
            newPassengers[index] = {
                ...newPassengers[index],
                [field]: value
            };
            return {
                ...prev,
                passengers: newPassengers
            };
        });
    };

    // Add useEffect to attach wheel event listeners
    useEffect(() => {
        const adultInput = document.querySelector('input[name="adults"]') as HTMLInputElement;
        const childrenInput = document.querySelector('input[name="children"]') as HTMLInputElement;

        const handleWheel = (e: Event) => {
            if (e instanceof WheelEvent) {
                e.preventDefault();
                (e.target as HTMLElement).blur();
            }
        };

        if (adultInput) {
            adultInput.addEventListener('wheel', handleWheel, { passive: false });
        }
        if (childrenInput) {
            childrenInput.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (adultInput) {
                adultInput.removeEventListener('wheel', handleWheel);
            }
            if (childrenInput) {
                childrenInput.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[70vh] bg-gray-900">
                <div className="absolute inset-0">
                    <img
                        src={airplaineWindow}
                        alt="View from Airplane Window"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="relative h-full flex items-center justify-center text-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Book Your Journey</h1>
                        <p className="text-xl text-white/90">Let us help you plan your perfect trip</p>
                    </div>
                </div>
            </div>

            {/* Booking Form Section */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
                        {/* Trip Type */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">Trip Type</h3>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="tripType"
                                        value="roundtrip"
                                        checked={formData.tripType === 'roundtrip'}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    <span className="ml-2">Round Trip</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="tripType"
                                        value="oneway"
                                        checked={formData.tripType === 'oneway'}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    <span className="ml-2">One Way</span>
                                </label>
                            </div>
                        </div>

                        {/* Flight Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                                <input
                                    type="text"
                                    name="from"
                                    value={formData.from}
                                    onChange={handleInputChange}
                                    placeholder="City or Airport"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                                <input
                                    type="text"
                                    name="to"
                                    value={formData.to}
                                    onChange={handleInputChange}
                                    placeholder="City or Airport"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                                <input
                                    type="date"
                                    name="departureDate"
                                    value={formData.departureDate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                    required
                                />
                            </div>
                            {formData.tripType === 'roundtrip' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
                                    <input
                                        type="date"
                                        name="returnDate"
                                        value={formData.returnDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        {/* Passengers and Class */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Adults</label>
                                <input
                                    type="number"
                                    name="adults"
                                    value={formData.adults}
                                    onChange={handleInputChange}
                                    min="1"
                                    max="9"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                                <input
                                    type="number"
                                    name="children"
                                    value={formData.children}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="9"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                                <select
                                    name="class"
                                    value={formData.class}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                    required
                                >
                                    <option value="economy">Economy</option>
                                    <option value="business">Business</option>
                                    <option value="first">First Class</option>
                                </select>
                            </div>
                        </div>

                        {/* Passenger Information */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">Passenger Information</h3>
                            {formData.passengers.map((passenger, index) => (
                                <div key={`${passenger.type}-${index}`} className="mb-8 p-6 bg-gray-50 rounded-lg">
                                    <h4 className="text-md font-medium mb-4">
                                        {passenger.type === 'adult' ? 'Adult' : 'Child'} Passenger {index + 1}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name (as in passport)</label>
                                            <input
                                                type="text"
                                                value={passenger.fullName}
                                                onChange={(e) => handlePassengerChange(index, 'fullName', e.target.value)}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                            <input
                                                type="date"
                                                value={passenger.dateOfBirth}
                                                onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                                            <input
                                                type="text"
                                                value={passenger.passportNumber}
                                                onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Passport Expiry Date</label>
                                            <input
                                                type="date"
                                                value={passenger.passportExpiry}
                                                onChange={(e) => handlePassengerChange(index, 'passportExpiry', e.target.value)}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                                            <input
                                                type="text"
                                                value={passenger.nationality}
                                                onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Contact Information */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="contactName"
                                        value={formData.contactName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        value={formData.contactEmail}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        name="contactPhone"
                                        value={formData.contactPhone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                                    <textarea
                                        name="specialRequests"
                                        value={formData.specialRequests}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="text-center">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors"
                            >
                                Submit Booking Request
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Additional Information */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-gold/10 rounded-full">
                                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                            <p className="text-gray-600">support@admastravel.com</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-gold/10 rounded-full">
                                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
                            <p className="text-gray-600">+1 (612) 743-7243</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-gold/10 rounded-full">
                                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
                            <p className="text-gray-600">Mon-Fri: 9AM-6PM CST</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 