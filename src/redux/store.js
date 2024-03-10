import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../redux/account/accountSlice";
import userReducer from "../redux/account/userSlice";
import foodCategoryReducer from "./food/foodCategorySlice";
import foodReducer from "./food/foodSlice";
import movieGenreReducer from "./movie/movieGenreSlice";
import movieReducer from "./movie/movieSlice";
import promotionLineReducer from "./promotion/promotionLineSlice";
import promotionReducer from "./promotion/promotionSlice";

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
  },
});
