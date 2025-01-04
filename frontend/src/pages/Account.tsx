import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/firebase/useAuth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Preferences {
    travelStyle: string;
    destinations: string[];
    notifications: boolean;
}

interface AccountFormData {
    displayName: string;
    email: string;
    phone: string;
    address: string;
    nationality: string;
    passportNumber: string;
    passportExpiry: string;
    dateOfBirth: string;
    preferences: Preferences;
}

interface FormChanges {
    hasChanges: boolean;
    originalData: AccountFormData;
}

interface ValidationErrors {
    [key: string]: string;
}

interface CollapsedSections {
    basicInfo: boolean;
    travelDocs: boolean;
    preferences: boolean;
}

const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 }
    }
};

export default function Account() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [formChanges, setFormChanges] = useState<FormChanges>({
        hasChanges: false,
        originalData: {
            displayName: '',
            email: '',
            phone: '',
            address: '',
            nationality: '',
            passportNumber: '',
            passportExpiry: '',
            dateOfBirth: '',
            preferences: {
                travelStyle: 'comfort',
                destinations: [],
                notifications: true
            }
        }
    });

    const [formData, setFormData] = useState<AccountFormData>({
        displayName: user?.displayName ?? '',
        email: user?.email ?? '',
        phone: '',
        address: '',
        nationality: '',
        passportNumber: '',
        passportExpiry: '',
        dateOfBirth: '',
        preferences: {
            travelStyle: 'comfort',
            destinations: [],
            notifications: true
        }
    });

    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [collapsedSections, setCollapsedSections] = useState<CollapsedSections>({
        basicInfo: false,
        travelDocs: false,
        preferences: false
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user) {
                navigate('/');
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data() as Omit<AccountFormData, 'displayName' | 'email'>;
                    const newFormData = {
                        ...userData,
                        preferences: {
                            travelStyle: userData.preferences?.travelStyle ?? 'comfort',
                            destinations: userData.preferences?.destinations ?? [],
                            notifications: userData.preferences?.notifications ?? true
                        },
                        displayName: user.displayName ?? '',
                        email: user.email ?? ''
                    };
                    setFormData(newFormData);
                    setFormChanges({
                        hasChanges: false,
                        originalData: newFormData
                    });
                }
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Failed to load profile data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [user, navigate]);

    const calculateProfileCompleteness = () => {
        const requiredFields = ['displayName', 'phone', 'address', 'nationality', 'passportNumber', 'passportExpiry', 'dateOfBirth'];
        const completedFields = requiredFields.filter(field => {
            const value = formData[field as keyof AccountFormData];
            return typeof value === 'string' && value.length > 0;
        });
        return Math.round((completedFields.length / requiredFields.length) * 100);
    };

    const validateDate = (date: Date, shouldBeInFuture: boolean): string => {
        const now = new Date();
        if (shouldBeInFuture) {
            return date > now ? '' : 'Date must be in the future';
        }
        return date <= now ? '' : 'Date cannot be in the future';
    };

    const validateField = (name: string, value: string): string => {
        if (!value) return '';

        const validations: Record<string, (val: string) => string> = {
            phone: val => /^\+?[\d\s-]{10,}$/.test(val) ? '' : 'Invalid phone number format',
            email: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? '' : 'Invalid email format',
            passportNumber: val => val.length >= 6 ? '' : 'Passport number must be at least 6 characters',
            dateOfBirth: val => validateDate(new Date(val), false),
            passportExpiry: val => validateDate(new Date(val), true)
        };

        return validations[name]?.(value) ?? '';
    };

    const getInputClassName = (fieldName: string) => {
        const baseClasses = "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-50";
        const isChanged = JSON.stringify(formData[fieldName as keyof AccountFormData]) !==
            JSON.stringify(formChanges.originalData[fieldName as keyof AccountFormData]);
        const hasError = validationErrors[fieldName];

        if (hasError) return `${baseClasses} border-red-300 bg-red-50`;
        if (isChanged) return `${baseClasses} border-gold/50 bg-gold/5`;
        return `${baseClasses} border-gray-200`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let newFormData: AccountFormData;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            if (parent === 'preferences') {
                newFormData = {
                    ...formData,
                    preferences: {
                        ...formData.preferences,
                        [child]: value
                    }
                };
            } else {
                newFormData = formData;
            }
        } else {
            newFormData = {
                ...formData,
                [name]: value
            };
        }

        const error = validateField(name.split('.').pop()!, value);
        setValidationErrors(prev => {
            const newErrors = { ...prev };
            if (error) {
                newErrors[name] = error;
            } else {
                delete newErrors[name];
            }
            return newErrors;
        });

        setFormData(newFormData);
        setFormChanges(prev => ({
            ...prev,
            hasChanges: JSON.stringify(newFormData) !== JSON.stringify(prev.originalData)
        }));
    };

    const handleCancel = () => {
        setFormData(formChanges.originalData);
        setFormChanges(prev => ({ ...prev, hasChanges: false }));
        setError(null);
        setSuccessMessage(null);
    };

    const handleSave = useCallback(async () => {
        if (!user) return;

        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await setDoc(doc(db, 'users', user.uid), {
                phone: formData.phone,
                address: formData.address,
                nationality: formData.nationality,
                passportNumber: formData.passportNumber,
                passportExpiry: formData.passportExpiry,
                dateOfBirth: formData.dateOfBirth,
                preferences: formData.preferences
            }, { merge: true });

            setSuccessMessage('Profile updated successfully');
            setFormChanges({
                hasChanges: false,
                originalData: formData
            });
        } catch (err) {
            console.error('Error saving profile:', err);
            setError('Failed to save profile changes');
        } finally {
            setIsSaving(false);
        }
    }, [user, formData]);

    const toggleSection = (section: keyof CollapsedSections) => {
        setCollapsedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    useEffect(() => {
        let saveTimeout: NodeJS.Timeout;

        if (formChanges.hasChanges && !Object.keys(validationErrors).length) {
            saveTimeout = setTimeout(() => {
                handleSave();
            }, 3000); // Auto-save after 3 seconds of no changes
        }

        return () => clearTimeout(saveTimeout);
    }, [formData, formChanges.hasChanges, handleSave, validationErrors]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (formChanges.hasChanges) {
                const message = '';
                e.preventDefault();
                return message;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [formChanges.hasChanges]);

    if (isLoading) {
        return (
            <motion.div
                className="flex items-center justify-center min-h-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent"></div>
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <motion.div
                className="relative bg-cover bg-center border-b shadow-md h-[300px]"
                style={{ backgroundImage: 'url("/src/assets/mountains.jpeg")' }}
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative max-w-5xl mx-auto px-4 h-full flex items-center pt-24">
                    <motion.div
                        className="flex items-center gap-6"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <motion.div
                            className="flex-shrink-0"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            {user?.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName ?? 'Profile'}
                                    className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-md"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gold text-white flex items-center justify-center text-2xl font-medium border-3 border-white shadow-md">
                                    {user?.displayName?.charAt(0) ?? user?.email?.charAt(0) ?? 'U'}
                                </div>
                            )}
                        </motion.div>
                        <div>
                            <motion.h1
                                className="text-3xl font-serif text-white mb-1"
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                            >
                                {formData.displayName || 'Welcome'}
                            </motion.h1>
                            <motion.p
                                className="text-base text-gray-200"
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.4 }}
                            >
                                {formData.email}
                            </motion.p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Profile Content */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                <motion.div
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <div className="p-6">
                        <motion.div
                            className="mb-6"
                            variants={itemVariants}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-2xl font-serif text-gray-900">Profile Information</h2>
                                <span className="text-xs text-gray-600">
                                    Profile Completion: {calculateProfileCompleteness()}%
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gold"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${calculateProfileCompleteness()}%` }}
                                    transition={{ duration: 0.4 }}
                                />
                            </div>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm flex items-center"
                                    initial={{ opacity: 0, y: -15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </motion.div>
                            )}

                            {successMessage && (
                                <motion.div
                                    className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded text-sm flex items-center"
                                    initial={{ opacity: 0, y: -15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {successMessage}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            variants={containerVariants}
                        >
                            {/* Basic Information */}
                            <motion.div variants={itemVariants} className="space-y-3">
                                <button
                                    onClick={() => toggleSection('basicInfo')}
                                    className="w-full flex justify-between items-center text-base font-semibold text-gray-900 mb-4"
                                >
                                    <div className="flex items-center">
                                        <span className="w-4 h-4 mr-2 text-gold">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </span>{" "}
                                        Basic Information
                                    </div>
                                    <motion.svg
                                        className="w-4 h-4 text-gray-500"
                                        animate={{ rotate: collapsedSections.basicInfo ? 0 : 180 }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </motion.svg>
                                </button>
                                <AnimatePresence>
                                    {!collapsedSections.basicInfo && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-3 overflow-hidden"
                                        >
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="displayName"
                                                    value={formData.displayName}
                                                    onChange={handleInputChange}
                                                    disabled={isSaving}
                                                    className={getInputClassName('displayName')}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    disabled
                                                    className="w-full px-3 py-1.5 text-sm border rounded bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Date of Birth
                                                </label>
                                                <input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={formData.dateOfBirth}
                                                    onChange={handleInputChange}
                                                    disabled={isSaving}
                                                    className="w-full px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-gold focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Phone
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    disabled={isSaving}
                                                    className="w-full px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-gold focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Address
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    disabled={isSaving}
                                                    className="w-full px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-gold focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Travel Documents */}
                            <motion.div variants={itemVariants} className="space-y-3">
                                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                                    <span className="w-4 h-4 mr-2 text-gold">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </span>{" "}
                                    Travel Documents
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Nationality
                                        </label>
                                        <input
                                            type="text"
                                            name="nationality"
                                            value={formData.nationality}
                                            onChange={handleInputChange}
                                            disabled={isSaving}
                                            className="w-full px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-gold focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Passport Number
                                        </label>
                                        <input
                                            type="text"
                                            name="passportNumber"
                                            value={formData.passportNumber}
                                            onChange={handleInputChange}
                                            disabled={isSaving}
                                            className="w-full px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-gold focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Passport Expiry Date
                                        </label>
                                        <input
                                            type="date"
                                            name="passportExpiry"
                                            value={formData.passportExpiry}
                                            onChange={handleInputChange}
                                            disabled={isSaving}
                                            className="w-full px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-gold focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Travel Preferences */}
                            <motion.div variants={itemVariants} className="md:col-span-2 space-y-3">
                                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                                    <span className="w-4 h-4 mr-2 text-gold">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>{" "}
                                    Travel Preferences
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Preferred Travel Style
                                        </label>
                                        <select
                                            name="preferences.travelStyle"
                                            value={formData.preferences.travelStyle}
                                            onChange={handleInputChange}
                                            disabled={isSaving}
                                            className="w-full px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-gold focus:border-transparent disabled:bg-gray-50"
                                        >
                                            <option value="comfort">Comfort</option>
                                            <option value="luxury">Luxury</option>
                                            <option value="budget">Budget</option>
                                            <option value="adventure">Adventure</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Notifications
                                        </label>
                                        <select
                                            name="preferences.notifications"
                                            value={formData.preferences.notifications.toString()}
                                            onChange={handleInputChange}
                                            disabled={isSaving}
                                            className="w-full px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-gold focus:border-transparent disabled:bg-gray-50"
                                        >
                                            <option value="true">Enabled</option>
                                            <option value="false">Disabled</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="mt-6 pt-6 border-t"
                            variants={itemVariants}
                        >
                            <div className="flex justify-between items-center">
                                <motion.button
                                    onClick={async () => {
                                        try {
                                            await signOut();
                                            navigate('/');
                                        } catch (error) {
                                            console.error('Error signing out:', error);
                                        }
                                    }}
                                    className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors text-sm"
                                    whileHover={{ scale: 1.03, x: 3 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign Out
                                </motion.button>

                                {formChanges.hasChanges && (
                                    <div className="flex gap-3">
                                        <motion.button
                                            onClick={handleCancel}
                                            className="px-4 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                            disabled={isSaving}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            onClick={handleSave}
                                            disabled={isSaving || Object.keys(validationErrors).length > 0}
                                            className="inline-flex items-center px-4 py-1.5 text-sm bg-gold text-white rounded hover:bg-gold/90 transition-colors disabled:opacity-50"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {getButtonContent()}
                                        </motion.button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );

    function getButtonContent() {
        if (isSaving) {
            return (
                <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                </div>
            );
        }

        if (Object.keys(validationErrors).length > 0) {
            return (
                <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Fix Errors
                </div>
            );
        }

        return (
            <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {formChanges.hasChanges ? 'Save' : 'Saved'}
            </div>
        );
    }
} 