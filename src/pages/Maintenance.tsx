import React, { useState, useEffect } from 'react';
import { Plus, Search, Wrench, Calendar, DollarSign, CheckCircle, Clock, AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import { Maintenance, Glider, Equipment } from '../types';
import { storageService } from '../utils/storage';
import Modal from '../components/Modal';

const MaintenancePage: React.FC = () => {
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [gliders, setGliders] = useState<Glider[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null);

  useEffect(() => {
    setMaintenance(storageService.getMaintenance());
    setGliders(storageService.getGliders());
    setEquipment(storageService.getEquipment());
  }, []);

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleAdd = () => {
    setEditingMaintenance(null);
    setShowModal(true);
  };

  const handleEdit = (item: Maintenance) => {
    setEditingMaintenance(item);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus record maintenance ini?')) {
      const updatedMaintenance = maintenance.filter(m => m.id !== id);
      setMaintenance(updatedMaintenance);
      storageService.saveMaintenance(updatedMaintenance);
    }
  };

  const handleSubmit = (data: Omit<Maintenance, 'id' | 'createdAt'>) => {
    const newMaintenance: Maintenance = {
      ...data,
      id: editingMaintenance?.id || generateId(),
      createdAt: editingMaintenance?.createdAt || new Date().toISOString()
    };
    
    const updatedMaintenance = editingMaintenance 
      ? maintenance.map(m => m.id === editingMaintenance.id ? newMaintenance : m)
      : [...maintenance, newMaintenance];
    
    setMaintenance(updatedMaintenance);
    storageService.saveMaintenance(updatedMaintenance);
    setShowModal(false);
    setEditingMaintenance(null);
  };

  const filteredMaintenance = maintenance.filter((item) => {
    const itemName = getItemName(item.itemId, item.itemType);
    const matchesSearch = itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.performedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getItemName = (itemId: string, itemType: 'glider' | 'equipment') => {
    if (itemType === 'glider') {
      const glider = gliders.find(g => g.id === itemId);
      return glider ? `${glider.brand} ${glider.model}` : 'Unknown Glider';
    } else {
      const equip = equipment.find(e => e.id === itemId);
      return equip ? equip.name : 'Unknown Equipment';
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'completed': return `${baseClasses} bg-green-100 text-green-800`;
      case 'in-progress': return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'scheduled': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTypeBadge = (type: string) => {
    const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full';
    switch (type) {
      case 'routine': return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'repair': return `${baseClasses} bg-red-100 text-red-800`;
      case 'inspection': return `${baseClasses} bg-green-100 text-green-800`;
      case 'replacement': return `${baseClasses} bg-purple-100 text-purple-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'in-progress': return 'Sedang Dikerjakan';
      case 'scheduled': return 'Terjadwal';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'routine': return 'Rutin';
      case 'repair': return 'Perbaikan';
      case 'inspection': return 'Inspeksi';
      case 'replacement': return 'Penggantian';
      default: return type;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'scheduled', label: 'Terjadwal' },
    { value: 'in-progress', label: 'Sedang Dikerjakan' },
    { value: 'completed', label: 'Selesai' },
  ];

  const totalCost = maintenance.reduce((sum, m) => sum + m.cost, 0);
  const completedMaintenance = maintenance.filter(m => m.status === 'completed').length;
  const inProgressMaintenance = maintenance.filter(m => m.status === 'in-progress').length;
  const scheduledMaintenance = maintenance.filter(m => m.status === 'scheduled').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Maintenance</h1>
          <p className="text-gray-600">Kelola jadwal dan riwayat maintenance peralatan</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Maintenance
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari berdasarkan item, deskripsi, atau teknisi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Wrench className="text-gray-400 w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Biaya', 
            value: formatCurrency(totalCost), 
            color: 'green',
            icon: DollarSign 
          },
          { 
            label: 'Selesai', 
            value: completedMaintenance.toString(), 
            color: 'blue',
            icon: CheckCircle 
          },
          { 
            label: 'Sedang Dikerjakan', 
            value: inProgressMaintenance.toString(), 
            color: 'yellow',
            icon: Clock 
          },
          { 
            label: 'Terjadwal', 
            value: scheduledMaintenance.toString(), 
            color: 'purple',
            icon: Calendar 
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Maintenance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teknisi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Biaya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMaintenance.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {getItemName(item.itemId, item.itemType)}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">{item.itemType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getTypeBadge(item.type)}>
                      {getTypeText(item.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {item.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.performedBy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      {new Date(item.date).toLocaleDateString('id-ID')}
                    </div>
                    {item.nextDue && (
                      <div className="text-sm text-gray-500">
                        Next: {new Date(item.nextDue).toLocaleDateString('id-ID')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(item.cost)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(item.status)}>
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMaintenance.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada record maintenance</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tidak ada maintenance yang sesuai dengan filter.'
                : 'Mulai dengan menambahkan record maintenance baru.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${editingMaintenance ? 'Edit' : 'Tambah'} Maintenance`}
      >
        <MaintenanceForm
          maintenance={editingMaintenance || undefined}
          gliders={gliders}
          equipment={equipment}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

const MaintenanceForm: React.FC<{
  maintenance?: Maintenance;
  gliders: Glider[];
  equipment: Equipment[];
  onSubmit: (maintenance: Omit<Maintenance, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}> = ({ maintenance, gliders, equipment, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    itemId: maintenance?.itemId || '',
    itemType: maintenance?.itemType || 'glider' as const,
    type: maintenance?.type || 'routine' as const,
    description: maintenance?.description || '',
    performedBy: maintenance?.performedBy || '',
    date: maintenance?.date || new Date().toISOString().split('T')[0],
    cost: maintenance?.cost || 0,
    nextDue: maintenance?.nextDue || '',
    status: maintenance?.status || 'scheduled' as const,
    notes: maintenance?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getAvailableItems = () => {
    return formData.itemType === 'glider' ? gliders : equipment;
  };

  const getItemDisplayName = (item: any) => {
    if (formData.itemType === 'glider') {
      return `${item.brand} ${item.model}`;
    } else {
      return item.name;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jenis Item
          </label>
          <select
            value={formData.itemType}
            onChange={(e) => setFormData({ ...formData, itemType: e.target.value as 'glider' | 'equipment', itemId: '' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="glider">Glider</option>
            <option value="equipment">Peralatan</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item
          </label>
          <select
            value={formData.itemId}
            onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Pilih Item</option>
            {getAvailableItems().map(item => (
              <option key={item.id} value={item.id}>
                {getItemDisplayName(item)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jenis Maintenance
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as Maintenance['type'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="routine">Rutin</option>
            <option value="repair">Perbaikan</option>
            <option value="inspection">Inspeksi</option>
            <option value="replacement">Penggantian</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teknisi
          </label>
          <input
            type="text"
            value={formData.performedBy}
            onChange={(e) => setFormData({ ...formData, performedBy: e.target.value })}
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
            Biaya (IDR)
          </label>
          <input
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maintenance Berikutnya
          </label>
          <input
            type="date"
            value={formData.nextDue}
            onChange={(e) => setFormData({ ...formData, nextDue: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Maintenance['status'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="scheduled">Terjadwal</option>
            <option value="in-progress">Sedang Dikerjakan</option>
            <option value="completed">Selesai</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
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
          rows={2}
          placeholder="Catatan tambahan tentang maintenance"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {maintenance ? 'Update' : 'Tambah'} Maintenance
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

export default MaintenancePage;