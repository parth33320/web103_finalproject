import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Inventory & Stock', path: '/inventory', icon: Package },
    { name: 'Purchase Orders & A2A', path: '/purchase-orders', icon: ShoppingCart },
    { name: 'Suppliers & Vendors', path: '/suppliers', icon: Users },
    { name: 'Tenant Configuration', path: '/settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-57px)]">
      <div className="space-y-6">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Orchestrator Modules
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-slate-800 space-y-3">
        {!user ? (
          <NavLink
            to="/login"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Auth</span>
          </NavLink>
        ) : (
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-cyan-400">
              Active Security Context
            </div>
            <div className="text-xs font-mono text-slate-300 mt-1 truncate">
              {user.username}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              JWT Encrypted Token
            </div>
          </div>
        )}

        <div className="text-[10px] text-center text-slate-600 font-mono">
          SupplyAgent v1.0 • Capstone
        </div>
      </div>
    </aside>
  );
}
