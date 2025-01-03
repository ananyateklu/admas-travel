export interface Flight {
    priceBreakdown: {
        baseFare: {
            units: number;
            nanos: number;
        };
        total: {
            units: number;
            nanos: number;
        };
    };
    segments: Array<{
        legs: Array<{
            carriersData: Array<{
                code: string;
                name: string;
                logo?: string;
            }>;
            flightInfo: {
                flightNumber: string;
            };
            arrivalTime: string;
        }>;
    }>;
} 