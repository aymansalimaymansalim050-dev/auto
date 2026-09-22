import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCar } from '../context/CarContext.tsx';
import {
  Car as CarIcon,
  ShieldCheck,
  Scale,
  Heart,
  MessageSquare,
  PlusCircle,
  User as UserIcon,
  ChevronDown,
  Globe,
  Coins,
  ShieldAlert,
  Briefcase,
  Store,
  SlidersHorizontal,
} from 'lucide-react';
import { UserRole } from '../types.ts';

interface NavbarProps {
  onOpenAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const {
    currentUser,
    switchUserRole,
    availableUsers,
    switchUserById,
    currency,
    setCurrency,
    language,
    setLanguage,
    logout,
    setIsAuthModalOpen,
  } = useAuth();

  const {
    activeView,
    setActiveView,
    comparisonCars,
    favorites,
  } = useCar();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { label: 'Admin Central', icon: ShieldAlert, color: 'bg-rose-500 text-white' };
      case 'affiliate':
        return { label: 'Agente Afiliado UE', icon: Briefcase, color: 'bg-emerald-600 text-white' };
      case 'seller_dealer':
        return { label: 'Concesionario', icon: Store, color: 'bg-blue-600 text-white' };
      case 'seller_private':
        return { label: 'Vendedor Particular', icon: CarIcon, color: 'bg-amber-600 text-white' };
      default:
        return { label: 'Comprador', icon: UserIcon, color: 'bg-slate-700 text-white' };
    }
  };

  const currentRoleInfo = getRoleLabel(currentUser.role);
  const CurrentRoleIcon = currentRoleInfo.icon;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      {/* Top European banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-xs py-1.5 px-4 border-b border-blue-800/40 text-blue-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-700 text-yellow-300 text-[10px] font-bold">
            ★
          </span>
          <span className="font-medium">Red Europea de Compra-Venta Directa y Venta Segura Certificada</span>
          <span className="hidden md:inline text-blue-300/70">• Trámites de exportación, certificados COC y garantía europea</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Currency Selector */}
          <div className="flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="bg-slate-800/80 text-blue-100 rounded px-1.5 py-0.5 border border-slate-700 text-xs focus:outline-none focus:border-blue-400"
            >
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CHF">CHF</option>
            </select>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-slate-800/80 text-blue-100 rounded px-1.5 py-0.5 border border-slate-700 text-xs focus:outline-none focus:border-blue-400"
            >
              <option value="ES">ES (Español)</option>
              <option value="EN">EN (English)</option>
              <option value="DE">DE (Deutsch)</option>
              <option value="FR">FR (Français)</option>
              <option value="IT">IT (Italiano)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveView('search')}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <CarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white">Auto<span className="text-blue-400">Europa</span></span>
              <span className="text-[10px] px-1.5 py-0.2 bg-blue-500/20 text-blue-300 font-semibold rounded border border-blue-500/30">
                EU
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">Mercado Europeo de Vehículos</p>
          </div>
        </button>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => setActiveView('search')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeView === 'search'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Catálogo
          </button>

          <button
            onClick={() => setActiveView('compare')}
            className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeView === 'compare'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Scale className="w-4 h-4" />
            Comparador
            {comparisonCars.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full bg-blue-500 text-white">
                {comparisonCars.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('secure_info')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeView === 'secure_info'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Venta Segura
          </button>

          <button
            onClick={() => setActiveView('chat')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeView === 'chat'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Mensajes & Ofertas
          </button>

          <button
            onClick={() => setActiveView('favorites')}
            className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeView === 'favorites'
                ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Heart className="w-4 h-4" />
            Favoritos
            {favorites.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Role-specific Dashboard shortcuts */}
          {(currentUser.role === 'seller_private' || currentUser.role === 'seller_dealer') && (
            <button
              onClick={() => setActiveView('seller_dashboard')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeView === 'seller_dashboard'
                  ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Store className="w-4 h-4 text-amber-400" />
              Panel Vendedor
            </button>
          )}

          {currentUser.role === 'affiliate' && (
            <button
              onClick={() => setActiveView('affiliate_dashboard')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeView === 'affiliate_dashboard'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Briefcase className="w-4 h-4 text-emerald-400" />
              Panel Afiliado
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveView('admin_dashboard')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeView === 'admin_dashboard'
                  ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Admin Central
            </button>
          )}
        </nav>

        {/* Right CTA & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Publicar Coche Button */}
          <button
            onClick={() => setActiveView('publish')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publicar Coche</span>
          </button>

          {/* Interactive Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium cursor-pointer transition-all"
              title="Cambiar rol para probar comprador, vendedor, afiliado o admin"
            >
              <span className={`p-1 rounded-md ${currentRoleInfo.color}`}>
                <CurrentRoleIcon className="w-3.5 h-3.5" />
              </span>
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-slate-400 leading-tight">Rol activo:</div>
                <div className="font-semibold text-slate-100">{currentRoleInfo.label}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* Dropdown Menu */}
            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Cambiar Perfil o Rol de Prueba
                </div>

                <div className="space-y-1 py-1">
                  {availableUsers.map((user) => {
                    const rInfo = getRoleLabel(user.role);
                    const RIcon = rInfo.icon;
                    const isSelected = user.id === currentUser.id;

                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          switchUserById(user.id);
                          if (user.role === 'affiliate') setActiveView('affiliate_dashboard');
                          else if (user.role === 'admin') setActiveView('admin_dashboard');
                          else if (user.role === 'seller_dealer' || user.role === 'seller_private') setActiveView('seller_dashboard');
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`p-1.5 rounded-md ${rInfo.color}`}>
                            <RIcon className="w-3.5 h-3.5" />
                          </span>
                          <div>
                            <div className="font-medium text-slate-200">{user.name}</div>
                            <div className="text-[10px] text-slate-400">{user.country} • {rInfo.label}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500 text-white font-bold">
                            Activo
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center px-2">
                  <button
                    onClick={onOpenAuth || (() => setIsAuthModalOpen(true))}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium py-1"
                  >
                    Iniciar con Google / Cuenta
                  </button>
                  <button
                    onClick={logout}
                    className="text-xs text-slate-500 hover:text-slate-400"
                  >
                    Reiniciar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
