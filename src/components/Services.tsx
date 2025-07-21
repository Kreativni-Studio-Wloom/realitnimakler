'use client';

import { FaCamera, FaGavel, FaHome, FaBalanceScale, FaHandshake, FaChartLine, FaRegBuilding, FaUserFriends, FaMoneyBillWave } from "react-icons/fa";
import { useEffect, useState } from "react";
import React from "react"; // Added missing import for React

const services = [
  {
    icon: <FaBalanceScale className="text-gold-500 text-3xl mb-2" />,
    title: "Odhad tržní ceny",
    desc: "Profesionální stanovení reálné hodnoty vaší nemovitosti.",
  },
  {
    icon: <FaCamera className="text-gold-500 text-3xl mb-2" />,
    title: "Profesionální fotografie a video",
    desc: "Atraktivní prezentace nemovitosti pro maximální zájem.",
  },
  {
    icon: <FaHome className="text-gold-500 text-3xl mb-2" />,
    title: "Home staging",
    desc: "Příprava interiéru pro lepší dojem a rychlejší prodej.",
  },
  {
    icon: <FaGavel className="text-gold-500 text-3xl mb-2" />,
    title: "Právní servis",
    desc: "Kompletní právní zajištění prodeje/pronájmu.",
  },
  {
    icon: <FaHandshake className="text-gold-500 text-3xl mb-2" />,
    title: "Hypoteční poradenství",
    desc: "Pomoc s financováním a výběrem hypotéky.",
  },
  {
    icon: <FaChartLine className="text-gold-500 text-3xl mb-2" />,
    title: "Marketing nemovitosti",
    desc: "Cílená propagace na realitních serverech a sociálních sítích.",
  },
];

// Hook pro detekci, zda je element ve viewportu
function useInView(ref: React.RefObject<HTMLSpanElement | null>, options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      options
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);
  return isInView;
}

// Upravený Counter
function Counter({ to, duration = 2000, suffix = "" }: { to: number, duration?: number, suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let start = 1;
    const end = to;
    if (start === end) return;
    const increment = Math.ceil(end / (duration / 16));
    let current = start;
    setCount(start);
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [to, duration, isInView]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const Services = () => (
  <section id="sluzby" className="py-24 bg-white">
    <div className="max-w-5xl mx-auto px-4">
      {/* Statistika nadpis */}
      <div className="grid grid-cols-1 md:grid-cols-3 justify-items-center gap-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <FaRegBuilding className="text-black text-3xl" />
            <span className="text-2xl font-bold text-black"><Counter to={200} suffix="+" /></span>
          </div>
          <span className="text-sm text-neutral-500 mt-1">prodaných nemovitostí</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <FaUserFriends className="text-black text-3xl" />
            <span className="text-2xl font-bold text-black"><Counter to={150} suffix="+" /></span>
          </div>
          <span className="text-sm text-neutral-500 mt-1">spokojených klientů</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <FaMoneyBillWave className="text-black text-3xl" />
            <span className="text-2xl font-bold text-black"><Counter to={350} suffix="+ mil. Kč" /></span>
          </div>
          <span className="text-sm text-neutral-500 mt-1">v zobchodovaných nemovitostech</span>
        </div>
      </div>
      {/* Nadpis služeb */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 mt-[80px]">Služby</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <div
            key={i}
            className="bg-neutral-50 rounded-xl shadow-md p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-xl duration-200 group"
          >
            {s.icon}
            <h3 className="text-xl font-semibold mb-2 group-hover:text-gold-700 transition-colors">{s.title}</h3>
            <p className="text-neutral-600 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Services; 