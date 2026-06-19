export type AdminPage =
  | "dashboard"
  | "users"
  | "students"
  | "courses"
  | "system"
  | "content";

export const adminPagePaths: Record<AdminPage, string> = {
  dashboard: "/admin",
  users: "/admin/users",
  students: "/admin/students",
  courses: "/admin/courses",
  system: "/admin/system",
  content: "/admin/content",
};

export function getAdminPageFromPath(pathname: string): AdminPage | null {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";

  if (normalizedPath === "/admin") {
    return "dashboard";
  }

  const matchedEntry = Object.entries(adminPagePaths).find(
    ([page, path]) => page !== "dashboard" && path === normalizedPath,
  );

  return (matchedEntry?.[0] as AdminPage | undefined) ?? null;
}
