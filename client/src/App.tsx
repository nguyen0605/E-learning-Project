import { useState } from "react";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import CourseManagementPage from "./admin/pages/CourseManagementPage";
import GeneralContentPage from "./admin/pages/GeneralContentPage";
import StudentManagementPage from "./admin/pages/StudentManagementPage";
import SystemConfigurationPage from "./admin/pages/SystemConfigurationPage";

type AdminPage =
  | "dashboard"
  | "students"
  | "courses"
  | "system"
  | "content";

function App() {
  const [activePage, setActivePage] = useState<AdminPage>("dashboard");

  if (activePage === "students") {
    return (
      <StudentManagementPage
        activePage={activePage}
        onNavigate={setActivePage}
      />
    );
  }

  if (activePage === "courses") {
    return (
      <CourseManagementPage
        activePage={activePage}
        onNavigate={setActivePage}
      />
    );
  }

  if (activePage === "system") {
    return (
      <SystemConfigurationPage
        activePage={activePage}
        onNavigate={setActivePage}
      />
    );
  }

  if (activePage === "content") {
    return (
      <GeneralContentPage
        activePage={activePage}
        onNavigate={setActivePage}
      />
    );
  }

  return (
    <AdminDashboardPage activePage={activePage} onNavigate={setActivePage} />
  );
}

export default App;
