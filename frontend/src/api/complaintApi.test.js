import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAllComplaints, submitComplaint, fetchStudentComplaints, updateComplaintStatus, apiClient } from './complaintApi';

describe('complaintApi Client Module', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchAllComplaints should perform GET /complaints and return response data', async () => {
    const mockComplaints = [
      { id: 1, title: 'Wifi Issue', status: 'PENDING', studentId: 'STU001' },
      { id: 2, title: 'Lab Computer Broken', status: 'APPROVED', studentId: 'STU002' },
    ];

    vi.spyOn(apiClient, 'get').mockResolvedValue({ data: mockComplaints });

    const result = await fetchAllComplaints();

    expect(apiClient.get).toHaveBeenCalledWith('/complaints');
    expect(result).toEqual(mockComplaints);
    expect(result).toHaveLength(2);
  });

  it('submitComplaint should perform POST /complaints with payload', async () => {
    const payload = {
      studentId: 'STU001',
      title: 'AC Failure',
      description: 'AC in room 101 not working',
      category: 'HOSTEL',
    };

    const mockResponse = { id: 3, ...payload, status: 'PENDING' };
    vi.spyOn(apiClient, 'post').mockResolvedValue({ data: mockResponse });

    const result = await submitComplaint(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/complaints', payload);
    expect(result).toEqual(mockResponse);
  });

  it('fetchStudentComplaints should perform GET /complaints/student/{studentId}', async () => {
    const mockComplaints = [{ id: 1, title: 'Wifi Issue', studentId: 'STU001' }];
    vi.spyOn(apiClient, 'get').mockResolvedValue({ data: mockComplaints });

    const result = await fetchStudentComplaints('STU001');

    expect(apiClient.get).toHaveBeenCalledWith('/complaints/student/STU001');
    expect(result).toEqual(mockComplaints);
  });

  it('updateComplaintStatus should perform PATCH /complaints/{id}/status', async () => {
    const mockUpdated = { id: 1, status: 'APPROVED', adminRemark: 'Fixed' };
    vi.spyOn(apiClient, 'patch').mockResolvedValue({ data: mockUpdated });

    const result = await updateComplaintStatus(1, 'APPROVED', 'Fixed');

    expect(apiClient.patch).toHaveBeenCalledWith('/complaints/1/status', {
      status: 'APPROVED',
      adminRemark: 'Fixed',
    });
    expect(result).toEqual(mockUpdated);
  });
});
