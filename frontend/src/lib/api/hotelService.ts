import axios from 'axios';
import { HotelSearchParams, HotelSearchResponse } from '../../types/hotelSearch';
import { HotelDetailsResponse } from '../../types/hotelDetails';

const BASE_URL = 'https://booking-com15.p.rapidapi.com/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
    }
});

export const hotelService = {
    searchDestination: async (query: string) => {
        try {
            const response = await api.get('/hotels/searchDestination', {
                params: { query }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching destinations:', error);
            throw error;
        }
    },

    searchHotels: async (params: HotelSearchParams): Promise<HotelSearchResponse> => {
        try {
            // Ensure page_number is a string and has a default value
            const pageNumber = params.page_number ? String(params.page_number) : '1';
            const pageSize = '12'; // Fixed page size

            const searchParams = {
                ...params,
                page_number: pageNumber,
                limit: pageSize,
                offset: ((parseInt(pageNumber) - 1) * parseInt(pageSize)).toString(),
                maxResults: pageSize
            };

            console.log('Searching hotels with params:', searchParams);

            const response = await api.get('/hotels/searchHotels', { params: searchParams });
            console.log('Hotel search response:', response.data);

            return response.data;
        } catch (error) {
            console.error('Error searching hotels:', error);
            throw error;
        }
    },

    getHotelDetails: async (hotelId: string, params: Omit<HotelSearchParams, 'dest_id' | 'search_type'>): Promise<HotelDetailsResponse> => {
        try {
            const response = await api.get('/hotels/getHotelDetails', {
                params: {
                    hotel_id: hotelId,
                    ...params
                }
            });
            return {
                status: response.data.status,
                message: response.data.message,
                data: response.data.data
            };
        } catch (error) {
            console.error('Error getting hotel details:', error);
            throw error;
        }
    },

    getHotelPhotos: async (hotelId: string) => {
        try {
            const response = await api.get('/hotels/getHotelPhotos', {
                params: { hotel_id: hotelId }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting hotel photos:', error);
            throw error;
        }
    },

    getHotelReviews: async (hotelId: string, languagecode: string = 'en-us') => {
        try {
            const response = await api.get('/hotels/getHotelReviewScores', {
                params: {
                    hotel_id: hotelId,
                    languagecode
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting hotel reviews:', error);
            throw error;
        }
    },

    getRoomList: async (hotelId: string, params: Omit<HotelSearchParams, 'dest_id' | 'search_type'>) => {
        try {
            const response = await api.get('/hotels/getRoomList', {
                params: {
                    hotel_id: hotelId,
                    ...params
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting room list:', error);
            throw error;
        }
    },

    getHotelPolicies: async (hotelId: string, languagecode: string = 'en-us') => {
        try {
            const response = await api.get('/hotels/getHotelPolicies', {
                params: {
                    hotel_id: hotelId,
                    languagecode
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting hotel policies:', error);
            throw error;
        }
    },

    async searchNearbyDestinations(latitude: number, longitude: number) {
        try {
            // First get the address from coordinates using OpenStreetMap
            const cityResponse = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const cityData = await cityResponse.json();

            if (cityData.address) {
                // Get the most specific location name
                const locationName = cityData.address.city ||
                    cityData.address.town ||
                    cityData.address.village ||
                    cityData.address.county ||
                    cityData.address.state;

                if (locationName) {
                    // Search for destinations using the city/town name
                    const response = await this.searchDestination(locationName);
                    return response;
                }
            }

            return {
                status: false,
                data: []
            };
        } catch (error) {
            console.error('Error searching nearby destinations:', error);
            return {
                status: false,
                data: []
            };
        }
    }
}; 