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
  selectedFoods: [],
  selectedPromotionBill: {},
  selectedPromotionSeat: {},
  selectedPromotionFood: {},
  selectedPaymentMethod: {},
  totalPrice: 0,
  currentStep: 0,
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    doSetTotalPrice: (state, action) => {
      state.totalPrice = action.payload;
    },
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
    doSetSelectedFoods: (state, action) => {
      state.selectedFoods = action.payload;
    },
    doSetSelectedPromotionBill: (state, action) => {
      state.selectedPromotionBill = action.payload;
    },
    doSetSelectedPromotionSeat: (state, action) => {
      state.selectedPromotionSeat = action.payload;
    },
    doSetSelectedPromotionFood: (state, action) => {
      state.selectedPromotionFood = action.payload;
    },
    doSetSelectedPaymentMethod: (state, action) => {
      state.selectedPaymentMethod = action.payload;
    },
    doSetCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    doResetBooking: (state) => {
      state.totalPrice = 0;
      state.formData = {};
      state.user = {};
      state.selectedCinema = {};
      state.selectedMovie = {};
      state.showDateByMovieId = [];
      state.selectedShowTime = {};
      state.selectedRoom = {};
      state.selectedSeats = [];
      state.selectedFoods = [];
      state.selectedPromotionSeat = {};
      state.selectedPromotionFood = {};
      state.selectedPromotionBill = {};
      state.selectedPaymentMethod = {};
      state.currentStep = 0;
      localStorage.removeItem("bookingState");
    },
  },

  extraReducers: (builder) => {},
});

export const {
  doSetTotalPrice,
  doSetCurrentStep,
  doSetFormData,
  doSetUser,
  doSetSelectedSeats,
  doSetSelectedCinema,
  doSetSelectedFoods,
  doSetSelectedMovie,
  doSetSelectedPaymentMethod,
  doSetSelectedPromotionFood,
  doSetSelectedPromotionSeat,
  doSetSelectedPromotionBill,
  doSetSelectedShowTime,
  doSetShowDateByMovieId,
  doSetSelectedRoom,
  doResetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
