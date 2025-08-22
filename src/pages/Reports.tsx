import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Download } from 'lucide-react';
import { Reservation, Pilot, Glider, Agent, FlightPackage } from '../types';
import { storageService } from '../utils/storage';

const Reports: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [gliders, setGliders] = useState<Glider[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [packages, setPackages] = useState<FlightPackage[]>([]);

  useEffect(() => {
    setReservations(storageService.getReservations());
    setPilots(storageService.getPilots());
    setGliders(storageService.getGliders());
    setAgents(storageService.getAgents());
    setPackages(storageService.getPackages());
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate statistics
  const totalRevenue = reservations
    .filter(r => r.status !== 'cancelled')
    .reduce((sum, r) => sum + r.totalPrice, 0);

  const completedFlights = reservations.filter(r => r.status === 'completed').length;
  const todayReservations = reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length;

  // Agent performance
  const agentStats = agents.map(agent => {
    const agentReservations = reservations.filter(r => r.agentId === agent.id && r.status !== 'cancelled');
    const revenue = agentReservations.reduce((sum, r) => sum + r.totalPrice, 0);
    const commission = revenue * (agent.commission / 100);
    return {
      ...agent,
      reservations: agentReservations.length,
      revenue,
      commission
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Pilot performance
  const pilotStats = pilots.map(pilot => {
    const pilotReservations = reservations.filter(r => r.pilotId === pilot.id && r.status !== 'cancelled');
    const revenue = pilotReservations.reduce((sum, r) => sum + r.totalPrice, 0);
    return {
      ...pilot,
      reservations: pilotReservations.length,
      revenue
    };
  }).sort((a, b) => b.reservations - a.reservations);

  // Glider usage
  const gliderStats = gliders.map(glider => {
    const gliderReservations = reservations.filter(r => r.gliderId === glider.id && r.status !== 'cancelled');
    return {
      ...glider,
      reservations: gliderReservations.length,
      utilization: gliderReservations.length > 0 ? ((gliderReservations.length / reservations.length) * 100).toFixed(1) : '0'
    };
  }).sort((a, b) => b.reservations - a.reservations);

  // Package popularity
  const packageStats = packages.map(pkg => {
    const packageReservations = reservations.filter(r => r.packageId === pkg.id && r.status !== 'cancelled');
    const revenue = packageReservations.reduce((sum, r) => sum + r.totalPrice, 0);
    return {
      ...pkg,
      reservations: packageReservations.length,
      revenue
    };
  }).sort((a, b) => b.reservations - a.reservations);

  const SimpleBarChart = ({ data, title }: { data: Array<{ name: string; value: number; color?: string }>, title: string }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">{title}</h4>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-20 text-xs text-gray-600 truncate">{item.name}</div>
              <div className="flex-1 mx-3">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color || 'bg-blue-500'}`}
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-8 text-xs text-gray-900 text-right">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
          <p className="text-gray-600">Analisis kinerja dan statistik bisnis</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Ekspor Laporan
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Pendapatan', 
            value: formatCurrency(totalRevenue), 
            color: 'green',
            icon: DollarSign,
            change: '+12.3%'
          },
          { 
            label: 'Total Reservasi', 
            value: reservations.length.toString(), 
            color: 'blue',
            icon: Calendar,
            change: '+8.1%'
          },
          { 
            label: 'Penerbangan Selesai', 
            value: completedFlights.toString(), 
            color: 'purple',
            icon: TrendingUp,
            change: '+15.2%'
          },
          { 
            label: 'Hari Ini', 
            value: todayReservations.toString(), 
            color: 'orange',
            icon: Users,
            change: '+4.7%'
          },
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div className={`flex-shrink-0 p-3 rounded-lg bg-${metric.color}-100`}>
                  <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-gray-500">{metric.label}</p>
                  <p className="text-xs text-green-600">{metric.change}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Performance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <SimpleBarChart
            title="Kinerja Agen (berdasarkan reservasi)"
            data={agentStats.slice(0, 5).map(agent => ({
              name: agent.name.substring(0, 15),
              value: agent.reservations,
              color: 'bg-blue-500'
            }))}
          />
        </div>

        {/* Pilot Performance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <SimpleBarChart
            title="Kinerja Pilot (berdasarkan penerbangan)"
            data={pilotStats.slice(0, 5).map(pilot => ({
              name: pilot.name,
              value: pilot.reservations,
              color: 'bg-green-500'
            }))}
          />
        </div>

        {/* Package Popularity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <SimpleBarChart
            title="Popularitas Paket"
            data={packageStats.map(pkg => ({
              name: pkg.name.substring(0, 15),
              value: pkg.reservations,
              color: 'bg-purple-500'
            }))}
          />
        </div>

        {/* Glider Usage */}
        <div className="bg-white p-6 rounded-lg shadow">
          <SimpleBarChart
            title="Penggunaan Glider"
            data={gliderStats.map(glider => ({
              name: `${glider.brand} ${glider.model}`,
              value: glider.reservations,
              color: 'bg-orange-500'
            }))}
          />
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Details */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Detail Kinerja Agen
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reservasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pendapatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Komisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {agentStats.map((agent) => (
                  <tr key={agent.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.reservations}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(agent.revenue)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(agent.commission)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Package Revenue */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Pendapatan per Paket
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paket</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Terjual</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pendapatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {packageStats.map((pkg) => (
                  <tr key={pkg.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.reservations}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(pkg.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;