import InstructorLayout from "../components/InstructorLayout";
import {
  cohortFilters,
  instructorStudents,
  studentAttentionQueue,
  studentManagementStats,
} from "../data/instructorMockData";

function getStatusClass(status: string) {
  if (status === "Có rủi ro") return "risk";
  if (status === "Cần xem xét") return "review";
  if (status === "Xuất sắc") return "excellent";

  return "track";
}

function InstructorStudentsPage() {
  return (
    <InstructorLayout activePage="students">
      <section className="instructor-hero instructor-students-hero">
        <div>
          <p className="instructor-eyebrow">Quản lý học viên</p>
          <h2>Theo sát từng học viên</h2>
          <p>
            Theo dõi tiến độ, chuyên cần, lớp học và các tín hiệu cần hỗ trợ
            trước khi vấn đề nhỏ ảnh hưởng đến kết quả học tập.
          </p>
        </div>
        <div className="instructor-hero-actions">
          <button className="instructor-secondary-button" type="button">
            <span className="material-symbols-outlined">download</span>
            Xuất danh sách
          </button>
          <button className="instructor-primary-button" type="button">
            <span className="material-symbols-outlined">chat</span>
            Nhắn tin cho lớp
          </button>
        </div>
      </section>

      <section className="instructor-stat-grid" aria-label="Tổng quan học viên">
        {studentManagementStats.map((stat) => (
          <article className="instructor-stat-card" key={stat.label}>
            <div className={`instructor-stat-icon ${stat.tone}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <p>{stat.label}</p>
            <div>
              <strong>{stat.value}</strong>
              <span>Trong các lớp đang học</span>
            </div>
          </article>
        ))}
      </section>

      <section className="instructor-students-grid">
        <article className="instructor-panel instructor-students-table-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Danh sách</p>
              <h3>Học viên đang học</h3>
            </div>
            <div className="instructor-filter-tabs" aria-label="Bộ lọc lớp học">
              {cohortFilters.map((filter, index) => (
                <button
                  className={index === 0 ? "active" : ""}
                  key={filter}
                  type="button"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="instructor-student-table">
            <div className="instructor-student-table-head">
              <span>Học viên</span>
              <span>Khóa học</span>
              <span>Tiến độ</span>
              <span>Chuyên cần</span>
              <span>Trạng thái</span>
            </div>

            {instructorStudents.map((student) => (
              <div className="instructor-student-table-row" key={student.email}>
                <div className="instructor-student-person">
                  <div className="instructor-student-avatar">
                    {student.name
                      .split(" ")
                      .slice(-2)
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div>
                    <h4>{student.name}</h4>
                    <p>{student.email}</p>
                  </div>
                </div>

                <div>
                  <strong>{student.course}</strong>
                  <p>{student.batch}</p>
                </div>

                <div className="instructor-table-progress">
                  <div className="instructor-progress-track">
                    <span style={{ width: `${student.progress}%` }} />
                  </div>
                  <b>{student.progress}%</b>
                </div>

                <div className="instructor-attendance-cell">
                  <strong>{student.attendance}%</strong>
                  <p>{student.lastActive}</p>
                </div>

                <span
                  className={`instructor-status-pill ${getStatusClass(
                    student.status,
                  )}`}
                >
                  {student.status}
                </span>
              </div>
            ))}
          </div>
        </article>

        <aside className="instructor-panel instructor-attention-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Can thiệp</p>
              <h3>Cần hỗ trợ</h3>
            </div>
            <span className="material-symbols-outlined">support_agent</span>
          </div>

          <div className="instructor-attention-list">
            {studentAttentionQueue.map((item) => (
              <article className="instructor-attention-card" key={item.name}>
                <div>
                  <h4>{item.name}</h4>
                  <span>{item.priority}</span>
                </div>
                <p>{item.reason}</p>
                <button type="button">{item.action}</button>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </InstructorLayout>
  );
}

export default InstructorStudentsPage;
