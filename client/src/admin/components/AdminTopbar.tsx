import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import NotificationBell from "../../shared/components/notifications/NotificationBell";

type AdminTopbarProps = {
  searchPlaceholder: string;
};

function AdminTopbar({ searchPlaceholder }: AdminTopbarProps) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const avatar =
    user?.avatarUrl ??
    `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(user?.email ?? "admin")}`;

  async function handleLogout() {
    await logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <header className="topbar">
      <label className="searchbar" aria-label="Tìm kiếm">
        <span className="material-symbols-outlined">search</span>
        <input type="text" placeholder={searchPlaceholder} />
      </label>

      <div className="topbar-actions">
        <NotificationBell
          className="admin-notification-bell"
          onOpenNotification={(notification) => {
            if (notification.targetUrl) {
              navigate(notification.targetUrl);
            }
          }}
        />

        <div className="profile-chip">
          <div>
            <p className="profile-name">{user?.fullName ?? "Quản trị viên"}</p>
            <p className="profile-role">Quản trị hệ thống</p>
          </div>
          <img src={avatar} alt={user?.fullName ?? "Quản trị viên"} />
        </div>

        <button
          className="icon-button"
          onClick={() => void handleLogout()}
          title="Đăng xuất"
          type="button"
        >
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </header>
  );
}

export default AdminTopbar;
