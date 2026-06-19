import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import AdminDataState from "../components/AdminDataState";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import type { AdminPage } from "../adminNavigation";
import { getAdminData, mutateAdminData } from "../services/adminApi";
import "../../index.css";

type Role = "ADMIN" | "TEACHER" | "STUDENT";
type Status = "ACTIVE" | "INACTIVE" | "LOCKED";
type PermissionKey = "users" | "courses" | "finance" | "system";

type UserRow = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: Role;
  status: Status;
  createdAt: string;
  courseCount: number;
  activityCount: number;
  permissions: Record<PermissionKey, boolean>;
};

type UserDetail = UserRow & {
  courses: Array<{ id: number; title: string; status: string; progress?: number }>;
  recentActivity: Array<{ type: string; title: string; activityTime: string }>;
};

type UsersPageData = {
  summary: {
    total: number;
    admins: number;
    teachers: number;
    students: number;
    locked: number;
  };
  users: UserRow[];
  permissionGroups: Array<{ key: PermissionKey; label: string }>;
};

const roleLabels: Record<Role, string> = {
  ADMIN: "Admin",
  TEACHER: "Giảng viên",
  STUDENT: "Học viên",
};

const statusLabels: Record<Status, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Không hoạt động",
  LOCKED: "Đã khóa",
};

type Props = {
  activePage: AdminPage;
  onNavigate: (page: AdminPage) => void;
};

