import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import { getMyCourses } from "../services/studentCoursesApi";
import type { StudentEnrolledCourse } from "../types/course.types";

type MyCoursesPageProps = {
  onStartLearning: (courseId: number) => void;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";

function getCourseImage(thumbnailUrl: string | null) {
  return thumbnailUrl?.startsWith("http") ? thumbnailUrl : fallbackImage;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
}

function MyCoursesPage({ onStartLearning }: MyCoursesPageProps) {
  const [courses, setCourses] = useState<StudentEnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setError("");

    getMyCourses()
      .then((data) => {
        if (isMounted) {
          setCourses(data);
        }
      })
      .catch((fetchError) => {
        if (isMounted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Không thể tải khóa học của bạn.",
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="sp-my-courses-page">
      <section className="sp-my-courses-hero">
        <p className="sp-eyebrow">Không gian học tập</p>
        <h1>Khóa học của bạn</h1>
        <p>
          Tiếp tục các khóa học đã đăng ký, theo dõi tiến độ và mở lộ trình bài
          học của từng lớp.
        </p>
      </section>

      {isLoading ? <p className="sp-state-line">Đang tải khóa học...</p> : null}
      {error ? <p className="sp-state-line error">{error}</p> : null}

      {!isLoading && !error && courses.length === 0 ? (
        <div className="sp-empty-cart">
          <Icon name="school" />
          <h2>Bạn chưa có khóa học nào</h2>
          <p>Hãy đăng ký hoặc thanh toán khóa học để bắt đầu học.</p>
        </div>
      ) : null}

      <div className="sp-my-course-grid">
        {courses.map((item) => {
          const canStudy =
            item.enrollment.status === "ACTIVE" ||
            item.enrollment.status === "COMPLETED";

          return (
            <article className="sp-my-course-card" key={item.enrollment.id}>
              <img
                src={getCourseImage(item.course.thumbnailUrl)}
                alt={item.course.name}
              />
              <div>
                <span>{item.course.category.name}</span>
                <h2>{item.course.name}</h2>
                <p>
                  Giảng viên: {item.course.teacher.fullName} • Lớp:{" "}
                  {item.batch.name}
                </p>
                <p>
                  Thời gian: {formatDate(item.batch.startDate)} -{" "}
                  {formatDate(item.batch.endDate)}
                </p>
                <div className="sp-progress-shell">
                  <span
                    style={{
                      width: `${Math.min(item.enrollment.progressPercent, 100)}%`,
                    }}
                  />
                </div>
                <small>
                  Tiến độ {item.enrollment.progressPercent}% •{" "}
                  {item.enrollment.status}
                </small>
              </div>
              <button
                disabled={!canStudy}
                onClick={() => onStartLearning(item.course.id)}
                type="button"
              >
                <Icon name={canStudy ? "play_circle" : "hourglass_top"} />
                {canStudy ? "Vào học" : "Chờ kích hoạt"}
              </button>
            </article>
          );
        })}
      </div>
    </main>
  );
}

export default MyCoursesPage;
