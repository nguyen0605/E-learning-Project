import InstructorLayout from "../components/InstructorLayout";
import {
  analyticsBars,
  coursePerformance,
  dashboardStats,
  studentSignals,
  teachingSchedule,
} from "../data/instructorMockData";

function InstructorDashboardPage() {
  return (
    <InstructorLayout activePage="dashboard">
      <section className="instructor-hero">
        <div>
          <p className="instructor-eyebrow">Không gian giảng viên</p>
          <h2>Chào mừng thầy Minh Anh</h2>
          <p>
            Theo dõi lịch dạy, tiến độ học viên, hiệu suất khóa học và các bài
            cần xử lý trong một không gian quản lý rõ ràng.
          </p>
        </div>
        <button className="instructor-primary-button" type="button">
          <span className="material-symbols-outlined">auto_stories</span>
          Chuẩn bị bài học hôm nay
        </button>
      </section>

      <section className="instructor-stat-grid" aria-label="Tổng quan giảng viên">
        {dashboardStats.map((stat) => (
          <article className="instructor-stat-card" key={stat.label}>
            <div className={`instructor-stat-icon ${stat.tone}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <p>{stat.label}</p>
            <div>
              <strong>{stat.value}</strong>
              <span>{stat.change}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="instructor-dashboard-grid">
        <article className="instructor-panel instructor-schedule-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Hôm nay</p>
              <h3>Lịch giảng dạy</h3>
            </div>
            <span className="material-symbols-outlined">calendar_month</span>
          </div>

          <div className="instructor-schedule-list">
            {teachingSchedule.map((item) => (
              <div className="instructor-schedule-item" key={item.title}>
                <time>{item.time}</time>
                <div>
                  <h4>{item.title}</h4>
                  <p>
                    {item.batch} · {item.mode}
                  </p>
                </div>
                <span>{item.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="instructor-panel instructor-analytics-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Tương tác</p>
              <h3>Hoạt động trong tuần</h3>
            </div>
            <strong>+14%</strong>
          </div>

          <div className="instructor-bar-chart">
            {analyticsBars.map((bar) => (
              <div className="instructor-bar-column" key={bar.label}>
                <span style={{ height: `${bar.value}%` }} />
                <p>{bar.label}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="instructor-content-grid">
        <article className="instructor-panel instructor-course-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Khóa học</p>
              <h3>Tổng quan hiệu suất</h3>
            </div>
            <button className="instructor-ghost-button" type="button">
              Xem tất cả
            </button>
          </div>

          <div className="instructor-course-list">
            {coursePerformance.map((course) => (
              <div className="instructor-course-row" key={course.title}>
                <div>
                  <h4>{course.title}</h4>
                  <p>{course.category}</p>
                </div>
                <div className="instructor-course-meta">
                  <span>{course.students} học viên</span>
                  <span>{course.rating} đánh giá</span>
                  <span>{course.revenue}</span>
                </div>
                <div className="instructor-progress-track">
                  <span style={{ width: `${course.completion}%` }} />
                </div>
                <strong>{course.completion}%</strong>
                <em>{course.status}</em>
              </div>
            ))}
          </div>
        </article>

        <article className="instructor-panel instructor-student-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Tín hiệu học viên</p>
              <h3>Cần theo dõi</h3>
            </div>
            <span className="material-symbols-outlined">school</span>
          </div>

          <div className="instructor-student-list">
            {studentSignals.map((student) => (
              <div className="instructor-student-item" key={student.name}>
                <div className="instructor-student-avatar">
                  {student.name
                    .split(" ")
                    .slice(-2)
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div>
                  <h4>{student.name}</h4>
                  <p>{student.course}</p>
                  <span>{student.note}</span>
                </div>
                <strong>{student.progress}%</strong>
              </div>
            ))}
          </div>
        </article>
      </section>
    </InstructorLayout>
  );
}

export default InstructorDashboardPage;
