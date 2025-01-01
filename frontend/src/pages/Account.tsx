import { useState, useEffect } from 'react';
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
    preferences: Preferences;
}

export default function Account() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState<AccountFormData>({
        displayName: user?.displayName ?? '',
        email: user?.email ?? '',
        phone: '',
        address: '',
        nationality: '',
        passportNumber: '',
        passportExpiry: '',
        preferences: {
            travelStyle: 'comfort',
            destinations: [],
            notifications: true
        }
    });

    const [isEditing, setIsEditing] = useState(false);

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
                    setFormData(prev => ({
                        ...prev,
                        ...userData,
                        preferences: {
                            travelStyle: userData.preferences?.travelStyle ?? 'comfort',
                            destinations: userData.preferences?.destinations ?? [],
                            notifications: userData.preferences?.notifications ?? true
                        },
                        displayName: user.displayName ?? prev.displayName,
                        email: user.email ?? prev.email
                    }));
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            if (parent === 'preferences') {
                setFormData(prev => ({
                    ...prev,
                    preferences: {
                        ...prev.preferences,
                        [child]: value
                    }
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSave = async () => {
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
                preferences: formData.preferences
            }, { merge: true });

            setSuccessMessage('Profile updated successfully');
            setIsEditing(false);
        } catch (err) {
            console.error('Error saving profile:', err);
            setError('Failed to save profile changes');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-96px)] mt-[112px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-96px)] mt-[112px] bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-8">
                        <div className="flex-shrink-0">
                            {user?.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName ?? 'Profile'}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gold text-white flex items-center justify-center text-3xl font-medium border-4 border-white shadow-lg">
                                    {user?.displayName?.charAt(0) ?? user?.email?.charAt(0) ?? 'U'}
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-4xl font-serif text-gray-900 mb-2">
                                {formData.displayName || 'Welcome'}
                            </h1>
                            <p className="text-lg text-gray-600">{formData.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-serif text-gray-900">Profile Information</h2>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="inline-flex items-center px-4 py-2 border border-gold text-gold rounded-lg hover:bg-gold hover:text-white transition-colors"
                            >
                                {isEditing ? (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Edit Profile
                                    </>
                                )}
                            </button>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {successMessage}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Basic Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Basic Information
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="displayName"
                                            value={formData.displayName}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Travel Documents */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    Travel Documents
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nationality
                                        </label>
                                        <input
                                            type="text"
                                            name="nationality"
                                            value={formData.nationality}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Passport Number
                                        </label>
                                        <input
                                            type="text"
                                            name="passportNumber"
                                            value={formData.passportNumber}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Passport Expiry Date
                                        </label>
                                        <input
                                            type="date"
                                            name="passportExpiry"
                                            value={formData.passportExpiry}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Travel Preferences */}
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Travel Preferences
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Preferred Travel Style
                                        </label>
                                        <select
                                            name="preferences.travelStyle"
                                            value={formData.preferences.travelStyle}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-50"
                                        >
                                            <option value="comfort">Comfort</option>
                                            <option value="luxury">Luxury</option>
                                            <option value="budget">Budget</option>
                                            <option value="adventure">Adventure</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="mt-8 flex justify-end gap-4">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="inline-flex items-center px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        <div className="mt-8 pt-8 border-t">
                            <button
                                onClick={async () => {
                                    try {
                                        await signOut();
                                        navigate('/');
                                    } catch (error) {
                                        console.error('Error signing out:', error);
                                    }
                                }}
                                className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 