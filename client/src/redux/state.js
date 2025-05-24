// state.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,   
  token: null,
  listings: [],  // Thay đổi từ null thành mảng rỗng
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;      
      state.token = action.payload.token;    
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.listings = [];  // Reset về mảng rỗng thay vì null
    },
    setListings: (state, action) => {
      // Đảm bảo listings luôn là mảng
      state.listings = Array.isArray(action.payload.listings) 
        ? action.payload.listings 
        : [];
    },
    setTripList: (state, action) => {
      if (state.user) state.user.tripList = action.payload;
    },
    setWishList: (state, action) => {
      if (state.user) state.user.wishList = action.payload;
    },
    setPropertyList: (state, action) => {
      if (state.user) state.user.propertyList = action.payload;
    },
    setReservationList: (state, action) => {
      if (state.user) state.user.reservationList = action.payload;
    },
  },
});

export const {
  setLogin,
  setLogout,
  setListings,
  setTripList,
  setWishList,
  setPropertyList,
  setReservationList,
} = userSlice.actions;

export default userSlice.reducer;
