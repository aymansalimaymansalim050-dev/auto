import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  X,
  User,
  Store,
  Briefcase,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Check,
} from 'lucide-react';
import { UserRole } from '../types.ts';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, switchDemoUser, currentUser, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<'demo' | 'email'>('demo');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');

  if (!isAuthModalOpen) return null;

  const demoAccounts = [
    {
      role: 'buyer' as UserRole,
      name: 'Elena Gómez',
      title: 'Compradora Particular (España)',
      desc: 'Buscando comprar un coche seguro en Alemania',
      icon: User,
      color: 'border-blue-500/40 text-blue-400 bg-blue-950/20',
    },
    {
      role: 'seller_private' as UserRole,
      name: 'Carlos Mendoza',
      title: 'Vendedor Particular (Madrid)',
      desc: 'Venta normal directa o con agente',
      icon: Store,
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
    },
    {
      role: 'seller_dealer' as UserRole,
      name: 'Bavaria Motors GmbH',
      title: 'Concesionario Oficial (Múnich)',
      desc: 'Venta profesional con garantía europea',
      icon: Store,
      color: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
    },
    {
      role: 'affiliate' as UserRole,
      name: 'Hans Becker',
      title: 'Agente Afiliado Homologado (Alemania)',
      desc: 'Inspecciones 150 puntos, trámites y comisiones',
      icon: Briefcase,
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
    },
    {
      role: 'admin' as UserRole,
      name: 'Administrador AutoEuropa',
      title: 'Supervisión del Mercado Europeo',
      desc: 'Gestión de usuarios, coches y estadísticas',
      icon: ShieldAlert,
      color: 'border-rose-500/40 text-rose-400 bg-rose-950/20',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Acceso al Ecosistema AutoEuropa</span>
          </div>
          <h2 className="text-2xl font-black text-white">Iniciar Sesión / Registro</h2>
          <p className="text-xs text-slate-400 mt-1">
            Elige un perfil para probar todas las funcionalidades europeas sin esperas.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 mb-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('demo')}
            className={`pb-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'demo'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Acceso Rápido por Perfil (Demo)
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`pb-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'email'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Google / Registro Manual
          </button>
        </div>

        {activeTab === 'demo' ? (
          <div className="space-y-2.5">
            {demoAccounts.map((account) => {
              const Icon = account.icon;
              const isCurrent = currentUser.role === account.role;

              return (
                <div
                  key={account.role}
                  onClick={() => {
                    switchDemoUser(account.role);
                    setIsAuthModalOpen(false);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                    isCurrent
                      ? 'border-blue-500 bg-blue-950/30'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${account.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{account.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                            Activo
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{account.title}</div>
                      <div className="text-[10px] text-slate-500">{account.desc}</div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => {
                signInWithGoogle();
                setIsAuthModalOpen(false);
              }}
              className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar con Cuenta de Google</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-[11px] text-slate-500 uppercase">O con email</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-semibold mb-1">Nombre Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Daniel Schmidt"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-semibold mb-1">Email Profesional o Personal</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-semibold mb-1">Tipo de Cuenta</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="buyer">Comprador</option>
                <option value="seller_private">Vendedor Particular</option>
                <option value="seller_dealer">Concesionario Oficial / Profesional</option>
                <option value="affiliate">Agente Afiliado AutoEuropa</option>
              </select>
            </div>

            <button
              onClick={() => {
                switchDemoUser(role);
                setIsAuthModalOpen(false);
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer mt-2"
            >
              Registrarse en AutoEuropa
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
