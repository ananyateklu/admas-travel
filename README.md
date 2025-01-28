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
