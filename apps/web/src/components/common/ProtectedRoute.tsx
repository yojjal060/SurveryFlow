import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { LoadingState } from "@/components/common/LoadingState";

export function ProtectedRoute() {
  const { admin, isLoading } = useAuth();
  if (isLoading) return <LoadingState label="Checking session..." />;
  return admin ? <Outlet /> : <Navigate to="/login" replace />;
}
