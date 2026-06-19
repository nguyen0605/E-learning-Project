import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import StudentHeader from "../components/StudentHeader";
import type { StudentView } from "../types/student.types";
import CartPage from "../views/CartPage";
import CategoriesPage from "../views/CategoriesPage";
import CourseDetailPage from "../views/CourseDetailPage";
import CoursesPage from "../views/CoursesPage";
import ExamPage from "../views/ExamPage";
import HomePage from "../views/HomePage";
import InteractionPage from "../views/InteractionPage";
import LessonPage from "../views/LessonPage";
import LearningPage from "../views/LearningPage";
import MyCoursesPage from "../views/MyCoursesPage";
import "./StudentPortalPage.css";

function StudentPortalPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeView, setActiveView] = useState<StudentView>("home");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  useEffect(() => {
    const requestedView = searchParams.get("view");

    if (requestedView === "myCourses" || requestedView === "cart" || requestedView === "courses") {
      setActiveView(requestedView);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  function handleOpenCourse(courseId: number) {
    setSelectedCourseId(courseId);
    setActiveView("courseDetail");
  }

  function handleStartLearning(courseId: number) {
    setSelectedCourseId(courseId);
    setActiveView("learning");
  }

  return (
    <div className="student-portal">
      <StudentHeader activeView={activeView} onNavigate={setActiveView} />
      {activeView === "home" ? <HomePage onNavigate={setActiveView} /> : null}
      {activeView === "courses" ? (
        <CoursesPage onOpenCourse={handleOpenCourse} />
      ) : null}
      {activeView === "myCourses" ? (
        <MyCoursesPage onStartLearning={handleStartLearning} />
      ) : null}
      {activeView === "categories" ? (
        <CategoriesPage onOpenCourse={handleOpenCourse} />
      ) : null}
      {activeView === "courseDetail" && selectedCourseId ? (
        <CourseDetailPage
          courseId={selectedCourseId}
          onBack={() => setActiveView("courses")}
        />
      ) : null}
      {activeView === "cart" ? <CartPage /> : null}
      {activeView === "learning" && selectedCourseId ? (
        <LearningPage
          courseId={selectedCourseId}
          onBack={() => setActiveView("myCourses")}
        />
      ) : null}
      {activeView === "lesson" ? <LessonPage /> : null}
      {activeView === "exam" ? <ExamPage /> : null}
      {activeView === "interaction" ? <InteractionPage /> : null}
      <Footer />
    </div>
  );
}

export default StudentPortalPage;