function UserManagementPage({ activePage, onNavigate }: Props) {
  const [pageData, setPageData] = useState<UsersPageData | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [roleFilter, setRoleFilter] = useState<"ALL" | Role>("ALL");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      const data = await getAdminData<UsersPageData>("/users");
      setPageData(data);
      setError("");
      return data;
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Không thể tải danh sách người dùng.",
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadDetail = useCallback(async (userId: number) => {
    try {
      setSelectedUser(await getAdminData<UserDetail>(`/users/${userId}`));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Không thể tải hồ sơ.");
    }
  }, []);

  useEffect(() => {
    void loadUsers().then((data) => {
      if (data?.users[0]) void loadDetail(data.users[0].id);
    });
  }, [loadDetail, loadUsers]);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi");
    return (pageData?.users ?? []).filter(
      (user) =>
        (roleFilter === "ALL" || user.role === roleFilter) &&
        (!keyword ||
          user.name.toLocaleLowerCase("vi").includes(keyword) ||
          user.email.toLocaleLowerCase("vi").includes(keyword)),
    );
  }, [pageData, roleFilter, search]);

  async function updateUser(changes: Partial<Pick<UserRow, "role" | "status">>) {
    if (!selectedUser) return;
    setIsSaving(true);
    try {
      const detail = await mutateAdminData<UserDetail>(
        `/users/${selectedUser.id}`,
        "PATCH",
        changes,
      );
      setSelectedUser(detail);
      await loadUsers();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Cập nhật thất bại.");
    } finally {
      setIsSaving(false);
    }
  }

  async function togglePermission(key: PermissionKey) {
    if (!selectedUser || selectedUser.role !== "ADMIN") return;
    setIsSaving(true);
    try {
      const detail = await mutateAdminData<UserDetail>(
        `/users/${selectedUser.id}/permissions`,
        "PUT",
        { ...selectedUser.permissions, [key]: !selectedUser.permissions[key] },
      );
      setSelectedUser(detail);
      await loadUsers();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Cập nhật quyền thất bại.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!pageData) {
    return <AdminDataState error={error} isLoading={isLoading} />;
  }

  return (
    <div className="admin-shell">
      <AdminSidebar
        activePage={activePage}
        description="Quản lý tài khoản, vai trò và quyền truy cập toàn hệ thống."
        onNavigate={onNavigate}
      />
      <main className="main-panel">
        <AdminTopbar searchPlaceholder="Tìm người dùng..." />
        <section className="content user-management-page">
          <div className="hero">
            <p className="eyebrow">Quản trị truy cập</p>
            <h1>Quản lý người dùng</h1>
            <p className="hero-copy">
              Theo dõi hồ sơ, hoạt động, vai trò và quyền quản trị của toàn bộ tài khoản.
            </p>
          </div>

          <section className="user-summary-grid">
            {[
              ["Tổng người dùng", pageData.summary.total],
              ["Admin", pageData.summary.admins],
              ["Giảng viên", pageData.summary.teachers],
              ["Học viên", pageData.summary.students],
              ["Tài khoản khóa", pageData.summary.locked],
            ].map(([label, value]) => (
              <article className="panel user-summary-card" key={label}>
                <p>{label}</p>
                <strong>{value}</strong>
              </article>
            ))}
          </section>

          <section className="user-filter-bar">
            <label className="user-search">
              <span className="material-symbols-outlined">search</span>
              <input
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo tên hoặc email"
                value={search}
              />
            </label>
            <div className="student-segments">
              {(["ALL", "ADMIN", "TEACHER", "STUDENT"] as const).map((role) => (
                <button
                  className={roleFilter === role ? "active" : ""}
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  type="button"
                >
                  {role === "ALL" ? "Tất cả" : roleLabels[role]}
                </button>
              ))}
            </div>
          </section>

          {error ? <p className="user-error">{error}</p> : null}

          <section className="user-management-layout">
            <div className="panel user-table-panel">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Vai trò</th>
                    <th>Khóa học</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      className={selectedUser?.id === user.id ? "selected" : ""}
                      key={user.id}
                      onClick={() => void loadDetail(user.id)}
                    >
                      <td>
                        <div className="student-profile">
                          <img
                            alt={user.name}
                            src={
                              user.avatar ||
                              `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(user.email)}`
                            }
                          />
                          <div>
                            <p className="student-name">{user.name}</p>
                            <p className="student-email">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>{roleLabels[user.role]}</td>
                      <td>{user.courseCount}</td>
                      <td>
                        <span className={`user-status ${user.status.toLowerCase()}`}>
                          {statusLabels[user.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filteredUsers.length ? (
                <div className="admin-filter-empty">Không tìm thấy người dùng phù hợp.</div>
              ) : null}
            </div>

            {selectedUser ? (
              <aside className="panel user-detail-panel">
                <div className="user-detail-profile">
                  <img
                    alt={selectedUser.name}
                    src={
                      selectedUser.avatar ||
                      `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(selectedUser.email)}`
                    }
                  />
                  <div>
                    <h3>{selectedUser.name}</h3>
                    <p>{selectedUser.email}</p>
                    <small>
                      Tham gia {new Date(selectedUser.createdAt).toLocaleDateString("vi-VN")}
                    </small>
                  </div>
                </div>

                <section className="user-control-section">
                  <h4>Vai trò và trạng thái</h4>
                  <label>
                    Vai trò
                    <select
                      disabled={isSaving}
                      onChange={(event) => void updateUser({ role: event.target.value as Role })}
                      value={selectedUser.role}
                    >
                      {Object.entries(roleLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    className={selectedUser.status === "LOCKED" ? "user-unlock-button" : "user-lock-button"}
                    disabled={isSaving}
                    onClick={() =>
                      void updateUser({
                        status: selectedUser.status === "LOCKED" ? "ACTIVE" : "LOCKED",
                      })
                    }
                    type="button"
                  >
                    {selectedUser.status === "LOCKED" ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                  </button>
                </section>

                <section className="user-control-section">
                  <h4>Phân quyền chức năng</h4>
                  {selectedUser.role === "ADMIN" ? (
                    <div className="user-permission-list">
                      {pageData.permissionGroups.map((permission) => (
                        <label key={permission.key}>
                          <input
                            checked={selectedUser.permissions[permission.key]}
                            disabled={isSaving}
                            onChange={() => void togglePermission(permission.key)}
                            type="checkbox"
                          />
                          <span>{permission.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="user-muted">Nhóm quyền chỉ áp dụng cho tài khoản Admin.</p>
                  )}
                </section>

                <UserRelatedSection title="Khóa học liên quan">
                  {selectedUser.courses.length ? selectedUser.courses.map((course) => (
                    <div key={course.id}>
                      <strong>{course.title}</strong>
                      <span>
                        {course.progress === undefined ? course.status : `${course.progress}% hoàn thành`}
                      </span>
                    </div>
                  )) : <p className="user-muted">Chưa có khóa học liên quan.</p>}
                </UserRelatedSection>

                <UserRelatedSection title="Hoạt động gần đây">
                  {selectedUser.recentActivity.length ? selectedUser.recentActivity.map((activity, index) => (
                    <div key={`${activity.type}-${index}`}>
                      <strong>{activity.title}</strong>
                      <span>{new Date(activity.activityTime).toLocaleString("vi-VN")}</span>
                    </div>
                  )) : <p className="user-muted">Chưa có hoạt động.</p>}
                </UserRelatedSection>
              </aside>
            ) : null}
          </section>
        </section>
      </main>
    </div>
  );
}

function UserRelatedSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="user-control-section">
      <h4>{title}</h4>
      <div className="user-related-list">{children}</div>
    </section>
  );
}

export default UserManagementPage;
