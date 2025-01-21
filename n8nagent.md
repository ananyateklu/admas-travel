The n8n agent has a webhook that can be used to trigger the agent.

The webhook is available at https://anunu.app.n8n.cloud/webhook-test/admas-travel-agent

The webhook is triggered by a POST request

Then we have agent connected to the webhook that is tools agent.

Prompt source is this

Travel Information Details
• adults: {{ $json.body.body.adults }}
• children: {{ $json.body.body.children }}
• class: {{ $json.body.body.class }}
• contactEmail: {{ $json.body.body.contactEmail }}
• contactName: {{ $json.body.body.contactName }}
• contactPhone: {{ $json.body.body.contactPhone }}
• departureDate: {{ $json.body.body.departureDate }}
• departureTime: {{ $json.body.body.departureTime }}
• from: {
    airportCode: {{ $json.body.body.from.airportCode }},
    city: {{ $json.body.body.from.city }},
    country: {{ $json.body.body.from.country }},
    id: {{ $json.body.body.from.id }},
    name: {{ $json.body.body.from.name }}
  }
• to: {
    airportCode: {{ $json.body.body.to.airportCode }},
    city: {{ $json.body.body.to.city }},
    country: {{ $json.body.body.to.country }},
    id: {{ $json.body.body.to.id }},
    name: {{ $json.body.body.to.name }}
  }
• passengers: [
    {
      dateOfBirth: {{ $json.body.body.passengers[0].dateOfBirth }},
      fullName: {{ $json.body.body.passengers[0].fullName }},
      nationality: {{ $json.body.body.passengers[0].nationality }},
      passportExpiry: {{ $json.body.body.passengers[0].passportExpiry }},
      passportNumber: {{ $json.body.body.passengers[0].passportNumber }},
      type: {{ $json.body.body.passengers[0].type }}
    }
  ]
• returnDate: {{ $json.body.body.returnDate }}
• returnTime: {{ $json.body.body.returnTime }}
• specialRequests: {{ $json.body.body.specialRequests }}
• status: {{ $json.body.body.status }}
• totalPassengers: {{ $json.body.body.totalPassengers }}
• tripType: {{ $json.body.body.tripType }}
• userEmail: {{ $json.body.body.userEmail }}

Purpose
Use this template to process flight booking information. The agent should:
1. Verify all provided information matches the Firestore structure
2. Ensure required fields are present and properly formatted:
   - Passenger details (name, DOB, passport info)
   - Flight details (airports, dates, times)
   - Contact information
   - Special requests
3. Format response as a clean JSON object for Firestore storage
4. Set default values:
   - status: "pending"
   - class: "economy"
   - departureTime: "09:00"
   - returnTime: "09:00"

Remember to:
- Maintain proper data types for all fields
- Ensure dates are in YYYY-MM-DD format
- Verify airport codes and names
- Include all nested objects and arrays
Current date/time: {{ $now.format('DD') }}



and it has system prompt
You are a customer support AI agent at Admas Travel. Your primary role is to collect and organize flight information provided by customers.

IMPORTANT: You must respond ONLY with a JSON object, no additional text or markdown. The JSON must follow this exact format:

{
  "adults": number,
  "children": 0,
  "class": "economy",
  "contactEmail": "string",
  "contactName": "string",
  "contactPhone": "string",
  "departureDate": "YYYY-MM-DD",
  "departureTime": "09:00",
  "from": {
    "city": "string",
    "country": "string",
    "name": "string"
  },
  "to": {
    "city": "string",
    "country": "string",
    "name": "string"
  },
  "passengers": [{
    "fullName": "string",
    "nationality": "string",
    "passportNumber": "string",
    "type": "adult"
  }],
  "returnDate": "YYYY-MM-DD",
  "returnTime": "09:00",
  "specialRequests": "string",
  "status": "pending",
  "totalPassengers": number,
  "tripType": "roundtrip",
  "userEmail": "string"
}

Rules:
1. DO NOT include any text before or after the JSON
2. DO NOT use markdown formatting
3. DO NOT include explanations
4. ONLY output the JSON object
5. Ensure all dates are in YYYY-MM-DD format
6. Split city and country correctly
7. Set status always to "pending"
8. Set class always to "economy"
9. Set departure and return time to "09:00"

Current date: {{ $now.format('DD')}}

This agent is connect to a google gemini chatmodel  and also outputs to a code.

This is the code

