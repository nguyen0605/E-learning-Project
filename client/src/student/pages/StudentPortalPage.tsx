import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import type { AppNotification } from "../../shared/services/notificationApi";
import AccountDrawer from "../components/account/AccountDrawer";
import Footer from "../components/Footer";
import StudentHeader from "../components/StudentHeader";
import {
  getStudentAccountCertificates,
  getStudentAccountPaymentHistory,
  getStudentAccountProfile,
} from "../services/studentAccountApi";
import type {
  StudentAccountCertificatesData,
  StudentAccountPaymentHistoryData,
  StudentAccountProfileData,
} from "../types/account.types";
import type { StudentExam, StudentExamResult } from "../types/exam.types";
import type { StudentView } from "../types/student.types";
import AccountCertificatesPage from "../views/AccountCertificatesPage";
import AccountPaymentHistoryPage from "../views/AccountPaymentHistoryPage";
import AccountProfilePage from "../views/AccountProfilePage";
import CartPage from "../views/CartPage";
import CategoriesPage from "../views/CategoriesPage";
import CourseDetailPage from "../views/CourseDetailPage";
import CoursesPage from "../views/CoursesPage";
import ExamPage from "../views/ExamPage";
import ExamReviewPage from "../views/ExamReviewPage";
import ExamTakingPage from "../views/ExamTakingPage";
import HomePage from "../views/HomePage";
import InteractionPage from "../views/InteractionPage";
import LessonPage from "../views/LessonPage";
import LearningPage from "../views/LearningPage";
import MyCoursesPage from "../views/MyCoursesPage";
import "./StudentPortalPage.css";

function StudentPortalPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { logout, updateUser, user } = useAuth();
  const [activeView, setActiveView] = useState<StudentView>("home");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [focusedReviewId, setFocusedReviewId] = useState<number | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [selectedExamAttemptId, setSelectedExamAttemptId] = useState<number | null>(null);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);

  const [profileData, setProfileData] = useState<StudentAccountProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const profileRequestRef = useRef(0);

  const [certificatesData, setCertificatesData] =
    useState<StudentAccountCertificatesData | null>(null);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [certificatesError, setCertificatesError] = useState("");
  const certificatesRequestRef = useRef(0);

  const [paymentHistoryData, setPaymentHistoryData] =
    useState<StudentAccountPaymentHistoryData | null>(null);
  const [paymentHistoryLoading, setPaymentHistoryLoading] = useState(false);
  const [paymentHistoryError, setPaymentHistoryError] = useState("");
  const paymentHistoryRequestRef = useRef(0);

  useEffect(() => {
    if (!(isAccountDrawerOpen || activeView === "accountProfile") || profileData || profileLoading) {
      return;
    }

    const requestId = profileRequestRef.current + 1;
    profileRequestRef.current = requestId;
    setProfileLoading(true);
    setProfileError("");

    getStudentAccountProfile()
      .then((data) => {
        if (profileRequestRef.current === requestId) {
          setProfileData(data);
        }
      })
      .catch((error) => {
        if (profileRequestRef.current === requestId) {
          setProfileError(
            error instanceof Error ? error.message : "Không thể tải hồ sơ học viên.",
          );
        }
      })
      .finally(() => {
        if (profileRequestRef.current === requestId) {
          setProfileLoading(false);
        }
      });
  }, [activeView, isAccountDrawerOpen, profileData, profileLoading]);

  useEffect(() => {
    if (activeView !== "accountCertificates" || certificatesData || certificatesLoading) {
      return;
    }

    const requestId = certificatesRequestRef.current + 1;
    certificatesRequestRef.current = requestId;
    setCertificatesLoading(true);
    setCertificatesError("");

    getStudentAccountCertificates()
      .then((data) => {
        if (certificatesRequestRef.current === requestId) {
          setCertificatesData(data);
        }
      })
      .catch((error) => {
        if (certificatesRequestRef.current === requestId) {
          setCertificatesError(
            error instanceof Error ? error.message : "Không thể tải chứng chỉ học viên.",
          );
        }
      })
      .finally(() => {
        if (certificatesRequestRef.current === requestId) {
          setCertificatesLoading(false);
        }
      });
  }, [activeView, certificatesData, certificatesLoading]);

  useEffect(() => {
    if (activeView !== "accountPaymentHistory" || paymentHistoryData || paymentHistoryLoading) {
      return;
    }

    const requestId = paymentHistoryRequestRef.current + 1;
    paymentHistoryRequestRef.current = requestId;
    setPaymentHistoryLoading(true);
    setPaymentHistoryError("");

    getStudentAccountPaymentHistory()
      .then((data) => {
        if (paymentHistoryRequestRef.current === requestId) {
          setPaymentHistoryData(data);
        }
      })
      .catch((error) => {
        if (paymentHistoryRequestRef.current === requestId) {
          setPaymentHistoryError(
            error instanceof Error ? error.message : "Không thể tải lịch sử thanh toán.",
          );
        }
      })
      .finally(() => {
        if (paymentHistoryRequestRef.current === requestId) {
          setPaymentHistoryLoading(false);
        }
      });
  }, [activeView, paymentHistoryData, paymentHistoryLoading]);

  useEffect(() => {
    const requestedView = searchParams.get("view");

    const courseId = Number(searchParams.get("courseId"));
    const reviewId = Number(searchParams.get("reviewId"));

    if (
      requestedView === "courseDetail" &&
      Number.isFinite(courseId) &&
      courseId > 0
    ) {
      setSelectedCourseId(courseId);
      setFocusedReviewId(Number.isFinite(reviewId) && reviewId > 0 ? reviewId : null);
      setActiveView("courseDetail");
      setSearchParams({}, { replace: true });
      return;
    }

    if (requestedView === "myCourses" || requestedView === "cart" || requestedView === "courses") {
      if (Number.isFinite(courseId) && courseId > 0) {
        setSelectedCourseId(courseId);
        setFocusedReviewId(Number.isFinite(reviewId) && reviewId > 0 ? reviewId : null);
        setActiveView("courseDetail");
      } else {
        setActiveView(requestedView);
      }
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  function handleOpenCourse(courseId: number) {
    setSelectedCourseId(courseId);
    setFocusedReviewId(null);
    setActiveView("courseDetail");
  }

  function handleOpenNotification(notification: AppNotification) {
    if (!notification.targetUrl) return;

    const url = new URL(notification.targetUrl, window.location.origin);
    const view = url.searchParams.get("view");
    const courseId = Number(url.searchParams.get("courseId"));
    const reviewId = Number(url.searchParams.get("reviewId") ?? notification.referenceId);

    if (
      (view === "courseDetail" ||
        notification.type === "COURSE_REVIEW_RESPONDED" ||
        notification.referenceType === "COURSE_REVIEW") &&
      Number.isFinite(courseId) &&
      courseId > 0
    ) {
      setSelectedCourseId(courseId);
      setFocusedReviewId(Number.isFinite(reviewId) && reviewId > 0 ? reviewId : null);
      setActiveView("courseDetail");
      return;
    }

    const nextView = view as StudentView | null;
    if (nextView) {
      setActiveView(nextView);
    }
  }

  function handleStartLearning(courseId: number) {
    setSelectedCourseId(courseId);
    setActiveView("learning");
  }

  function handleOpenExam(exam: StudentExam) {
    setSelectedExamId(exam.id);

    if (exam.state === "COMPLETED") {
      setSelectedExamAttemptId(exam.attempts.latest?.id ?? null);
      setActiveView("examReview");
      return;
    }

    setSelectedExamAttemptId(
      exam.attempts.latest?.status === "IN_PROGRESS" ? exam.attempts.latest.id : null,
    );
    setActiveView("examTake");
  }

  function handleOpenExamResult(result: StudentExamResult) {
    setSelectedExamId(result.examId);
    setSelectedExamAttemptId(result.attemptId ?? null);
    setActiveView("examReview");
  }

  function handleExamSubmitted(examId: number, attemptId: number) {
    setSelectedExamId(examId);
    setSelectedExamAttemptId(attemptId);
    setActiveView("examReview");
  }

  async function handleLogout() {
    await logout();
    navigate("/student/login", { replace: true });
  }

  function handleOpenAccountDrawer() {
    setIsAccountDrawerOpen(true);
  }

  function handleOpenAccountView(
    view: "accountProfile" | "accountCertificates" | "accountPaymentHistory",
  ) {
    setActiveView(view);
  }

  function handleProfileSaved(
    profile: StudentAccountProfileData["profile"],
    sessionUser: typeof user,
  ) {
    setProfileData((currentData) =>
      currentData
        ? {
            ...currentData,
            profile,
          }
        : currentData,
    );

    setCertificatesData((currentData) =>
      currentData
        ? {
            ...currentData,
            profile,
          }
        : currentData,
    );

    setPaymentHistoryData((currentData) =>
      currentData
        ? {
            ...currentData,
            profile,
          }
        : currentData,
    );

    if (sessionUser) {
      updateUser(sessionUser);
    }
  }

  return (
    <div className="student-portal">
      <StudentHeader
        activeView={activeView}
        onNavigate={setActiveView}
        onOpenNotification={handleOpenNotification}
        onOpenAccountDrawer={handleOpenAccountDrawer}
        user={user}
      />

      <AccountDrawer
        activeView={activeView}
        isOpen={isAccountDrawerOpen}
        onClose={() => setIsAccountDrawerOpen(false)}
        onLogout={() => void handleLogout()}
        onNavigate={handleOpenAccountView}
        profileData={profileData}
        user={user}
      />

      {activeView === "home" ? <HomePage onNavigate={setActiveView} /> : null}
      {activeView === "courses" ? (
        <CoursesPage onOpenCourse={handleOpenCourse} />
      ) : null}
      {activeView === "myCourses" ? (
        <MyCoursesPage
          onReviewCourse={handleOpenCourse}
          onStartLearning={handleStartLearning}
        />
      ) : null}
      {activeView === "categories" ? (
        <CategoriesPage onOpenCourse={handleOpenCourse} />
      ) : null}
      {activeView === "courseDetail" && selectedCourseId ? (
        <CourseDetailPage
          courseId={selectedCourseId}
          focusedReviewId={focusedReviewId}
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
      {activeView === "exam" ? (
        <ExamPage onOpenExam={handleOpenExam} onOpenResult={handleOpenExamResult} />
      ) : null}
      {activeView === "examTake" && selectedExamId ? (
        <ExamTakingPage
          attemptId={selectedExamAttemptId}
          examId={selectedExamId}
          onBack={() => setActiveView("exam")}
          onSubmitted={handleExamSubmitted}
        />
      ) : null}
      {activeView === "examReview" && selectedExamId ? (
        <ExamReviewPage
          attemptId={selectedExamAttemptId}
          examId={selectedExamId}
          onBack={() => setActiveView("exam")}
        />
      ) : null}
      {activeView === "accountProfile" ? (
        <AccountProfilePage
          error={profileError}
          isLoading={profileLoading}
          onProfileSaved={handleProfileSaved}
          profileData={profileData}
        />
      ) : null}
      {activeView === "accountCertificates" ? (
        <AccountCertificatesPage
          certificatesData={certificatesData}
          error={certificatesError}
          isLoading={certificatesLoading}
        />
      ) : null}
      {activeView === "accountPaymentHistory" ? (
        <AccountPaymentHistoryPage
          error={paymentHistoryError}
          isLoading={paymentHistoryLoading}
          paymentHistoryData={paymentHistoryData}
        />
      ) : null}
      {activeView === "interaction" ? (
        <InteractionPage onReviewCourse={handleOpenCourse} />
      ) : null}
      <Footer />
    </div>
  );
}

export default StudentPortalPage;
