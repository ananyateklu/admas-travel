import { Flight } from '../../types';

export function getStatusStyles(statusLabel: string) {
    switch (statusLabel) {
        case 'Active':
            return 'bg-green-50 text-green-700 ring-1 ring-green-600/20';
        case 'Boarding':
            return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
        case 'Departed':
            return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/10';
        default:
            return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
    }
}

export function getStatusDotColor(statusLabel: string) {
    switch (statusLabel) {
        case 'Active':
            return 'bg-green-500 shadow-green-500/50';
        case 'Boarding':
            return 'bg-amber-500 shadow-amber-500/50';
        case 'Departed':
            return 'bg-gray-500 shadow-gray-500/50';
        default:
            return 'bg-blue-500 shadow-blue-500/50';
    }
}

export function calculatePriceTrend(flight: Flight) {
    const baseFare = flight.priceBreakdown.baseFare.units + (flight.priceBreakdown.baseFare.nanos / 1000000000);
    const total = flight.priceBreakdown.total.units + (flight.priceBreakdown.total.nanos / 1000000000);
    const priceDiff = ((total - baseFare) / baseFare) * 100;

    if (Math.abs(priceDiff) < 0.1) {
        return { trend: 0, isIncrease: false };
    }

    return {
        trend: Math.abs(priceDiff),
        isIncrease: priceDiff > 0
    };
}

export function formatCurrency(amount: number, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(amount);
}

export function formatPercentage(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(value / 100);
}

export function formatDate(date: Date | string) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(new Date(date));
}

export function formatTime(date: Date | string) {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(new Date(date));
} 