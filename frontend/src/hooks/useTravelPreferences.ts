import { useState, useEffect } from 'react';

export interface TravelPreference {
    travelStyle: string;
    destination: string;
    budget: string;
    duration: string;
    interests: string[];
}

const defaultPreferences: TravelPreference = {
    travelStyle: '',
    destination: '',
    budget: '',
    duration: '',
    interests: []
};

export function useTravelPreferences() {
    const [preferences, setPreferences] = useState<TravelPreference>(() => {
        const saved = localStorage.getItem('travelPreferences');
        return saved ? JSON.parse(saved) : defaultPreferences;
    });

    useEffect(() => {
        localStorage.setItem('travelPreferences', JSON.stringify(preferences));
    }, [preferences]);

    const updatePreferences = (newPreferences: Partial<TravelPreference>) => {
        setPreferences(prev => ({
            ...prev,
            ...newPreferences
        }));
    };

    const clearPreferences = () => {
        setPreferences(defaultPreferences);
        localStorage.removeItem('travelPreferences');
    };

    return {
        preferences,
        updatePreferences,
        clearPreferences
    };
} 