import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/shared/components/theme";
import "@/shared/utils/i18n"; // Initialize i18n
import { ProtectedRoute, AuthProtectedRoute } from "@/shared/components/guards";
import { GlobalLoader } from "@/shared/components";
import Login from "@/features/auth/components/login-workflow/Login";
import Dashboard from "@/features/dashboard/components/Dashboard";
import { Toaster } from "@/shared/components/ui";
import { Header, Footer } from "@/shared/components/navigation";
import { SettingsLayout } from "@/features/settings";
import Register from "./features/auth/components/register/Register";

// Lazy load settings page
const SettingsPage = lazy(
  () => import("@/features/settings/MyAccount/Settings"),
);

const queryClient = new QueryClient();

// Add this script to set theme on initial page load
const setInitialTheme = () => {
  const theme = localStorage.getItem("inviziontenantui-theme") || "dark";
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

  // Don't show navigation for auth routes
  if (isAuthRoute) {
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

function AppContent() {
  return (
    <AppLayout>
      <Routes>
        {/* Auth routes - protected from authenticated users */}
        <Route element={<AuthProtectedRoute />}>
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
        </Route>

        {/* Protected routes - require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />

          {/* Settings route */}
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
        </Route>

        {/* Redirect all other routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="inviziontenantui-theme">
        <Router>
          <AppContent />
        </Router>
        <Toaster position="top-center" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
