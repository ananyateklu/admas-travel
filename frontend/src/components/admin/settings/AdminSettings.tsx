import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../lib/firebase/useAuth';
import { AdminManagement } from './AdminManagement';

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

interface AdminSettingsProps {
    isEditable?: boolean;
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

export function AdminSettings({ isEditable = false }: AdminSettingsProps) {
    const { user } = useAuth();
    const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isNotifying, setIsNotifying] = useState(false);
    const [notifyStatus, setNotifyStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Load settings from Firestore
    useEffect(() => {
        const loadSettings = async () => {
            console.log('Loading settings with user:', { uid: user?.uid, email: user?.email });
            if (!user?.uid) return;

            try {
                // First ensure the user document exists
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    console.log('Creating new user document');
                    // Create the user document first
                    await setDoc(userDocRef, {
                        email: user.email,
                        createdAt: new Date(),
                    });
                }

                // Then try to get settings
                const settingsDocRef = doc(db, `users/${user.uid}/settings/preferences`);
                const settingsDoc = await getDoc(settingsDocRef);

                if (settingsDoc.exists()) {
                    console.log('Settings found:', settingsDoc.data());
                    setSettings(settingsDoc.data() as AdminSettings);
                } else {
                    console.log('Initializing default settings');
                    try {
                        // Initialize with default settings if none exist
                        await setDoc(settingsDocRef, defaultSettings);
                        setSettings(defaultSettings);
                    } catch (initError) {
                        console.error('Error initializing settings:', initError);
                    }
                }
            } catch (error) {
                console.error('Error loading admin settings:', error);
            }
        };

        loadSettings();
    }, [user?.uid, user?.email]);

