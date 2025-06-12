import { useState, useCallback } from 'react';
import { registrationService } from '../services';

export const useRegistration = (roomId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [renterInfo, setRenterInfo] = useState(null);
  const [registrationHistory, setRegistrationHistory] = useState([]);

  // Đăng ký thuê phòng
  const submitRegistration = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await registrationService.submitRegistration({
        ...data,
        roomId
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // Lấy thông tin người thuê
  const fetchRenterInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await registrationService.getRenterInfo(roomId);
      setRenterInfo(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // Cập nhật thông tin người thuê
  const updateRenterInfo = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const updatedData = await registrationService.updateRenterInfo(roomId, data);
      setRenterInfo(updatedData);
      return updatedData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // Hủy đăng ký
  const cancelRegistration = useCallback(async (registrationId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await registrationService.cancelRegistration(registrationId);
      // Cập nhật lại thông tin người thuê sau khi hủy
      await fetchRenterInfo();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchRenterInfo]);

  // Lấy lịch sử đăng ký
  const fetchRegistrationHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await registrationService.getRegistrationHistory(roomId);
      setRegistrationHistory(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  return {
    loading,
    error,
    renterInfo,
    registrationHistory,
    submitRegistration,
    fetchRenterInfo,
    updateRenterInfo,
    cancelRegistration,
    fetchRegistrationHistory
  };
}; 