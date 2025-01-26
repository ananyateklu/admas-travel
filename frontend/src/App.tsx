import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { AuthProvider } from './lib/firebase/AuthContext';
import { RecaptchaProvider } from './lib/recaptcha/RecaptchaProvider';
import './styles/animations.css';
import './styles/recaptcha.css';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Book = React.lazy(() => import('./pages/FlightBook').then(module => ({ default: module.Book })));
const Admin = React.lazy(() => import('./pages/Admin'));
const Bookings = React.lazy(() => import('./pages/FlightBookingsList').then(module => ({ default: module.Bookings })));
const BookingConfirmation = React.lazy(() => import('./pages/FlightBookingConfirmation'));
const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const Contact = React.lazy(() => import('./pages/Contact'));
const GetStarted = React.lazy(() => import('./pages/GetStarted'));
const Account = React.lazy(() => import('./pages/Account'));
const HotelSearchPage = React.lazy(() => import('./pages/hotels/HotelSearchPage'));
const HotelBookingPage = React.lazy(() => import('./pages/hotels/HotelBookingPage'));
const BookingDetailsPage = React.lazy(() => import('./pages/bookings/BookingDetailsPage'));
const CarBookingPage = React.lazy(() => import('./pages/car-booking'));
const ExploreMoreNaturalWonders = React.lazy(() => import('./pages/ExploreMore'));

function App() {
  return (
    <RecaptchaProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AnimatePresence mode="wait">
            <Suspense fallback={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-screen"
              >
                <LoadingSpinner />
              </motion.div>
            }>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="book" element={<Book />} />
                  <Route path="hotels" element={<HotelSearchPage />} />
                  <Route path="hotels/:hotelId/book" element={<HotelBookingPage />} />
                  <Route path="car-booking" element={<CarBookingPage />} />
                  <Route path="admin" element={<Admin />} />
                  <Route path="bookings" element={<Bookings />} />
                  <Route path="bookings/:bookingId" element={<BookingDetailsPage />} />
                  <Route path="booking-confirmation/:bookingId" element={<BookingConfirmation />} />
                  <Route path="about-us" element={<AboutUs />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="get-started" element={<GetStarted />} />
                  <Route path="account" element={<Account />} />
                  <Route path="profile" element={<Navigate to="/account" replace />} />
                  <Route path="explore-more" element={<ExploreMoreNaturalWonders />} />
                </Route>
              </Routes>
            </Suspense>
          </AnimatePresence>
        </Router>
      </AuthProvider>
    </RecaptchaProvider>
  );
}

export default App;
