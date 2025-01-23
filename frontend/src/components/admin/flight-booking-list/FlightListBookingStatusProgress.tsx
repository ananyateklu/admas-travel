import { STATUS_OPTIONS } from "../constants";
import { BookingStatus } from '../types';

interface BookingStatusProgressProps {
    currentStatus: BookingStatus;
    previousStatus?: string;
    bookingId: string;
    userId: string;
    onStatusChange: (bookingId: string, newStatus: string, userId: string, previousStatus?: string) => Promise<void>;
    isLoading: boolean;
    isAdmin?: boolean;
}

export function BookingStatusProgress({
    currentStatus,
    previousStatus,
    bookingId,
    userId,
    onStatusChange,
    isLoading,
    isAdmin = false
}: BookingStatusProgressProps) {
    return (
        <div className="relative group flex items-center justify-center">
            <div className="flex items-center gap-2">
                {STATUS_OPTIONS.map((option, index) => {
                    const isActive = currentStatus === option.value;
                    const currentStepIndex = STATUS_OPTIONS.findIndex(opt => opt.value === currentStatus);
                    const isPassed = currentStepIndex > index;
                    const isUpcoming = currentStepIndex < index;
                    const canChangeStatus = isAdmin || (!isAdmin && currentStatus === 'pending' && option.value === 'cancelled');

                    // Get the button style based on status
                    const getButtonStyle = () => {
                        if (currentStatus === 'cancelled') {
                            const prevStatusIndex = STATUS_OPTIONS.findIndex(opt => opt.value === previousStatus);
                            const optionIndex = STATUS_OPTIONS.findIndex(opt => opt.value === option.value);

                            if (option.value === 'cancelled') {
                                return 'border-rose-500 bg-gradient-to-br from-rose-500 to-rose-400 text-white shadow-md'; // Enhanced red for cancel button
                            }

                            if (optionIndex <= prevStatusIndex) {
                                return 'border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100/80 text-rose-300'; // Enhanced faded red
                            }

                            return 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/80 text-gray-300'; // Enhanced gray
                        }

                        const currentOption = STATUS_OPTIONS.find(opt => opt.value === currentStatus);
                        if (!currentOption) return 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/80 text-gray-400';

                        if (isActive) {
                            return `${currentOption.colors.active} shadow-md backdrop-blur-sm`;
                        }
                        if (isPassed) {
                            return `${currentOption.colors.active} opacity-40 backdrop-blur-sm`;
                        }
                        return 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/80 text-gray-400';
                    };

                    return (
                        <button
                            key={option.value}
                            type="button"
                            className={`relative flex items-center ${index > 0 ? 'ml-6' : ''} group/button outline-none focus:outline-none`}
                            onClick={() => {
                                if (canChangeStatus) {
                                    // For cancelled status, we need to preserve the previous status
                                    if (option.value === 'cancelled') {
                                        onStatusChange(bookingId, option.value, userId, currentStatus);
                                    } else {
                                        onStatusChange(bookingId, option.value, userId);
                                    }
                                }
                            }}
                            title={`Change status to ${option.label}`}
                            aria-label={option.label}
                        >
                            {/* Connector Line */}
                            {index > 0 && (
                                <div className="absolute right-full w-6 h-0.5 -translate-y-1/2 top-1/2">
                                    <div className="relative w-full h-full">
                                        {/* Background line */}
                                        <div className={`absolute inset-0 rounded-full transition-all duration-500 ease-in-out
                                            ${currentStatus === 'cancelled' && STATUS_OPTIONS.findIndex(opt => opt.value === option.value) <= STATUS_OPTIONS.findIndex(opt => opt.value === previousStatus)
                                                ? 'bg-gradient-to-r from-rose-200/50 to-rose-200'
                                                : 'bg-gradient-to-r from-gray-200/50 to-gray-200'}`}
                                        />
                                        {/* Animated progress line */}
                                        <div className={`absolute inset-0 rounded-full transform origin-left transition-transform duration-500 ease-in-out ${(() => {
                                            if (currentStatus === 'cancelled') {
                                                const optionIndex = STATUS_OPTIONS.findIndex(opt => opt.value === option.value);
                                                const prevStatusIndex = STATUS_OPTIONS.findIndex(opt => opt.value === previousStatus);
                                                return optionIndex <= prevStatusIndex ? 'bg-gradient-to-r from-rose-300/50 to-rose-300 scale-x-100' : 'scale-x-0';
                                            }
                                            return isPassed ? 'bg-gradient-to-r from-forest-300/50 to-forest-300 scale-x-100' : 'scale-x-0';
                                        })()}`}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Status Button */}
                            <div className={`relative flex items-center justify-center w-7 h-7 rounded-full border-2 
                                ${getButtonStyle()} 
                                transition-all duration-300 ease-in-out
                                transform origin-center
                                ${!isLoading && !isActive ? 'hover:scale-110 hover:-translate-y-0.5 hover:shadow-lg hover:border-opacity-70' : ''}
                                ${isActive ? 'ring-2 ring-current ring-opacity-20' : ''}
                                group-hover/button:shadow-md`}
                            >
                                <div className={`w-3.5 h-3.5 flex items-center justify-center 
                                    ${isUpcoming ? 'text-gray-400' : 'text-current'}
                                    transition-all duration-300 ease-in-out
                                    group-hover/button:scale-110 group-hover/button:rotate-3`}
                                >
                                    {option.icon}
                                </div>

                                {/* Completed Indicator */}
                                {((currentStatus === 'cancelled' &&
                                    STATUS_OPTIONS.findIndex(opt => opt.value === option.value) < STATUS_OPTIONS.findIndex(opt => opt.value === previousStatus)) ||
                                    (currentStatus !== 'cancelled' && (isPassed || (isActive && (option.value === 'confirmed' || option.value === 'completed'))))) && (
                                        <div className="absolute -top-1 -right-1 bg-forest-400 rounded-full w-3 h-3 flex items-center justify-center shadow-sm">
                                            <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}

                                {/* Active Indicator */}
                                {option.value !== 'cancelled' &&
                                    STATUS_OPTIONS[currentStepIndex + 1]?.value === option.value && (
                                        <div className="absolute inset-0 rounded-full animate-[pulse_2s_ease-in-out_infinite] opacity-10 bg-current"></div>
                                    )}
                            </div>

                            {/* Status Label */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 whitespace-nowrap pointer-events-none">
                                <span className={`text-[10px] font-medium tracking-tight transition-colors duration-300 ease-in-out ${(() => {
                                    if (currentStatus === 'cancelled') {
                                        if (option.value === 'cancelled') return 'text-rose-500';
                                        const optionIndex = STATUS_OPTIONS.findIndex(opt => opt.value === option.value);
                                        const prevStatusIndex = STATUS_OPTIONS.findIndex(opt => opt.value === previousStatus);
                                        return optionIndex <= prevStatusIndex ? 'text-rose-300' : 'text-gray-300';
                                    }
                                    const currentOption = STATUS_OPTIONS.find(opt => opt.value === currentStatus);
                                    if (!currentOption) return 'text-gray-500';
                                    const currentColorLabel = currentOption.colors.active.replace('bg-', 'text-').replace('text-white', '');
                                    return isPassed ? `${currentColorLabel} opacity-75` : 'text-gray-500';
                                })()}`}>
                                    {option.label}
                                </span>
                            </div>

                            {/* Hover Indicator */}
                            <div className={`absolute inset-0 rounded-full bg-current opacity-0 transition-opacity duration-300
                                ${!isLoading && !isActive ? 'group-hover/button:opacity-10' : ''}`}
                            ></div>

                            {/* Loading Overlay */}
                            {isLoading && isActive && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-white/50 rounded-full backdrop-blur-sm transition-all duration-300"></div>
                                    <div className="relative animate-spin rounded-full h-7 w-7 border-2 border-current border-t-transparent shadow-sm"></div>
                                </div>
                            )}

                            {/* Tooltip */}
                            {canChangeStatus && (
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/button:opacity-100 transition-all duration-300 pointer-events-none transform group-hover/button:-translate-y-1">
                                    <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded shadow-lg text-[11px] whitespace-nowrap">
                                        Change status to {option.label}
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-4 border-transparent border-t-white/95 filter drop-shadow-sm"></div>
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
} 