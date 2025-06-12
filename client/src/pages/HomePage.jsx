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

  // Function to refresh listings (placeholder for now, will refine based on Listings component data fetching)
  const refreshListings = () => {
    // In a real application, you would re-fetch your listings here.
    // For now, we'll just log a message.
    console.log("Refreshing listings...");
    // If Listings component fetches data via a Redux action or a prop, call that here.
    // Example: dispatch(fetchListingsAction());
  };

  const openRoomDetailPopup = (post) => {
    setSelectedPostForPopup(post);
    setShowPopup(true);
  };

  const closeRoomDetailPopup = () => {
    setShowPopup(false);
    setSelectedPostForPopup(null);
  };

  const handleDeleteSubRoom = () => {
    refreshListings();
    closeRoomDetailPopup();
  };

  const handleDeleteListing = () => {
    refreshListings();
    closeRoomDetailPopup();
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
          post={{
            ...selectedPostForPopup,
            id_post: selectedPostForPopup.id_post,
            Attribute: selectedPostForPopup.Attribute ? {
              ...selectedPostForPopup.Attribute,
              price: Number(selectedPostForPopup.Attribute.price)
            } : null
          }}
          onClose={closeRoomDetailPopup}
          onDeleteSubRoom={handleDeleteSubRoom}
          onDeleteListing={handleDeleteListing}
        />
      )}
    </>
  )
}

export default HomePage