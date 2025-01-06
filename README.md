# Admas Travel - Modern Travel Booking Platform

## Overview

Admas Travel is a modern travel booking platform built with React and TypeScript. The application provides a seamless experience for users to discover destinations, book flights and hotels, and manage their travel plans, while also offering a comprehensive admin dashboard for business operations.

## Features

### User Features

- **Destination Discovery**: Browse through curated destinations with rich visuals and detailed information
- **Flight Booking**: Easy-to-use flight search and booking system
- **Hotel Booking**:
  - Advanced hotel search with filters
  - Real-time room availability
  - Detailed hotel information and photos
  - Room selection with amenities
  - Guest information management
  - Special requests handling
  - Flexible booking options
- **Travel Planning**: Personalized travel recommendations and itinerary planning
- **User Accounts**: Secure user authentication and profile management
- **AI Chat Assistant**: Integrated Convai-powered chat support for instant help
- **Responsive Design**: Seamless experience across all devices
- **Interactive UI**: Smooth animations and transitions using Framer Motion
- **Virtual Tour Guide**: Discover Ethiopian wonders with interactive storytelling
- **Special Requirements**: Custom travel preferences and requirements handling
- **Travel Resources**: Comprehensive guides, visa information, and travel tips

### Admin Features

- **Dashboard**: Comprehensive overview of business metrics
- **Booking Management**: Track and manage all bookings with status tracking
- **Flight Management**: Monitor and update flight information
- **Hotel Management**:
  - Property listing management
  - Room inventory control
  - Pricing and availability updates
  - Booking status monitoring
- **Analytics Dashboard**:  
  - Booking trends analysis
  - Revenue tracking
  - Popular destinations insights
  - Customer satisfaction metrics
  - Performance analytics
  - Hotel occupancy rates
  - Average booking value

## Tech Stack

### Core Technologies

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Animations**: Framer Motion for advanced animations
- **State Management**: React Context API
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **UI Components**: Custom components with modern design
- **Routing**: React Router v6

### Key Libraries & Tools

- **Animation Libraries**:
  - Framer Motion for page transitions and UI animations
  - Custom CSS animations for subtle interactions

- **UI Components**:
  - Custom reusable components
  - Responsive grid system
  - Modern card layouts
  - Interactive forms
  - Hotel search and filtering components
  - Booking management components

- **Integration & APIs**:
  - Convai Chat Integration
  - Firebase Authentication
  - Firestore Real-time Database
  - Custom REST APIs
  - Hotel Booking API Integration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account for backend services

### Installation

1/ Clone the repository

```bash
git clone https://github.com/yourusername/admas-travel.git
cd admas-travel/frontend
```

2/ Install dependencies

```bash
npm install
# or
yarn install
```

3/ Set up environment variables

Create a `.env` file in the frontend directory with the following variables:

```plaintext
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CONVAI_API_KEY=your_convai_key
```

4/ Start the development server

```bash
npm run dev
# or
yarn dev
```

## Project Structure

