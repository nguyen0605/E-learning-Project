import { Navigate, Route, Routes } from "react-router-dom";
import InstructorAnalyticsPage from "./instructor/pages/InstructorAnalyticsPage";
import InstructorCourseManagementPage from "./instructor/pages/InstructorCourseManagementPage";
import InstructorDashboardPage from "./instructor/pages/InstructorDashboardPage";
import InstructorInteractionPage from "./instructor/pages/InstructorInteractionPage";
import InstructorQuizTestsPage from "./instructor/pages/InstructorQuizTestsPage";
import InstructorStudentsPage from "./instructor/pages/InstructorStudentsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/instructor" replace />} />
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
      <Route path="*" element={<Navigate to="/instructor" replace />} />
    </Routes>
  );
}

export default App;
