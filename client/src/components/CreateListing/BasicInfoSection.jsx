import React from 'react';
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import variables from "../../styles/variables.scss";

const BasicInfoSection = ({ formData, updateCount }) => {
  return (
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
  );
};

export default BasicInfoSection; 