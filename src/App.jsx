import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LayoutAdmin from "./components/Admin/LayoutAdmin";
import OrderTable from "./components/Admin/Order/OrderTable";
import Loading from "./components/Loading";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import BookingPage from "./pages/Booking/Booking";
import CinemaCreate from "./pages/ManageCinema/Create";
import CinemaEdit from "./pages/ManageCinema/Edit";
import CinemaList from "./pages/ManageCinema/List";
import RoomCreate from "./pages/ManageCinema/Room/Create";
import RoomEdit from "./pages/ManageCinema/Room/Edit";
import CinemaShow from "./pages/ManageCinema/Show";
import FoodCategoryCreate from "./pages/ManageFood/CategoriesFood/Create";
import FoodCategoryEdit from "./pages/ManageFood/CategoriesFood/Edit";
import FoodCategoryList from "./pages/ManageFood/CategoriesFood/List";
import FoodCategoryShow from "./pages/ManageFood/CategoriesFood/Show";
import FoodCreate from "./pages/ManageFood/Food/Create";
import FoodEdit from "./pages/ManageFood/Food/Edit";
import FoodList from "./pages/ManageFood/Food/List";
import FoodShow from "./pages/ManageFood/Food/Show";
import MovieCreate from "./pages/ManageMovie/Movie/Create";
import MovieEdit from "./pages/ManageMovie/Movie/Edit";
import MovieList from "./pages/ManageMovie/Movie/List";
import MovieShow from "./pages/ManageMovie/Movie/Show";
import MovieGenreCreate from "./pages/ManageMovie/MovieCategories/Create";
import MovieGenreEdit from "./pages/ManageMovie/MovieCategories/Edit";
import MovieGenreList from "./pages/ManageMovie/MovieCategories/List";
import MovieGenreShow from "./pages/ManageMovie/MovieCategories/Show";
import ScheduleCreate from "./pages/ManageMovie/Schedule/Create";
import ScheduleEdit from "./pages/ManageMovie/Schedule/Edit";
import ScheduleList from "./pages/ManageMovie/Schedule/List";
import ScheduleShow from "./pages/ManageMovie/Schedule/Show";
import PriceCreate from "./pages/ManagePrice/Create";
import PriceEdit from "./pages/ManagePrice/Edit";
import PriceList from "./pages/ManagePrice/List";
import PriceShow from "./pages/ManagePrice/Show";
import PromotionCreate from "./pages/ManagePromotion/Create";
import PromotionEdit from "./pages/ManagePromotion/Edit";
import PromotionList from "./pages/ManagePromotion/List";
import PromotionShow from "./pages/ManagePromotion/Show";
import UserCreate from "./pages/ManageUser/Create";
import UserList from "./pages/ManageUser/List";
import UserShow from "./pages/ManageUser/Show";
import DashBoardShow from "./pages/dashboard/Show";
import LoginPage from "./pages/login";
import { doGetAccountAction } from "./redux/account/accountSlice";
import { callFetchAccount } from "./services/api";
import "./styles/reset.scss";

