import Navbar from "../components/Navbar"
import Slide from "../components/Slide"
import Categories from "../components/Categories"
import Listings from "../components/Listings"
import Footer from "../components/Footer"
import RoomDetailPopup from "../components/RoomDetailPopup";
import { useState } from "react";

const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPostForPopup, setSelectedPostForPopup] = useState(null);

  const openRoomDetailPopup = (post) => {
    setSelectedPostForPopup(post);
    setShowPopup(true);
  };

  const closeRoomDetailPopup = () => {
    setShowPopup(false);
    setSelectedPostForPopup(null);
  };

  return (
    <>
      <Navbar />
      <Slide />
      <Categories />
      <Listings onOpenPopup={openRoomDetailPopup} /> 
      <Footer />

      {showPopup && selectedPostForPopup && (
        <RoomDetailPopup 
          post={selectedPostForPopup}
          onClose={closeRoomDetailPopup}
        />
      )}
    </>
  )
}

export default HomePage