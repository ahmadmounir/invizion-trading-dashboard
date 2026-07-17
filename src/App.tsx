import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@/shared/components/theme";
import "@/shared/utils/i18n"; // Initialize i18n
import { ProtectedRoute, AuthProtectedRoute } from "@/shared/components/guards";
import { GlobalLoader } from "@/shared/components";
import Login from "@/features/auth/components/login-workflow/Login";
import Dashboard from "@/features/dashboard/components/Dashboard";
import { Toaster } from "@/shared/components/ui";
import { Header, Footer } from "@/shared/components/navigation";
import { SettingsLayout } from "@/features/settings";
import { useProfileHydration } from "@/shared/hooks";
import ResetPassword from "./features/auth/components/reset-password/ResetPassword";
import PasswordResetVerify from "./features/auth/components/reset-password/PasswordResetVerify";
import MfaVerification from "./features/auth/components/login-workflow/MfaVerification";
import VerifyEmail from "./features/auth/components/login-workflow/VerifyEmail";
import VerifyMobile from "./features/auth/components/login-workflow/VerifyMobile";
import SetMobile from "./features/auth/components/login-workflow/SetMobile";
import Register from "./features/auth/components/register/Register";

// Lazy load settings pages
const SettingsPage = lazy(
  () => import("@/features/settings/MyAccount/Settings"),
);
const SecurityPage = lazy(
  () => import("@/features/settings/MyAccount/Security"),
);

// Add this script to set theme on initial page load
const setInitialTheme = () => {
  const theme = localStorage.getItem("inviziontenantui-theme") || "system";
  const root = window.document.documentElement;

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
    document.body.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
    document.body.classList.add(theme);
  }
};

// Execute it immediately
setInitialTheme();

// Layout component to handle sidebar
function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const isAuthRoute = pathSegments[0] === "auth";
  const isEmailRoute = pathSegments[0] === "email";
  const isChangeEmailRoute = pathSegments[0] === "change-email";
  const isPasswordRoute = pathSegments[0] === "password";
  const isInvitationRoute = pathSegments[0] === "invitation";

  // Don't show navigation for auth, email, change-email, password, and invitation routes
  if (
    isAuthRoute ||
    isEmailRoute ||
    isChangeEmailRoute ||
    isPasswordRoute ||
    isInvitationRoute
  ) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen bg-background overflow-y-auto">
      <div className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 dark:bg-background">
          <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

// Inner component to handle profile hydration (needs Router context)
function AppContent() {
  // Hydrate profile on app mount (handles page refresh)
  useProfileHydration();

  return (
    <AppLayout>
      <Routes>
        {/* Auth routes - protected from authenticated users */}
        <Route element={<AuthProtectedRoute />}>
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
        </Route>

        {/* MFA verification - not protected (requires challenge token) */}
        <Route path="/auth/mfa" element={<MfaVerification />} />

        {/* Email verification - not protected (requires challenge token) */}
        <Route path="/auth/verify-email" element={<VerifyEmail />} />

        {/* Mobile verification - not protected (requires challenge token) */}
        <Route path="/auth/verify-mobile" element={<VerifyMobile />} />

        {/* Set mobile - not protected (requires challenge token) */}
        <Route path="/auth/set-mobile" element={<SetMobile />} />

        <Route
          path="/password/reset"
          element={
            <Suspense fallback={<GlobalLoader />}>
              <PasswordResetVerify />
            </Suspense>
          }
        />

        {/* Protected routes - require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />

          {/* Settings routes */}
          <Route
            path="/settings"
            element={
              <SettingsLayout>
                <Suspense fallback={<GlobalLoader />}>
                  <SettingsPage />
                </Suspense>
              </SettingsLayout>
            }
          />
          <Route
            path="/settings/sessions"
            element={
              <SettingsLayout>
                <Suspense fallback={<GlobalLoader />}>
                  <SecurityPage />
                </Suspense>
              </SettingsLayout>
            }
          />
        </Route>

        {/* Redirect all other routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

const GOOGLE_CLIENT_ID =
  "873012096211-2v2neaoabjk3csl3pigg11f06npe2s8o.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} locale="tr">
      <ThemeProvider defaultTheme="system" storageKey="inviziontenantui-theme">
        <Router>
          <AppContent />
        </Router>
        <Toaster position="top-center" />
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
