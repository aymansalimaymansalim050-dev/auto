import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  ShieldCheck,
  Globe,
  Users,
  MessageSquare,
  FileCheck2,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { ThreeDIcon } from './ThreeDIcon.tsx';

export interface TimelineStep {
  id: number;
  key: string;
  name: string;
  shortDesc: string;
  detailedDesc: string;
  agentTask: string;
  buyerGuarantee: string;
  sellerProtection: string;
  estimatedTime: string;
  iconName: 'sell' | 'secure' | 'search' | 'compare' | 'messages' | 'dashboard';
  badge: string;
}

export const SECURE_SALE_STEPS: TimelineStep[] = [
  {
    id: 1,
    key: 'submission',
    name: 'Submission',
    shortDesc: 'Envío de ficha y documentación inicial',
    detailedDesc: 'El vendedor registra el vehículo con el número de bastidor (VIN), kilometraje certificado, historial de revisiones oficiales y fotografías en alta resolución.',
    agentTask: 'Comprobación previa de titularidad registral y cotejo con bases de datos policiales de la UE.',
    buyerGuarantee: 'Ficha contrastada con registro europeo contra manipulación de odómetro.',
    sellerProtection: 'Valoración sugerida con IA para asegurar el precio óptimo del mercado.',
    estimatedTime: '15 - 30 min',
    iconName: 'sell',
    badge: 'Paso Inicial',
  },
  {
    id: 2,
    key: 'verification',
    name: 'Verification',
    shortDesc: 'Inspección técnica presencial de 150 puntos',
    detailedDesc: 'El agente afiliado homologado de AutoEuropa acude al lugar donde está el vehículo para realizar el test OBD-II de centralita, espesor de chapa y prueba en carretera.',
    agentTask: 'Emisión del informe técnico pericial de 150 puntos con vídeo y diagnóstico digital.',
    buyerGuarantee: 'Garantía mecánica certificada de 12 a 24 meses europea.',
    sellerProtection: 'Certificación de estado que exime de reclamaciones posteriores por vicios ocultos.',
    estimatedTime: '24 - 48 horas',
    iconName: 'secure',
    badge: 'Inspección 150 Puntos',
  },
  {
    id: 3,
    key: 'published',
    name: 'Published',
    shortDesc: 'Publicación en el mercado europeo',
    detailedDesc: 'El coche recibe la insignia dorada "AutoEuropa Certified Secure Sale" y se promociona en los 9 países comunitarios (Alemania, Francia, España, etc.).',
    agentTask: 'Optimización multilingüe de la ficha técnica en 6 idiomas europeos.',
    buyerGuarantee: 'Acceso completo al informe pericial antes de pagar un solo euro.',
    sellerProtection: 'Máxima visibilidad ante más de 450.000 compradores internacionales.',
    estimatedTime: 'Inmediato tras peritaje',
    iconName: 'search',
    badge: 'Catálogo Europeo',
  },
  {
    id: 4,
    key: 'buyer_found',
    name: 'Buyer found',
    shortDesc: 'Comprador verificado con reserva formal',
    detailedDesc: 'Un comprador interesado deposita una fianza simbólica de reserva a través de pasarela bancaria europea.',
    agentTask: 'Verificación de solvencia e identidad KYC/AML del comprador.',
    buyerGuarantee: 'Exclusividad de reserva durante el proceso de formalización.',
    sellerProtection: 'Compromiso de compra garantizado por contrato vinculante.',
    estimatedTime: '3 a 7 días promedio',
    iconName: 'dashboard',
    badge: 'Reserva Confirmada',
  },
  {
    id: 5,
    key: 'negotiation',
    name: 'Negotiation',
    shortDesc: 'Acuerdo de precio final y condiciones',
    detailedDesc: 'Negociación formal asistida por el agente de AutoEuropa para acordar precio de cierre, transporte y posibles mejoras solicitadas por el comprador.',
    agentTask: 'Mediación imparcial para lograr el acuerdo más ventajoso y justo para ambas partes.',
    buyerGuarantee: 'Precio cerrado con desglose transparente sin sorpresas ni costes ocultos.',
    sellerProtection: 'Sin regateos abusivos: todas las ofertas son firmes y auditadas.',
    estimatedTime: '12 - 24 horas',
    iconName: 'messages',
    badge: 'Pacto Transparente',
  },
  {
    id: 6,
    key: 'documentation',
    name: 'Documentation',
    shortDesc: 'Contrato europeo, COC y exportación',
    detailedDesc: 'Generación del contrato de compraventa bilingüe de la UE, tramitación del Certificado de Conformidad (COC) y baja de exportación en el país de origen.',
    agentTask: 'Gestión con la DGT/KBA/ANTS y emisión de placas provisionales de tránsito.',
    buyerGuarantee: 'Documentación lista para matricular sin problemas en el país de destino.',
    sellerProtection: 'Baja oficial en tráfico que cancela el impuesto de circulación y multas.',
    estimatedTime: '2 - 4 días laborables',
    iconName: 'compare',
    badge: 'Homologación UE',
  },
  {
    id: 7,
    key: 'payment',
    name: 'Payment',
    shortDesc: 'Custodia segura en cuenta Escrow europea',
    detailedDesc: 'El comprador transfiere el importe total a una cuenta fiduciaria bancaria regulada por la Autoridad Bancaria Europea. Los fondos permanecen congelados y seguros.',
    agentTask: 'Comprobación de la recepción de fondos SEPA y emisión del certificado de depósito.',
    buyerGuarantee: 'El dinero nunca se entrega al vendedor hasta que el vehículo esté conforme.',
    sellerProtection: 'Certeza absoluta de cobro antes de desprenderse de las llaves del vehículo.',
    estimatedTime: 'Instantáneo a 24 horas',
    iconName: 'secure',
    badge: 'Custodia Escrow',
  },
  {
    id: 8,
    key: 'sale_completed',
    name: 'Sale completed',
    shortDesc: 'Entrega del coche y liquidación de fondos',
    detailedDesc: 'El comprador recibe el coche en mano o a través de camión portavehículos cerrado homologado. Tras la conformidad final, el dinero se libera al vendedor.',
    agentTask: 'Supervisión de la firma del acta de recepción y activación de la garantía europea.',
    buyerGuarantee: 'Coche en la puerta de casa con garantía y documentación completa.',
    sellerProtection: 'Pago bancario directo en cuenta de forma inmediata sin comisiones extra.',
    estimatedTime: 'Entrega final',
    iconName: 'dashboard',
    badge: '100% Completado',
  },
];

