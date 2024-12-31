import { StatusOption } from './types';

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).toLowerCase();
};

export const formatDateShort = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).toLowerCase();
};

export const formatDateNumeric = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).toLowerCase();
};

export const getStatusStyle = (status: string) => {
    switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-yellow-100 text-yellow-800';
    }
};

// Color mapping for gradients
export const COLOR_MAP: Record<string, string> = {
    'amber-500': 'rgb(245 158 11)',    // Amber
    'emerald-500': 'rgb(16 185 129)',  // Emerald
    'blue-500': 'rgb(59 130 246)',     // Blue
    'rose-500': 'rgb(244 63 94)'       // Rose
};

export const getConnectorGradient = (fromStatus: StatusOption, toStatus: StatusOption, isActive: boolean) => {
    if (!isActive) return { backgroundColor: 'rgb(229 231 235)' }; // gray-200

    const fromColorKey = fromStatus.colors.connector.replace('bg-', '');
    const toColorKey = toStatus.colors.connector.replace('bg-', '');

    const fromColor = COLOR_MAP[fromColorKey] || '#e5e7eb';
    const toColor = COLOR_MAP[toColorKey] || '#e5e7eb';

    return {
        backgroundImage: `linear-gradient(to right, ${fromColor}, ${toColor})`
    };
};

export const getStatusButtonStyle = (option: StatusOption, isActive: boolean, isPassed: boolean) => {
    if (isActive) return option.colors.active;
    if (isPassed) return option.colors.completed;
    return option.colors.inactive;
}; 