// client/src/components/RoomDetailPopup.jsx
import { useState, useEffect, useCallback } from "react";
import "../styles/RoomDetailPopup.scss";
import { useSelector } from "react-redux";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const RoomDetailPopup = ({ post, onClose }) => {
    const roomData = post?.room; // Lấy dữ liệu phòng từ post
    const listingPhotoPaths = post?.room?.images?.map(img => img.image_url) || [];
    const user = useSelector((state) => state.user.user); // Lấy thông tin user từ Redux store
    const isRenter = user?.role === "renter"; // Giả định role được lưu trong user.role
    const isHost = user?.role === "host";
    const navigate = useNavigate();

    // TEMP_SIMULATION_START: Trạng thái giả lập cho từng phòng nhỏ
    // KHÔNG SỬ DỤNG KHI TÍCH HỢP VỚI DATABASE!
    const [simulatedRoomStatuses, setSimulatedRoomStatuses] = useState({});
    const [renterInfo, setRenterInfo] = useState(null); // State để lưu thông tin người thuê được chọn
    const [isDeleteMode, setIsDeleteMode] = useState(false); // Thêm state cho chế độ xóa
    const [roomsToDelete, setRoomsToDelete] = useState([]); // State để lưu các phòng đã chọn để xóa

    const staticRenterData = {
        '201': { hoTen: 'Nguyễn Văn A', soDienThoai: '0901234567', cccdSo: '123456789', cccdNgayCap: '01/01/2020', cccdNoiCap: 'Hà Nội' },
        '203': { hoTen: 'Trần Thị B', soDienThoai: '0912345678', cccdSo: '987654321', cccdNgayCap: '05/03/2021', cccdNoiCap: 'Đà Nẵng' },
        // Thêm các phòng khác nếu cần
    };

    // Dữ liệu tĩnh mô phỏng các phòng ban đầu có thể xóa
    const [staticAvailableRooms, setStaticAvailableRooms] = useState({});

    useEffect(() => {
        const initialStatuses = {};
        const initialAvailable = {};
        const roomItems = parseRoomName(roomData?.name);
        // Đặt một số phòng là 'occupied' để giả lập
        if (roomItems.length > 0) {
            initialStatuses[roomItems[0]] = 'occupied'; // Giả lập phòng đầu tiên là đã thuê (ví dụ 201)
            if (roomItems.length > 2) {
                initialStatuses[roomItems[2]] = 'occupied'; // Giả lập phòng thứ ba là đã thuê (ví dụ 203)
            }
        }
        // Đặt các phòng còn lại là available
        roomItems.forEach(item => {
            if (!initialStatuses[item]) {
                initialStatuses[item] = 'available';
                initialAvailable[item] = true; // Đánh dấu là available để xóa
            }
        });
        setSimulatedRoomStatuses(initialStatuses);
        setStaticAvailableRooms(initialAvailable);
    }, [roomData?.name]);
    // TEMP_SIMULATION_END

    const [formData, setFormData] = useState({
        hoTen: '',
        soDienThoai: '',
        cccdSo: '',
        cccdNgayCap: '',
        cccdNoiCap: '',
    });
    const [selectedRoomItem, setSelectedRoomItem] = useState(null); // State để theo dõi phòng nhỏ được chọn

    // Function để phân tích tên phòng thành danh sách các số phòng
    const parseRoomName = (name) => {
        if (!name) return [];
        name = name.trim();
        if (name.includes('-')) {
            const parts = name.split('-');
            if (parts.length === 2) {
                const start = parseInt(parts[0], 10);
                const end = parseInt(parts[1], 10);
                if (!isNaN(start) && !isNaN(end) && start <= end) {
                    const rooms = [];
                    for (let i = start; i <= end; i++) {
                        rooms.push(i.toString());
                    }
                    return rooms;
                }
            }
        } else if (name.includes(',')) {
            return name.split(',').map(item => item.trim()).filter(item => item !== '');
        } else if (name !== '') {
            return [name];
        }
        return [];
    };

    const roomItems = parseRoomName(roomData?.name);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data Submitted for room:', selectedRoomItem, formData);
        // Logic xử lý submit form (gửi lên backend) sẽ được thêm sau
        // onClose(); // Đóng popup sau khi submit thành công (hoặc thất bại)
    };
    
    const handleToggleDeleteMode = () => {
        setIsDeleteMode(!isDeleteMode);
        setRoomsToDelete([]); // Reset các phòng đã chọn khi chuyển chế độ
        setSelectedRoomItem(null); // Bỏ chọn phòng
        setRenterInfo(null); // Bỏ thông tin người thuê
        setFormData({
            hoTen: '',
            soDienThoai: '',
            cccdSo: '',
            cccdNgayCap: '',
            cccdNoiCap: '',
        });
    };

    const handleDeleteRooms = () => {
        if (roomsToDelete.length === 0) return;

        // Mô phỏng xóa phòng: Cập nhật simulatedRoomStatuses
        const newSimulatedRoomStatuses = { ...simulatedRoomStatuses };
        const newStaticAvailableRooms = { ...staticAvailableRooms };

        roomsToDelete.forEach(roomId => {
            delete newSimulatedRoomStatuses[roomId]; // Xóa trạng thái của phòng
            delete newStaticAvailableRooms[roomId]; // Xóa khỏi danh sách available
        });

        setSimulatedRoomStatuses(newSimulatedRoomStatuses);
        setStaticAvailableRooms(newStaticAvailableRooms);
        setRoomsToDelete([]); // Reset các phòng đã xóa
        setIsDeleteMode(false); // Thoát chế độ xóa
        setSelectedRoomItem(null);
        setRenterInfo(null);
        alert(`Đã xóa các phòng: ${roomsToDelete.join(', ')}`);
    };

    const handleRoomItemClick = (roomNumber) => {
        const isOccupied = simulatedRoomStatuses[roomNumber] === 'occupied';

        if (isHost) {
            if (isDeleteMode) {
                // Trong chế độ xóa, chỉ cho phép chọn phòng trống
                if (!isOccupied) {
                    setRoomsToDelete(prev =>
                        prev.includes(roomNumber)
                            ? prev.filter(id => id !== roomNumber)
                            : [...prev, roomNumber]
                    );
                    setSelectedRoomItem(null); // Bỏ chọn phòng hiện tại khi ở chế độ xóa
                    setRenterInfo(null); // Đảm bảo không hiển thị thông tin người thuê
                    setFormData({
                        hoTen: '',
                        soDienThoai: '',
                        cccdSo: '',
                        cccdNgayCap: '',
                        cccdNoiCap: '',
                    });
                } else {
                    // Nếu là phòng đã thuê, không làm gì khi ở chế độ xóa
                    alert('Không thể xóa phòng đã được thuê.');
                }
            } else { // Host không ở chế độ xóa
                setSelectedRoomItem(roomNumber);
                if (isOccupied) {
                    setRenterInfo(staticRenterData[roomNumber] || null);
                } else {
                    setRenterInfo(null);
                }
                setFormData({
                    hoTen: '',
                    soDienThoai: '',
                    cccdSo: '',
                    cccdNgayCap: '',
                    cccdNoiCap: '',
                });
            }
        } else if (isRenter) {
            setSelectedRoomItem(roomNumber);
            if (!isOccupied) {
                setRenterInfo(null);
                setFormData({
                    hoTen: '',
                    soDienThoai: '',
                    cccdSo: '',
                    cccdNgayCap: '',
                    cccdNoiCap: '',
                });
            } else {
                setSelectedRoomItem(null); // Bỏ chọn nếu renter click phòng đã thuê
                setRenterInfo(null);
                setFormData({
                    hoTen: '',
                    soDienThoai: '',
                    cccdSo: '',
                    cccdNgayCap: '',
                    cccdNoiCap: '',
                });
            }
        }
    };

    const handleOverlayClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    const handleEditPost = () => {
        // Đóng popup trước khi điều hướng
        onClose();
        // Điều hướng đến trang chỉnh sửa bài đăng và truyền dữ liệu bài đăng
        navigate(`/edit-listing/${post.id_post}`, { state: { post } });
    };

    const handleDeletePost = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bài đăng này không? Hành động này không thể hoàn tác.')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5001/properties/${post.id_post}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({ userId: user.id_user }), // Gửi userId để kiểm tra quyền sở hữu
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Xóa bài đăng thất bại.');
            }

            alert('Bài đăng đã được xóa thành công!');
            onClose(); // Đóng popup sau khi xóa thành công
            window.location.reload(); // Tải lại trang để cập nhật danh sách bài đăng
        } catch (error) {
            console.error('Delete Post Error:', error);
            alert(`Lỗi khi xóa bài đăng: ${error.message}`);
        }
    };

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);

        // Calculate scrollbar width and apply padding-right to body
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px'; // Reset padding
        };
    }, [onClose]);

    // Lọc lại roomItems để loại bỏ các phòng đã bị xóa (mô phỏng)
    const displayRoomItems = roomItems.filter(item => simulatedRoomStatuses[item] !== undefined);

    const isOwnedByUser = user && post.user_id === user.id_user;

    console.log("User object:", user);
    console.log("User ID from Redux:", user?.id_user);
    console.log("Post object:", post);
    console.log("Post User ID:", post?.user_id);
    console.log("Is Host:", isHost);
    console.log("Is Owned By User:", isOwnedByUser);

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
                        {isHost && isOwnedByUser && (
                            <div className="host-actions">
                                <button className="edit-post-btn" onClick={handleEditPost}>
                                    Sửa bài đăng
                                    <Edit />
                                </button>
                                <button className="delete-mode-toggle-btn" onClick={handleToggleDeleteMode}>
                                    {isDeleteMode ? 'Thoát chế độ xóa' : 'Xóa phòng'}
                                    <Delete />
                                </button>
                                <button className="delete-post-btn" onClick={handleDeletePost}>
                                    Xóa bài đăng
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="room-list">
                        {displayRoomItems.length > 0 ? (
                            displayRoomItems.map(item => {
                                const isRoomOccupied = simulatedRoomStatuses[item] === 'occupied';
                                const roomStatusText = isRoomOccupied ? 'Đã thuê' : 'Chưa thuê';
                                const roomStatusClass = isRoomOccupied ? 'occupied' : 'available';
                                const isSelected = selectedRoomItem === item;
                                const isMarkedForDeletion = roomsToDelete.includes(item); // Kiểm tra phòng có được chọn để xóa không

                                return (
                                    <div
                                        key={item}
                                        className={`room-item ${roomStatusClass} ${isSelected ? 'selected' : ''} ${isDeleteMode && isMarkedForDeletion ? 'marked-for-deletion' : ''}`}
                                        onClick={() => handleRoomItemClick(item)}
                                    >
                                        Phòng {item}
                                        <div className="room-status">{roomStatusText}</div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>Không có thông tin phòng cụ thể hoặc tất cả phòng đã bị xóa.</p>
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

                    {isRenter && selectedRoomItem && (simulatedRoomStatuses[selectedRoomItem] === 'available' || !simulatedRoomStatuses[selectedRoomItem]) && (
                        <div className="registration-form">
                            <h3>Đăng ký thuê Phòng {selectedRoomItem}</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="hoTen">Họ và tên:</label>
                                    <input type="text" id="hoTen" name="hoTen" value={formData.hoTen} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="soDienThoai">Số điện thoại:</label>
                                    <input type="text" id="soDienThoai" name="soDienThoai" value={formData.soDienThoai} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cccdSo">CCCD:</label>
                                    <input type="text" id="cccdSo" name="cccdSo" value={formData.cccdSo} onChange={handleInputChange} placeholder="Số CCCD" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cccdNgayCap">Ngày cấp:</label>
                                    <input type="text" id="cccdNgayCap" name="cccdNgayCap" value={formData.cccdNgayCap} onChange={handleInputChange} placeholder="dd/mm/yyyy" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cccdNoiCap">Nơi cấp:</label>
                                    <input type="text" id="cccdNoiCap" name="cccdNoiCap" value={formData.cccdNoiCap} onChange={handleInputChange} placeholder="Nơi cấp" required />
                                </div>
                                <button type="submit">Đăng ký</button>
                            </form>
                        </div>
                    )}

                    {isHost && selectedRoomItem && simulatedRoomStatuses[selectedRoomItem] === 'occupied' && renterInfo && (
                        <div className="renter-info">
                            <h3>Thông tin người thuê Phòng {selectedRoomItem}</h3>
                            <p><strong>Họ và tên:</strong> {renterInfo.hoTen}</p>
                            <p><strong>Số điện thoại:</strong> {renterInfo.soDienThoai}</p>
                            <p><strong>CCCD:</strong> {renterInfo.cccdSo}</p>
                            <p><strong>Ngày cấp:</strong> {renterInfo.cccdNgayCap}</p>
                            <p><strong>Nơi cấp:</strong> {renterInfo.cccdNoiCap}</p>
                        </div>
                    )}

                    {roomItems.every(item => simulatedRoomStatuses[item] === 'occupied') && (
                        <p className="error-message">Tất cả các phòng trong listing này đã được thuê.</p>
                    )}

                    {isHost && !selectedRoomItem && !isDeleteMode && (
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