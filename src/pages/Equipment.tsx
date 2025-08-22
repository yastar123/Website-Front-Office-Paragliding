import React, { useState, useEffect } from 'react';
import { Plus, Search, Shield, AlertTriangle, CheckCircle, Edit2, Trash2, Calendar } from 'lucide-react';
import { Equipment, Pilot } from '../types';
import { storageService } from '../utils/storage';
import Modal from '../components/Modal';

const EquipmentPage: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  useEffect(() => {
    setEquipment(storageService.getEquipment());
    setPilots(storageService.getPilots());
  }, []);

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleAdd = () => {
    setEditingEquipment(null);
    setShowModal(true);
  };

  const handleEdit = (item: Equipment) => {
    setEditingEquipment(item);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus peralatan ini?')) {
      const updatedEquipment = equipment.filter(e => e.id !== id);
      setEquipment(updatedEquipment);
      storageService.saveEquipment(updatedEquipment);
    }
  };

  const handleSubmit = (data: Omit<Equipment, 'id'>) => {
    const newEquipment: Equipment = {
      ...data,
      id: editingEquipment?.id || generateId()
    };
    
    const updatedEquipment = editingEquipment 
      ? equipment.map(e => e.id === editingEquipment.id ? newEquipment : e)
      : [...equipment, newEquipment];
    
    setEquipment(updatedEquipment);
    storageService.saveEquipment(updatedEquipment);
    setShowModal(false);
    setEditingEquipment(null);
  };

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'available': return `${baseClasses} bg-green-100 text-green-800`;
      case 'in-use': return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'maintenance': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'retired': return `${baseClasses} bg-gray-100 text-gray-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getConditionBadge = (condition: string) => {
    const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full';
    switch (condition) {
      case 'excellent': return `${baseClasses} bg-green-100 text-green-800`;
      case 'good': return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'fair': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'needs-repair': return `${baseClasses} bg-red-100 text-red-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'helmet': return 'Helm';
      case 'harness': return 'Harness';
      case 'reserve': return 'Parasut Cadangan';
      case 'radio': return 'Radio';
      case 'gps': return 'GPS';
      case 'other': return 'Lainnya';
      default: return type;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Tersedia';
      case 'in-use': return 'Digunakan';
      case 'maintenance': return 'Maintenance';
      case 'retired': return 'Pensiun';
      default: return status;
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'Sangat Baik';
      case 'good': return 'Baik';
      case 'fair': return 'Cukup';
      case 'needs-repair': return 'Perlu Perbaikan';
      default: return condition;
    }
  };

  const getPilotName = (pilotId: string) => {
    const pilot = pilots.find(p => p.id === pilotId);
    return pilot ? pilot.name : 'Tidak Ditugaskan';
  };

  const isInspectionDue = (nextInspection: string) => {
    const today = new Date();
    const inspectionDate = new Date(nextInspection);
    const daysUntilInspection = Math.ceil((inspectionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilInspection <= 30;
  };

  const typeOptions = [
    { value: 'all', label: 'Semua Jenis' },
    { value: 'helmet', label: 'Helm' },
    { value: 'harness', label: 'Harness' },
    { value: 'reserve', label: 'Parasut Cadangan' },
    { value: 'radio', label: 'Radio' },
    { value: 'gps', label: 'GPS' },
    { value: 'other', label: 'Lainnya' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Peralatan</h1>
          <p className="text-gray-600">Kelola inventaris peralatan keselamatan dan penerbangan</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Peralatan
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari nama, brand, model, atau serial number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="text-gray-400 w-4 h-4" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {typeOptions.map((option) => (
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
          { label: 'Total Peralatan', value: equipment.length, color: 'blue' },
          { label: 'Tersedia', value: equipment.filter(e => e.status === 'available').length, color: 'green' },
          { label: 'Perlu Inspeksi', value: equipment.filter(e => isInspectionDue(e.nextInspection)).length, color: 'yellow' },
          { label: 'Perlu Perbaikan', value: equipment.filter(e => e.condition === 'needs-repair').length, color: 'red' },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg bg-${stat.color}-100`}>
                <Shield className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peralatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kondisi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inspeksi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ditugaskan
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEquipment.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.brand} {item.model}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getTypeText(item.type)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{item.serialNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getConditionBadge(item.condition)}>
                      {getConditionText(item.condition)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      {new Date(item.nextInspection).toLocaleDateString('id-ID')}
                    </div>
                    {isInspectionDue(item.nextInspection) && (
                      <div className="flex items-center text-orange-600 text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Segera Inspeksi
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(item.status)}>
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.assignedTo ? getPilotName(item.assignedTo) : 'Tidak Ditugaskan'}
                    </div>
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

        {filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada peralatan</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || typeFilter !== 'all' 
                ? 'Tidak ada peralatan yang sesuai dengan filter.'
                : 'Mulai dengan menambahkan peralatan baru.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${editingEquipment ? 'Edit' : 'Tambah'} Peralatan`}
      >
        <EquipmentForm
          equipment={editingEquipment || undefined}
          pilots={pilots}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

const EquipmentForm: React.FC<{
  equipment?: Equipment;
  pilots: Pilot[];
  onSubmit: (equipment: Omit<Equipment, 'id'>) => void;
  onCancel: () => void;
}> = ({ equipment, pilots, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: equipment?.name || '',
    type: equipment?.type || 'helmet' as const,
    brand: equipment?.brand || '',
    model: equipment?.model || '',
    serialNumber: equipment?.serialNumber || '',
    condition: equipment?.condition || 'excellent' as const,
    lastInspection: equipment?.lastInspection || new Date().toISOString().split('T')[0],
    nextInspection: equipment?.nextInspection || '',
    status: equipment?.status || 'available' as const,
    assignedTo: equipment?.assignedTo || ''
  });

  useEffect(() => {
    if (!formData.nextInspection && formData.lastInspection) {
      // Auto-calculate next inspection date (6 months from last inspection)
      const lastDate = new Date(formData.lastInspection);
      lastDate.setMonth(lastDate.getMonth() + 6);
      setFormData(prev => ({ ...prev, nextInspection: lastDate.toISOString().split('T')[0] }));
    }
  }, [formData.lastInspection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Peralatan
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jenis
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as Equipment['type'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="helmet">Helm</option>
            <option value="harness">Harness</option>
            <option value="reserve">Parasut Cadangan</option>
            <option value="radio">Radio</option>
            <option value="gps">GPS</option>
            <option value="other">Lainnya</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand
          </label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Serial Number
          </label>
          <input
            type="text"
            value={formData.serialNumber}
            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kondisi
          </label>
          <select
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value as Equipment['condition'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="excellent">Sangat Baik</option>
            <option value="good">Baik</option>
            <option value="fair">Cukup</option>
            <option value="needs-repair">Perlu Perbaikan</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Inspeksi Terakhir
          </label>
          <input
            type="date"
            value={formData.lastInspection}
            onChange={(e) => setFormData({ ...formData, lastInspection: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Inspeksi Berikutnya
          </label>
          <input
            type="date"
            value={formData.nextInspection}
            onChange={(e) => setFormData({ ...formData, nextInspection: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Equipment['status'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="available">Tersedia</option>
            <option value="in-use">Digunakan</option>
            <option value="maintenance">Maintenance</option>
            <option value="retired">Pensiun</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ditugaskan ke Pilot
          </label>
          <select
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tidak Ditugaskan</option>
            {pilots.map(pilot => (
              <option key={pilot.id} value={pilot.id}>{pilot.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {equipment ? 'Update' : 'Tambah'} Peralatan
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

export default EquipmentPage;