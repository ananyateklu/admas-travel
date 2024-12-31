export interface LuggageAllowance {
    luggageType: 'CHECKED_IN' | 'HAND';
    ruleType?: 'PIECE_BASED';
    maxPiece: number;
    maxWeightPerPiece?: number;
    massUnit?: string;
    sizeRestrictions?: {
        maxLength: number;
        maxWidth: number;
        maxHeight: number;
        sizeUnit: string;
    };
}

export interface TravellerLuggage {
    travellerReference: string;
    luggageAllowance: LuggageAllowance;
    personalItem?: boolean;
}

export interface FlightSegment {
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
    totalTime: number;
    legs: Array<{
        flightInfo: {
            flightNumber: number;
            planeType?: string;
        };
        carriersData: Array<{
            code: string;
            name: string;
            logo?: string;
        }>;
        cabinClass: string;
        amenities?: Array<{
            category: string;
            type?: string;
            cost?: string;
        }>;
    }>;
    travellerCheckedLuggage?: TravellerLuggage[];
    travellerCabinLuggage?: TravellerLuggage[];
    showWarningOriginAirport?: boolean;
    showWarningDestinationAirport?: boolean;
}

export interface Flight {
    token: string;
    segments: FlightSegment[];
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
        fee?: {
            currencyCode: string;
            units: number;
            nanos: number;
        };
        tax?: {
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