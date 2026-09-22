import React, { useState } from 'react';
import { useCar } from '../context/CarContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { SecureSaleTimeline } from '../components/SecureSaleTimeline.tsx';
import {
  ArrowLeft,
  Heart,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Gauge,
  Zap,
  Fuel,
  MapPin,
  Eye,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  Store,
  User as UserIcon,
  Award,
  Globe,
  Truck,
  Check,
} from 'lucide-react';

export const CarDetailView: React.FC = () => {
  const {
    selectedCar: car,
    setSelectedCar,
    setActiveView,
    isFavorite,
    toggleFavorite,
    addToComparison,
    removeFromComparison,
    isCompared,
    setChatCar,
    setCarToPromote,
  } = useCar();

  const { formatPrice, currentUser } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!car) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 mb-4">No se ha seleccionado ningún vehículo.</p>
        <button
          onClick={() => setActiveView('search')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  const favorited = isFavorite(car.id);
  const compared = isCompared(car.id);
  const isOwner = currentUser.id === car.sellerId || currentUser.role === 'admin';

  const images =
    car.images && car.images.length > 0
      ? car.images
      : ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'];

  const handleStartChat = () => {
    setChatCar(car);
    setActiveView('chat');
  };

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {/* Back button */}
      <button
        onClick={() => setActiveView('search')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a la búsqueda de coches</span>
      </button>

      {/* Main Grid: Left Gallery & Details, Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-4">
            {/* Main Featured Photo */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={images[activeImageIndex]}
                alt={car.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Badges on image */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {car.saleType === 'secure_affiliate' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-lg">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Venta Segura con Agente Certificado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-950/90 text-blue-300 border border-blue-500/40 backdrop-blur-md shadow-lg">
                    Venta Directa
                  </span>
                )}

                {car.promotionLevel === 'top_europe' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    Top Europa Destacado
                  </span>
                )}
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-slate-950/80 text-white text-xs font-semibold px-3 py-1 rounded-lg backdrop-blur-md border border-slate-800">
                {activeImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-blue-500 shadow-md shadow-blue-500/30'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Año</span>
              </div>
              <div className="text-lg font-bold text-white">{car.year}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
                <Gauge className="w-4 h-4 text-blue-400" />
                <span>Kilómetros</span>
              </div>
              <div className="text-lg font-bold text-white">{car.mileage.toLocaleString()} km</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Potencia</span>
              </div>
              <div className="text-lg font-bold text-white">{car.powerHp} CV</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
                <Fuel className="w-4 h-4 text-blue-400" />
                <span>Combustible</span>
              </div>
              <div className="text-lg font-bold text-white truncate">{car.fuelType}</div>
            </div>
          </div>

          {/* Secure Sale Information / Affiliate Box */}
          {car.saleType === 'secure_affiliate' ? (
            <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Protegido por el Sistema de Venta Segura AutoEuropa</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black uppercase">
                      Certificado
                    </span>
                  </h3>
                  <p className="text-xs text-emerald-300/80">
                    Compra desde cualquier país de Europa con total garantía técnica y legal
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-900/80 border border-emerald-500/20 p-3.5 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Inspección 150 Puntos</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Revisión exhaustiva de chapa, pintura, motor, diagnosis OBD-II y prueba en carretera por agente local.
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-emerald-500/20 p-3.5 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-1">
                    <Award className="w-4 h-4" />
                    <span>Pago en Escrow Custodiado</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Tu dinero permanece retenido en una cuenta segura europea hasta que recibes y verificas el vehículo.
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-emerald-500/20 p-3.5 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-1">
                    <Globe className="w-4 h-4" />
                    <span>Trámites y Certificado COC</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Emisión de placas de tránsito provisionales, contratos bilingües y asistencia en la matriculación.
                  </p>
                </div>
              </div>

              {/* Assigned Agent Profile Preview */}
              <div className="flex items-center justify-between p-3.5 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                    HB
                  </div>
                  <div>
                    <div className="font-bold text-white">Hans Becker — Agente Certificado AutoEuropa</div>
                    <div className="text-[11px] text-emerald-300">Bavaria SafeCar Inspections & Export (Múnich, Alemania)</div>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold px-2.5 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/30">
                  Código Agente: EU-DE-994
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Este anuncio es de Venta Directa</h4>
                  <p className="text-xs text-slate-400">
                    Trato directo con el vendedor. ¿Prefieres que un agente local lo inspeccione antes de comprar?
                  </p>
                </div>
                <button
                  onClick={handleStartChat}
                  className="text-xs font-semibold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Solicitar Agente (450 €)
                </button>
              </div>
            </div>
          )}

          {/* Secure Sale 8-Step Interactive Timeline */}
          {car.saleType === 'secure_affiliate' && (
            <SecureSaleTimeline currentStepIndex={2} interactive={true} />
          )}

          {/* Description */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span>Descripción del Vehículo</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Verificado por AutoEuropa
              </span>
            </h3>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {car.description}
            </div>
          </div>

          {/* Full Technical Specifications */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-base font-bold text-white mb-4">Ficha Técnica Completa</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-slate-400 block mb-0.5">Marca</span>
                <span className="text-white font-semibold">{car.brand}</span>
              </div>
              <div className="border-b border-slate-800 pb-2">
                <span className="text-slate-400 block mb-0.5">Modelo</span>
                <span className="text-white font-semibold">{car.model}</span>
              </div>
              <div className="border-b border-slate-800 pb-2">
                <span className="text-slate-400 block mb-0.5">Versión / Acabado</span>
                <span className="text-white font-semibold">{car.version || 'Estándar'}</span>
              </div>
              <div className="border-b border-slate-800 pb-2">
                <span className="text-slate-400 block mb-0.5">Carrocería</span>
                <span className="text-white font-semibold">{car.bodyType}</span>
              </div>
              <div className="border-b border-slate-800 pb-2">
                <span className="text-slate-400 block mb-0.5">Caja de cambios</span>
                <span className="text-white font-semibold">{car.transmission}</span>
              </div>
              <div className="border-b border-slate-800 pb-2">
                <span className="text-slate-400 block mb-0.5">Puertas / Plazas</span>
                <span className="text-white font-semibold">{car.doors} puertas / {car.seats} plazas</span>
              </div>
              <div className="border-b border-slate-800 pb-2">
                <span className="text-slate-400 block mb-0.5">Color</span>
                <span className="text-white font-semibold">{car.color || 'No especificado'}</span>
              </div>
              <div className="border-b border-slate-800 pb-2">
                <span className="text-slate-400 block mb-0.5">Motorización</span>
                <span className="text-white font-semibold">{car.engineSize || 'No especificada'}</span>
              </div>
              <div className="border-b border-slate-800 pb-2">
                <span className="text-slate-400 block mb-0.5">Emisiones CO2</span>
                <span className="text-white font-semibold">{car.co2Emissions ? `${car.co2Emissions} g/km` : '0 g/km'}</span>
              </div>
            </div>
          </div>

          {/* Features / Extras */}
          {car.features && car.features.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-base font-bold text-white mb-4">Equipamiento y Extras Incluidos</h3>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feat, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 border border-slate-750"
                  >
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Sidebar: Price & Actions */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Price Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Precio de Venta
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                {formatPrice(car.price)}
              </div>

              {car.saleType === 'secure_affiliate' && car.affiliateFee && (
                <div className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 p-2.5 rounded-xl mb-4">
                  ✓ Incluye gestión completa de agente afiliado ({car.affiliateFee} €)
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-300 mb-6 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Ubicación: <strong>{car.city}, {car.country}</strong></span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleStartChat}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contactar y Negociar Precio</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(car.id)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      favorited
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                    <span>{favorited ? 'En Favoritos' : 'Favorito'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (compared) removeFromComparison(car.id);
                      else addToComparison(car);
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      compared
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Scale className="w-4 h-4" />
                    <span>{compared ? 'Comparando' : 'Comparar'}</span>
                  </button>
                </div>

                {isOwner && (
                  <button
                    onClick={() => setCarToPromote(car)}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Promocionar este Anuncio</span>
                  </button>
                )}
              </div>
            </div>

            {/* Seller Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Información del Vendedor
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-base">
                  {car.seller?.name ? car.seller.name.charAt(0) : 'V'}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {car.seller?.companyName || car.seller?.name || 'Vendedor AutoEuropa'}
                  </h4>
                  <div className="text-xs text-blue-400 flex items-center gap-1">
                    {car.seller?.role === 'seller_dealer' ? '🏢 Concesionario Oficial' : '👤 Vendedor Particular'}
                    {car.seller?.verified && (
                      <span className="text-emerald-400 font-medium">✓ Verificado</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{car.seller?.city || car.city}, {car.seller?.country || car.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{car.seller?.phone || '+34 912 345 678'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{car.seller?.email || 'contacto@autoeuropa.com'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
