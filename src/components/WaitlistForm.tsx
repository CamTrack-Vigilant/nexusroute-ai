import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  Copy, 
  Check, 
  Building2, 
  Mail, 
  User, 
  Layers, 
  Zap,
  Ticket
} from 'lucide-react';
import { WaitlistSubmission } from '../types';

export const WaitlistForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    workEmail: '',
    company: '',
    roleTitle: '',
    tier: 'isp_telco',
    trafficScale: '10 - 100 Gbps',
    interestArea: 'Autonomous Congestion Rerouting'
  });

  const [submittedTicket, setSubmittedTicket] = useState<WaitlistSubmission | null>(null);
  const [copiedTicket, setCopiedTicket] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const ticket: WaitlistSubmission = {
        id: `NR-PASS-${Math.floor(10000 + Math.random() * 90000)}`,
        name: formData.name,
        workEmail: formData.workEmail,
        company: formData.company,
        roleTitle: formData.roleTitle,
        tier: formData.tier as any,
        trafficScale: formData.trafficScale as any,
        interestArea: formData.interestArea,
        submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        priorityPassId: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      };

      setSubmittedTicket(ticket);
    }, 600);
  };

  const handleCopyTicket = () => {
    if (!submittedTicket) return;
    navigator.clipboard.writeText(`NexusRoute AI Early Access Ticket: ${submittedTicket.id} | Hash: ${submittedTicket.priorityPassId}`);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2000);
  };

  return (
    <section id="waitlist" className="py-16 bg-slate-950 border-b border-slate-900 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STEALTH EARLY ACCESS PROGRAM</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Deploy NexusRoute AI on Your Network
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Join tier-1 telecommunications providers, research laboratories, and distributed enterprises 
            evaluating our autonomous routing engine and edge telemetry layer.
          </p>
        </div>

        {!submittedTicket ? (
          <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Jordan Hayes"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-cyan-500 focus:outline-none placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Work Email *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="j.hayes@carrier-network.com"
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-cyan-500 focus:outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Organization / Carrier *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Global Transit IXP"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-cyan-500 focus:outline-none placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Role Title *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Principal Network Architect"
                    value={formData.roleTitle}
                    onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-cyan-500 focus:outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">Infrastructure Category</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="isp_telco">Tier 1/2 ISP or Telco</option>
                    <option value="multicloud_enterprise">Multi-Cloud Enterprise</option>
                    <option value="academic_research">Academic / Research Lab</option>
                    <option value="logistics_hub">Distributed Logistics Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">Backbone Traffic Scale</label>
                  <select
                    value={formData.trafficScale}
                    onChange={(e) => setFormData({ ...formData, trafficScale: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="< 10 Gbps">&lt; 10 Gbps</option>
                    <option value="10 - 100 Gbps">10 - 100 Gbps</option>
                    <option value="100 Gbps - 1 Tbps">100 Gbps - 1 Tbps</option>
                    <option value="> 1 Tbps">&gt; 1 Tbps Carrier Core</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">Primary Evaluation Focus</label>
                  <select
                    value={formData.interestArea}
                    onChange={(e) => setFormData({ ...formData, interestArea: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Autonomous Congestion Rerouting">Autonomous Congestion Rerouting</option>
                    <option value="Sub-100ms Failover Resilience">Sub-100ms Failover Resilience</option>
                    <option value="Agentless Edge Observability">Agentless Edge Observability</option>
                    <option value="Open-Core GNN Benchmarking">Open-Core GNN Benchmarking</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Confidential NDA & Non-production sandboxes provided</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Registering Cryptographic Pass...</span>
                  ) : (
                    <>
                      <span>Generate Early-Access Pass</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Confirmation Ticket Card */
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-cyan-500/60 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Ticket className="w-5 h-5 text-cyan-400" />
                <span className="font-mono text-xs text-cyan-300 font-bold tracking-wider">
                  NEXUSROUTE LABS EARLY-ACCESS PRIORITY PASS
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-xs font-bold">
                CONFIRMED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div>
                <p className="text-[10px] font-mono text-slate-500 uppercase">Registered Engineer</p>
                <p className="text-base font-bold text-white mt-0.5">{submittedTicket.name}</p>
                <p className="text-xs text-slate-400">{submittedTicket.roleTitle} at {submittedTicket.company}</p>
              </div>

              <div>
                <p className="text-[10px] font-mono text-slate-500 uppercase">Ticket Reference Number</p>
                <p className="text-base font-mono font-bold text-cyan-300 mt-0.5">{submittedTicket.id}</p>
                <p className="text-xs font-mono text-slate-400">Scale: {submittedTicket.trafficScale}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Cryptographic Priority Hash:</span>
                <span className="text-emerald-400 font-semibold">{submittedTicket.priorityPassId}</span>
              </div>
              <div className="flex justify-between">
                <span>Evaluation Track:</span>
                <span className="text-slate-300">{submittedTicket.interestArea}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={handleCopyTicket}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center space-x-2 transition-colors"
              >
                {copiedTicket ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTicket ? 'Copied Details' : 'Copy Ticket Info'}</span>
              </button>

              <button
                onClick={() => setSubmittedTicket(null)}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300"
              >
                Submit another request
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
