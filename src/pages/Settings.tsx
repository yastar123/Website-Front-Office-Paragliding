import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User, Wind, Users, Package } from 'lucide-react';
import { Pilot, Glider, Agent, FlightPackage } from '../types';
import { storageService } from '../utils/storage';
import Modal from '../components/Modal';
import PilotForm from '../components/forms/PilotForm';
import GliderForm from '../components/forms/GliderForm';
import AgentForm from '../components/forms/AgentForm';
import PackageForm from '../components/forms/PackageForm';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pilots' | 'gliders' | 'agents' | 'packages'>('pilots');
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [gliders, setGliders] = useState<Glider[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [packages, setPackages] = useState<FlightPackage[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'pilot' | 'glider' | 'agent' | 'package'>('pilot');

  useEffect(() => {
    setPilots(storageService.getPilots());
    setGliders(storageService.getGliders());
    setAgents(storageService.getAgents());
    setPackages(storageService.getPackages());
  }, []);

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleAdd = (type: 'pilot' | 'glider' | 'agent' | 'package') => {
    setModalType(type);
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: any, type: 'pilot' | 'glider' | 'agent' | 'package') => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = (id: string, type: 'pilot' | 'glider' | 'agent' | 'package') => {
    if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      switch (type) {
        case 'pilot':
          const updatedPilots = pilots.filter(p => p.id !== id);
          setPilots(updatedPilots);
          storageService.savePilots(updatedPilots);
          break;
        case 'glider':
          const updatedGliders = gliders.filter(g => g.id !== id);
          setGliders(updatedGliders);
          storageService.saveGliders(updatedGliders);
          break;
        case 'agent':
          const updatedAgents = agents.filter(a => a.id !== id);
          setAgents(updatedAgents);
          storageService.saveAgents(updatedAgents);
          break;
        case 'package':
          const updatedPackages = packages.filter(p => p.id !== id);
          setPackages(updatedPackages);
          storageService.savePackages(updatedPackages);
          break;
      }
    }
  };

  const handleSubmit = (data: any, type: 'pilot' | 'glider' | 'agent' | 'package') => {
    const newItem = { ...data, id: editingItem?.id || generateId() };
    
    switch (type) {
      case 'pilot':
        const updatedPilots = editingItem 
          ? pilots.map(p => p.id === editingItem.id ? newItem : p)
          : [...pilots, newItem];
        setPilots(updatedPilots);
        storageService.savePilots(updatedPilots);
        break;
      case 'glider':
        const updatedGliders = editingItem 
          ? gliders.map(g => g.id === editingItem.id ? newItem : g)
          : [...gliders, newItem];
        setGliders(updatedGliders);
        storageService.saveGliders(updatedGliders);
        break;
      case 'agent':
        const updatedAgents = editingItem 
          ? agents.map(a => a.id === editingItem.id ? newItem : a)
          : [...agents, newItem];
        setAgents(updatedAgents);
        storageService.saveAgents(updatedAgents);
        break;
      case 'package':
        const updatedPackages = editingItem 
          ? packages.map(p => p.id === editingItem.id ? newItem : p)
          : [...packages, newItem];
        setPackages(updatedPackages);
        storageService.savePackages(updatedPackages);
        break;
    }
    
    setShowModal(false);
    setEditingItem(null);
  };

  const tabs = [
    { id: 'pilots', name: 'Pilot', icon: User, count: pilots.length },
    { id: 'gliders', name: 'Glider', icon: Wind, count: gliders.length },
    { id: 'agents', name: 'Agen', icon: Users, count: agents.length },
    { id: 'packages', name: 'Paket', icon: Package, count: packages.length },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string, type: 'pilot' | 'glider' | 'agent') => {
    const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full';
    
    if (type === 'pilot') {
      switch (status) {
        case 'available': return `${baseClasses} bg-green-100 text-green-800`;
        case 'busy': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'off-duty': return `${baseClasses} bg-gray-100 text-gray-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    } else if (type === 'glider') {
      switch (status) {
        case 'available': return `${baseClasses} bg-green-100 text-green-800`;
        case 'in-use': return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'maintenance': return `${baseClasses} bg-red-100 text-red-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    } else {
      switch (status) {
        case 'active': return `${baseClasses} bg-green-100 text-green-800`;
        case 'inactive': return `${baseClasses} bg-gray-100 text-gray-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    }
  };

  const renderPilotsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lisensi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pengalaman
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rating
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
          {pilots.map((pilot) => (
            <tr key={pilot.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{pilot.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{pilot.license}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{pilot.experience} tahun</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${star <= pilot.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={getStatusBadge(pilot.status, 'pilot')}>
                  {pilot.status === 'available' ? 'Tersedia' : 
                   pilot.status === 'busy' ? 'Sibuk' : 'Tidak Bertugas'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => handleEdit(pilot, 'pilot')}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(pilot.id, 'pilot')}
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
  );

  const renderGlidersTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Brand & Model
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ukuran
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kondisi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Maintenance
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
          {gliders.map((glider) => (
            <tr key={glider.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{glider.brand}</div>
                <div className="text-sm text-gray-500">{glider.model}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{glider.size}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 capitalize">{glider.condition}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{glider.lastMaintenance}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={getStatusBadge(glider.status, 'glider')}>
                  {glider.status === 'available' ? 'Tersedia' : 
                   glider.status === 'in-use' ? 'Digunakan' : 'Maintenance'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => handleEdit(glider, 'glider')}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(glider.id, 'glider')}
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
  );

  const renderAgentsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kontak
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Komisi
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
          {agents.map((agent) => (
            <tr key={agent.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{agent.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{agent.email}</div>
                <div className="text-sm text-gray-500">{agent.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{agent.commission}%</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={getStatusBadge(agent.status, 'agent')}>
                  {agent.status === 'active' ? 'Aktif' : 'Non-aktif'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => handleEdit(agent, 'agent')}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(agent.id, 'agent')}
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
  );

  const renderPackagesTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Paket
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Durasi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Harga
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tingkat
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Berat Max
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {packages.map((pkg) => (
            <tr key={pkg.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                <div className="text-sm text-gray-500">{pkg.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{pkg.duration} menit</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatCurrency(pkg.price)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  pkg.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  pkg.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {pkg.difficulty === 'beginner' ? 'Pemula' :
                   pkg.difficulty === 'intermediate' ? 'Menengah' : 'Lanjut'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{pkg.maxWeight} kg</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => handleEdit(pkg, 'package')}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(pkg.id, 'package')}
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
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-600">Kelola pilot, glider, agen, dan paket penerbangan</p>
        </div>
        <button
          onClick={() => handleAdd(activeTab)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Baru
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'pilots' && renderPilotsTable()}
        {activeTab === 'gliders' && renderGlidersTable()}
        {activeTab === 'agents' && renderAgentsTable()}
        {activeTab === 'packages' && renderPackagesTable()}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${editingItem ? 'Edit' : 'Tambah'} ${
          modalType === 'pilot' ? 'Pilot' :
          modalType === 'glider' ? 'Glider' :
          modalType === 'agent' ? 'Agen' : 'Paket'
        }`}
      >
        {modalType === 'pilot' && (
          <PilotForm
            pilot={editingItem}
            onSubmit={(data) => handleSubmit(data, 'pilot')}
            onCancel={() => setShowModal(false)}
          />
        )}
        {modalType === 'glider' && (
          <GliderForm
            glider={editingItem}
            onSubmit={(data) => handleSubmit(data, 'glider')}
            onCancel={() => setShowModal(false)}
          />
        )}
        {modalType === 'agent' && (
          <AgentForm
            agent={editingItem}
            onSubmit={(data) => handleSubmit(data, 'agent')}
            onCancel={() => setShowModal(false)}
          />
        )}
        {modalType === 'package' && (
          <PackageForm
            package={editingItem}
            onSubmit={(data) => handleSubmit(data, 'package')}
            onCancel={() => setShowModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Settings;