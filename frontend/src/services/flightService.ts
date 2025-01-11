import axios, { AxiosError } from 'axios';

const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const API_HOST = 'booking-com15.p.rapidapi.com';

const baseOptions = {
    headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST
    }
};

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to handle API calls with retry logic
async function handleRequestError(error: unknown, attempt: number, retries: number, backoff: number): Promise<never> {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('Request failed:', {
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            data: axiosError.response?.data
        });

        if (axiosError.response?.status === 401) {
            throw new Error('Unauthorized - Please check your API key');
        }

        if (axiosError.response?.status === 429) {
            console.log(`Rate limited, attempt ${attempt + 1} of ${retries}. Waiting ${backoff}ms...`);
            await delay(backoff);
            return Promise.reject(new Error('Rate limit exceeded'));
        }
    }

    if (attempt === retries - 1) throw error;
    await delay(backoff);
    return Promise.reject(error instanceof Error ? error : new Error('Request failed'));
}

async function axiosWithRetry<T>(url: string, params?: Record<string, string>, retries = 3, backoff = 1000): Promise<T> {
    const options = {
        method: 'GET',
        url,
        params,
        ...baseOptions
    };

    console.log('Making request with:', {
        url,
        params,
        headers: options.headers
    });

    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.request<T>(options);
            console.log('Response data:', response.data);
            return response.data;
        } catch (error) {
            await handleRequestError(error, i, retries, backoff);
            backoff *= 2;
        }
    }
    throw new Error('Max retries reached');
}

export const config = {
    api: {
        responseLimit: '8mb', // Increase response size limit
    },
};

export interface Airport {
    id: string;
    name: string;
    city: string;
    country: string;
    airportCode: string;
    coordinates?: {
        latitude: number;
        longitude: number;
        elevation?: number;  // in meters
    };
    timezone?: string;      // IANA timezone identifier
    terminals?: number;     // number of terminals
}

export interface FlightConfig {
    market: string;
    currency: string;
    locale: string;
}

export interface Flight {
    token: string;
    segments: Array<{
        departureAirport: {
            type: string;
            code: string;
            name: string;
            city: string;
            cityName: string;
            country: string;
            countryName: string;
            province?: string;
            provinceCode?: string;
        };
        arrivalAirport: {
            type: string;
            code: string;
            name: string;
            city: string;
            cityName: string;
            country: string;
            countryName: string;
            province?: string;
            provinceCode?: string;
        };
        departureTime: string;
        arrivalTime: string;
        legs: Array<{
            departureTime: string;
            arrivalTime: string;
            departureAirport: {
                type: string;
                code: string;
                name: string;
                city: string;
                cityName: string;
                country: string;
                countryName: string;
                province?: string;
                provinceCode?: string;
            };
            arrivalAirport: {
                type: string;
                code: string;
                name: string;
                city: string;
                cityName: string;
                country: string;
                countryName: string;
                province?: string;
                provinceCode?: string;
            };
            cabinClass: string;
            flightInfo: {
                flightNumber: number;
                planeType: string;
                carrierInfo: {
                    operatingCarrier: string;
                    marketingCarrier: string;
                };
            };
            carriersData: Array<{
                name: string;
                code: string;
                logo: string;
            }>;
        }>;
        totalTime: number;
        travellerCheckedLuggage?: Array<{
            travellerReference: string;
            luggageAllowance: {
                luggageType: 'CHECKED_IN' | 'HAND';
                maxPiece: number;
                maxWeightPerPiece?: number;
                massUnit?: string;
            };
        }>;
        travellerCabinLuggage?: Array<{
            travellerReference: string;
            luggageAllowance: {
                luggageType: 'CHECKED_IN' | 'HAND';
                maxPiece: number;
                maxWeightPerPiece?: number;
                massUnit?: string;
                sizeRestrictions?: {
                    maxLength: number;
                    maxWidth: number;
                    maxHeight: number;
                    sizeUnit: string;
                };
            };
            personalItem?: boolean;
        }>;
    }>;
    priceBreakdown: {
        total: {
            currencyCode: string;
            units: number;
            nanos: number;
        };
        baseFare: {
            currencyCode: string;
            units: number;
            nanos: number;
        };
        fee: {
            currencyCode: string;
            units: number;
            nanos: number;
        };
    };
    brandedFareInfo?: {
        fareName: string;
        cabinClass: string;
    };
    isAtolProtected: boolean;
    isVirtualInterlining: boolean;
}

