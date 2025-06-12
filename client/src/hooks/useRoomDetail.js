import { useState, useEffect, useCallback } from 'react';
import { roomService } from '../services/roomService';

export const useRoomDetail = (post, onClose, onDeleteSubRoom, onDeleteListing) => {
  // State
  const [selectedSubRoom, setSelectedSubRoom] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [formData, setFormData] = useState({
    hoTen: "",
    soDienThoai: "",
    cccdSo: "",
    cccdNgayCap: "",
    cccdNoiCap: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDeleteRoomDialog, setShowDeleteRoomDialog] = useState(false);
  const [showDeleteListingDialog, setShowDeleteListingDialog] = useState(false);
  const [renters, setRenters] = useState([]);
  const [pendingRenters, setPendingRenters] = useState([]);

  // Derived data
  const roomData = post?.room;
  const listingPhotoPaths = post?.room?.images?.map((img) => img.image_url) || [];
  const bookedRooms = post.bookedRooms || [];
  const pendingRooms = post.pendingRooms || [];

  // Fetch renters data
  useEffect(() => {
    const fetchRentersData = async () => {
      if (post?.id_post) {
        try {
          const [rentersData, pendingRentersData] = await Promise.all([
            roomService.getRenters(post.id_post),
            roomService.getPendingRenters(post.id_post)
          ]);
          setRenters(rentersData);
          setPendingRenters(pendingRentersData);
        } catch (err) {
          setError(err.message);
        }
      }
    };
    fetchRentersData();
  }, [post?.id_post]);

  // Helper functions
  const parseRoomName = useCallback((name) => {
    if (!name) return [];
    name = name.trim();

    if (name.includes("-")) {
      const [start, end] = name.split("-").map((num) => parseInt(num, 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        return Array.from({ length: end - start + 1 }, (_, i) =>
          (start + i).toString()
        );
      }
    } else if (name.includes(",")) {
      return name
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    } else if (name !== "") {
      return [name];
    }
    return [];
  }, []);

  const getRoomStatus = useCallback((item) => {
    if (bookedRooms.includes(item)) return 'Đã thuê';
    if (pendingRooms.includes(item)) return 'Đang chờ';
    return 'Chưa thuê';
  }, [bookedRooms, pendingRooms]);

  const getRenterInfo = useCallback((room, status) => {
    if (status === 'Đã thuê') {
      return renters.find(r => r.room === room);
    }
    if (status === 'Đang chờ') {
      return pendingRenters.find(r => r.room === room);
    }
    return null;
  }, [renters, pendingRenters]);

  // Event handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await roomService.registerRoom(post.id_post, selectedSubRoom, formData);
      setSuccess("Đăng ký thành công!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [post.id_post, selectedSubRoom, formData]);

  const handleRoomItemClick = useCallback((roomNumber) => {
    setSelectedSubRoom(roomNumber);
  }, []);

  const handleDeleteRoom = useCallback(async () => {
    console.log("handleDeleteRoom called.");
    setLoading(true);
    setError(null);
    try {
      console.log(`Calling roomService.deleteRoom for postId: ${post.id_post}, roomNumber: ${selectedSubRoom}`);
      await roomService.deleteRoom(post.id_post, selectedSubRoom);
      setSuccess("Xóa phòng thành công!");
      setShowDeleteRoomDialog(false);
      if (onDeleteSubRoom) {
        onDeleteSubRoom();
      }
    } catch (err) {
      console.error("Error in handleDeleteRoom:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [post.id_post, selectedSubRoom, onDeleteSubRoom]);

  const handleDeleteListing = useCallback(async () => {
    console.log("handleDeleteListing called for postId:", post.id_post);
    setLoading(true);
    setError(null);
    try {
      console.log("Calling roomService.deleteListing...");
      const result = await roomService.deleteListing(post.id_post);
      console.log("Delete listing result:", result);
      setSuccess("Xóa bài đăng thành công!");
      setShowDeleteListingDialog(false);
      onClose();
      if (onDeleteListing) {
        console.log("Calling onDeleteListing callback...");
        onDeleteListing();
      }
    } catch (err) {
      console.error("Error in handleDeleteListing:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [post.id_post, onClose, onDeleteListing]);

  const handleApproveRegistration = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      await roomService.approveRegistration(post.id_post, selectedSubRoom, userId);
      setSuccess("Duyệt đơn đăng ký thành công!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [post.id_post, selectedSubRoom]);

  const handleRejectRegistration = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      await roomService.rejectRegistration(post.id_post, selectedSubRoom, userId);
      setSuccess("Từ chối đơn đăng ký thành công!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [post.id_post, selectedSubRoom]);

  return {
    // State
    selectedSubRoom,
    userDetail,
    formData,
    loading,
    error,
    success,
    showDeleteRoomDialog,
    showDeleteListingDialog,
    renters,
    pendingRenters,
    roomData,
    listingPhotoPaths,
    bookedRooms,
    pendingRooms,

    // Helper functions
    parseRoomName,
    getRoomStatus,
    getRenterInfo,

    // Event handlers
    handleInputChange,
    handleSubmit,
    handleRoomItemClick,
    handleDeleteRoom,
    handleDeleteListing,
    handleApproveRegistration,
    handleRejectRegistration,

    // State setters
    setSelectedSubRoom,
    setUserDetail,
    setFormData,
    setError,
    setSuccess,
    setShowDeleteRoomDialog,
    setShowDeleteListingDialog,
  };
}; 