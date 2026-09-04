import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Sun, 
  Moon, 
  UserCircle2, 
  Lock, 
  Check, 
  ChevronDown,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { UserRole, UserSession } from '../types';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  activeRole,
  setActiveRole,
  activeTab,
  setActiveTab,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roleDescriptions: Record<UserRole, { label: string; badge: string; desc: string }> = {
    NetworkAdmin: {
      label: 'Network Administrator',
      badge: 'Full Root Access',
      desc: 'Can inject hotspots, trigger failovers, and commit topology rebalancing.'
    },
    EdgeEngineer: {
      label: 'Edge Systems Engineer',
      badge: 'Edge Telemetry Ops',
      desc: 'Can view packet probes, inspect agentless telemetry, and issue backups.'
    },
    ResearchAnalyst: {
      label: 'Research Fellow',
      badge: 'Model & Benchmarks',
      desc: 'Can inspect DRL matrices, run GNN evaluations, and review FastAPI specs.'
    },
    ReadOnlyObserver: {
      label: 'Read-Only Observer',
      badge: 'Public View',
      desc: 'Can monitor live topology and submit early-access requests.'
    }
  };

  const navLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: 'Products' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'dashboard', label: 'Live Telemetry' },
    { id: 'fastapi', label: 'FastAPI Spec' },
    { id: 'security', label: 'Security & Snapshots' },
    { id: 'waitlist', label: 'Early Access' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-200 bg-slate-950/85 border-slate-800/80 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo & Founder Tag */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button 
              onClick={() => setActiveTab('overview')}
              className="flex items-center space-x-2.5 text-left group focus:outline-none"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
                <Activity className="w-5 h-5 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950"></span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold tracking-tight text-lg sm:text-xl font-mono text-white">
                    Nexus<span className="text-cyan-400">Route</span><span className="text-xs ml-1 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/50 text-cyan-300">AI</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  NexusRoute Labs • Deep Reinforcement Routing
                </p>
              </div>
            </button>
          </div>

          {/* Nav items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all duration-150 relative ${
                    isActive 
                      ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                  }`}
                >
                  {item.label}
                  {item.id === 'fastapi' && (
                    <span className="ml-1.5 text-[10px] font-mono px-1 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      v1.4
                    </span>
                  )}
                  {item.id === 'dashboard' && (
                    <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Sub-100ms SLA Pill */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-[11px] tracking-wide">Sub-100ms Failover SLA</span>
            </div>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/70 hover:border-slate-600 text-xs font-medium text-slate-200 transition-colors"
                title="Switch administrative user role"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline font-mono text-[11px]">{roleDescriptions[activeRole].label}</span>
                <span className="sm:hidden font-mono text-[11px]">{activeRole.slice(0, 5)}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-xs">
                  <div className="px-2.5 py-1.5 mb-1 border-b border-slate-800">
                    <p className="font-semibold text-slate-200">Role-Based Access Control</p>
                    <p className="text-[11px] text-slate-400">Select active permission identity</p>
                  </div>
                  {(Object.keys(roleDescriptions) as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setActiveRole(role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-start justify-between transition-colors ${
                        activeRole === role ? 'bg-cyan-950/70 border border-cyan-800/70 text-white' : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-semibold">{roleDescriptions[role].label}</span>
                          <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                            {roleDescriptions[role].badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{roleDescriptions[role].desc}</p>
                      </div>
                      {activeRole === role && <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Waitlist CTA Button */}
            <button
              onClick={() => setActiveTab('waitlist')}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/25 transition-all flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Request Early Access</span>
              <span className="sm:hidden">Access</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal scroll nav */}
        <div className="flex md:hidden overflow-x-auto space-x-2 py-2 border-t border-slate-900 scrollbar-none">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
                activeTab === item.id ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