```plaintext
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── admin/           # Admin dashboard components
│   │   ├── car-booking/     # Car rental components
│   │   │   ├── CarBookingData.json    # Car booking data types
│   │   │   ├── CarBookingModal.tsx    # Booking confirmation modal
│   │   │   ├── CarCard.tsx            # Individual car display
│   │   │   ├── CarDetailsModal.tsx    # Detailed car information
│   │   │   ├── CarLoadingState.tsx    # Loading animations
│   │   │   ├── CarSearchForm.tsx      # Search form component
│   │   │   ├── CarSearchInput.tsx     # Location search input
│   │   │   ├── CarSearchResults.tsx   # Search results display
│   │   │   └── VehicleObject.json     # Vehicle type definitions
│   │   ├── chat/            # Chat interface components
│   │   ├── common/          # Common shared components
│   │   ├── flight-booking/  # Flight booking components
│   │   ├── home/            # Homepage components
│   │   ├── hotel-booking/   # Hotel booking components
│   │   ├── layout/          # Layout components
│   │   ├── navigation/      # Navigation components
│   │   ├── notifications/   # Notification components
│   │   ├── shared/          # Shared utility components
│   │   └── travel/          # Travel-related components
│   │   └── AirportSearchInput.tsx  # Airport search component
│   │   └── Footer.tsx             # Global footer component
│   │   └── Layout.tsx             # Main layout wrapper
│   │   └── ScrollToTop.tsx        # Scroll restoration
│   │   └── SignInDropdown.tsx     # Authentication dropdown
│   ├── pages/               # Page components
│   │   ├── hotels/          # Hotel booking pages
│   │   ├── bookings/        # Booking management pages
│   │   ├── AboutUs.tsx      # About page
│   │   ├── Account.tsx      # User account page
│   │   ├── Admin.tsx        # Admin dashboard
│   │   ├── ComfortCamp.tsx  # Comfort camp page
│   │   ├── Contact.tsx      # Contact page
│   │   ├── FlightBook.tsx   # Flight booking page
│   │   ├── FlightBookingConfirmation.tsx  # Booking confirmation
│   │   ├── FlightBookingsList.tsx         # Bookings list
│   │   ├── GetStarted.tsx   # Onboarding page
│   │   ├── Home.tsx         # Homepage
│   │   └── Trips.tsx        # User trips page
│   ├── lib/                 # Core libraries and utilities
│   │   ├── animations/      # Animation configurations
│   │   │   └── variants.ts  # Framer Motion variants
│   │   ├── api/            # API integrations
│   │   │   └── hotelService.ts  # Hotel API service
│   │   ├── firebase/       # Firebase configurations
│   │   │   ├── useAuth.ts      # Authentication hook
│   │   │   ├── firebase.ts     # Firebase config
│   │   │   ├── AuthContext.tsx # Auth context provider
│   │   │   ├── index.ts        # Firebase exports
│   │   │   └── *.d.ts          # Firebase type definitions
│   │   └── utils/          # Utility functions
│   │       └── helpers.ts  # Common helper functions
│   ├── hooks/               # Custom React hooks
│   │   ├── useAnalytics.ts          # Analytics hook
│   │   ├── useAdminSettings.ts      # Admin settings hook
│   │   ├── useScrollAnimation.ts    # Scroll animation hook
│   │   ├── useAirportSearch.ts      # Airport search hook
│   │   └── useTravelPreferences.ts  # Travel preferences hook
│   ├── types/               # TypeScript type definitions
│   │   ├── hotelTypes.ts           # Hotel-related types
│   │   ├── flightbooking.ts        # Flight booking types
│   │   ├── flight.ts               # Flight data types
│   │   ├── carSearch.ts            # Car rental search and booking types
│   │   └── *.json                  # Type definition data
│   ├── services/           # Service layer
│   │   └── flightService.ts # Flight-related services
│   ├── styles/             # Global styles
│   │   ├── globals.css    # Global CSS styles
│   │   └── animations.css # Animation keyframes and styles
│   ├── utils/              # Utility functions
│   │   └── Helper functions and utilities
│   ├── assets/             # Static assets
│   │   └── Images, icons, and other media
│   ├── data/               # Static data and constants
│   │   └── Configuration and static content
│   ├── App.tsx             # Root component
│   ├── main.tsx           # Entry point
│   ├── types.ts           # Global type definitions
│   ├── index.css          # Global CSS
│   ├── App.css            # App-specific CSS
│   └── vite-env.d.ts      # Vite environment types
```

### Framer Motion Variants

Located in `lib/animations/variants.ts`:

- Page transition variants
- Component animation presets
- Hover and tap animations
- List item animations
- Modal animations

### CSS Animations

Located in `styles/animations.css`:

- Keyframe animations
- Transition effects
- Loading animations
- Hover effects

### Global Styles

Located in `styles/globals.css`:

- Base styles
- Utility classes
- Theme variables
- Responsive design rules

## Utility Functions

### Helper Functions

Located in `lib/utils/helpers.ts`:

- Data formatting
- Validation functions
- Date manipulation
- Currency formatting
- String utilities

### Component Utils

Located in `components/shared`:

- Common UI utilities
- Layout helpers
- Form validation
- Event handlers

## Development Tools

### Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run test`: Run tests
- `npm run typecheck`: TypeScript type checking

### Environment Setup

- Development mode configurations
- Production optimizations
- Testing environment setup
- CI/CD pipeline configurations

## Core Libraries

### Firebase Integration

The application uses Firebase for various features:

- **firebase.ts**: Core Firebase configuration
- **AuthContext.tsx**: Authentication context provider
- **useAuth.ts**: Custom authentication hook
- **Type Definitions**: Comprehensive TypeScript definitions

### API Services

- **hotelService.ts**: Hotel booking and management
- **flightService.ts**: Flight booking and management
- **carService.ts**: Car rental booking and management

These services handle:

- Data fetching
- Real-time updates
- Error handling
- Data transformation
- Cache management

## Custom Hooks

The application uses several custom hooks to manage various functionalities:

- **useAnalytics**: Track user interactions and application metrics
- **useAdminSettings**: Manage admin panel configurations
- **useScrollAnimation**: Handle scroll-based animations
- **useAirportSearch**: Manage airport search functionality
- **useTravelPreferences**: Handle user travel preferences
- **useCarSearch**: Manage car rental search state and filters
- **useCarBooking**: Handle car rental booking process and state

## Type System

The application uses TypeScript with comprehensive type definitions:

- **hotelTypes.ts**: Definitions for hotel bookings and properties
- **flightbooking.ts**: Flight booking related types
- **flight.ts**: Flight data and scheduling types
- **carSearch.ts**: Car rental search and booking types
- **types.ts**: Global type definitions

## State Management

The application uses a combination of state management solutions:

- React Context API for global state
- Local component state for UI interactions
- Custom hooks for shared logic
- Firebase Realtime Database for persistent data

## Security

- Firebase Authentication for user management
- Role-based access control
- Secure API endpoints
- Environment variable management
- Data validation and sanitization

## Deployment

The application can be deployed using:

- Vercel for frontend hosting
- Firebase Hosting as an alternative
- Continuous Integration/Deployment pipeline
- Environment-specific configuration
