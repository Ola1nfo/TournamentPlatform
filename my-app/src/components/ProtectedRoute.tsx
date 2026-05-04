import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "jury" | "team")[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, role, loading } = useAuth();

  // поки грузиться — нічого не показуємо
  if (loading) return <div>Loading...</div>;

  // якщо не залогінений
  if (!user) {
    return <Navigate to="/" />;
  }

  // якщо є обмеження по ролях
  if (allowedRoles && !allowedRoles.includes(role!)) {
    return <div>Нема доступу</div>;
  }

  return children;
}