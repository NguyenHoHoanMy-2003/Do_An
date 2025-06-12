import Navbar from "../components/Navbar"
import Slide from "../components/Slide"
import Categories from "../components/Categories"
import Listings from "../components/Listings"
import Footer from "../components/Footer"
import RoomDetailPopup from "../components/RoomDetailPopup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPostForPopup, setSelectedPostForPopup] = useState(null);
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

  return (
    <>
      <Navbar />
      <Slide />
      <Categories />
      <Listings onOpenPopup={openRoomDetailPopup} onEditListing={handleEditListing} />
      <Footer />

      {showPopup && selectedPostForPopup && (
        <RoomDetailPopup 
          post={selectedPostForPopup}
          onClose={closeRoomDetailPopup}
          onEditListing={handleEditListing}
        />
      )}
    </>
  )
}

export default HomePage