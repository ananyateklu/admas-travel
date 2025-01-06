import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CarSearchResult } from '../../types/carSearch';
import { carService, ApiSupplierDetailsResponse, ApiSupplierRatingsResponse } from '../../lib/api/carService';

interface CarDetailsModalProps {
    car: CarSearchResult;
    isOpen: boolean;
    onClose: () => void;
    onBook: () => void;
    searchKey: string;
}

export function CarDetailsModal({
    car,
    isOpen,
    onClose,
    onBook,
    searchKey
}: CarDetailsModalProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'pricing' | 'supplier'>('overview');
    const [isLoading, setIsLoading] = useState(false);
    const [supplierDetails, setSupplierDetails] = useState<ApiSupplierDetailsResponse | null>(null);
    const [supplierRatings, setSupplierRatings] = useState<ApiSupplierRatingsResponse | null>(null);

    const {
        vehicle_info,
        pricing,
        supplier,
        availability
    } = car;

    const formatPrice = (amount: number, currency: string | null) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency ?? 'USD'
        }).format(amount);
    };

    const loadSupplierDetails = async () => {
        if (supplierDetails) return;

        setIsLoading(true);
        try {
            const [detailsResponse, ratingsResponse] = await Promise.all([
                carService.getVehicleSupplierDetails(car.vehicle_id, searchKey, pricing.total_price.currency),
                carService.getVehicleSupplierRatings(car.vehicle_id, searchKey, pricing.total_price.currency)
            ]);

            if (detailsResponse.status) {
                setSupplierDetails(detailsResponse);
            }
            if (ratingsResponse.status) {
                setSupplierRatings(ratingsResponse);
            }
        } catch (error) {
            console.error('Error loading supplier details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTabChange = (tab: typeof activeTab) => {
        setActiveTab(tab);
        if (tab === 'supplier') {
            loadSupplierDetails();
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Vehicle Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Type</p>
                                    <p className="text-sm text-gray-900">{vehicle_info.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Category</p>
                                    <p className="text-sm text-gray-900">{vehicle_info.category}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Transmission</p>
                                    <p className="text-sm text-gray-900">{vehicle_info.transmission}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Capacity</p>
                                    <p className="text-sm text-gray-900">{vehicle_info.seats} seats, {vehicle_info.doors} doors</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Pickup & Drop-off</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Pickup Location</p>
                                        <p className="text-sm text-gray-500">{availability.pickup_location.name}</p>
                                        <p className="text-sm text-gray-500">{availability.pickup_location.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Drop-off Location</p>
                                        <p className="text-sm text-gray-500">{availability.dropoff_location.name}</p>
                                        <p className="text-sm text-gray-500">{availability.dropoff_location.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'features':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Features</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {vehicle_info.features.map((feature) => (
                                    <div key={`feature-${feature}`} className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm text-gray-600">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Luggage Capacity</h3>
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{vehicle_info.luggage.large}</p>
                                        <p className="text-xs text-gray-500">Large bags</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-14 0h14" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{vehicle_info.luggage.small}</p>
                                        <p className="text-xs text-gray-500">Small bags</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'pricing':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Price Breakdown</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500">Base rate</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {formatPrice(pricing.base_price.amount, pricing.base_price.currency)}
                                    </p>
                                </div>
                                {pricing.additional_fees.map((fee) => (
                                    <div key={`fee-${fee.name}-${fee.amount}`} className="flex justify-between items-center">
                                        <p className="text-sm text-gray-500">{fee.name}</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatPrice(fee.amount, fee.currency)}
                                        </p>
                                    </div>
                                ))}
                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <p className="text-base font-medium text-gray-900">Total price</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {formatPrice(pricing.total_price.amount, pricing.total_price.currency)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Included in Price</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {pricing.included_features.map((feature) => (
                                    <div key={`included-${feature}`} className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm text-gray-600">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'supplier':
                return (
                    <div className="space-y-6">
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span className="text-lg font-medium text-gray-600">
                                            {supplier.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{supplier.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {supplier.rating.toFixed(1)}
                                                </span>
                                                <span className="text-yellow-400 ml-1">★</span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                ({supplier.review_count} reviews)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {supplierDetails && (
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Location</h4>
                                            <p className="text-sm text-gray-500">{supplier.location.address}</p>
                                            <p className="text-sm text-gray-500">
                                                {supplier.location.city}, {supplier.location.country}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {supplierRatings && (
                                    <div className="mt-6">
                                        <h4 className="text-sm font-medium text-gray-900 mb-4">Customer Reviews</h4>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto">
                            {/* Header */}
                            <div className="relative">
                                <img
                                    src={vehicle_info.image_url}
                                    alt={vehicle_info.name}
                                    className="w-full h-64 object-cover"
                                />
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-medium text-gray-900 mb-2">
                                        {vehicle_info.name}
                                    </h2>
                                    <p className="text-gray-500">
                                        {vehicle_info.category} • {vehicle_info.transmission}
                                    </p>
                                </div>

                                {/* Tabs */}
                                <div className="border-b border-gray-200 mb-6">
                                    <div className="flex space-x-6">
                                        {(['overview', 'features', 'pricing', 'supplier'] as const).map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => handleTabChange(tab)}
                                                className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                                                    ? 'border-primary text-primary'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Tab Content */}
                                <div className="mb-6">
                                    {renderTabContent()}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-6 border-t">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatPrice(pricing.total_price.amount, pricing.total_price.currency)}
                                        </p>
                                        <p className="text-sm text-gray-500">Total price</p>
                                    </div>
                                    <motion.button
                                        onClick={onBook}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
                                    >
                                        Book Now
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
} 