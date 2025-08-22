import React, { useState, useEffect } from 'react';
import { Reservation, Pilot, Glider, Agent, FlightPackage } from '../../types';
import { storageService } from '../../utils/storage';

interface ReservationFormProps {
  reservation?: Reservation;
  onSubmit: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ reservation, onSubmit, onCancel }) => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [gliders, setGliders] = useState<Glider[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [packages, setPackages] = useState<FlightPackage[]>([]);

  const [formData, setFormData] = useState({
    customerName: reservation?.customerName || '',
    customerEmail: reservation?.customerEmail || '',
    customerPhone: reservation?.customerPhone || '',
    date: reservation?.date || new Date().toISOString().split('T')[0],
    time: reservation?.time || '09:00',
    packageId: reservation?.packageId || '',
    agentId: reservation?.agentId || '',
    pilotId: reservation?.pilotId || '',
    gliderId: reservation?.gliderId || '',
    status: reservation?.status || 'pending' as const,
    totalPrice: reservation?.totalPrice || 0,
    notes: reservation?.notes || ''
  });

  useEffect(() => {
    setPilots(storageService.getPilots());
    setGliders(storageService.getGliders());
    setAgents(storageService.getAgents());
    setPackages(storageService.getPackages());
  }, []);

  useEffect(() => {
    if (formData.packageId) {
      const selectedPackage = packages.find(p => p.id === formData.packageId);
      if (selectedPackage) {
        setFormData(prev => ({ ...prev, totalPrice: selectedPackage.price }));
      }
    }
  }, [formData.packageId, packages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const availablePilots = pilots.filter(p => p.status === 'available');
  const availableGliders = gliders.filter(g => g.status === 'available');
  const activeAgents = agents.filter(a => a.status === 'active');

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Pelanggan
          </label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.customerEmail}
            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telepon
          </label>
          <input
            type="tel"
            value={formData.customerPhone}
            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Waktu
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paket Penerbangan
          </label>
          <select
            value={formData.packageId}
            onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Pilih Paket</option>
            {packages.map(pkg => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} - {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(pkg.price)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Agen
          </label>
          <select
            value={formData.agentId}
            onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Pilih Agen</option>
            {activeAgents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pilot
          </label>
          <select
            value={formData.pilotId}
            onChange={(e) => setFormData({ ...formData, pilotId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Pilih Pilot</option>
            {availablePilots.map(pilot => (
              <option key={pilot.id} value={pilot.id}>{pilot.name} ({pilot.license})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Glider
          </label>
          <select
            value={formData.gliderId}
            onChange={(e) => setFormData({ ...formData, gliderId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Pilih Glider</option>
            {availableGliders.map(glider => (
              <option key={glider.id} value={glider.id}>
                {glider.brand} {glider.model} ({glider.size})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Reservation['status'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="pending">Menunggu</option>
            <option value="confirmed">Dikonfirmasi</option>
            <option value="checked-in">Check-in</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Total Harga
        </label>
        <input
          type="number"
          value={formData.totalPrice}
          onChange={(e) => setFormData({ ...formData, totalPrice: parseInt(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min="0"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Catatan
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Catatan tambahan (opsional)"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {reservation ? 'Update' : 'Tambah'} Reservasi
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
};

export default ReservationForm;