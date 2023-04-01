import { useContext } from "react";
import { AppContext } from "../context";
import { MdLogout } from "react-icons/md";
const Navbar = () => {
  const { user, setUser, setDocInfo } = useContext(AppContext);
  const logoutHandle = () => {
    localStorage.removeItem("user");
    setDocInfo(null);
    setUser(null);
  };
  return (
    <div className="bg-pink-500 w-full px-4 py-3 shadow text-white flex items-center justify-between">
      Hi, {user?.emp_name}
      <MdLogout className="text-xl" onClick={logoutHandle} />
    </div>
  );
};
export default Navbar;
