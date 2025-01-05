export interface HotelSearchParams {
    dest_id: string;
    search_type: string;
    adults?: string;
    children_age?: string;
    room_qty?: string;
    page_number?: string;
    units?: string;
    temperature_unit?: string;
    languagecode?: string;
    currency_code?: string;
    arrival_date?: string;
    departure_date?: string;
    limit?: string;
    offset?: string;
    maxResults?: string;
}

export interface HotelProperty {
    id: number;
    name: string;
    reviewScore: number;
    reviewCount: number;
    reviewScoreWord: string;
    propertyClass: number;
    accuratePropertyClass: number;
    latitude: number;
    longitude: number;
    currency: string;
    countryCode: string;
    city?: string;
    photoUrls: string[];
    location?: {
        address: string;
        city: string;
        country: string;
    };
    priceBreakdown: {
        grossPrice: {
            value: number;
            currency: string;
        };
        strikethroughPrice?: {
            value: number;
            currency: string;
        };
        benefitBadges: Array<{
            identifier: string;
            text: string;
            explanation: string;
            variant: string;
        }>;
    };
    checkin: {
        fromTime: string;
        untilTime: string;
    };
    checkout: {
        fromTime: string;
        untilTime: string;
    };
}

export interface HotelSearchResult {
    hotel_id: number;
    accessibilityLabel: string;
    property: HotelProperty;
}

export interface HotelSearchResponse {
    status: boolean;
    data?: {
        hotels: HotelSearchResult[];
        meta?: {
            total_count?: number;
            page_count?: number;
            current_page?: number;
        }[];
    };
}

export interface HotelDetails extends HotelSearchResult {
    rooms: HotelRoom[];
    policies: HotelPolicy[];
    reviews: HotelReview[];
    facilities: string[];
}

export interface HotelRoom {
    id: string;
    name: string;
    description: string;
    price: {
        amount: number;
        currency: string;
        per_night: boolean;
    };
    capacity: {
        adults: number;
        children: number;
    };
    amenities: string[];
    images: string[];
    availability: boolean;
}

export interface HotelPolicy {
    type: string;
    description: string;
}

export interface HotelReview {
    id: string;
    rating: number;
    comment: string;
    author: string;
    date: string;
}

export interface HotelBooking {
    id: string;
    hotelId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: {
        adults: number;
        children: number;
        childrenAges: number[];
    };
    totalPrice: {
        amount: number;
        currency: string;
    };
    status: 'pending' | 'confirmed' | 'cancelled';
    bookedAt: string;
}

export interface HotelDetailsResponse {
    hotel_id: number;
    hotel_name: string;
    review_nr: number;
    review_score: number;
    address: string;
    city: string;
    country_trans: string;
    latitude: number;
    longitude: number;
    hotel_include_breakfast: number;
    propertyClass: number;
    reviewScoreWord: string;
    rooms: {
        [key: string]: {
            room_name: string;
            photos: Array<{
                url_max1280: string;
                url_max750: string;
                url_max300: string;
                url_square60: string;
                photo_id: number;
            }>;
            facilities?: Array<{
                name: string;
                id: number;
                facilitytype_id: number;
                alt_facilitytype_id: number;
                alt_facilitytype_name: string;
            }>;
            mealplan?: string;
            room_surface_in_m2?: number;
            max_occupancy?: string;
            nr_adults?: number;
            nr_children?: number;
            breakfast_included?: number;
        };
    };
    facilities_block: {
        facilities: Array<{
            name: string;
            icon: string;
        }>;
        name: string;
    };
    property_highlight_strip: Array<{
        name: string;
        icon_list: Array<{
            icon: string;
            size: number;
        }>;
    }>;
    composite_price_breakdown: {
        gross_amount: {
            value: number;
            currency: string;
        };
    };
} 