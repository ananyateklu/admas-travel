export interface CarSearchParams {
    pick_up_latitude: string;
    pick_up_longitude: string;
    drop_off_latitude: string;
    drop_off_longitude: string;
    pick_up_date: string;
    drop_off_date: string;
    pick_up_time: string;
    drop_off_time: string;
    driver_age: string;
    currency_code: string;
    units?: string;
    languagecode?: string;
}

export interface CarSearchResult {
    vehicle_id: string;
    search_key: string;
    vehicle_info: {
        name: string;
        type: string;
        category: string;
        transmission: string;
        seats: number;
        doors: number;
        luggage: {
            large: number;
            small: number;
        };
        features: string[];
        image_url: string;
    };
    pricing: {
        total_price: {
            amount: number;
            currency: string;
        };
        base_price: {
            amount: number;
            currency: string;
        };
        included_features: string[];
        additional_fees: Array<{
            name: string;
            amount: number;
            currency: string;
        }>;
    };
    supplier: {
        name: string;
        rating: number;
        review_count: number;
        location: {
            address: string;
            city: string;
            country: string;
            coordinates: {
                latitude: number;
                longitude: number;
            };
        };
    };
    availability: {
        status: string;
        pickup_location: {
            name: string;
            address: string;
            coordinates: {
                latitude: number;
                longitude: number;
            };
        };
        dropoff_location: {
            name: string;
            address: string;
            coordinates: {
                latitude: number;
                longitude: number;
            };
        };
        pickup_time: string;
        dropoff_time: string;
    };
}

export interface CarSearchResponse {
    status: boolean;
    data: {
        vehicles: CarSearchResult[];
        search_key: string;
    };
}

export interface LocationSearchResult {
    dest_id: string;
    name: string;
    type: string;
    latitude: string;
    longitude: string;
    city: string;
    country: string;
    address: string;
} 