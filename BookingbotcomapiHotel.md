# Booking.com API Documentation

This document outlines all available endpoints for the Booking.com API integration.

## Base Configuration

```javascript
const BASE_URL = 'https://booking-com15.p.rapidapi.com/api/v1';
const HEADERS = {
  'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY',
  'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
};

// Example API call structure
const options = {
  method: 'GET',
  url: `${BASE_URL}/endpoint`,
  params: {
    // endpoint specific parameters
  },
  headers: HEADERS
};
```

## API Endpoints

### Search & Discovery

#### 1. Search Destination
Searches for destinations based on a query string.

```javascript
GET /hotels/searchDestination
Params: {
  query: string // e.g. 'man'
}

// Example usage
const options = {
  method: 'GET',
  url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination',
  params: {query: 'man'},
  headers: HEADERS
};
```

#### 2. Search Hotels
Search for hotels in a specific destination.

```javascript
GET /hotels/searchHotels
Params: {
  dest_id: string,          // e.g. '-2092174'
  search_type: string,      // e.g. 'CITY'
  adults: string,           // e.g. '1'
  children_age: string,     // e.g. '0,17'
  room_qty: string,         // e.g. '1'
  page_number: string,      // e.g. '1'
  units: string,            // e.g. 'metric'
  temperature_unit: string, // e.g. 'c'
  languagecode: string,     // e.g. 'en-us'
  currency_code: string     // e.g. 'AED'
}
```

#### 3. Search Hotels by Coordinates
Search for hotels based on geographical coordinates.

```javascript
GET /hotels/searchHotelsByCoordinates
Params: {
  latitude: string,         // e.g. '19.24232736426361'
  longitude: string,        // e.g. '72.85841985686734'
  adults: string,           // e.g. '1'
  children_age: string,     // e.g. '0,17'
  room_qty: string,         // e.g. '1'
  units: string,            // e.g. 'metric'
  page_number: string,      // e.g. '1'
  temperature_unit: string, // e.g. 'c'
  languagecode: string,     // e.g. 'en-us'
  currency_code: string     // e.g. 'EUR'
}
```

### Hotel Details

#### 1. Get Hotel Details
Retrieve detailed information about a specific hotel.

```javascript
GET /hotels/getHotelDetails
Params: {
  hotel_id: string,         // e.g. '191605'
  adults: string,           // e.g. '1'
  children_age: string,     // e.g. '1,17'
  room_qty: string,         // e.g. '1'
  units: string,            // e.g. 'metric'
  temperature_unit: string, // e.g. 'c'
  languagecode: string,     // e.g. 'en-us'
  currency_code: string     // e.g. 'EUR'
}
```

#### 2. Get Hotel Description
Get the hotel's description and information.

```javascript
GET /hotels/getDescriptionAndInfo
Params: {
  hotel_id: string,     // e.g. '5955189'
  languagecode: string  // e.g. 'en-us'
}
```

#### 3. Get Hotel Photos
Retrieve photos of the hotel.

```javascript
GET /hotels/getHotelPhotos
Params: {
  hotel_id: string  // e.g. '5955189'
}
```

#### 4. Get Hotel Facilities
Get the facilities available at the hotel.

```javascript
GET /hotels/getHotelFacilities
Params: {
  hotel_id: string,     // e.g. '5955189'
  languagecode: string  // e.g. 'en-us'
}
```

### Room Information

#### 1. Get Room List
Get list of available rooms.

```javascript
GET /hotels/getRoomList
Params: {
  hotel_id: string,         // e.g. '74717'
  adults: string,           // e.g. '1'
  children_age: string,     // e.g. '1,0'
  room_qty: string,         // e.g. '1'
  units: string,            // e.g. 'metric'
  temperature_unit: string, // e.g. 'c'
  languagecode: string,     // e.g. 'en-us'
  currency_code: string     // e.g. 'EUR'
}
```

#### 2. Get Room List With Availability
Get list of rooms with availability information.

```javascript
GET /hotels/getRoomListWithAvailability
Params: {
  hotel_id: string,         // e.g. '74717'
  adults: string,           // e.g. '1'
  children_age: string,     // e.g. '1,0'
  room_qty: string,         // e.g. '1'
  units: string,            // e.g. 'metric'
  temperature_unit: string, // e.g. 'c'
  languagecode: string,     // e.g. 'en-us'
  currency_code: string     // e.g. 'EUR'
}
```

