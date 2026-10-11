import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { TenantProvider } from './context/TenantContext';
import { AuthProvider } from './context/AuthContext';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';
import SuppliersPage from './pages/SuppliersPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';

function AppLayout() {
  const handleDatabaseReset = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header onDatabaseReset={handleDatabaseReset} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Dynamic redirection for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TenantProvider>
          <AppLayout />
        </TenantProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
