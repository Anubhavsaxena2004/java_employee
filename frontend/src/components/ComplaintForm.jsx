import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { submitComplaint } from '../api/complaintApi';

export default function ComplaintForm({ onComplaintSubmitted }) {
  const [formData, setFormData] = useState({
    studentId: '',
    title: '',
    category: 'ACADEMIC',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: null, message: '' });

    if (!formData.studentId.trim() || !formData.title.trim() || !formData.description.trim()) {
      setFeedback({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);

    try {
      const result = await submitComplaint(formData);
      setFeedback({
        type: 'success',
        message: `Complaint submitted successfully! Tracking ID: #${result.id || 'Submitted'}`,
      });
      setFormData({
        studentId: formData.studentId, // keep studentId filled for convenience
        title: '',
        category: 'ACADEMIC',
        description: '',
      });
      if (onComplaintSubmitted) {
        onComplaintSubmitted(result);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to submit complaint. Please check student ID or try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-sky-100 p-2.5 rounded-xl text-sky-700">
          <Send className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Submit New Complaint</h3>
          <p className="text-xs text-slate-500">Provide details about your issue for administrative review.</p>
        </div>
      </div>

      {feedback.type && (
        <div
          role="alert"
          className={`mb-6 p-4 rounded-xl flex items-start space-x-3 text-sm font-medium border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="studentId" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Student Roll ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              placeholder="e.g. STU001"
              value={formData.studentId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all outline-none"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all outline-none"
            >
              <option value="ACADEMIC">Academic</option>
              <option value="HOSTEL">Hostel</option>
              <option value="INFRASTRUCTURE">Infrastructure</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Complaint Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Brief title summarizing the issue"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all outline-none"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Detailed Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            placeholder="Explain the complaint in detail..."
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition-all outline-none resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Complaint</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
