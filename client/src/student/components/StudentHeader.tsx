import type { StudentView } from "../types/student.types";
import Icon from "./Icon";

type StudentHeaderProps = {
  activeView: StudentView;
  onNavigate: (view: StudentView) => void;
};

const navItems: Array<{ label: string; view: StudentView }> = [
  { label: "Khoá học", view: "courses" },
  { label: "Sản phẩm", view: "categories" },
  { label: "Giỏ hàng", view: "cart" },
  { label: "Tương tác", view: "interaction" },
];

function StudentHeader({ activeView, onNavigate }: StudentHeaderProps) {
  return (
    <header className="sp-header">
      <button className="sp-brand" type="button" onClick={() => onNavigate("home")}>
        Scholar
      </button>
      <nav className="sp-nav">
        {navItems.map((item) => (
          <button
            key={item.view}
            className={
              activeView === item.view ||
              (item.view === "courses" && activeView === "lesson")
                ? "active"
                : ""
            }
            type="button"
            onClick={() => onNavigate(item.view)}
          >
            {item.label}
          </button>
        ))}
        <button
          className={activeView === "exam" ? "active" : ""}
          type="button"
          onClick={() => onNavigate("exam")}
        >
          Bài kiểm tra
        </button>
      </nav>
      <div className="sp-header-actions">
        <label className="sp-search">
          <Icon name="search" />
          <input placeholder="Search lessons..." />
        </label>
        <button type="button" aria-label="Notifications">
          <Icon name="notifications" />
        </button>
        <button type="button" aria-label="Cart" onClick={() => onNavigate("cart")}>
          <Icon name="shopping_cart" />
        </button>
        <button className="sp-avatar" type="button" aria-label="Profile">
          <img src="https://api.dicebear.com/9.x/personas/svg?seed=Scholar" alt="" />
        </button>
      </div>
    </header>
  );
}

export default StudentHeader;
