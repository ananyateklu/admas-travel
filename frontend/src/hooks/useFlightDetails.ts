import { useState, useCallback } from 'react';
import { Airport } from '../services/flightService';

interface FlightDetailsCache {
    from: Airport | null;
    to: Airport | null;
    departureDate: string;
    departureTime: string;
    returnDate?: string;
    returnTime?: string;
    isRoundTrip: boolean;
}

const CACHE_KEY = 'flight_details_cache';

interface AirportResponse {
    id: string;
    name: string;
    city: string;
    cityName: string;
    code: string;
    airportCode?: string;
    country: string;
    countryName: string;
    countryNameShort: string;
    distanceToCity?: {
        value: number;
        unit: string;
    };
    parent: string;
    photoUri?: string;
    type: string;
}

function reconstructAirport(data: Partial<AirportResponse> | null): Airport | null {
    if (!data) return null;

    // Get the airport code, trying all possible fields
    const airportCode = data.airportCode ?? data.code ?? '';

    return {
        id: data.id ?? '',
        name: data.name ?? '',
        city: data.cityName ?? data.city ?? '',
        country: data.countryName ?? data.country ?? '',
        airportCode: airportCode,
        coordinates: undefined
    };
}

export function useFlightDetails(initialData?: Partial<FlightDetailsCache>) {
    // Initialize state from cache or initial data
    const [flightDetails, setFlightDetails] = useState<FlightDetailsCache>(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                const reconstructed = {
                    from: reconstructAirport(parsed.from),
                    to: reconstructAirport(parsed.to),
                    departureDate: parsed.departureDate || '',
                    departureTime: parsed.departureTime || '',
                    returnDate: parsed.returnDate || '',
                    returnTime: parsed.returnTime || '',
                    isRoundTrip: parsed.isRoundTrip ?? true,
                };
                return reconstructed;
            } catch (e) {
                console.error('Error parsing flight details cache:', e);
                return {
                    from: null,
                    to: null,
                    departureDate: '',
                    departureTime: '',
                    returnDate: '',
                    returnTime: '',
                    isRoundTrip: true,
                    ...initialData
                };
            }
        }
        return {
            from: null,
            to: null,
            departureDate: '',
            departureTime: '',
            returnDate: '',
            returnTime: '',
            isRoundTrip: true,
            ...initialData
        };
    });

    const updateFlightDetails = useCallback((updates: Partial<FlightDetailsCache>) => {
        setFlightDetails(prev => {
            const next = { ...prev, ...updates };

            // Store the raw data with all properties
            const dataToStore = {
                ...next,
                from: next.from ? {
                    id: next.from.id,
                    name: next.from.name,
                    city: next.from.city,
                    country: next.from.country,
                    airportCode: next.from.airportCode,
                    code: next.from.airportCode,
                    cityName: next.from.city,
                    countryName: next.from.country,
                    countryNameShort: next.from.country,
                    type: 'AIRPORT'
                } : null,
                to: next.to ? {
                    id: next.to.id,
                    name: next.to.name,
                    city: next.to.city,
                    country: next.to.country,
                    airportCode: next.to.airportCode,
                    code: next.to.airportCode,
                    cityName: next.to.city,
                    countryName: next.to.country,
                    countryNameShort: next.to.country,
                    type: 'AIRPORT'
                } : null
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(dataToStore));
            return next;
        });
    }, []);

    const clearCache = useCallback(() => {
        localStorage.removeItem(CACHE_KEY);
        setFlightDetails({
            from: null,
            to: null,
            departureDate: '',
            departureTime: '',
            returnDate: '',
            returnTime: '',
            isRoundTrip: true
        });
    }, []);

    return {
        flightDetails,
        updateFlightDetails,
        clearCache
    };
} 