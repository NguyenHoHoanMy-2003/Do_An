// client/src/components/RoomDetailPopup.jsx
import { useState, useEffect, useCallback } from "react";
import "../styles/RoomDetailPopup.scss";
import { useSelector } from "react-redux";
import { Delete } from "@mui/icons-material";

const RoomDetailPopup = ({ post, onClose }) => {
    const roomData = post?.room; // Lấy dữ liệu phòng từ post
    const listingPhotoPaths = post?.room?.images?.map(img => img.image_url) || [];
    const user = useSelector((state) => state.user.user); // Lấy thông tin user từ Redux store
    const isRenter = user?.role === "renter"; // Giả định role được lưu trong user.role
    const isHost = user?.role === "host";

    const [subRooms, setSubRooms] = useState(roomData?.subRooms || []); // State để lưu thông tin phòng con thực tế
    const [renterInfo, setRenterInfo] = useState(null); // State để lưu thông tin người thuê được chọn
    const [isDeleteMode, setIsDeleteMode] = useState(false); // Thêm state cho chế độ xóa
    const [roomsToDelete, setRoomsToDelete] = useState([]); // State để lưu các phòng đã chọn để xóa

    // Cập nhật subRooms khi post.room.subRooms thay đổi
    useEffect(() => {
        setSubRooms(roomData?.subRooms || []);
    }, [roomData?.subRooms]);

    const [formData, setFormData] = useState({
        hoTen: '',
        soDienThoai: '',
        cccdSo: '',
        cccdNgayCap: '',
        cccdNoiCap: '',
    });
    const [selectedSubRoom, setSelectedSubRoom] = useState(null); // State để theo dõi phòng nhỏ được chọn



    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data Submitted for room:', selectedSubRoom?.name, formData);
        // Logic xử lý submit form (gửi lên backend) sẽ được thêm sau
        // Ví dụ: Gửi yêu cầu đăng ký thuê phòng
        try {
            const response = await fetch("http://localhost:5001/contracts/create", { // Thay đổi endpoint nếu cần
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${user.token}` // Nếu có token
                },
                body: JSON.stringify({
                    roomId: roomData.id_room, // ID của Room cha
                    subRoomId: selectedSubRoom.id, // ID của SubRoom được chọn
                    renterInfo: formData, // Thông tin người thuê
                    // ... các thông tin khác cần thiết cho hợp đồng
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Đăng ký thuê phòng thất bại.");
            }

            const result = await response.json();
            alert(result.message || "Đăng ký thuê phòng thành công!");
            // Cập nhật trạng thái phòng nếu đăng ký thành công
            // (Bạn sẽ cần một API để cập nhật trạng thái phòng con)
            // Ví dụ: setSubRooms(prev => prev.map(sr => sr.id === selectedSubRoom.id ? { ...sr, status: 'occupied' } : sr));
            onClose(); // Đóng popup sau khi submit thành công
        } catch (error) {
            console.error("Lỗi đăng ký thuê phòng:", error.message);
            alert(error.message);
        }
    };

    const handleToggleDeleteMode = () => {
        setIsDeleteMode(prev => !prev);
        setRoomsToDelete([]); // Reset các phòng đã chọn khi chuyển chế độ
        setSelectedSubRoom(null); // Bỏ chọn phòng
        setRenterInfo(null); // Bỏ thông tin người thuê
        setFormData({
            hoTen: '',
            soDienThoai: '',
            cccdSo: '',
            cccdNgayCap: '',
            cccdNoiCap: '',
        });
    };

    const handleDeleteRooms = async () => {
        if (roomsToDelete.length === 0) return;

        if (!window.confirm(`Bạn có chắc chắn muốn xóa ${roomsToDelete.length} phòng này?`)) {
            return;
        }

        try {
            const response = await fetch("http://localhost:5001/subrooms/delete", { // Sẽ tạo API này
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${user.token}` // Nếu có token
                },
                body: JSON.stringify({ subRoomIds: roomsToDelete })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Xóa phòng thất bại.");
            }

            const result = await response.json();
            alert(result.message || "Xóa phòng thành công!");

            // Cập nhật lại state subRooms sau khi xóa thành công
            setSubRooms(prevSubRooms =>
                prevSubRooms.filter(room => !roomsToDelete.includes(room.id))
            );

            setRoomsToDelete([]); // Reset các phòng đã xóa
            setIsDeleteMode(false); // Thoát chế độ xóa
            setSelectedSubRoom(null);
            setRenterInfo(null);
        } catch (error) {
            console.error("Lỗi khi xóa phòng:", error.message);
            alert(error.message);
        }
    };

    const handleRoomItemClick = async (subRoom) => {
        const isOccupied = subRoom.status === 'occupied';

        if (isHost) {
            if (isDeleteMode) {
                // Trong chế độ xóa, chỉ cho phép chọn phòng trống
                if (!isOccupied) {
                    setRoomsToDelete(prev =>
                        prev.includes(subRoom.id)
                            ? prev.filter(id => id !== subRoom.id)
                            : [...prev, subRoom.id]
                    );
                    setSelectedSubRoom(null); // Bỏ chọn phòng hiện tại khi ở chế độ xóa
                    setRenterInfo(null); // Đảm bảo không hiển thị thông tin người thuê
                    setFormData({
                        hoTen: '', soDienThoai: '', cccdSo: '', cccdNgayCap: '', cccdNoiCap: '',
                    });
                } else {
                    alert('Không thể xóa phòng đã được thuê.');
                }
            } else { // Host không ở chế độ xóa
                setSelectedSubRoom(subRoom);
                if (isOccupied) {
                    // TODO: Gọi API để lấy thông tin người thuê của phòng này
                    // const response = await fetch(`http://localhost:5001/contracts/room/${subRoom.id}/renter`);
                    // const data = await response.json();
                    // setRenterInfo(data.renterInfo);
                    setRenterInfo({ hoTen: 'Người Thuê A', soDienThoai: '0123456789', cccdSo: '12345', cccdNgayCap: '01/01/2020', cccdNoiCap: 'HN' }); // Tạm thời dùng static
                } else {
                    setRenterInfo(null);
                }
                setFormData({
                    hoTen: '', soDienThoai: '', cccdSo: '', cccdNgayCap: '', cccdNoiCap: '',
                });
            }
        } else if (isRenter) {
            setSelectedSubRoom(subRoom);
            if (!isOccupied) {
                setRenterInfo(null);
                setFormData({
                    hoTen: '', soDienThoai: '', cccdSo: '', cccdNgayCap: '', cccdNoiCap: '',
                });
            } else {
                setSelectedSubRoom(null); // Bỏ chọn nếu renter click phòng đã thuê
                setRenterInfo(null);
                setFormData({
                    hoTen: '', soDienThoai: '', cccdSo: '', cccdNgayCap: '', cccdNoiCap: '',
                });
                alert('Phòng này đã được thuê. Vui lòng chọn phòng khác.');
            }
        }
    };

    const handleOverlayClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);

        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px'; // Reset padding
        };
    }, [onClose]);

    // Sử dụng subRooms từ state thay vì roomItems từ parseRoomName
    const displaySubRooms = [...subRooms].sort((a, b) => {
        return parseInt(a.name, 10) - parseInt(b.name, 10);
    });

    useEffect(() => {
        // Khi renter chọn phòng, tự động fetch info user theo id_user
        if (isRenter && selectedSubRoom && selectedSubRoom.status === 'available' && user?.id_user) {
            fetch(`http://localhost:5001/users/public/${user.id_user}`)
                .then(res => res.json())
                .then(userData => {
                    setFormData({
                        hoTen: userData.name || '',
                        soDienThoai: userData.phone || '',
                        cccdSo: userData.national_id || '',
                        cccdNgayCap: userData.date_of_issue ? new Date(userData.date_of_issue).toLocaleDateString('vi-VN') : '',
                        cccdNoiCap: userData.place_of_issue || ''
                    });
                })
                .catch(err => {
                    setFormData({
                        hoTen: '', soDienThoai: '', cccdSo: '', cccdNgayCap: '', cccdNoiCap: ''
                    });
                });
        }
    }, [isRenter, selectedSubRoom, user]);

    return (
        <div className="popup-overlay" onClick={handleOverlayClick}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
                <div className="left-panel">
                    <h2>{post?.title || 'Chi tiết Phòng'}</h2>
                    <div className="image-gallery">
                        {listingPhotoPaths.length > 0 ? (
                            listingPhotoPaths.map((photo, index) => (
                                <img
                                    key={index}
                                    src={photo.startsWith("http") ? photo : `http://localhost:5001${photo}`}
                                    alt={`photo ${index + 1}`}
                                />
                            ))
                        ) : (
                            <img src="/assets/no-image.png" alt="no img" />
                        )}
                    </div>
                    <div className="info-list">
                        <p><strong>Địa chỉ:</strong> {post?.address || 'Không rõ'}</p>
                        <p><strong>Dãy:</strong> {post?.Property?.name_bd || 'Không rõ'}</p>
                        <p><strong>Tầng:</strong> {post?.room?.floor?.name || 'Không rõ'}</p>
                        <p><strong>Phòng:</strong> {roomData?.name || 'Không rõ'}</p>
                        <p><strong>Loại:</strong> {post?.Category?.value || 'Không rõ'}</p>
                        <p><strong>Giá:</strong> {post?.Attribute?.price ? `${post.Attribute.price} VND` : 'Không rõ'}</p>
                    </div>
                </div>

                <div className="right-panel">
                    <div className="rooms-header">
                        <h2>Các phòng</h2>
                        {isHost && (
                            <button className="delete-mode-toggle-btn" onClick={handleToggleDeleteMode}>
                                {isDeleteMode ? 'Thoát chế độ xóa' : 'Xóa phòng'}
                                <Delete />
                            </button>
                        )}
                    </div>
                    <div className="room-list">
                        {displaySubRooms.length > 0 ? (
                            displaySubRooms.map(subRoom => {
                                const isRoomOccupied = subRoom.status === 'occupied';
                                const roomStatusText = isRoomOccupied ? 'Đã thuê' : 'Chưa thuê';
                                const roomStatusClass = isRoomOccupied ? 'occupied' : 'available';
                                // So sánh với selectedSubRoom.id thay vì selectedRoomItem
                                const isSelected = selectedSubRoom && selectedSubRoom.id === subRoom.id;
                                const isMarkedForDeletion = roomsToDelete.includes(subRoom.id); // Kiểm tra phòng có được chọn để xóa không

                                return (
                                    <div
                                        key={subRoom.id}
                                        className={`room-item ${roomStatusClass} ${isSelected ? 'selected' : ''} ${isDeleteMode && isMarkedForDeletion ? 'marked-for-deletion' : ''}`}
                                        onClick={() => handleRoomItemClick(subRoom)} // Truyền toàn bộ subRoom object
                                    >
                                        Phòng {subRoom.name}
                                        <div className="room-status">{roomStatusText}</div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>Không có thông tin phòng cụ thể.</p>
                        )}
                    </div>

                    {isHost && isDeleteMode && roomsToDelete.length > 0 && (
                        <div className="delete-actions">
                            <button className="confirm-delete-btn" onClick={handleDeleteRooms}>
                                Xác nhận xóa ({roomsToDelete.length} phòng)
                            </button>
                            <button className="cancel-delete-btn" onClick={handleToggleDeleteMode}>
                                Hủy
                            </button>
                        </div>
                    )}

                    {isRenter && selectedSubRoom && selectedSubRoom.status === 'available' && ( // Kiểm tra trạng thái thực tế
                        <div className="registration-form">
                            <h3>Đăng ký thuê Phòng {selectedSubRoom.name}</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="hoTen">Họ và tên:</label>
                                    <input type="text" id="hoTen" name="hoTen" value={formData.hoTen}  required readOnly />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="soDienThoai">Số điện thoại:</label>
                                    <input type="text" id="soDienThoai" name="soDienThoai" value={formData.soDienThoai}  required readOnly />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cccdSo">CCCD:</label>
                                    <input type="text" id="cccdSo" name="cccdSo" value={formData.cccdSo}  placeholder="Số CCCD" required readOnly />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cccdNgayCap">Ngày cấp:</label>
                                    <input type="text" id="cccdNgayCap" name="cccdNgayCap" value={formData.cccdNgayCap}  placeholder="dd/mm/yyyy" required readOnly />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cccdNoiCap">Nơi cấp:</label>
                                    <input type="text" id="cccdNoiCap" name="cccdNoiCap" value={formData.cccdNoiCap}  placeholder="Nơi cấp" required readOnly />
                                </div>
                                <button type="submit">Đăng ký</button>
                            </form>
                        </div>
                    )}

                    {isHost && selectedSubRoom && selectedSubRoom.status === 'occupied' && renterInfo && (
                        <div className="renter-info">
                            <h3>Thông tin người thuê Phòng {selectedSubRoom.name}</h3>
                            <p><strong>Họ và tên:</strong> {renterInfo.hoTen}</p>
                            <p><strong>Số điện thoại:</strong> {renterInfo.soDienThoai}</p>
                            <p><strong>CCCD:</strong> {renterInfo.cccdSo}</p>
                            <p><strong>Ngày cấp:</strong> {renterInfo.cccdNgayCap}</p>
                            <p><strong>Nơi cấp:</strong> {renterInfo.cccdNoiCap}</p>
                        </div>
                    )}

                    {displaySubRooms.length > 0 && displaySubRooms.every(subRoom => subRoom.status === 'occupied') && (
                        <p className="error-message">Tất cả các phòng trong listing này đã được thuê.</p>
                    )}

                    {isHost && !selectedSubRoom && !isDeleteMode && (
                        <p style={{ marginTop: '20px', fontSize: '16px', color: '#555' }}>
                            Bạn là chủ nhà, bấm vào phòng đã thuê để xem thông tin người thuê.<br/>Bấm "Xóa phòng" để quản lý phòng.
                        </p>
                    )}

                    {isHost && isDeleteMode && roomsToDelete.length === 0 && (
                        <p style={{ marginTop: '20px', fontSize: '16px', color: '#555' }}>
                            Chọn các phòng chưa thuê để xóa.
                        </p>
                    )}

                </div>

                <button onClick={onClose} className="close-button">×</button>
            </div>
        </div>
    );
};

export default RoomDetailPopup;