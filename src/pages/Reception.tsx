import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, Calendar, User, Plane, RotateCcw } from 'lucide-react';
import { Reservation, Pilot, Glider, Agent, FlightPackage } from '../types';
import { storageService } from '../utils/storage';

const Reception: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [gliders, setGliders] = useState<Glider[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [packages, setPackages] = useState<FlightPackage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setReservations(storageService.getReservations());
    setPilots(storageService.getPilots());
    setGliders(storageService.getGliders());
    setAgents(storageService.getAgents());
    setPackages(storageService.getPackages());
  }, []);

  // Only show confirmed reservations for today
  const today = new Date().toISOString().split('T')[0];
  const todayReservations = reservations.filter((reservation) => {
    const reservationDate = reservation.date;
    const isToday = reservationDate === today;
    const isConfirmedOrCheckedIn = ['confirmed', 'checked-in'].includes(reservation.status);
    const matchesSearch = reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.id.toLowerCase().includes(searchTerm.toLowerCase());
    return isToday && isConfirmedOrCheckedIn && matchesSearch;
  });

  const handleCheckIn = (reservationId: string) => {
    const updatedReservations = reservations.map((reservation) => 
      reservation.id === reservationId 
        ? { ...reservation, status: 'checked-in' as const }
        : reservation
    );
    setReservations(updatedReservations);
    storageService.saveReservations(updatedReservations);
  };

  const handleComplete = (reservationId: string) => {
    const updatedReservations = reservations.map((reservation) => 
      reservation.id === reservationId 
        ? { ...reservation, status: 'completed' as const }
        : reservation
    );
    setReservations(updatedReservations);
    storageService.saveReservations(updatedReservations);
  };

  const handleRevert = (reservationId: string) => {
    const updatedReservations = reservations.map((reservation) => 
      reservation.id === reservationId 
        ? { ...reservation, status: 'confirmed' as const }
        : reservation
    );
    setReservations(updatedReservations);
    storageService.saveReservations(updatedReservations);
  };

  const getName = (id: string, type: 'pilot' | 'glider' | 'agent' | 'package') => {
    switch (type) {
      case 'pilot': return pilots.find(p => p.id === id)?.name || 'Unknown';
      case 'glider': 
        const glider = gliders.find(g => g.id === id);
        return glider ? `${glider.brand} ${glider.model}` : 'Unknown';
      case 'agent': return agents.find(a => a.id === id)?.name || 'Unknown';
      case 'package': return packages.find(p => p.id === id)?.name || 'Unknown';
      default: return 'Unknown';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resepsi & Check-in</h1>
          <p className="text-gray-600">Verifikasi dan proses check-in pelanggan hari ini</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Hari ini</p>
          <p className="text-lg font-medium text-gray-900">
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, email, atau ID reservasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { 
            label: 'Total Hari Ini', 
            value: todayReservations.length, 
            color: 'blue',
            icon: Calendar 
          },
          { 
            label: 'Belum Check-in', 
            value: todayReservations.filter(r => r.status === 'confirmed').length, 
            color: 'yellow',
            icon: Clock 
          },
          { 
            label: 'Sudah Check-in', 
            value: todayReservations.filter(r => r.status === 'checked-in').length, 
            color: 'green',
            icon: CheckCircle 
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

      {/* Reservations List */}
      <div className="space-y-4">
        {todayReservations.map((reservation) => (
          <div key={reservation.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{reservation.customerName}</h3>
                    <p className="text-sm text-gray-500">{reservation.customerEmail}</p>
                    <p className="text-sm text-gray-500">{reservation.customerPhone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">ID Reservasi</p>
                  <p className="text-lg font-mono font-medium text-gray-900">#{reservation.id.toUpperCase().slice(-6)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Waktu</p>
                  <div className="flex items-center text-sm text-gray-900">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    {reservation.time}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Paket</p>
                  <p className="text-sm text-gray-900">{getName(reservation.packageId, 'package')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pilot</p>
                  <p className="text-sm text-gray-900">{getName(reservation.pilotId, 'pilot')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Glider</p>
                  <div className="flex items-center text-sm text-gray-900">
                    <Plane className="w-4 h-4 mr-2 text-gray-400" />
                    {getName(reservation.gliderId, 'glider')}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    Agen: <span className="font-medium">{getName(reservation.agentId, 'agent')}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Total: <span className="font-medium">{formatCurrency(reservation.totalPrice)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {reservation.status === 'completed' ? (
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg">
                        Selesai
                      </span>
                      <button
                        onClick={() => handleRevert(reservation.id)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Kembalikan
                      </button>
                    </div>
                  ) : reservation.status === 'checked-in' ? (
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-lg">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Sudah Check-in
                      </span>
                      <button
                        onClick={() => handleComplete(reservation.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Selesaikan
                      </button>
                      <button
                        onClick={() => handleRevert(reservation.id)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Kembalikan
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCheckIn(reservation.id)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Check-in
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {todayReservations.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada reservasi hari ini</h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Tidak ada reservasi yang sesuai dengan pencarian.'
                : 'Tidak ada reservasi yang terjadwal untuk hari ini.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reception;