import { useEffect, useState } from "react";
import InstructorLayout from "../components/InstructorLayout";
import {
  gradingQueue,
  instructorQuizzes,
  quizManagementStats,
  quizQuestionBank,
} from "../data/instructorMockData";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const DEFAULT_TEACHER_ID = 4;

type QuizStat = (typeof quizManagementStats)[number];
type InstructorQuiz = (typeof instructorQuizzes)[number];
type QuestionBankItem = (typeof quizQuestionBank)[number];
type GradingItem = (typeof gradingQueue)[number];

type InstructorQuizzesApiResponse = {
  success: boolean;
  data: {
    quizManagementStats: QuizStat[];
    instructorQuizzes: InstructorQuiz[];
    quizQuestionBank: QuestionBankItem[];
    gradingQueue: GradingItem[];
  };
};

type QuizFilter = "all" | "published" | "draft";

function getQuizStatusClass(status: string) {
  return status === "Ban nhap" || status === "Bản nháp" ? "review" : "excellent";
}

function getQuizFilterStatus(status: string) {
  if (status === "Bản nháp" || status === "Ban nhap" || status === "Báº£n nhÃ¡p") {
    return "draft";
  }

  return "published";
}

function InstructorQuizTestsPage() {
  const [pageData, setPageData] =
    useState<InstructorQuizzesApiResponse["data"] | null>(null);
  const [quizFilter, setQuizFilter] = useState<QuizFilter>("all");

  useEffect(() => {
    const controller = new AbortController();

    async function loadQuizzes() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/instructor/quizzes?teacherId=${DEFAULT_TEACHER_ID}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

        const payload = (await response.json()) as InstructorQuizzesApiResponse;
        if (!payload.success) throw new Error("Quizzes API returned unsuccessful response.");

        setPageData(payload.data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error(error);
      }
    }

    loadQuizzes();
    return () => controller.abort();
  }, []);

  const displayedStats = pageData?.quizManagementStats ?? quizManagementStats;
  const displayedQuizzes = pageData?.instructorQuizzes ?? instructorQuizzes;
  const filteredQuizzes = displayedQuizzes.filter((quiz) => {
    if (quizFilter === "all") return true;
    return getQuizFilterStatus(quiz.status) === quizFilter;
  });
  const displayedQuestionBank = pageData?.quizQuestionBank ?? quizQuestionBank;
  const displayedGradingQueue = pageData?.gradingQueue ?? gradingQueue;

  return (
    <InstructorLayout activePage="quizzes">
      <section className="instructor-hero instructor-quiz-hero">
        <div>
          <p className="instructor-eyebrow">Bài kiểm tra</p>
          <h2>Thiết kế đánh giá rõ ràng</h2>
          <p>
            Tạo bài kiểm tra, quản lý ngân hàng câu hỏi, theo dõi tỷ lệ đạt và
            kiểm soát bài cần chấm trước khi ảnh hưởng đến tiến độ học viên.
          </p>
        </div>
        <div className="instructor-hero-actions">
          <button className="instructor-secondary-button" type="button">
            <span className="material-symbols-outlined">library_add</span>
            Thêm câu hỏi
          </button>
          <button className="instructor-primary-button" type="button">
            <span className="material-symbols-outlined">add</span>
            Bài kiểm tra mới
          </button>
        </div>
      </section>

      <section className="instructor-stat-grid" aria-label="Tổng quan bài kiểm tra">
        {displayedStats.map((stat) => (
          <article className="instructor-stat-card" key={stat.label}>
            <div className={`instructor-stat-icon ${stat.tone}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <p>{stat.label}</p>
            <div>
              <strong>{stat.value}</strong>
              <span>{pageData ? "Dữ liệu từ backend" : "Không gian đánh giá"}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="instructor-quiz-grid">
        <article className="instructor-panel instructor-quiz-list-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Đánh giá</p>
              <h3>Bài kiểm tra đang dùng</h3>
            </div>
            <div className="instructor-filter-tabs" aria-label="Bộ lọc bài kiểm tra">
              <button
                className={quizFilter === "all" ? "active" : ""}
                onClick={() => setQuizFilter("all")}
                type="button"
              >
                Tất cả
              </button>
              <button
                className={quizFilter === "published" ? "active" : ""}
                onClick={() => setQuizFilter("published")}
                type="button"
              >
                Đã xuất bản
              </button>
              <button
                className={quizFilter === "draft" ? "active" : ""}
                onClick={() => setQuizFilter("draft")}
                type="button"
              >
                Bản nháp
              </button>
            </div>
          </div>

          <div className="instructor-quiz-list">
            {filteredQuizzes.length === 0 ? (
              <p className="instructor-empty-state">Không có bài kiểm tra phù hợp với bộ lọc này.</p>
            ) : filteredQuizzes.map((quiz) => (
              <article className="instructor-quiz-card" key={quiz.title}>
                <div className="instructor-quiz-main">
                  <span className="material-symbols-outlined">quiz</span>
                  <div>
                    <h4>{quiz.title}</h4>
                    <p>{quiz.course} · {quiz.batch}</p>
                  </div>
                </div>
                <div className="instructor-quiz-metrics">
                  <span>{quiz.questions} câu hỏi</span>
                  <span>{quiz.duration}</span>
                  <span>{quiz.attempts} lượt làm</span>
                </div>
                <div className="instructor-table-progress">
                  <div className="instructor-progress-track">
                    <span style={{ width: `${quiz.passRate}%` }} />
                  </div>
                  <b>{quiz.passRate}% đạt yêu cầu</b>
                </div>
                <em className={`instructor-status-pill ${getQuizStatusClass(quiz.status)}`}>
                  {quiz.status}
                </em>
              </article>
            ))}
          </div>
        </article>

        <aside className="instructor-panel instructor-grading-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Chấm thủ công</p>
              <h3>Hàng đợi chấm bài</h3>
            </div>
            <span className="material-symbols-outlined">rate_review</span>
          </div>
          <div className="instructor-grading-list">
            {displayedGradingQueue.map((item) => (
              <article className="instructor-grading-card" key={`${item.student}-${item.quiz}`}>
                <div>
                  <h4>{item.student}</h4>
                  <span>{item.score}</span>
                </div>
                <p>{item.quiz}</p>
                <small>{item.submitted}</small>
                <button type="button">Mở bài nộp</button>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="instructor-panel instructor-question-bank-panel">
        <div className="instructor-panel-header">
          <div>
            <p className="instructor-eyebrow">Ngân hàng câu hỏi</p>
            <h3>Bộ câu hỏi tái sử dụng</h3>
          </div>
          <button className="instructor-ghost-button" type="button">Quản lý ngân hàng</button>
        </div>
        <div className="instructor-question-grid">
          {displayedQuestionBank.map((bank) => (
            <article className="instructor-question-card" key={`${bank.topic}-${bank.type}`}>
              <span className="material-symbols-outlined">psychology_alt</span>
              <div>
                <h4>{bank.topic}</h4>
                <p>{bank.type}</p>
              </div>
              <strong>{bank.count}</strong>
              <em>{bank.difficulty}</em>
            </article>
          ))}
        </div>
      </section>
    </InstructorLayout>
  );
}

export default InstructorQuizTestsPage;
