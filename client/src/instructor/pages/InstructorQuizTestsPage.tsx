import InstructorLayout from "../components/InstructorLayout";
import {
  gradingQueue,
  instructorQuizzes,
  quizManagementStats,
  quizQuestionBank,
} from "../data/instructorMockData";

function getQuizStatusClass(status: string) {
  return status === "Bản nháp" ? "review" : "excellent";
}

function InstructorQuizTestsPage() {
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
        {quizManagementStats.map((stat) => (
          <article className="instructor-stat-card" key={stat.label}>
            <div className={`instructor-stat-icon ${stat.tone}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <p>{stat.label}</p>
            <div>
              <strong>{stat.value}</strong>
              <span>Không gian đánh giá</span>
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
              <button className="active" type="button">
                Tất cả
              </button>
              <button type="button">Đã xuất bản</button>
              <button type="button">Bản nháp</button>
            </div>
          </div>

          <div className="instructor-quiz-list">
            {instructorQuizzes.map((quiz) => (
              <article className="instructor-quiz-card" key={quiz.title}>
                <div className="instructor-quiz-main">
                  <span className="material-symbols-outlined">quiz</span>
                  <div>
                    <h4>{quiz.title}</h4>
                    <p>
                      {quiz.course} · {quiz.batch}
                    </p>
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
            {gradingQueue.map((item) => (
              <article className="instructor-grading-card" key={item.student}>
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
          <button className="instructor-ghost-button" type="button">
            Quản lý ngân hàng
          </button>
        </div>

        <div className="instructor-question-grid">
          {quizQuestionBank.map((bank) => (
            <article className="instructor-question-card" key={bank.topic}>
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
