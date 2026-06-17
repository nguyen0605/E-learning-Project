import { useEffect, useState } from "react";
import { getAuthHeaders } from "../../auth/authHeaders";
import "../../index.css";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type AdminPage =
  | "dashboard"
  | "students"
  | "courses"
  | "system"
  | "content";

type CourseManagementPageProps = {
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

const statCards = [
  {
    title: "Tổng khóa học",
    value: "1,284",
    note: "12% so với tháng trước",
    noteTone: "success",
    accent: "blue",
  },
  {
    title: "Chờ duyệt",
    value: "42",
    note: "Cần xử lý sớm",
    noteTone: "muted",
    accent: "amber",
  },
  {
    title: "Học viên đang hoạt động",
    value: "18.5k",
    note: "Phủ sóng toàn cầu",
    noteTone: "success",
    accent: "slate",
  },
  {
    title: "Doanh thu tháng",
    value: "$92.4k",
    note: "Dự báo: +$14k",
    noteTone: "muted",
    accent: "primary-outline",
  },
];

const categories = [
  "Tất cả danh mục",
  "Triết học",
  "Nghệ thuật số",
  "Kiến trúc",
  "Văn học",
  "Khoa học dữ liệu",
];

const courses = [
  {
    category: "Triết học",
    rating: "4.9",
    title: "Tư duy Khắc kỷ trong thời đại hỗn loạn",
    description:
      "Ứng dụng trí tuệ Hy Lạp cổ đại để giải quyết áp lực và lựa chọn đạo đức trong đời sống hiện đại.",
    instructor: "TS. Marcus Aurelius Jr.",
    price: "$89.00",
    status: "Chờ duyệt",
    statusTone: "pending",
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=500&q=80",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    actions: ["approve", "reject", "edit"],
  },
  {
    category: "Ẩm thực",
    rating: "4.7",
    title: "Nhà bếp phân tử",
    description:
      "Khám phá phản ứng hóa học của hương vị và kỹ thuật nấu ăn hiện đại dưới góc nhìn khoa học.",
    instructor: "Chef Elena Rossi",
    price: "$145.00",
    status: "Đã duyệt",
    statusTone: "approved",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=500&q=80",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    actions: ["analytics", "edit", "delete"],
  },
  {
    category: "Kiến trúc",
    rating: "Mới",
    title: "Chủ nghĩa đô thị bền vững 2030",
    description:
      "Thiết kế thành phố tương lai cân bằng giữa công nghệ, sinh thái và khả năng thích ứng của cộng đồng.",
    instructor: "Sarah Jenkins, RIBA",
    price: "$210.00",
    status: "Từ chối",
    statusTone: "rejected",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=500&q=80",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=120&q=80",
    actions: ["feedback", "edit"],
  },
  {
    category: "Nghệ thuật số",
    rating: "5.0",
    title: "Masterclass kể chuyện bằng hình ảnh",
    description:
      "Làm chủ bố cục, ánh sáng và nhịp thị giác để tạo nên câu chuyện mạnh mẽ bằng nhiếp ảnh kỹ thuật số.",
    instructor: "Jordan Vane",
    price: "$65.00",
    status: "Đã duyệt",
    statusTone: "approved",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
    actions: ["edit", "delete"],
  },
];

type CourseApiRow = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string | null;
  category: string;
  instructorName: string;
  instructorAvatar: string | null;
  rating: number;
  status: string;
  statusLabel: string;
};

type CoursesApiResponse = {
  success: boolean;
  data: {
    summary: {
      totalCourses: { value: number; note: string };
      pendingReview: { value: number; note: string };
      activeStudents: { value: string; note: string };
      monthlyRevenue: { value: number; note: string };
    };
    categories: Array<{ key: string; label: string; active: boolean }>;
    courses: CourseApiRow[];
    pagination: { total: number };
  };
};

