import React from 'react';
import { useCar } from '../context/CarContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { ThreeDIcon } from './ThreeDIcon.tsx';
import {
  Search,
  Scale,
  PlusCircle,
  ShieldCheck,
  MessageSquare,
  LayoutDashboard,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeView, setActiveView, comparisonCars } = useCar();
  const { currentUser } = useAuth();

  const isSellerOrAffiliate =
    currentUser.role === 'seller_private' ||
    currentUser.role === 'seller_dealer' ||
    currentUser.role === 'affiliate' ||
    currentUser.role === 'admin';

  const getDashboardView = () => {
    if (currentUser.role === 'affiliate') return 'affiliate_dashboard';
    if (currentUser.role === 'admin') return 'admin_dashboard';
    return 'seller_dashboard';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-2 py-1.5 shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Search */}
        <button
          onClick={() => setActiveView('search')}
          className={`flex flex-col items-center p-1.5 rounded-xl transition-all cursor-pointer ${
            activeView === 'search' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeView === 'search' ? 'bg-blue-500/10' : ''}`}>
            <ThreeDIcon name="search" size="sm" glow={activeView === 'search'} />
          </div>
          <span className="text-[10px] mt-0.5">Search</span>
        </button>

        {/* Sell */}
        <button
          onClick={() => setActiveView('publish')}
          className={`flex flex-col items-center p-1.5 rounded-xl transition-all cursor-pointer ${
            activeView === 'publish' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeView === 'publish' ? 'bg-amber-500/10' : ''}`}>
            <ThreeDIcon name="sell" size="sm" glow={activeView === 'publish'} />
          </div>
          <span className="text-[10px] mt-0.5">Sell</span>
        </button>

        {/* Compare */}
        <button
          onClick={() => setActiveView('compare')}
          className={`relative flex flex-col items-center p-1.5 rounded-xl transition-all cursor-pointer ${
            activeView === 'compare' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeView === 'compare' ? 'bg-indigo-500/10' : ''}`}>
            <ThreeDIcon name="compare" size="sm" glow={activeView === 'compare'} />
          </div>
          {comparisonCars.length > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center">
              {comparisonCars.length}
            </span>
          )}
          <span className="text-[10px] mt-0.5">Compare</span>
        </button>

        {/* Secure Sale */}
        <button
          onClick={() => setActiveView('secure_info')}
          className={`flex flex-col items-center p-1.5 rounded-xl transition-all cursor-pointer ${
            activeView === 'secure_info' || activeView === 'secure_sale_info'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-lg ${
              activeView === 'secure_info' || activeView === 'secure_sale_info' ? 'bg-emerald-500/10' : ''
            }`}
          >
            <ThreeDIcon name="secure" size="sm" glow={activeView === 'secure_info'} />
          </div>
          <span className="text-[10px] mt-0.5">Secure</span>
        </button>

        {/* Messages */}
        <button
          onClick={() => setActiveView('chat')}
          className={`flex flex-col items-center p-1.5 rounded-xl transition-all cursor-pointer ${
            activeView === 'chat' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeView === 'chat' ? 'bg-blue-500/10' : ''}`}>
            <ThreeDIcon name="messages" size="sm" glow={activeView === 'chat'} />
          </div>
          <span className="text-[10px] mt-0.5">Messages</span>
        </button>

        {/* Dashboard */}
        <button
          onClick={() => setActiveView(getDashboardView())}
          className={`flex flex-col items-center p-1.5 rounded-xl transition-all cursor-pointer ${
            activeView.includes('dashboard') ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeView.includes('dashboard') ? 'bg-teal-500/10' : ''}`}>
            <ThreeDIcon name="dashboard" size="sm" glow={activeView.includes('dashboard')} />
          </div>
          <span className="text-[10px] mt-0.5">Dashboard</span>
        </button>
      </div>
    </nav>
  );
};
