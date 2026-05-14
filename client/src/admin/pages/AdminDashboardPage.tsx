import { useEffect, useState } from "react";
import "../../index.css";

type AdminPage =
  | "dashboard"
  | "students"
  | "courses"
  | "system"
  | "content";

type AdminDashboardPageProps = {
  activePage: AdminPage;
  onNavigate: (page: AdminPage) => void;
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const defaultAvatar =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80";

const defaultCourseImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80";

const navItems = [
  { key: "dashboard" as const, label: "Tổng quan", icon: "dashboard" },
  { key: "students" as const, label: "Quản lý học viên", icon: "group" },
  { key: "courses" as const, label: "Quản lý khóa học", icon: "library_books" },
  { key: "system" as const, label: "Cấu hình hệ thống", icon: "settings" },
  { key: "content" as const, label: "Nội dung chung", icon: "description" },
];

const growthToneMap = {
  admin: "primary",
  instructor: "amber",
  student: "slate",
};

const activityToneMap = {
  order_paid: "amber",
  course_created: "primary",
  user_joined: "primary",
  review_added: "danger",
};

const activityIconMap = {
  order_paid: "shopping_cart",
  course_created: "library_books",
  user_joined: "person_add",
  review_added: "rate_review",
};

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000000 ? 1 : 0,
  }).format(value);
}

