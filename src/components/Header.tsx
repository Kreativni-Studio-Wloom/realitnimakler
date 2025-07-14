import React from "react";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-neutral-200 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <a href="/#uvod" className="font-bold text-xl tracking-tight text-gold-700">FN Reality</a>
        <nav className="hidden md:flex gap-8 text-base font-medium">
          <a href="/#uvod" className="group relative flex flex-col items-center hover:text-gold-700 transition-colors hover:scale-105 duration-200">
            <span>Úvod</span>
            <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-gold-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </a>
          <a href="/#sluzby" className="group relative flex flex-col items-center hover:text-gold-700 transition-colors hover:scale-105 duration-200">
            <span>Služby</span>
            <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-gold-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </a>
          <a href="/#info" className="group relative flex flex-col items-center hover:text-gold-700 transition-colors hover:scale-105 duration-200">
            <span>O mně</span>
            <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-gold-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </a>
          <a href="/#nemovitosti" className="group relative flex flex-col items-center hover:text-gold-700 transition-colors hover:scale-105 duration-200">
            <span>Nemovitosti</span>
            <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-gold-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </a>
          <a href="/#reference" className="group relative flex flex-col items-center hover:text-gold-700 transition-colors hover:scale-105 duration-200">
            <span>Reference</span>
            <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-gold-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </a>
          <a href="/#kontakt" className="group relative flex flex-col items-center hover:text-gold-700 transition-colors hover:scale-105 duration-200">
            <span>Kontakt</span>
            <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-gold-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </a>
        </nav>
        {/* Mobile menu placeholder */}
      </div>
    </header>
  );
};

export default Header; 