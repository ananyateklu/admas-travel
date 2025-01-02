import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../lib/firebase/useAuth';

interface NotificationToggleProps {
    className?: string;
}

export function NotificationToggle({ className = '' }: NotificationToggleProps) {
    const { user } = useAuth();
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const loadNotificationSettings = async () => {
            if (!user?.uid) return;

            try {
                const settingsDoc = await getDoc(doc(db, `users/${user.uid}/settings/preferences`));
                if (settingsDoc.exists()) {
                    setIsEnabled(settingsDoc.data()?.notifications?.emailNotifications ?? false);
                }
            } catch (error) {
                console.error('Error loading notification settings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadNotificationSettings();
    }, [user?.uid]);

    const handleToggle = async () => {
        if (!user?.uid || isUpdating) return;

        setIsUpdating(true);
        try {
            const newValue = !isEnabled;
            await setDoc(doc(db, `users/${user.uid}/settings/preferences`), {
                notifications: {
                    emailNotifications: newValue,
                    smsAlerts: false,
                    dailySummary: false
                },
                display: {
                    defaultView: 'list',
                    itemsPerPage: 10,
                    theme: 'light'
                },
                api: {
                    flightApiEnabled: true,
                    weatherApiEnabled: true,
                    currencyApiEnabled: true
                }
            }, { merge: true });
            setIsEnabled(newValue);
        } catch (error) {
            console.error('Error updating notification settings:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className={`flex items-center gap-3 ${className}`}>
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
        );
    }

    return (
        <div className={`flex items-center justify-between gap-8 ${className}`}>
            <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="text-sm text-gray-700">Email Notifications</span>
            </div>
            <motion.button
                onClick={handleToggle}
                disabled={isUpdating}
                className="relative"
                whileTap={{ scale: 0.95 }}
            >
                <div
                    className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isEnabled ? 'bg-gold' : 'bg-gray-300'
                        } ${isUpdating ? 'opacity-50' : ''}`}
                >
                    <motion.div
                        className="w-3 h-3 bg-white rounded-full shadow-sm"
                        animate={{
                            x: isEnabled ? 16 : 0
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                </div>
            </motion.button>
        </div>
    );
} 