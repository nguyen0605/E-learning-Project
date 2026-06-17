import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  instructorNavItems,
  instructorProfile,
  type InstructorNavKey,
} from "../data/instructorMockData";
import "../pages/InstructorPortal.css";

type InstructorLayoutProps = {
  activePage: InstructorNavKey;
  children: ReactNode;
  profile?: {
    name: string;
    role: string;
    avatar?: string | null;
  };
};

function InstructorLayout({ activePage, children, profile }: InstructorLayoutProps) {
  const displayedProfile = {
    ...instructorProfile,
    ...profile,
    avatar: profile?.avatar || instructorProfile.avatar,
  };

  return (
    <div className="instructor-shell">
      <aside className="instructor-sidebar">
        <div className="instructor-brand">
          <div className="instructor-brand-mark">
            <span className="material-symbols-outlined">school</span>
          </div>
          <div>
            <h1>Học viện Lumina</h1>
            <p>Cổng giảng viên</p>
          </div>
        </div>

        <nav className="instructor-nav" aria-label="Điều hướng giảng viên">
          {instructorNavItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `instructor-nav-item ${
                  isActive || item.key === activePage ? "active" : ""
                }`
              }
              end={item.key === "dashboard"}
              key={item.key}
              to={item.path}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="instructor-create-card">
          <p className="instructor-create-label">Không gian giảng dạy</p>
          <p>Lên bài học, chấm bài nộp và theo dõi tiến độ từng lớp.</p>
          <button type="button">
            <span className="material-symbols-outlined">add</span>
            Tạo khóa học mới
          </button>
        </div>
      </aside>

      <main className="instructor-main">
        <header className="instructor-topbar">
          <label className="instructor-search">
            <span className="material-symbols-outlined">search</span>
            <input placeholder="Tìm bài học, học viên hoặc dữ liệu..." />
          </label>

          <div className="instructor-topbar-actions">
            <button className="instructor-icon-button" type="button">
              <span className="material-symbols-outlined">notifications</span>
              <span className="instructor-notification-dot" />
            </button>
            <div className="instructor-profile-chip">
              <img alt="" src={displayedProfile.avatar} />
              <div>
                <p>{displayedProfile.name}</p>
                <span>{displayedProfile.role}</span>
              </div>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

export default InstructorLayout;
