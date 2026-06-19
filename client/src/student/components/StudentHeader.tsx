import { useTranslation } from "react-i18next";
import logo from "../../assets/logo-learnX.png";
import type { AuthUser } from "../../auth/auth.types";
import { normalizeLanguage } from "../../i18n/locale";
import type { StudentView } from "../types/student.types";
import { resolveMediaUrl } from "../utils/mediaUrl";
import Icon from "./Icon";
import NotificationBell from "../../shared/components/notifications/NotificationBell";

type StudentHeaderProps = {
  activeView: StudentView;
  onNavigate: (view: StudentView) => void;
  onOpenAccountDrawer: () => void;
  user: AuthUser | null;
};

const navItems: Array<{ label: string; labelKey: string; view: StudentView }> = [
  { label: "Khóa học", labelKey: "header.nav.courses", view: "courses" },
  { label: "Khóa học của tôi", labelKey: "header.nav.myCourses", view: "myCourses" },
  { label: "Lịch học", labelKey: "header.nav.schedule", view: "schedule" },
  { label: "Giỏ hàng", labelKey: "header.nav.cart", view: "cart" },
  { label: "Tương tác", labelKey: "header.nav.interaction", view: "interaction" },
];

function StudentHeader({
  activeView,
  onNavigate,
  onOpenAccountDrawer,
  user,
}: StudentHeaderProps) {
  const { t, i18n } = useTranslation(["student", "common"]);
  const currentLanguage = normalizeLanguage(i18n.resolvedLanguage);

  return (
    <header className="sp-header">
      <button className="sp-brand" type="button" onClick={() => onNavigate("home")}>
        <img alt="LearnX" src={logo} />
      </button>

      <nav className="sp-nav">
        {navItems.map((item) => (
          <button
            key={item.view}
            className={
              activeView === item.view ||
              (item.view === "myCourses" &&
                (activeView === "lesson" || activeView === "learning"))
                ? "active"
                : ""
            }
            type="button"
            onClick={() => onNavigate(item.view)}
          >
            {t(item.labelKey, { defaultValue: item.label })}
          </button>
        ))}
        <button
          className={
            activeView === "exam" ||
            activeView === "examTake" ||
            activeView === "examReview"
              ? "active"
              : ""
          }
          type="button"
          onClick={() => onNavigate("exam")}
        >
          {t("header.nav.exams")}
        </button>
      </nav>

      <div className="sp-header-actions">
        <label className="sp-search">
          <Icon name="search" />
          <input placeholder={t("header.searchPlaceholder")} />
        </label>

        <label className="sp-language-select">
          <Icon name="language" />
          <select
            aria-label={t("language.label", { ns: "common" })}
            value={currentLanguage}
            onChange={(event) => void i18n.changeLanguage(event.target.value)}
          >
            <option value="vi">{t("language.vi", { ns: "common" })}</option>
            <option value="en">{t("language.en", { ns: "common" })}</option>
          </select>
        </label>

        <NotificationBell
          className="student-notification-bell"
          icon={<Icon name="notifications" />}
          onOpenNotification={(notification) => {
            if (notification.type.includes("EXAM")) {
              onNavigate("exam");
            } else if (notification.type.includes("ASSIGNMENT")) {
              onNavigate("myCourses");
            } else if (notification.type.includes("PAYMENT")) {
              onNavigate("accountPaymentHistory");
            } else if (notification.type.includes("COURSE")) {
              onNavigate("myCourses");
            }
          }}
        />
        <button
          type="button"
          aria-label={t("header.cart")}
          onClick={() => onNavigate("cart")}
        >
          <Icon name="shopping_cart" />
        </button>
        <button
          className="sp-avatar"
          type="button"
          aria-label={t("header.account")}
          onClick={onOpenAccountDrawer}
        >
          <img
            src={
              resolveMediaUrl(user?.avatarUrl) ??
              `https://api.dicebear.com/9.x/personas/svg?seed=${user?.email ?? "Scholar"}`
            }
            alt=""
          />
        </button>
      </div>
    </header>
  );
}

export default StudentHeader;

