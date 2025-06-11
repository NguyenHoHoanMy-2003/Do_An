import { useEffect, useState } from "react";
import { categories } from "../data";
import "../styles/Listings.scss";
import ListingCard from "./ListingCard";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";

const Listings = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    // const listings = useSelector((state) => state.listings) || [];
    const listings = useSelector((state) => state.user.listings) || [];

    const groupListings = (posts) => {
        console.log("posts:", posts);
        const grouped = {};
        posts.forEach((post) => {
            console.log("post:", post);
            if (!post || !post.property || !post.room) {
                console.log("Bị bỏ qua:", post);
                return;
            }
            const propertyId = post.property_id || "unknown";
            const propertyName = post.property?.name_bd || "Unknown";
            const floorId = post.room?.floor_id || "no-floor";
            const floorName = post.room?.floor?.name || "Không rõ tầng";
            if (!grouped[propertyId]) {
                grouped[propertyId] = {
                    propertyId,
                    propertyName,
                    floors: {},
                };
            }
            if (!grouped[propertyId].floors[floorId]) {
                grouped[propertyId].floors[floorId] = {
                    floorId,
                    floorName,
                    rooms: [],
                };
            }
            grouped[propertyId].floors[floorId].rooms.push(post);
        });
        return Object.values(grouped).map((property) => ({
            ...property,
            floors: Object.values(property.floors),
        }));
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
            console.log("API data.posts:", data.posts);
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

    const groupedListings = groupListings(listings);

    return (
        <>
            {loading ? (
                <Loader />
            ) : error ? (
                <div style={{ textAlign: "center", width: "100%", padding: "40px 0", fontSize: 22, color: "red" }}>
                    {error}
                </div>
            ) : groupedListings.length === 0 ? (
                <div style={{ textAlign: "center", width: "100%", padding: "40px 0", fontSize: 22, color: "#888" }}>
                    Không có phòng nào được đăng!
                </div>
            ) : (
                <div className="listings">
                    {groupedListings.map((property) => (
                        <div key={property.propertyId} className="property-block">
                            <h2 className="property-title">{property.propertyName}</h2>
                            {property.floors.map((floor) => (
                                <div key={floor.floorId} className="floor-block">
                                    <h3 className="floor-title">Tầng: {floor.floorName}</h3>
                                    <div className="rooms-row">
                                        {floor.rooms.map((post) => (
                                            <ListingCard key={post.id_post} post={post} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
            <div className="category-list">
                <div className="category-left">
                    <h1>Our Best Facilities Provide You.</h1>
                    <p>Our accommodations are thoughtfully designed to provide maximum comfort and relaxation, ensuring a truly memorable stay for every guest.</p>
                </div>
                <div className="category-right">
                    {categories?.map((category, index) => (
                        <div
                            className={`category ${category.label === selectedCategory ? "selected" : ""}`}
                            key={index}
                            onClick={() => setSelectedCategory(category.label)}
                        >
                            <div className="category_icon">{category.icon}</div>
                            <p>{category.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Listings;