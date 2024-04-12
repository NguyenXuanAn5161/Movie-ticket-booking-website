import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../redux/account/accountSlice";
import userReducer from "../redux/account/userSlice";
import bookingReducer from "./booking/bookingSlice";
import localStorageMiddleware from "./booking/localStorageMiddleware";
import cinemaReducer from "./cinema/cinemaSlice";
import roomReducer from "./cinema/room/roomSlice";
import foodCategoryReducer from "./food/foodCategorySlice";
import foodReducer from "./food/foodSlice";
import movieGenreReducer from "./movie/movieGenreSlice";
import movieReducer from "./movie/movieSlice";
import priceDetailReducer from "./price/priceDetailSlice";
import priceReducer from "./price/priceSlice";
import promotionLineReducer from "./promotion/promotionLineSlice";
import promotionReducer from "./promotion/promotionSlice";
import scheduleReducer from "./schedule/scheduleSlice";
import seatReducer from "./seat/seatSlice";
import seatTypeReducer from "./seat/seatTypeSlice";

const preloadedState = JSON.parse(localStorage.getItem("bookingState")) || {};

export const store = configureStore({
  reducer: {
    account: accountReducer,
    user: userReducer,
    movie: movieReducer,
    movieGenre: movieGenreReducer,
    promotion: promotionReducer,
    promotionLine: promotionLineReducer,
    food: foodReducer,
    foodCategory: foodCategoryReducer,
    cinema: cinemaReducer,
    room: roomReducer,
    seat: seatReducer,
    seatType: seatTypeReducer,
    price: priceReducer,
    priceDetail: priceDetailReducer,
    schedule: scheduleReducer,
    booking: bookingReducer,
  },
  preloadedState,
  middleware: (curryGetDefaultMiddleware) =>
    curryGetDefaultMiddleware().concat(localStorageMiddleware),
});
