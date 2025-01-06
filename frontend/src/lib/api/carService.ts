import axios from 'axios';
import { CarSearchParams, CarSearchResponse, LocationSearchResult } from '../../types/carSearch';

const BASE_URL = 'https://booking-com15.p.rapidapi.com/api/v1/cars';
const HEADERS = {
    'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
    'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
};

interface ApiLocationResponse {
    id?: string;
    name?: string;
    type?: string;
    coordinates?: {
        latitude?: string;
        longitude?: string;
    };
    city?: string;
    country?: string;
    address?: string;
}

interface ApiVehicleInfo {
    v_name?: string;
    name?: string;
    group?: string;
    type?: string;
    category?: string;
    transmission: string;
    seats: number;
    doors: number;
    suitcases?: {
        big?: string;
        small?: string;
    };
    aircon?: boolean;
    unlimited_mileage?: boolean;
    airbags?: boolean;
    free_cancellation?: boolean;
    image_url?: string;
    image_thumbnail_url?: string;
}

interface ApiPricingInfo {
    drive_away_price?: number;
    price?: number;
    currency: string;
    base_price?: number;
    fee_breakdown?: {
        known_fees?: Array<{
            type: string;
            amount: number;
            currency: string;
        }>;
    };
}

interface ApiSupplierInfo {
    name: string;
    address: string;
    country?: string;
    latitude: string;
    longitude: string;
}

interface ApiRatingInfo {
    average?: number;
    no_of_ratings?: number;
}

interface ApiRouteInfo {
    pickup: {
        name: string;
        address: string;
        latitude: string;
        longitude: string;
    };
    dropoff: {
        name: string;
        address: string;
        latitude: string;
        longitude: string;
    };
}

interface ApiVehicle {
    vehicle_id: string;
    vehicle_info: ApiVehicleInfo;
    pricing_info: ApiPricingInfo;
    supplier_info: ApiSupplierInfo;
    rating_info?: ApiRatingInfo;
    route_info: ApiRouteInfo;
}

interface ApiFilter {
    name: string;
    title_tag: string;
    identifier: string;
    options?: Array<{
        name: string;
        value: string;
        count?: number;
    }>;
}

interface ApiResponse {
    status: boolean;
    message: string;
    timestamp: number;
    data: {
        search_results: ApiVehicle[];
        search_key: string;
        sort: Array<{
            name: string;
            title_tag: string;
            identifier: string;
        }>;
        filter: Array<ApiFilter>;
        count: number;
        type: string;
    };
}

interface ApiVehicleDetailsResponse {
    status: boolean;
    data: {
        vehicle_details: {
            vehicle_info: ApiVehicleInfo;
            pricing_info: ApiPricingInfo;
            supplier_info: ApiSupplierInfo;
            rating_info?: ApiRatingInfo;
            route_info: ApiRouteInfo;
        };
    };
}

interface ApiBookingSummaryResponse {
    status: boolean;
    data: {
        booking_summary: {
            vehicle_info: ApiVehicleInfo;
            pricing_info: ApiPricingInfo;
            supplier_info: ApiSupplierInfo;
            route_info: ApiRouteInfo;
            cancellation_policy?: {
                description: string;
                deadline?: string;
            };
        };
    };
}

export interface ApiSupplierDetailsResponse {
    status: boolean;
    data: {
        supplier_details: {
            supplier_info: ApiSupplierInfo;
            rating_info?: ApiRatingInfo;
            policies?: {
                pickup: string[];
                general: string[];
            };
            opening_hours?: {
                pickup: string[];
                dropoff: string[];
            };
        };
    };
}

interface ApiErrorResponse {
    status: number;
    data: {
        message: string;
        errors?: Record<string, string[]>;
    };
}

interface BookCarParams {
    vehicle_id: string;
    search_key: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests?: string;
    userId: string;
    totalPrice: {
        amount: number;
        currency: string;
    };
}

interface BookCarResponse {
    status: boolean;
    message: string;
    data: {
        booking_id: string;
        confirmation_number: string;
        total_price: {
            amount: number;
            currency: string;
        };
    };
}

