import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CarSearchResult } from '../../types/carSearch';
import { carService, ApiSupplierDetailsResponse, ApiSupplierRatingsResponse } from '../../lib/api/carService';
import { createPortal } from 'react-dom';

interface CarDetailsModalProps {
    car: CarSearchResult;
    onClose: () => void;
    onBook: () => void;
    searchKey: string;
}

export function CarDetailsModal({
    car,
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
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-base font-medium text-gray-900 mb-2">Vehicle Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Type</p>
                                    <p className="text-sm text-gray-900">{vehicle_info.type}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Category</p>
                                    <p className="text-sm text-gray-900">{vehicle_info.category}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Transmission</p>
                                    <p className="text-sm text-gray-900">{vehicle_info.transmission}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Capacity</p>
                                    <p className="text-sm text-gray-900">{vehicle_info.seats} seats, {vehicle_info.doors} doors</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-base font-medium text-gray-900 mb-2">Pickup & Drop-off</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <p className="text-xs font-medium text-gray-900">Pickup Location</p>
                                        <p className="text-xs text-gray-500">{availability.pickup_location.name}</p>
                                        <p className="text-xs text-gray-500">{availability.pickup_location.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <div>
                                        <p className="text-xs font-medium text-gray-900">Drop-off Location</p>
                                        <p className="text-xs text-gray-500">{availability.dropoff_location.name}</p>
                                        <p className="text-xs text-gray-500">{availability.dropoff_location.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'features':
                return (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-base font-medium text-gray-900 mb-3">Vehicle Features</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {vehicle_info.features.map((feature) => (
                                    <div key={`feature-${feature}`} className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-xs text-gray-600">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-base font-medium text-gray-900 mb-3">Luggage Capacity</h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <div>
                                        <p className="text-xs font-medium text-gray-900">{vehicle_info.luggage.large}</p>
                                        <p className="text-[11px] text-gray-500">Large bags</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-14 0h14" />
                                    </svg>
                                    <div>
                                        <p className="text-xs font-medium text-gray-900">{vehicle_info.luggage.small}</p>
                                        <p className="text-[11px] text-gray-500">Small bags</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'pricing':
                return (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-base font-medium text-gray-900 mb-3">Price Breakdown</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-500">Base rate</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {formatPrice(pricing.base_price.amount, pricing.base_price.currency)}
                                    </p>
                                </div>
                                {pricing.additional_fees.map((fee) => (
                                    <div key={`fee-${fee.name}-${fee.amount}`} className="flex justify-between items-center">
                                        <p className="text-xs text-gray-500">{fee.name}</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatPrice(fee.amount, fee.currency)}
                                        </p>
                                    </div>
                                ))}
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium text-gray-900">Total price</p>
                                        <p className="text-base font-bold text-gray-900">
                                            {formatPrice(pricing.total_price.amount, pricing.total_price.currency)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-base font-medium text-gray-900 mb-3">Included in Price</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {pricing.included_features.map((feature) => (
                                    <div key={`included-${feature}`} className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-xs text-gray-600">{feature}</span>
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

    return createPortal(
        <AnimatePresence mode="wait">
            <motion.div
                key="modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ zIndex: 99999 }}
                className="fixed inset-0 bg-black/50 overflow-y-auto"
                onClick={onClose}
            >
                <div className="min-h-screen w-full flex items-center justify-center p-4">
                    <motion.div
                        key="modal-content"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={{
                            hidden: { opacity: 0, scale: 0.95, y: 20 },
                            visible: { opacity: 1, scale: 1, y: 0 },
                            exit: { opacity: 0, scale: 0.95, y: 20 }
                        }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="w-full max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-500 transition-colors bg-white/80 backdrop-blur-sm rounded-full"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Hero Section */}
                        <div className="relative flex flex-col md:flex-row items-start justify-between p-5 border-b">
                            <div className="flex-1 mb-4 md:mb-0">
                                <h2 className="text-xl font-serif mb-1 text-gray-900">{vehicle_info.name}</h2>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-600">
                                        {vehicle_info.type} • {vehicle_info.category}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {availability.pickup_location.name}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full md:w-64 h-40 rounded-lg overflow-hidden">
                                <img
                                    src={vehicle_info.image_url}
                                    alt={vehicle_info.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-6">
                            {/* Price and Book Button - Top Section */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b gap-4">
                                <div>
                                    <div className="text-lg font-bold text-primary">
                                        {formatPrice(pricing.total_price.amount, pricing.total_price.currency)}
                                    </div>
                                    <div className="text-[11px] text-gray-500">total • Includes taxes and fees</div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        onClose();
                                        onBook();
                                    }}
                                    className="w-full sm:w-auto px-4 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                    Book Now
                                </motion.button>
                            </div>

                            {/* Tabs */}
                            <div className="flex space-x-4 border-b overflow-x-auto">
                                {(['overview', 'features', 'pricing', 'supplier'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => handleTabChange(tab)}
                                        className={`pb-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                                            ${activeTab === tab
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="pt-2">
                                {renderTabContent()}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
} 