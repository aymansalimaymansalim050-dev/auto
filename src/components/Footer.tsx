import React from 'react';
import { Car, ShieldCheck, Award, Globe, FileText, Lock, Users } from 'lucide-react';
import { useCar } from '../context/CarContext.tsx';

export const Footer: React.FC = () => {
  const { setActiveView } = useCar();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm mt-16">
      {/* European Trust & Security Guarantee Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-850/60 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">Venta Segura con Agente Afiliado UE</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Inspección técnica certificada de 150 puntos, verificación de historial en taller oficial y custodia de fondos mediante depósito en garantía (Escrow).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-850/60 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">Trámites y Exportación Transfronteriza</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Gestión del Certificado de Conformidad Europeo (COC), matrículas provisionales de exportación y matriculación en el país de destino.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-850/60 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">Inteligencia Automotriz con IA</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Redacción transparente de especificaciones técnicas con Gemini AI, sin datos inventados y con valoración real del mercado europeo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & European Countries */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Auto<span className="text-blue-400">Europa</span></span>
              <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-300 font-semibold rounded border border-blue-500/30">
                EU Marketplace
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-4">
              La plataforma de referencia para comprar, vender y comparar coches en toda la Unión Europea. Trato directo entre particulares o intermediación segura con agentes certificados.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Red activa en 9 países europeos</span>
            </div>
          </div>

          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Plataforma</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveView('search')} className="hover:text-blue-400">
                  Buscar Coches
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('compare')} className="hover:text-blue-400">
                  Comparador de Coches
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('publish')} className="hover:text-blue-400">
                  Publicar Coche
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('secure_info')} className="hover:text-blue-400">
                  Cómo Funciona la Venta Segura
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Profesionales & Agentes</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveView('affiliate_dashboard')} className="hover:text-blue-400">
                  Red de Afiliados Europeos
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('seller_dashboard')} className="hover:text-blue-400">
                  Panel para Concesionarios
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin_dashboard')} className="hover:text-blue-400">
                  Panel de Administración
                </button>
              </li>
              <li>
                <span className="text-slate-500">Tarifas y Comisiones fijas</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Países con Servicio</h5>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5"><span>🇩🇪</span> Alemania</li>
              <li className="flex items-center gap-1.5"><span>🇪🇸</span> España</li>
              <li className="flex items-center gap-1.5"><span>🇫🇷</span> Francia</li>
              <li className="flex items-center gap-1.5"><span>🇮🇹</span> Italia</li>
              <li className="flex items-center gap-1.5"><span>🇳🇱</span> Países Bajos</li>
              <li className="flex items-center gap-1.5"><span>🇧🇪</span> Bélgica</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-850 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            © 2026 AutoEuropa Technologies S.L. Todos los derechos reservados. Cumplimiento con RGPD y normativa europea de comercio de vehículos.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Aviso Legal</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacidad RGPD</span>
            <span className="hover:text-slate-400 cursor-pointer">Condiciones de Venta Segura</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
