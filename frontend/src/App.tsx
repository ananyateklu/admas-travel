import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import { Book } from './pages/Book';
import Admin from './pages/Admin';
import { Bookings } from './pages/Bookings';
import BookingConfirmation from './pages/BookingConfirmation';
import About from './pages/About';
import Contact from './pages/Contact';
import GetStarted from './pages/GetStarted';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="book" element={<Book />} />
          <Route path="admin" element={<Admin />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="booking-confirmation/:bookingId" element={<BookingConfirmation />} />
          <Route path="about-us" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="get-started" element={<GetStarted />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
