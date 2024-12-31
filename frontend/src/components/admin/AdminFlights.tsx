import { useState, useEffect } from 'react';
import { AirportSearchInput } from '../AirportSearchInput';
import { flightService, Airport, Flight, FlightConfig } from '../../services/flightService';

export function AdminFlights() {
    const [config, setConfig] = useState<FlightConfig>({
        market: 'US',
        currency: 'USD',
        locale: 'en-US'
    });
    const [fromAirport, setFromAirport] = useState<Airport | null>(null);
    const [toAirport, setToAirport] = useState<Airport | null>(null);
    const [departureDate, setDepartureDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [flights, setFlights] = useState<Flight[]>([]);

    useEffect(() => {
        const fetchConfig = async () => {
            const config = await flightService.getConfig();
            setConfig(config);
        };

        fetchConfig();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fromAirport || !toAirport || !departureDate) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const results = await flightService.searchFlights(
                fromAirport.id,
                toAirport.id,
                departureDate
            );
            setFlights(results);
        } catch (err) {
            setError('Failed to fetch flights. Please try again.');
            console.error('Error fetching flights:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Get minimum date (today)
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <div className="space-y-6">
            {/* Search Form */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Search Flights</h3>
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <AirportSearchInput
                        label="From"
                        id="from"
                        value={fromAirport?.name ?? ''}
                        onChange={setFromAirport}
                        required
                    />
                    <AirportSearchInput
                        label="To"
                        id="to"
                        value={toAirport?.name ?? ''}
                        onChange={setToAirport}
                        required
                    />
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Departure Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                            min={getMinDate()}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                            required
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Searching...' : 'Search Flights'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
                        {error}
                    </div>
                )}

                {flights.length > 0 ? (
                    <div className="space-y-4">
                        {flights.map((flight) => (
                            <div
                                key={flight.token}
                                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {flight.segments[0]?.legs[0]?.carriersData[0]?.name} - {flight.segments[0]?.legs[0]?.flightInfo.flightNumber}
                                        </h3>
                                        <div className="mt-2 flex items-center gap-8">
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {flight.segments[0]?.departureTime}
                                                </p>
                                                <p className="text-sm text-gray-500">{fromAirport?.city}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">Duration:</span>
                                                {Math.floor(flight.segments[0]?.totalTime / 3600)}h {Math.floor((flight.segments[0]?.totalTime % 3600) / 60)}m
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">Arrival:</span>
                                                {flight.segments[0]?.arrivalTime}
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">Stops:</span>
                                                {flight.segments[0]?.legs.length - 1}
                                            </div>
                                            <div className="text-lg font-bold text-blue-600">
                                                {config.currency} {flight.priceBreakdown.total.units}.{String(flight.priceBreakdown.total.nanos).slice(0, 2)}
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <span className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                                {flight.segments[0]?.legs[0]?.cabinClass || 'ECONOMY'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-gray-900">
                                            {config.currency} {flight.priceBreakdown.total.units}.{String(flight.priceBreakdown.total.nanos).slice(0, 2)}
                                        </p>
                                        <div className="mt-2 space-x-2">
                                            <button className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !isLoading && (
                        <div className="text-center text-gray-500 py-12">
                            Search for flights to see results
                        </div>
                    )
                )}
            </div>
        </div>
    );
} 