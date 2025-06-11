
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useCreateListing = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const creatorId = user?.id_user;

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
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (creatorId) {
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

  const fetchBuildingData = async (buildingName) => {
    const buildingId = buildings[buildingName]?.id;
    
    if (!buildingId) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5001/buildings/${buildingId}`);
      const data = await response.json();
      
      if (response.ok) {
        setBuildingData(data);
        setIsViewMode(true);
        
        setFormData(prev => ({
          ...prev,
          location: {
            streetAddress: data.building?.street_address || "",
            city: data.building?.city || "",
            district: data.building?.district || "",
          }
        }));
      }
    } catch (error) {
      console.error("Error fetching building data:", error);
    }
  };

  const handleBuildingSelect = async (e) => {
    if (e.target.value === "add") {
      setIsAddingBuilding(true);
      setSelectedBuilding("");
      setIsViewMode(false);
      setBuildingData({});
    } else {
      setSelectedBuilding(e.target.value);
      setIsAddingBuilding(false);
      if (e.target.value) {
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
            creatorId: creatorId
          }),
        });

        const data = await response.json();
        
        if (response.ok) {
          fetchBuildings();
          setSelectedFloor(newFloorName.trim());
          setNewFloorName("");
          setIsAddingFloor(false);
        } else {
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

    // Thêm xác nhận trước khi xóa
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa tầng "${floorName}"? Hành động này sẽ xóa tất cả các phòng trong tầng.`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5001/buildings/floors/${floorId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": creatorId
        }
      });

      const data = await response.json();

      if (response.ok) {
        fetchBuildings();
        setSelectedFloor("");
        setFormData(prev => ({
          ...prev,
          details: {
            ...prev.details,
            name: ""
          }
        }));
        alert("Xóa tầng thành công!");
      } else {
        alert(data.message || "Xóa tầng thất bại!");
      }
    } catch (error) {
      console.error("Error deleting floor:", error);
      alert("Lỗi khi xóa tầng: " + error.message);
    }
  };

  const handleDeleteBuilding = async () => {
    if (buildingName) {
      const buildingId = buildings[buildingName]?.id;
      if (!buildingId) {
        alert("Không tìm thấy ID của dãy!");
        return;
      }

      // Thêm xác nhận trước khi xóa
      const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa dãy "${buildingName}"? Hành động này sẽ xóa tất cả các tầng và phòng trong dãy.`);
      if (!confirmDelete) return;

      try {
        const response = await fetch(`http://localhost:5001/buildings/${buildingId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": creatorId
          }
        });

        const data = await response.json();

        if (response.ok) {
          setSelectedBuilding("");
          setSelectedFloor("");
          setBuildingData({});
          setIsViewMode(false);
          
          setFormData(prev => ({
            ...prev,
            location: {
              streetAddress: "",
              city: "",
              district: "",
            }
          }));
          
          fetchBuildings();
          alert("Xóa dãy thành công!");
        } else {
          alert(data.message || "Xóa dãy thất bại!");
        }
      } catch (error) {
        console.error("Error deleting building:", error);
        alert("Lỗi khi xóa dãy: " + error.message);
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

  return {
    formData,
    errors,
    isSubmitting,
    pendingListings,
    buildings,
    buildingName,
    floorName,
    isAddingBuilding,
    isAddingFloor,
    newBuildingName,
    newFloorName,
    buildingData,
    isViewMode,
    handleCategorySelect,
    handleTypeSelect,
    handleLocationChange,
    updateCount,
    handleAmenityToggle,
    handleUploadPhotos,
    handleDragPhoto,
    handleRemovePhoto,
    handleDetailsChange,
    validateForm,
    handleSubmit,
    handleAddToList,
    handleRemovePendingListing,
    handleBuildingSelect,
    handleFloorSelect,
    handleAddBuilding,
    handleAddFloor,
    handleDeleteFloor,
    handleDeleteBuilding,
    setNewBuildingName,
    setNewFloorName
  };
};

export default useCreateListing; 
