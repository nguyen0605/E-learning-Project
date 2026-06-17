import { getAuthHeaders } from "../../auth/authHeaders";
import type {
  StudentCourse,
  StudentCourseCategory,
  StudentCourseDetail,
  StudentEnrolledCourse,
} from "../types/course.types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

async function readApiData<T>(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      response.status === 404
        ? "API khóa học chưa sẵn sàng. Vui lòng khởi động lại backend."
        : "Backend không trả về dữ liệu JSON hợp lệ.",
    );
  }

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success || payload.data === undefined) {
    throw new Error(payload.message ?? "Không thể tải dữ liệu.");
  }

  return payload.data;
}

export async function getCourseCategories() {
  const response = await fetch(`${API_BASE_URL}/api/student/course-categories`, {
    headers: getAuthHeaders(),
  });

  return readApiData<StudentCourseCategory[]>(response);
}

export async function getCourses(filters: {
  categoryId?: number | null;
  level?: string;
  search?: string;
} = {}) {
  const params = new URLSearchParams();

  if (filters.categoryId) {
    params.set("categoryId", String(filters.categoryId));
  }

  if (filters.level) {
    params.set("level", filters.level);
  }

  if (filters.search) {
    params.set("search", filters.search);
  }

  const query = params.toString();
  const response = await fetch(
    `${API_BASE_URL}/api/student/courses${query ? `?${query}` : ""}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return readApiData<StudentCourse[]>(response);
}

export async function getCourseDetail(courseId: number) {
  const response = await fetch(`${API_BASE_URL}/api/student/courses/${courseId}`, {
    headers: getAuthHeaders(),
  });

  return readApiData<StudentCourseDetail>(response);
}

export async function getMyCourses() {
  const response = await fetch(`${API_BASE_URL}/api/student/my-courses`, {
    headers: getAuthHeaders(),
  });

  return readApiData<StudentEnrolledCourse[]>(response);
}
