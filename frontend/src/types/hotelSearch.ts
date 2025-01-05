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

export interface HotelSearchResponse {
    status: boolean;
    message?: string;
    timestamp?: number;
    data?: {
        hotels: HotelSearchResult[];
        meta?: {
            total_count?: number;
            page_count?: number;
            current_page?: number;
        }[];
    };
}

export interface HotelSearchResult {
    hotel_id: number;
    accessibilityLabel: string;
    property: HotelSearchProperty;
}

export interface HotelSearchProperty {
    id: number;
    name: string;
    reviewScore: number;
    reviewCount: number;
    reviewScoreWord: string;
    propertyClass: number;
    accuratePropertyClass: number;
    isPreferred?: boolean;
    isPreferredPlus?: boolean;
    qualityClass: number;
    rankingPosition: number;
    position: number;
    isFirstPage: boolean;
    checkin: {
        fromTime: string;
        untilTime: string;
    };
    checkout: {
        fromTime: string;
        untilTime: string;
    };
    checkinDate: string;
    checkoutDate: string;
    latitude: number;
    longitude: number;
    currency: string;
    countryCode: string;
    photoUrls: string[];
    priceBreakdown: {
        grossPrice: {
            value: number;
            currency: string;
        };
        strikethroughPrice?: {
            value: number;
            currency: string;
        };
        excludedPrice?: {
            value: number;
            currency: string;
        };
        benefitBadges: Array<{
            identifier: string;
            text: string;
            explanation: string;
            variant: string;
        }>;
        taxExceptions: Array<{
            name: string;
            value: number;
            currency: string;
        }>;
    };
    location?: {
        address: string;
        city: string;
        country: string;
    };
} 