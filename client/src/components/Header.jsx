import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, Building2, User, LogOut, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Header({ onDatabaseReset }) {
  const { activeTenant, changeTenant, tenants, tenantSettings } = useTenant();
  const { user, logout } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleReset = async () => {
    if (clicked || resetting) return;
    setClicked(true);
    setResetting(true);

    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success('Database restored to default seeded state!');
        if (onDatabaseReset) onDatabaseReset();
      }
    } catch (err) {
      toast.error('Failed to reset database.');
    } finally {
      setResetting(false);
      setTimeout(() => setClicked(false), 1500);
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md">
            SA
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
              SupplyAgent
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                v1.0 FDE
              </span>
            </h1>
            <p className="text-xs text-slate-400">Sovereign Supply Chain Orchestrator</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-5">
        {/* Active Tenant Scoping Switcher */}
        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-400 font-medium">Scope:</span>
          <select
            value={activeTenant}
            onChange={(e) => changeTenant(e.target.value)}
            className="bg-transparent text-xs font-semibold text-cyan-300 focus:outline-none cursor-pointer"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200">
                {t.icon} {t.name} ({t.id})
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-500 border-l border-slate-800 pl-2">
            Limit: {tenantSettings.preferred_currency === 'EUR' ? '€' : '$'}{tenantSettings.budget_limit?.toLocaleString()}
          </span>
        </div>

        {/* Database Reset Button */}
        <button
          onClick={handleReset}
          disabled={resetting || clicked}
          className={`flex items-center space-x-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
            clicked || resetting
              ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-60'
              : 'bg-rose-950/60 text-rose-300 border-rose-800/80 hover:bg-rose-900/80 hover:text-white'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
          <span>{resetting ? 'Resetting DB...' : 'Reset DB State'}</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-cyan-700 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1">
              {user?.name || 'Supply Admin'}
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-[10px] text-slate-400">{user?.role || 'Tenant Admin'}</div>
          </div>
          {user && (
            <button
              onClick={logout}
              title="Logout"
              className="text-slate-400 hover:text-rose-400 transition-colors p-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
