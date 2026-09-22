import React, { useState } from 'react';
import { useCar } from '../context/CarContext.tsx';
import {
  Search,
  Filter,
  RotateCcw,
  Bookmark,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sliders,
} from 'lucide-react';

const brandsList = [
  'Porsche',
  'BMW',
  'Audi',
  'Mercedes-Benz',
  'Volkswagen',
  'Tesla',
  'Volvo',
  'Renault',
  'Peugeot',
  'Toyota',
  'Ford',
  'Cupra',
  'Ferrari',
  'Land Rover',
];

const europeanCountries = [
  { code: 'Alemania', name: '🇩🇪 Alemania' },
  { code: 'España', name: '🇪🇸 España' },
  { code: 'Francia', name: '🇫🇷 Francia' },
  { code: 'Italia', name: '🇮🇹 Italia' },
  { code: 'Países Bajos', name: '🇳🇱 Países Bajos' },
  { code: 'Bélgica', name: '🇧🇪 Bélgica' },
  { code: 'Portugal', name: '🇵🇹 Portugal' },
  { code: 'Austria', name: '🇦🇹 Austria' },
  { code: 'Suiza', name: '🇨🇭 Suiza' },
];

const fuelTypes = [
  'Gasolina',
  'Diésel',
  'Híbrido',
  'Híbrido Enchufable',
  'Eléctrico',
  'GLP',
];

const bodyTypes = [
  'SUV',
  'Sedán',
  'Compacto',
  'Familiar',
  'Coupé',
  'Cabrio',
  'Furgoneta',
];

export const CarFiltersBar: React.FC = () => {
  const {
    filters,
    setFilters,
    resetFilters,
    savedSearches,
    saveCurrentSearch,
    applySavedSearch,
  } = useCar();

  const [expanded, setExpanded] = useState(false);
  const [saveSearchOpen, setSaveSearchOpen] = useState(false);
  const [searchName, setSearchName] = useState('');

  const handleSaveSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) return;
    await saveCurrentSearch(searchName.trim());
    setSearchName('');
    setSaveSearchOpen(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl shadow-slate-950/40 mb-8">
      {/* Top Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center">
        {/* Keyword Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Buscar por marca, modelo, ciudad o palabras clave (ej: Carrera, M Sport, Madrid)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Quick Brand Selector */}
        <div className="w-full md:w-52">
          <select
            value={filters.brand || 'all'}
            onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Todas las marcas</option>
            {brandsList.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* European Country Selector */}
        <div className="w-full md:w-52">
          <select
            value={filters.country || 'all'}
            onChange={(e) => setFilters((prev) => ({ ...prev, country: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">🇪🇺 Toda Europa</option>
            {europeanCountries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer w-full md:w-auto justify-center ${
            expanded
              ? 'bg-blue-600 text-white border-blue-500'
              : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Filtros avanzados</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Filter Pills (Direct vs Secure Affiliate Sale) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">Tipo de venta:</span>

          <button
            onClick={() => setFilters((prev) => ({ ...prev, saleType: 'all' }))}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filters.saleType === 'all' || !filters.saleType
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Todos los coches
          </button>

          <button
            onClick={() => setFilters((prev) => ({ ...prev, saleType: 'secure_affiliate' }))}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filters.saleType === 'secure_affiliate'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-emerald-400 hover:bg-slate-750'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Venta Segura con Agente
          </button>

          <button
            onClick={() => setFilters((prev) => ({ ...prev, saleType: 'direct' }))}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filters.saleType === 'direct'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-blue-300 hover:bg-slate-750'
            }`}
          >
            Venta Directa
          </button>

          <button
            onClick={() => setFilters((prev) => ({ ...prev, promotionOnly: !prev.promotionOnly }))}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filters.promotionOnly
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-amber-300 hover:bg-slate-750'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Solo Destacados & Certificados
          </button>
        </div>

        {/* Sort and Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Ordenar por:</span>
            <select
              value={filters.sortBy || 'price_asc'}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="price_asc">Precio: más barato</option>
              <option value="price_desc">Precio: más alto</option>
              <option value="year_desc">Año: más recientes</option>
              <option value="mileage_asc">Kilometraje: menor</option>
              <option value="views_desc">Más populares</option>
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Restablecer todos los filtros"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSaveSearchOpen(true)}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded-lg hover:bg-blue-900/30 transition-colors cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Guardar búsqueda</span>
          </button>
        </div>
      </div>

      {/* Expanded Filters Section */}
      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-800/80 animate-in fade-in duration-200">
          {/* Price Range */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Precio (€)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Mínimo"
                value={filters.minPrice || ''}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <span className="text-slate-500 text-xs">-</span>
              <input
                type="number"
                placeholder="Máximo"
                value={filters.maxPrice || ''}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Year Range */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Año de matriculación</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Desde (ej: 2018)"
                value={filters.minYear || ''}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minYear: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <span className="text-slate-500 text-xs">-</span>
              <input
                type="number"
                placeholder="Hasta (ej: 2025)"
                value={filters.maxYear || ''}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxYear: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Mileage (km) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Kilómetros máximos</label>
            <select
              value={filters.maxMileage || ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  maxMileage: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">Cualquier kilometraje</option>
              <option value="30000">Hasta 30.000 km</option>
              <option value="60000">Hasta 60.000 km</option>
              <option value="100000">Hasta 100.000 km</option>
              <option value="150000">Hasta 150.000 km</option>
            </select>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Combustible</label>
            <select
              value={filters.fuelType || 'all'}
              onChange={(e) => setFilters((prev) => ({ ...prev, fuelType: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Todos los combustibles</option>
              {fuelTypes.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Caja de cambios</label>
            <select
              value={filters.transmission || 'all'}
              onChange={(e) => setFilters((prev) => ({ ...prev, transmission: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Cualquier cambio</option>
              <option value="Automático">Automático</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          {/* Body Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tipo de Carrocería</label>
            <select
              value={filters.bodyType || 'all'}
              onChange={(e) => setFilters((prev) => ({ ...prev, bodyType: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Cualquier carrocería</option>
              {bodyTypes.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Specific City */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ciudad o Código Postal</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Ej: Múnich, Madrid, Lyon..."
                value={filters.city || ''}
                onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Saved Searches Chips if any */}
      {savedSearches.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium shrink-0">Búsquedas guardadas:</span>
          {savedSearches.map((s) => (
            <button
              key={s.id}
              onClick={() => applySavedSearch(s)}
              className="bg-slate-800 hover:bg-slate-750 text-blue-300 px-2.5 py-1 rounded-md border border-slate-700 whitespace-nowrap cursor-pointer transition-colors"
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* Save Search Modal */}
      {saveSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Guardar búsqueda personalizada</h3>
            <p className="text-xs text-slate-400 mb-4">
              Guarda tus criterios actuales para recibir alertas o aplicarlos rápidamente en futuras visitas.
            </p>
            <form onSubmit={handleSaveSearch}>
              <input
                type="text"
                required
                placeholder="Ej: Porsche 911 en Alemania < 140k"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white mb-4 focus:outline-none focus:border-blue-500"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSaveSearchOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
                >
                  Guardar Búsqueda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
