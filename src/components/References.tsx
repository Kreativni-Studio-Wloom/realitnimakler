'use client';

import React, { useRef, useEffect, useState } from "react";

const references = [
  { name: "Jana Nováková", text: "Spolupráce byla naprosto profesionální, vše proběhlo rychle a bez starostí. Doporučuji!", rating: 5, date: "před 10 měsíci" },
  { name: "Petr Dvořák", text: "Makléř mi pomohl nejen s prodejem, ale i s právními náležitostmi. Skvělý přístup.", rating: 5, date: "před 6 měsíci" },
  { name: "Lucie Horáková", text: "Díky home stagingu a marketingu jsme prodali byt za vyšší cenu, než jsme čekali.", rating: 5, date: "před rokem" },
  { name: "Martin Svoboda", text: "Rychlá a efektivní komunikace, vše proběhlo bez problémů." },
  { name: "Eva Malá", text: "Oceňuji osobní přístup a ochotu pomoci v každé situaci." },
  { name: "Tomáš Král", text: "Doporučuji všem, kdo chtějí prodat nemovitost bez starostí." },
  { name: "Barbora Černá", text: "Skvělá prezentace bytu, díky které jsme rychle našli kupce." },
  { name: "Jan Procházka", text: "Makléř byl vždy k dispozici a vše vysvětlil." },
  { name: "Kateřina Veselá", text: "Profesionální a lidský přístup, děkuji!" },
  { name: "Michal Urban", text: "Vše proběhlo rychle a bez komplikací." },
  { name: "Alena Pokorná", text: "Doporučuji, byla jsem maximálně spokojená." },
  { name: "Roman Beneš", text: "Makléř mi pomohl i s financováním, děkuji." },
  { name: "Simona Křížová", text: "Oceňuji férové jednání a transparentnost." },
  { name: "David Marek", text: "Rychlý prodej a skvělá komunikace." },
  { name: "Petra Fialová", text: "Vše zařídil za mě, nemusela jsem se o nic starat." },
  { name: "Ondřej Bláha", text: "Doporučuji všem, kdo chtějí kvalitní služby." },
  { name: "Veronika Holá", text: "Makléř byl vždy ochotný a vstřícný." },
  { name: "Filip Novotný", text: "Díky za pomoc s prodejem domu!" },
  { name: "Jitka Doležalová", text: "Vše proběhlo hladce a rychle." },
  { name: "Radek Kolář", text: "Oceňuji profesionální přístup a ochotu." },
  { name: "Monika Richterová", text: "Makléř mi pomohl i s právními otázkami." },
  { name: "Karel Hruška", text: "Doporučuji, vše bylo perfektní." },
  { name: "Tereza Zelená", text: "Skvělá zkušenost, děkuji!" },
  { name: "Václav Němec", text: "Rychlá domluva a férové jednání." },
  { name: "Lenka Šimková", text: "Makléř byl vždy k dispozici a ochotný." },
  { name: "Marek Sýkora", text: "Díky za skvělou spolupráci." },
  { name: "Helena Vondráčková", text: "Vše proběhlo podle mých představ." },
  { name: "Stanislav Polák", text: "Oceňuji rychlost a profesionalitu." },
  { name: "Ivana Konečná", text: "Makléř mi pomohl i s hypotékou." },
  { name: "Pavel Dolejší", text: "Doporučuji, vše bylo bez problémů." },
  { name: "Zuzana Kovářová", text: "Skvělý přístup a ochota pomoci." },
  { name: "Lukáš Tichý", text: "Vše proběhlo rychle a bez komplikací." },
  { name: "Jana Hrdličková", text: "Makléř byl vždy vstřícný a ochotný." },
  { name: "Miroslav Kříž", text: "Doporučuji, byl jsem velmi spokojen." },
  { name: "Klára Dvořáková", text: "Vše zařídil za mě, nemusela jsem se o nic starat." },
  { name: "Adam Nový", text: "Oceňuji férové jednání a rychlost." },
  { name: "Lucie Šťastná", text: "Makléř byl vždy ochotný a vstřícný." },
  { name: "Petr Malý", text: "Doporučuji, vše bylo perfektní." },
  { name: "Martina Čechová", text: "Skvělá zkušenost, děkuji!" },
  { name: "Tomáš Vacek", text: "Rychlá domluva a férové jednání." },
  { name: "Barbora Horská", text: "Makléř byl vždy k dispozici a ochotný." },
  { name: "Vladimír Konečný", text: "Díky za skvělou spolupráci." },
  { name: "Nikola Procházková", text: "Vše proběhlo podle mých představ." },
  { name: "Jaroslav Kříž", text: "Oceňuji rychlost a profesionalitu." },
  { name: "Eliška Novotná", text: "Makléř mi pomohl i s hypotékou." },
  { name: "Roman Dvořák", text: "Doporučuji, vše bylo bez problémů." },
  { name: "Kristýna Pokorná", text: "Skvělý přístup a ochota pomoci." },
  { name: "Štěpán Marek", text: "Vše proběhlo rychle a bez komplikací." },
  { name: "Denisa Holá", text: "Makléř byl vždy vstřícný a ochotný." },
  { name: "Vojtěch Sýkora", text: "Doporučuji, byl jsem velmi spokojen." },
];