function formatRelativeTime(value: string) {
  const diffMs = Date.now() - new Date(value).getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ngày trước`;
}

function formatRoleLabel(value: string) {
  if (value === "admin") return "Quản trị viên";
  if (value === "instructor") return "Giảng viên";
  if (value === "student") return "Học viên";

  return value;
}

function normalizeBars(items: { label: string; revenue: number }[]) {
  const maxRevenue = Math.max(...items.map((item) => item.revenue), 1);

  return items.map((item, index) => ({
    ...item,
    height: Math.max(20, Math.round((item.revenue / maxRevenue) * 100)),
    active: index === items.length - 1,
    tooltip: formatCurrency(item.revenue),
  }));
}

type Trend = {
  value: string;
  direction: "up" | "down" | "neutral";
};

type DashboardApiResponse = {
  success: boolean;
  data: {
    summary: {
      totalUsers: { value: number; trend: Trend };
      totalRevenue: { value: number; trend: Trend };
      activeCourses: { value: number; trend: Trend };
      completionRate: { value: number; trend: Trend };
    };
    revenueTrajectory: { label: string; revenue: number }[];
    userGrowth: { label: string; total: number; percentage: number }[];
    topCourses: {
      id: number;
      title: string;
      thumbnail: string | null;
      instructorName: string;
      students: number;
      revenue: number;
      rating: number;
      badge: string;
    }[];
    recentActivity: {
      id: string;
      type: string;
      title: string;
      description: string;
      createdAt: string;
    }[];
    generatedAt: string;
  };
};

function AdminDashboardPage({
  activePage,
  onNavigate,
}: AdminDashboardPageProps) {
  const [dashboard, setDashboard] = useState<DashboardApiResponse["data"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload: DashboardApiResponse = await response.json();

        if (!payload.success) {
          throw new Error("Dashboard API returned unsuccessful response.");
        }

        setDashboard(payload.data);
      } catch (fetchError) {
        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          return;
        }

        setError("Không thể tải dữ liệu dashboard. Kiểm tra server và MySQL.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();

    return () => controller.abort();
  }, []);

  const stats = dashboard
    ? [
        {
          title: "Tổng người dùng",
          value: formatCompactNumber(dashboard.summary.totalUsers.value),
          trend: dashboard.summary.totalUsers.trend.value,
          trendType: dashboard.summary.totalUsers.trend.direction,
          accent: "blue",
          icon: "group",
        },
        {
          title: "Tổng doanh thu",
          value: formatCurrency(dashboard.summary.totalRevenue.value),
          trend: dashboard.summary.totalRevenue.trend.value,
          trendType: dashboard.summary.totalRevenue.trend.direction,
          accent: "amber",
          icon: "payments",
        },
        {
          title: "Khóa học đang mở",
          value: String(dashboard.summary.activeCourses.value),
          trend: dashboard.summary.activeCourses.trend.value,
          trendType: dashboard.summary.activeCourses.trend.direction,
          accent: "slate",
          icon: "library_books",
        },
        {
          title: "Tỷ lệ hoàn thành",
          value: `${dashboard.summary.completionRate.value}%`,
          trend: dashboard.summary.completionRate.trend.value,
          trendType: dashboard.summary.completionRate.trend.direction,
          accent: "gold",
          icon: "star",
        },
      ]
    : [];

  const revenueBars = dashboard ? normalizeBars(dashboard.revenueTrajectory) : [];

  const growthChannels = dashboard
    ? dashboard.userGrowth.map((item) => ({
        name: formatRoleLabel(item.label),
        value: `${item.percentage}%`,
        width: `${Math.max(item.percentage, 6)}%`,
        tone:
          growthToneMap[item.label as keyof typeof growthToneMap] ?? "soft",
      }))
    : [];

  const courses = dashboard
    ? dashboard.topCourses.map((course) => ({
        title: course.title,
        meta: `bởi ${course.instructorName} - ${formatCompactNumber(course.students)} học viên`,
        revenue: formatCurrency(course.revenue),
        badge:
          course.badge === "Top Earner"
            ? "Doanh thu cao nhất"
            : course.badge === "Highly Rated"
              ? "Đánh giá cao"
              : "Xu hướng",
        badgeTone:
          course.badge === "Top Earner"
            ? "success"
            : course.badge === "Highly Rated"
              ? "primary"
              : "muted",
        image: course.thumbnail || defaultCourseImage,
      }))
    : [];

  const activities = dashboard
    ? dashboard.recentActivity.map((activity) => ({
        title: activity.title,
        body: activity.description,
        time: formatRelativeTime(activity.createdAt),
        icon:
          activityIconMap[activity.type as keyof typeof activityIconMap] ??
          "notifications",
        tone:
          activityToneMap[activity.type as keyof typeof activityToneMap] ??
          "primary",
      }))
    : [];

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
          <p className="pro-copy">Dashboard đang kết nối với dữ liệu quản trị thực tế.</p>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <label className="searchbar" aria-label="Tìm kiếm">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Tìm thống kê, khóa học hoặc người dùng..."
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
                <p className="profile-role">Quản trị hệ thống</p>
              </div>
              <img src={defaultAvatar} alt="Quản trị viên" />
            </div>
          </div>
        </header>

        <section className="content">
          <div className="hero">
            <p className="eyebrow">Báo cáo tháng</p>
            <h1>Tổng quan nền tảng</h1>
            <p className="hero-copy">
              Theo dõi nhanh hiệu suất vận hành của hệ thống e-learning trong
              tháng này.
            </p>
          </div>

          {loading ? (
            <div className="status-banner">Đang tải dữ liệu dashboard...</div>
          ) : null}

          {error ? <div className="status-banner error">{error}</div> : null}

          <section className="stats-grid">
            {stats.map((stat) => (
              <article key={stat.title} className="panel stat-card">
                <div className="stat-top">
                  <div className={`icon-tile ${stat.accent}`}>
                    <span className="material-symbols-outlined">
                      {stat.icon}
                    </span>
                  </div>
                  <span className={`trend ${stat.trendType}`}>
                    {stat.trendType === "up" && (
                      <span className="material-symbols-outlined">
                        trending_up
                      </span>
                    )}
                    {stat.trendType === "down" && (
                      <span className="material-symbols-outlined">
                        trending_down
                      </span>
                    )}
                    {stat.trend}
                  </span>
                </div>
                <p className="stat-title">{stat.title}</p>
                <h2 className="stat-value">{stat.value}</h2>
              </article>
            ))}
          </section>

          <section className="charts-grid">
            <article className="panel revenue-panel">
              <div className="panel-header">
                <div>
                  <h3>Biến động doanh thu</h3>
                  <p>Doanh thu theo tháng lấy từ các đơn hàng đã thanh toán</p>
                </div>
                <div className="segmented">
                  <button className="active" type="button">
                    Doanh thu
                  </button>
                  <button type="button" disabled>
                    Người dùng
                  </button>
                </div>
              </div>

              <div className="bar-chart">
                {revenueBars.map((bar) => (
                  <div key={bar.label} className="bar-column">
                    <div
                      className={`bar ${bar.active ? "active" : ""}`}
                      style={{ height: `${bar.height}%` }}
                    >
                      <span className="tooltip">{bar.tooltip}</span>
                    </div>
                    <span className={`bar-label${bar.active ? " active" : ""}`}>
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel growth-panel">
              <div className="panel-header compact">
                <div>
                  <h3>Tăng trưởng người dùng</h3>
                  <p>Phân bố tài khoản theo vai trò</p>
                </div>
              </div>

              <div className="progress-list">
                {growthChannels.map((channel) => (
                  <div key={channel.name} className="progress-item">
                    <div className="progress-row">
                      <span>{channel.name}</span>
                      <span>{channel.value}</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className={`progress-fill ${channel.tone}`}
                        style={{ width: channel.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="bottom-grid">
            <article className="panel list-panel">
              <div className="panel-header">
                <div>
                  <h3>Khóa học nổi bật</h3>
                </div>
                <a href="#">Xem tất cả</a>
              </div>

              <div className="course-list">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <div key={course.title} className="course-item">
                      <img src={course.image} alt={course.title} />
                      <div className="course-copy">
                        <h4>{course.title}</h4>
                        <p>{course.meta}</p>
                      </div>
                      <div className="course-metric">
                        <strong>{course.revenue}</strong>
                        <span className={course.badgeTone}>{course.badge}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">Chưa có dữ liệu khóa học nổi bật.</p>
                )}
              </div>
            </article>

            <article className="panel activity-panel">
              <div className="panel-header">
                <div>
                  <h3>Hoạt động hệ thống</h3>
                </div>
                <span className="live-pill">
                  <span className="live-dot" />
                  Trực tiếp
                </span>
              </div>

              <div className="timeline">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={`${activity.title}-${activity.time}`} className="timeline-item">
                      <div className={`timeline-icon ${activity.tone}`}>
                        <span className="material-symbols-outlined">
                          {activity.icon}
                        </span>
                      </div>
                      <div className="timeline-copy">
                        <h4>{activity.title}</h4>
                        <p>{activity.body}</p>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">Chưa có hoạt động gần đây.</p>
                )}
              </div>
            </article>
          </section>
        </section>
      </main>

      <button className="fab" type="button" aria-label="Tạo mới">
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
}

export default AdminDashboardPage;
