import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";

import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import AdminHome from "./pages/Admin/AdminHome";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminTournaments from "./pages/Admin/AdminTournaments";

import ProtectedRoute from "./components/ProtectedRoute";

import TournamentPage from "./pages/Tournament/TournamentPage";
import RegisterTeam from "./pages/Tournament/RegisterTeam";
import SubmitSolution from "./pages/Tournament/SubmitSolution";
import Leaderboard from "./pages/Tournament/Leaderboard";

import Team from "./pages/Team/Team";
import Jury from "./pages/Jury/Jury";
import Evaluate from "./pages/Jury/Evaluate";

import Header from "./components/Header/Header";

function AppLayout() {
  const location = useLocation();

  // ❌ ховаємо header на auth сторінках
  const hideHeader =
    location.pathname === "/" ||
    location.pathname === "/register";

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/tournament/:id" element={<TournamentPage />} />
        <Route path="/tournament/:id/leaderboard" element={<Leaderboard />} />

        {/* TEAM */}
        <Route
          path="/team"
          element={
            <ProtectedRoute allowedRoles={["team"]}>
              <Team />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tournament/:id/register"
          element={
            <ProtectedRoute allowedRoles={["team"]}>
              <RegisterTeam />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tournament/:id/submit"
          element={
            <ProtectedRoute allowedRoles={["team"]}>
              <SubmitSolution />
            </ProtectedRoute>
          }
        />

        {/* JURY */}
        <Route
          path="/jury"
          element={
            <ProtectedRoute allowedRoles={["jury"]}>
              <Jury />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jury/:id"
          element={
            <ProtectedRoute allowedRoles={["jury"]}>
              <Evaluate />
            </ProtectedRoute>
          }
        />

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
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}