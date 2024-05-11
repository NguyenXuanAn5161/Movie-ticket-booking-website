import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LayoutAdmin from "./components/Admin/LayoutAdmin";
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
import VNPayPaymentReturn from "./pages/VNPayPaymentReturn";
import DashBoardShow from "./pages/dashboard/Show";
import StatisticalCinema from "./pages/dashboard/StatisticalCinema";
import StatisticalMovie from "./pages/dashboard/StatisticalMovie";
import StatisticalPromotion from "./pages/dashboard/StatisticalPromotion";
import StatisticalReturnInvoice from "./pages/dashboard/StatisticalReturnInvoice";
import StatisticalStaff from "./pages/dashboard/StatisticalStaff";
import StatisticalUser from "./pages/dashboard/StatisticalUser";
import LoginPage from "./pages/login";
import OrderList from "./pages/order/List";
import OrderShow from "./pages/order/Show";
import ReturnInvoiceList from "./pages/orderReturn/List";
import ReturnInvoiceShow from "./pages/orderReturn/Show";
import { doGetAccountAction } from "./redux/account/accountSlice";
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

    const userLocalStorage = localStorage.getItem("user");
    if (userLocalStorage) {
      dispatch(doGetAccountAction(JSON.parse(userLocalStorage)));
    }

    // const res = await callFetchAccount();
    // if (res && res.data) {
    //   dispatch(doGetAccountAction(res.data));
    // }
  };

  useEffect(() => {
    getAccount();
  }, []);

  const router = createBrowserRouter([
    // layout for admin
    {
      path: "/",
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
        // Thống kê
        {
          path: "statisticalCinema",
          element: (
            <ProtectedRoute>
              <StatisticalCinema />
            </ProtectedRoute>
          ),
        },
        {
          path: "statisticalMovie",
          element: (
            <ProtectedRoute>
              <StatisticalMovie />
            </ProtectedRoute>
          ),
        },
        {
          path: "statisticalUser",
          element: (
            <ProtectedRoute>
              <StatisticalUser />
            </ProtectedRoute>
          ),
        },
        {
          path: "statisticalStaff",
          element: (
            <ProtectedRoute>
              <StatisticalStaff />
            </ProtectedRoute>
          ),
        },
        {
          path: "statisticalReturnInvoice",
          element: (
            <ProtectedRoute>
              <StatisticalReturnInvoice />
            </ProtectedRoute>
          ),
        },
        {
          path: "statisticalPromotion",
          element: (
            <ProtectedRoute>
              <StatisticalPromotion />
            </ProtectedRoute>
          ),
        },
        // Hóa đơn
        {
          path: "order",
          element: (
            <ProtectedRoute>
              <OrderList />,
            </ProtectedRoute>
          ),
        },
        {
          path: "order/show/:orderId",
          element: (
            <ProtectedRoute>
              <OrderShow />,
            </ProtectedRoute>
          ),
        },
        {
          path: "returnInvoice",
          element: (
            <ProtectedRoute>
              <ReturnInvoiceList />,
            </ProtectedRoute>
          ),
        },
        {
          path: "returnInvoice/show/:returnInvoiceId",
          element: (
            <ProtectedRoute>
              <ReturnInvoiceShow />,
            </ProtectedRoute>
          ),
        },
        // Người dùng
        {
          path: "user",
          element: (
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          ),
        },
        {
          path: "user/show/:userId",
          element: (
            <ProtectedRoute>
              <UserShow />,
            </ProtectedRoute>
          ),
        },
        {
          path: "user/create",
          element: (
            <ProtectedRoute>
              <UserCreate />,
            </ProtectedRoute>
          ),
        },
        // Phim
        {
          path: "movie",
          element: (
            <ProtectedRoute>
              <MovieList />,
            </ProtectedRoute>
          ),
        },
        {
          path: "movie/show/:movieId",
          element: (
            <ProtectedRoute>
              <MovieShow />,
            </ProtectedRoute>
          ),
        },
        {
          path: "movie/create",
          element: (
            <ProtectedRoute>
              <MovieCreate />,
            </ProtectedRoute>
          ),
        },
        {
          path: "movie/edit/:movieId",
          element: (
            <ProtectedRoute>
              <MovieEdit />,
            </ProtectedRoute>
          ),
        },
        // Loại phim
        {
          path: "movieGenre",
          element: (
            <ProtectedRoute>
              <MovieGenreList />,
            </ProtectedRoute>
          ),
        },
        {
          path: "movieGenre/show/:categoryMovieId",
          element: (
            <ProtectedRoute>
              <MovieGenreShow />,
            </ProtectedRoute>
          ),
        },
        {
          path: "movieGenre/create",
          element: (
            <ProtectedRoute>
              <MovieGenreCreate />,
            </ProtectedRoute>
          ),
        },
        {
          path: "movieGenre/edit/:categoryMovieId",
          element: (
            <ProtectedRoute>
              <MovieGenreEdit />,
            </ProtectedRoute>
          ),
        },
        // Lịch chiếu phim
        {
          path: "schedule",
          element: (
            <ProtectedRoute>
              <ScheduleList />,
            </ProtectedRoute>
          ),
        },
        {
          path: "schedule/show/:movieScheduleId",
          element: (
            <ProtectedRoute>
              <ScheduleShow />,
            </ProtectedRoute>
          ),
        },
        {
          path: "schedule/create",
          element: (
            <ProtectedRoute>
              <ScheduleCreate />,
            </ProtectedRoute>
          ),
        },
        {
          path: "schedule/edit/:movieScheduleId",
          element: (
            <ProtectedRoute>
              <ScheduleEdit />,
            </ProtectedRoute>
          ),
        },
        // Rạp phim
        {
          path: "cinema",
          element: (
            <ProtectedRoute>
              <CinemaList />,
            </ProtectedRoute>
          ),
        },
        {
          path: "cinema/show/:cinemaId",
          element: (
            <ProtectedRoute>
              <CinemaShow />,
            </ProtectedRoute>
          ),
        },
        // room trong cinema
        {
          path: "cinema/show/:cinemaId/room/create",
          element: (
            <ProtectedRoute>
              <RoomCreate />,
            </ProtectedRoute>
          ),
        },
        {
          path: "cinema/show/:cinemaId/room/edit/:roomId",
          element: (
            <ProtectedRoute>
              <RoomEdit />,
            </ProtectedRoute>
          ),
        },
        //------------------------------
        {
          path: "cinema/create",
          element: (
            <ProtectedRoute>
              <CinemaCreate />,
            </ProtectedRoute>
          ),
        },
        {
          path: "cinema/edit/:cinemaId",
          element: (
            <ProtectedRoute>
              <CinemaEdit />,
            </ProtectedRoute>
          ),
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
          element: (
            <ProtectedRoute>
              <FoodList />,
            </ProtectedRoute>
          ),
        },
        {
          path: "food/show/:foodId",
          element: (
            <ProtectedRoute>
              <FoodShow />,
            </ProtectedRoute>
          ),
        },
        {
          path: "food/create",
          element: (
            <ProtectedRoute>
              <FoodCreate />,
            </ProtectedRoute>
          ),
        },
        {
          path: "food/edit/:foodId",
          element: (
            <ProtectedRoute>
              <FoodEdit />,
            </ProtectedRoute>
          ),
        },
        // Loại đồ ăn
        {
          path: "foodCategories",
          element: (
            <ProtectedRoute>
              <FoodCategoryList />,
            </ProtectedRoute>
          ),
        },
        {
          path: "foodCategories/show/:foodCategoryId",
          element: (
            <ProtectedRoute>
              <FoodCategoryShow />,
            </ProtectedRoute>
          ),
        },
        {
          path: "foodCategories/create",
          element: (
            <ProtectedRoute>
              <FoodCategoryCreate />,
            </ProtectedRoute>
          ),
        },
        {
          path: "foodCategories/edit/:foodCategoryId",
          element: (
            <ProtectedRoute>
              <FoodCategoryEdit />,
            </ProtectedRoute>
          ),
        },
        // Giá sản phẩm
        {
          path: "price",
          element: (
            <ProtectedRoute>
              <PriceList />,
            </ProtectedRoute>
          ),
        },
        {
          path: "price/show/:priceId",
          element: (
            <ProtectedRoute>
              <PriceShow />,
            </ProtectedRoute>
          ),
        },
        {
          path: "price/create",
          element: (
            <ProtectedRoute>
              <PriceCreate />,
            </ProtectedRoute>
          ),
        },
        {
          path: "price/edit/:priceId",
          element: (
            <ProtectedRoute>
              <PriceEdit />,
            </ProtectedRoute>
          ),
        },
        // Khuyến mãi
        {
          path: "promotion",
          element: (
            <ProtectedRoute>
              <PromotionList />,
            </ProtectedRoute>
          ),
        },
        {
          path: "promotion/show/:promotionId",
          element: (
            <ProtectedRoute>
              <PromotionShow />,
            </ProtectedRoute>
          ),
        },
        {
          path: "promotion/create",
          element: (
            <ProtectedRoute>
              <PromotionCreate />,
            </ProtectedRoute>
          ),
        },
        {
          path: "promotion/edit/:promotionId",
          element: (
            <ProtectedRoute>
              <PromotionEdit />,
            </ProtectedRoute>
          ),
        },
        {
          path: "booking",
          element: (
            <ProtectedRoute>
              <BookingPage />,
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/api/invoice/vnpay-payment-return",
      element: <VNPayPaymentReturn />,
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
