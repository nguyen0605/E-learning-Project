import InstructorLayout from "../components/InstructorLayout";
import {
  courseBatches,
  courseManagementStats,
  instructorCourses,
  lessonPlanner,
} from "../data/instructorMockData";

function InstructorCourseManagementPage() {
  return (
    <InstructorLayout activePage="courses">
      <section className="instructor-hero instructor-course-hero">
        <div>
          <p className="instructor-eyebrow">Quản lý khóa học</p>
          <h2>Tổ chức danh mục giảng dạy</h2>
          <p>
            Quản lý khóa học, lớp mở, chương học và bài học nháp trong một
            không gian thống nhất trước khi xuất bản cho học viên.
          </p>
        </div>
        <div className="instructor-hero-actions">
          <button className="instructor-secondary-button" type="button">
            <span className="material-symbols-outlined">upload_file</span>
            Nhập bài học
          </button>
          <button className="instructor-primary-button" type="button">
            <span className="material-symbols-outlined">add</span>
            Khóa học mới
          </button>
        </div>
      </section>

      <section className="instructor-stat-grid" aria-label="Tổng quan khóa học">
        {courseManagementStats.map((stat) => (
          <article className="instructor-stat-card" key={stat.label}>
            <div className={`instructor-stat-icon ${stat.tone}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <p>{stat.label}</p>
            <div>
              <strong>{stat.value}</strong>
              <span>Không gian hiện tại</span>
            </div>
          </article>
        ))}
      </section>

      <section className="instructor-panel instructor-course-workbench">
        <div className="instructor-panel-header">
          <div>
            <p className="instructor-eyebrow">Danh mục</p>
            <h3>Khóa học giảng dạy</h3>
          </div>
          <div className="instructor-filter-tabs" aria-label="Bộ lọc khóa học">
            <button className="active" type="button">
              Tất cả
            </button>
            <button type="button">Đã xuất bản</button>
            <button type="button">Bản nháp</button>
            <button type="button">Chờ duyệt</button>
          </div>
        </div>

        <div className="instructor-course-card-grid">
          {instructorCourses.map((course) => (
            <article className="instructor-management-card" key={course.title}>
              <img alt="" src={course.thumbnail} />
              <div className="instructor-management-card-body">
                <div className="instructor-card-kicker">
                  <span>{course.category}</span>
                  <em>{course.status}</em>
                </div>
                <h4>{course.title}</h4>
                <p>Khóa học cấp độ {course.level.toLowerCase()} với lộ trình rõ ràng.</p>

                <div className="instructor-course-metrics">
                  <span>{course.students} học viên</span>
                  <span>{course.modules} chương</span>
                  <span>{course.lessons} bài học</span>
                </div>

                <div className="instructor-progress-track">
                  <span style={{ width: `${course.completion}%` }} />
                </div>

                <div className="instructor-card-footer">
                  <strong>{course.completion}% hoàn thành</strong>
                  <button type="button">Quản lý</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="instructor-course-management-grid">
        <article className="instructor-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Lớp học</p>
              <h3>Các lớp đang mở</h3>
            </div>
            <span className="material-symbols-outlined">event</span>
          </div>

          <div className="instructor-batch-list">
            {courseBatches.map((batch) => (
              <div className="instructor-batch-item" key={batch.code}>
                <div>
                  <strong>{batch.code}</strong>
                  <h4>{batch.course}</h4>
                  <p>{batch.dates}</p>
                </div>
                <span>{batch.students}</span>
                <em>{batch.mode}</em>
                <b>{batch.status}</b>
              </div>
            ))}
          </div>
        </article>

        <article className="instructor-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Xây dựng bài học</p>
              <h3>Kế hoạch chương học</h3>
            </div>
            <span className="material-symbols-outlined">view_list</span>
          </div>

          <div className="instructor-module-list">
            {lessonPlanner.map((module) => (
              <div className="instructor-module-item" key={module.title}>
                <div className="instructor-module-index">{module.module}</div>
                <div>
                  <h4>{module.title}</h4>
                  <p>
                    {module.lessons} bài học · {module.duration}
                  </p>
                </div>
                <span>{module.state}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </InstructorLayout>
  );
}

export default InstructorCourseManagementPage;
