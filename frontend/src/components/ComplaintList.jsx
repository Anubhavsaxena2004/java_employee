import React, { useState, useEffect, useCallback } from 'react';
import { Search, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchStudentComplaints } from '../api/complaintApi';

export function getStatusBadge(status) {
  switch (status) {
    case 'APPROVED':
      return {
        label: 'APPROVED',
        className: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
      };
    case 'REJECTED':
      return {
        label: 'REJECTED',
        className: 'bg-rose-100 text-rose-800 border-rose-300',
        icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
      };
    case 'PENDING':
    default:
      return {
        label: 'PENDING',
        className: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
      };
  }
}

export default function ComplaintList({ initialStudentId = 'STU001', refreshTrigger }) {
  const [studentId, setStudentId] = useState(initialStudentId);
  const [searchInput, setSearchInput] = useState(initialStudentId);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadComplaints = useCallback(async (idToFetch) => {
    if (!idToFetch.trim()) return;
    setLoading(true);
    setError('');

    try {
      const data = await fetchStudentComplaints(idToFetch.trim());
      setComplaints(data);
    } catch (err) {
      setComplaints([]);
      setError(err.response?.data?.message || 'No complaints found or failed to fetch records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      loadComplaints(studentId);
    }
  }, [studentId, refreshTrigger, loadComplaints]);

  const handleSearch = (e) => {
    e.preventDefault();
    setStudentId(searchInput);
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Track Complaints</h3>
          <p className="text-xs text-slate-500">Filter submitted complaints by Student Roll ID.</p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Enter Student ID (e.g. STU001)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white outline-none w-64"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-sky-600" />
          <p className="text-sm font-medium">Fetching complaint records...</p>
        </div>
      ) : error ? (
        <div className="py-8 px-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-700">{error}</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="py-12 border-2 border-dashed border-slate-200 rounded-xl text-center">
          <p className="text-sm text-slate-500 font-medium">
            No complaints found for Student ID <span className="font-bold text-slate-800">"{studentId}"</span>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {complaints.map((complaint) => {
            const badge = getStatusBadge(complaint.status);
            return (
              <div
                key={complaint.id}
                data-testid={`complaint-card-${complaint.id}`}
                className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all shadow-none hover:shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-200/80 px-2.5 py-1 rounded-md">
                      {complaint.category}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{complaint.title}</h4>
                  </div>

                  <span
                    data-testid={`status-badge-${complaint.id}`}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-bold rounded-full border ${badge.className}`}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-4 whitespace-pre-line leading-relaxed">
                  {complaint.description}
                </p>

                {complaint.adminRemark && (
                  <div className="mb-4 p-3 bg-sky-50 border border-sky-200 rounded-lg text-xs text-sky-900">
                    <span className="font-bold">Admin Remark:</span> {complaint.adminRemark}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-200/60 pt-3">
                  <span>Student ID: <strong className="text-slate-700">{complaint.studentId}</strong></span>
                  <span>Submitted: <strong className="text-slate-700">{formatDate(complaint.createdAt)}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
