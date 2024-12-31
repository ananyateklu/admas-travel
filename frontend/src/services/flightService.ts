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
    }>;
    priceBreakdown: {
        total: {
            currencyCode: string;
            units: number;
            nanos: number;
        };
    };
    brandedFareInfo: {
        fareName: string;
        cabinClass: string;
    };
}

interface FlightSearchResponse {
    status: boolean;
    message?: Array<{
        departDate?: string;
        [key: string]: string | undefined;
    }>;
    data: {
        flightOffers: Array<Flight>;
        searchId: string;
        aggregation: {
            totalCount: number;
            filteredTotalCount: number;
        };
        baggagePolicies: Array<{
            code: string;
            name: string;
            url: string;
        }>;
    };
}

interface AirportSearchResponse {
    data: Array<{
        id?: string;
        name?: string;
        city?: string;
        country?: string;
        code?: string;
    }>;
    status: boolean;
    message: string;
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
                query: encodeURIComponent(query),
                languagecode: 'en-us'
            };

            const data = await axiosWithRetry<AirportSearchResponse>(
                'https://booking-com15.p.rapidapi.com/api/v1/flights/searchAirport',
                params
            );

            return data.data.map(item => ({
                id: item.id ?? '',
                name: item.name ?? '',
                city: item.city ?? '',
                country: item.country ?? '',
                airportCode: item.code ?? ''
            }));
        } catch (error) {
            console.error('Error searching airports:', error);
            return [];
        }
    },

    searchFlights: async (
        fromId: string,
        toId: string,
        departDate: string,
        adults: string = '1',
        children: string = '0',
        cabinClass: string = 'ECONOMY'
    ): Promise<Flight[]> => {
        try {
            const formattedDate = new Date(departDate).toISOString().split('T')[0];

            const params = {
                fromId: `${fromId}.AIRPORT`,
                toId: `${toId}.AIRPORT`,
                departDate: formattedDate,
                pageNo: '1',
                adults,
                children,
                sort: 'BEST',
                cabinClass,
                currency_code: 'USD'
            };

            const response = await axiosWithRetry<FlightSearchResponse>(
                'https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights',
                params
            );

            console.log('Full API Response:', response);
            console.log('Data level:', response.data);
            console.log('Flight offers:', response.data?.flightOffers);

            if (!response.status) {
                const errorMessage = response.message?.[0]?.departDate ?? 'Failed to search flights';
                throw new Error(errorMessage);
            }

            const flights = response.data?.flightOffers || [];
            console.log('Parsed flights:', flights);

            return flights;
        } catch (error) {
            console.error('Error searching flights:', error);
            throw error;
        }
    }
}; 