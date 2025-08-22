import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Reservation, DashboardStats } from '../types';
import { storageService } from '../utils/storage';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalReservations: 0,
    todayReservations: 0,
    revenue: 0,
    checkIns: 0
  });
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const reservations = storageService.getReservations();
    const today = new Date().toISOString().split('T')[0];
    
    const todayReservations = reservations.filter(r => r.date === today);
    const completedReservations = reservations.filter(r => r.status === 'completed');
    const checkedInReservations = reservations.filter(r => r.status === 'checked-in');
    const totalRevenue = completedReservations.reduce((sum, r) => sum + r.totalPrice, 0);

    setStats({
      totalReservations: reservations.length,
      todayReservations: todayReservations.length,
      revenue: totalRevenue,
      checkIns: checkedInReservations.length
    });

    // Get recent reservations (last 5)
    const recent = reservations
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    setRecentReservations(recent);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'pending': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'confirmed': return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'checked-in': return `${baseClasses} bg-green-100 text-green-800`;
      case 'completed': return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'cancelled': return `${baseClasses} bg-red-100 text-red-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'confirmed': return 'Dikonfirmasi';
      case 'checked-in': return 'Check-in';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Ringkasan aktivitas dan statistik hari ini</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Reservasi', 
            value: stats.totalReservations.toString(), 
            color: 'blue',
            icon: Calendar,
            change: '+12%'
          },
          { 
            label: 'Hari Ini', 
            value: stats.todayReservations.toString(), 
            color: 'green',
            icon: Clock,
            change: '+8%'
          },
          { 
            label: 'Total Pendapatan', 
            value: formatCurrency(stats.revenue), 
            color: 'purple',
            icon: DollarSign,
            change: '+15%'
          },
          { 
            label: 'Check-in Aktif', 
            value: stats.checkIns.toString(), 
            color: 'orange',
            icon: CheckCircle,
            change: '+5%'
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div className={`flex-shrink-0 p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Reservations */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Reservasi Terbaru
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{reservation.customerName}</div>
                    <div className="text-sm text-gray-500">{reservation.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(reservation.date).toLocaleDateString('id-ID')}</div>
                    <div className="text-sm text-gray-500">{reservation.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(reservation.totalPrice)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(reservation.status)}>
                      {getStatusText(reservation.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {recentReservations.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada reservasi</h3>
            <p className="mt-1 text-sm text-gray-500">Reservasi akan muncul di sini setelah dibuat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;