import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RouteBaseRoute = (props) => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const user = useSelector((state) => state.account.user);
  const userRole = user.role;

  if (isAdminRoute && userRole === "ADMIN") {
    return <>{props.children}</>;
  } else {
    return <NotPermistted />;
  }
};

const ProtectedRoute = (props) => {
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

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
