import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const submitComplaint = async (payload) => {
  const response = await apiClient.post('/complaints', payload);
  return response.data;
};

export const fetchAllComplaints = async () => {
  const response = await apiClient.get('/complaints');
  return response.data;
};

export const fetchStudentComplaints = async (studentId) => {
  const response = await apiClient.get(`/complaints/student/${studentId}`);
  return response.data;
};

export const updateComplaintStatus = async (id, status, adminRemark = '') => {
  const response = await apiClient.patch(`/complaints/${id}/status`, {
    status,
    adminRemark,
  });
  return response.data;
};
