import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-white py-8 mt-16 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-bold text-lg tracking-tight text-gold-500">FN Reality | František Novák</div>
        <nav className="flex gap-6 text-sm">
          <a href="#uvod" className="hover:text-gold-400 transition-colors">Úvod</a>
          <a href="#sluzby" className="hover:text-gold-400 transition-colors">Služby</a>
          <a href="#nemovitosti" className="hover:text-gold-400 transition-colors">Nemovitosti</a>
          <a href="#reference" className="hover:text-gold-400 transition-colors">Reference</a>
          <a href="#kontakt" className="hover:text-gold-400 transition-colors">Kontakt</a>
        </nav>
        <div className="text-xs text-neutral-400 text-center md:text-right">
          <div>© {new Date().getFullYear()} František Novák</div>
          <div className="mt-2">Všechny informace jsou smyšlené, web funguje pouze pro informativní účel</div>
          <div className="mt-2">
            made by <a href="https://wloom.eu" target="_blank" rel="noopener" className="font-bold hover:underline text-white">Wloom</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 