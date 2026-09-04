import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CompanyOverview } from './components/CompanyOverview';
import { ProductSuite } from './components/ProductSuite';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { LiveTelemetryDashboard } from './components/LiveTelemetryDashboard';
import { FastApiExplorer } from './components/FastApiExplorer';
import { SecurityAndBackups } from './components/SecurityAndBackups';
import { WaitlistForm } from './components/WaitlistForm';
import { Footer } from './components/Footer';
import { UserRole } from './types';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeRole, setActiveRole] = useState<UserRole>('NetworkAdmin');
  const [activeTab, setActiveTab] = useState<string>('overview');

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    const element = document.getElementById(tab);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans`}>
      {/* Primary Sticky Navbar with RBAC & Live Telemetry Ticker */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        activeTab={activeTab}
        setActiveTab={handleNavigate}
      />

      {/* Main Single-Page App Content */}
      <main>
        {activeTab === 'overview' ? (
          <>
            <HeroSection onNavigate={handleNavigate} />
            <CompanyOverview />
            <ProductSuite />
            <ArchitectureDiagram />
            <LiveTelemetryDashboard activeRole={activeRole} setActiveRole={setActiveRole} />
            <FastApiExplorer />
            <SecurityAndBackups activeRole={activeRole} setActiveRole={setActiveRole} />
            <WaitlistForm />
          </>
        ) : (
          <div className="py-6">
            {activeTab === 'products' && (
              <>
                <ProductSuite />
                <ArchitectureDiagram />
              </>
            )}
            {activeTab === 'architecture' && <ArchitectureDiagram />}
            {activeTab === 'dashboard' && (
              <LiveTelemetryDashboard activeRole={activeRole} setActiveRole={setActiveRole} />
            )}
            {activeTab === 'fastapi' && <FastApiExplorer />}
            {activeTab === 'security' && (
              <SecurityAndBackups activeRole={activeRole} setActiveRole={setActiveRole} />
            )}
            {activeTab === 'waitlist' && <WaitlistForm />}
          </div>
        )}
      </main>

      {/* Deep-Tech Engineering Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
