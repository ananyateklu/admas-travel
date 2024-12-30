import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Trips from './pages/Trips';
import AboutUs from './pages/AboutUs';
import Book from './pages/Book';
import Contact from './pages/Contact';
import GetStarted from './pages/GetStarted';
import Account from './pages/Account';
import { AuthProvider } from './lib/firebase/AuthContext';
import { ConvaiChat } from './components/chat/ConvaiChat';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="trips" element={<Trips />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="book" element={<Book />} />
            <Route path="contact" element={<Contact />} />
            <Route path="get-started" element={<GetStarted />} />
            <Route path="account" element={<Account />} />
            <Route path="bookings" element={<div className="pt-32">Your Bookings</div>} />
            <Route path="*" element={<div className="pt-32">404 - Page Not Found</div>} />
          </Route>
        </Routes>
        <ConvaiChat agentId="k57XOhpbsRdgDr1Gxn1H" position="bottom-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
