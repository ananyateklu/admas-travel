import { useState, useCallback } from 'react';
import { LocationSearchResult } from '../types/carSearch';

interface CarBookingFormCache {
    pickupLocation: LocationSearchResult | null;
    dropoffLocation: LocationSearchResult | null;
    pickupDate: string;
    dropoffDate: string;
    pickupTime: string;
    dropoffTime: string;
    driverAge: string;
}

interface LocationData {
    dest_id?: string;
    name?: string;
    type?: string;
    latitude?: string;
    longitude?: string;
    city?: string;
    country?: string;
    address?: string;
}

const CACHE_KEY = 'car_booking_form_cache';

const defaultFormData: CarBookingFormCache = {
    pickupLocation: null,
    dropoffLocation: null,
    pickupDate: '',
    dropoffDate: '',
    pickupTime: '',
    dropoffTime: '',
    driverAge: ''
};

function reconstructLocation(data: LocationData | null): LocationSearchResult | null {
    if (!data) return null;

    return {
        dest_id: data.dest_id ?? '',
        name: data.name ?? '',
        type: data.type ?? '',
        latitude: data.latitude ?? '',
        longitude: data.longitude ?? '',
        city: data.city ?? '',
        country: data.country ?? '',
        address: data.address ?? ''
    };
}

export function useCarBookingForm(initialData?: Partial<CarBookingFormCache>) {
    // Initialize state from cache or initial data
    const [formData, setFormData] = useState<CarBookingFormCache>(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                const reconstructed = {
                    pickupLocation: reconstructLocation(parsed.pickupLocation),
                    dropoffLocation: reconstructLocation(parsed.dropoffLocation),
                    pickupDate: parsed.pickupDate || '',
                    dropoffDate: parsed.dropoffDate || '',
                    pickupTime: parsed.pickupTime || '',
                    dropoffTime: parsed.dropoffTime || '',
                    driverAge: parsed.driverAge || ''
                };
                return reconstructed;
            } catch (e) {
                console.error('Error parsing car booking form cache:', e);
                return {
                    ...defaultFormData,
                    ...initialData
                };
            }
        }
        return {
            ...defaultFormData,
            ...initialData
        };
    });

    const updateFormData = useCallback((updates: Partial<CarBookingFormCache>) => {
        setFormData(prev => {
            const next = { ...prev, ...updates };
            localStorage.setItem(CACHE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const clearCache = useCallback(() => {
        localStorage.removeItem(CACHE_KEY);
        setFormData(defaultFormData);
    }, []);

    return {
        formData,
        updateFormData,
        clearCache
    };
} 