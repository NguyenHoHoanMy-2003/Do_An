import { useEffect, useState } from "react";
import { categories } from "../data";
import "../styles/Listings.scss";
import ListingCard from "./ListingCard";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";
import { ArrowForwardIos, ArrowBackIosNew } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Listings = ({ onOpenPopup, onEditListing }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentSlide, setCurrentSlide] = useState(0);
  const listings = useSelector((state) => state.user.listings) || [];

  const handleViewAll = () => {
    navigate("/list-room");
  };

  const getFeedListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        selectedCategory !== "All"
          ? `http://localhost:5001/properties?category=${selectedCategory}`
          : "http://localhost:5001/properties",
        { method: "GET" }
      );
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
  }, [selectedCategory]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(listings.length / 4));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(listings.length / 4)) %
        Math.ceil(listings.length / 4)
    );
  };

  return (
    <div className="featured-listings">
      <div className="featured-header">
        <h2>Phòng Nổi Bật</h2>
        <button className="view-all-btn" onClick={handleViewAll}>
          Xem tất cả
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : listings.length === 0 ? (
        <div className="no-listings">Không có phòng nào được đăng!</div>
      ) : (
        <div className="listings-slider">
          <button className="slider-btn prev" onClick={prevSlide}>
            <ArrowBackIosNew />
          </button>
          <div className="listings-container">
            <div
              className="listings-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {listings.map((post) => (
                <ListingCard
                  key={post.id_post}
                  post={post}
                  onOpenPopup={onOpenPopup}
                />
              ))}
            </div>
          </div>
          <button className="slider-btn next" onClick={nextSlide}>
            <ArrowForwardIos />
          </button>
        </div>
      )}
      <div className="category-list">
        <div className="category-left">
          <h1>Our Best Facilities Provide You.</h1>
          <p>
            Our accommodations are thoughtfully designed to provide maximum
            comfort and relaxation, ensuring a truly memorable stay for every
            guest.
          </p>
        </div>
        <div className="category-right">
          {categories?.map((category, index) => (
            <div
              className={`category ${
                category.label === selectedCategory ? "selected" : ""
              }`}
              key={index}
            >
              <div className="category_icon">{category.icon}</div>
              <p>{category.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Listings;
