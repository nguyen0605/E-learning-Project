import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { hasInstructorAuthSession } from "./instructor/auth/instructorAuth";
import InstructorAnalyticsPage from "./instructor/pages/InstructorAnalyticsPage";
import InstructorAuthPage from "./instructor/pages/InstructorAuthPage";
import InstructorCourseManagementPage from "./instructor/pages/InstructorCourseManagementPage";
import InstructorDashboardPage from "./instructor/pages/InstructorDashboardPage";
import InstructorInteractionPage from "./instructor/pages/InstructorInteractionPage";
import InstructorProfilePage from "./instructor/pages/InstructorProfilePage";
import InstructorQuizTestsPage from "./instructor/pages/InstructorQuizTestsPage";
import InstructorStudentsPage from "./instructor/pages/InstructorStudentsPage";

function InstructorPrivateRoute() {
  return hasInstructorAuthSession() ? <Outlet /> : <Navigate to="/instructor/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/instructor" replace />} />
      <Route path="/instructor/login" element={<InstructorAuthPage mode="login" />} />
      <Route path="/instructor/register" element={<InstructorAuthPage mode="register" />} />
      <Route element={<InstructorPrivateRoute />}>
        <Route path="/instructor" element={<InstructorDashboardPage />} />
        <Route
          path="/instructor/courses"
          element={<InstructorCourseManagementPage />}
        />
        <Route path="/instructor/quizzes" element={<InstructorQuizTestsPage />} />
        <Route path="/instructor/students" element={<InstructorStudentsPage />} />
        <Route
          path="/instructor/interaction"
          element={<InstructorInteractionPage />}
        />
        <Route
          path="/instructor/analytics"
          element={<InstructorAnalyticsPage />}
        />
        <Route path="/instructor/profile" element={<InstructorProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/instructor" replace />} />
    </Routes>
  );
}

export default App;
