import React, { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { getStatusBadge } from './ComplaintList';

export default function AdminComplaintTable({ complaints, onStatusUpdate }) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleAction = async (id, status) => {
    setUpdatingId(id);
    try {
      await onStatusUpdate(id, status);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
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
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider">
            <th className="py-3.5 px-4">ID</th>
            <th className="py-3.5 px-4">Student ID</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4">Title & Description</th>
            <th className="py-3.5 px-4">Created Date</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 text-sm">
          {complaints.length === 0 ? (
            <tr>
              <td colSpan="7" className="py-10 text-center text-slate-500 font-medium">
                No complaints found matching selected filter.
              </td>
            </tr>
          ) : (
            complaints.map((complaint) => {
              const badge = getStatusBadge(complaint.status);
              const isUpdating = updatingId === complaint.id;

              return (
                <tr
                  key={complaint.id}
                  data-testid={`admin-row-${complaint.id}`}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-4 px-4 font-bold text-slate-700">#{complaint.id}</td>
                  <td className="py-4 px-4 font-semibold text-slate-900">{complaint.studentId}</td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                      {complaint.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <div className="font-bold text-slate-900">{complaint.title}</div>
                    <div className="text-xs text-slate-500 line-clamp-2 mt-0.5">{complaint.description}</div>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-500 font-medium whitespace-nowrap">
                    {formatDate(complaint.createdAt)}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      data-testid={`admin-status-badge-${complaint.id}`}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-bold rounded-full border ${badge.className}`}
                    >
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {complaint.status === 'PENDING' ? (
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          aria-label={`Approve complaint ${complaint.id}`}
                          disabled={isUpdating}
                          onClick={() => handleAction(complaint.id, 'APPROVED')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center space-x-1 disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </>
                          )}
                        </button>

                        <button
                          aria-label={`Reject complaint ${complaint.id}`}
                          disabled={isUpdating}
                          onClick={() => handleAction(complaint.id, 'REJECTED')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center space-x-1 disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 italic">No actions needed</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