function CourseManagementPage({
  activePage,
  onNavigate,
}: CourseManagementPageProps) {
  const [pageData, setPageData] = useState<CoursesApiResponse["data"] | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadCourses() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/courses`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`Failed with ${response.status}`);

        const result = (await response.json()) as CoursesApiResponse;
        if (!ignore) setPageData(result.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadCourses();

    return () => {
      ignore = true;
    };
  }, []);

  const displayedStats = pageData
    ? [
        {
          ...statCards[0],
          value: String(pageData.summary.totalCourses.value),
          note: pageData.summary.totalCourses.note,
        },
        {
          ...statCards[1],
          value: String(pageData.summary.pendingReview.value),
          note: pageData.summary.pendingReview.note,
        },
        {
          ...statCards[2],
          value: pageData.summary.activeStudents.value,
          note: pageData.summary.activeStudents.note,
        },
        {
          ...statCards[3],
          value: new Intl.NumberFormat("vi-VN").format(pageData.summary.monthlyRevenue.value),
          note: pageData.summary.monthlyRevenue.note,
        },
      ]
    : statCards;
  const displayedCategories = pageData?.categories.map((category) => category.label) ?? categories;
  const displayedCourses =
    pageData?.courses.map((course) => ({
      category: course.category,
      rating: course.rating > 0 ? String(course.rating) : "Mới",
      title: course.title,
      description: course.description,
      instructor: course.instructorName,
      price: new Intl.NumberFormat("vi-VN").format(course.price),
      status: course.statusLabel,
      statusTone: course.status,
      image:
        course.thumbnail ||
        "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=500&q=80",
      avatar:
        course.instructorAvatar ||
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      actions:
        course.status === "pending"
          ? ["approve", "reject", "edit"]
          : ["analytics", "edit", "delete"],
    })) ?? courses;

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
          <p className="pro-copy">Biên tập, theo dõi và đánh giá các khóa học trong hệ sinh thái.</p>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <label className="searchbar" aria-label="Tìm kiếm">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Tìm khóa học, giảng viên hoặc thẻ..."
            />
          </label>

          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="Thông báo">
              <span className="material-symbols-outlined">notifications</span>
            </button>

            <div className="profile-chip">
              <div>
                <p className="profile-name">Alex Rivera</p>
                <p className="profile-role">Biên tập viên cấp cao</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80"
                alt="Alex Rivera"
              />
            </div>
          </div>
        </header>

        <section className="content course-page">
          <div className="course-header">
            <div>
              <h1>Quản lý khóa học</h1>
              <p>
                Biên tập, theo dõi và đánh giá các tài sản tri thức trong toàn
                bộ hệ sinh thái học tập.
              </p>
            </div>

            <div className="course-header-actions">
              <button className="course-filter-btn" type="button">
                <span className="material-symbols-outlined">filter_list</span>
                Bộ lọc
              </button>
              <button className="course-primary-btn" type="button">
                <span className="material-symbols-outlined">add</span>
                Khóa học mới
              </button>
            </div>
          </div>

          <section className="course-stats-grid">
            {displayedStats.map((stat) => (
              <article
                key={stat.title}
                className={`panel course-stat-card ${stat.accent}`}
              >
                <p>{stat.title}</p>
                <h2>{stat.value}</h2>
                <span className={stat.noteTone}>{stat.note}</span>
              </article>
            ))}
          </section>

          <div className="course-category-row">
            {displayedCategories.map((category, index) => (
              <button
                key={category}
                className={index === 0 ? "active" : ""}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>

          <section className="course-grid">
            {displayedCourses.map((course) => (
              <article key={course.title} className="panel course-card">
                <div className="course-card-media">
                  <img src={course.image} alt={course.title} />
                  <div className="course-card-overlay">
                    <span className="material-symbols-outlined">visibility</span>
                  </div>
                </div>

                <div className="course-card-body">
                  <div className="course-card-top">
                    <span className={`course-category-tag ${course.statusTone}`}>
                      {course.category}
                    </span>
                    <div className="course-rating">
                      <span className="material-symbols-outlined">star</span>
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <h3>{course.title}</h3>
                  <p>{course.description}</p>

                  <div className="course-instructor-row">
                    <img src={course.avatar} alt={course.instructor} />
                    <span>{course.instructor}</span>
                    <span className="dot-separator">•</span>
                    <strong>{course.price}</strong>
                  </div>

                  <div className="course-card-footer">
                    <div className={`course-status ${course.statusTone}`}>
                      <span className="dot" />
                      {course.status}
                    </div>

                    <div className="course-card-actions">
                      {course.actions.includes("approve") ? (
                        <button type="button" title="Duyệt">
                          <span className="material-symbols-outlined">check_circle</span>
                        </button>
                      ) : null}
                      {course.actions.includes("reject") ? (
                        <button type="button" title="Từ chối">
                          <span className="material-symbols-outlined">cancel</span>
                        </button>
                      ) : null}
                      {course.actions.includes("analytics") ? (
                        <button type="button" title="Phân tích">
                          <span className="material-symbols-outlined">bar_chart</span>
                        </button>
                      ) : null}
                      {course.actions.includes("feedback") ? (
                        <button type="button" className="course-feedback-btn" title="Xem phản hồi">
                          Xem phản hồi
                        </button>
                      ) : null}
                      {course.actions.includes("edit") ? (
                        <button type="button" title="Chỉnh sửa">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      ) : null}
                      {course.actions.includes("delete") ? (
                        <button type="button" title="Xóa">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <div className="course-pagination">
            <p>Hiển thị 1 đến 4 trong tổng số {pageData?.pagination.total ?? "1,284"} khóa học</p>
            <div className="course-pagination-controls">
              <button type="button">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button type="button" className="active">
                1
              </button>
              <button type="button">2</button>
              <button type="button">3</button>
              <span>...</span>
              <button type="button">321</button>
              <button type="button">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CourseManagementPage;
