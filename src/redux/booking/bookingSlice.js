import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {},
  selectedCinema: {},
  selectedMovie: {},
  selectedShowTime: {},
  selectSeat: [],
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
    doSetSelectedCinema: (state, action) => {
      state.selectedCinema = action.payload;
    },
    doSetSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
    doSetSelectedShowTime: (state, action) => {
      state.selectedShowTime = action.payload;
    },
    doSetSelectSeat: (state, action) => {
      state.selectSeat = action.payload;
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
      state.selectedCinema = {};
      state.selectedMovie = {};
      state.selectedShowTime = {};
      state.selectSeat = [];
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
  doSetSelectSeat,
  doSetSelectedCinema,
  doSetSelectedFoodItems,
  doSetSelectedMovie,
  doSetSelectedPaymentMethod,
  doSetSelectedPromotion,
  doSetSelectedShowTime,
} = bookingSlice.actions;

export default bookingSlice.reducer;
