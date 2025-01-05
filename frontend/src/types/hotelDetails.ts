// Shared booking type
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

// Types for the hotel details page
export interface HotelDetailsResponse {
    status: boolean;
    message?: string;
    data?: {
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
            [key: string]: HotelRoomDetails;
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
                amount_rounded: string;
                amount_unrounded: string;
            };
            items: Array<{
                inclusion_type: string;
                kind: string;
                name: string;
                details: string;
                item_amount: {
                    value: number;
                    currency: string;
                    amount_rounded: string;
                    amount_unrounded: string;
                };
                base: {
                    kind: string;
                    percentage: number;
                };
            }>;
        };
    };
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
    city: string;
    photoUrls: string[];
    location: {
        address: string;
        city: string;
        country: string;
    };
    priceBreakdown: {
        grossPrice: {
            value: number;
            currency: string;
            amount_rounded: string;
            amount_unrounded: string;
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

export interface HotelDetails {
    hotel_id: number;
    accessibilityLabel: string;
    property: HotelProperty;
    rooms: {
        [key: string]: HotelRoomDetails & {
            id: string;
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
        };
    };
    facilities: string[];
    policies: Array<{
        name: string;
        description: string;
    }>;
    reviews: Array<{
        score: number;
        title?: string;
        text: string;
        author: string;
        date: string;
    }>;
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
            amount_rounded: string;
            amount_unrounded: string;
        };
        items: Array<{
            inclusion_type: string;
            kind: string;
            name: string;
            details: string;
            item_amount: {
                value: number;
                currency: string;
                amount_rounded: string;
                amount_unrounded: string;
            };
            base: {
                kind: string;
                percentage: number;
            };
        }>;
    };
}

export interface HotelRoomDetails {
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
} 