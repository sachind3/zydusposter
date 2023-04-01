import { useContext } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { AppContext } from "../context";
const ProtectedRoute = () => {
  const { user } = useContext(AppContext);
  let location = useLocation();
  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default ProtectedRoute;
