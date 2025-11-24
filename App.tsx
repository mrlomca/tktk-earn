
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import QuickStart from './components/QuickStart';
import FAQ from './components/FAQ';

function App() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased selection:bg-[#FE2C55] selection:text-white">
      <Header />
      <main>
        <Hero />
        <QuickStart />
        <FAQ />
      </main>
      
      {/* Simple footer padding to match scroll feel */}
      <div className="bg-[#E8F6F5] h-20 w-full"></div>
    </div>
  );
}

export default App;
