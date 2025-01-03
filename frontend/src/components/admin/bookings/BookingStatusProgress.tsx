import { STATUS_OPTIONS } from "../constants";
import { BookingStatus } from '../types';

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
                    const isUpcoming = currentStepIndex < index;

                    // Get the button style based on status
                    const getButtonStyle = () => {
                        const currentOption = STATUS_OPTIONS.find(opt => opt.value === currentStatus);
                        if (!currentOption) return 'border-gray-200 bg-white text-gray-400';

                        if (isActive) {
                            return `${currentOption.colors.active} shadow-sm`;
                        }
                        if (isPassed) {
                            return `${currentOption.colors.active} opacity-40`;
                        }
                        return 'border-gray-200 bg-white text-gray-400';
                    };

                    return (
                        <button
                            key={option.value}
                            type="button"
                            disabled={isLoading}
                            className={`relative flex items-center ${index > 0 ? 'ml-8' : ''} group/button outline-none focus:outline-none`}
                            onClick={() => onStatusChange(bookingId, option.value, userId)}
                            title={`Change status to ${option.label}`}
                        >
                            {/* Connector Line */}
                            {index > 0 && (
                                <div className="absolute right-full w-8 h-0.5 -translate-y-1/2 top-1/2">
                                    <div className="relative w-full h-full">
                                        {/* Background line */}
                                        <div className="absolute inset-0 rounded-full bg-gray-200" />
                                    </div>
                                </div>
                            )}

                            {/* Status Button */}
                            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 
                                ${getButtonStyle()} transition-all duration-300 ease-in-out
                                ${!isLoading && !isActive ? 'hover:scale-110 hover:shadow-lg hover:border-opacity-70' : ''}
                                ${isActive ? 'ring-2 ring-gray-200 shadow-md' : ''}
                                group-hover/button:shadow-md`}
                            >
                                <div className={`w-4 h-4 flex items-center justify-center 
                                    ${isUpcoming ? 'text-gray-400' : 'text-current'}
                                    transition-all duration-300 ease-in-out
                                    group-hover/button:scale-110 group-hover/button:rotate-3`}
                                >
                                    {option.icon}
                                </div>

                                {/* Status Label */}
                                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                    <span className={`text-xs transition-colors duration-300 ease-in-out
                                        ${isActive || isPassed
                                            ? STATUS_OPTIONS.find(opt => opt.value === currentStatus)?.colors.label ?? 'text-gray-500'
                                            : 'text-gray-500'
                                        }`}
                                    >
                                        {option.label}
                                    </span>
                                </div>

                                {/* Active Indicator */}
                                {isActive && option.value !== 'completed' && option.value !== 'cancelled' && (
                                    <div className="absolute -inset-1 rounded-full animate-pulse opacity-20 bg-current"></div>
                                )}

                                {/* Hover Indicator */}
                                <div className={`absolute inset-0 rounded-full bg-current opacity-0 transition-opacity duration-300
                                    ${!isLoading && !isActive ? 'group-hover/button:opacity-5' : ''}`}
                                ></div>
                            </div>

                            {/* Loading Overlay */}
                            {isLoading && isActive && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-white/50 rounded-full backdrop-blur-sm"></div>
                                    <div className="relative animate-spin rounded-full h-8 w-8 border-2 border-current border-t-transparent"></div>
                                </div>
                            )}

                            {/* Tooltip */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <div className="bg-white text-gray-600 text-xs rounded-lg py-1.5 px-3 whitespace-nowrap shadow-lg border border-gray-100">
                                    Change to {option.label}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-4 border-transparent border-t-white"></div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
} 