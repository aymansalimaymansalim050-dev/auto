import React, { useState } from 'react';
import { useCar } from '../context/CarContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Scale,
  X,
  Plus,
  ArrowRight,
  ShieldCheck,
  Zap,
  Check,
  Sparkles,
  Info,
} from 'lucide-react';

export const ComparisonView: React.FC = () => {
  const {
    comparisonCars,
    removeFromComparison,
    clearComparison,
    setSelectedCar,
    setActiveView,
    setChatCar,
  } = useCar();

  const { formatPrice } = useAuth();
  const [highlightDifferences, setHighlightDifferences] = useState(true);

  if (comparisonCars.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No has seleccionado coches para comparar</h2>
        <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
          Explora el catálogo y pulsa en "Comparar" en los coches que te interesen para contrastar sus especificaciones técnicas cara a cara.
        </p>
        <button
          onClick={() => setActiveView('search')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          Ir al Catálogo de Coches
        </button>
      </div>
    );
  }

  // Find best values for automatic highlighting
  const minPrice = Math.min(...comparisonCars.map((c) => c.price));
  const minKm = Math.min(...comparisonCars.map((c) => c.mileage));
  const maxHp = Math.max(...comparisonCars.map((c) => c.powerHp));
  const maxYear = Math.max(...comparisonCars.map((c) => c.year));

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
            <Scale className="w-3.5 h-3.5" />
            <span>Comparativa Técnica Multivehículo</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Comparativa de Coches ({comparisonCars.length} de 4)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compara precios, mecánicas, emisiones y tipos de venta en toda Europa.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={highlightDifferences}
              onChange={(e) => setHighlightDifferences(e.target.checked)}
              className="rounded border-slate-700 text-blue-600 focus:ring-0"
            />
            <span>Resaltar mejores valores</span>
          </label>

          <button
            onClick={clearComparison}
            className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
          >
            Limpiar todo
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header Row: Car Photos & Titles */}
          <div className="grid grid-cols-5 border-b border-slate-800 p-4 bg-slate-950/60">
            <div className="col-span-1 flex flex-col justify-end p-2 text-xs font-bold text-slate-400 uppercase">
              Vehículo
            </div>

            {comparisonCars.map((car) => (
              <div key={car.id} className="col-span-1 p-2 flex flex-col justify-between relative group">
                <button
                  onClick={() => removeFromComparison(car.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/90 text-slate-400 hover:text-white hover:bg-rose-600 transition-colors z-10"
                  title="Eliminar de la comparativa"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-slate-950">
                  <img
                    src={car.images && car.images.length > 0 ? car.images[0] : ''}
                    alt={car.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  {car.brand} {car.model}
                </div>
                <h4
                  onClick={() => {
                    setSelectedCar(car);
                    setActiveView('detail');
                  }}
                  className="text-sm font-bold text-white hover:text-blue-400 transition-colors cursor-pointer line-clamp-1 mb-2"
                >
                  {car.title}
                </h4>

                <div className="text-lg font-black text-white mb-2">
                  {formatPrice(car.price)}
                </div>

                <button
                  onClick={() => {
                    setSelectedCar(car);
                    setActiveView('detail');
                  }}
                  className="w-full py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-center"
                >
                  Ver Ficha
                </button>
              </div>
            ))}

            {/* Placeholder if less than 4 cars */}
            {Array.from({ length: 4 - comparisonCars.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                onClick={() => setActiveView('search')}
                className="col-span-1 p-4 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-slate-700 transition-colors m-2"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-400">Añadir otro coche</span>
              </div>
            ))}
          </div>

          {/* Comparison Rows */}
          <div className="divide-y divide-slate-800/80 text-xs">
            {/* Price */}
            <div className="grid grid-cols-5 p-4 items-center">
              <div className="font-semibold text-slate-400">Precio</div>
              {comparisonCars.map((car) => {
                const isBest = highlightDifferences && car.price === minPrice;
                return (
                  <div key={car.id} className="p-2 font-bold text-sm">
                    <span className={isBest ? 'text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-md border border-emerald-500/30' : 'text-slate-100'}>
                      {formatPrice(car.price)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Year */}
            <div className="grid grid-cols-5 p-4 items-center bg-slate-950/20">
              <div className="font-semibold text-slate-400">Año de Matriculación</div>
              {comparisonCars.map((car) => {
                const isBest = highlightDifferences && car.year === maxYear;
                return (
                  <div key={car.id} className="p-2 font-medium">
                    <span className={isBest ? 'text-blue-400 font-bold' : 'text-slate-200'}>
                      {car.year}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mileage */}
            <div className="grid grid-cols-5 p-4 items-center">
              <div className="font-semibold text-slate-400">Kilómetros</div>
              {comparisonCars.map((car) => {
                const isBest = highlightDifferences && car.mileage === minKm;
                return (
                  <div key={car.id} className="p-2 font-medium">
                    <span className={isBest ? 'text-emerald-400 font-bold bg-emerald-950/60 px-2 py-1 rounded-md border border-emerald-500/30' : 'text-slate-200'}>
                      {car.mileage.toLocaleString()} km
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Power */}
            <div className="grid grid-cols-5 p-4 items-center bg-slate-950/20">
              <div className="font-semibold text-slate-400">Potencia (CV)</div>
              {comparisonCars.map((car) => {
                const isBest = highlightDifferences && car.powerHp === maxHp;
                return (
                  <div key={car.id} className="p-2 font-medium">
                    <span className={isBest ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                      {car.powerHp} CV
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Fuel Type */}
            <div className="grid grid-cols-5 p-4 items-center">
              <div className="font-semibold text-slate-400">Combustible</div>
              {comparisonCars.map((car) => (
                <div key={car.id} className="p-2 text-slate-200 font-medium">
                  {car.fuelType}
                </div>
              ))}
            </div>

            {/* Transmission */}
            <div className="grid grid-cols-5 p-4 items-center bg-slate-950/20">
              <div className="font-semibold text-slate-400">Caja de Cambios</div>
              {comparisonCars.map((car) => (
                <div key={car.id} className="p-2 text-slate-200 font-medium">
                  {car.transmission}
                </div>
              ))}
            </div>

            {/* Body Type */}
            <div className="grid grid-cols-5 p-4 items-center">
              <div className="font-semibold text-slate-400">Carrocería</div>
              {comparisonCars.map((car) => (
                <div key={car.id} className="p-2 text-slate-200 font-medium">
                  {car.bodyType}
                </div>
              ))}
            </div>

            {/* Sale Type */}
            <div className="grid grid-cols-5 p-4 items-center bg-slate-950/20">
              <div className="font-semibold text-slate-400">Modalidad de Venta</div>
              {comparisonCars.map((car) => (
                <div key={car.id} className="p-2">
                  {car.saleType === 'secure_affiliate' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950 px-2 py-1 rounded-md border border-emerald-500/40">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Venta Segura con Agente
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-300 bg-blue-950 px-2 py-1 rounded-md border border-blue-500/40">
                      Venta Directa
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Location */}
            <div className="grid grid-cols-5 p-4 items-center">
              <div className="font-semibold text-slate-400">Ubicación Europea</div>
              {comparisonCars.map((car) => (
                <div key={car.id} className="p-2 text-slate-200">
                  <span className="font-semibold">{car.city}</span> ({car.country})
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-5 p-4 items-center bg-slate-950/40">
              <div className="font-semibold text-slate-400">Contactar</div>
              {comparisonCars.map((car) => (
                <div key={car.id} className="p-2">
                  <button
                    onClick={() => {
                      setChatCar(car);
                      setActiveView('chat');
                    }}
                    className="w-full py-2 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/30"
                  >
                    Negociar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
