import React, { useState } from 'react';
import { useCar } from '../context/CarContext.tsx';
import { CarCard } from '../components/CarCard.tsx';
import { CarFiltersBar } from '../components/CarFiltersBar.tsx';
import { HeroCar3DBackground } from '../components/HeroCar3DBackground.tsx';
import { ThreeDIcon } from '../components/ThreeDIcon.tsx';
import {
  Car as CarIcon,
  ShieldCheck,
  Scale,
  Sparkles,
  ArrowRight,
  LayoutGrid,
  List,
  Search,
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal,
  X,
} from 'lucide-react';

export const SearchView: React.FC = () => {
  const {
    cars,
    loading,
    filters,
    setFilters,
    comparisonCars,
    removeFromComparison,
    clearComparison,
    setActiveView,
  } = useCar();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [heroSearchBrand, setHeroSearchBrand] = useState(filters.brand && filters.brand !== 'all' ? filters.brand : '');
  const [heroSearchQuery, setHeroSearchQuery] = useState(filters.search || '');
  const [heroSearchMaxPrice, setHeroSearchMaxPrice] = useState(filters.maxPrice ? String(filters.maxPrice) : '');

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      brand: heroSearchBrand || 'all',
      search: heroSearchQuery || '',
      maxPrice: heroSearchMaxPrice ? Number(heroSearchMaxPrice) : undefined,
    }));

    const el = document.getElementById('inventory-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero European Banner with 3D Automotive Highway & Streamlines */}
      <div className="relative mb-8 rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border border-slate-800 p-6 sm:p-10 lg:p-12 shadow-2xl transition-all duration-300 group">
        {/* Interactive 3D Canvas Highway & Automotive Hologram */}
        <HeroCar3DBackground />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>European Automotive Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08] mb-4">
            Find your next car.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
            Venta directa entre particulares y profesionales, o <strong className="text-white font-semibold">Venta Segura con Agente Afiliado</strong> que inspecciona 150 puntos, garantiza el pago seguro y gestiona la exportación y matriculación.
          </p>

          {/* Primary Actions: Buy a Car, Sell My Car, Secure Sale */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              onClick={() => {
                const el = document.getElementById('inventory-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Buy a Car</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveView('publish')}
              className="px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-bold text-sm border border-slate-700/80 flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <ThreeDIcon name="sell" size="sm" glow={false} />
              <span>Sell My Car</span>
            </button>

            <button
              onClick={() => setActiveView('secure_info')}
              className="px-5 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 font-bold text-sm border border-emerald-500/40 flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <ThreeDIcon name="secure" size="sm" glow={false} />
              <span>Secure Sale</span>
            </button>
          </div>

          {/* Prominent Modern Search Bar in Hero */}
          <form
            onSubmit={handleHeroSearchSubmit}
            className="p-2.5 bg-slate-950/85 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 max-w-xl"
          >
            <div className="w-full sm:w-1/3">
              <select
                value={heroSearchBrand}
                onChange={(e) => setHeroSearchBrand(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">Todas las marcas</option>
                <option value="Porsche">Porsche</option>
                <option value="BMW">BMW</option>
                <option value="Audi">Audi</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Tesla">Tesla</option>
                <option value="Ferrari">Ferrari</option>
              </select>
            </div>

            <div className="w-full sm:w-1/3">
              <input
                type="text"
                placeholder="Modelo o palabra clave..."
                value={heroSearchQuery}
                onChange={(e) => setHeroSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
              />
            </div>

            <div className="w-full sm:w-1/3 flex items-center gap-2">
              <input
                type="number"
                placeholder="Máx €"
                value={heroSearchMaxPrice}
                onChange={(e) => setHeroSearchMaxPrice(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
              />

              <button
                type="submit"
                className="h-9 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1 shrink-0 transition-colors cursor-pointer shadow-md shadow-blue-600/30"
                title="Buscar coches"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Buscar</span>
              </button>
            </div>
          </form>
        </div>

        {/* 3D Features Navigation Ribbon */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8 pt-6 border-t border-slate-800/80">
          <div
            onClick={() => {
              const el = document.getElementById('inventory-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800/90 hover:border-blue-500/40 transition-all cursor-pointer group"
          >
            <ThreeDIcon name="search" size="sm" />
            <div>
              <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">Search</div>
              <div className="text-[10px] text-slate-400">Catálogo UE</div>
            </div>
          </div>

          <div
            onClick={() => setActiveView('publish')}
            className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800/90 hover:border-amber-500/40 transition-all cursor-pointer group"
          >
            <ThreeDIcon name="sell" size="sm" />
            <div>
              <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">Sell</div>
              <div className="text-[10px] text-slate-400">Asistente IA</div>
            </div>
          </div>

          <div
            onClick={() => setActiveView('compare')}
            className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800/90 hover:border-indigo-500/40 transition-all cursor-pointer group"
          >
            <ThreeDIcon name="compare" size="sm" />
            <div>
              <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">Compare</div>
              <div className="text-[10px] text-slate-400">Ficha 3D</div>
            </div>
          </div>

          <div
            onClick={() => setActiveView('secure_info')}
            className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800/90 hover:border-emerald-500/40 transition-all cursor-pointer group"
          >
            <ThreeDIcon name="secure" size="sm" />
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Secure Sale</div>
              <div className="text-[10px] text-slate-400">Escrow & Agente</div>
            </div>
          </div>

          <div
            onClick={() => setActiveView('chat')}
            className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800/90 hover:border-blue-500/40 transition-all cursor-pointer group"
          >
            <ThreeDIcon name="messages" size="sm" />
            <div>
              <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">Messages</div>
              <div className="text-[10px] text-slate-400">Chat & Ofertas</div>
            </div>
          </div>

          <div
            onClick={() => setActiveView('seller_dashboard')}
            className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800/90 hover:border-teal-500/40 transition-all cursor-pointer group"
          >
            <ThreeDIcon name="dashboard" size="sm" />
            <div>
              <div className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors">Dashboard</div>
              <div className="text-[10px] text-slate-400">SaaS Metrics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <CarFiltersBar />

      {/* Results Header */}
      <div id="inventory-section" className="flex items-center justify-between mb-6 pt-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Vehículos disponibles</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
              {cars.length} coches
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Mostrando resultados ordenados con prioridad a vehículos certificados y seguros
          </p>
        </div>

        {/* Grid / List view toggle */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Vista en cuadrícula"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Vista en lista"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cars Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl h-80 animate-pulse p-4 flex flex-col justify-between"
            >
              <div className="w-full h-44 bg-slate-800 rounded-xl" />
              <div className="space-y-2">
                <div className="w-3/4 h-4 bg-slate-800 rounded" />
                <div className="w-1/2 h-4 bg-slate-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : cars.length === 0 ? (
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-12 text-center max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
            <CarIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No se encontraron vehículos</h3>
          <p className="text-xs text-slate-400 mb-6">
            Prueba a ampliar los filtros de precio, kilometraje o seleccionar toda Europa.
          </p>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}
        >
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}

      {/* Floating Comparison Drawer (Sticky Bottom Bar) */}
      {comparisonCars.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl bg-slate-900/95 backdrop-blur-md border border-blue-500/40 rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3 overflow-x-auto">
            <div className="flex items-center gap-1.5 text-blue-400 font-bold text-sm shrink-0">
              <Scale className="w-4 h-4" />
              <span>Comparando ({comparisonCars.length}/4):</span>
            </div>

            <div className="flex items-center gap-2">
              {comparisonCars.map((car) => (
                <div
                  key={car.id}
                  className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-xl text-xs text-slate-200"
                >
                  <span className="font-semibold">{car.brand} {car.model}</span>
                  <button
                    onClick={() => removeFromComparison(car.id)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clearComparison}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Limpiar
            </button>
            <button
              onClick={() => setActiveView('compare')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer transition-all"
            >
              <span>Ver Comparativa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
