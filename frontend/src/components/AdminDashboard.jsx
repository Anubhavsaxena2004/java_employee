import React, { useState, useEffect, useMemo } from 'react';
import { ClipboardList, Clock, CheckCircle, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchAllComplaints, updateComplaintStatus } from '../api/complaintApi';
import AdminComplaintTable from './AdminComplaintTable';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  const loadAllComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllComplaints();
      setComplaints(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaints for Admin Dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllComplaints();
  }, []);

  const metrics = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === 'PENDING').length;
    const approved = complaints.filter((c) => c.status === 'APPROVED').length;
    const rejected = complaints.filter((c) => c.status === 'REJECTED').length;
    return { total, pending, approved, rejected };
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    if (filter === 'ALL') return complaints;
    return complaints.filter((c) => c.status === filter);
  }, [complaints, filter]);

  const handleStatusUpdate = async (id, status) => {
    const updated = await updateComplaintStatus(id, status, `Updated by Admin to ${status}`);
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: updated.status, adminRemark: updated.adminRemark } : c))
    );
  };

  return (
    <div className="space-y-8">
      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Complaints</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1" data-testid="metric-total">
              {metrics.total}
            </h3>
          </div>
          <div className="bg-slate-100 p-3 rounded-xl text-slate-700">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Action</p>
            <h3 className="text-3xl font-black text-amber-900 mt-1" data-testid="metric-pending">
              {metrics.pending}
            </h3>
          </div>
          <div className="bg-amber-100 p-3 rounded-xl text-amber-700">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Approved</p>
            <h3 className="text-3xl font-black text-emerald-900 mt-1" data-testid="metric-approved">
              {metrics.approved}
            </h3>
          </div>
          <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-rose-200 bg-rose-50/30 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">Rejected</p>
            <h3 className="text-3xl font-black text-rose-900 mt-1" data-testid="metric-rejected">
              {metrics.rejected}
            </h3>
          </div>
          <div className="bg-rose-100 p-3 rounded-xl text-rose-700">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Complaints Management</h3>
            <p className="text-xs text-slate-500">Review student complaints and take resolution decisions.</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({metrics.total})
            </button>

            <button
              onClick={() => setFilter('PENDING')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === 'PENDING'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({metrics.pending})
            </button>

            <button
              onClick={() => setFilter('APPROVED')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === 'APPROVED'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Approved ({metrics.approved})
            </button>

            <button
              onClick={() => setFilter('REJECTED')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === 'REJECTED'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rejected ({metrics.rejected})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm font-medium">Loading complaints dashboard...</p>
          </div>
        ) : error ? (
          <div className="py-8 px-4 bg-rose-50 border border-rose-200 rounded-xl text-center">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-rose-800">{error}</p>
          </div>
        ) : (
          <AdminComplaintTable complaints={filteredComplaints} onStatusUpdate={handleStatusUpdate} />
        )}
      </div>
    </div>
  );
}
