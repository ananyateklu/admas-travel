import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/firebase/useAuth';

interface AdminSettings {
    notifications: {
        emailNotifications: boolean;
        smsAlerts: boolean;
        dailySummary: boolean;
    };
    display: {
        defaultView: 'list' | 'grid';
        itemsPerPage: number;
        theme: 'light' | 'dark';
    };
    api: {
        flightApiEnabled: boolean;
        weatherApiEnabled: boolean;
        currencyApiEnabled: boolean;
    };
}

const defaultSettings: AdminSettings = {
    notifications: {
        emailNotifications: true,
        smsAlerts: false,
        dailySummary: true,
    },
    display: {
        defaultView: 'list',
        itemsPerPage: 10,
        theme: 'light',
    },
    api: {
        flightApiEnabled: true,
        weatherApiEnabled: true,
        currencyApiEnabled: true,
    },
};

export function useAdminSettings() {
    const { user } = useAuth();
    const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSettings = async () => {
            if (!user?.uid) {
                setIsLoading(false);
                return;
            }

            try {
                const settingsDoc = await getDoc(doc(db, `users/${user.uid}/settings/preferences`));
                if (settingsDoc.exists()) {
                    setSettings(settingsDoc.data() as AdminSettings);
                }
            } catch (err) {
                console.error('Error loading admin settings:', err);
                setError('Failed to load settings');
            } finally {
                setIsLoading(false);
            }
        };

        loadSettings();
    }, [user?.uid]);

    return {
        settings,
        isLoading,
        error,
        defaultSettings
    };
} 