interface SecureSaleTimelineProps {
  currentStepIndex?: number;
  interactive?: boolean;
}

export const SecureSaleTimeline: React.FC<SecureSaleTimelineProps> = ({
  currentStepIndex = 3,
  interactive = true,
}) => {
  const [activeStep, setActiveStep] = useState<number>(currentStepIndex);

  const selectedStep = SECURE_SALE_STEPS[activeStep] || SECURE_SALE_STEPS[0];

  return (
    <div className="w-full rounded-3xl bg-slate-950/90 border border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
      {/* Background ambient automotive light */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>European Certified Secure Sale Protocol</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Línea de Progreso: Venta Segura Paso a Paso
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Protocolo de 8 etapas con mediación de agentes afiliados locales, inspección física y custodia bancaria fiduciaria Escrow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
              Etapa Activa
            </span>
            <span className="text-sm font-black text-emerald-400">
              Paso {activeStep + 1} de 8 • {selectedStep.name}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Step-by-Step Horizontal Progress Bar (scrollable on mobile) */}
      <div className="relative z-10 mb-8 overflow-x-auto pb-4 pt-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="flex items-center min-w-[760px] justify-between relative">
          {/* Background Connecting Line */}
          <div className="absolute top-5 left-6 right-6 h-0.5 bg-slate-800 -z-0" />
          {/* Active progress connecting fill */}
          <div
            className="absolute top-5 left-6 h-0.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 -z-0 transition-all duration-500"
            style={{ width: `${(activeStep / (SECURE_SALE_STEPS.length - 1)) * 95}%` }}
          />

          {SECURE_SALE_STEPS.map((step, idx) => {
            const isCompleted = idx < activeStep;
            const isCurrent = idx === activeStep;

            return (
              <button
                key={step.key}
                onClick={() => interactive && setActiveStep(idx)}
                disabled={!interactive}
                className={`relative z-10 flex flex-col items-center group transition-all text-center focus:outline-none ${
                  interactive ? 'cursor-pointer' : 'cursor-default'
                }`}
                style={{ width: '92px' }}
              >
                {/* Step Circle with 3D feel */}
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-300 transform group-hover:scale-110 shadow-lg ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 ring-4 ring-emerald-500/20 shadow-emerald-500/40 scale-110'
                      : isCompleted
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <span>0{step.id}</span>
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={`mt-2.5 text-xs font-bold whitespace-nowrap transition-colors ${
                    isCurrent
                      ? 'text-white'
                      : isCompleted
                      ? 'text-slate-300'
                      : 'text-slate-500 group-hover:text-slate-400'
                  }`}
                >
                  {step.name}
                </span>

                <span className="text-[10px] text-slate-500 mt-0.5 leading-none">
                  {step.estimatedTime}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Detailed Card with Soft Depth & Perspective */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStep.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-md shadow-xl"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <ThreeDIcon name={selectedStep.iconName} size="md" glow={false} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Etapa {selectedStep.id} de 8
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {selectedStep.badge}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {selectedStep.estimatedTime}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {selectedStep.name}: {selectedStep.shortDesc}
                </h3>
              </div>
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center gap-2 self-start lg:self-center">
              <button
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                ← Anterior
              </button>
              <button
                onClick={() =>
                  setActiveStep((prev) => Math.min(SECURE_SALE_STEPS.length - 1, prev + 1))
                }
                disabled={activeStep === SECURE_SALE_STEPS.length - 1}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-1 shadow-md shadow-blue-600/30"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed my-5 font-normal">
            {selectedStep.detailedDesc}
          </p>

          {/* 3 Pillars of Security in this step */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Función del Agente Homologado
              </span>
              <p className="text-xs text-slate-300 leading-snug">
                {selectedStep.agentTask}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Garantía para el Comprador
              </span>
              <p className="text-xs text-slate-300 leading-snug">
                {selectedStep.buyerGuarantee}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                Protección para el Vendedor
              </span>
              <p className="text-xs text-slate-300 leading-snug">
                {selectedStep.sellerProtection}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
