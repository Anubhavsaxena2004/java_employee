import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StudentPortal from './components/StudentPortal';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('student');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'student' ? (
          <StudentPortal />
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <div className="flex items-center space-x-3 mb-4">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Admin Resolution Dashboard</h2>
                <p className="text-sm text-slate-500">Review pending complaints, approve resolutions, or request details.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
