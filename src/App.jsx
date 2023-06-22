import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const AddDoctor = lazy(() => import("./pages/AddDoctor"));
const Admin = lazy(() => import("./pages/Admin"));
const DownloadPoster = lazy(() => import("./pages/DownloadPoster"));

const App = () => {
  return (
    <Suspense fallback={<div>Please wait, loading ...</div>}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route index element={<Home />} />
            <Route path="add-doctor" element={<AddDoctor />} />
            <Route path="download-poster" element={<DownloadPoster />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="admin" element={<Admin />} />
      </Routes>
    </Suspense>
  );
};
export default App;
