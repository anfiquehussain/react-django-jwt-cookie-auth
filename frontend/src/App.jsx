import { Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import Login from './pages/AuthPages/Login';
import Profile from './pages/Profiles/Profile';
import PublicRoute from "./RoutesManage/PublicRoutes";
import ProtectedRoute from "./RoutesManage/ProtectedRoute";
import CommonLayout from "./Layout/CommonLayout";
import Contact from "./pages/Common/Contact";
import About from "./pages/Common/About";
import Register from "./pages/AuthPages/Register";
import Navbar from "./components/basic/Navbar";
import CommonNavbar from "./components/basic/CommonNavbar";
import Users from "./pages/Users/Users";
import TopLocations from "./pages/Users/TopLocations";

function App() {
  return (
    <div className="container mx-auto font-mono">
      <Navbar/>
      {/* <CommonNavbar/> */}
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Common Routes (accessible to anyone) */}
        <Route path="/" element={<CommonLayout><Home /></CommonLayout>} />
        <Route path="/about" element={<CommonLayout><About /></CommonLayout>} />
        <Route path="/users" element={<CommonLayout><Users /></CommonLayout>} />
        <Route path="/toplocations" element={<CommonLayout><TopLocations /></CommonLayout>} />
        <Route path="/contact" element={<CommonLayout><Contact /></CommonLayout>} />
      </Routes>
    </div>
  );
}

export default App;
