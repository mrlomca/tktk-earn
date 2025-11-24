
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo Area */}
        <a href="#" className="flex items-center gap-1 group" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="relative w-8 h-8 flex items-center justify-center">
             {/* TikTok-ish Logo SVG */}
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 drop-shadow-[2px_2px_0px_rgba(254,44,85,0.8)] mix-blend-screen">
              <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.637 6.329 6.329 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
            </svg>
            <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none mix-blend-screen opacity-70">
                 <svg viewBox="0 0 24 24" fill="#25F4EE" className="w-8 h-8 -translate-x-[1px] -translate-y-[1px]">
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.637 6.329 6.329 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
                </svg>
            </div>
            <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none mix-blend-screen opacity-70">
                 <svg viewBox="0 0 24 24" fill="#FE2C55" className="w-8 h-8 translate-x-[1px] translate-y-[1px]">
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.637 6.329 6.329 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
                </svg>
            </div>
          </div>
        </a>

        {/* Menu Icon & Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white p-2 hover:bg-gray-800 rounded-full transition-colors relative z-50 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Menu Dropdown */}
          {isMenuOpen && (
            <>
              {/* Click backdrop to close */}
              <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsMenuOpen(false)} />
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl overflow-hidden py-2 z-50 origin-top-right ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => scrollToSection('guide')}
                  className="w-full text-left px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#FE2C55] transition-colors border-b border-gray-100 last:border-0"
                >
                  Check guide
                </button>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="w-full text-left px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#FE2C55] transition-colors"
                >
                  FAQ
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;