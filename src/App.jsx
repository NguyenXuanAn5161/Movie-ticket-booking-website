import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import LayoutAdmin from "./components/Admin/LayoutAdmin";
import SeatTable from "./components/Admin/ManageCinema/ManageSeat/Seat/SeatTable";
import SeatTypeTable from "./components/Admin/ManageCinema/ManageSeat/SeatType/SeatTypeTable";
import UserTable from "./components/Admin/User/UserTable";
import Footer from "./components/Footer/index";
import Header from "./components/Header/index";
import Loading from "./components/Loading";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./pages/admin";
import LoginPage from "./pages/login";
// import RegisterPage from "./pages/register/index";
import BookTable from "./components/Admin/Book/BookTable";
import CinemaTable from "./components/Admin/ManageCinema/CinemaTable";
import RoomTable from "./components/Admin/ManageCinema/Room/RoomTable";
import FoodTable from "./components/Admin/ManageFood/Food/FoodTable";
import FoodCategoriesTable from "./components/Admin/ManageFood/FoodCategories/FoodCategoriesTable";
import OrderTable from "./components/Admin/Order/OrderTable";
import PromotionTable from "./components/Admin/Promotion/PromotionTable";
import { doGetAccountAction } from "./redux/account/accountSlice";
import { callFetchAccount } from "./services/api";
import "./styles/reset.scss";

const Layout = () => {
  return (
    <div className="layout-app">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

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
          index: true,
          element: (
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "order",
          element: <OrderTable />,
        },
        {
          path: "user",
          element: <UserTable />,
        },
        {
          path: "movie",
          element: <BookTable />,
        },
        // {
        //   path: "movieGenre",
        //   element: <BookTable />,
        // },
        {
          path: "cinema",
          element: <CinemaTable />,
        },
        {
          path: "room",
          element: <RoomTable />,
        },
        {
          path: "room/seat",
          element: <SeatTable />,
        },
        {
          path: "room/seatType",
          element: <SeatTypeTable />,
        },
        {
          path: "food",
          element: <FoodTable />,
        },
        {
          path: "foodCategories",
          element: <FoodCategoriesTable />,
        },
        {
          path: "promotion",
          element: <PromotionTable />,
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
    // {
    //   path: "/register",
    //   element: <RegisterPage />,
    // },
  ]);

  return (
    <>
      {isLoading === false ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ||
      window.location.pathname === "/" ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </>
  );
}
