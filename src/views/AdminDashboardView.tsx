import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCar } from '../context/CarContext.tsx';
import {
  ShieldAlert,
  Users,
  Car as CarIcon,
  ShieldCheck,
  TrendingUp,
  Coins,
  CheckCircle2,
  XCircle,
  Eye,
  Store,
  Briefcase,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { formatPrice } = useAuth();
  const { setSelectedCar, setActiveView } = useCar();
  const [data, setData] = useState<{
    stats: any;
    users: any[];
    cars: any[];
    assignments: any[];
    promotions: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOverview();
  }, []);

  const handleToggleVerifyUser = async (userId: number, currentVal: boolean) => {
    try {
      await fetch(`/api/admin/users/${userId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: !currentVal }),
      });
      fetchAdminOverview();
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangeCarStatus = async (carId: number, newStatus: string) => {
    try {
      await fetch(`/api/admin/cars/${carId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchAdminOverview();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center text-slate-400 text-xs">
        Cargando métricas de administración europea...
      </div>
    );
  }

  const { stats, users: allUsers, cars: allCars } = data;

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Panel de Supervisión Global AutoEuropa</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Administración del Mercado Europeo
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitorización de transacciones transfronterizas, verificación de concesionarios y moderación de catálogo.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Usuarios Registrados</span>
          </div>
          <div className="text-2xl font-black text-white">{stats.totalUsers}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {stats.dealersCount} concesionarios • {stats.affiliateCount} afiliados
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
            <CarIcon className="w-4 h-4 text-emerald-400" />
            <span>Total Vehículos</span>
          </div>
          <div className="text-2xl font-black text-white">{stats.totalCars}</div>
          <div className="text-[11px] text-emerald-400 mt-1">
            {stats.activeCars} activos en venta
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ventas Seguras Activas</span>
          </div>
          <div className="text-2xl font-black text-white">{stats.secureSales}</div>
          <div className="text-[11px] text-slate-500 mt-1">Con agente asignado</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Comisiones Generadas</span>
          </div>
          <div className="text-2xl font-black text-amber-300">
            {formatPrice(stats.totalAffiliateCommissions)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Distribuidas a afiliados</div>
        </div>
      </div>

      {/* Moderation: Cars Catalog */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl mb-8">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <span>Moderación y Estado de Vehículos</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {allCars.length} coches
          </span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 pb-2">
                <th className="py-2.5 px-3">Coche</th>
                <th className="py-2.5 px-3">Precio</th>
                <th className="py-2.5 px-3">Modalidad</th>
                <th className="py-2.5 px-3">Vendedor</th>
                <th className="py-2.5 px-3">Ubicación</th>
                <th className="py-2.5 px-3">Estado</th>
                <th className="py-2.5 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {allCars.map((car) => (
                <tr key={car.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">
                    <span
                      onClick={() => {
                        setSelectedCar(car);
                        setActiveView('detail');
                      }}
                      className="hover:text-blue-400 cursor-pointer"
                    >
                      {car.brand} {car.model} ({car.year})
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-200">{formatPrice(car.price)}</td>
                  <td className="py-3 px-3">
                    {car.saleType === 'secure_affiliate' ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">
                        Venta Segura
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        Venta Directa
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-300">{car.seller?.name || 'Vendedor'}</td>
                  <td className="py-3 px-3 text-slate-400">{car.city}, {car.country}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        car.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {car.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <select
                      value={car.status}
                      onChange={(e) => handleChangeCarStatus(car.id, e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-200"
                    >
                      <option value="active">Activo</option>
                      <option value="reserved">Reservado</option>
                      <option value="sold">Vendido</option>
                      <option value="pending_approval">Revisión</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users and Affiliates Verification */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <span>Usuarios y Verificación de Agentes / Concesionarios</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {allUsers.length} usuarios
          </span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 pb-2">
                <th className="py-2.5 px-3">Nombre / Empresa</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Rol</th>
                <th className="py-2.5 px-3">País</th>
                <th className="py-2.5 px-3">Código Afiliado</th>
                <th className="py-2.5 px-3">Verificado</th>
                <th className="py-2.5 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {allUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">
                    {user.companyName || user.name}
                  </td>
                  <td className="py-3 px-3 text-slate-300">{user.email}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-800 text-blue-300">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{user.city ? `${user.city}, ` : ''}{user.country}</td>
                  <td className="py-3 px-3 text-slate-300">{user.affiliateCode || '-'}</td>
                  <td className="py-3 px-3">
                    {user.verified ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Sí
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">No</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleToggleVerifyUser(user.id, user.verified)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                        user.verified
                          ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                      }`}
                    >
                      {user.verified ? 'Revocar Verificación' : 'Verificar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