// Get the raw JSON string from the output field
const rawOutput = items[0].json.output;

// Clean up the JSON string by removing markdown formatting
const cleanJson = rawOutput
  .replace(/```json\n/, '')
  .replace(/\n```/, '')
  .trim();

// Parse the cleaned JSON string
const bookingData = JSON.parse(cleanJson);

// Generate booking reference
const date = new Date();
const year = date.getFullYear().toString().slice(-2);
const month = (date.getMonth() + 1).toString().padStart(2, '0');
const randomString = Math.random().toString(36).substring(2, 5).toUpperCase();
const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
const bookingReference = `ADMAS-${year}${month}-${randomString}${sequence}`;

// Helper function to format date as YYYY-MM-DD
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Create the processed data with nested structures
const processedData = {
  adults: parseInt(bookingData.adults ?? 1),
  bookingReference,
  children: parseInt(bookingData.children ?? 0),
  class: (bookingData.class ?? 'economy').toString(),
  contactEmail: (bookingData.contactEmail ?? '').toString(),
  contactName: (bookingData.contactName ?? '').toString(),
  contactPhone: (bookingData.contactPhone ?? '').toString(),
  createdAt: formatDate(new Date()),
  departureDate: formatDate(bookingData.departureDate),
  departureTime: (bookingData.departureTime ?? '09:00').toString(),
  
  // From location as a map
  from: {
    airportCode: (bookingData.from?.airportCode ?? '').toString(),
    city: (bookingData.from?.city ?? '').toString(),
    country: (bookingData.from?.country ?? '').toString(),
    id: (bookingData.from?.id ?? '').toString(),
    name: (bookingData.from?.name ?? '').toString()
  },
  
  // To location as a map
  to: {
    airportCode: (bookingData.to?.airportCode ?? '').toString(),
    city: (bookingData.to?.city ?? '').toString(),
    country: (bookingData.to?.country ?? '').toString(),
    id: (bookingData.to?.id ?? '').toString(),
    name: (bookingData.to?.name ?? '').toString()
  },
  
  // Passengers as an array of maps
  passengers: bookingData.passengers?.map(passenger => ({
    dateOfBirth: formatDate(passenger.dateOfBirth),
    fullName: (passenger.fullName ?? '').toString(),
    nationality: (passenger.nationality ?? '').toString(),
    passportExpiry: formatDate(passenger.passportExpiry),
    passportNumber: (passenger.passportNumber ?? '').toString(),
    type: (passenger.type ?? 'adult').toString()
  })) ?? [],
  
  preferences: null,
  returnDate: formatDate(bookingData.returnDate),
  returnTime: (bookingData.returnTime ?? '09:00').toString(),
  specialRequests: (bookingData.specialRequests ?? '').toString(),
  status: (bookingData.status ?? 'pending').toString(),
  totalPassengers: parseInt(bookingData.totalPassengers ?? 1),
  tripType: (bookingData.tripType ?? 'oneway').toString(),
  type: 'flight',
  userEmail: (bookingData.userEmail ?? '').toString(),
  userId: 'agent'
};

return { json: processedData };

The code outputs a json object that is used to create a firestore document.
looks like this
[
  {
    "adults": 1,
    "bookingReference": "ADMAS-2501-G29042",
    "children": 0,
    "class": "economy",
    "contactEmail": "john.doe@example.com",
    "contactName": "John Doe",
    "contactPhone": "+1 (612) 555-1234",
    "createdAt": "2025-01-14",
    "departureDate": "2025-02-15",
    "departureTime": "09:00",
    "from": {
      "airportCode": "",
      "city": "New York",
      "country": "United States",
      "id": "",
      "name": "John F. Kennedy International Airport"
    },
    "to": {
      "airportCode": "",
      "city": "Addis Ababa",
      "country": "Ethiopia",
      "id": "",
      "name": "Addis Ababa Bole International Airport"
    },
    "passengers": [
      {
        "dateOfBirth": "",
        "fullName": "John Doe",
        "nationality": "US",
        "passportExpiry": "",
        "passportNumber": "123456789",
        "type": "adult"
      }
    ],
    "preferences": null,
    "returnDate": "2025-02-28",
    "returnTime": "09:00",
    "specialRequests": "Aisle seat preference",
    "status": "pending",
    "totalPassengers": 1,
    "tripType": "roundtrip",
    "type": "flight",
    "userEmail": "john.doe@example.com",
    "userId": "agent"
  }
]

