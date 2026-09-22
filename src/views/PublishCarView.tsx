import React, { useState } from 'react';
import { useCar } from '../context/CarContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Car as CarIcon,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Upload,
  Plus,
  Trash2,
  ArrowRight,
  Loader2,
  Euro,
  Globe,
  MapPin,
} from 'lucide-react';
import { SaleType, PromotionTier } from '../types.ts';

export const PublishCarView: React.FC = () => {
  const { setActiveView, fetchCars, setSelectedCar } = useCar();
  const { currentUser } = useAuth();

  const [brand, setBrand] = useState('BMW');
  const [model, setModel] = useState('Serie 4 Coupé');
  const [version, setVersion] = useState('430i M Sport Automático');
  const [year, setYear] = useState<number>(2023);
  const [price, setPrice] = useState<number>(47500);
  const [mileage, setMileage] = useState<number>(26000);
  const [fuelType, setFuelType] = useState('Gasolina');
  const [transmission, setTransmission] = useState('Automático');
  const [bodyType, setBodyType] = useState('Coupé');
  const [powerHp, setPowerHp] = useState<number>(245);
  const [engineSize, setEngineSize] = useState('2.0 TwinPower Turbo');
  const [doors, setDoors] = useState<number>(2);
  const [seats, setSeats] = useState<number>(4);
  const [color, setColor] = useState('Azul Portimao Metalizado');
  const [country, setCountry] = useState('Alemania');
  const [city, setCity] = useState('Múnich');
  const [postalCode, setPostalCode] = useState('80331');

  // Sale type
  const [saleType, setSaleType] = useState<SaleType>('secure_affiliate');
  const [affiliateFee, setAffiliateFee] = useState<number>(550);

  // Promotion tier
  const [promotionTier, setPromotionTier] = useState<PromotionTier>('highlighted');

  // AI Assistant state
  const [rawNotes, setRawNotes] = useState(
    'Coche nacional con libro de revisiones al día en concesionario oficial BMW. Paquete M Sport completo, frenos deportivos M, suspensión adaptativa M, techo solar de cristal y Head-Up Display. Sin daños estructurales ni accidentes.'
  );
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{
    estimatedPriceMin?: number;
    estimatedPriceMax?: number;
    sellingTips?: string[];
  } | null>(null);

  // Listing Output
  const [title, setTitle] = useState('BMW Serie 4 430i M Sport Coupé 245 CV Steptronic');
  const [description, setDescription] = useState(
    'Exclusivo BMW Serie 4 Coupé 430i con paquete aerodinámico M Sport exterior e interior. Historial de mantenimiento documentado íntegramente en servicio oficial. Equipado con cuadro de instrumentos digital BMW Live Cockpit Professional, asistente de aparcamiento con cámara, faros LED adaptativos y conectividad inalámbrica Apple CarPlay y Android Auto.\n\nVehículo disponible para venta segura con verificación completa de 150 puntos y gestión de transporte transfronterizo en la Unión Europea.'
  );

  const [features, setFeatures] = useState<string[]>([
    'Paquete M Sport',
    'Frenos Deportivos M',
    'Head-Up Display',
    'Apple CarPlay',
    'Cámara de Aparcamiento',
    'Faros LED Adaptativos',
  ]);
  const [newFeature, setNewFeature] = useState('');

  // Image URLs
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // AI Generation trigger using server-side Gemini 3.8 Flash
  const handleGenerateWithAI = async () => {
    setAiGenerating(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/ai/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand,
          model,
          version,
          year,
          mileage,
          fuelType,
          transmission,
          bodyType,
          powerHp,
          country,
          city,
          rawNotes,
        }),
      });

      const data = await res.json();
      if (data.title && data.description) {
        setTitle(data.title);
        setDescription(data.description);
        if (Array.isArray(data.suggestedFeatures) && data.suggestedFeatures.length > 0) {
          // Merge unique features
          setFeatures(Array.from(new Set([...features, ...data.suggestedFeatures])));
        }
        setAiResult({
          estimatedPriceMin: data.estimatedPriceMin,
          estimatedPriceMax: data.estimatedPriceMax,
          sellingTips: data.sellingTips,
        });
      } else if (data.error) {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('No se pudo conectar con el asistente de IA: ' + err.message);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: currentUser.id || 3,
          title,
          brand,
          model,
          version,
          year,
          price,
          mileage,
          fuelType,
          transmission,
          bodyType,
          powerHp,
          engineSize,
          doors,
          seats,
          color,
          country,
          city,
          postalCode,
          description,
          features,
          images: imageUrls,
          saleType,
          affiliateFee: saleType === 'secure_affiliate' ? affiliateFee : 0,
          promotionLevel: promotionTier,
        }),
      });

      const newCar = await res.json();
      if (newCar.id) {
        await fetchCars();
        setSelectedCar(newCar);
        setActiveView('detail');
      } else {
        setErrorMsg(newCar.error || 'Error al publicar el coche');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Error de conexión al publicar el coche');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
          <CarIcon className="w-3.5 h-3.5" />
          <span>Publicación de Vehículo en Toda Europa</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Publica tu Coche para Compradores Europeos
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Elige entre venta directa sin comisión o venta segura con agente afiliado e inspección de 150 puntos.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitListing} className="space-y-8">
        {/* Section 1: Sale Type Selection */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-base font-bold text-white mb-2">1. Selecciona la Modalidad de Venta</h3>
          <p className="text-xs text-slate-400 mb-6">
            Ofrece confianza a compradores de otros países europeos mediante nuestra red de agentes o vende directamente.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Secure Affiliate Sale Option */}
            <div
              onClick={() => setSaleType('secure_affiliate')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                saleType === 'secure_affiliate'
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-950/30'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-white text-sm">Venta Segura con Agente</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-black bg-emerald-500 text-slate-950 uppercase">
                  Recomendado UE
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Un agente afiliado local inspecciona el coche (150 puntos), custodia el pago seguro en depósito Escrow y tramita los documentos de exportación (COC).
              </p>

              <div className="space-y-1 text-[11px] text-emerald-300/90 font-medium">
                <div>✓ Mayor velocidad de venta para compradores internacionales</div>
                <div>✓ Sin riesgo de estafas ni transferencias falsas</div>
                <div>✓ Comisión de gestión: {affiliateFee} € (pagada tras completar la venta)</div>
              </div>
            </div>

            {/* Direct Sale Option */}
            <div
              onClick={() => setSaleType('direct')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                saleType === 'direct'
                  ? 'border-blue-500 bg-blue-950/20 shadow-lg shadow-blue-950/30'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <CarIcon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-white text-sm">Venta Normal Directa</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  0% Comisión
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Tú gestionas la comunicación directamente con el comprador, acuerdas el método de pago y tramitas el cambio de titularidad por tu cuenta.
              </p>

              <div className="space-y-1 text-[11px] text-slate-400 font-medium">
                <div>✓ Contacto directo vía chat y teléfono</div>
                <div>✓ Sin intermediación de agente</div>
                <div>✓ Publicación estándar 100% gratuita</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Vehicle Technical Data */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-base font-bold text-white mb-4">2. Datos Técnicos del Vehículo</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Marca *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Modelo *</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Versión / Acabado</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Año de Matriculación *</label>
              <input
                type="number"
                required
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kilómetros (km) *</label>
              <input
                type="number"
                required
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Precio de Venta (€) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Combustible *</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Gasolina">Gasolina</option>
                <option value="Diésel">Diésel</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Híbrido Enchufable">Híbrido Enchufable</option>
                <option value="Eléctrico">Eléctrico</option>
                <option value="GLP">GLP</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Caja de Cambios *</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Automático">Automático</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Carrocería *</label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Sedán">Sedán</option>
                <option value="SUV">SUV</option>
                <option value="Compacto">Compacto</option>
                <option value="Familiar">Familiar</option>
                <option value="Coupé">Coupé</option>
                <option value="Cabrio">Cabrio</option>
                <option value="Furgoneta">Furgoneta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Potencia (CV)</label>
              <input
                type="number"
                value={powerHp}
                onChange={(e) => setPowerHp(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cilindrada / Motor</label>
              <input
                type="text"
                value={engineSize}
                onChange={(e) => setEngineSize(e.target.value)}
                placeholder="Ej: 2.0 L Turbo"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Color Exterior</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: European Location */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-base font-bold text-white mb-4">3. Ubicación del Vehículo en Europa</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">País *</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Alemania">🇩🇪 Alemania</option>
                <option value="España">🇪🇸 España</option>
                <option value="Francia">🇫🇷 Francia</option>
                <option value="Italia">🇮🇹 Italia</option>
                <option value="Países Bajos">🇳🇱 Países Bajos</option>
                <option value="Bélgica">🇧🇪 Bélgica</option>
                <option value="Portugal">🇵🇹 Portugal</option>
                <option value="Austria">🇦🇹 Austria</option>
                <option value="Suiza">🇨🇭 Suiza</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Código Postal</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: AI ASSISTANT (Powered by Gemini 3.8 Flash) */}
        <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Asistente de Redacción con IA AutoEuropa</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
                    Gemini 3.8 Flash
                  </span>
                </h3>
                <p className="text-xs text-indigo-200/80">
                  Genera el título y la descripción técnica veraz sin inventar datos
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={aiGenerating}
              onClick={handleGenerateWithAI}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {aiGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generar con IA</span>
                </>
              )}
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Notas, observaciones y equipamiento real del coche (la IA estructurará esto sin inventar):
            </label>
            <textarea
              rows={3}
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder="Indica el estado del coche, revisiones, extras que tenga..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* AI Valuation and Selling Tips Preview if generated */}
          {aiResult && (
            <div className="mb-4 p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-xs">
              <div className="flex items-center gap-2 font-bold text-indigo-300 mb-2">
                <Euro className="w-4 h-4" />
                <span>Valoración de Mercado Europeo Sugerida:</span>
                <span className="text-white font-extrabold text-sm">
                  {aiResult.estimatedPriceMin?.toLocaleString()} € – {aiResult.estimatedPriceMax?.toLocaleString()} €
                </span>
              </div>
              {aiResult.sellingTips && (
                <div className="text-slate-300 space-y-1 text-[11px]">
                  {aiResult.sellingTips.map((tip, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Generated Title & Description inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Título Optimizado del Anuncio *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción Completa del Anuncio *</label>
              <textarea
                rows={6}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Features / Extras */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-base font-bold text-white mb-4">4. Equipamiento y Extras Destacados</h3>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddFeature();
                }
              }}
              placeholder="Ej: Techo Solar Panorámico, Asientos Calefactables..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
            >
              Añadir
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {features.map((feat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200"
              >
                <span>{feat}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
                  className="text-slate-500 hover:text-rose-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Section 6: Photo URLs */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-base font-bold text-white mb-2">5. Fotografías del Vehículo</h3>
          <p className="text-xs text-slate-400 mb-4">
            Añade enlaces de alta calidad de tus fotos para mostrar el coche a los compradores europeos.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
            >
              Añadir Foto
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {imageUrls.map((img, idx) => (
              <div key={idx} className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group">
                <img src={img} alt={`Foto ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/90 text-slate-400 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 7: Promotion Plan */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-base font-bold text-white mb-2">6. Destaca tu Anuncio (Opcional)</h3>
          <p className="text-xs text-slate-400 mb-6">
            Los anuncios promocionados reciben hasta 5 veces más visitas en Alemania, Francia, España y Países Bajos.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => setPromotionTier('standard')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                promotionTier === 'standard'
                  ? 'border-blue-500 bg-blue-950/20'
                  : 'border-slate-800 bg-slate-950/30'
              }`}
            >
              <div className="font-bold text-white text-sm mb-1">Estándar</div>
              <div className="text-xl font-black text-slate-300 mb-2">0 €</div>
              <p className="text-[11px] text-slate-400">Posicionamiento normal en catálogo.</p>
            </div>

            <div
              onClick={() => setPromotionTier('highlighted')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                promotionTier === 'highlighted'
                  ? 'border-blue-500 bg-blue-950/20'
                  : 'border-slate-800 bg-slate-950/30'
              }`}
            >
              <div className="font-bold text-blue-400 text-sm mb-1">Destacado Nacional</div>
              <div className="text-xl font-black text-white mb-2">29 €</div>
              <p className="text-[11px] text-slate-400">Primeros puestos en tu país durante 30 días.</p>
            </div>

            <div
              onClick={() => setPromotionTier('top_europe')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                promotionTier === 'top_europe'
                  ? 'border-amber-500 bg-amber-950/20'
                  : 'border-slate-800 bg-slate-950/30'
              }`}
            >
              <div className="font-bold text-amber-400 text-sm mb-1">Super Top Europa</div>
              <div className="text-xl font-black text-white mb-2">59 €</div>
              <p className="text-[11px] text-slate-400">Máxima visibilidad en los 9 países de la red AutoEuropa.</p>
            </div>
          </div>
        </div>

        {/* Submit CTA */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setActiveView('search')}
            className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publicando coche...</span>
              </>
            ) : (
              <>
                <span>Publicar Coche en AutoEuropa</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
