import React from 'react';
import { useCar } from '../context/CarContext.tsx';
import { CarCard } from '../components/CarCard.tsx';
import { Heart, ArrowRight, Car as CarIcon } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { favorites, setActiveView } = useCar();

  return (
    <div className="max-w-7xl mx-auto pb-24">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
          <Heart className="w-3.5 h-3.5" />
          <span>Garaje de Favoritos</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Tus Coches Guardados ({favorites.length})
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Guarda tus vehículos preferidos para seguir bajadas de precio o compararlos.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Tu lista de favoritos está vacía</h3>
          <p className="text-xs text-slate-400 mb-6">
            Pulsa en el corazón de cualquier coche del catálogo para guardarlo aquí y tenerlo siempre a mano.
          </p>
          <button
            onClick={() => setActiveView('search')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30"
          >
            Explorar Catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
};
