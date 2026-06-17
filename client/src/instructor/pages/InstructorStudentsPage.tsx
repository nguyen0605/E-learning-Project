import { useEffect, useState } from "react";
import InstructorLayout from "../components/InstructorLayout";
import {
  cohortFilters,
  instructorStudents,
  studentAttentionQueue,
  studentManagementStats,
} from "../data/instructorMockData";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const DEFAULT_TEACHER_ID = 4;

type StudentManagementStat = (typeof studentManagementStats)[number];
type InstructorStudent = (typeof instructorStudents)[number];
type StudentAttentionItem = (typeof studentAttentionQueue)[number];

type InstructorStudentsApiResponse = {
  success: boolean;
  data: {
    studentManagementStats: StudentManagementStat[];
    cohortFilters: string[];
    instructorStudents: InstructorStudent[];
    studentAttentionQueue: StudentAttentionItem[];
  };
};

function getStatusClass(status: string) {
  if (status === "Co rui ro" || status === "Có rủi ro") return "risk";
  if (status === "Can xem xet" || status === "Cần xem xét") return "review";
  if (status === "Xuat sac" || status === "Xuất sắc") return "excellent";
  return "track";
}

function InstructorStudentsPage() {
  const [pageData, setPageData] =
    useState<InstructorStudentsApiResponse["data"] | null>(null);
  const [selectedCohort, setSelectedCohort] = useState("Tất cả lớp");

  useEffect(() => {
    const controller = new AbortController();

    async function loadStudents() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/instructor/students?teacherId=${DEFAULT_TEACHER_ID}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

        const payload = (await response.json()) as InstructorStudentsApiResponse;
        if (!payload.success) throw new Error("Students API returned unsuccessful response.");

        setPageData(payload.data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error(error);
      }
    }

    loadStudents();
    return () => controller.abort();
  }, []);

  const displayedStats = pageData?.studentManagementStats ?? studentManagementStats;
  const displayedFilters = pageData?.cohortFilters ?? cohortFilters;
  const displayedStudents = pageData?.instructorStudents ?? instructorStudents;
  const filteredStudents = displayedStudents.filter((student) => {
    if (selectedCohort === "Tất cả lớp" || selectedCohort === "Táº¥t cáº£ lá»›p") {
      return true;
    }

    return student.batch === selectedCohort;
  });
  const displayedAttentionQueue = pageData?.studentAttentionQueue ?? studentAttentionQueue;

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
        {displayedStats.map((stat) => (
          <article className="instructor-stat-card" key={stat.label}>
            <div className={`instructor-stat-icon ${stat.tone}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <p>{stat.label}</p>
            <div>
              <strong>{stat.value}</strong>
              <span>{pageData ? "Dữ liệu từ backend" : "Trong các lớp đang học"}</span>
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
            <div
              className="instructor-filter-tabs instructor-cohort-tabs"
              aria-label="Bộ lọc lớp học"
            >
              {displayedFilters.map((filter, index) => (
                <button
                  className={
                    selectedCohort === filter ||
                    (index === 0 && selectedCohort === "Tất cả lớp")
                      ? "active"
                      : ""
                  }
                  key={filter}
                  onClick={() => setSelectedCohort(index === 0 ? "Tất cả lớp" : filter)}
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

            {filteredStudents.length === 0 ? (
              <p className="instructor-empty-state">Không có học viên trong lớp này.</p>
            ) : filteredStudents.map((student) => (
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

                <span className={`instructor-status-pill ${getStatusClass(student.status)}`}>
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
            {displayedAttentionQueue.map((item) => (
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
