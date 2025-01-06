# Booking.com Car API Documentation

This document outlines all available endpoints for the Booking.com Car Rental API integration.

## Base Configuration

```javascript
const BASE_URL = 'https://booking-com15.p.rapidapi.com/api/v1/cars';
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
Searches for car rental locations based on a query string.

```javascript
GET /searchDestination
Params: {
  query: string // e.g. 'new'
}

// Example usage
const options = {
  method: 'GET',
  url: 'https://booking-com15.p.rapidapi.com/api/v1/cars/searchDestination',
  params: {query: 'new'},
  headers: HEADERS
};
```

#### 2. Search Car Rentals
Search for available cars at specific locations.

```javascript
GET /searchCarRentals
Params: {
  pick_up_latitude: string,    // e.g. '40.6397018432617'
  pick_up_longitude: string,   // e.g. '-73.7791976928711'
  drop_off_latitude: string,   // e.g. '40.6397018432617'
  drop_off_longitude: string,  // e.g. '-73.7791976928711'
  pick_up_time: string,        // e.g. '10:00'
  drop_off_time: string,       // e.g. '10:00'
  driver_age: string,          // e.g. '30'
  currency_code: string        // e.g. 'USD'
}
```

### Vehicle Details

#### 1. Get Vehicle Details
Retrieve detailed information about a specific vehicle.

```javascript
GET /vehicleDetails
Params: {
  vehicle_id: string,      // e.g. '373025711'
  search_key: string,      // Search session key from search results
  units: string,           // e.g. 'metric'
  currency_code: string,   // e.g. 'USD'
  languagecode: string     // e.g. 'en-us'
}
```

#### 2. Get Booking Summary
Get the booking summary for a specific vehicle.

```javascript
GET /bookingSummary
Params: {
  vehicle_id: string,      // e.g. '373025711'
  search_key: string,      // Search session key from search results
  currency_code: string    // e.g. 'EUR'
}
```

### Supplier Information

#### 1. Get Vehicle Supplier Details
Get detailed information about the vehicle supplier.

```javascript
GET /vehicleSupplierDetails
Params: {
  vehicle_id: string,      // e.g. '373025711'
  search_key: string,      // Search session key from search results
  currency_code: string    // e.g. 'USD'
}
```

#### 2. Get Supplier Ratings
Get ratings for the vehicle supplier.

```javascript
GET /vehicleSupplierRatings
Params: {
  vehicle_id: string,      // e.g. '373025711'
  search_key: string,      // Search session key from search results
  currency_code: string    // e.g. 'USD'
}
```

#### 3. Get Supplier Reviews
Get reviews for the vehicle supplier.

```javascript
GET /vehicleSupplierReview
Params: {
  vehicle_id: string,      // e.g. '373025711'
  search_key: string       // Search session key from search results
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
- `currency_code`: Common options include 'USD', 'EUR', 'GBP'
- `units`: Usually 'metric' or 'imperial'
- `search_key`: Session key returned from search results, required for most detail endpoints
- `driver_age`: Age of the driver (must be above minimum required age)