    const handleSettingChange = (category: keyof AdminSettings, setting: string, value: boolean | string | number) => {
        if (!isEditable) return;

        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [setting]: value
            }
        }));
    };

    const handleSave = async () => {
        if (!user?.uid || !isEditable) return;

        setIsSaving(true);
        setSaveStatus('idle');

        try {
            await setDoc(doc(db, `users/${user.uid}/settings/preferences`), settings);
            setSaveStatus('success');

            // Reset success status after 3 seconds
            setTimeout(() => {
                setSaveStatus('idle');
            }, 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleNotifyBooking = async () => {
        if (!user?.uid) return;
        setIsNotifying(true);
        setNotifyStatus('idle');

        try {
            // Update the emailNotifications setting
            const newSettings = {
                ...settings,
                notifications: {
                    ...settings.notifications,
                    emailNotifications: !settings.notifications.emailNotifications
                }
            };

            // Save to Firestore
            await setDoc(doc(db, `users/${user.uid}/settings/preferences`), newSettings);
            setSettings(newSettings);
            setNotifyStatus('success');
            setTimeout(() => setNotifyStatus('idle'), 3000);
        } catch (error) {
            console.error('Failed to update notification settings:', error);
            setNotifyStatus('error');
        } finally {
            setIsNotifying(false);
        }
    };

    const renderToggle = (category: keyof AdminSettings, setting: string, value: boolean, label: string, description: string) => {
        if (!isEditable) {
            return (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0 mr-4">
                        <span className="text-sm font-medium text-gray-900 block truncate">{label}</span>
                        <p className="text-xs text-gray-500 truncate">{description}</p>
                    </div>
                    <div className="flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {value ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                </div>
            );
        }

        return (
            <label className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1 min-w-0 mr-4">
                    <span className="text-sm font-medium text-gray-900 block truncate">{label}</span>
                    <p className="text-xs text-gray-500 truncate">{description}</p>
                </div>
                <div className="flex-shrink-0">
                    <motion.div
                        className="relative"
                        whileTap={{ scale: 0.95 }}
                    >
                        <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleSettingChange(category, setting, e.target.checked)}
                            className="sr-only"
                        />
                        <div
                            className={`w-8 h-4 rounded-full p-0.5 transition-colors ${value ? 'bg-gold' : 'bg-gray-300'}`}
                        >
                            <motion.div
                                className="w-3 h-3 bg-white rounded-full shadow-sm"
                                animate={{
                                    x: value ? 16 : 0
                                }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </div>
                    </motion.div>
                </div>
            </label>
        );
    };

    const renderSelect = (category: keyof AdminSettings, setting: string, value: string | number, options: Array<{ value: string | number, label: string }>, label: string, description: string) => {
        if (!isEditable) {
            return (
                <div className="p-2 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900 block truncate">{label}</span>
                        <p className="text-xs text-gray-500 truncate">{description}</p>
                        <div className="text-sm text-gray-900 mt-1">
                            {options.find(opt => opt.value === value)?.label ?? value}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="p-2 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900 block truncate">{label}</span>
                    <p className="text-xs text-gray-500 truncate">{description}</p>
                </div>
                <select
                    value={value}
                    onChange={(e) => handleSettingChange(category, setting, e.target.value)}
                    className="mt-1 w-full px-2 py-1 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    const getNotificationButtonClass = () => {
        if (isNotifying) return 'bg-gray-400';
        return settings.notifications.emailNotifications ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700';
    };

    const getNotificationButtonContent = () => {
        if (isNotifying) {
            return (
                <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating...
                </div>
            );
        }
        if (settings.notifications.emailNotifications) {
            return (
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Notifications On
                </div>
            );
        }
        return 'Turn On Notifications';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Notification Setup Section */}
            <section className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Booking Notifications</h3>
                        <p className="text-sm text-gray-500">Enable email notifications for new bookings</p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        When enabled, notifications will be sent to: <span className="font-medium">{user?.email}</span>
                    </p>
                    <motion.button
                        onClick={handleNotifyBooking}
                        disabled={isNotifying}
                        className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${getNotificationButtonClass()}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {getNotificationButtonContent()}
                    </motion.button>
                </div>

                {notifyStatus === 'error' && (
                    <p className="mt-2 text-sm text-red-600">Failed to update notification settings. Please try again.</p>
                )}
            </section>

            {/* Google Settings Section */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-gray-100 rounded-lg">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">Google Account Settings</h3>
                        <p className="text-xs text-gray-500">Manage your Google account preferences</p>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-2 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        These settings are synced with your Google account
                    </div>
                </div>

                {/* Existing settings sections wrapped in a div */}
                <div className="space-y-4">
                    {/* Notification Settings */}
                    <section>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-gold/10 rounded-lg">
                                <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">Notification Preferences</h3>
                                <p className="text-xs text-gray-500">Configure how you want to receive updates</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {renderToggle(
                                'notifications',
                                'emailNotifications',
                                settings.notifications.emailNotifications,
                                'Email Notifications',
                                'Receive email notifications for new bookings'
                            )}

                            {renderToggle(
                                'notifications',
                                'smsAlerts',
                                settings.notifications.smsAlerts,
                                'SMS Alerts',
                                'Get SMS notifications for urgent updates'
                            )}

                            {renderToggle(
                                'notifications',
                                'dailySummary',
                                settings.notifications.dailySummary,
                                'Daily Summary',
                                'Receive a daily summary of all bookings'
                            )}
                        </div>
                    </section>

                    {/* Display Settings */}
                    <section>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-gold/10 rounded-lg">
                                <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">Display Settings</h3>
                                <p className="text-xs text-gray-500">Customize your viewing preferences</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {renderSelect(
                                'display',
                                'defaultView',
                                settings.display.defaultView,
                                [
                                    { value: 'list', label: 'List View' },
                                    { value: 'grid', label: 'Grid View' }
                                ],
                                'Default View',
                                'Choose your preferred layout'
                            )}

                            {renderSelect(
                                'display',
                                'itemsPerPage',
                                settings.display.itemsPerPage,
                                [
                                    { value: 5, label: '5 items' },
                                    { value: 10, label: '10 items' },
                                    { value: 25, label: '25 items' },
                                    { value: 50, label: '50 items' }
                                ],
                                'Items per Page',
                                'Number of items to display'
                            )}

                            {renderSelect(
                                'display',
                                'theme',
                                settings.display.theme,
                                [
                                    { value: 'light', label: 'Light' },
                                    { value: 'dark', label: 'Dark (Coming Soon)' }
                                ],
                                'Theme',
                                'Choose your color theme'
                            )}
                        </div>
                    </section>

                    {/* API Integration Settings */}
                    <section>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-gold/10 rounded-lg">
                                <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">API Integration</h3>
                                <p className="text-xs text-gray-500">Manage external API connections</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {renderToggle(
                                'api',
                                'flightApiEnabled',
                                settings.api.flightApiEnabled,
                                'Flight API',
                                'Enable flight search and booking'
                            )}

                            {renderToggle(
                                'api',
                                'weatherApiEnabled',
                                settings.api.weatherApiEnabled,
                                'Weather API',
                                'Show weather information'
                            )}

                            {renderToggle(
                                'api',
                                'currencyApiEnabled',
                                settings.api.currencyApiEnabled,
                                'Currency API',
                                'Enable currency conversion'
                            )}
                        </div>
                    </section>

                    {/* Admin User Management */}
                    <section>
                        <AdminManagement />
                    </section>

                    {/* Save Button */}
                    {isEditable && (
                        <div className="flex items-center justify-end gap-3 pt-4 border-t">
                            {saveStatus === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-green-600 text-sm flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Settings saved successfully
                                </motion.div>
                            )}

                            {saveStatus === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-600 text-sm flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Failed to save settings
                                </motion.div>
                            )}

                            <motion.button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${isSaving ? 'bg-gray-400' : 'bg-gold hover:bg-gold/90'}`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isSaving ? (
                                    <div className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                                        Saving...
                                    </div>
                                ) : (
                                    'Save Changes'
                                )}
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 