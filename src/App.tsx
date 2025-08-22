import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, useAuthProvider } from './hooks/useAuth';
import { initializeStorage } from './utils/storage';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import Settings from './pages/Settings';
import Reservations from './pages/Reservations';
import Reception from './pages/Reception';
import Reports from './pages/Reports';
import Weather from './pages/Weather';
import Customers from './pages/Customers';
import Equipment from './pages/Equipment';
import Maintenance from './pages/Maintenance';

function App() {
  const auth = useAuthProvider();

  useEffect(() => {
    initializeStorage();
  }, []);

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      <Router>
        {!auth.user ? (
          <Login />
        ) : (
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/reception" element={<Reception />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        )}
      </Router>
    </AuthContext.Provider>
  );
}

export default App;