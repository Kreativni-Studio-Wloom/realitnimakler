"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { db, storage } from '@/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDoc, query, orderBy, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import PropertyMap from '@/components/PropertyMap';

interface Property {
  id: string;
  img: string;
  name: string;
  type: string;
  location: string;
  price: string;
  status: string;
  link: string;
  createdAt: number;
  updatedAt: number;
  order: number; // Přidáno pro řazení
}

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [newProperty, setNewProperty] = useState({
    img: '',
    name: '',
    type: '',
    location: '',
    price: '',
    status: 'K dispozici',
    link: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isEditingUploading, setIsEditingUploading] = useState(false);
  const [editingUploadError, setEditingUploadError] = useState('');
  const [sortVersion, setSortVersion] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const router = useRouter();

  // Kontrola přihlášení
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // Načítání inzerátů z Firestore v reálném čase
    const propertiesRef = collection(db, 'properties');
    // Nejprve řadím podle 'order', fallback podle 'createdAt'
    const q = query(propertiesRef, orderBy('order', 'asc'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedProperties: Property[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() ?? new Date(),
      })) as Property[];
      setProperties(loadedProperties);
    });
    return () => unsubscribe();
  }, []);

  const saveProperties = async (newProperties: Property[]) => {
    const propertiesRef = collection(db, 'properties');
    const batch = [];
    for (const property of newProperties) {
      const docRef = doc(propertiesRef, property.id);
      batch.push(updateDoc(docRef, { ...property, updatedAt: serverTimestamp() }));
    }
    await Promise.all(batch);
    // Vyslat custom event pro aktualizaci komponenty Properties
    window.dispatchEvent(new Event('propertiesUpdated'));
  };

  const saveOrder = async (orderedProperties: Property[]) => {
    const propertiesRef = collection(db, 'properties');
    const batch = writeBatch(db);
    orderedProperties.forEach((property, idx) => {
      const docRef = doc(propertiesRef, property.id);
      batch.update(docRef, { order: idx, updatedAt: serverTimestamp() });
    });
    await batch.commit();
    window.dispatchEvent(new Event('propertiesUpdated'));
  };

  // Generování dostupných filtrů z dat
  const availableCities = Array.from(new Set(properties.map(p => (typeof p.location === 'string' ? p.location.split(', ').pop() : '')).filter(Boolean)));
  const availableTypes = Array.from(new Set(properties.map(p => p.type).filter(Boolean)));
  const availableStatuses = Array.from(new Set(properties.map(p => p.status).filter(Boolean)));

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
      const matchesCity = cityFilter === "all" || property.location.includes(cityFilter);
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

  const handleAddProperty = async () => {
    if (!newProperty.img || !newProperty.name || !newProperty.type || !newProperty.location || !newProperty.price) {
      alert('Vyplňte všechny povinné údaje');
      return;
    }
    setLoading(true);
    try {
      const propertiesRef = collection(db, 'properties');
      const order = properties.length;
      await addDoc(propertiesRef, {
        ...newProperty,
        order,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setNewProperty({
        img: '',
        name: '',
        type: '',
        location: '',
        price: '',
        status: 'K dispozici',
        link: ''
      });
      setIsAdding(false);
    } catch (e) {
      alert('Chyba při ukládání inzerátu');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProperty = async () => {
    if (!editingProperty) return;

    const propertiesRef = collection(db, 'properties');
    const docRef = doc(propertiesRef, editingProperty.id);
    await updateDoc(docRef, { ...editingProperty, updatedAt: serverTimestamp() });

    const updatedProperties = properties.map(p => 
      p.id === editingProperty.id ? { ...editingProperty, updatedAt: Date.now() } : p
    );
    await saveProperties(updatedProperties);
    setEditingProperty(null);
  };

  const handleDeleteProperty = async (id: string) => {
    if (confirm('Opravdu chcete smazat tuto nemovitost?')) {
      const propertiesRef = collection(db, 'properties');
      const docRef = doc(propertiesRef, id);
      await deleteDoc(docRef);
      const updatedProperties = properties.filter(p => p.id !== id);
      await saveProperties(updatedProperties);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    router.push('/login');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success && result.url) {
        setNewProperty({ ...newProperty, img: result.url });
      } else {
        setUploadError(result.error || 'Chyba při nahrávání souboru');
      }
    } catch (error: any) {
      setUploadError('Chyba při nahrávání souboru: ' + (error?.message || ''));
      console.error('Webhosting upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editingProperty) return;

    setIsEditingUploading(true);
    setEditingUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success && result.url) {
        setEditingProperty({ ...editingProperty, img: result.url });
      } else {
        setEditingUploadError(result.error || 'Chyba při nahrávání souboru');
      }
    } catch (error: any) {
      setEditingUploadError('Chyba při nahrávání souboru: ' + (error?.message || ''));
      console.error('Webhosting upload error:', error);
    } finally {
      setIsEditingUploading(false);
    }
  };

  const statusColors: Record<string, string> = {
    "Prodáno": "bg-red-500 text-white",
    "Rezervace": "bg-yellow-400 text-neutral-900",
    "Pronajato": "bg-orange-500 text-white",
    "K dispozici": "bg-green-600 text-white",
  };

  const statusOrder = ["K dispozici", "Rezervace", "Pronajato", "Prodáno"];

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(properties);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    // Uložím nové pořadí do Firestore
    saveOrder(reordered);
  };

  const handleAutoSort = () => {
    const sorted = [...properties].sort((a, b) => {
      // Řadím podle createdAt - nejnověji přidané nahoře
      return b.createdAt - a.createdAt;
    });
    saveProperties(sorted);
    setSortVersion(v => v + 1);
  };

  function SortableProperty({ property, index, statusColors, setEditingProperty, handleDeleteProperty }: {
    property: Property,
    index: number,
    statusColors: Record<string, string>,
    setEditingProperty: (p: Property) => void,
    handleDeleteProperty: (id: string) => void
  }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id: property.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow ${isDragging ? 'ring-2 ring-gold-700' : ''}`}
      >
        <div className="relative h-48">
          <Image
            src={property.img}
            alt={property.name + ' ' + property.location}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <div className="text-neutral-600 text-sm mb-1">{property.type}</div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">{property.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[property.status]}`}>
              {property.status}
            </span>
          </div>
          <p className="text-neutral-600 text-sm mb-2">{property.location}</p>
          <p className="font-bold text-gold-700 mb-4">{property.price}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setEditingProperty(property)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              Upravit
            </button>
            <button
              onClick={() => handleDeleteProperty(property.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Smazat
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDndKitDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = properties.findIndex((p) => p.id === active.id);
      const newIndex = properties.findIndex((p) => p.id === over.id);
      const newProps = arrayMove(properties, oldIndex, newIndex);
      saveOrder(newProps);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/')}
                className="bg-black hover:bg-neutral-800 text-white px-4 py-2 rounded-md"
              >
                Zpět na úvodní stránku
              </button>
              <button
                onClick={() => setIsAdding(true)}
                className="bg-black hover:bg-neutral-800 text-white px-4 py-2 rounded-md font-medium"
              >
                Přidat nemovitost
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Odhlásit se
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Formulář pro přidání nové nemovitosti */}
        {isAdding && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Přidat novou nemovitost</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">Obrázek nemovitosti</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="URL obrázku nebo nahrajte soubor"
                    value={newProperty.img ?? ""}
                    onChange={(e) => setNewProperty({...newProperty, img: e.target.value})}
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer text-sm font-medium">
                    {isUploading ? 'Nahrávání...' : 'Nahrát obrázek'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
                {uploadError && (
                  <p className="text-red-600 text-sm">{uploadError}</p>
                )}
                {newProperty.img && (
                  <div className="mt-2">
                    <img 
                      src={newProperty.img} 
                      alt="Náhled" 
                      className="w-32 h-24 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="Název nemovitosti"
                value={newProperty.name ?? ""}
                onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Typ nemovitosti"
                value={newProperty.type ?? ""}
                onChange={(e) => setNewProperty({...newProperty, type: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Lokalita"
                value={newProperty.location ?? ""}
                onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Cena"
                value={newProperty.price ?? ""}
                onChange={(e) => setNewProperty({...newProperty, price: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <select
                value={newProperty.status}
                onChange={(e) => setNewProperty({...newProperty, status: e.target.value})}
                className="border rounded px-3 py-2"
              >
                <option value="K dispozici">K dispozici</option>
                <option value="Rezervace">Rezervace</option>
                <option value="Pronajato">Pronajato</option>
                <option value="Prodáno">Prodáno</option>
              </select>
              <input
                type="url"
                placeholder="Odkaz pro tlačítko 'Prohlédnout' (volitelné)"
                value={newProperty.link ?? ""}
                onChange={(e) => setNewProperty({...newProperty, link: e.target.value})}
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddProperty}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                disabled={loading}
              >
                {loading ? 'Ukládám...' : 'Uložit'}
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="bg-neutral-500 hover:bg-neutral-600 text-white px-4 py-2 rounded-md"
              >
                Zrušit
              </button>
            </div>
          </div>
        )}

        {/* Seznam nemovitostí */}

        {/* Vyhledávání a filtry */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Vyhledávací pole */}
          <div className="mb-6">
            <div className="max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Hledat nemovitosti..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-white border-2 border-neutral-200 rounded-lg text-neutral-700 placeholder-neutral-500 focus:outline-none focus:border-black transition-colors"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400"
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
                <div className="mt-2 text-sm text-neutral-600">
                  Nalezeno {filteredAndSortedProperties.length} nemovitostí
                </div>
              )}
            </div>
          </div>

          {/* Filtry a řazení */}
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
                {availableStatuses.map((status, idx) => (
                  <option key={status || 'empty-status-' + idx} value={status}>{status || '(neuvedeno)'}</option>
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
                {availableCities.map((city, idx) => (
                  <option key={city || 'empty-city-' + idx} value={city}>{city || '(neuvedeno)'}</option>
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
                {availableTypes.map((type, idx) => (
                  <option key={type || 'empty-type-' + idx} value={type}>{type || '(neuvedeno)'}</option>
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

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDndKitDragEnd}>
          <SortableContext key={sortVersion} items={filteredAndSortedProperties.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProperties.map((property, index) => (
                <SortableProperty
                  key={property.id}
                  property={property}
                  index={index}
                  statusColors={statusColors}
                  setEditingProperty={setEditingProperty}
                  handleDeleteProperty={handleDeleteProperty}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Zpráva o prázdných výsledcích */}
        {filteredAndSortedProperties.length === 0 && (searchTerm || availabilityFilter !== "all" || cityFilter !== "all" || typeFilter !== "all") && (
          <div className="text-center py-12">
            <p className="text-neutral-600 text-lg">Žádné nemovitosti nebyly nalezeny pro zadané filtry</p>
            <button
              onClick={resetFilters}
              className="mt-4 bg-black hover:bg-neutral-800 text-white font-semibold rounded-md px-6 py-2 transition-colors"
            >
              Zobrazit všechny nemovitosti
            </button>
          </div>
        )}

        {/* Mapa nemovitostí */}
        {filteredAndSortedProperties.length > 0 && (
          <div className="mt-12">
            {/* Odstraň z renderu dashboardu blok s <PropertyMap ... /> */}
          </div>
        )}
      </div>

      {/* Modal pro editaci */}
      {editingProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Upravit nemovitost</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">Obrázek nemovitosti</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="URL obrázku nebo nahrajte soubor"
                    value={editingProperty?.img ?? ""}
                    onChange={(e) => setEditingProperty(editingProperty ? {...editingProperty, img: e.target.value} : null)}
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer text-sm font-medium">
                    {isEditingUploading ? 'Nahrávání...' : 'Nahrát obrázek'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditFileUpload}
                      className="hidden"
                      disabled={isEditingUploading}
                    />
                  </label>
                </div>
                {editingUploadError && (
                  <p className="text-red-600 text-sm">{editingUploadError}</p>
                )}
                {editingProperty.img && (
                  <div className="mt-2">
                    <img 
                      src={editingProperty.img} 
                      alt="Náhled" 
                      className="w-32 h-24 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="Název nemovitosti"
                value={editingProperty?.name ?? ""}
                onChange={(e) => setEditingProperty(editingProperty ? {...editingProperty, name: e.target.value} : null)}
                className="border rounded px-3 py-2 w-full"
              />
              <input
                type="text"
                placeholder="Typ nemovitosti"
                value={editingProperty?.type ?? ""}
                onChange={(e) => setEditingProperty(editingProperty ? {...editingProperty, type: e.target.value} : null)}
                className="border rounded px-3 py-2 w-full"
              />
              <input
                type="text"
                placeholder="Lokalita"
                value={editingProperty?.location ?? ""}
                onChange={(e) => setEditingProperty(editingProperty ? {...editingProperty, location: e.target.value} : null)}
                className="border rounded px-3 py-2 w-full"
              />
              <input
                type="text"
                placeholder="Cena"
                value={editingProperty?.price ?? ""}
                onChange={(e) => setEditingProperty(editingProperty ? {...editingProperty, price: e.target.value} : null)}
                className="border rounded px-3 py-2 w-full"
              />
              <select
                value={editingProperty.status}
                onChange={(e) => setEditingProperty({...editingProperty, status: e.target.value})}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="K dispozici">K dispozici</option>
                <option value="Rezervace">Rezervace</option>
                <option value="Pronajato">Pronajato</option>
                <option value="Prodáno">Prodáno</option>
              </select>
              <input
                type="url"
                placeholder="Odkaz pro tlačítko 'Prohlédnout' (volitelné)"
                value={editingProperty?.link ?? ""}
                onChange={(e) => setEditingProperty(editingProperty ? {...editingProperty, link: e.target.value} : null)}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleEditProperty}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Uložit
              </button>
              <button
                onClick={() => setEditingProperty(null)}
                className="bg-neutral-500 hover:bg-neutral-600 text-white px-4 py-2 rounded-md"
              >
                Zrušit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 