import { useEffect, useState } from "react";
import "../../index.css";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type AdminPage =
  | "dashboard"
  | "students"
  | "courses"
  | "system"
  | "content";

type StudentManagementPageProps = {
  activePage: AdminPage;
  onNavigate: (page: AdminPage) => void;
};

const navItems = [
  { key: "dashboard" as const, label: "Tổng quan", icon: "dashboard" },
  { key: "students" as const, label: "Quản lý học viên", icon: "group" },
  { key: "courses" as const, label: "Quản lý khóa học", icon: "library_books" },
  { key: "system" as const, label: "Cấu hình hệ thống", icon: "settings" },
  { key: "content" as const, label: "Nội dung chung", icon: "description" },
];

const studentStats = [
  {
    title: "Tổng học viên",
    value: "42,894",
    trend: "+4.2%",
    tone: "blue",
    icon: "groups",
  },
  {
    title: "Học viên đang hoạt động",
    value: "38,210",
    trend: "Ổn định",
    tone: "amber",
    icon: "person_play",
  },
  {
    title: "Đăng ký mới",
    value: "+1,200 / tháng",
    trend: "",
    tone: "primary-strong",
    icon: "person_add",
  },
  {
    title: "Tiến độ trung bình",
    value: "76%",
    trend: "+2%",
    tone: "slate",
    icon: "trending_up",
  },
];

const students = [
  {
    name: "Julian Thorne",
    email: "j.thorne@academy.edu",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
    courses: ["UI", "BS", "WD"],
    progress: 88,
    status: "active",
  },
  {
    name: "Eleanor Vance",
    email: "e.vance@academy.edu",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
    courses: ["AH", "CW"],
    progress: 42,
    status: "active",
    selected: true,
  },
  {
    name: "Marcus Holloway",
    email: "m.holloway@academy.edu",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
    courses: ["PY"],
    progress: 12,
    status: "suspended",
  },
  {
    name: "Sasha Kross",
    email: "s.kross@academy.edu",
    avatar:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=240&q=80",
    courses: ["DM", "DE"],
    progress: 0,
    status: "inactive",
  },
];

const detailCourses = [
  { title: "Lịch sử nghệ thuật và phê bình", progress: 64 },
  { title: "Viết sáng tạo và kể chuyện", progress: 21 },
];

const detailActivities = [
  {
    title: "Hoàn thành chương 4: Thời kỳ Gothic",
    time: "Hôm nay, 14:45",
    icon: "task",
    tone: "primary",
  },
  {
    title: "Đăng bài trong thảo luận Lý thuyết nghệ thuật",
    time: "Hôm qua, 09:12",
    icon: "forum",
    tone: "amber",
  },
  {
    title: "Đăng nhập vào hệ thống",
    time: "24/10/2023 lúc 23:30",
    icon: "login",
    tone: "slate",
  },
];

type StudentApiCourse = {
  id: number;
  title: string;
  shortLabel: string;
};

type StudentApiRow = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  courses: StudentApiCourse[];
  progressPercentage: number;
  status: string;
  selected?: boolean;
};

type StudentDetailApi = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  enrolledCourses: Array<{
    id: number;
    title: string;
    progressPercentage: number;
  }>;
  recentActivity: Array<{
    type: string;
    title: string;
    activityTime: string;
  }>;
};

type StudentsApiResponse = {
  success: boolean;
  data: {
    summary: {
      totalStudents: { value: number; trend: string };
      activeStudents: { value: number; trend: string };
      newRegistrations: { value: number; trend: string };
      averageProgress: { value: number; trend: string };
    };
    students: StudentApiRow[];
    selectedStudent: StudentDetailApi | null;
    pagination: { total: number };
  };
};

function getStatusMeta(status: string) {
  if (status === "active") {
    return { label: "Đang học", tone: "active" };
  }

  if (status === "suspended") {
    return { label: "Tạm khóa", tone: "suspended" };
  }

  return { label: "Không hoạt động", tone: "inactive" };
}

function getCourseTone(index: number) {
  const tones = ["blue", "purple", "emerald", "amber", "rose", "cyan", "indigo"];
  return tones[index % tones.length];
}