const items = [...references, ...references];

const Star = () => (
  <svg className="w-5 h-5 inline-block text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
);

const References = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const direction = 1; // vždy doprava
  const MIN_DRAG = 30; // minimální vzdálenost pro změnu směru
  const autoScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Drag-to-scroll
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // dragStartX a dragEndX už nejsou potřeba

    const onMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setStartX(e.pageX - carousel.offsetLeft);
      setScrollLeft(carousel.scrollLeft);
    };
    const onMouseLeave = () => setIsDragging(false);
    const onMouseUp = () => {
      setIsDragging(false);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.2;
      carousel.scrollLeft = scrollLeft - walk;
    };
    // Touch events
    const onTouchStart = (e: TouchEvent) => {
      setIsDragging(true);
      setStartX(e.touches[0].pageX - carousel.offsetLeft);
      setScrollLeft(carousel.scrollLeft);
    };
    const onTouchEnd = () => {
      setIsDragging(false);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.2;
      carousel.scrollLeft = scrollLeft - walk;
    };
    carousel.addEventListener("mousedown", onMouseDown);
    carousel.addEventListener("mouseleave", onMouseLeave);
    carousel.addEventListener("mouseup", onMouseUp);
    carousel.addEventListener("mousemove", onMouseMove);
    carousel.addEventListener("touchstart", onTouchStart);
    carousel.addEventListener("touchend", onTouchEnd);
    carousel.addEventListener("touchmove", onTouchMove);
    return () => {
      carousel.removeEventListener("mousedown", onMouseDown);
      carousel.removeEventListener("mouseleave", onMouseLeave);
      carousel.removeEventListener("mouseup", onMouseUp);
      carousel.removeEventListener("mousemove", onMouseMove);
      carousel.removeEventListener("touchstart", onTouchStart);
      carousel.removeEventListener("touchend", onTouchEnd);
      carousel.removeEventListener("touchmove", onTouchMove);
    };
  }, [isDragging, startX, scrollLeft]);

  // Auto-scroll efekt
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    let frame: number;
    const speed = 1; // px per frame
    const animate = () => {
      carousel.scrollLeft += speed * direction;
      // Loop
      if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
        carousel.scrollLeft = 0;
      }
      if (carousel.scrollLeft <= 0) {
        carousel.scrollLeft = carousel.scrollWidth / 2;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section id="reference" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Reference klientů</h2>
        <div>
          <div
            ref={carouselRef}
            className="flex gap-6 whitespace-nowrap cursor-grab active:cursor-grabbing overflow-x-auto no-scrollbar"
            style={{ userSelect: isDragging ? "none" : "auto" }}
          >
            {items.map((ref, i) => (
              <div
                key={i}
                className="inline-block min-w-[360px] max-w-sm h-[220px] bg-neutral-50 rounded-2xl shadow-lg shadow-[0_4px_16px_-4px_rgba(0,0,0,0.10)] p-6 mx-2 align-top overflow-hidden flex flex-col"
              >
                <div className="flex-1">
                  <p className="text-neutral-800 text-base mb-6 text-left break-words w-full max-h-[110px] overflow-hidden text-wrap">{ref.text}</p>
                </div>
                <div className="font-bold text-neutral-900 text-left mt-auto">{ref.name}</div>
              </div>
            ))}
          </div>
          <div className="w-full h-12" />
        </div>
      </div>
    </section>
  );
};

export default References;
