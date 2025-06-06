import { useState } from "react";
import "../styles/ListingCard.scss";
import { ArrowForwardIos, ArrowBackIosNew } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import RoomDetailPopup from "./RoomDetailPopup"; // Import RoomDetailPopup

const ListingCard = ({ post }) => {
    const _listingId = post.id_post || "";
    const _title = post.title || "Không rõ";
    const _address = post.address || "Không rõ";
    const _propertyName = post.Property?.name_bd || "Không rõ";
    const _floorName = post.room?.floor?.name || "Không rõ";
    const _roomName = post.room?.name || "Không rõ";
    const _price = post.Attribute?.price ? `${post.Attribute.price} VND` : "Không rõ";
    const _category = post.Category?.value || "Không rõ";
    const _listingPhotoPaths = post.room?.images?.map(img => img.image_url) || [];

    console.log('ListingCard post data:', post);
    console.log('Listing photo paths:', _listingPhotoPaths);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showPopup, setShowPopup] = useState(false); // State để điều khiển popup
    const navigate = useNavigate();

    const goToPrevSlide = (e) => {
        e.stopPropagation();
        const newIndex = _listingPhotoPaths.length > 0 ? (currentIndex - 1 + _listingPhotoPaths.length) % _listingPhotoPaths.length : 0;
        console.log('Prev button clicked, new index:', newIndex);
        setCurrentIndex(newIndex);
    };

    const goToNextSlide = (e) => {
        e.stopPropagation();
        const newIndex = _listingPhotoPaths.length > 0 ? (currentIndex + 1) % _listingPhotoPaths.length : 0;
        console.log('Next button clicked, new index:', newIndex);
        setCurrentIndex(newIndex);
    };

    const handleCardClick = () => {
        // Không chuyển hướng, thay vào đó mở popup
        // navigate(`/properties/${_listingId}`); // Comment out hoặc xóa dòng này
        setShowPopup(true);
    };

    return (
        <div className="listing-card" onClick={handleCardClick}>
            <div className="slider-container">
                <div className="slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {Array.isArray(_listingPhotoPaths) && _listingPhotoPaths.length > 0 ? (
                        _listingPhotoPaths.map((photo, index) => (
                            <div key={index} className="listing-slide">
                                <img
                                    src={photo.startsWith("http") ? photo : `http://localhost:5001${photo}`}
                                    alt={`photo ${index + 1}`}
                                    style={{ zIndex: 2, position: 'relative' }}
                                />
                                <div className="prev-button" onClick={goToPrevSlide}>
                                    <ArrowBackIosNew sx={{ fontSize: "15px" }} />
                                </div>
                                <div className="next-button" onClick={goToNextSlide}>
                                    <ArrowForwardIos sx={{ fontSize: "15px" }} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="listing-slide">
                            <img src="/assets/no-image.png" alt="no img" style={{ opacity: 0.7 }} />
                        </div>
                    )}
                </div>
            </div>
            <h4 style={{ marginBottom: 0, color: '#888' }}>Dãy: {_propertyName}</h4>
            <h5 style={{ marginTop: 0, color: '#888' }}>{`Tầng: ${_floorName}`}</h5>
            <h3>{_title}</h3>
            <p>Địa chỉ: {_address}</p>
            <p>Phòng: {_roomName}</p>
            <p>Loại: {_category}</p>
            <p>Giá: {_price}</p>

            {/* Render Popup khi showPopup là true */}
            {showPopup && (
                <RoomDetailPopup
                    post={post} // Truyền toàn bộ dữ liệu post
                    onClose={() => setShowPopup(false)} // Hàm đóng popup
                />
            )}
        </div>
    );
};

export default ListingCard;