function StudentManagementPage({
  activePage,
  onNavigate,
}: StudentManagementPageProps) {
  const [pageData, setPageData] = useState<StudentsApiResponse["data"] | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadStudents() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/students`);
        if (!response.ok) throw new Error(`Failed with ${response.status}`);

        const result = (await response.json()) as StudentsApiResponse;
        if (!ignore) setPageData(result.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadStudents();

    return () => {
      ignore = true;
    };
  }, []);

  const displayedStats = pageData
    ? [
        {
          ...studentStats[0],
          value: String(pageData.summary.totalStudents.value),
          trend: pageData.summary.totalStudents.trend,
        },
        {
          ...studentStats[1],
          value: String(pageData.summary.activeStudents.value),
          trend: pageData.summary.activeStudents.trend,
        },
        {
          ...studentStats[2],
          value: pageData.summary.newRegistrations.trend,
        },
        {
          ...studentStats[3],
          value: `${pageData.summary.averageProgress.value}%`,
          trend: pageData.summary.averageProgress.trend,
        },
      ]
    : studentStats;
  const displayedStudents =
    pageData?.students.map((student) => ({
      ...student,
      avatar:
        student.avatar ||
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
    })) ??
    students.map((student, index) => ({
      id: index,
      name: student.name,
      email: student.email,
      avatar: student.avatar,
      courses: student.courses.map((course) => ({
        id: index,
        title: course,
        shortLabel: course,
      })),
      progressPercentage: student.progress,
      status: student.status,
      selected: student.selected,
    }));
  const selectedStudent = pageData?.selectedStudent;

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <p className="brand-title">LTHDV E-Learning</p>
          <p className="brand-subtitle">Trang quản trị</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isCurrent = item.key === activePage;

            return (
              <button
                key={item.label}
                className={`nav-item${isCurrent ? " active" : ""}`}
                type="button"
                onClick={() => {
                  if (
                    item.key === "dashboard" ||
                    item.key === "students" ||
                    item.key === "courses" ||
                    item.key === "system" ||
                    item.key === "content"
                  ) {
                    onNavigate(item.key);
                  }
                }}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="pro-card">
          <p className="pro-label">Quản trị thông minh</p>
          <p className="pro-copy">Theo dõi tiến độ và quản lý học viên trên toàn hệ thống.</p>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <label className="searchbar" aria-label="Tìm kiếm">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Tìm học viên, hồ sơ hoặc nhật ký..."
            />
          </label>

          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="Thông báo">
              <span className="material-symbols-outlined">notifications</span>
              <span className="notification-dot" />
            </button>

            <div className="profile-chip">
              <div>
                <p className="profile-name">Scholar Admin</p>
                <p className="profile-role">Quản trị cấp cao</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80"
                alt="Quản trị viên"
              />
            </div>
          </div>
        </header>

        <section className="content student-page">
          <div className="hero">
            <p className="eyebrow">Quản trị học viên</p>
            <h1>Danh sách học viên</h1>
            <p className="hero-copy">
              Theo dõi tiến độ học tập, kiểm soát ghi danh và quản lý mức độ
              tương tác của người học trên toàn bộ hệ thống.
            </p>
          </div>

          <section className="stats-grid student-stats-grid">
            {displayedStats.map((stat) => (
              <article key={stat.title} className="panel stat-card student-stat-card">
                <div className="stat-top">
                  <div className={`icon-tile ${stat.tone}`}>
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  {stat.trend ? <span className="student-trend">{stat.trend}</span> : null}
                </div>
                <p className="stat-title">{stat.title}</p>
                <h2 className="stat-value">{stat.value}</h2>
              </article>
            ))}
          </section>

          <section className="student-toolbar">
            <div className="student-toolbar-left">
              <div className="student-segments">
                <button className="active" type="button">
                  Tất cả học viên
                </button>
                <button type="button">Học bổng</button>
                <button type="button">Cựu học viên</button>
              </div>

              <div className="student-toolbar-divider" />

              <button className="student-filter-button" type="button">
                <span className="material-symbols-outlined">filter_list</span>
                Bộ lọc nâng cao
              </button>
            </div>

            <button className="student-export-button" type="button">
              Xuất danh sách
            </button>
          </section>

          <section className="student-layout">
            <div className="panel student-table-panel">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Hồ sơ học viên</th>
                    <th>Khóa học</th>
                    <th>Tiến độ</th>
                    <th>Trạng thái</th>
                    <th className="right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedStudents.map((student) => {
                    const statusMeta = getStatusMeta(student.status);

                    return (
                      <tr
                        key={student.email}
                        className={student.selected ? "selected" : ""}
                      >
                        <td>
                          <div className="student-profile">
                            <img src={student.avatar} alt={student.name} />
                            <div>
                              <p className="student-name">{student.name}</p>
                              <p className="student-email">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="student-course-badges">
                            {student.courses.map((course, index) => (
                              <span
                                key={`${student.email}-${course.id}-${index}`}
                                className={`student-course-badge ${getCourseTone(index)}`}
                              >
                                {course.shortLabel}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="student-progress">
                            <div className="student-progress-meta">
                              <span>{student.progressPercentage}% hoàn thành</span>
                            </div>
                            <div className="student-progress-track">
                              <div
                                className="student-progress-fill"
                                style={{ width: `${student.progressPercentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`student-status ${statusMeta.tone}`}>
                            <span className="dot" />
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="right">
                          <div className="student-actions">
                            <button type="button" title="Xem chi tiết">
                              <span className="material-symbols-outlined">
                                visibility
                              </span>
                            </button>
                            <button type="button" title="Chỉnh sửa">
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button type="button" title="Khóa">
                              <span className="material-symbols-outlined">block</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="student-table-footer">
                <p>Hiển thị 1-10 trong tổng số {pageData?.pagination.total ?? "42,894"} học viên</p>
                <div className="student-pagination">
                  <button type="button">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button type="button">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            <aside className="panel student-drawer">
              <div className="student-drawer-header">
                <div className="student-drawer-profile">
                  <img
                    src={
                      selectedStudent?.avatar ||
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80"
                    }
                    alt={selectedStudent?.name ?? "Eleanor Vance"}
                  />
                  <div>
                    <h3>{selectedStudent?.name ?? "Eleanor Vance"}</h3>
                    <p>{selectedStudent?.email ?? "Chuyên viên nghiên cứu UI/UX"}</p>
                    <span>Học viên đã xác minh</span>
                  </div>
                </div>

                <button type="button" className="student-drawer-close">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="student-drawer-tabs">
                <button className="active" type="button">
                  Tổng quan
                </button>
                <button type="button">Lộ trình</button>
                <button type="button">Nhật ký</button>
              </div>

              <div className="student-drawer-body">
                <section>
                  <h4>Thông tin định danh</h4>
                  <div className="student-info-grid">
                    <div className="student-info-card">
                      <p>Email cá nhân</p>
                      <strong>{selectedStudent?.email ?? "e.vance@academy.edu"}</strong>
                    </div>
                    <div className="student-info-card">
                      <p>Ngày ghi danh</p>
                      <strong>12/03/2023</strong>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="student-section-header">
                    <h4>Lộ trình đang học</h4>
                    <span>Báo cáo đầy đủ</span>
                  </div>

                  <div className="student-course-progress-list">
                    {(selectedStudent?.enrolledCourses ?? detailCourses).map((course) => (
                      <div key={course.title} className="student-course-progress-card">
                        <div className="student-course-progress-head">
                          <p>{course.title}</p>
                          <span>{"progressPercentage" in course ? course.progressPercentage : course.progress}%</span>
                        </div>
                        <div className="student-progress-track">
                          <div
                            className="student-progress-fill"
                            style={{
                              width: `${"progressPercentage" in course ? course.progressPercentage : course.progress}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h4>Hoạt động gần đây</h4>
                  <div className="student-activity-list">
                    {(selectedStudent?.recentActivity ?? detailActivities).map((activity) => (
                      <div key={activity.title} className="student-activity-item">
                        <span className={`student-activity-icon ${"tone" in activity ? activity.tone : "primary"}`}>
                          <span className="material-symbols-outlined">
                            {"icon" in activity ? activity.icon : "task"}
                          </span>
                        </span>
                        <div>
                          <p>{activity.title}</p>
                          <small>{"time" in activity ? activity.time : new Date(activity.activityTime).toLocaleString("vi-VN")}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="student-drawer-footer">
                <button type="button" className="student-secondary-button">
                  Tạm khóa truy cập
                </button>
                <button type="button" className="student-primary-button">
                  Gửi tin nhắn
                </button>
              </div>
            </aside>
          </section>
        </section>
      </main>
    </div>
  );
}

export default StudentManagementPage;
