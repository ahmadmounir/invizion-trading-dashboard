import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "@/shared/services/localAuth";
import { useProfileStore } from "@/shared/stores/profileStore";

export const AuthProtectedRoute = () => {
  const profile = useProfileStore((state) => state.profile);

  // If user is fully authenticated (has token AND profile), redirect to home page
  if (isAuthenticated() && profile) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the auth pages
  return <Outlet />;
};

export default AuthProtectedRoute;
