import { useEffect, useState } from "react";
import "../../index.css";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type AdminPage =
  | "dashboard"
  | "students"
  | "courses"
  | "system"
  | "content";

type GeneralContentPageProps = {
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

const posts = [
  {
    title: "Tương lai của học tập thích ứng",
    category: "Công nghệ giáo dục",
    author: "Jane Doe",
    initials: "JD",
    status: "Đã xuất bản",
    statusTone: "published",
    date: "24/10/2023",
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Thiết kế thói quen học tập bền vững",
    category: "Phát triển cá nhân",
    author: "Mark Smith",
    initials: "MS",
    status: "Bản nháp",
    statusTone: "draft",
    date: "12/11/2023",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80",
  },
];

const faqItems = [
  {
    question: "Làm thế nào để yêu cầu hoàn tiền cho khóa học?",
    answer:
      "Học viên có thể gửi yêu cầu hoàn tiền trong vòng 30 ngày nếu mới hoàn thành dưới 20% nội dung. Yêu cầu được xử lý tại khu vực thanh toán.",
    active: true,
  },
  {
    question: "Có thể tải video về để xem ngoại tuyến không?",
    answer: "",
    active: false,
  },
];

const banners = [
  {
    title: "Khuyến mãi mùa hè 2024",
    subtitle: "Kết thúc sau 12 ngày",
    active: true,
    image:
      "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Học bổng cuối năm",
    subtitle: "Lên lịch ngày 01/12",
    active: false,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80",
  },
];

type ContentApiResponse = {
  success: boolean;
  data: {
    summary: { totalPosts: number; publishedPosts: number; draftPosts: number };
    posts: Array<{
      id: number;
      title: string;
      category: string;
      author: string;
      initials: string;
      status: string;
      statusLabel: string;
      publishedAt: string;
      thumbnail: string;
    }>;
    faqs: Array<{
      id: number;
      question: string;
      answer: string;
      expanded: boolean;
    }>;
    banners: Array<{
      id: number;
      title: string;
      subtitle: string;
      active: boolean;
      image: string;
    }>;
    insights: { monthlyReaders: number; growthRate: number };
  };
};

function GeneralContentPage({
  activePage,
  onNavigate,
}: GeneralContentPageProps) {
  const [pageData, setPageData] = useState<ContentApiResponse["data"] | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadContent() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/general-content`);
        if (!response.ok) throw new Error(`Failed with ${response.status}`);

        const result = (await response.json()) as ContentApiResponse;
        if (!ignore) setPageData(result.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadContent();

    return () => {
      ignore = true;
    };
  }, []);

  const displayedPosts =
    pageData?.posts.map((post) => ({
      title: post.title,
      category: post.category,
      author: post.author,
      initials: post.initials,
      status: post.statusLabel,
      statusTone: post.status,
      date: new Date(post.publishedAt).toLocaleDateString("vi-VN"),
      image: post.thumbnail,
    })) ?? posts;
  const displayedFaqs =
    pageData?.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
      active: faq.expanded,
    })) ?? faqItems;
  const displayedBanners = pageData?.banners ?? banners;

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <p className="brand-title">LTHDV E-Learning</p>
          <p className="brand-subtitle">Trang quản trị</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item${item.key === activePage ? " active" : ""}`}
              type="button"
              onClick={() => onNavigate(item.key)}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pro-card">
          <p className="pro-label">Quản trị thông minh</p>
          <p className="pro-copy">Quản lý blog, FAQ và banner truyền thông cho nền tảng.</p>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <label className="searchbar" aria-label="Tìm kiếm">
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Tìm bài viết, FAQ hoặc banner..." />
          </label>

          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="Thông báo">
              <span className="material-symbols-outlined">notifications</span>
              <span className="notification-dot" />
            </button>
            <div className="profile-chip">
              <div>
                <p className="profile-name">Scholar Admin</p>
                <p className="profile-role">Quản trị viên</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80"
                alt="Quản trị viên"
              />
            </div>
          </div>
        </header>

        <section className="content content-page">
          <div className="content-header">
            <div>
              <h1>Nội dung chung</h1>
              <p>
                Quản lý blog, câu hỏi thường gặp và hệ thống banner truyền thông
                cho toàn bộ nền tảng.
              </p>
            </div>

            <div className="content-header-actions">
              <button className="course-filter-btn" type="button">
                <span className="material-symbols-outlined">view_agenda</span>
                Xem trước trang
              </button>
              <button className="course-primary-btn" type="button">
                <span className="material-symbols-outlined">add</span>
                Tạo bài viết mới
              </button>
            </div>
          </div>

          <div className="content-grid">
            <section className="content-main">
              <div className="panel content-posts-card">
                <div className="content-section-head">
                  <div>
                    <h3>Bài viết gần đây</h3>
                  </div>
                  <div className="content-pills">
                    <span className="active">Tất cả ({pageData?.summary.totalPosts ?? 24})</span>
                    <span>Đã xuất bản ({pageData?.summary.publishedPosts ?? 18})</span>
                    <span>Bản nháp ({pageData?.summary.draftPosts ?? 6})</span>
                  </div>
                </div>

                <div className="content-post-list">
                  {displayedPosts.map((post) => (
                    <div key={post.title} className="content-post-row">
                      <div className="content-post-main">
                        <img src={post.image} alt={post.title} />
                        <div>
                          <strong>{post.title}</strong>
                          <p>{post.category}</p>
                        </div>
                      </div>

                      <div className="content-post-author">
                        <span>{post.initials}</span>
                        <small>{post.author}</small>
                      </div>

                      <div className={`content-post-status ${post.statusTone}`}>
                        <span className="dot" />
                        {post.status}
                      </div>

                      <div className="content-post-date">{post.date}</div>

                      <div className="content-post-actions">
                        <button type="button">
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                        <button type="button">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button type="button">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel content-faq-card">
                <div className="content-section-head">
                  <div>
                    <h3>FAQ nền tảng</h3>
                    <p>Quản lý các câu hỏi phổ biến của học viên</p>
                  </div>
                  <button type="button" className="content-add-btn">
                    <span className="material-symbols-outlined">add</span>
                    Thêm FAQ
                  </button>
                </div>

                <div className="content-faq-list">
                  {displayedFaqs.map((item) => (
                    <div
                      key={item.question}
                      className={`content-faq-item${item.active ? " active" : ""}`}
                    >
                      <div className="content-faq-head">
                        <p>
                          <span className="material-symbols-outlined">
                            help_outline
                          </span>
                          {item.question}
                        </p>
                        <div className="content-faq-actions">
                          <button type="button">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button type="button">
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                          {!item.active ? (
                            <button type="button">
                              <span className="material-symbols-outlined">
                                expand_more
                              </span>
                            </button>
                          ) : null}
                        </div>
                      </div>
                      {item.active ? <small>{item.answer}</small> : null}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="content-side">
              <div className="panel content-banners-card">
                <h3>Banner quảng bá</h3>
                <div className="content-banner-list">
                  {displayedBanners.map((banner) => (
                    <div key={banner.title} className="content-banner-item">
                      <div className="content-banner-media">
                        <img src={banner.image} alt={banner.title} />
                        {!banner.active ? (
                          <div className="content-banner-overlay">Không hoạt động</div>
                        ) : null}
                        <button type="button">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      </div>
                      <div className="content-banner-meta">
                        <div>
                          <strong>{banner.title}</strong>
                          <p>{banner.subtitle}</p>
                        </div>
                        <label className="system-switch compact">
                          <input type="checkbox" defaultChecked={banner.active} />
                          <span />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel content-editor-card">
                <div className="content-editor-head">
                  <span>Bản nháp xem trước</span>
                  <div>
                    <span className="material-symbols-outlined">format_bold</span>
                    <span className="material-symbols-outlined">format_italic</span>
                    <span className="material-symbols-outlined">link</span>
                  </div>
                </div>
                <div className="content-editor-body">
                  <h4>Sự trỗi dậy của Digital Nomads...</h4>
                  <div className="content-editor-line short" />
                  <div className="content-editor-line" />
                  <div className="content-editor-line medium" />
                  <div className="content-editor-actions">
                    <button type="button">Mở trình soạn thảo</button>
                    <button type="button">
                      <span className="material-symbols-outlined">fullscreen</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="content-insight-card">
                <p>Chỉ số tương tác</p>
                <h3>{pageData ? `${(pageData.insights.monthlyReaders / 1000).toFixed(1)}k` : "12.4k"}</h3>
                <span>Lượt đọc blog mỗi tháng</span>
                <div className="content-insight-track">
                  <div className="content-insight-fill" />
                </div>
                <small>+{pageData?.insights.growthRate ?? 14}% so với tháng trước</small>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <button className="fab" type="button" aria-label="Tạo mới">
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
}

export default GeneralContentPage;
