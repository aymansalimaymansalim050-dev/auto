import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCar } from '../context/CarContext.tsx';
import { AffiliateAssignment } from '../types.ts';
import {
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Euro,
  FileText,
  User,
  MapPin,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Save,
} from 'lucide-react';

export const AffiliateDashboardView: React.FC = () => {
  const { currentUser, formatPrice } = useAuth();
  const { setActiveView, setSelectedCar, setChatCar } = useCar();
  const [assignments, setAssignments] = useState<AffiliateAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<'assigned' | 'inspecting' | 'docs_in_progress' | 'completed' | 'cancelled'>('inspecting');
  const [editReport, setEditReport] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/affiliate/assignments?affiliateId=${currentUser.id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setAssignments(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [currentUser.id]);

  const totalCommissionsEarned = assignments
    .filter((a) => a.commissionPaid)
    .reduce((acc, a) => acc + (a.commissionAmount || 0), 0);

  const pendingCommissions = assignments
    .filter((a) => !a.commissionPaid && a.status !== 'cancelled')
    .reduce((acc, a) => acc + (a.commissionAmount || 0), 0);

  const completedSales = assignments.filter((a) => a.status === 'completed').length;

  const handleOpenEdit = (assign: AffiliateAssignment) => {
    setEditingId(assign.id);
    setEditStatus(assign.status);
    setEditReport(assign.inspectionReport || '');
    setEditNotes(assign.notes || '');
  };

  const handleSaveAssignment = async (id: number) => {
    try {
      const res = await fetch(`/api/affiliate/assignments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          inspectionReport: editReport,
          notes: editNotes,
          commissionPaid: editStatus === 'completed',
        }),
      });
      const updated = await res.json();
      setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
      setEditingId(null);
    } catch (e) {
      console.error('Error saving assignment:', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Red de Agentes Afiliados Certificados AutoEuropa</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white tracking-tight">
              {currentUser.name}
            </h1>
            <span className="text-xs px-2.5 py-1 rounded-lg font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Código: {currentUser.affiliateCode || 'EU-DE-994'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {currentUser.companyName || 'Bavaria SafeCar Inspections & Export'} • {currentUser.city || 'Múnich'}, {currentUser.country || 'Alemania'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-2xl">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Certificación Europea Vigente 2026</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
            <Euro className="w-4 h-4 text-emerald-400" />
            <span>Comisiones Cobradas</span>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {formatPrice(totalCommissionsEarned)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Transferidas a tu cuenta</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Comisiones en Trámite</span>
          </div>
          <div className="text-2xl font-black text-amber-300">
            {formatPrice(pendingCommissions)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">En cuenta Escrow segura</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span>Ventas Seguras Cerradas</span>
          </div>
          <div className="text-2xl font-black text-white">{completedSales}</div>
          <div className="text-[11px] text-slate-500 mt-1">Con entrega satisfactoria</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Asignaciones Activas</span>
          </div>
          <div className="text-2xl font-black text-white">{assignments.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">En tu demarcación geográfica</div>
        </div>
      </div>

      {/* Assigned Cars & Inspections List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-2">Vehículos Asignados para Venta Segura</h3>
        <p className="text-xs text-slate-400 mb-6">
          Realiza la inspección de 150 puntos, sube el informe técnico y tramita la documentación de exportación europea.
        </p>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-xs">Cargando asignaciones...</div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No tienes asignaciones de venta segura pendientes en este momento.
          </div>
        ) : (
          <div className="space-y-6">
            {assignments.map((item) => {
              const isEditing = editingId === item.id;
              const car = item.car;

              return (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-slate-750 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {car && (
                        <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                          <img
                            src={car.images && car.images.length > 0 ? car.images[0] : ''}
                            alt={car.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div>
                        <div className="text-xs text-blue-400 font-semibold">
                          {car?.brand} {car?.model} ({car?.year})
                        </div>
                        <h4 className="font-bold text-white text-sm">
                          {car?.title}
                        </h4>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Precio: {car ? formatPrice(car.price) : '-'} • Ubicación: {car?.city}, {car?.country}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-lg font-bold border ${
                          item.status === 'completed'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                            : item.status === 'inspecting'
                            ? 'bg-amber-950 text-amber-300 border-amber-500/30'
                            : 'bg-blue-950 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {item.status === 'completed' && '✓ Venta y Trámites Completados'}
                        {item.status === 'inspecting' && '⚙ Inspección en Curso'}
                        {item.status === 'assigned' && 'Pendiente de Inspección'}
                        {item.status === 'docs_in_progress' && 'Trámites COC en Curso'}
                      </span>

                      <div className="text-right">
                        <div className="text-sm font-black text-emerald-400">
                          +{formatPrice(item.commissionAmount)}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {item.commissionPaid ? 'Comisión Pagada' : 'Pendiente'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inspection Report & Notes Section */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 text-xs">
                    <div className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>Informe de Inspección Técnica Oficial:</span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-3 mt-2">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Estado del proceso:</label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                          >
                            <option value="assigned">Asignado</option>
                            <option value="inspecting">Inspeccionando (150 Puntos)</option>
                            <option value="docs_in_progress">Trámites y Certificado COC en marcha</option>
                            <option value="completed">Completado y Entregado</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Detalles del informe de 150 puntos:</label>
                          <textarea
                            rows={3}
                            value={editReport}
                            onChange={(e) => setEditReport(e.target.value)}
                            placeholder="Especifica el estado de pintura, diagnosis OBD-II, neumáticos..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1.5 text-slate-400 hover:text-white"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleSaveAssignment(item.id)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            Guardar Informe
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-slate-300 italic mb-2">
                          "{item.inspectionReport || 'Inspección técnica aún no redactada. Haz clic en actualizar para completarla.'}"
                        </p>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                          <div>
                            {item.notes && <span>Notas adicionales: {item.notes}</span>}
                          </div>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="text-emerald-400 hover:text-emerald-300 font-bold"
                          >
                            Editar informe y estado →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
