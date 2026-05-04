import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";

import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import AdminHome from "./pages/Admin/AdminHome";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminTournaments from "./pages/Admin/AdminTournaments";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="tournaments" element={<AdminTournaments />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}