import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCar } from '../context/CarContext.tsx';
import { Car } from '../types.ts';
import { ThreeDIcon } from '../components/ThreeDIcon.tsx';
import {
  Store,
  Eye,
  Heart,
  TrendingUp,
  Sparkles,
  Edit,
  Trash2,
  CheckCircle,
  PlusCircle,
  MessageSquare,
  ShieldCheck,
  Tag,
  DollarSign,
  Users,
  ArrowUpRight,
  Clock,
  Send,
  Check,
  X,
  ChevronRight,
  ExternalLink,
  Coins,
  BadgeCheck,
} from 'lucide-react';

export const SellerDashboardView: React.FC = () => {
  const { currentUser, formatPrice } = useAuth();
  const { setActiveView, setSelectedCar, setCarToPromote } = useCar();
  const [sellerCars, setSellerCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock SaaS live metrics & state
  const [offersList, setOffersList] = useState([
    {
      id: 'off-1',
      buyerName: 'Marcus Richter',
      country: '🇩🇪 Alemania',
      carTitle: 'Porsche 911 GT3 (992)',
      offerPrice: 205000,
      originalPrice: 219000,
      status: 'pending',
      date: 'Hace 2 horas',
    },
    {
      id: 'off-2',
      buyerName: 'Jean-Luc Moreau',
      country: '🇫🇷 Francia',
      carTitle: 'BMW M3 Competition M xDrive',
      offerPrice: 87500,
      originalPrice: 89900,
      status: 'pending',
      date: 'Ayer',
    },
  ]);

  const [leadsList, setLeadsList] = useState([
    {
      id: 'lead-1',
      name: 'Matteo Rossi',
      country: '🇮🇹 Italia',
      car: 'Audi RS6 Avant Quattro',
      budget: '115.000 €',
      intent: 'Alta (Solicitó videollamada e informe CARFAX)',
      phone: '+39 349 ••• •••',
    },
    {
      id: 'lead-2',
      name: 'Stefan De Jong',
      country: '🇳🇱 Países Bajos',
      car: 'Tesla Model S Plaid 1.020 CV',
      budget: '79.000 €',
      intent: 'Media (Consulta sobre exportación y matriculación)',
      phone: '+31 6 ••• •••',
    },
  ]);

  const fetchSellerCars = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cars?sellerId=${currentUser.id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSellerCars(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerCars();
  }, [currentUser.id]);

  const totalViews = sellerCars.reduce((acc, c) => acc + (c.viewsCount || 0), 0);
  const totalFavorites = sellerCars.reduce((acc, c) => acc + (c.favoritesCount || 0), 0);
  const secureSalesCount = sellerCars.filter((c) => c.saleType === 'secure_affiliate').length;
  const totalGrossInventory = sellerCars.reduce((acc, c) => acc + (c.price || 0), 0);

  const handleAcceptOffer = (id: string) => {
    setOffersList((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'accepted' } : o))
    );
  };

  const handleDeclineOffer = (id: string) => {
    setOffersList((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'declined' } : o))
    );
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 space-y-8">
      {/* SaaS Product Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border border-slate-800/80 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Ambient lighting glare */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
              <ThreeDIcon name="dashboard" size="lg" glow={false} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>Vendedor Europeo Certificado</span>
                </span>
                <span className="text-xs text-slate-400">ID: #{currentUser.id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {currentUser.companyName || currentUser.name}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Plataforma SaaS de gestión de inventario transfronterizo y ventas seguras en la UE.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveView('publish')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar Vehículo</span>
            </button>

            <button
              onClick={() => setActiveView('chat')}
              className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700/80 flex items-center gap-2 backdrop-blur-md transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span>Bandeja de Mensajes</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Floating Modular SaaS Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CARD 1: My Vehicles */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-750 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                My Vehicles
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{sellerCars.length}</div>
            <p className="text-xs text-slate-400 mt-1">Coches activos en catálogo</p>
          </div>
          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-medium">100% Verificados</span>
            <button
              onClick={() => setActiveView('publish')}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>+ Añadir</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 2: Messages */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-750 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Messages
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">4</div>
            <p className="text-xs text-slate-400 mt-1">Conversaciones activas de compradores</p>
          </div>
          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
            <span className="text-indigo-400 font-medium">2 sin leer</span>
            <button
              onClick={() => setActiveView('chat')}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Abrir Chat</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 3: Offers */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-750 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Offers
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{offersList.length}</div>
            <p className="text-xs text-slate-400 mt-1">Ofertas firmes en negociación</p>
          </div>
          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
            <span className="text-amber-400 font-medium">Acción requerida</span>
            <span className="text-slate-400 font-mono">Total: 292.500 €</span>
          </div>
        </div>

        {/* CARD 4: Views */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-750 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Views
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{totalViews}</div>
            <p className="text-xs text-slate-400 mt-1">Visualizaciones orgánicas en 9 países</p>
          </div>
          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +24% este mes
            </span>
            <span className="text-slate-400">{totalFavorites} favs</span>
          </div>
        </div>

        {/* CARD 5: Leads */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-750 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Leads
              </span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{leadsList.length}</div>
            <p className="text-xs text-slate-400 mt-1">Compradores de alta intención verificados</p>
          </div>
          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
            <span className="text-cyan-400 font-medium">92% solvencia bancaria</span>
            <span className="text-slate-400">UE Escrow</span>
          </div>
        </div>

        {/* CARD 6: Secure Sales */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-750 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Secure Sales
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{secureSalesCount}</div>
            <p className="text-xs text-slate-400 mt-1">Con agente asignado e inspección</p>
          </div>
          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-medium">Fondos retenidos en Escrow</span>
            <button
              onClick={() => setActiveView('secure_info')}
              className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            >
              Ver proceso
            </button>
          </div>
        </div>

        {/* CARD 7: Promotions */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-750 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Promotions
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">2 Activas</div>
            <p className="text-xs text-slate-400 mt-1">Super Top Europeo + Destacado</p>
          </div>
          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
            <span className="text-amber-400 font-medium">3.8x más visualizaciones</span>
            <span className="text-slate-400">CTR 6.4%</span>
          </div>
        </div>

        {/* CARD 8: Earnings */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-750 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Earnings
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{formatPrice(totalGrossInventory)}</div>
            <p className="text-xs text-slate-400 mt-1">Volumen bruto de inventario valorado</p>
          </div>
          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-medium">IBAN Europeo Conectado</span>
            <span className="text-slate-400">SEPA Instant</span>
          </div>
        </div>
      </div>

      {/* Offers & Leads Detail Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Offers Module */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white text-base">Ofertas y Negociación Activa</h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              {offersList.filter((o) => o.status === 'pending').length} pendientes
            </span>
          </div>

          <div className="space-y-3">
            {offersList.map((offer) => (
              <div
                key={offer.id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{offer.buyerName}</span>
                    <span className="text-xs text-slate-400">{offer.country}</span>
                    <span className="text-[10px] text-slate-500">• {offer.date}</span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">{offer.carTitle}</div>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="text-slate-400">Oferta:</span>
                    <strong className="text-emerald-400 text-sm font-bold">
                      {formatPrice(offer.offerPrice)}
                    </strong>
                    <span className="text-slate-500 line-through text-[11px]">
                      {formatPrice(offer.originalPrice)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {offer.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleAcceptOffer(offer.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Aceptar</span>
                      </button>
                      <button
                        onClick={() => handleDeclineOffer(offer.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Rechazar</span>
                      </button>
                    </>
                  ) : (
                    <span
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                        offer.status === 'accepted'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {offer.status === 'accepted' ? '✓ Aceptada' : '✗ Rechazada'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Intent Leads Module */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-white text-base">Leads y Compradores Verificados</h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
              {leadsList.length} leads calificados
            </span>
          </div>

          <div className="space-y-3">
            {leadsList.map((lead) => (
              <div
                key={lead.id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{lead.name}</span>
                    <span className="text-xs">{lead.country}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Presupuesto: {lead.budget}
                  </span>
                </div>

                <div className="text-xs text-blue-300 font-medium">Interés: {lead.car}</div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400">{lead.intent}</span>
                  <button
                    onClick={() => setActiveView('chat')}
                    className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Contactar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seller's Vehicles Modular Management Table */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Inventario de Vehículos</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
                {sellerCars.length} coches
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Gestiona precios, promociones europeas y ventas seguras con agente asignado.
            </p>
          </div>

          <button
            onClick={() => setActiveView('publish')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-md shadow-blue-600/20"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Añadir Vehículo</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-xs">Cargando inventario...</div>
        ) : sellerCars.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm mb-4">Aún no has publicado ningún vehículo con esta cuenta.</p>
            <button
              onClick={() => setActiveView('publish')}
              className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md"
            >
              Publicar mi primer coche
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sellerCars.map((car) => (
              <div
                key={car.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                    <img
                      src={car.images && car.images.length > 0 ? car.images[0] : ''}
                      alt={car.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        onClick={() => {
                          setSelectedCar(car);
                          setActiveView('detail');
                        }}
                        className="font-bold text-white text-sm hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        {car.title}
                      </h4>
                      {car.saleType === 'secure_affiliate' && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          Venta Segura
                        </span>
                      )}
                      {car.promotionLevel !== 'standard' && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {car.promotionLevel}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {car.year} • {car.mileage.toLocaleString()} km • {car.city} ({car.country})
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                  <div className="text-left md:text-right">
                    <div className="text-base font-black text-white">{formatPrice(car.price)}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{car.viewsCount} visitas</span>
                      <span>•</span>
                      <span>{car.favoritesCount} favoritos</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCarToPromote(car)}
                      className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Promocionar este anuncio"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Promocionar</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCar(car);
                        setActiveView('detail');
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                      title="Ver ficha"
                    >
                      Ver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
