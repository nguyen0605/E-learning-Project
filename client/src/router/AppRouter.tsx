import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import AdminDashboardPage from "../admin/pages/AdminDashboardPage";
import CourseManagementPage from "../admin/pages/CourseManagementPage";
import GeneralContentPage from "../admin/pages/GeneralContentPage";
import StudentManagementPage from "../admin/pages/StudentManagementPage";
import SystemConfigurationPage from "../admin/pages/SystemConfigurationPage";
import StudentLoginPage from "../student/pages/StudentLoginPage";
import StudentPortalPage from "../student/pages/StudentPortalPage";
import StudentRegisterPage from "../student/pages/StudentRegisterPage";

type AdminPage = "dashboard" | "students" | "courses" | "system" | "content";

function AdminPortal() {
  const [activePage, setActivePage] = useState<AdminPage>("dashboard");
  const pageProps = { activePage, onNavigate: setActivePage };

  if (activePage === "students") {
    return <StudentManagementPage {...pageProps} />;
  }

  if (activePage === "courses") {
    return <CourseManagementPage {...pageProps} />;
  }

  if (activePage === "system") {
    return <SystemConfigurationPage {...pageProps} />;
  }

  if (activePage === "content") {
    return <GeneralContentPage {...pageProps} />;
  }

  return <AdminDashboardPage {...pageProps} />;
}

function StudentRoutes() {
  return (
    <>
      <Route path="/student/login" element={<StudentLoginPage />} />
      <Route path="/student/register" element={<StudentRegisterPage />} />
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentPortalPage />
          </ProtectedRoute>
        }
      />
    </>
  );
}

function AdminRoutes() {
  return (
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminPortal />
        </ProtectedRoute>
      }
    />
  );
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/student" replace />} />

      {StudentRoutes()}
      {AdminRoutes()}

      <Route path="*" element={<Navigate to="/student" replace />} />
    </Routes>
  );
}

export default AppRouter;
