import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const TenantContext = createContext();

export const TENANTS = [
  { id: 'tenant_01', name: 'Acme Corp', slug: 'acme', icon: '🏢' },
  { id: 'tenant_02', name: 'Stark Tech', slug: 'stark', icon: '⚡' },
  { id: 'tenant_03', name: 'Cyberdyne Systems', slug: 'cyberdyne', icon: '🤖' }
];

export function TenantProvider({ children }) {
  const [activeTenant, setActiveTenant] = useState('tenant_01');
  const [tenantSettings, setTenantSettings] = useState({
    budget_limit: 50000,
    auto_po_enabled: true,
    preferred_currency: 'USD',
    low_stock_threshold: 15
  });
  const [loadingSettings, setLoadingSettings] = useState(false);

  useEffect(() => {
    fetchTenantSettings(activeTenant);
  }, [activeTenant]);

  const fetchTenantSettings = async (tenantId) => {
    setLoadingSettings(true);
    try {
      const res = await fetch('/api/tenant/settings', {
        headers: { 'X-Tenant-ID': tenantId }
      });
      const data = await res.json();
      if (data.settings) {
        setTenantSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to fetch tenant settings:', err);
    } finally {
      setLoadingSettings(false);
    }
  };

  const changeTenant = (tenantId) => {
    setActiveTenant(tenantId);
    const tenantName = TENANTS.find(t => t.id === tenantId)?.name || tenantId;
    toast.info(`Switched active session scope to ${tenantName}`);
  };

  return (
    <TenantContext.Provider value={{
      activeTenant,
      changeTenant,
      tenantSettings,
      setTenantSettings,
      loadingSettings,
      fetchTenantSettings,
      tenants: TENANTS
    }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
