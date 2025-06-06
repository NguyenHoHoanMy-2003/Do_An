import { useState, useEffect } from "react";
import "../styles/RoomDetailPopup.scss"; // Import SCSS

const RoomDetailPopup = ({ post, onClose }) => {
    const roomData = post?.room; // Lấy dữ liệu phòng từ post
    const listingPhotoPaths = post?.room?.images?.map(img => img.image_url) || [];

    console.log("Dữ liệu phòng trong popup:", roomData);

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

    const handleRoomItemClick = (roomNumber) => {
        if (roomData?.status === 'available') {
            setSelectedRoomItem(roomNumber); // Chỉ chọn nếu phòng chung là available
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
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
                <div className="left-panel">
                    <h2>{post?.title || 'Chi tiết Listing'}</h2>
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
                    <p><strong>Địa chỉ:</strong> {post?.address || 'Không rõ'}</p>
                    <p><strong>Dãy:</strong> {post?.Property?.name_bd || 'Không rõ'}</p>
                    <p><strong>Tầng:</strong> {post?.room?.floor?.name || 'Không rõ'}</p>
                    <p><strong>Phòng:</strong> {roomData?.name || 'Không rõ'}</p>
                    <p><strong>Loại:</strong> {post?.Category?.value || 'Không rõ'}</p>
                    <p><strong>Giá:</strong> {post?.Attribute?.price ? `${post.Attribute.price} VND` : 'Không rõ'}</p>
                    {/* Thêm thông tin khác nếu cần */}
                </div>

                <div className="right-panel">
                    <h2>Các phòng</h2>
                    <div className="room-list">
                        {roomItems.length > 0 ? (
                            roomItems.map(item => (
                                <div
                                    key={item}
                                    className={`room-item ${roomData?.status === 'available' ? 'available' : 'occupied'}`}
                                    onClick={() => handleRoomItemClick(item)} // Handle click on room item
                                >
                                    Phòng {item} ({roomData?.status === 'available' ? 'Chưa thuê' : 'Đã thuê'})
                                </div>
                            ))
                        ) : (
                            <p>Không có thông tin phòng cụ thể.</p>
                        )}
                    </div>

                    {/* Hiển thị form nếu phòng chung là available VÀ một phòng nhỏ được chọn */}
                    {roomData?.status === 'available' && selectedRoomItem && ( // Chỉ hiển thị form nếu phòng chung available VÀ phòng nhỏ được chọn
                        <div>
                            <h3>Đăng ký thuê Phòng {selectedRoomItem}</h3>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="hoTen">Họ và tên:</label>
                                    <input type="text" id="hoTen" name="hoTen" value={formData.hoTen} onChange={handleInputChange} required />
                                </div>
                                <div>
                                    <label htmlFor="soDienThoai">Số điện thoại:</label>
                                    <input type="text" id="soDienThoai" name="soDienThoai" value={formData.soDienThoai} onChange={handleInputChange} required />
                                </div>
                                <div>
                                    <label htmlFor="cccdSo">CCCD:</label>
                                    <input type="text" id="cccdSo" name="cccdSo" value={formData.cccdSo} onChange={handleInputChange} placeholder="Số CCCD" required />
                                </div>
                                <div>
                                    <label htmlFor="cccdNgayCap">Ngày cấp:</label>
                                    <input type="text" id="cccdNgayCap" name="cccdNgayCap" value={formData.cccdNgayCap} onChange={handleInputChange} placeholder="dd/mm/yyyy" required />
                                </div>
                                <div>
                                    <label htmlFor="cccdNoiCap">Nơi cấp:</label>
                                    <input type="text" id="cccdNoiCap" name="cccdNoiCap" value={formData.cccdNoiCap} onChange={handleInputChange} placeholder="Nơi cấp" required />
                                </div>
                                <button type="submit">Đăng ký</button>
                            </form>
                        </div>
                    )}

                    {/* Hiển thị thông báo đã thuê nếu phòng chung occupied */}
                    {roomData?.status !== 'available' && ( // Chỉ hiển thị thông báo đã thuê nếu phòng chung occupied
                        <p style={{ color: 'red' }}>Phòng chung này đã được thuê.</p>
                    )}

                </div>

                <button onClick={onClose} className="close-button">×</button> {/* Use close-button class */}
            </div>
        </div>
    );
};

export default RoomDetailPopup; 