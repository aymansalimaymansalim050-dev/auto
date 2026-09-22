import React, { useState } from 'react';
import { useCar } from '../context/CarContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { PromotionTier } from '../types.ts';
import {
  Sparkles,
  CheckCircle2,
  X,
  CreditCard,
  Lock,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

export const PromoteModal: React.FC = () => {
  const { carToPromote, setCarToPromote, fetchCars } = useCar();
  const { currentUser, formatPrice } = useAuth();

  const [tier, setTier] = useState<PromotionTier>('highlighted');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sepa' | 'ideal' | 'sofort'>('card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!carToPromote) return null;

  const plans = [
    {
      tier: 'highlighted' as PromotionTier,
      name: 'Destacado Nacional',
      price: 29,
      duration: '30 días',
      color: 'border-blue-500 bg-blue-950/20 text-blue-400',
      benefits: [
        'Aparece en los primeros resultados de tu país',
        'Etiqueta visual destacada azul en el catálogo',
        'Hasta 3 veces más visualizaciones',
      ],
    },
    {
      tier: 'top_europe' as PromotionTier,
      name: 'Super Top Europa',
      price: 59,
      duration: '30 días',
      color: 'border-amber-500 bg-amber-950/20 text-amber-400',
      popular: true,
      benefits: [
        'Máxima visibilidad en los 9 países de la red AutoEuropa',
        'Traducción automática del anuncio al alemán, francés e inglés',
        'Etiqueta dorada "Super Top Europeo"',
        'Hasta 7 veces más contactos y ofertas',
      ],
    },
    {
      tier: 'inspected' as PromotionTier,
      name: 'Inspección y Sello Certificado',
      price: 89,
      duration: '30 días',
      color: 'border-emerald-500 bg-emerald-950/20 text-emerald-400',
      benefits: [
        'Sello de verificación oficial con informe de 150 puntos',
        'Prioridad absoluta para compradores de otros países',
        'Garantía de kilometraje y ausencia de siniestros',
      ],
    },
  ];

  const selectedPlan = plans.find((p) => p.tier === tier) || plans[0];

  const handlePromote = async () => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/cars/${carToPromote.id}/promote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          pricePaid: selectedPlan.price,
          userId: currentUser.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        await fetchCars();
        setTimeout(() => {
          setSuccess(false);
          setCarToPromote(null);
        }, 1800);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setCarToPromote(null)}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {success ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">¡Anuncio Promocionado con Éxito!</h3>
            <p className="text-xs text-slate-300">
              Tu coche {carToPromote.title} ahora disfruta del plan {selectedPlan.name} en toda Europa.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Promoción y Visibilidad Transfronteriza</span>
              </div>
              <h2 className="text-xl font-black text-white">
                Impulsa la Venta de tu Coche
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Vehículo seleccionado: <strong className="text-white">{carToPromote.title}</strong>
              </p>
            </div>

            {/* Plan Selector */}
            <div className="space-y-3 mb-6">
              {plans.map((p) => {
                const isSelected = tier === p.tier;

                return (
                  <div
                    key={p.tier}
                    onClick={() => setTier(p.tier)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? p.color
                        : 'border-slate-800 hover:border-slate-750 bg-slate-950/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{p.name}</span>
                        {p.popular && (
                          <span className="text-[10px] px-2 py-0.5 rounded font-black bg-amber-500 text-slate-950 uppercase">
                            Más Vendido
                          </span>
                        )}
                      </div>
                      <div className="text-base font-black text-white">{p.price} €</div>
                    </div>

                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {p.benefits.map((b, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Payment Method Selector */}
            <div className="mb-6 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Método de Pago Seguro Europeo:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'card'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Tarjeta</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('sepa')}
                  className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'sepa'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  <span>SEPA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('ideal')}
                  className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'ideal'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  <span>iDEAL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('sofort')}
                  className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'sofort'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  <span>Sofort</span>
                </button>
              </div>
            </div>

            {/* Total and Checkout CTA */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div>
                <div className="text-[11px] text-slate-400">Total a pagar:</div>
                <div className="text-2xl font-black text-white">{selectedPlan.price} €</div>
              </div>

              <button
                onClick={handlePromote}
                disabled={processing}
                className="px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Procesando pago...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Confirmar y Activar</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
