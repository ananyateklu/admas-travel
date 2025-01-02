import { STATUS_OPTIONS } from './constants';
import { getStatusButtonStyle } from './utils';
import { BookingStatus } from './types';

interface BookingStatusProgressProps {
    currentStatus: BookingStatus;
    bookingId: string;
    userId: string;
    onStatusChange: (bookingId: string, newStatus: string, userId: string) => Promise<void>;
    isLoading: boolean;
}

export function BookingStatusProgress({
    currentStatus,
    bookingId,
    userId,
    onStatusChange,
    isLoading
}: BookingStatusProgressProps) {
    return (
        <div className="relative group">
            <div className="flex items-center gap-1">
                {STATUS_OPTIONS.map((option, index) => {
                    const isActive = currentStatus === option.value;
                    const currentStepIndex = STATUS_OPTIONS.findIndex(opt => opt.value === currentStatus);
                    const isPassed = currentStepIndex > index;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            disabled={isLoading}
                            className={`relative flex items-center ${index > 0 ? 'ml-8' : ''}`}
                            onClick={() => onStatusChange(bookingId, option.value, userId)}
                        >
                            {/* Connector Line */}
                            {index > 0 && (
                                <div className="absolute right-full w-8 h-0.5 -translate-y-1/2 top-1/2">
                                    <div
                                        className="w-full h-full rounded-full bg-gray-200 transition-all duration-300"
                                    />
                                </div>
                            )}

                            {/* Status Button */}
                            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 
                                ${getStatusButtonStyle(option, isActive, isPassed)} transition-all duration-300`}
                            >
                                <div className="w-4 h-4 flex items-center justify-center">
                                    {option.icon}
                                </div>

                                {/* Status Label */}
                                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                    <span className={`text-xs font-medium ${isActive ? option.colors.active.replace('border-', 'text-').split(' ')[0] : 'text-gray-500'
                                        }`}>
                                        {option.label}
                                    </span>
                                </div>
                            </div>

                            {/* Loading Overlay */}
                            {isLoading && isActive && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-current border-t-transparent"></div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tooltip on hover */}
            <div className="absolute top-full left-0 mt-8 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 text-sm p-2">
                <p className="text-gray-600">Click to change status</p>
                <p className="text-gray-400 text-xs">Current: {STATUS_OPTIONS.find(opt => opt.value === currentStatus)?.label}</p>
            </div>
        </div>
    );
} 