'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

interface Property {
  id: string;
  img: string;
  name: string;
  type: string;
  street?: string;
  streetNumber?: string;
  city?: string;
  zip?: string;
  location: string;
  price: string;
  status: string;
  link: string;
  createdAt?: number;
  updatedAt?: number;
  order?: number;
}

const defaultProperties = [
  {
    id: '1',
    img: "/assets/nemovitosti/byt2.jpg",
    name: "Byt 1",
    type: "Byt",
    street: "Vinohradská",
    streetNumber: "1200/50",
    city: "Praha 3",
    zip: "13000",
    location: "Vinohradská 1200/50, 13000 Praha 3",
    price: "6 500 000 Kč",
    status: "K dispozici",
    link: "",
  },
  {
    id: '2',
    img: "/assets/nemovitosti/dum2.jpg",
    name: "Dům 1",
    type: "Dům",
    street: "Křížová",
    streetNumber: "15",
    city: "Brno",
    zip: "60300",
    location: "Křížová 15, 60300 Brno",
    price: "9 800 000 Kč",
    status: "K dispozici",
    link: "",
  },
  {
    id: '3',
    img: "/assets/nemovitosti/pozemek2.jpg",
    name: "Pozemek 1",
    type: "Pozemek",
    street: "Na Pískách",
    streetNumber: "112",
    city: "Plzeň",
    zip: "32600",
    location: "Na Pískách 112, 32600 Plzeň",
    price: "3 200 000 Kč",
    status: "K dispozici",
    link: "",
  },
  {
    id: '4',
    img: "/assets/nemovitosti/dum1.jpg",
    name: "Dům 2",
    type: "Dům",
    street: "Jiráskova",
    streetNumber: "8",
    city: "Beroun",
    zip: "26601",
    location: "Jiráskova 8, 26601 Beroun",
    price: "12 500 000 Kč",
    status: "Rezervace",
    link: "",
  },
  {
    id: '5',
    img: "/assets/nemovitosti/pozemek1.jpg",
    name: "Pozemek 2",
    type: "Pozemek",
    street: "U Lesa",
    streetNumber: "77",
    city: "Kladno",
    zip: "27201",
    location: "U Lesa 77, 27201 Kladno",
    price: "2 800 Kč / měsíc",
    status: "Pronajato",
    link: "",
  },
  {
    id: '6',
    img: "/assets/nemovitosti/byt1.jpg",
    name: "Byt 2",
    type: "Byt",
    street: "Smetanova",
    streetNumber: "5",
    city: "Liberec",
    zip: "46001",
    location: "Smetanova 5, 46001 Liberec",
    price: "7 200 000 Kč",
    status: "Prodáno",
    link: "",
  },
  {
    id: '7',
    img: "/assets/nemovitosti/byt3.jpg",
    name: "Byt 3",
    type: "Byt",
    street: "Masarykova",
    streetNumber: "200",
    city: "Ústí nad Labem",
    zip: "40001",
    location: "Masarykova 200, 40001 Ústí nad Labem",
    price: "8 100 000 Kč",
    status: "K dispozici",
    link: "",
  },
  {
    id: '8',
    img: "/assets/nemovitosti/byt4.jpg",
    name: "Byt 4",
    type: "Byt",
    street: "Husova",
    streetNumber: "10",
    city: "Plzeň",
    zip: "30100",
    location: "Husova 10, 30100 Plzeň",
    price: "5 900 000 Kč",
    status: "K dispozici",
    link: "",
  },
  {
    id: '9',
    img: "/assets/nemovitosti/byt5.jpg",
    name: "Byt 5",
    type: "Byt",
    street: "Kollárova",
    streetNumber: "25",
    city: "Brno",
    zip: "60200",
    location: "Kollárova 25, 60200 Brno",
    price: "7 300 000 Kč",
    status: "Rezervace",
    link: "",
  },
  {
    id: '10',
    img: "/assets/nemovitosti/byt6.jpg",
    name: "Byt 6",
    type: "Byt",
    street: "Dlouhá",
    streetNumber: "3",
    city: "Praha 1",
    zip: "11000",
    location: "Dlouhá 3, 11000 Praha 1",
    price: "4 800 000 Kč",
    status: "K dispozici",
    link: "",
  },
  {
    id: '11',
    img: "/assets/nemovitosti/dum3.jpg",
    name: "Dům 3",
    type: "Dům",
    street: "Na Hradbách",
    streetNumber: "2",
    city: "České Budějovice",
    zip: "37001",
    location: "Na Hradbách 2, 37001 České Budějovice",
    price: "10 200 000 Kč",
    status: "K dispozici",
    link: "",
  },
  {
    id: '12',
    img: "/assets/nemovitosti/pozemek3.jpg",
    name: "Pozemek 3",
    type: "Pozemek",
    street: "Jana Palacha",
    streetNumber: "100",
    city: "Hradec Králové",
    zip: "50002",
    location: "Jana Palacha 100, 50002 Hradec Králové",
    price: "2 100 Kč / m²",
    status: "K dispozici",
    link: "",
  },
];

