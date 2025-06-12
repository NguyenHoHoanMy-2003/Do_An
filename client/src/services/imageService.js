import axios from 'axios';

const API_URL = 'http://localhost:5001';

export const imageService = {
  // Upload một hình ảnh
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`${API_URL}/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi upload hình ảnh');
    }
  },

  // Upload nhiều hình ảnh
  uploadMultipleImages: async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const response = await axios.post(`${API_URL}/images/upload-multiple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi upload nhiều hình ảnh');
    }
  },

  // Xóa một hình ảnh
  deleteImage: async (imageId) => {
    try {
      const response = await axios.delete(`${API_URL}/images/${imageId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi xóa hình ảnh');
    }
  },

  // Cập nhật thứ tự hình ảnh
  updateImageOrder: async (roomId, imageOrder) => {
    try {
      const response = await axios.patch(`${API_URL}/rooms/${roomId}/images/order`, {
        imageOrder,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật thứ tự hình ảnh');
    }
  },

  // Lấy danh sách hình ảnh của một phòng
  getRoomImages: async (roomId) => {
    try {
      const response = await axios.get(`${API_URL}/rooms/${roomId}/images`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách hình ảnh');
    }
  }
}; 