export default function App() {
  const dispatch = useDispatch();
  // const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const isLoading = useSelector((state) => state.account.isLoading);

  const getAccount = async () => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    )
      return;

    const res = await callFetchAccount();
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data));
    }
  };

  useEffect(() => {
    getAccount();
  }, []);

  const router = createBrowserRouter([
    // layout for admin
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          path: "dashboard",
          index: true,
          element: (
            <ProtectedRoute>
              <DashBoardShow />
            </ProtectedRoute>
          ),
        },
        // Hóa đơn
        {
          path: "order",
          element: <OrderTable />,
        },
        // Người dùng
        {
          path: "user",
          element: <UserList />,
        },
        {
          path: "user/show/:userId",
          element: <UserShow />,
        },
        {
          path: "user/create",
          element: <UserCreate />,
        },
        // Phim
        {
          path: "movie",
          element: <MovieList />,
        },
        {
          path: "movie/show/:movieId",
          element: <MovieShow />,
        },
        {
          path: "movie/create",
          element: <MovieCreate />,
        },
        {
          path: "movie/edit/:movieId",
          element: <MovieEdit />,
        },
        // Loại phim
        {
          path: "movieGenre",
          element: <MovieGenreList />,
        },
        {
          path: "movieGenre/show/:categoryMovieId",
          element: <MovieGenreShow />,
        },
        {
          path: "movieGenre/create",
          element: <MovieGenreCreate />,
        },
        {
          path: "movieGenre/edit/:categoryMovieId",
          element: <MovieGenreEdit />,
        },
        // Lịch chiếu phim
        {
          path: "schedule",
          element: <ScheduleList />,
        },
        {
          path: "schedule/show/:movieScheduleId",
          element: <ScheduleShow />,
        },
        {
          path: "schedule/create",
          element: <ScheduleCreate />,
        },
        {
          path: "schedule/edit/:movieScheduleId",
          element: <ScheduleEdit />,
        },
        // Rạp phim
        {
          path: "cinema",
          element: <CinemaList />,
        },
        {
          path: "cinema/show/:cinemaId",
          element: <CinemaShow />,
        },
        // room trong cinema
        {
          path: "cinema/show/:cinemaId/room/create",
          element: <RoomCreate />,
        },
        {
          path: "cinema/show/:cinemaId/room/edit/:roomId",
          element: <RoomEdit />,
        },
        //------------------------------
        {
          path: "cinema/create",
          element: <CinemaCreate />,
        },
        {
          path: "cinema/edit/:cinemaId",
          element: <CinemaEdit />,
        },
        // Phòng chiếu phim
        // {
        //   path: "cinema/room",
        //   element: <RoomList />,
        // },
        // {
        //   path: "cinema/room/show/:movieId",
        //   element: <MovieShow />,
        // },
        // {
        //   path: "cinema/room/create",
        //   element: <RoomCreate />,
        // },
        // {
        //   path: "cinema/room/edit/:movieId",
        //   element: <RoomEdit />,
        // },
        // Ghế trong phòng
        // {
        //   path: "cinema/room/seat",
        //   element: <SeatList />,
        // },
        // {
        //   path: "cinema/room/seat/show/:seatId",
        //   element: <SeatShow />,
        // },
        // {
        //   path: "cinema/room/seat/create",
        //   element: <SeatCreate />,
        // },
        // {
        //   path: "cinema/room/seat/edit/:seatId",
        //   element: <SeatEdit />,
        // },
        // Loại ghế
        // {
        //   path: "cinema/room/seatType",
        //   element: <SeatTypeList />,
        // },
        // {
        //   path: "cinema/room/seatType/show/:seatTypeId",
        //   element: <SeatTypeShow />,
        // },
        // {
        //   path: "cinema/room/seatType/create",
        //   element: <SeatTypeCreate />,
        // },
        // {
        //   path: "cinema/room/seatType/edit/:seatTypeId",
        //   element: <SeatTypeEdit />,
        // },
        // Đồ ăn
        {
          path: "food",
          element: <FoodList />,
        },
        {
          path: "food/show/:foodId",
          element: <FoodShow />,
        },
        {
          path: "food/create",
          element: <FoodCreate />,
        },
        {
          path: "food/edit/:foodId",
          element: <FoodEdit />,
        },
        // Loại đồ ăn
        {
          path: "foodCategories",
          element: <FoodCategoryList />,
        },
        {
          path: "foodCategories/show/:foodCategoryId",
          element: <FoodCategoryShow />,
        },
        {
          path: "foodCategories/create",
          element: <FoodCategoryCreate />,
        },
        {
          path: "foodCategories/edit/:foodCategoryId",
          element: <FoodCategoryEdit />,
        },
        // Giá sản phẩm
        {
          path: "price",
          element: <PriceList />,
        },
        {
          path: "price/show/:priceId",
          element: <PriceShow />,
        },
        {
          path: "price/create",
          element: <PriceCreate />,
        },
        {
          path: "price/edit/:priceId",
          element: <PriceEdit />,
        },
        // Khuyến mãi
        {
          path: "promotion",
          element: <PromotionList />,
        },
        {
          path: "promotion/show/:promotionId",
          element: <PromotionShow />,
        },
        {
          path: "promotion/create",
          element: <PromotionCreate />,
        },
        {
          path: "promotion/edit/:promotionId",
          element: <PromotionEdit />,
        },
        {
          path: "booking",
          element: <BookingPage />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ]);

  return (
    <>
      {isLoading === false ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </>
  );
}
