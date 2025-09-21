import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Properties from './components/Properties';
import SellProperty from './components/SellProperty';

const HomePage = () => (
  <>
    <Header />
    <Hero />
    <Services />
    <About />
    <Contact />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/sell" element={<SellProperty />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;