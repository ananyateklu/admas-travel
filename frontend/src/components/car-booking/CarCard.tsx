import { motion } from 'framer-motion';
import { CarSearchResult } from '../../types/carSearch';

interface CarCardProps {
    car: CarSearchResult;
    onSelect: (car: CarSearchResult) => void;
    className?: string;
}

export function CarCard({ car, onSelect, className = '' }: CarCardProps) {
    const {
        vehicle_info,
        pricing,
        supplier,
        availability
    } = car;

    const formatPrice = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
        >
            {/* Image Section */}
            <div className="relative">
                <img
                    src={vehicle_info.image_url}
                    alt={vehicle_info.name}
                    className="w-full aspect-[16/9] object-cover"
                />
                <div className="absolute top-2 right-2">
                    <div className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-medium">
                        {supplier.rating.toFixed(1)} ★
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-4">
                {/* Vehicle Info */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900">
                        {vehicle_info.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {vehicle_info.category} • {vehicle_info.transmission}
                    </p>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 4h-8a3 3 0 00-3 3v10a3 3 0 003 3h8a3 3 0 003-3V7a3 3 0 00-3-3z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        <span>{vehicle_info.seats} seats</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{vehicle_info.doors} doors</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span>
                            {vehicle_info.luggage.large} large + {vehicle_info.luggage.small} small
                        </span>
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                        <p className="font-medium text-gray-900">Pickup</p>
                        <p>{availability.pickup_location.name}</p>
                        <p>{availability.pickup_location.address}</p>
                    </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                        <p className="text-2xl font-bold text-gray-900">
                            {formatPrice(pricing.total_price.amount, pricing.total_price.currency)}
                        </p>
                        <p className="text-xs text-gray-500">Total price</p>
                    </div>
                    <motion.button
                        onClick={() => onSelect(car)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Select
                    </motion.button>
                </div>

                {/* Supplier Info */}
                <div className="flex items-center gap-2 pt-2 border-t">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                            {supplier.name.charAt(0)}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-900">{supplier.name}</p>
                        <p className="text-[10px] text-gray-500">
                            {supplier.review_count} reviews
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
} 