import { useState } from 'react';
import { useAuth } from '../lib/firebase/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Preferences {
    travelStyle: string;
    destinations: string[];
    notifications: boolean;
}

interface ProfileFormData {
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

    const [formData, setFormData] = useState<ProfileFormData>({
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically update the user's profile in your backend
        console.log('Updated profile:', formData);
        setIsEditing(false);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Failed to sign out:', error);
        }
    };

    // Mock travel history data
    const travelHistory = [
        {
            id: '1',
            destination: 'Lalibela, Ethiopia',
            date: '2023-12-15',
            status: 'Completed',
            type: 'Cultural Tour',
            amount: 2500
        },
        {
            id: '2',
            destination: 'Simien Mountains, Ethiopia',
            date: '2024-03-20',
            status: 'Upcoming',
            type: 'Adventure Trek',
            amount: 1800
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                    <div className="flex items-center gap-6">
                        {user?.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt={user.displayName ?? 'User'}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gold text-white flex items-center justify-center text-3xl font-medium border-4 border-white shadow-lg">
                                {user?.displayName?.charAt(0) ?? user?.email?.charAt(0) ?? 'U'}
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-serif mb-2">{user?.displayName ?? 'Welcome'}</h1>
                            <p className="text-gray-600">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="ml-auto px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-serif">Profile Information</h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="text-gold hover:text-gold/80 transition-colors"
                                >
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="displayName"
                                            value={formData.displayName}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled
                                            className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                                        <input
                                            type="text"
                                            name="nationality"
                                            value={formData.nationality}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                                        <input
                                            type="text"
                                            name="passportNumber"
                                            value={formData.passportNumber}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Passport Expiry</label>
                                        <input
                                            type="date"
                                            name="passportExpiry"
                                            value={formData.passportExpiry}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Travel Style</label>
                                        <select
                                            name="preferences.travelStyle"
                                            value={formData.preferences.travelStyle}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                        >
                                            <option value="luxury">Luxury</option>
                                            <option value="comfort">Comfort</option>
                                            <option value="adventure">Adventure</option>
                                            <option value="budget">Budget</option>
                                        </select>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Travel Stats */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                            <h2 className="text-2xl font-serif mb-6">Travel Stats</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Trips</p>
                                        <p className="text-2xl font-bold text-gold">{travelHistory.length}</p>
                                    </div>
                                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm text-gray-600">Upcoming Trips</p>
                                        <p className="text-2xl font-bold text-gold">
                                            {travelHistory.filter(trip => trip.status === 'Upcoming').length}
                                        </p>
                                    </div>
                                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Spent</p>
                                        <p className="text-2xl font-bold text-gold">
                                            ${travelHistory.reduce((sum, trip) => sum + trip.amount, 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Travel History */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm p-8">
                            <h2 className="text-2xl font-serif mb-6">Travel History</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-4 px-4 font-medium text-gray-700">Destination</th>
                                            <th className="text-left py-4 px-4 font-medium text-gray-700">Date</th>
                                            <th className="text-left py-4 px-4 font-medium text-gray-700">Type</th>
                                            <th className="text-left py-4 px-4 font-medium text-gray-700">Amount</th>
                                            <th className="text-left py-4 px-4 font-medium text-gray-700">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {travelHistory.map((trip) => (
                                            <tr key={trip.id} className="border-b last:border-b-0">
                                                <td className="py-4 px-4">{trip.destination}</td>
                                                <td className="py-4 px-4">{new Date(trip.date).toLocaleDateString()}</td>
                                                <td className="py-4 px-4">{trip.type}</td>
                                                <td className="py-4 px-4">${trip.amount.toLocaleString()}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${trip.status === 'Completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {trip.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 