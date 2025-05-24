import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

// Assuming these imports are correct
import "../styles/CreateListing.scss";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { categories, types, facilities } from "../data";
import variables from "../styles/variables.scss";

const CreateListing = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const creatorId = user?.id_user;
  console.log("creatorId là :",creatorId);

  const [formData, setFormData] = useState({
    creatorId: null,
    category: "",
    type: "",
    location: {
      streetAddress: "",
      city: "",
      district: "",
    },
    counts: {
      guestCount: 1,
      bedroomCount: 1,
      bedCount: 1,
      bathroomCount: 1,
    },
    amenities: [],
    photos: [],
    details: {
      name: "",
      area: "",
      title: "",
      description: "",
      price: 0,
    },
    roomNumbers: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingListings, setPendingListings] = useState([]);

  const [buildings, setBuildings] = useState({});
  const [buildingName, setSelectedBuilding] = useState("");
  const [floorName, setSelectedFloor] = useState("");
  const [isAddingBuilding, setIsAddingBuilding] = useState(false);
  const [isAddingFloor, setIsAddingFloor] = useState(false);
  const [newBuildingName, setNewBuildingName] = useState("");
  const [newFloorName, setNewFloorName] = useState("");

  const [buildingData, setBuildingData] = useState({});
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
    console.log("🚀 useEffect [user] chạy với user:", user);
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (creatorId) {
      console.log("🎯 useEffect [creatorId] chạy với creatorId:", creatorId);
      setFormData((prevData) => ({
        ...prevData,
        creatorId: creatorId,
      }));
    }
  }, [creatorId]);

  useEffect(() => {
    fetchBuildings();
  }, []);

  const handleCategorySelect = (categoryLabel) => {
    setFormData({
      ...formData,
      category: categoryLabel
    });
  };

  const handleTypeSelect = (typeName) => {
    setFormData({
      ...formData,
      type: typeName
    });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        [name]: value
      }
    });
  };

  const updateCount = (field, value) => {
    setFormData({
      ...formData,
      counts: {
        ...formData.counts,
        [field]: value
      }
    });
  };

  const handleAmenityToggle = (amenity) => {
    const currentAmenities = [...formData.amenities];
    if (currentAmenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: currentAmenities.filter(item => item !== amenity)
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...currentAmenities, amenity]
      });
    }
  };

  const handleUploadPhotos = (e) => {
    const newPhotos = Array.from(e.target.files);
    setFormData({
      ...formData,
      photos: [...formData.photos, ...newPhotos]
    });
  };

  const handleDragPhoto = (result) => {
    if (!result.destination) return;
    const items = Array.from(formData.photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFormData({
      ...formData,
      photos: items
    });
  };

  const handleRemovePhoto = (indexToRemove) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, index) => index !== indexToRemove)
    });
  };

  const parseRoomNumbers = (input) => {
    const parts = input.split(',').map(part => part.trim());
    const numbers = new Set();
    
    parts.forEach(part => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(num => parseInt(num.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            numbers.add(i);
          }
        }
      } else {
        const num = parseInt(part);
        if (!isNaN(num)) {
          numbers.add(num);
        }
      }
    });
    
    return Array.from(numbers).sort((a, b) => a - b);
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      const roomNumbers = parseRoomNumbers(value);
      setFormData({
        ...formData,
        details: {
          ...formData.details,
          [name]: value
        },
        roomNumbers: roomNumbers
      });
    } else {
      setFormData({
        ...formData,
        details: {
          ...formData.details,
          [name]: name === "price" ? Number(value) : value
        }
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = "Please select a property type";
    if (!formData.location.streetAddress.trim()) newErrors.streetAddress = "Street address is required";
    if (!formData.location.city.trim()) newErrors.city = "City is required";
    if (!formData.location.district.trim()) newErrors.district = "District is required";
    if (!formData.details.name.trim()) newErrors.name = "Room name is required";
    if (!formData.details.area.trim()) newErrors.area = "Area is required";
    if (!formData.details.title.trim()) newErrors.title = "Title is required";
    if (!formData.details.description.trim()) newErrors.description = "Description is required";
    if (formData.details.price <= 0) newErrors.price = "Price must be greater than 0";
    if (formData.photos.length === 0) newErrors.photos = "Please upload at least one photo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("User chưa đăng nhập!");
      return;
    }

    // Kiểm tra nếu cả input và pending đều rỗng
    const isInputEmpty = (
      !formData.details.name &&
      !formData.details.area &&
      !formData.details.title &&
      !formData.details.description &&
      !formData.details.price &&
      formData.photos.length === 0
    );
    const isPendingEmpty = pendingListings.length === 0;

    if (isInputEmpty && isPendingEmpty) {
      alert("Vui lòng nhập thông tin phòng hoặc thêm vào danh sách chờ!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Nếu có pending listing và input cũng có dữ liệu phòng (TH3)
      if (!isInputEmpty && !isPendingEmpty) {
        // Đăng tất cả pending + input hiện tại
        for (const listing of [...pendingListings, formData]) {
          await submitListing(listing);
        }
        setPendingListings([]);
        // Reset form phòng (giữ location)
        setFormData(prev => ({
          ...prev,
          category: "",
          type: "",
          counts: {
            guestCount: 1,
            bedroomCount: 1,
            bedCount: 1,
            bathroomCount: 1,
          },
          amenities: [],
          photos: [],
          details: {
            name: "",
            area: "",
            title: "",
            description: "",
            price: 0,
          },
          roomNumbers: [],
        }));
        navigate("/");
        return;
      }

      // Nếu chỉ có pending listing (TH1)
      if (isInputEmpty && !isPendingEmpty) {
        for (const listing of pendingListings) {
          await submitListing(listing);
        }
        setPendingListings([]);
        navigate("/");
        return;
      }

      // Nếu chỉ có input hiện tại (TH2)
      if (!isInputEmpty && isPendingEmpty) {
        await submitListing(formData);
        // Reset form phòng (giữ location)
        setFormData(prev => ({
          ...prev,
          category: "",
          type: "",
          counts: {
            guestCount: 1,
            bedroomCount: 1,
            bedCount: 1,
            bathroomCount: 1,
          },
          amenities: [],
          photos: [],
          details: {
            name: "",
            area: "",
            title: "",
            description: "",
            price: 0,
          },
          roomNumbers: [],
        }));
        navigate("/");
        return;
      }
    } catch (error) {
      console.error("Error submitting listing:", error);
      alert("An error occurred while submitting the listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitListing = async (listingData) => {
    const listingForm = new FormData();

    listingForm.append("creatorId", listingData.creatorId);
    listingForm.append("category", listingData.category);
    listingForm.append("type", listingData.type);
    listingForm.append("buildingName", listingData.buildingName || buildingName);
    listingForm.append("floorName", listingData.floorName || floorName);

    listingForm.append("streetAddress", listingData.location.streetAddress);
    listingForm.append("city", listingData.location.city);
    listingForm.append("district", listingData.location.district);

    listingForm.append("guestCount", listingData.counts.guestCount);
    listingForm.append("bedroomCount", listingData.counts.bedroomCount);
    listingForm.append("bedCount", listingData.counts.bedCount);
    listingForm.append("bathroomCount", listingData.counts.bathroomCount);

    listingForm.append("name", listingData.details.name);
    listingForm.append("area", listingData.details.area);
    listingForm.append("title", listingData.details.title);
    listingForm.append("description", listingData.details.description);
    listingForm.append("price", listingData.details.price);

    listingData.amenities.forEach((amenity, index) => {
      listingForm.append(`amenities[${index}]`, amenity);
    });

    listingData.photos.forEach((photo) => {
      listingForm.append("listingPhotos", photo);
    });

    const response = await fetch("http://localhost:5001/properties/create", {
      method: "POST",
      body: listingForm,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to create listing");
    }

    return response.json();
  };

  // Error display helper
  const ErrorMessage = ({ field }) => (
    errors[field] ? <div className="error-message">{errors[field]}</div> : null
  );

  const fetchBuildingData = async (buildingName) => {
    const buildingId = buildings[buildingName]?.id;
    console.log("🔍 Building ID:", buildingId);
    console.log("🔍 Building Name:", buildingName);
    console.log("🔍 Buildings object:", buildings);
    
    if (!buildingId) {
        console.log("❌ No building ID found for:", buildingName);
        return;
    }
    
    try {
        console.log("🌐 Fetching from URL:", `http://localhost:5001/buildings/${buildingId}`);
        const response = await fetch(`http://localhost:5001/buildings/${buildingId}`);
        const data = await response.json();
        console.log("📦 Response data:", data);
        
        if (response.ok) {
            console.log("✅ Response OK, setting building data");
            setBuildingData(data);
            setIsViewMode(true);
            
            console.log("🏢 Building data from response:", {
                street_address: data.building?.street_address,
                city: data.building?.city,
                district: data.building?.district
            });
            
            setFormData(prev => {
                const newData = {
                    ...prev,
                    location: {
                        streetAddress: data.building?.street_address || "",
                        city: data.building?.city || "",
                        district: data.building?.district || "",
                    }
                };
                console.log("📝 New form data:", newData);
                return newData;
            });
        } else {
            console.log("❌ Response not OK:", response.status);
        }
    } catch (error) {
        console.error("❌ Error fetching building data:", error);
    }
  };

  const handleBuildingSelect = async (e) => {
    console.log("🎯 Selected building value:", e.target.value);
    
    if (e.target.value === "add") {
        setIsAddingBuilding(true);
        setSelectedBuilding("");
        setIsViewMode(false);
        setBuildingData({});
    } else {
        setSelectedBuilding(e.target.value);
        setIsAddingBuilding(false);
        if (e.target.value) {
            console.log("🔄 Calling fetchBuildingData for:", e.target.value);
            await fetchBuildingData(e.target.value);
        }
    }
  };

  const handleFloorSelect = (e) => {
    if (e.target.value === "add") {
      setIsAddingFloor(true);
      setSelectedFloor("");
    } else {
      setSelectedFloor(e.target.value);
      setIsAddingFloor(false);
    }
  };

  const handleAddBuilding = async () => {
    if (newBuildingName.trim()) {
      try {
        const response = await fetch("http://localhost:5001/buildings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newBuildingName.trim(),
            street_address: formData.location.streetAddress,
            city: formData.location.city,
            district: formData.location.district,
            creatorId: creatorId
          }),
        });

        if (response.ok) {
          fetchBuildings();
          setSelectedBuilding(newBuildingName.trim());
          setNewBuildingName("");
          setIsAddingBuilding(false);
        }
      } catch (error) {
        console.error("Error adding building:", error);
      }
    }
  };

  const handleAddFloor = async () => {
    if (newFloorName.trim() && buildingName) {
      const buildingId = buildings[buildingName]?.id;
      if (!buildingId) {
        alert("Không tìm thấy ID của dãy!");
        return;
      }
      try {
        const response = await fetch(`http://localhost:5001/buildings/${buildingId}/floors`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            name: newFloorName.trim(),
            creatorId: creatorId // Thêm creatorId
          }),
        });

        const data = await response.json();
        
        if (response.ok) {
          fetchBuildings();
          setSelectedFloor(newFloorName.trim());
          setNewFloorName("");
          setIsAddingFloor(false);
        } else {
          // Hiển thị thông báo lỗi cụ thể từ server
          alert(data.message || "Thêm tầng thất bại!");
          console.error("Server error:", data);
        }
      } catch (error) {
        console.error("Error adding floor:", error);
        alert("Lỗi khi thêm tầng: " + error.message);
      }
    }
  };

  const handleDeleteFloor = async (floorId, floorName) => {
    if (!floorId) {
        alert("Không tìm thấy ID của tầng!");
        return;
    }
    try {
        const response = await fetch(`http://localhost:5001/buildings/floors/${floorId}`, {
            method: "DELETE"
        });
        if (response.ok) {
            fetchBuildings();
            setSelectedFloor("");
            // Thêm reset các state khác nếu cần
            setFormData(prev => ({
                ...prev,
                details: {
                    ...prev.details,
                    name: "" // Reset tên phòng nếu cần
                }
            }));
        } else {
            alert("Xóa tầng thất bại!");
        }
    } catch (error) {
        alert("Lỗi khi xóa tầng!");
    }
  };

  const handleDeleteBuilding = async () => {
    if (buildingName) {
        const buildingId = buildings[buildingName]?.id;
        if (!buildingId) {
            alert("Không tìm thấy ID của dãy!");
            return;
        }
        try {
            const response = await fetch(`http://localhost:5001/buildings/${buildingId}`, {
                method: "DELETE"
            });
            if (response.ok) {
                // Reset tất cả các state liên quan
                setSelectedBuilding("");
                setSelectedFloor("");
                setBuildingData({});
                setIsViewMode(false);
                
                // Reset form data location
                setFormData(prev => ({
                    ...prev,
                    location: {
                        streetAddress: "",
                        city: "",
                        district: "",
                    }
                }));
                
                // Fetch lại danh sách buildings
                fetchBuildings();
            } else {
                alert("Xóa dãy thất bại!");
            }
        } catch (error) {
            alert("Lỗi khi xóa dãy!");
        }
    }
  };

  const handleAddToList = () => {
    if (!validateForm()) return;

    const newListing = {
      ...formData,
      buildingName,
      floorName,
      id: Date.now(),
    };

    setPendingListings([...pendingListings, newListing]);

    // Reset chỉ các trường phòng, giữ lại location
    setFormData(prev => ({
      ...prev,
      category: "",
      type: "",
      counts: {
        guestCount: 1,
        bedroomCount: 1,
        bedCount: 1,
        bathroomCount: 1,
      },
      amenities: [],
      photos: [],
      details: {
        name: "",
        area: "",
        title: "",
        description: "",
        price: 0,
      },
      roomNumbers: [],
      // location giữ nguyên
    }));
  };

  const handleRemovePendingListing = (id) => {
    setPendingListings(pendingListings.filter(listing => listing.id !== id));
  };

  const fetchBuildings = async () => {
    try {
      const response = await fetch("http://localhost:5001/buildings");
      const data = await response.json();
      if (response.ok && data.buildings) {
        // Lưu object { [name]: { id, floors: [{id, name}] } }
        const buildingsObj = {};
        data.buildings.forEach(b => {
          buildingsObj[b.name] = {
            id: b.id,
            floors: b.floors || []
          };
        });
        setBuildings(buildingsObj);
      }
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-listing">
        <h1>Publish Your Place</h1>
        
        {errors.submit && (
          <div className="error-banner">{errors.submit}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="create-listing_step1">
            <h2>Step 1: Tell us about your place</h2>
            <hr />
            
            <h3>What services will you get after renting a room?</h3>
            <div className="category-list">
              {categories?.map((item, index) => (
                <div
                  className={`category ${formData.category === item.label ? "selected" : ""}`}
                  key={index}
                  onClick={() => handleCategorySelect(item.label)}
                >
                  <div className="category_icon">{item.icon}</div>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
            
            <h3>What type of place will guests have?</h3>
            <div className="type-list">
              {types?.map((item, index) => (
                <div
                  className={`type ${formData.type === item.name ? "selected" : ""}`}
                  key={index}
                  onClick={() => handleTypeSelect(item.name)}
                >
                  <div className="type_text">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                  <div className="type_icon">{item.icon}</div>
                </div>
              ))}
            </div>
            <ErrorMessage field="type" />
            
            <h3>Where's your place located?</h3>
            <div className="full">
            <div className="location-row">
                  <div className="location">
                    <p>Building's Name</p>
                    {isAddingBuilding ? (
                      <div className="add-new">
                        <input
                          type="text"
                          placeholder="Enter building's name"
                          value={newBuildingName}
                          onChange={(e) => setNewBuildingName(e.target.value)}
                        />
                        <button onClick={handleAddBuilding}>Add</button>
                      </div>
                    ) : (
                      <select value={buildingName} onChange={handleBuildingSelect}>
                        <option value="">Select Building</option>
                        {Object.keys(buildings).map((buildingName) => (
                          <option key={buildings[buildingName].id} value={buildingName}>
                            {buildingName}
                          </option>
                        ))}
                        <option value="add">Add New Building...</option>
                      </select>
                    )}
                    {buildingName && !isAddingBuilding && (
                      <button onClick={handleDeleteBuilding} className="delete-btn">
                        Delete Building
                      </button>
                    )}
                  </div>

                                    {buildingName && (
                    <div className="floor">
                      <p>Floor</p>
                      {isAddingFloor ? (
                        <div className="add-new">
                          <input
                            type="text"
                            placeholder="Enter floor name"
                            value={newFloorName}
                            onChange={(e) => setNewFloorName(e.target.value)}
                          />
                          <button onClick={handleAddFloor}>Add Floor</button>
                        </div>
                      ) : (
                        <>
                          <select value={floorName} onChange={handleFloorSelect}>
                            <option value="">Select Floor</option>
                            {buildings[buildingName]?.floors.map((floor) => (
                              <option key={floor.id} value={floor.name}>
                                {floor.name}
                              </option>
                            ))}
                            <option value="add">Add New Floor...</option>
                          </select>
                          {/* Danh sách tầng */}
                          <ul className="floor-list">
                            {buildings[buildingName]?.floors.map((floor) => (
                              <li key={floor.id}>
                                {floor.name}
                                <button
                                  className="delete-btn"
                                  onClick={() => handleDeleteFloor(floor.id, floor.name)}
                                >
                                  Xóa
                                </button>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

             <div className="full">
              <div className="location">
                <p>Street Address</p>
                <input
                  type="text"
                  placeholder="Street Address"
                  name="streetAddress"
                  value={formData.location.streetAddress}
                  onChange={handleLocationChange}
                  required
                  disabled={isViewMode}
                />
                <ErrorMessage field="streetAddress" />
              </div>
            </div> 
            
            <div className="full">
              <div className="location">
                <p>City</p>
                <input
                  type="text"
                  placeholder="City"
                  name="city"
                  value={formData.location.city}
                  onChange={handleLocationChange}
                  required
                  disabled={isViewMode}
                />
                <ErrorMessage field="city" />
              </div>
            </div>
            
            <div className="full">
              <div className="location">
                <p>District</p>
                <input
                  type="text"
                  placeholder="District"
                  name="district"
                  value={formData.location.district}
                  onChange={handleLocationChange}
                  required
                  disabled={isViewMode}
                />
                <ErrorMessage field="district" />
              </div>
            </div>
            
            <h3>Share some basics about your place</h3>
            <div className="basics">
              <div className="basic">
                <p>Guests</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => {
                      formData.counts.guestCount > 1 && 
                      updateCount("guestCount", formData.counts.guestCount - 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                  <p>{formData.counts.guestCount}</p>
                  <AddCircleOutline
                    onClick={() => updateCount("guestCount", formData.counts.guestCount + 1)}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                </div>
              </div>
              
              <div className="basic">
                <p>Bedrooms</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => {
                      formData.counts.bedroomCount > 1 && 
                      updateCount("bedroomCount", formData.counts.bedroomCount - 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                  <p>{formData.counts.bedroomCount}</p>
                  <AddCircleOutline
                    onClick={() => updateCount("bedroomCount", formData.counts.bedroomCount + 1)}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                </div>
              </div>
              
              <div className="basic">
                <p>Beds</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => {
                      formData.counts.bedCount > 1 && 
                      updateCount("bedCount", formData.counts.bedCount - 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                  <p>{formData.counts.bedCount}</p>
                  <AddCircleOutline
                    onClick={() => updateCount("bedCount", formData.counts.bedCount + 1)}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                </div>
              </div>
              
              <div className="basic">
                <p>Bathrooms</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => {
                      formData.counts.bathroomCount > 1 && 
                      updateCount("bathroomCount", formData.counts.bathroomCount - 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                  <p>{formData.counts.bathroomCount}</p>
                  <AddCircleOutline
                    onClick={() => updateCount("bathroomCount", formData.counts.bathroomCount + 1)}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="create-listing_step2">
            <h2>Step 2: Make your place stand out</h2>
            <hr />
            
            <h3>Tell guests what your place has to offer</h3>
            <div className="amenities">
              {facilities?.map((item, index) => (
                <div
                  className={`facility ${formData.amenities.includes(item.name) ? "selected" : ""}`}
                  key={index}
                  onClick={() => handleAmenityToggle(item.name)}
                >
                  <div className="facility_icon">{item.icon}</div>
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
            
            <h3>Add some photos of your place</h3>
            <DragDropContext onDragEnd={handleDragPhoto}>
              <Droppable droppableId="photos" direction="horizontal">
                {(provided) => (
                  <div
                    className="photos"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {formData.photos.length < 1 && (
                      <>
                        <input
                          id="image"
                          type="file"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label htmlFor="image" className="alone">
                          <div className="icon">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}
                    
                    {formData.photos.length >= 1 && (
                      <>
                        {formData.photos.map((photo, index) => (
                          <Draggable
                            key={index}
                            draggableId={index.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="photo"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <img
                                  src={URL.createObjectURL(photo)}
                                  alt="place"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemovePhoto(index)}
                                >
                                  <BiTrash />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        <input
                          id="image"
                          type="file"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label htmlFor="image" className="together">
                          <div className="icon">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <ErrorMessage field="photos" />
            
            <div className="description">
              <p>Room's Name (Format: 101, 105-108)</p>
              <input
                type="text"
                placeholder="Enter room numbers"
                name="name"
                value={formData.details.name}
                onChange={handleDetailsChange}
                
              />
              {formData.roomNumbers.length > 0 && (
                <p className="room-count">Total rooms: {formData.roomNumbers.length}</p>
              )}
              <ErrorMessage field="name" />
            </div>
            
            <div className="description">
              <p>Area</p>
              <input
                type="text"
                placeholder="Area"
                name="area"
                value={formData.details.area}
                onChange={handleDetailsChange}
                
              />
              <ErrorMessage field="area" />
            </div>
            
            <h3>What make your place attractive and exciting?</h3>
            <div className="description">
              <p>Title</p>
              <input
                type="text"
                placeholder="Title"
                name="title"
                value={formData.details.title}
                onChange={handleDetailsChange}
                
              />
              <ErrorMessage field="title" />
              
              <p>Description</p>
              <textarea
                placeholder="Description"
                name="description"
                value={formData.details.description}
                onChange={handleDetailsChange}
                
              />
              <ErrorMessage field="description" />
              
              <p>Now, set your PRICE</p>
              <span>VND</span>
              <input
                type="number"
                placeholder="100"
                name="price"
                value={formData.details.price}
                onChange={handleDetailsChange}
                className="price"
                min="0"
              />
              <ErrorMessage field="price" />
            </div>
          </div>
          
          <div className="pending-listings">
            <h3>Pending Listings</h3>
            {pendingListings.map((listing) => (
              <div key={listing.id} className="pending-listing">
                <div className="pending-listing-info">
                  <p>Building: {buildingName}</p>
                  <p>Floor: {floorName}</p>
                  <p>Room: {listing.details.name}</p>
                  <p>Area: {listing.details.area}</p>
                  <p>Title: {listing.details.title}</p>
                  <p>Price: {listing.details.price} VND</p>
                  <p>Total Rooms: {listing.roomNumbers.length}</p>
                  <p>Location: {listing.location.streetAddress}, {listing.location.district}, {listing.location.city}</p>
                  <p>Amenities: {listing.amenities.join(", ")}</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleRemovePendingListing(listing.id)}
                  className="remove-listing-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <button 
            type="button"
            className="add_btn"
            onClick={handleAddToList}
          >
            Add to List
          </button>
          
          <button 
            className="submit_btn" 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "CREATING..." : "CREATE YOUR LISTING"}
          </button>
        </form>
      </div>
      
      <Footer />
    </>
  );
};

export default CreateListing;