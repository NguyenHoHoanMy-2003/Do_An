import axios from 'axios';
import { store } from '../redux/store'; // Import Redux store

const API_URL = 'http://localhost:5001';

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the authorization token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user.token; // Get token from Redux store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const roomService = {
  // Lấy thông tin chi tiết phòng
  getRoomDetail: async (roomId) => {
    try {
      const response = await api.get(`/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin phòng');
    }
  },

  // Lấy danh sách phòng của một bài đăng
  getRoomList: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/rooms`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách phòng');
    }
  },

  // Cập nhật trạng thái phòng
  updateRoomStatus: async (roomId, status) => {
    try {
      const response = await api.patch(`/rooms/${roomId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái phòng');
    }
  },

  // Xóa phòng
  deleteRoom: async (postId, roomNumber) => {
    console.log(`roomService.deleteRoom: Attempting to send DELETE request for postId: ${postId}, roomNumber: ${roomNumber}`);
    try {
      const response = await api.delete(`/properties/${postId}/rooms/${roomNumber}`);
      console.log("roomService.deleteRoom: Response received:", response.data);
      return response.data;
    } catch (error) {
      console.error("roomService.deleteRoom: Error sending request:", error.response?.data || error.message || error);
      throw new Error(error.response?.data?.message || 'Không thể xóa phòng');
    }
  },

  // Xóa bài đăng
  deleteListing: async (postId) => {
    try {
      const response = await api.delete(`/properties/${postId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể xóa bài đăng');
    }
  },

  // Cập nhật thông tin phòng
  updateRoomInfo: async (roomId, data) => {
    try {
      const response = await api.patch(`/rooms/${roomId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật thông tin phòng');
    }
  },

  // Đăng ký thuê phòng
  registerRoom: async (postId, roomNumber, userData) => {
    try {
      const response = await api.post(`/posts/${postId}/rooms/${roomNumber}/register`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể đăng ký thuê phòng');
    }
  },

  // Lấy danh sách người thuê
  getRenters: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/renters`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách người thuê');
    }
  },

  // Lấy danh sách người đang chờ duyệt
  getPendingRenters: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/pending-renters`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách người đang chờ duyệt');
    }
  },

  // Duyệt đơn đăng ký
  approveRegistration: async (postId, roomNumber, userId) => {
    try {
      const response = await api.post(`/posts/${postId}/rooms/${roomNumber}/approve`, { userId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể duyệt đơn đăng ký');
    }
  },

  // Từ chối đơn đăng ký
  rejectRegistration: async (postId, roomNumber, userId) => {
    try {
      const response = await api.post(`/posts/${postId}/rooms/${roomNumber}/reject`, { userId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể từ chối đơn đăng ký');
    }
  }
}; 