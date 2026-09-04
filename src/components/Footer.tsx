import React from 'react';
import { Activity, Github, Twitter, Linkedin, Terminal, Shield, FileText } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-bold text-base font-mono text-white">
                Nexus<span className="text-cyan-400">Route</span> AI
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              NexusRoute Labs • Deep Reinforcement Learning for Autonomous Network Backbones and Edge Intelligence.
            </p>
            <p className="text-slate-500 font-mono text-[10px]">
              Founded by Thabang Nhlokoma Buthelezi.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-slate-200 font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Core Products
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-cyan-400 transition-colors">
                  Autonomous Traffic Routing Engine
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-cyan-400 transition-colors">
                  Intelligent Edge Telemetry & Security
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-cyan-400 transition-colors">
                  Self-Healing Topology Planner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-cyan-400 transition-colors">
                  Internet2 / ATT-MPLS Matrix
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-slate-200 font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Developer & Research
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onNavigate('fastapi')} className="hover:text-cyan-400 transition-colors">
                  FastAPI Async Telemetry Spec
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('architecture')} className="hover:text-cyan-400 transition-colors">
                  System Architecture Pipeline
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('security')} className="hover:text-cyan-400 transition-colors">
                  E2EE & Snapshot Registry
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('waitlist')} className="hover:text-cyan-400 transition-colors">
                  Academic Sandboxes & Grants
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-slate-200 font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Operational Status
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Core Nodes: 100% Operational</span>
              </div>
              <p className="text-slate-500 font-mono">
                SLA Guarantee: Sub-100ms Failover
              </p>
              <p className="text-slate-500 font-mono">
                Stage: Stealth R&D / Pre-seed
              </p>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NexusRoute AI (NexusRoute Labs). All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span>TLS 1.3 & AES-256 Validated</span>
            <span>•</span>
            <span>Deterministic Graph-Heuristic Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
