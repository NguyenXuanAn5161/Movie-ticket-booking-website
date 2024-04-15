import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {},
  user: {},
  selectedCinema: {},
  selectedMovie: {},
  showDateByMovieId: [],
  selectedShowTime: {},
  selectedRoom: {},
  selectedSeats: [],
  selectedFoodItems: [],
  selectedPromotion: {},
  selectedPaymentMethod: {},
  currentStep: 0,
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    doSetFormData: (state, action) => {
      state.formData = action.payload;
    },
    doSetUser: (state, action) => {
      state.user = action.payload;
    },
    doSetSelectedCinema: (state, action) => {
      state.selectedCinema = action.payload;
    },
    doSetSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
    doSetShowDateByMovieId: (state, action) => {
      state.showDateByMovieId = action.payload;
    },
    doSetSelectedShowTime: (state, action) => {
      state.selectedShowTime = action.payload;
    },
    doSetSelectedRoom: (state, action) => {
      state.selectedRoom = action.payload;
    },
    doSetSelectedSeats: (state, action) => {
      state.selectedSeats = action.payload;
    },
    doSetSelectedFoodItems: (state, action) => {
      state.selectedFoodItems = action.payload;
    },
    doSetSelectedPromotion: (state, action) => {
      state.selectedPromotion = action.payload;
    },
    doSetSelectedPaymentMethod: (state, action) => {
      state.selectedPaymentMethod = action.payload;
    },
    doSetCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    doResetBooking: (state) => {
      state.formData = {};
      state.user = {};
      state.selectedCinema = {};
      state.selectedMovie = {};
      state.showDateByMovieId = [];
      state.selectedShowTime = {};
      state.selectedRoom = {};
      state.selectedSeats = [];
      state.selectedFoodItems = [];
      state.selectedPromotion = {};
      state.selectedPaymentMethod = {};
      state.currentStep = 0;
      localStorage.removeItem("bookingState");
    },
  },

  extraReducers: (builder) => {},
});

export const {
  doSetCurrentStep,
  doSetFormData,
  doSetUser,
  doSetSelectedSeats,
  doSetSelectedCinema,
  doSetSelectedFoodItems,
  doSetSelectedMovie,
  doSetSelectedPaymentMethod,
  doSetSelectedPromotion,
  doSetSelectedShowTime,
  doSetShowDateByMovieId,
  doSetSelectedRoom,
} = bookingSlice.actions;

export default bookingSlice.reducer;
