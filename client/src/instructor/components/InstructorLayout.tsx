import { useEffect, useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { clearStoredAuthSession } from "../../auth/authStorage";
import {
  getNotifications,
  getPushPublicKey,
  markNotificationRead,
  savePushSubscription,
} from "../../shared/services/notificationApi";
import { clearInstructorAuthSession } from "../auth/instructorAuth";
import {
  instructorNavItems,
  instructorProfile,
  type InstructorNavKey,
} from "../data/instructorMockData";
import "../pages/InstructorPortal.css";

type HeaderNotification = {
  id: number;
  title: string;
  content: string;
  isRead: boolean;
  time: string;
};

type QuickSearchItem = {
  title: string;
  description: string;
  icon: string;
  path: string;
  keywords: string[];
};

type InstructorLayoutProps = {
  activePage: InstructorNavKey;
  children: ReactNode;
  profile?: {
    name: string;
    role: string;
    avatar?: string | null;
  };
};

const quickSearchItems: QuickSearchItem[] = [
  {
    title: "Tổng quan",
    description: "Xem lịch dạy, hiệu suất và tín hiệu học viên",
    icon: "dashboard",
    path: "/instructor",
    keywords: ["dashboard", "tong quan", "thong ke", "lich day", "hieu suat"],
  },
  {
    title: "Quản lý khóa học",
    description: "Tạo khóa, mở lớp, chương bài học và lịch học",
    icon: "library_books",
    path: "/instructor/courses",
    keywords: ["khoa hoc", "lop hoc", "chuong", "bai hoc", "lich hoc"],
  },
  {
    title: "Bài kiểm tra",
    description: "Quiz, bài tập, lượt làm và chấm điểm",
    icon: "quiz",
    path: "/instructor/quizzes",
    keywords: ["quiz", "bai kiem tra", "bai tap", "cham diem", "diem"],
  },
  {
    title: "Học viên",
    description: "Danh sách học viên, tiến độ và chuyên cần",
    icon: "group",
    path: "/instructor/students",
    keywords: ["hoc vien", "sinh vien", "tien do", "chuyen can", "diem danh"],
  },
  {
    title: "Tương tác",
    description: "Thông báo, thảo luận lớp học và phản hồi",
    icon: "forum",
    path: "/instructor/interaction",
    keywords: ["tuong tac", "thao luan", "thong bao", "phan hoi", "hoi dap"],
  },
  {
    title: "Phân tích",
    description: "Báo cáo khóa học và dữ liệu hiệu suất",
    icon: "analytics",
    path: "/instructor/analytics",
    keywords: ["phan tich", "bao cao", "du lieu", "analytics"],
  },
  {
    title: "Hồ sơ",
    description: "Xem và cập nhật thông tin giảng viên",
    icon: "account_circle",
    path: "/instructor/profile",
    keywords: ["ho so", "profile", "giang vien", "tai khoan"],
  },
];

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

function InstructorLayout({ activePage, children, profile }: InstructorLayoutProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState<HeaderNotification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [markingNotificationId, setMarkingNotificationId] = useState<number | null>(null);
  const [pushState, setPushState] = useState<
    "unsupported" | "default" | "granted" | "denied" | "subscribed"
  >(() => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
    ) {
      return "unsupported";
    }
    return Notification.permission;
  });

  const displayedProfile = {
    ...instructorProfile,
    ...profile,
    avatar: profile?.avatar || instructorProfile.avatar,
  };
  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const normalizedSearchQuery = normalizeSearchText(quickSearchQuery);
  const quickSearchResults = normalizedSearchQuery
    ? quickSearchItems.filter((item) =>
        normalizeSearchText(`${item.title} ${item.description} ${item.keywords.join(" ")}`).includes(
          normalizedSearchQuery,
        ),
      )
    : quickSearchItems.slice(0, 4);
  const shouldShowQuickSearch = isSearchFocused || quickSearchQuery.trim().length > 0;

  async function loadNotifications(signal?: AbortSignal) {
    setIsLoadingNotifications(true);
    setNotificationError(null);

    try {
      if (signal?.aborted) return;
      const data = await getNotifications();
      if (signal?.aborted) return;
      setNotifications(
        data.notifications.slice(0, 5).map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          isRead: item.isRead,
          time: new Date(item.createdAt).toLocaleString("vi-VN"),
        })),
      );
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setNotificationError(error instanceof Error ? error.message : "Không thể tải thông báo.");
    } finally {
      setIsLoadingNotifications(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadNotifications(controller.signal);
    const interval = window.setInterval(
      () => void loadNotifications(controller.signal),
      30000,
    );
    return () => {
      window.clearInterval(interval);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (pushState === "unsupported") return;
    void navigator.serviceWorker
      .getRegistration("/push-sw.js")
      .then(async (registration) => {
        const subscription = await registration?.pushManager.getSubscription();
        if (subscription) setPushState("subscribed");
      });
  }, [pushState]);

  useEffect(() => {
    if (!showNotificationModal) return;
    const controller = new AbortController();
    loadNotifications(controller.signal);
    return () => controller.abort();
  }, [showNotificationModal]);

  async function handleMarkNotificationRead(notificationId: number) {
    setMarkingNotificationId(notificationId);
    setNotificationError(null);

    try {
      await markNotificationRead(notificationId);

      setNotifications((current) =>
        current.map((item) => (item.id === notificationId ? { ...item, isRead: true } : item)),
      );
    } catch (error) {
      setNotificationError(error instanceof Error ? error.message : "Không thể đánh dấu đã đọc.");
    } finally {
      setMarkingNotificationId(null);
    }
  }

  async function enablePush() {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setPushState(permission);
        return;
      }

      const registration = await navigator.serviceWorker.register("/push-sw.js");
      const { publicKey } = await getPushPublicKey();
      const existing = await registration.pushManager.getSubscription();
      const subscription =
        existing ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }));

      await savePushSubscription(subscription.toJSON());
      setPushState("subscribed");
      setNotificationError(null);
    } catch (error) {
      setNotificationError(
        error instanceof Error ? error.message : "Không thể bật thông báo đẩy.",
      );
    }
  }

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
                `instructor-nav-item ${isActive || item.key === activePage ? "active" : ""}`
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
          <NavLink to="/instructor/courses?createCourse=1">
            <span className="material-symbols-outlined">add</span>
            Tạo khóa học mới
          </NavLink>
        </div>
      </aside>

      <main className="instructor-main">
        <header className="instructor-topbar">
          <label className="instructor-search">
            <span className="material-symbols-outlined">search</span>
            <input
              onBlur={() => window.setTimeout(() => setIsSearchFocused(false), 140)}
              onChange={(event) => setQuickSearchQuery(event.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Tìm bài học, học viên hoặc dữ liệu..."
              value={quickSearchQuery}
            />
            {shouldShowQuickSearch && (
              <div className="instructor-quick-search-panel">
                <p className="instructor-quick-search-label">
                  {quickSearchQuery.trim() ? "Kết quả tìm kiếm" : "Truy cập nhanh"}
                </p>
                {quickSearchResults.length === 0 ? (
                  <p className="instructor-quick-search-empty">Không tìm thấy mục phù hợp.</p>
                ) : (
                  quickSearchResults.map((item) => (
                    <NavLink
                      className="instructor-quick-search-item"
                      key={item.path}
                      onClick={() => {
                        setQuickSearchQuery("");
                        setIsSearchFocused(false);
                      }}
                      to={item.path}
                    >
                      <span className="material-symbols-outlined">{item.icon}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.description}</p>
                      </div>
                    </NavLink>
                  ))
                )}
              </div>
            )}
          </label>

          <div className="instructor-topbar-actions">
            <button
              aria-label="Mở thông báo"
              className="instructor-icon-button"
              onClick={() => setShowNotificationModal(true)}
              type="button"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && <span className="instructor-notification-dot" />}
            </button>
            <button
              className="instructor-profile-chip"
              onClick={() => setShowProfileModal(true)}
              type="button"
            >
              <img alt="" src={displayedProfile.avatar} />
              <div>
                <p>{displayedProfile.name}</p>
                <span>{displayedProfile.role}</span>
              </div>
            </button>
          </div>
        </header>

        {children}
      </main>

      {showProfileModal && (
        <div
          className="instructor-profile-popover-backdrop"
          onClick={() => setShowProfileModal(false)}
          role="presentation"
        >
          <aside
            aria-label="Thông tin giảng viên"
            aria-modal="true"
            className="instructor-profile-popover"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label="Đóng thông tin giảng viên"
              className="instructor-profile-popover-close"
              onClick={() => setShowProfileModal(false)}
              type="button"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <img alt="" src={displayedProfile.avatar} />
            <p className="instructor-eyebrow">Hồ sơ giảng viên</p>
            <h3>{displayedProfile.name}</h3>
            <span>{displayedProfile.role}</span>
            <p>
              Thông tin này được dùng để hiển thị trên khu vực giảng viên và các trang quản lý lớp
              học.
            </p>
            <NavLink className="instructor-profile-popover-link" to="/instructor/profile">
              Xem hồ sơ đầy đủ
            </NavLink>
            <button
              className="instructor-profile-popover-logout"
              onClick={() => {
                clearInstructorAuthSession();
                clearStoredAuthSession();
                window.location.href = "/instructor/login";
              }}
              type="button"
            >
              Đăng xuất
            </button>
          </aside>
        </div>
      )}

      {showNotificationModal && (
        <div
          className="instructor-profile-popover-backdrop"
          onClick={() => setShowNotificationModal(false)}
          role="presentation"
        >
          <aside
            aria-label="Thông báo nhanh"
            aria-modal="true"
            className="instructor-notification-popover"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="instructor-notification-popover-header">
              <div>
                <p className="instructor-eyebrow">Thông báo</p>
                <h3>Việc cần chú ý</h3>
              </div>
              <button
                aria-label="Đóng thông báo"
                className="instructor-profile-popover-close"
                onClick={() => setShowNotificationModal(false)}
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {notificationError && <p className="instructor-notification-error">{notificationError}</p>}

            {pushState === "default" || pushState === "granted" ? (
              <button
                className="instructor-notification-push-button"
                onClick={() => void enablePush()}
                type="button"
              >
                <span className="material-symbols-outlined">notifications_active</span>
                Bật thông báo đẩy
              </button>
            ) : null}

            {pushState === "denied" ? (
              <p className="instructor-notification-error">
                Trình duyệt đang chặn thông báo đẩy.
              </p>
            ) : null}

            <div className="instructor-notification-list">
              {isLoadingNotifications ? (
                <p className="instructor-empty-state">Đang tải thông báo...</p>
              ) : notifications.length === 0 ? (
                <p className="instructor-empty-state">Chưa có thông báo mới.</p>
              ) : (
                notifications.map((item) => (
                  <article className={item.isRead ? "is-read" : ""} key={item.id}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.time}</span>
                    </div>
                    <p>{item.content}</p>
                    {!item.isRead && (
                      <button
                        disabled={markingNotificationId === item.id}
                        onClick={() => handleMarkNotificationRead(item.id)}
                        type="button"
                      >
                        {markingNotificationId === item.id ? "Đang lưu..." : "Đánh dấu đã đọc"}
                      </button>
                    )}
                  </article>
                ))
              )}
            </div>

            <NavLink className="instructor-profile-popover-link" to="/instructor/interaction">
              Xem tất cả thông báo
            </NavLink>
          </aside>
        </div>
      )}
    </div>
  );
}

function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((character) => character.charCodeAt(0)));
}

export default InstructorLayout;