interface FlightSearchResponse {
    status: boolean;
    message?: Array<{
        departDate?: string;
        [key: string]: string | undefined;
    }>;
    data: {
        flightOffers?: Array<Flight>;
        searchId?: string;
        aggregation?: {
            totalCount: number;
            filteredTotalCount: number;
        };
        baggagePolicies?: Array<{
            code: string;
            name: string;
            url: string;
        }>;
        error?: {
            code: string;
            requestId: string;
        };
    };
}

interface FlightSearchOptions {
    fromId: string;
    toId: string;
    departDate: string;
    page?: number;
    pageSize?: number;
    adults?: string;
    children?: string;
    cabinClass?: string;
}

export const flightService = {
    getConfig: async (): Promise<FlightConfig> => {
        return {
            market: 'US',
            currency: 'USD',
            locale: 'en-us'
        };
    },

    searchAirports: async (query: string): Promise<Airport[]> => {
        try {
            const params = {
                query: encodeURIComponent(query)
            };

            const data = await axiosWithRetry<{
                status: boolean;
                message: string;
                data: Array<{
                    id: string;
                    type: string;
                    name: string;
                    code: string;
                    city: string;
                    cityName: string;
                    country: string;
                    countryName: string;
                }>;
            }>(
                'https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination',
                params
            );

            // Filter to only include airports (not cities)
            return data.data
                .filter(item => item.type === 'AIRPORT')
                .map(item => ({
                    id: item.code,
                    name: item.name,
                    city: item.cityName,
                    country: item.countryName,
                    airportCode: item.code
                }));
        } catch (error) {
            console.error('Error searching airports:', error);
            return [];
        }
    },

    searchFlights: async (options: FlightSearchOptions): Promise<{ flights: Flight[], totalCount: number }> => {
        try {
            const {
                fromId,
                toId,
                departDate,
                page = 1,
                pageSize = 25,
                adults = '1',
                children = '0',
                cabinClass = 'ECONOMY'
            } = options;

            const formattedDate = new Date(departDate).toISOString().split('T')[0];

            const params = {
                fromId: `${fromId}.AIRPORT`,
                toId: `${toId}.AIRPORT`,
                departDate: formattedDate,
                pageNo: page.toString(),
                adults,
                children,
                sort: 'BEST',
                cabinClass,
                currency_code: 'USD',
                pageSize: pageSize.toString(),
                limit: pageSize.toString(),
                offset: ((page - 1) * pageSize).toString(),
                maxResults: pageSize.toString()
            };

            const response = await axiosWithRetry<FlightSearchResponse>(
                'https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights',
                params,
                5, // Increase retries
                2000 // Increase backoff time for larger responses
            );

            console.log('Full API Response:', response);
            console.log('Data level:', response.data);

            // Check if there's an error in the response data
            if (response.data?.error?.code === 'SEARCH_SEARCHFLIGHTS_NO_FLIGHTS_FOUND') {
                return { flights: [], totalCount: 0 };
            }

            // Check for flight offers
            const flights = response.data?.flightOffers || [];
            const totalCount = response.data?.aggregation?.totalCount ?? 0;
            console.log('Parsed flights:', flights);

            return { flights, totalCount };
        } catch (error) {
            console.error('Error searching flights:', error);
            throw error;
        }
    }
}; 