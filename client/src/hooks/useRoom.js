import { useState, useCallback } from 'react';
import { roomService } from '../services';

export const useRoom = (postId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [roomList, setRoomList] = useState([]);

  // Lấy thông tin chi tiết phòng
  const fetchRoomDetails = useCallback(async (roomId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await roomService.getRoomDetails(roomId);
      setRoomData(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy danh sách phòng
  const fetchRoomList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await roomService.getRoomList(postId);
      setRoomList(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // Cập nhật trạng thái phòng
  const updateRoomStatus = useCallback(async (roomId, status) => {
    try {
      setLoading(true);
      setError(null);
      const data = await roomService.updateRoomStatus(roomId, status);
      // Cập nhật lại danh sách phòng sau khi thay đổi trạng thái
      await fetchRoomList();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchRoomList]);

  // Xóa phòng
  const deleteRoom = useCallback(async (roomId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await roomService.deleteRoom(roomId);
      // Cập nhật lại danh sách phòng sau khi xóa
      await fetchRoomList();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchRoomList]);

  // Xóa bài đăng
  const deleteListing = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await roomService.deleteListing(postId);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // Cập nhật thông tin phòng
  const updateRoomInfo = useCallback(async (roomId, data) => {
    try {
      setLoading(true);
      setError(null);
      const updatedData = await roomService.updateRoomInfo(roomId, data);
      // Cập nhật lại thông tin phòng sau khi thay đổi
      await fetchRoomDetails(roomId);
      return updatedData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchRoomDetails]);

  return {
    loading,
    error,
    roomData,
    roomList,
    fetchRoomDetails,
    fetchRoomList,
    updateRoomStatus,
    deleteRoom,
    deleteListing,
    updateRoomInfo
  };
}; 