export interface ApiSupplierRatingsResponse {
    status: boolean;
    data: {
        ratings: {
            average: number;
            count: number;
            categories: {
                name: string;
                score: number;
            }[];
        } | null;
    };
}

export const carService = {
    searchDestination: async (query: string): Promise<{ status: boolean; data: LocationSearchResult[] }> => {
        try {
            const response = await axios.request({
                method: 'GET',
                url: `${BASE_URL}/searchDestination`,
                params: { query },
                headers: HEADERS
            });

            console.log('Raw location search response:', response.data);

            // Map the API response to our LocationSearchResult type
            if (response.data.status && Array.isArray(response.data.data)) {
                const mappedLocations = response.data.data.map((location: ApiLocationResponse) => ({
                    dest_id: location.id ?? '',
                    name: location.name ?? '',
                    type: location.type ?? '',
                    latitude: location.coordinates?.latitude ?? '',
                    longitude: location.coordinates?.longitude ?? '',
                    city: location.city ?? '',
                    country: location.country ?? '',
                    address: location.address ?? ''
                }));

                // Filter out locations with invalid coordinates
                const validLocations = mappedLocations.filter((location: LocationSearchResult) => {
                    const hasCoordinates = location.latitude && location.longitude;
                    console.log('Location coordinates after mapping:', {
                        name: location.name,
                        lat: location.latitude,
                        lng: location.longitude,
                        hasCoordinates
                    });
                    return hasCoordinates;
                });

                console.log(`Valid locations: ${validLocations.length} of ${mappedLocations.length}`);
                return { status: true, data: validLocations };
            }

            return { status: false, data: [] };
        } catch (error) {
            console.error('Error searching destination:', error);
            return { status: false, data: [] };
        }
    },

    searchCarRentals: async (params: CarSearchParams): Promise<CarSearchResponse> => {
        try {
            // Format dates to YYYY-MM-DD
            const formatDate = (date: Date) => {
                return date.toISOString().split('T')[0];
            };

            // Format times to HH:mm
            const formatTime = (date: Date) => {
                return date.toTimeString().slice(0, 5);
            };

            const formattedParams = {
                pick_up_latitude: params.pick_up_latitude,
                pick_up_longitude: params.pick_up_longitude,
                drop_off_latitude: params.drop_off_latitude,
                drop_off_longitude: params.drop_off_longitude,
                pick_up_date: formatDate(new Date(params.pick_up_time)),
                drop_off_date: formatDate(new Date(params.drop_off_time)),
                pick_up_time: formatTime(new Date(params.pick_up_time)),
                drop_off_time: formatTime(new Date(params.drop_off_time)),
                driver_age: params.driver_age,
                currency_code: params.currency_code ?? 'USD',
                units: params.units ?? 'metric',
                languagecode: params.languagecode ?? 'en-us'
            };

            console.log('Searching cars with params:', formattedParams);

            const response = await axios.request<ApiResponse>({
                method: 'GET',
                url: `${BASE_URL}/searchCarRentals`,
                params: formattedParams,
                headers: HEADERS
            });

            console.log('Raw API response:', response.data);

            // Check if we have a valid response structure
            if (!response.data?.status) {
                return {
                    status: false,
                    data: {
                        vehicles: [],
                        search_key: ''
                    }
                };
            }

            // If no search results, return empty array
            if (!response.data?.data?.search_results) {
                return {
                    status: true,
                    data: {
                        vehicles: [],
                        search_key: response.data?.data?.search_key || ''
                    }
                };
            }

            // Map the API response to our CarSearchResponse type
            const mappedResponse: CarSearchResponse = {
                status: true,
                data: {
                    vehicles: response.data.data.search_results.map((vehicle: ApiVehicle) => ({
                        vehicle_id: vehicle.vehicle_id,
                        search_key: response.data.data.search_key,
                        vehicle_info: {
                            name: vehicle.vehicle_info.v_name ?? vehicle.vehicle_info.name ?? 'Unknown Vehicle',
                            type: vehicle.vehicle_info.group ?? vehicle.vehicle_info.type ?? 'Standard',
                            category: vehicle.vehicle_info.category ?? 'Standard',
                            transmission: vehicle.vehicle_info.transmission ?? 'Automatic',
                            seats: vehicle.vehicle_info.seats ?? 4,
                            doors: vehicle.vehicle_info.doors ?? 4,
                            luggage: {
                                large: parseInt(vehicle.vehicle_info.suitcases?.big ?? '0'),
                                small: parseInt(vehicle.vehicle_info.suitcases?.small ?? '0')
                            },
                            features: [
                                vehicle.vehicle_info.aircon && 'Air Conditioning',
                                vehicle.vehicle_info.unlimited_mileage && 'Unlimited Mileage',
                                vehicle.vehicle_info.airbags && 'Airbags',
                                vehicle.vehicle_info.free_cancellation && 'Free Cancellation'
                            ].filter((feature): feature is string => Boolean(feature)),
                            image_url: vehicle.vehicle_info.image_url || vehicle.vehicle_info.image_thumbnail_url || ''
                        },
                        pricing: {
                            total_price: {
                                amount: vehicle.pricing_info.drive_away_price ?? vehicle.pricing_info.price ?? 0,
                                currency: vehicle.pricing_info.currency ?? 'USD'
                            },
                            base_price: {
                                amount: vehicle.pricing_info.base_price ?? vehicle.pricing_info.price ?? 0,
                                currency: vehicle.pricing_info.currency ?? 'USD'
                            },
                            included_features: [
                                vehicle.vehicle_info.unlimited_mileage && 'Unlimited Mileage',
                                vehicle.vehicle_info.free_cancellation && 'Free Cancellation',
                                vehicle.vehicle_info.aircon && 'Air Conditioning'
                            ].filter((feature): feature is string => Boolean(feature)),
                            additional_fees: (vehicle.pricing_info.fee_breakdown?.known_fees ?? []).map(fee => ({
                                name: fee.type,
                                amount: fee.amount,
                                currency: fee.currency ?? 'USD'
                            }))
                        },
                        supplier: {
                            name: vehicle.supplier_info.name,
                            rating: vehicle.rating_info?.average ?? 0,
                            review_count: vehicle.rating_info?.no_of_ratings ?? 0,
                            location: {
                                address: vehicle.supplier_info.address ?? '',
                                city: '',
                                country: vehicle.supplier_info.country ?? '',
                                coordinates: {
                                    latitude: parseFloat(vehicle.supplier_info.latitude ?? '0'),
                                    longitude: parseFloat(vehicle.supplier_info.longitude ?? '0')
                                }
                            }
                        },
                        availability: {
                            status: 'available',
                            pickup_location: {
                                name: vehicle.route_info.pickup.name ?? '',
                                address: vehicle.route_info.pickup.address ?? '',
                                coordinates: {
                                    latitude: parseFloat(vehicle.route_info.pickup.latitude ?? '0'),
                                    longitude: parseFloat(vehicle.route_info.pickup.longitude ?? '0')
                                }
                            },
                            dropoff_location: {
                                name: vehicle.route_info.dropoff.name ?? '',
                                address: vehicle.route_info.dropoff.address ?? '',
                                coordinates: {
                                    latitude: parseFloat(vehicle.route_info.dropoff.latitude ?? '0'),
                                    longitude: parseFloat(vehicle.route_info.dropoff.longitude ?? '0')
                                }
                            },
                            pickup_time: params.pick_up_time,
                            dropoff_time: params.drop_off_time
                        }
                    })),
                    search_key: response.data.data.search_key
                }
            };

            console.log('Mapped response:', mappedResponse);
            return mappedResponse;
        } catch (error: unknown) {
            console.error('Error searching cars:', error);

            // Type guard for axios error with our API error response
            if (axios.isAxiosError(error) && error.response?.data) {
                const apiError = error.response.data as ApiErrorResponse['data'];
                throw new Error(apiError.message ?? 'An error occurred while searching for cars');
            }

            // Generic error handling
            throw new Error(error instanceof Error ? error.message : 'An error occurred while searching for cars');
        }
    },

    getVehicleDetails: async (
        vehicle_id: string,
        search_key: string,
        currency_code: string
    ): Promise<ApiVehicleDetailsResponse> => {
        try {
            const response = await axios.request<ApiVehicleDetailsResponse>({
                method: 'GET',
                url: `${BASE_URL}/vehicleDetails`,
                params: {
                    vehicle_id,
                    search_key,
                    currency_code,
                    units: 'metric',
                    languagecode: 'en-us'
                },
                headers: HEADERS
            });
            return response.data;
        } catch (error) {
            console.error('Error getting vehicle details:', error);
            throw new Error('Failed to fetch vehicle details');
        }
    },

    getBookingSummary: async (
        vehicle_id: string,
        search_key: string,
        currency_code: string
    ): Promise<ApiBookingSummaryResponse> => {
        try {
            const response = await axios.request<ApiBookingSummaryResponse>({
                method: 'GET',
                url: `${BASE_URL}/bookingSummary`,
                params: {
                    vehicle_id,
                    search_key,
                    currency_code
                },
                headers: HEADERS
            });
            return response.data;
        } catch (error) {
            console.error('Error getting booking summary:', error);
            throw new Error('Failed to fetch booking summary');
        }
    },

    getVehicleSupplierDetails: async (
        vehicle_id: string,
        search_key: string,
        currency_code: string
    ): Promise<ApiSupplierDetailsResponse> => {
        try {
            const response = await axios.request<ApiSupplierDetailsResponse>({
                method: 'GET',
                url: `${BASE_URL}/vehicleSupplierDetails`,
                params: {
                    vehicle_id,
                    search_key,
                    currency_code
                },
                headers: HEADERS
            });
            return response.data;
        } catch (error) {
            console.error('Error getting supplier details:', error);
            throw new Error('Failed to fetch supplier details');
        }
    },

    getVehicleSupplierRatings: async (
        vehicle_id: string,
        search_key: string,
        currency_code: string
    ): Promise<ApiSupplierRatingsResponse> => {
        try {
            const response = await axios.request<ApiSupplierRatingsResponse>({
                method: 'GET',
                url: `${BASE_URL}/vehicleSupplierRatings`,
                params: {
                    vehicle_id,
                    search_key,
                    currency_code
                },
                headers: HEADERS
            });
            return response.data;
        } catch (error) {
            console.error('Error getting supplier ratings:', error);
            return { status: false, data: { ratings: null } };
        }
    },

    bookCar: async (params: BookCarParams): Promise<BookCarResponse> => {
        try {
            // Generate booking reference
            const prefix = 'ADMAS';
            const year = new Date().getFullYear().toString().slice(-2);
            const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
            const random = Math.random().toString(36).substring(2, 5).toUpperCase();
            const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const bookingReference = `${prefix}-${year}${month}-${random}${sequence}`;

            // Create booking data
            const bookingData = {
                ...params,
                bookingReference,
                status: 'pending',
                createdAt: new Date().toISOString(),
                type: 'car'
            };

            // Save to Firebase
            const { db } = await import('../firebase');
            const { addDoc, collection, doc, setDoc } = await import('firebase/firestore');

            // Create booking document
            const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);

            // Add booking to user's bookings subcollection
            await setDoc(doc(db, 'users', params.userId, 'bookings', bookingRef.id), bookingData);

            return {
                status: true,
                message: 'Booking created successfully',
                data: {
                    booking_id: bookingRef.id,
                    confirmation_number: bookingReference,
                    total_price: {
                        amount: params.totalPrice.amount,
                        currency: params.totalPrice.currency
                    }
                }
            };
        } catch (error) {
            console.error('Error booking car:', error);
            throw new Error('Failed to book car');
        }
    }
}; 