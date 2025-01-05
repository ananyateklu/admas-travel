# Admas Travel - Modern Travel Booking Platform

## Overview

Admas Travel is a modern travel booking platform built with React and TypeScript. The application provides a seamless experience for users to discover destinations, book flights, and manage their travel plans, while also offering a comprehensive admin dashboard for business operations.

## Features

### User Features

- **Destination Discovery**: Browse through curated destinations with rich visuals and detailed information
- **Flight Booking**: Easy-to-use flight search and booking system
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
- **Analytics Dashboard**:  
  - Booking trends analysis
  - Revenue tracking
  - Popular destinations insights
  - Customer satisfaction metrics
  - Performance analytics

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

- **Integration & APIs**:
  - Convai Chat Integration
  - Firebase Authentication
  - Firestore Real-time Database
  - Custom REST APIs

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account for backend services

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/admas-travel.git
cd admas-travel/frontend
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

Create a `.env` file in the frontend directory with the following variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CONVAI_API_KEY=your_convai_key
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── admin/        # Admin dashboard components
│   │   ├── booking/      # Booking flow components
│   │   ├── chat/         # Chat interface components
│   │   ├── common/       # Shared components
│   │   ├── home/         # Homepage components
│   │   └── navigation/   # Navigation components
│   ├── pages/            # Page components
│   ├── lib/              # Utilities and services
│   │   ├── animations/   # Animation variants
│   │   ├── firebase/     # Firebase configuration
│   │   └── api/         # API services
│   ├── hooks/            # Custom React hooks
│   ├── styles/           # Global styles and animations
│   ├── types/            # TypeScript type definitions
│   └── data/             # Static data and constants
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run test`: Run tests

## Animation System

The application uses different animation systems combining:

- Framer Motion for page transitions and complex UI animations
- CSS animations for subtle interactions
- Custom animation variants for consistent motion design
- Optimized performance with hardware acceleration

## Performance Optimization

- Lazy loading of components and images
- Code splitting for optimal bundle size
- Optimized animations with hardware acceleration
- Efficient state management
- Caching strategies for API calls
