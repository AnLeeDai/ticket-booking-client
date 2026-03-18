import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";

import SplashScreen from "./components/splash-screen";
import ProtectedRoute from "./components/auth/protected-route";
import { pageRoute } from "./configs/site-config";
import CategoryPage from "./pages/admin/category/category-page";
const MoviePage = lazy(() => import("./pages/admin/movie/movie-page"));
const UserPage = lazy(() => import("./pages/admin/user/user-page"));

// Lazy load layouts
const AuthLayout = lazy(() => import("./layouts/auth-layout"));
const AdminLayout = lazy(() => import("./layouts/admin-layout"));
const EmployeeLayout = lazy(() => import("./layouts/employee-layout"));
const CustomerLayout = lazy(() => import("./layouts/customer-layout"));

// Lazy load auth pages
const LoginPage = lazy(() => import("./pages/login/login-page"));
const RegisterPage = lazy(() => import("./pages/register/register-page"));
const ForgotPasswordPage = lazy(() => import("./pages/forgot-password/forgot-password-page"));
const ResetPasswordPage = lazy(() => import("./pages/reset-password/reset-password-page"));

// Lazy load dashboard pages
const AdminDashboardPage = lazy(() => import("./pages/admin/admin-dashboard-page"));
const EmployeeDashboardPage = lazy(() => import("./pages/employee/employee-dashboard-page"));
const CustomerDashboardPage = lazy(() => import("./pages/customer/customer-dashboard-page"));

export default function App() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes>
        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path={pageRoute.login} element={<LoginPage />} />
          <Route path={pageRoute.register} element={<RegisterPage />} />
          <Route path={pageRoute.forgotPassword} element={<ForgotPasswordPage />} />
          <Route path={pageRoute.resetPassword} element={<ResetPasswordPage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path={pageRoute.adminDashboard} element={<AdminDashboardPage />} />
          <Route path={pageRoute.categoryManagement} element={<CategoryPage />} />
          <Route path={pageRoute.movieManagement} element={<MoviePage />} />
          <Route path={pageRoute.userManagement} element={<UserPage />} />
        </Route>

        {/* Employee Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeLayout />
            </ProtectedRoute>
          }
        >
          <Route path={pageRoute.employeeDashboard} element={<EmployeeDashboardPage />} />
        </Route>

        {/* Customer Routes (Home) */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route path={pageRoute.home} element={<CustomerDashboardPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
