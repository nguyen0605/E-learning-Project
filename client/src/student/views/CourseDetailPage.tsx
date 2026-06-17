import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import { addCartItem } from "../services/studentCartApi";
import { getCourseDetail } from "../services/studentCoursesApi";
import type { StudentCourseDetail } from "../types/course.types";

type CourseDetailPageProps = {
  courseId: number;
  onBack: () => void;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    currency: "VND",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} phút`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes ? `${hours} giờ ${remainingMinutes} phút` : `${hours} giờ`;
}

function formatDate(value: string | null) {
  if (!value) {
    return "Chưa cập nhật";
  }

  return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
}

function getCourseImage(course: StudentCourseDetail) {
  return course.thumbnailUrl?.startsWith("http") ? course.thumbnailUrl : fallbackImage;
}

function CourseDetailPage({ courseId, onBack }: CourseDetailPageProps) {
  const [course, setCourse] = useState<StudentCourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setError("");

    getCourseDetail(courseId)
      .then((data) => {
        if (isMounted) {
          setCourse(data);
        }
      })
      .catch((fetchError) => {
        if (isMounted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Không thể tải chi tiết khóa học.",
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
  }, [courseId]);

  if (isLoading) {
    return <main className="sp-course-detail-page">Đang tải chi tiết khóa học...</main>;
  }

  if (error || !course) {
    return (
      <main className="sp-course-detail-page">
        <button className="sp-back-button" onClick={onBack} type="button">
          <Icon name="chevron_left" /> Quay lại
        </button>
        <p className="sp-state-line error">{error || "Không tìm thấy khóa học."}</p>
      </main>
    );
  }

  const purchasableBatch =
    course.batches.find((batch) => batch.status === "OPEN") ??
    course.batches.find((batch) => batch.status === "STARTED");

  async function handleAddToCart() {
    if (!purchasableBatch) {
      setCartMessage("Khóa học này chưa có đợt mở lớp để thêm vào giỏ hàng.");
      return;
    }

    setIsAddingToCart(true);
    setCartMessage("");

    try {
      await addCartItem(purchasableBatch.id);
      setCartMessage("Đã thêm khóa học vào giỏ hàng.");
    } catch (addError) {
      setCartMessage(
        addError instanceof Error
          ? addError.message
          : "Không thể thêm khóa học vào giỏ hàng.",
      );
    } finally {
      setIsAddingToCart(false);
    }
  }

  return (
    <main className="sp-course-detail-page">
      <button className="sp-back-button" onClick={onBack} type="button">
        <Icon name="chevron_left" /> Quay lại danh sách
      </button>

      <section className="sp-course-detail-hero">
        <div>
          <p className="sp-eyebrow">{course.category.name}</p>
          <h1>{course.name}</h1>
          <p>{course.description}</p>
          <div className="sp-detail-meta">
            <span>
              <Icon name="star" /> {course.stats.averageRating.toFixed(1)} (
              {course.stats.reviewCount} đánh giá)
            </span>
            <span>
              <Icon name="person" /> {course.teacher.fullName}
            </span>
            <span>
              <Icon name="signal_cellular_alt" /> {course.level}
            </span>
          </div>
        </div>
        <img src={getCourseImage(course)} alt={course.name} />
      </section>

      <section className="sp-course-detail-layout">
        <div className="sp-course-detail-main">
          <article className="sp-detail-section">
            <h2>Về khóa học này</h2>
            <p>{course.description}</p>
            <div className="sp-detail-stat-grid">
              <span>
                <strong>{course.stats.moduleCount}</strong> chương học
              </span>
              <span>
                <strong>{course.stats.lessonCount}</strong> bài học
              </span>
              <span>
                <strong>{formatDuration(course.stats.totalDurationMinutes)}</strong>{" "}
                thời lượng
              </span>
              <span>
                <strong>{course.stats.enrollmentCount}</strong> lượt đăng ký
              </span>
            </div>
          </article>

          <article className="sp-detail-section">
            <h2>Nội dung chương trình</h2>
            <div className="sp-module-list">
              {course.modules.map((module) => (
                <section className="sp-module-card" key={module.id}>
                  <header>
                    <span>{String(module.orderNo).padStart(2, "0")}</span>
                    <div>
                      <h3>{module.title}</h3>
                      {module.description ? <p>{module.description}</p> : null}
                    </div>
                    <small>{module.lessons.length} bài học</small>
                  </header>
                  <div className="sp-lesson-list">
                    {module.lessons.map((lesson) => (
                      <div className="sp-detail-lesson-row" key={lesson.id}>
                        <span className="material-symbols-outlined">
                          {lesson.isPreview ? "play_circle" : "lock"}
                        </span>
                        <div>
                          <strong>{lesson.title}</strong>
                          <small>
                            {lesson.type} • {formatDuration(lesson.durationMinutes)}
                            {lesson.resources.length
                              ? ` • ${lesson.resources.length} tài liệu`
                              : ""}
                            {lesson.assignments.length
                              ? ` • ${lesson.assignments.length} bài tập`
                              : ""}
                            {lesson.quizzes.length
                              ? ` • ${lesson.quizzes.length} quiz`
                              : ""}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>

          <article className="sp-detail-section">
            <h2>Đánh giá gần đây</h2>
            {course.reviews.length ? (
              <div className="sp-review-list">
                {course.reviews.map((review) => (
                  <article className="sp-review-card" key={review.id}>
                    <img
                      src={
                        review.student.avatarUrl ??
                        `https://api.dicebear.com/9.x/personas/svg?seed=${review.student.id}`
                      }
                      alt=""
                    />
                    <div>
                      <strong>{review.student.fullName}</strong>
                      <span>{review.rating}/5</span>
                      <p>{review.comment ?? "Học viên chưa để lại nhận xét."}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p>Khóa học này chưa có đánh giá.</p>
            )}
          </article>
        </div>

        <aside className="sp-course-detail-side">
          <div className="sp-detail-price-card">
            <strong>{formatCurrency(course.price)}</strong>
            <button type="button">Ghi danh ngay</button>
            <button
              disabled={isAddingToCart || !purchasableBatch}
              onClick={handleAddToCart}
              type="button"
            >
              {!purchasableBatch
                ? "Chưa mở bán"
                : isAddingToCart
                  ? "Đang thêm..."
                  : "Thêm vào giỏ hàng"}
            </button>
            {cartMessage ? <p className="sp-cart-message">{cartMessage}</p> : null}
          </div>

          <div className="sp-detail-section compact">
            <h2>Đợt mở lớp</h2>
            {course.batches.length ? (
              course.batches.map((batch) => (
                <article className="sp-batch-card" key={batch.id}>
                  <h3>{batch.name}</h3>
                  <p>
                    {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                  </p>
                  <span>{batch.status}</span>
                  <small>
                    {batch.learningMode} • {batch.onlinePlatform}
                  </small>
                  <small>
                    Sĩ số {batch.minStudents}-{batch.maxStudents}
                  </small>
                  <small>
                    {batch.stats.enrollmentCount} đăng ký •{" "}
                    {batch.stats.activeEnrollmentCount} đang học
                  </small>
                  <small>
                    {batch.sessions.length} buổi học
                  </small>
                </article>
              ))
            ) : (
              <p>Chưa có đợt mở lớp.</p>
            )}
          </div>

          <div className="sp-detail-section compact">
            <h2>Lịch học gần nhất</h2>
            {course.batches.flatMap((batch) => batch.sessions).length ? (
              course.batches
                .flatMap((batch) => batch.sessions)
                .slice(0, 5)
                .map((session) => (
                  <article className="sp-batch-card" key={session.id}>
                    <h3>{session.title}</h3>
                    <p>
                      {formatDate(session.startTime)} • {session.platform}
                    </p>
                    <span>{session.status}</span>
                  </article>
                ))
            ) : (
              <p>Chưa có lịch học.</p>
            )}
          </div>

          <div className="sp-detail-section compact">
            <h2>Giảng viên</h2>
            <p className="sp-detail-teacher">
              <img
                src={
                  course.teacher.avatarUrl ??
                  `https://api.dicebear.com/9.x/personas/svg?seed=${course.teacher.email}`
                }
                alt=""
              />
              <span>
                <strong>{course.teacher.fullName}</strong>
                <small>{course.teacher.email}</small>
              </span>
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default CourseDetailPage;
