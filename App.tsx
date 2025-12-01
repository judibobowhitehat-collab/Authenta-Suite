import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { VerificationTool } from './components/VerificationTool';
import { AppView } from './types';
import { Bell, Search, UserCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.VERIFY:
        return <VerificationTool />;
      case AppView.HISTORY:
        return <div className="p-8 text-center text-slate-500">History Module - Coming Soon</div>;
      case AppView.SETTINGS:
        return <div className="p-8 text-center text-slate-500">Settings Module - Coming Soon</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <div className="ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 w-96">
            <Search className="text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search specific verification ID..." 
              className="w-full text-sm outline-none text-slate-700 placeholder-slate-400"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 hover:text-slate-700">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white translate-x-1/4 -translate-y-1/4"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">Judah Araba</p>
                <p className="text-xs text-slate-500">Admin</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                <UserCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 capitalize">
                {currentView.toLowerCase().replace('_', ' ')}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {currentView === AppView.DASHBOARD && "Overview of your verification metrics and pending actions."}
                {currentView === AppView.VERIFY && "AI-powered document analysis engine."}
                {currentView === AppView.HISTORY && "Audit logs and past verification attempts."}
                {currentView === AppView.SETTINGS && "System configuration and API preferences."}
              </p>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
