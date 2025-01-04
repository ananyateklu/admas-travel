import { StatusOption } from './types';

export const STATUS_OPTIONS: StatusOption[] = [
    {
        value: 'pending',
        label: 'Pending',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        className: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
        step: 1,
        colors: {
            active: 'border-amber-500 bg-amber-500 text-white',
            completed: 'border-amber-500 bg-amber-50 text-amber-600',
            connector: 'bg-amber-500',
            inactive: 'border-gray-200 bg-white text-gray-400 hover:border-amber-500 hover:text-amber-500',
            label: 'text-amber-600'
        }
    },
    {
        value: 'confirmed',
        label: 'Confirmed',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        className: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
        step: 2,
        colors: {
            active: 'border-blue-500 bg-blue-500 text-white',
            completed: 'border-blue-500 bg-blue-50 text-blue-600',
            connector: 'bg-blue-500',
            inactive: 'border-gray-200 bg-white text-gray-400 hover:border-blue-500 hover:text-blue-500',
            label: 'text-blue-600'
        }
    },
    {
        value: 'completed',
        label: 'Completed',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        className: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
        step: 3,
        colors: {
            active: 'border-emerald-500 bg-emerald-500 text-white',
            completed: 'border-emerald-500 bg-emerald-50 text-emerald-600',
            connector: 'bg-emerald-500',
            inactive: 'border-gray-200 bg-white text-gray-400 hover:border-emerald-500 hover:text-emerald-500',
            label: 'text-emerald-600'
        }
    },
    {
        value: 'cancelled',
        label: 'Cancelled',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        className: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100',
        step: 4,
        colors: {
            active: 'border-rose-500 bg-rose-500 text-white',
            completed: 'border-rose-500 bg-rose-50 text-rose-600',
            connector: 'bg-rose-500',
            inactive: 'border-gray-200 bg-white text-gray-400 hover:border-rose-500 hover:text-rose-500',
            label: 'text-rose-600'
        }
    }
]; 