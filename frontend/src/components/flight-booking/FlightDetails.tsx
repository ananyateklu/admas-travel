import { AirportSearchInput } from '../AirportSearchInput';
import { Airport } from '../../services/flightService';

interface FlightDetailsProps {
    from: Airport | null;
    to: Airport | null;
    departureDate: string;
    departureTime: string;
    returnDate?: string;
    returnTime?: string;
    isRoundTrip: boolean;
    onFromChange: (airport: Airport | null) => void;
    onToChange: (airport: Airport | null) => void;
    onDepartureDateChange: (date: string) => void;
    onDepartureTimeChange: (time: string) => void;
    onReturnDateChange: (date: string) => void;
    onReturnTimeChange: (time: string) => void;
    errors?: Record<string, string>;
}

export function FlightDetails({
    from,
    to,
    departureDate,
    departureTime,
    returnDate,
    returnTime,
    isRoundTrip,
    onFromChange,
    onToChange,
    onDepartureDateChange,
    onDepartureTimeChange,
    onReturnDateChange,
    onReturnTimeChange,
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
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-5 gap-4">
                    <div className="col-span-3">
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">Departure Date</label>
                        <input
                            type="date"
                            value={departureDate}
                            onChange={(e) => onDepartureDateChange(e.target.value)}
                            min={getMinDate()}
                            className="w-full px-3 py-1.5 text-xs border rounded-lg border-gray-300 hover:border-forest-400 focus:ring-1 focus:ring-forest-400/30 focus:border-forest-400 focus:outline-none transition-colors"
                            required
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">Time</label>
                        <input
                            type="time"
                            value={departureTime}
                            onChange={(e) => onDepartureTimeChange(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border rounded-lg border-gray-300 hover:border-forest-400 focus:ring-1 focus:ring-forest-400/30 focus:border-forest-400 focus:outline-none transition-colors"
                            required
                        />
                    </div>
                </div>

                {isRoundTrip && (
                    <div className="grid grid-cols-5 gap-4">
                        <div className="col-span-3">
                            <label className="block text-[10px] font-medium text-gray-600 mb-1">Return Date</label>
                            <input
                                type="date"
                                value={returnDate}
                                onChange={(e) => onReturnDateChange(e.target.value)}
                                min={getMinReturnDate()}
                                className="w-full px-3 py-1.5 text-xs border rounded-lg border-gray-300 hover:border-forest-400 focus:ring-1 focus:ring-forest-400/30 focus:border-forest-400 focus:outline-none transition-colors"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[10px] font-medium text-gray-600 mb-1">Time</label>
                            <input
                                type="time"
                                value={returnTime}
                                onChange={(e) => onReturnTimeChange(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs border rounded-lg border-gray-300 hover:border-forest-400 focus:ring-1 focus:ring-forest-400/30 focus:border-forest-400 focus:outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 