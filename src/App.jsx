import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import DownloadPoster from "./pages/DownloadPoster";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route index element={<Home />} />
          <Route path="download-poster" element={<DownloadPoster />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="admin" element={<Admin />} />
    </Routes>
  );
};
export default App;
