import { AirportSearchInput } from '../AirportSearchInput';
import { Airport } from '../../services/flightService';

interface FlightDetailsProps {
    from: Airport | null;
    to: Airport | null;
    departureDate: string;
    returnDate?: string;
    isRoundTrip: boolean;
    onFromChange: (airport: Airport | null) => void;
    onToChange: (airport: Airport | null) => void;
    onDepartureDateChange: (date: string) => void;
    onReturnDateChange: (date: string) => void;
    errors?: Record<string, string>;
}

export function FlightDetails({
    from,
    to,
    departureDate,
    returnDate,
    isRoundTrip,
    onFromChange,
    onToChange,
    onDepartureDateChange,
    onReturnDateChange,
    errors = {}
}: FlightDetailsProps) {
    // Get minimum date (today)
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Get minimum return date (departure date)
    const getMinReturnDate = () => {
        return departureDate || getMinDate();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    From
                </label>
                <label className="block text-xs text-gray-400 mb-0.5">Departure Airport</label>
                <div className="relative">
                    <AirportSearchInput
                        label=""
                        id="from"
                        value={from?.name ?? ''}
                        onChange={onFromChange}
                        required
                        type="departure"
                        className={errors.from ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
                    />
                    {errors.from && (
                        <p className="mt-1 text-xs text-red-600">{errors.from}</p>
                    )}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                </label>
                <label className="block text-xs text-gray-400 mb-0.5">Arrival Airport</label>
                <div className="relative">
                    <AirportSearchInput
                        label=""
                        id="to"
                        value={to?.name ?? ''}
                        onChange={onToChange}
                        required
                        type="arrival"
                        className={errors.to ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
                    />
                    {errors.to && (
                        <p className="mt-1 text-xs text-red-600">{errors.to}</p>
                    )}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departure
                </label>
                <label className="block text-xs text-gray-400 mb-0.5">Travel Date</label>
                <div className="relative">
                    <input
                        type="date"
                        value={departureDate}
                        onChange={(e) => onDepartureDateChange(e.target.value)}
                        min={getMinDate()}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent
                            ${errors.departureDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                        required
                    />
                    {errors.departureDate && (
                        <p className="mt-1 text-xs text-red-600">{errors.departureDate}</p>
                    )}
                </div>
            </div>
            {isRoundTrip && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Return
                    </label>
                    <label className="block text-xs text-gray-400 mb-0.5">Travel Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={returnDate}
                            onChange={(e) => onReturnDateChange(e.target.value)}
                            min={getMinReturnDate()}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent
                                ${errors.returnDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                            required
                        />
                        {errors.returnDate && (
                            <p className="mt-1 text-xs text-red-600">{errors.returnDate}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 