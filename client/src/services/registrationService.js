import axios from 'axios';

const API_URL = 'http://localhost:5001';

export const registrationService = {
  // Đăng ký thuê phòng
  submitRegistration: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/registrations`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi đăng ký thuê phòng');
    }
  },

  // Lấy thông tin người thuê
  getRenterInfo: async (roomId) => {
    try {
      const response = await axios.get(`${API_URL}/rooms/${roomId}/renter`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin người thuê');
    }
  },

  // Cập nhật thông tin người thuê
  updateRenterInfo: async (roomId, data) => {
    try {
      const response = await axios.patch(`${API_URL}/rooms/${roomId}/renter`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật thông tin người thuê');
    }
  },

  // Hủy đăng ký thuê phòng
  cancelRegistration: async (registrationId) => {
    try {
      const response = await axios.delete(`${API_URL}/registrations/${registrationId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi hủy đăng ký');
    }
  },

  // Lấy lịch sử đăng ký của một phòng
  getRegistrationHistory: async (roomId) => {
    try {
      const response = await axios.get(`${API_URL}/rooms/${roomId}/registrations`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy lịch sử đăng ký');
    }
  }
}; 