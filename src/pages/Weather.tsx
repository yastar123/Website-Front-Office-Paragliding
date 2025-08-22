import React, { useState, useEffect } from 'react';
import { Plus, Cloud, Wind, Thermometer, Eye, Droplets, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Weather } from '../types';
import { storageService } from '../utils/storage';
import Modal from '../components/Modal';

const WeatherPage: React.FC = () => {
  const [weatherData, setWeatherData] = useState<Weather[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingWeather, setEditingWeather] = useState<Weather | null>(null);

  useEffect(() => {
    setWeatherData(storageService.getWeather());
  }, []);

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleAdd = () => {
    setEditingWeather(null);
    setShowModal(true);
  };

  const handleEdit = (weather: Weather) => {
    setEditingWeather(weather);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data cuaca ini?')) {
      const updatedWeather = weatherData.filter(w => w.id !== id);
      setWeatherData(updatedWeather);
      storageService.saveWeather(updatedWeather);
    }
  };

  const handleSubmit = (data: Omit<Weather, 'id' | 'createdAt'>) => {
    const newWeather: Weather = {
      ...data,
      id: editingWeather?.id || generateId(),
      createdAt: editingWeather?.createdAt || new Date().toISOString()
    };
    
    const updatedWeather = editingWeather 
      ? weatherData.map(w => w.id === editingWeather.id ? newWeather : w)
      : [...weatherData, newWeather];
    
    setWeatherData(updatedWeather);
    storageService.saveWeather(updatedWeather);
    setShowModal(false);
    setEditingWeather(null);
  };

  const getConditionBadge = (condition: string) => {
    const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full';
    switch (condition) {
      case 'excellent': return `${baseClasses} bg-green-100 text-green-800`;
      case 'good': return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'fair': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'poor': return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'dangerous': return `${baseClasses} bg-red-100 text-red-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'Sangat Baik';
      case 'good': return 'Baik';
      case 'fair': return 'Cukup';
      case 'poor': return 'Buruk';
      case 'dangerous': return 'Berbahaya';
      default: return condition;
    }
  };

  const todayWeather = weatherData.filter(w => w.date === new Date().toISOString().split('T')[0]);
  const currentWeather = todayWeather.length > 0 ? todayWeather[todayWeather.length - 1] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kondisi Cuaca</h1>
          <p className="text-gray-600">Monitor dan catat kondisi cuaca untuk keselamatan penerbangan</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Data Cuaca
        </button>
      </div>

      {/* Current Weather Card */}
      {currentWeather && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Kondisi Cuaca Terkini</h2>
            <div className="flex items-center space-x-2">
              {currentWeather.flyable ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-red-600" />
              )}
              <span className={`text-sm font-medium ${currentWeather.flyable ? 'text-green-600' : 'text-red-600'}`}>
                {currentWeather.flyable ? 'Layak Terbang' : 'Tidak Layak Terbang'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <Wind className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Angin</p>
                <p className="text-lg font-semibold">{currentWeather.windSpeed} km/h</p>
                <p className="text-xs text-gray-400">{currentWeather.windDirection}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Thermometer className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-500">Suhu</p>
                <p className="text-lg font-semibold">{currentWeather.temperature}°C</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Droplets className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-gray-500">Kelembaban</p>
                <p className="text-lg font-semibold">{currentWeather.humidity}%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Eye className="w-8 h-8 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Jarak Pandang</p>
                <p className="text-lg font-semibold">{currentWeather.visibility} km</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <span className={getConditionBadge(currentWeather.conditions)}>
              {getConditionText(currentWeather.conditions)}
            </span>
            <p className="text-sm text-gray-500">
              Diperbarui: {new Date(currentWeather.createdAt).toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      )}

      {/* Weather History */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Cloud className="w-5 h-5 mr-2" />
            Riwayat Data Cuaca
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal & Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Angin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Suhu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kelembaban
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kondisi
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
              {weatherData.map((weather) => (
                <tr key={weather.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(weather.date).toLocaleDateString('id-ID')}</div>
                    <div className="text-sm text-gray-500">{weather.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{weather.windSpeed} km/h</div>
                    <div className="text-sm text-gray-500">{weather.windDirection}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{weather.temperature}°C</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{weather.humidity}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getConditionBadge(weather.conditions)}>
                      {getConditionText(weather.conditions)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {weather.flyable ? (
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      ) : (
                        <X className="w-4 h-4 text-red-600 mr-2" />
                      )}
                      <span className={`text-sm ${weather.flyable ? 'text-green-600' : 'text-red-600'}`}>
                        {weather.flyable ? 'Layak' : 'Tidak Layak'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(weather)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(weather.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {weatherData.length === 0 && (
          <div className="text-center py-12">
            <Cloud className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada data cuaca</h3>
            <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan data cuaca pertama.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${editingWeather ? 'Edit' : 'Tambah'} Data Cuaca`}
      >
        <WeatherForm
          weather={editingWeather || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

const WeatherForm: React.FC<{
  weather?: Weather;
  onSubmit: (weather: Omit<Weather, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}> = ({ weather, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    date: weather?.date || new Date().toISOString().split('T')[0],
    time: weather?.time || new Date().toTimeString().slice(0, 5),
    windSpeed: weather?.windSpeed || 0,
    windDirection: weather?.windDirection || 'N',
    temperature: weather?.temperature || 25,
    humidity: weather?.humidity || 60,
    visibility: weather?.visibility || 10,
    conditions: weather?.conditions || 'good' as const,
    flyable: weather?.flyable ?? true,
    notes: weather?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            Kecepatan Angin (km/h)
          </label>
          <input
            type="number"
            value={formData.windSpeed}
            onChange={(e) => setFormData({ ...formData, windSpeed: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Arah Angin
          </label>
          <select
            value={formData.windDirection}
            onChange={(e) => setFormData({ ...formData, windDirection: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="N">Utara</option>
            <option value="NE">Timur Laut</option>
            <option value="E">Timur</option>
            <option value="SE">Tenggara</option>
            <option value="S">Selatan</option>
            <option value="SW">Barat Daya</option>
            <option value="W">Barat</option>
            <option value="NW">Barat Laut</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Suhu (°C)
          </label>
          <input
            type="number"
            value={formData.temperature}
            onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kelembaban (%)
          </label>
          <input
            type="number"
            value={formData.humidity}
            onChange={(e) => setFormData({ ...formData, humidity: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            max="100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jarak Pandang (km)
          </label>
          <input
            type="number"
            value={formData.visibility}
            onChange={(e) => setFormData({ ...formData, visibility: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kondisi Cuaca
          </label>
          <select
            value={formData.conditions}
            onChange={(e) => setFormData({ ...formData, conditions: e.target.value as Weather['conditions'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="excellent">Sangat Baik</option>
            <option value="good">Baik</option>
            <option value="fair">Cukup</option>
            <option value="poor">Buruk</option>
            <option value="dangerous">Berbahaya</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="flyable"
          checked={formData.flyable}
          onChange={(e) => setFormData({ ...formData, flyable: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="flyable" className="ml-2 block text-sm text-gray-900">
          Layak untuk terbang
        </label>
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
          placeholder="Catatan tambahan tentang kondisi cuaca"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {weather ? 'Update' : 'Tambah'} Data Cuaca
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

export default WeatherPage;