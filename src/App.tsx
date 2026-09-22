import React from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { CarProvider, useCar } from './context/CarContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { SearchView } from './views/SearchView.tsx';
import { CarDetailView } from './views/CarDetailView.tsx';
import { ComparisonView } from './views/ComparisonView.tsx';
import { PublishCarView } from './views/PublishCarView.tsx';
import { FavoritesView } from './views/FavoritesView.tsx';
import { ChatView } from './views/ChatView.tsx';
import { SellerDashboardView } from './views/SellerDashboardView.tsx';
import { AffiliateDashboardView } from './views/AffiliateDashboardView.tsx';
import { AdminDashboardView } from './views/AdminDashboardView.tsx';
import { SecureSaleInfoView } from './views/SecureSaleInfoView.tsx';
import { PromoteModal } from './components/PromoteModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';

const AppContent: React.FC = () => {
  const { activeView } = useCar();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white font-sans antialiased pb-16 lg:pb-0">
      {/* Top Global Navigation */}
      <Navbar />

      {/* Main Dynamic View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeView === 'search' && <SearchView />}
        {activeView === 'detail' && <CarDetailView />}
        {activeView === 'compare' && <ComparisonView />}
        {activeView === 'publish' && <PublishCarView />}
        {activeView === 'favorites' && <FavoritesView />}
        {activeView === 'chat' && <ChatView />}
        {activeView === 'seller_dashboard' && <SellerDashboardView />}
        {activeView === 'affiliate_dashboard' && <AffiliateDashboardView />}
        {activeView === 'admin_dashboard' && <AdminDashboardView />}
        {(activeView === 'secure_info' || activeView === 'secure_sale_info') && (
          <SecureSaleInfoView />
        )}
      </main>

      {/* Trust, Security and Cross-Border European Footer */}
      <Footer />

      {/* Mobile-first 3D Bottom Navigation */}
      <MobileBottomNav />

      {/* Modals */}
      <PromoteModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CarProvider>
        <AppContent />
      </CarProvider>
    </AuthProvider>
  );
}
