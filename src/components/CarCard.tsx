import React, { useRef, useState } from 'react';
import { Car } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useCar } from '../context/CarContext.tsx';
import {
  Heart,
  Scale,
  ShieldCheck,
  Zap,
  Fuel,
  Gauge,
  Calendar,
  MapPin,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const { formatPrice } = useAuth();
  const {
    setSelectedCar,
    setActiveView,
    isFavorite,
    toggleFavorite,
    addToComparison,
    removeFromComparison,
    isCompared,
  } = useCar();

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const favorited = isFavorite(car.id);
  const compared = isCompared(car.id);

  // 3D tilt handler on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1
    // Calculate tilt angles (subtle 8 deg max for elegance)
    const tiltX = -(y - 0.5) * 10;
    const tiltY = (x - 0.5) * 10;
    setTilt({
      x: tiltX,
      y: tiltY,
      glareX: Math.round(x * 100),
      glareY: Math.round(y * 100),
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const getCountryFlag = (country: string) => {
    switch (country.toLowerCase()) {
      case 'alemania':
      case 'germany':
        return '🇩🇪';
      case 'españa':
      case 'spain':
        return '🇪🇸';
      case 'francia':
      case 'france':
        return '🇫🇷';
      case 'italia':
      case 'italy':
        return '🇮🇹';
      case 'países bajos':
      case 'netherlands':
        return '🇳🇱';
      case 'bélgica':
      case 'belgium':
        return '🇧🇪';
      case 'portugal':
        return '🇵🇹';
      case 'austria':
        return '🇦🇹';
      case 'suiza':
      case 'switzerland':
        return '🇨🇭';
      default:
        return '🇪🇺';
    }
  };

  const imageSrc =
    car.images && car.images.length > 0
      ? car.images[0]
      : 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
      className="group/card relative flex flex-col rounded-2xl transition-all duration-300"
    >
      {/* 3D Floating Body Container */}
      <div
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`
            : 'rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.4s ease-out, box-shadow 0.4s ease-out',
        }}
        className="relative flex-1 flex flex-col bg-slate-900/90 backdrop-blur-md border border-slate-800/90 rounded-2xl overflow-hidden hover:border-blue-500/40 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.25)]"
      >
        {/* Specular glare simulation following 3D cursor position */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none z-30 opacity-40 mix-blend-screen transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.45) 0%, rgba(56, 189, 248, 0.15) 30%, transparent 65%)`,
            }}
          />
        )}

        {/* Large Car Photo & Badges Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
          <img
            src={imageSrc}
            alt={car.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Top Gradient & Ambient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/50 pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {/* Sale Type Badge */}
            {car.saleType === 'secure_affiliate' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 shadow-sm backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Venta Segura con Agente
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-950/90 text-blue-300 border border-blue-500/40 shadow-sm backdrop-blur-md">
                Venta Directa
              </span>
            )}

            {/* Verified Technical Badge */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/90 text-slate-200 border border-slate-700/80 backdrop-blur-md shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Verificado 150 Puntos
            </span>

            {/* Promotion Badge if active */}
            {car.promotionLevel === 'top_europe' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/95 text-slate-950 border border-amber-300 shadow-sm">
                <Sparkles className="w-3 h-3" />
                Super Top Europeo
              </span>
            )}
            {car.promotionLevel === 'highlighted' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-600/95 text-white border border-blue-400 shadow-sm">
                Destacado
              </span>
            )}
          </div>

          {/* Top-Right Favorite Button */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(car.id);
              }}
              className={`p-2.5 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                favorited
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 scale-105'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
              }`}
              title={favorited ? 'Eliminar de favoritos' : 'Guardar en favoritos'}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Bottom Price and Location Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end z-10">
            <div>
              <div className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                {formatPrice(car.price)}
              </div>
              {car.saleType === 'secure_affiliate' && car.affiliateFee && (
                <div className="text-[11px] text-emerald-300 font-medium drop-shadow-sm flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Incluye servicio de agente ({car.affiliateFee} €)
                </div>
              )}
            </div>

            <div className="text-xs text-slate-200 flex items-center gap-1.5 bg-slate-900/85 px-2.5 py-1 rounded-lg backdrop-blur-md border border-slate-700/60 shadow-md">
              <span className="text-sm">{getCountryFlag(car.country)}</span>
              <span className="font-semibold text-slate-200">{car.city}</span>
            </div>
          </div>
        </div>

        {/* Card Body & Technical Specs */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Title & Brand */}
            <div className="mb-2">
              <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center justify-between">
                <span>{car.brand} • {car.model}</span>
                <span className="text-[10px] text-slate-400 font-normal">{car.bodyType}</span>
              </div>
              <h3
                onClick={() => {
                  setSelectedCar(car);
                  setActiveView('detail');
                }}
                className="font-bold text-slate-100 hover:text-blue-400 transition-colors cursor-pointer line-clamp-1 text-base mt-0.5"
                title={car.title}
              >
                {car.title}
              </h3>
            </div>

            {/* Quick Technical Specs Grid */}
            <div className="grid grid-cols-2 gap-2 my-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/50">
                <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="font-medium">{car.year}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/50">
                <Gauge className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="font-medium">{car.mileage.toLocaleString()} km</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/50">
                <Fuel className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate font-medium">{car.fuelType}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/50">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-medium">{car.powerHp} CV • {car.transmission}</span>
              </div>
            </div>

            {/* Seller / Affiliate Preview */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 mb-3">
              <div className="flex items-center gap-1.5 truncate">
                {car.seller?.role === 'seller_dealer' ? (
                  <span className="text-blue-400 font-semibold flex items-center gap-1">
                    <span>🏢</span> Concesionario Verificado
                  </span>
                ) : (
                  <span className="text-slate-300 flex items-center gap-1">
                    <span>👤</span> Vendedor Particular
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-slate-400">
                <Eye className="w-3 h-3 text-slate-500" />
                <span>{car.viewsCount} vistas</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (compared) removeFromComparison(car.id);
                else addToComparison(car);
              }}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                compared
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                  : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border-slate-700'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{compared ? 'Comparando' : 'Comparar'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedCar(car);
                setActiveView('detail');
              }}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-600/25"
            >
              <span>Ver Ficha 3D</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

