import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminDashboard from './AdminDashboard';
import * as complaintApi from '../api/complaintApi';

vi.mock('../api/complaintApi');

describe('AdminDashboard Component Suite', () => {
  const mockComplaints = [
    {
      id: 1,
      studentId: 'STU001',
      category: 'HOSTEL',
      title: 'Water Leakage',
      description: 'Pipe leaking in bathroom',
      status: 'PENDING',
      createdAt: '2026-07-30T10:00:00Z',
    },
    {
      id: 2,
      studentId: 'STU002',
      category: 'ACADEMIC',
      title: 'Grade Query',
      description: 'Question about mid-sem exam grade',
      status: 'APPROVED',
      createdAt: '2026-07-30T09:00:00Z',
    },
    {
      id: 3,
      studentId: 'STU003',
      category: 'INFRASTRUCTURE',
      title: 'Broken Chair',
      description: 'Chair broken in room 102',
      status: 'REJECTED',
      createdAt: '2026-07-30T08:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders metric cards and complaint rows', async () => {
    complaintApi.fetchAllComplaints.mockResolvedValue(mockComplaints);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('metric-total')).toHaveTextContent('3');
      expect(screen.getByTestId('metric-pending')).toHaveTextContent('1');
      expect(screen.getByTestId('metric-approved')).toHaveTextContent('1');
      expect(screen.getByTestId('metric-rejected')).toHaveTextContent('1');
    });

    expect(screen.getByTestId('admin-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('admin-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('admin-row-3')).toBeInTheDocument();
  });

  it('clicking Approve triggers API call and replaces action buttons with APPROVED badge', async () => {
    complaintApi.fetchAllComplaints.mockResolvedValue(mockComplaints);
    complaintApi.updateComplaintStatus.mockResolvedValue({
      id: 1,
      status: 'APPROVED',
      adminRemark: 'Updated by Admin to APPROVED',
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('admin-row-1')).toBeInTheDocument();
    });

    const approveBtn = screen.getByRole('button', { name: /Approve complaint 1/i });
    fireEvent.click(approveBtn);

    await waitFor(() => {
      expect(complaintApi.updateComplaintStatus).toHaveBeenCalledWith(1, 'APPROVED', expect.any(String));
    });

    await waitFor(() => {
      expect(screen.getByTestId('admin-status-badge-1')).toHaveTextContent('APPROVED');
    });
  });

  it('filters table rows by status tabs (Pending, Approved, Rejected)', async () => {
    complaintApi.fetchAllComplaints.mockResolvedValue(mockComplaints);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('admin-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('admin-row-2')).toBeInTheDocument();
      expect(screen.getByTestId('admin-row-3')).toBeInTheDocument();
    });

    // Filter to Pending
    const pendingFilterBtn = screen.getByRole('button', { name: /Pending \(1\)/i });
    fireEvent.click(pendingFilterBtn);

    expect(screen.getByTestId('admin-row-1')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-row-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('admin-row-3')).not.toBeInTheDocument();

    // Filter to Approved
    const approvedFilterBtn = screen.getByRole('button', { name: /Approved \(1\)/i });
    fireEvent.click(approvedFilterBtn);

    expect(screen.queryByTestId('admin-row-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('admin-row-2')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-row-3')).not.toBeInTheDocument();
  });
});
