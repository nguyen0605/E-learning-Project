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

type SystemConfigurationPageProps = {
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

const configTabs = [
  { label: "Cài đặt chung", icon: "language", active: true },
  { label: "Cấu hình email", icon: "mail" },
  { label: "Cổng thanh toán", icon: "payments" },
  { label: "Bảo mật", icon: "verified_user" },
];

const securityRules = [
  "Chữ in hoa",
  "Ký hiệu đặc biệt",
  "Số",
  "Tối thiểu 12 ký tự",
];

type SystemConfigApiResponse = {
  success: boolean;
  data: {
    tabs: Array<{ key: string; label: string; icon: string; active: boolean }>;
    general: {
      platformName: string;
      defaultLanguage: string;
      logo: { label: string; acceptedFormats: string };
      favicon: { label: string; acceptedFormats: string };
    };
    email: {
      smtpHost: string;
      port: string;
      senderEmail: string;
    };
    security: {
      twoFactorAuthentication: boolean;
      sessionTimeoutEnabled: boolean;
      passwordRules: Array<{ key: string; label: string; enabled: boolean }>;
    };
  };
};

function SystemConfigurationPage({
  activePage,
  onNavigate,
}: SystemConfigurationPageProps) {
  const [pageData, setPageData] = useState<SystemConfigApiResponse["data"] | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadConfig() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/system-config`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`Failed with ${response.status}`);

        const result = (await response.json()) as SystemConfigApiResponse;
        if (!ignore) setPageData(result.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadConfig();

    return () => {
      ignore = true;
    };
  }, []);

  const displayedTabs = pageData?.tabs ?? configTabs;
  const displayedRules = pageData?.security.passwordRules ?? securityRules.map((label) => ({
    key: label,
    label,
    enabled: true,
  }));

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
          <p className="pro-copy">Bảng điều khiển tổng cho nhận diện nền tảng và giao thức bảo mật.</p>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <label className="searchbar" aria-label="Tìm kiếm">
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Tìm cấu hình hệ thống..." />
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

        <section className="content system-page">
          <div className="hero">
            <p className="eyebrow">Trung tâm cấu hình</p>
            <h1>Cấu hình hệ thống</h1>
            <p className="hero-copy">
              Bảng điều khiển tổng cho nhận diện nền tảng, giao thức bảo mật và
              luồng tích hợp cốt lõi.
            </p>
          </div>

          <div className="system-layout">
            <nav className="system-tabs">
              {displayedTabs.map((tab) => (
                <button
                  key={tab.label}
                  className={tab.active ? "active" : ""}
                  type="button"
                >
                  <span className="material-symbols-outlined">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="system-sections">
              <section className="system-section">
                <div className="system-section-head">
                  <h3>Nhận diện nền tảng</h3>
                  <span>Toàn cục</span>
                </div>

                <div className="system-field-grid">
                  <div className="panel system-field-card">
                    <label>Tên nền tảng</label>
                    <input type="text" value={pageData?.general.platformName ?? "Editorial Scholar Pro"} readOnly />
                    <p>Tên này xuất hiện ở tab trình duyệt và email hệ thống.</p>
                  </div>

                  <div className="panel system-field-card">
                    <label>Ngôn ngữ mặc định</label>
                    <select value={pageData?.general.defaultLanguage ?? "Tiếng Anh (Hoa Kỳ)"} disabled>
                      <option>Tiếng Anh (Hoa Kỳ)</option>
                      <option>Tiếng Tây Ban Nha</option>
                      <option>Tiếng Pháp</option>
                      <option>Tiếng Đức</option>
                    </select>
                  </div>

                  <div className="panel system-brand-card">
                    <div>
                      <h4>Tài sản thương hiệu</h4>
                      <p>
                        Tải logo vector và favicon độ phân giải cao để cá nhân
                        hóa trải nghiệm white-label.
                      </p>

                      <div className="system-upload-list">
                        <button type="button">
                          <span className="material-symbols-outlined">
                            upload_file
                          </span>
                          <div>
                            <strong>{pageData?.general.logo.label ?? "Logo nền tảng"}</strong>
                            <small>{pageData?.general.logo.acceptedFormats ?? "SVG hoặc PNG, tối đa 2MB"}</small>
                          </div>
                        </button>

                        <button type="button">
                          <span className="material-symbols-outlined">
                            filter_vintage
                          </span>
                          <div>
                            <strong>{pageData?.general.favicon.label ?? "Favicon hệ thống"}</strong>
                            <small>{pageData?.general.favicon.acceptedFormats ?? "ICO hoặc PNG, 32x32px"}</small>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="system-brand-preview">
                      <div className="system-brand-mark">
                        <span className="material-symbols-outlined">school</span>
                      </div>
                      <p>Nhận diện thương hiệu hiện tại</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="system-section">
                <div className="system-section-head icon-only">
                  <h3>Kiến trúc liên lạc</h3>
                  <span className="material-symbols-outlined">alternate_email</span>
                </div>

                <div className="panel system-form-card">
                  <div className="system-form-grid">
                    <div className="system-form-group wide">
                      <label>Máy chủ SMTP</label>
                      <input type="text" placeholder="smtp.provider.com" value={pageData?.email.smtpHost ?? ""} readOnly />
                    </div>
                    <div className="system-form-group">
                      <label>Cổng kết nối</label>
                      <input type="text" placeholder="587" value={pageData?.email.port ?? ""} readOnly />
                    </div>
                    <div className="system-form-group full">
                      <label>Email gửi mặc định</label>
                      <input
                        type="email"
                        placeholder="notifications@editorialscholar.edu"
                        value={pageData?.email.senderEmail ?? ""}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="system-section">
                <div className="system-section-head icon-only">
                  <h3>Bảo mật và mã hóa</h3>
                  <span className="material-symbols-outlined danger">lock</span>
                </div>

                <div className="system-security-grid">
                  <div className="panel system-toggle-card">
                    <div>
                      <h4>Xác thực hai lớp</h4>
                      <p>Yêu cầu xác minh bổ sung cho toàn bộ tài khoản admin.</p>
                    </div>
                    <label className="system-switch">
                      <input type="checkbox" checked={pageData?.security.twoFactorAuthentication ?? true} readOnly />
                      <span />
                    </label>
                  </div>

                  <div className="panel system-toggle-card">
                    <div>
                      <h4>Tự động hết phiên</h4>
                      <p>Đăng xuất sau 30 phút không hoạt động.</p>
                    </div>
                    <label className="system-switch">
                      <input type="checkbox" checked={pageData?.security.sessionTimeoutEnabled ?? true} readOnly />
                      <span />
                    </label>
                  </div>

                  <div className="panel system-rules-card">
                    <label>Quy tắc mật khẩu</label>
                    <div className="system-rules-grid">
                      {displayedRules.map((rule) => (
                        <label key={rule.key}>
                          <input type="checkbox" checked={rule.enabled} readOnly />
                          <span>{rule.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <div className="system-footer-bar">
        <button type="button" className="system-ghost-btn">
          Hủy thay đổi
        </button>
        <button type="button" className="system-save-btn">
          Lưu cấu hình
        </button>
      </div>
    </div>
  );
}

export default SystemConfigurationPage;
