import React, { useState, useEffect } from "react";
import "../styles/ListRoom.scss";
import Navbar from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Loader from "../components/Loader";
import RoomDetailPopup from "../components/RoomDetailPopup";
import { useNavigate } from "react-router-dom";

const ListRoom = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedPostForPopup, setSelectedPostForPopup] = useState(null);
    const listings = useSelector((state) => state.user.listings) || [];
    const navigate = useNavigate();

    const openRoomDetailPopup = (post) => {
        setSelectedPostForPopup(post);
        setShowPopup(true);
    };

    const closeRoomDetailPopup = () => {
        setShowPopup(false);
        setSelectedPostForPopup(null);
    };

    const handleEditListing = (postId) => {
        navigate(`/create-listing/${postId}`);
        closeRoomDetailPopup();
    };

    const getFeedListings = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("http://localhost:5001/properties", {
                method: "GET"
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            dispatch(setListings({ listings: data.posts || [] }));
        } catch (err) {
            console.error("Fetch Listings Failed:", err.message);
            setError("Không thể tải danh sách bài đăng. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getFeedListings();
    }, []);

    return (
        <>
            <Navbar />
            <div className="list-room-container">
                <div className="list-room-header">
                    <h1>Danh Sách Phòng</h1>
                </div>
                
                {loading ? (
                    <Loader />
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : listings.length === 0 ? (
                    <div className="no-listings">Không có phòng nào được đăng!</div>
                ) : (
                    <div className="listings-grid">
                        {listings.map((post) => (
                            <ListingCard 
                                key={post.id_post} 
                                post={post} 
                                onOpenPopup={openRoomDetailPopup}
                                onEditListing={handleEditListing}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showPopup && selectedPostForPopup && (
                <RoomDetailPopup 
                    post={selectedPostForPopup}
                    onClose={closeRoomDetailPopup}
                    onEditListing={handleEditListing}
                />
            )}
        </>
    );
};

export default ListRoom;