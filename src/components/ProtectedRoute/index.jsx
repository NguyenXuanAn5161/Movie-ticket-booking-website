import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NotPermistted from "./NotPermistted";

const RouteBaseRoute = (props) => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const user = useSelector((state) => state.account.user);
  const userRoles = user?.roles;

  useEffect(() => {
    console.log("userRoles: ", userRoles);
  }, [user, userRoles]);

  if (isAdminRoute && userRoles?.some((role) => role === "ROLE_ADMIN")) {
    return <>{props.children}</>;
  } else {
    return <NotPermistted />;
  }
};

const ProtectedRoute = (props) => {
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

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