#### 3. Get Availability
Check room availability for a specific hotel.

```javascript
GET /hotels/getAvailability
Params: {
  hotel_id: string,      // e.g. '5218600'
  currency_code: string  // e.g. 'USD'
}
```

### Hotel Policies & Features

#### 1. Get Hotel Policies
Get hotel policies and rules.

```javascript
GET /hotels/getHotelPolicies
Params: {
  hotel_id: string,     // e.g. '5955189'
  languagecode: string  // e.g. 'en-us'
}
```

#### 2. Get Payment Features
Get payment-related features and options.

```javascript
GET /hotels/getPaymentFeatures
Params: {
  hotel_id: string,     // e.g. '5955189'
  languagecode: string  // e.g. 'en-us'
}
```

#### 3. Get Children Policies
Get policies related to children.

```javascript
GET /hotels/propertyChildrenPolicies
Params: {
  hotel_id: string,     // e.g. '1377073'
  languagecode: string  // e.g. 'en-us'
}
```

### Reviews & Ratings

#### 1. Get Review Scores
Get hotel review scores.

```javascript
GET /hotels/getHotelReviewScores
Params: {
  hotel_id: string,     // e.g. '5955189'
  languagecode: string  // e.g. 'en-us'
}
```

#### 2. Get Review Filters
Get review filter metadata.

```javascript
GET /hotels/getHotelReviewsFilterMetadata
Params: {
  hotel_id: string,     // e.g. '1377073'
  languagecode: string  // e.g. 'en-us'
}
```

#### 3. Get Review Sort Options
Get options for sorting reviews.

```javascript
GET /hotels/getHotelReviewsSortOption
Params: {
  hotel_id: string,     // e.g. '5955189'
  languagecode: string  // e.g. 'en-us'
}
```

#### 4. Get Questions and Answers
Get Q&A information for a hotel.

```javascript
GET /hotels/getQuestionAndAnswer
Params: {
  hotel_id: string,     // e.g. '74717'
  languagecode: string  // e.g. 'en-us'
}
```

### Location & Nearby

#### 1. Get Nearby Cities
Get cities near a specific location.

```javascript
GET /hotels/getNearbyCities
Params: {
  latitude: string,      // e.g. '65.9667'
  longitude: string,     // e.g. '-18.5333'
  languagecode: string  // e.g. 'en-us'
}
```

#### 2. Get Nearby Attractions
Get popular attractions near a hotel.

```javascript
GET /hotels/getPopularAttractionNearBy
Params: {
  hotel_id: string,     // e.g. '5955189'
  languagecode: string  // e.g. 'en-us'
}
```

### Filters & Sorting

#### 1. Get Filters
Get available filters for hotel search.

```javascript
GET /hotels/getFilter
Params: {
  dest_id: string,      // e.g. '-2092174'
  search_type: string,  // e.g. 'CITY'
  adults: string,       // e.g. '1'
  children_age: string, // e.g. '1,17'
  room_qty: string      // e.g. '1'
}
```

#### 2. Get Sort Options
Get available sorting options for hotel search.

```javascript
GET /hotels/getSortBy
Params: {
  dest_id: string,      // e.g. '-2092174'
  search_type: string,  // e.g. 'CITY'
  adults: string,       // e.g. '1'
  children_age: string, // e.g. '1,17'
  room_qty: string      // e.g. '1'
}
```

## Error Handling

All API calls should be wrapped in try-catch blocks:

```javascript
try {
  const response = await axios.request(options);
  return response.data;
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
```

## Implementation Notes

1. Always store your API key in environment variables
2. Implement rate limiting and caching where appropriate
3. Handle API errors gracefully
4. Validate input parameters before making API calls
5. Consider implementing retry logic for failed requests
6. Use appropriate error handling for each endpoint
7. Consider implementing request timeouts
8. Log API responses for debugging purposes

## Common Parameters

- `languagecode`: Usually 'en-us' for English
- `currency_code`: Common options include 'USD', 'EUR', 'GBP', 'AED'
- `units`: Usually 'metric' or 'imperial'
- `temperature_unit`: Usually 'c' for Celsius or 'f' for Fahrenheit
- `search_type`: Usually 'CITY' for city-based searches
- `adults`: Number of adult guests
- `children_age`: Comma-separated list of children's ages
- `room_qty`: Number of rooms required