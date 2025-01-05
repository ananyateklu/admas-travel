import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import { Book } from './pages/FlightBook';
import Admin from './pages/Admin';
import { Bookings } from './pages/FlightBookingsList';
import BookingConfirmation from './pages/FlightBookingConfirmation';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import GetStarted from './pages/GetStarted';
import Account from './pages/Account';
import { ScrollToTop } from './components/ScrollToTop';
import HotelSearchPage from './pages/hotels/HotelSearchPage';
import HotelDetailsPage from './pages/hotels/HotelDetailsPage';
import HotelBookingPage from './pages/hotels/HotelBookingPage';
import BookingDetailsPage from './pages/bookings/BookingDetailsPage';
import './styles/animations.css';
import { AuthProvider } from './lib/firebase/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="book" element={<Book />} />
            <Route path="hotels" element={<HotelSearchPage />} />
            <Route path="hotels/:hotelId" element={<HotelDetailsPage />} />
            <Route path="hotels/:hotelId/book" element={<HotelBookingPage />} />
            <Route path="admin" element={<Admin />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="bookings/:bookingId" element={<BookingDetailsPage />} />
            <Route path="booking-confirmation/:bookingId" element={<BookingConfirmation />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="contact" element={<Contact />} />
            <Route path="get-started" element={<GetStarted />} />
            <Route path="account" element={<Account />} />
            <Route path="profile" element={<Navigate to="/account" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