const statusColors: Record<string, string> = {
  "Prodáno": "bg-red-500 text-white",
  "Rezervace": "bg-yellow-400 text-neutral-900",
  "Pronajato": "bg-orange-500 text-white",
  "K dispozici": "bg-green-600 text-white",
};

const statusOrder = {
  "K dispozici": 0,
  "Rezervace": 1,
  "Pronajato": 2,
  "Prodáno": 3,
};

const Properties = ({ showAll = false }: { showAll?: boolean }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    // Načítání nemovitostí z Firestore v reálném čase, řazení podle 'order' a 'createdAt'
    const propertiesRef = collection(db, 'properties');
    const q = query(propertiesRef, orderBy('order', 'asc'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedProperties = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          img: data.img || '',
          name: data.name || '',
          type: data.type || '',
          location: data.location || '',
          price: data.price || '',
          status: data.status || '',
          link: data.link || '',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().getTime() : Date.now(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().getTime() : Date.now(),
          order: data.order ?? 0,
        };
      });
      setProperties(loadedProperties);
    });
    return () => unsubscribe();
  }, []);

  // Generování dostupných filtrů z dat
  const availableCities = [...new Set(properties.map(p => p.location))].sort();
  const availableTypes = [...new Set(properties.map(p => p.type))].sort();
  const availableStatuses = [...new Set(properties.map(p => p.status))].sort();

  // Funkce pro extrakci číselné hodnoty ceny
  const extractPriceValue = (price: string) => {
    const numericValue = price.replace(/[^\d]/g, '');
    return numericValue ? parseInt(numericValue) : 0;
  };

  // Filtrování a řazení nemovitostí
  const filteredAndSortedProperties = properties
    .filter(property => {
      const searchLower = searchTerm.toLowerCase();
      
      // Funkce pro normalizaci textu (odstranění diakritiky a mezer)
      const normalizeText = (text: string) => {
        return text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // odstranění diakritiky
          .replace(/\s+/g, ''); // odstranění mezer
      };
      
      const normalizedSearch = normalizeText(searchTerm);
      
      // Textové vyhledávání
      const matchesSearch = !searchTerm || (
        normalizeText(property.name).includes(normalizedSearch) ||
        normalizeText(property.type).includes(normalizedSearch) ||
        normalizeText(property.location).includes(normalizedSearch) ||
        normalizeText(property.price).includes(normalizedSearch) ||
        normalizeText(property.status).includes(normalizedSearch)
      );

      // Filtry
      const matchesAvailability = availabilityFilter === "all" || property.status === availabilityFilter;
      const matchesCity = cityFilter === "all" || property.location === cityFilter;
      const matchesType = typeFilter === "all" || property.type === typeFilter;

      return matchesSearch && matchesAvailability && matchesCity && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return extractPriceValue(a.price) - extractPriceValue(b.price);
        case "price-desc":
          return extractPriceValue(b.price) - extractPriceValue(a.price);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "location-asc":
          return a.location.localeCompare(b.location);
        case "location-desc":
          return b.location.localeCompare(a.location);
        default:
          return 0;
      }
    });

  const resetFilters = () => {
    setSearchTerm("");
    setSortBy("default");
    setAvailabilityFilter("all");
    setCityFilter("all");
    setTypeFilter("all");
  };

  return (
    <section id="nemovitosti" className="py-24 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Nemovitosti</h2>
        
        {/* Vyhledávací pole */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Hledat nemovitosti..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pl-12 bg-white border-2 border-neutral-200 rounded-full text-neutral-700 placeholder-neutral-500 focus:outline-none focus:border-black transition-colors shadow-sm"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {searchTerm && (
              <div className="mt-2 text-center text-sm text-neutral-600">
                Nalezeno {filteredAndSortedProperties.length} nemovitostí
              </div>
            )}
          </div>
        </div>

        {/* Filtry a řazení */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Řazení */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Řazení</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="default">Výchozí</option>
                  <option value="price-asc">Od nejlevnějšího</option>
                  <option value="price-desc">Od nejdražšího</option>
                  <option value="name-asc">Název A-Z</option>
                  <option value="name-desc">Název Z-A</option>
                  <option value="location-asc">Lokalita A-Z</option>
                  <option value="location-desc">Lokalita Z-A</option>
                </select>
              </div>

              {/* Filtrování podle dostupnosti */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Dostupnost</label>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="all">Všechny</option>
                  {availableStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Filtrování podle města */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Město</label>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="all">Všechna města</option>
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Filtrování podle typu */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Typ nemovitosti</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="all">Všechny typy</option>
                  {availableTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Tlačítko pro obnovení filtrů */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-medium rounded-md px-3 py-2 text-sm transition-colors"
                >
                  Obnovit filtry
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {(showAll ? filteredAndSortedProperties : filteredAndSortedProperties.slice(0, 6)).map((p, i) => (
            <div
              key={p.id || i}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-transform duration-200 group hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col gap-2">
                <div className="text-neutral-600 text-sm">{p.type}</div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-lg">{p.name}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[p.status]}`}>{p.status}</span>
                </div>
                <div className="text-neutral-600 text-sm">
  {p.street || p.streetNumber || p.city || p.zip
    ? [p.street, p.streetNumber].filter(Boolean).join(' ') + ', ' + [p.zip, p.city].filter(Boolean).join(' ')
    : p.location}
</div>
                <div className="mt-auto text-gold-700 font-bold text-lg">{p.price}</div>
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-black hover:bg-neutral-800 text-white font-semibold rounded-full px-6 py-2 text-sm shadow transition-colors text-center w-full truncate overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    Prohlédnout
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredAndSortedProperties.length === 0 && (searchTerm || availabilityFilter !== "all" || cityFilter !== "all" || typeFilter !== "all") && (
          <div className="text-center py-12">
            <p className="text-neutral-600 text-lg">Žádné nemovitosti nebyly nalezeny pro zadané filtry</p>
            <button
              onClick={resetFilters}
              className="mt-4 bg-black hover:bg-neutral-800 text-white font-semibold rounded-full px-6 py-2 transition-colors"
            >
              Zobrazit všechny nemovitosti
            </button>
          </div>
        )}
        
        {!showAll && filteredAndSortedProperties.length > 6 && (
          <div className="flex justify-center mt-24">
            <a
              href="/katalog"
              className="bg-black hover:bg-neutral-800 text-white font-semibold rounded-full px-8 py-4 text-lg shadow-lg transition-colors"
            >
              Zobrazit celý katalog
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Properties; 