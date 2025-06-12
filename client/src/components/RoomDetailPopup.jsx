// client/src/components/RoomDetailPopup.jsx
import { useState, useEffect, useCallback } from "react";
import "../styles/RoomDetailPopup.scss";


const RoomDetailPopup = ({ post, onClose }) => {
    const roomData = post?.room; // Lấy dữ liệu phòng từ post
    const listingPhotoPaths = post?.room?.images?.map(img => img.image_url) || [];

    // TEMP_SIMULATION_START: Trạng thái giả lập cho từng phòng nhỏ
    // KHÔNG SỬ DỤNG KHI TÍCH HỢP VỚI DATABASE!
    const [simulatedRoomStatuses, setSimulatedRoomStatuses] = useState({});

    useEffect(() => {
        const initialStatuses = {};
        const roomItems = parseRoomName(roomData?.name);
        // Đặt một số phòng là 'occupied' để giả lập
        if (roomItems.length > 0) {
            initialStatuses[roomItems[0]] = 'occupied'; // Giả lập phòng đầu tiên là đã thuê
            if (roomItems.length > 2) {
                initialStatuses[roomItems[2]] = 'occupied'; // Giả lập phòng thứ ba là đã thuê (nếu có)
            }
        }
        setSimulatedRoomStatuses(initialStatuses);
    }, [roomData?.name]);
    // TEMP_SIMULATION_END

    const [formData, setFormData] = useState({
        hoTen: '',
        soDienThoai: '',
        cccdSo: '',
        cccdNgayCap: '',
        cccdNoiCap: '',
    });
    const [selectedSubRoom, setSelectedSubRoom] = useState(null); // State để theo dõi phòng nhỏ được chọn

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
    const handleRoomItemClick = (roomNumber) => {
        // TEMP_SIMULATION_START: Cập nhật logic để dựa vào trạng thái giả lập của từng phòng
        // SẼ THAY THẾ BẰNG LOGIC TỪ DATABASE SAU NÀY!
        if (simulatedRoomStatuses[roomNumber] === 'available' || !simulatedRoomStatuses[roomNumber]) { // Nếu phòng chưa thuê hoặc không có trạng thái cụ thể (mặc định là available)
            setSelectedRoomItem(roomNumber); 
            // Reset form data khi chọn phòng mới
            setFormData({
                hoTen: '',
                soDienThoai: '',
                cccdSo: '',
                cccdNgayCap: '',
                cccdNoiCap: '',
            });
        } else {
            setSelectedRoomItem(null); // Bỏ chọn nếu click vào phòng đã thuê
        }
        // TEMP_SIMULATION_END
    };


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
                    <h2>Các phòng</h2>
                    <div className="room-list">
                        {roomItems.length > 0 ? (
                            roomItems.map(item => {
                                // TEMP_SIMULATION_START: Sử dụng trạng thái giả lập cho từng phòng
                                // SẼ THAY THẾ BẰNG room.individualRoomStatuses[item] HOẶC TƯƠNG TỰ TỪ DATABASE!
                                const isRoomOccupied = simulatedRoomStatuses[item] === 'occupied';
                                const roomStatusText = isRoomOccupied ? 'Đã thuê' : 'Chưa thuê';
                                const roomStatusClass = isRoomOccupied ? 'occupied' : 'available';
                                // TEMP_SIMULATION_END

                                return (
                                    <div
                                        key={item}
                                        className={`room-item ${roomStatusClass}`} // Sử dụng class từ trạng thái giả lập
                                        onClick={() => handleRoomItemClick(item)} 
                                    >
                                        Phòng {item} ({roomStatusText})
                                    </div>
                                );
                            })
                        ) : (
                            <p>Không có thông tin phòng cụ thể hoặc tất cả phòng đã bị xóa.</p>
                        )}
                    </div>

                    {/* TEMP_SIMULATION_START: Logic hiển thị form dựa trên trạng thái giả lập của phòng nhỏ được chọn */}
                    {/* SẼ THAY THẾ BẰNG (selectedRoomItem && room.individualRoomStatuses[selectedRoomItem] === 'available') HOẶC TƯƠNG TỰ */}
                    {selectedRoomItem && (simulatedRoomStatuses[selectedRoomItem] === 'available' || !simulatedRoomStatuses[selectedRoomItem]) && (
                        <div>
                            <h3>Đăng ký thuê Phòng {selectedRoomItem}</h3>
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
                    {/* TEMP_SIMULATION_END */}

                    {/* TEMP_SIMULATION_START: Hiển thị thông báo khi tất cả các phòng nhỏ đã thuê hoặc phòng chung đã thuê */}
                    {/* SẼ THAY THẾ BẰNG LOGIC KIỂM TRA TRẠNG THÁI CỦA TỪNG PHÒNG TỪ DATABASE */} 
                    {roomItems.every(item => simulatedRoomStatuses[item] === 'occupied') && (
                        <p style={{ color: 'red' }}>Tất cả các phòng trong listing này đã được thuê.</p>
                    )}
                    {/* XÓA PHẦN NÀY KHI TÍCH HỢP DATABASE: roomData?.status !== 'available' && ( */}
                    {/*  <p style={{ color: 'red' }}>Phòng chung này được thuê.</p> */}
                    {/* ) */}
                    {/* TEMP_SIMULATION_END */}

                </div>

                <button onClick={onClose} className="close-button">×</button>
            </div>
        </div>
    );
};

export default RoomDetailPopup;