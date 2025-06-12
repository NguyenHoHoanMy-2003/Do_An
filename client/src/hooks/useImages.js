import { useState, useCallback } from 'react';
import { imageService } from '../services';

export const useImages = (roomId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);

  // Lấy danh sách hình ảnh
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await imageService.getRoomImages(roomId);
      setImages(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // Upload một hình ảnh
  const uploadImage = useCallback(async (file) => {
    try {
      setLoading(true);
      setError(null);
      const data = await imageService.uploadImage(file);
      // Cập nhật lại danh sách hình ảnh sau khi upload
      await fetchImages();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchImages]);

  // Upload nhiều hình ảnh
  const uploadMultipleImages = useCallback(async (files) => {
    try {
      setLoading(true);
      setError(null);
      const data = await imageService.uploadMultipleImages(files);
      // Cập nhật lại danh sách hình ảnh sau khi upload
      await fetchImages();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchImages]);

  // Xóa hình ảnh
  const deleteImage = useCallback(async (imageId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await imageService.deleteImage(imageId);
      // Cập nhật lại danh sách hình ảnh sau khi xóa
      await fetchImages();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchImages]);

  // Cập nhật thứ tự hình ảnh
  const updateImageOrder = useCallback(async (imageOrder) => {
    try {
      setLoading(true);
      setError(null);
      const data = await imageService.updateImageOrder(roomId, imageOrder);
      // Cập nhật lại danh sách hình ảnh sau khi thay đổi thứ tự
      await fetchImages();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [roomId, fetchImages]);

  return {
    loading,
    error,
    images,
    fetchImages,
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    updateImageOrder
  };
}; 