import axios from 'axios';
import { HotelSearchParams, HotelSearchResponse, HotelDetailsResponse } from '../../types/hotelTypes';

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
            const response = await api.get('/hotels/searchHotels', { params });
            return response.data;
        } catch (error) {
            console.error('Error searching hotels:', error);
            throw error;
        }
    },

    getHotelDetails: async (hotelId: string, params: Omit<HotelSearchParams, 'dest_id' | 'search_type'>): Promise<{ status: boolean; data: HotelDetailsResponse }> => {
        try {
            const response = await api.get('/hotels/getHotelDetails', {
                params: {
                    hotel_id: hotelId,
                    ...params
                }
            });
            return response.data;
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
    }
}; 