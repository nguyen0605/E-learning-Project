import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { instructorApiRequest } from "../api/instructorApi";
import {
  getInstructorAuthSession,
  setInstructorAuthSession,
  type InstructorAuthSession,
} from "../auth/instructorAuth";
import "./InstructorPortal.css";

type InstructorAuthPageProps = {
  mode: "login" | "register";
};

type InstructorAuthApiResponse = {
  success: boolean;
  message?: string;
  data: InstructorAuthSession;
};

function InstructorAuthPage({ mode }: InstructorAuthPageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: mode === "login" ? "gv02@elearning.vn" : "",
    password: mode === "login" ? "password" : "",
    phone: "",
    specialization: "",
    workplace: "E-learning Center",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isRegister = mode === "register";

  if (getInstructorAuthSession()) {
    return <Navigate to="/instructor" replace />;
  }

  function updateField(field: keyof typeof formData, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = await instructorApiRequest<InstructorAuthApiResponse>(`/api/instructor/auth/${mode}`, {
        method: "POST",
        body: formData,
      });
      if (!payload.success) {
        throw new Error(payload?.message ?? "Không thể xác thực tài khoản giảng viên.");
      }

      setInstructorAuthSession(payload.data);
      navigate("/instructor", { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Không thể xác thực tài khoản giảng viên.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="instructor-auth-shell">
      <section className="instructor-auth-visual">
        <div className="instructor-brand-mark">
          <span className="material-symbols-outlined">school</span>
        </div>
        <p className="instructor-eyebrow">Cổng giảng viên</p>
        <h1>Học viện Lumina</h1>
        <p>
          Đăng nhập để quản lý khóa học, lớp học, bài kiểm tra, học viên và các tương tác trong
          không gian giảng dạy.
        </p>
      </section>

      <section className="instructor-auth-card">
        <div>
          <p className="instructor-eyebrow">{isRegister ? "Tạo tài khoản" : "Đăng nhập"}</p>
          <h2>{isRegister ? "Đăng ký giảng viên" : "Chào mừng quay lại"}</h2>
          <p>
            {isRegister
              ? "Tạo tài khoản giảng viên mới để bắt đầu xây dựng khóa học."
              : "Dùng tài khoản giảng viên để vào khu vực quản lý."}
          </p>
        </div>

        <form className="instructor-auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label>
                <span>Họ tên</span>
                <input
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="VD: Nguyễn Minh Anh"
                />
              </label>

              <label>
                <span>Chuyên môn</span>
                <input
                  value={formData.specialization}
                  onChange={(event) => updateField("specialization", event.target.value)}
                  placeholder="VD: Lập trình Web"
                />
              </label>
            </>
          )}

          <label>
            <span>Email</span>
            <input
              type="email"
              value={formData.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="gv02@elearning.vn"
            />
          </label>

          <label>
            <span>Mật khẩu</span>
            <input
              type="password"
              value={formData.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Tối thiểu 6 ký tự"
            />
          </label>

          {isRegister && (
            <label>
              <span>Số điện thoại</span>
              <input
                value={formData.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="VD: 0912345678"
              />
            </label>
          )}

          {error && <p className="instructor-auth-error">{error}</p>}

          <button className="instructor-primary-button" disabled={isSubmitting} type="submit">
            <span className="material-symbols-outlined">{isRegister ? "person_add" : "login"}</span>
            {isSubmitting ? "Đang xử lý..." : isRegister ? "Đăng ký" : "Đăng nhập"}
          </button>
        </form>

        <p className="instructor-auth-switch">
          {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}
          <NavLink to={isRegister ? "/instructor/login" : "/instructor/register"}>
            {isRegister ? "Đăng nhập" : "Đăng ký"}
          </NavLink>
        </p>

        {!isRegister && (
          <div className="instructor-auth-demo">
            <strong>Tài khoản demo</strong>
            <span>Email: gv02@elearning.vn</span>
            <span>Mật khẩu: password</span>
          </div>
        )}
      </section>
    </main>
  );
}

export default InstructorAuthPage;
