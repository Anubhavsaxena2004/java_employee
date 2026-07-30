import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StudentPortal from './components/StudentPortal';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('student');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'student' ? <StudentPortal /> : <AdminDashboard />}
      </main>
    </div>
  );
}
