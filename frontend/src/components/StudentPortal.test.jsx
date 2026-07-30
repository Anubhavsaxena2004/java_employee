import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudentPortal from './StudentPortal';
import ComplaintList, { getStatusBadge } from './ComplaintList';
import * as complaintApi from '../api/complaintApi';

vi.mock('../api/complaintApi');

describe('StudentPortal Component Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders submission form and allows filling out form fields', async () => {
    complaintApi.fetchStudentComplaints.mockResolvedValue([]);

    render(<StudentPortal />);

    const studentIdInput = screen.getByLabelText(/Student Roll ID/i);
    const titleInput = screen.getByLabelText(/Complaint Title/i);
    const categorySelect = screen.getByLabelText(/Category/i);
    const descriptionTextarea = screen.getByLabelText(/Detailed Description/i);

    fireEvent.change(studentIdInput, { target: { value: 'STU001' } });
    fireEvent.change(titleInput, { target: { value: 'Hostel Hot Water Issue' } });
    fireEvent.change(categorySelect, { target: { value: 'HOSTEL' } });
    fireEvent.change(descriptionTextarea, { target: { value: 'Geyser on 3rd floor is not functioning.' } });

    expect(studentIdInput.value).toBe('STU001');
    expect(titleInput.value).toBe('Hostel Hot Water Issue');
    expect(categorySelect.value).toBe('HOSTEL');
    expect(descriptionTextarea.value).toBe('Geyser on 3rd floor is not functioning.');
  });

  it('submits complaint form and displays success feedback notification', async () => {
    complaintApi.fetchStudentComplaints.mockResolvedValue([]);
    complaintApi.submitComplaint.mockResolvedValue({ id: 101, status: 'PENDING' });

    render(<StudentPortal />);

    fireEvent.change(screen.getByLabelText(/Student Roll ID/i), { target: { value: 'STU001' } });
    fireEvent.change(screen.getByLabelText(/Complaint Title/i), { target: { value: 'Library AC Noise' } });
    fireEvent.change(screen.getByLabelText(/Detailed Description/i), { target: { value: 'Loud noise in quiet area.' } });

    const submitBtn = screen.getByRole('button', { name: /Submit Complaint/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(complaintApi.submitComplaint).toHaveBeenCalledWith({
        studentId: 'STU001',
        title: 'Library AC Noise',
        category: 'ACADEMIC',
        description: 'Loud noise in quiet area.',
      });
    });

    expect(await screen.findByText(/Complaint submitted successfully!/i)).toBeInTheDocument();
  });

  it('renders status badges with correct CSS colors based on complaint status (PENDING vs APPROVED)', async () => {
    const mockData = [
      { id: 1, title: 'Issue A', category: 'HOSTEL', status: 'PENDING', description: 'Pending issue', studentId: 'STU001' },
      { id: 2, title: 'Issue B', category: 'ACADEMIC', status: 'APPROVED', description: 'Approved issue', studentId: 'STU001' },
    ];

    complaintApi.fetchStudentComplaints.mockResolvedValue(mockData);

    render(<ComplaintList initialStudentId="STU001" />);

    const badgePending = getStatusBadge('PENDING');
    const badgeApproved = getStatusBadge('APPROVED');

    expect(badgePending.className).toContain('bg-amber-100');
    expect(badgePending.className).toContain('text-amber-800');

    expect(badgeApproved.className).toContain('bg-emerald-100');
    expect(badgeApproved.className).toContain('text-emerald-800');

    await waitFor(() => {
      expect(screen.getByTestId('status-badge-1')).toHaveTextContent('PENDING');
      expect(screen.getByTestId('status-badge-2')).toHaveTextContent('APPROVED');
    });
  });
});
