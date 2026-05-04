import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";

import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import AdminHome from "./pages/Admin/AdminHome";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminTournaments from "./pages/Admin/AdminTournaments";

import ProtectedRoute from "./components/ProtectedRoute";
import TournamentPage from "./pages/Tournament/TournamentPage";
import RegisterTeam from "./pages/Tournament/RegisterTeam";
import Team from "./pages/Team/Team";
import SubmitSolution from "./pages/Tournament/SubmitSolution";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/team" element={<Team />} />

        <Route path="/tournament/:id" element={<TournamentPage />} />
        <Route path="/tournament/:id/register" element={<RegisterTeam />} />
        <Route path="/tournament/:id/submit" element={<SubmitSolution />} />

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