import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Trips from './pages/Trips';
import AboutUs from './pages/AboutUs';
import Book from './pages/Book';
import Contact from './pages/Contact';
import GetStarted from './pages/GetStarted';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="trips" element={<Trips />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="book" element={<Book />} />
          <Route path="contact" element={<Contact />} />
          <Route path="get-started" element={<GetStarted />} />
          <Route path="account" element={<div className="pt-32">Account Page</div>} />
          <Route path="*" element={<div className="pt-32">404 - Page Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
