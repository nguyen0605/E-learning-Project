import { useState } from "react";
import Footer from "../components/Footer";
import StudentHeader from "../components/StudentHeader";
import type { StudentView } from "../types/student.types";
import CartPage from "../views/CartPage";
import CategoriesPage from "../views/CategoriesPage";
import CoursesPage from "../views/CoursesPage";
import ExamPage from "../views/ExamPage";
import HomePage from "../views/HomePage";
import InteractionPage from "../views/InteractionPage";
import LessonPage from "../views/LessonPage";
import "./StudentPortalPage.css";

function StudentPortalPage() {
  const [activeView, setActiveView] = useState<StudentView>("home");

  return (
    <div className="student-portal">
      <StudentHeader activeView={activeView} onNavigate={setActiveView} />
      {activeView === "home" ? <HomePage onNavigate={setActiveView} /> : null}
      {activeView === "courses" ? <CoursesPage /> : null}
      {activeView === "categories" ? <CategoriesPage /> : null}
      {activeView === "cart" ? <CartPage /> : null}
      {activeView === "lesson" ? <LessonPage /> : null}
      {activeView === "exam" ? <ExamPage /> : null}
      {activeView === "interaction" ? <InteractionPage /> : null}
      <Footer />
    </div>
  );
}

export default StudentPortalPage;
