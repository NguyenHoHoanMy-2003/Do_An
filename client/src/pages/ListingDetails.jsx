import { useEffect, useState } from "react";
import "../styles/ListingDetails.scss";
import { useNavigate, useParams } from "react-router-dom";
import { facilities } from "../data";

import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Footer from "../components/Footer"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ListingDetails = () => {
  const [loading, setLoading] = useState(true);

  const { listingId } = useParams();
  const [listing, setListing] = useState(null);

  const getListingDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/properties/${listingId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      console.log(data);
      setListing(data);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listing Details Failed", err.message);
    }
  };

  useEffect(() => {
    getListingDetails();
  }, []);

  console.log(listing)

  /* BOOKING CALENDAR */
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    // Update the selected date range when user makes a selection
    setDateRange([ranges.selection]);
  };

  // Calculate start and end dates
  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);

  // Calculate the difference in days
  const dayCount = Math.round((end - start) / (1000 * 60 * 60 * 24)); // Ensure this is a positive number

  /* SUBMIT BOOKING */
  const customerId = useSelector((state) => state?.user?._id)

  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      const bookingForm = {
        customerId,
        listingId,
        hostId: listing.creator._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: listing.price * dayCount,
      }

      const response = await fetch("http://localhost:3001/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm)
      })

      if (response.ok) {
        navigate(`/${customerId}/trips`)
      }
    } catch (err) {
      console.log("Submit Booking Failed.", err.message)
    }
  }

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      
      <div className="listing-details">
        <div className="title">
          <h1>{listing.title}</h1>
          <div></div>
        </div>

        <div className="photos">
          {listing?.listingPhotoPaths?.map((item) => (
            <img
              key={item}
              src={`http://localhost:3001/${item.replace("public", "")}`}
              alt="listing photo"
            />
          ))}
        </div>

        <h2>
          {listing.type} in {listing.city}, {listing.province},{" "}
          {listing.country}
        </h2>
        <p>
          {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
          {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr />

        <div className="profile">
          <img
            src={listing?.creator?.profileImagePath ? `http://localhost:3001/${listing.creator.profileImagePath.replace("public", "")}` : "http://localhost:3001/uploads/zai.png"}
            alt="profile"
          />
          <h3>
            Hosted by {listing?.creator?.firstName} {listing?.creator?.lastName}
          </h3>
        </div>
        <hr />

        <h3>Description</h3>
        <p>{listing.description}</p>
        <hr />

        <h3>{listing.highlight}</h3>
        <p>{listing.highlightDesc}</p>
        <hr />

        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {listing.amenities[0].split(",").map((item, index) => (
                <div className="facility" key={index}>
                  <div className="facility_icon">
                    {
                      facilities.find((facility) => facility.name === item)
                        ?.icon
                    }
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DatePicker
                selected={dateRange[0].startDate}
                onChange={(date) => handleSelect({ selection: { startDate: date[0], endDate: date[1] } })}
                startDate={dateRange[0].startDate}
                endDate={dateRange[0].endDate}
                selectsRange
                inline
              />
              <div className="price-info">
                {dayCount > 1 ? (
                  <h2>
                    ${listing.price} x {dayCount} nights
                  </h2>
                ) : (
                  <h2>
                    ${listing.price} x {dayCount} night
                  </h2>
                )}
                <h2>Total price: ${listing.price * dayCount}</h2>
              </div>
              <div className="date-info">
                <p>Start Date: {dateRange[0].startDate ? dateRange[0].startDate.toDateString() : "Not selected"}</p>
                <p>End Date: {dateRange[0].endDate ? dateRange[0].endDate.toDateString() : "Not selected"}</p>
              </div>
              <button className="button" type="submit" onClick={handleSubmit}>
                BOOKING
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ListingDetails;