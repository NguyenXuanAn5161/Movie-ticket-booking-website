import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { doSetIsRunning } from "../../redux/counter/counterSlice";
import { callHoldSeats } from "../../services/apiOder";
import NotPermistted from "./NotPermistted";

const RouteBaseRoute = (props) => {
  const isAdminRoute = window.location.pathname.startsWith("/");
  const user = useSelector((state) => state.account.user);
  const userRoles = user?.roles;

  useEffect(() => {
    console.log("userRoles: ", userRoles);
  }, [user, userRoles]);

  if (
    isAdminRoute &&
    userRoles?.some(
      (role) => role === "ROLE_ADMIN" || role === "ROLE_MODERATOR"
    )
  ) {
    return <>{props.children}</>;
  } else {
    return <NotPermistted />;
  }
};

const ProtectedRoute = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const isRunning = useSelector((state) => state.counter.isRunning);
  const selectedSeats = useSelector((state) => state.booking.selectedSeats);
  const selectedShowTime = useSelector(
    (state) => state.booking.selectedShowTime
  );

  useEffect(() => {
    console.log("location: ", location.pathname);
    if (isRunning === true && location.pathname !== "/booking") {
      fetchHoldSeatTrue(selectedSeats, selectedShowTime.id);
    }
  }, [location]);

  const fetchHoldSeatTrue = async (seats, showTimeId) => {
    const res = await callHoldSeats(seats, showTimeId, true);
    if (res?.status === 200) {
      dispatch(doSetIsRunning(false));
    }
  };

  useEffect(() => {
    console.log("isAuthenticated: ", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <>
      {isAuthenticated === true ? (
        <>
          <RouteBaseRoute>{props.children}</RouteBaseRoute>
        </>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
};

export default ProtectedRoute;
