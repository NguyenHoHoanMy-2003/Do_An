import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";

import "../styles/CreateListing.scss";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { categories, types, facilities } from "../data";
import BuildingSection from "../components/CreateListing/BuildingSection";
import LocationSection from "../components/CreateListing/LocationSection";
import BasicInfoSection from "../components/CreateListing/BasicInfoSection";
import useCreateListing from "../hooks/useCreateListing";

const CreateListing = () => {
  const {
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
  } = useCreateListing();

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
            {errors.type && <div className="error-message">{errors.type}</div>}
            
            <h3>Where's your place located?</h3>
            <div className="full">
              <BuildingSection
                buildings={buildings}
                buildingName={buildingName}
                floorName={floorName}
                isAddingBuilding={isAddingBuilding}
                isAddingFloor={isAddingFloor}
                newBuildingName={newBuildingName}
                newFloorName={newFloorName}
                handleBuildingSelect={handleBuildingSelect}
                handleFloorSelect={handleFloorSelect}
                handleAddBuilding={handleAddBuilding}
                handleAddFloor={handleAddFloor}
                handleDeleteBuilding={handleDeleteBuilding}
                handleDeleteFloor={handleDeleteFloor}
                setNewBuildingName={setNewBuildingName}
                setNewFloorName={setNewFloorName}
              />
            </div>

            <LocationSection
              formData={formData}
              handleLocationChange={handleLocationChange}
              errors={errors}
              isViewMode={isViewMode}
            />
            
            <h3>Share some basics about your place</h3>
            <BasicInfoSection
              formData={formData}
              updateCount={updateCount}
            />
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
              <Droppable droppableId="photos" direction="horizontal" type="photo">
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
                            type="photo"
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
            {errors.photos && <div className="error-message">{errors.photos}</div>}
            
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
              {errors.name && <div className="error-message">{errors.name}</div>}
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
              {errors.area && <div className="error-message">{errors.area}</div>}
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
              {errors.title && <div className="error-message">{errors.title}</div>}
              
              <p>Description</p>
              <textarea
                placeholder="Description"
                name="description"
                value={formData.details.description}
                onChange={handleDetailsChange}
              />
              {errors.description && <div className="error-message">{errors.description}</div>}
              
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
              {errors.price && <div className="error-message">{errors.price}</div>}
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