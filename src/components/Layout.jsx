import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useContext } from "react";
import { AppContext } from "../context";
import Loader from "./Loader";

const Layout = () => {
  const { user, loading } = useContext(AppContext);
  return (
    <>
      {loading && <Loader />}
      <div className="mx-auto max-w-md h-full flex flex-col items-center appContainer">
        {user && <Navbar />}
        <Outlet />
      </div>
    </>
  );
};
export default Layout;
