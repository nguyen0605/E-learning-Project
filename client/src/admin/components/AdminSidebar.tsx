import type { AdminPage } from "../adminNavigation";

type AdminSidebarProps = {
  activePage: AdminPage;
  description: string;
  onNavigate: (page: AdminPage) => void;
};

const navItems: Array<{ key: AdminPage; label: string; icon: string }> = [
  { key: "dashboard", label: "Tổng quan", icon: "dashboard" },
  { key: "teachers", label: "Quản lý giảng viên", icon: "co_present" },
  { key: "students", label: "Quản lý học viên", icon: "group" },
  { key: "courses", label: "Quản lý khóa học", icon: "library_books" },
  { key: "system", label: "Cấu hình hệ thống", icon: "settings" },
  { key: "content", label: "Nội dung chung", icon: "description" },
];

function AdminSidebar({
  activePage,
  description,
  onNavigate,
}: AdminSidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <p className="brand-title">LearnX E-Learning</p>
        <p className="brand-subtitle">Trang quản trị</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`nav-item${item.key === activePage ? " active" : ""}`}
            onClick={() => onNavigate(item.key)}
            type="button"
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pro-card">
        <p className="pro-label">Quản trị thông minh</p>
        <p className="pro-copy">{description}</p>
      </div>
    </aside>
  );
}

export default AdminSidebar;
