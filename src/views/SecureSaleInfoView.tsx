import React from 'react';
import { useCar } from '../context/CarContext.tsx';
import { SecureSaleTimeline } from '../components/SecureSaleTimeline.tsx';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Globe,
  Award,
  Users,
  Car as CarIcon,
  ArrowRight,
  FileCheck,
  Truck,
} from 'lucide-react';

export const SecureSaleInfoView: React.FC = () => {
  const { setActiveView } = useCar();

  return (
    <div className="max-w-6xl mx-auto pb-24 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4">
          <ShieldCheck className="w-4 h-4" />
          <span>Garantía Transfronteriza Europea AutoEuropa</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Dos Formas Transparentes de Comprar y Vender Coches en Europa
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Diseñado para eliminar el miedo y las barreras legales al comprar un vehículo en otro país europeo como Alemania, Francia, España o Italia.
        </p>
      </div>

      {/* Comparison of the 2 Sale Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Type 1: Venta Normal Directa */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6">
              <CarIcon className="w-6 h-6" />
            </div>

            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Modalidad 1</span>
            <h3 className="text-2xl font-black text-white mt-1 mb-3">Venta Normal Directa</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Trato directo de persona a persona o con concesionarios oficiales. Ideal para operaciones locales o compradores con experiencia mecánica y documental.
            </p>

            <div className="space-y-3 text-xs text-slate-300 mb-6">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>0% de comisiones por intermediación</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Contacto directo e instantáneo vía chat y teléfono</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Acuerdo de precio y forma de pago libre entre las partes</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <span className="w-4 h-4 text-slate-500 shrink-0">•</span>
                <span>Las partes gestionan por su cuenta la revisión y transporte</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveView('search')}
            className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Ver Coches de Venta Directa
          </button>
        </div>

        {/* Type 2: Venta Segura con Afiliado */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-2 border-emerald-500/50 rounded-3xl p-8 flex flex-col justify-between shadow-2xl shadow-emerald-950/40 relative">
          <div className="absolute top-6 right-6">
            <span className="text-[10px] px-2.5 py-1 rounded-md font-black bg-emerald-500 text-slate-950 uppercase tracking-wider">
              Protección Total
            </span>
          </div>

          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Modalidad 2</span>
            <h3 className="text-2xl font-black text-white mt-1 mb-3">Venta Segura con Agente Afiliado</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Un experto automotriz homologado de AutoEuropa actúa como tu representante personal en el país donde se encuentra el coche.
            </p>

            <div className="space-y-3.5 text-xs text-slate-200 mb-6">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Inspección Presencial de 150 Puntos</strong>
                  <span className="text-slate-400 text-[11px]">
                    Espesor micrométrico de pintura, diagnosis electrónica OBD-II, motor, caja de cambios y prueba en carretera.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Custodia del Dinero en Cuenta Escrow</strong>
                  <span className="text-slate-400 text-[11px]">
                    Tu dinero nunca se entrega al vendedor hasta que el coche está inspeccionado y los documentos están formalizados.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <FileCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Gestión de Exportación y Certificado COC</strong>
                  <span className="text-slate-400 text-[11px]">
                    Tramitación del Certificado de Conformidad Europeo, baja de exportación y placas temporales de tránsito.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveView('publish')}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Publicar Coche con Venta Segura</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* The 8-Step Interactive European Secure Sale Timeline */}
      <SecureSaleTimeline currentStepIndex={1} interactive={true} />
    </div>
  );
};
