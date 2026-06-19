import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getIntlLocale } from "../../i18n/locale";
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

function getCourseImage(course: StudentCourseDetail) {
  return course.thumbnailUrl?.startsWith("http") ? course.thumbnailUrl : fallbackImage;
}

function CourseDetailPage({ courseId, onBack }: CourseDetailPageProps) {
  const { t, i18n } = useTranslation("student");
  const language = i18n.resolvedLanguage;
  const [course, setCourse] = useState<StudentCourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  function formatCurrency(value: number) {
    return new Intl.NumberFormat(getIntlLocale(language), {
      currency: "VND",
      maximumFractionDigits: 0,
      style: "currency",
    }).format(value);
  }

  function formatDuration(minutes: number) {
    if (minutes < 60) {
      return t("courseDetail.durationMinutes", { count: minutes });
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes
      ? t("courseDetail.durationHoursMinutes", {
          hours,
          minutes: remainingMinutes,
        })
      : t("courseDetail.durationHours", { count: hours });
  }

  function formatDate(value: string | null) {
    if (!value) {
      return t("courseDetail.notUpdated");
    }
    return new Intl.DateTimeFormat(getIntlLocale(language)).format(new Date(value));
  }

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
      .catch(() => {
        if (isMounted) {
          setError(t("courseDetail.loadError"));
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
  }, [courseId, t]);

  if (isLoading) {
    return <main className="sp-course-detail-page">{t("courseDetail.loading")}</main>;
  }

  if (error || !course) {
    return (
      <main className="sp-course-detail-page">
        <button className="sp-back-button" onClick={onBack} type="button">
          <Icon name="chevron_left" /> {t("courseDetail.back")}
        </button>
        <p className="sp-state-line error">{error || t("courseDetail.notFound")}</p>
      </main>
    );
  }

  const purchasableBatch =
    course.batches.find((batch) => batch.status === "OPEN") ??
    course.batches.find((batch) => batch.status === "STARTED");

  async function handleAddToCart() {
    if (!purchasableBatch) {
      setCartMessage(t("courseDetail.noBatchForCart"));
      return;
    }
    setIsAddingToCart(true);
    setCartMessage("");
    try {
      await addCartItem(purchasableBatch.id);
      setCartMessage(t("courseDetail.addedToCart"));
    } catch {
      setCartMessage(t("courseDetail.addToCartError"));
    } finally {
      setIsAddingToCart(false);
    }
  }

  return (
    <main className="sp-course-detail-page">
      <button className="sp-back-button" onClick={onBack} type="button">
        <Icon name="chevron_left" /> {t("courseDetail.backToList")}
      </button>

      <section className="sp-course-detail-hero">
        <div>
          <p className="sp-eyebrow">{course.category.name}</p>
          <h1>{course.name}</h1>
          <p>{course.description}</p>
          <div className="sp-detail-meta">
            <span>
              <Icon name="star" /> {course.stats.averageRating.toFixed(1)} (
              {t("courseDetail.reviews", { count: course.stats.reviewCount })})
            </span>
            <span>
              <Icon name="person" /> {course.teacher.fullName}
            </span>
            <span>
              <Icon name="signal_cellular_alt" />{" "}
              {t(`courses.levels.${course.level}`)}
            </span>
          </div>
        </div>
        <img src={getCourseImage(course)} alt={course.name} />
      </section>

      <section className="sp-course-detail-layout">
        <div className="sp-course-detail-main">
          <article className="sp-detail-section">
            <h2>{t("courseDetail.about")}</h2>
            <p>{course.description}</p>
            <div className="sp-detail-stat-grid">
              <span>{t("courseDetail.modules", { count: course.stats.moduleCount })}</span>
              <span>{t("courseDetail.lessons", { count: course.stats.lessonCount })}</span>
              <span>
                <strong>{formatDuration(course.stats.totalDurationMinutes)}</strong>{" "}
                {t("courseDetail.duration")}
              </span>
              <span>
                {t("courseDetail.enrollments", {
                  count: course.stats.enrollmentCount,
                })}
              </span>
            </div>
          </article>

          <article className="sp-detail-section">
            <h2>{t("courseDetail.curriculum")}</h2>
            <div className="sp-module-list">
              {course.modules.map((module) => (
                <section className="sp-module-card" key={module.id}>
                  <header>
                    <span>{String(module.orderNo).padStart(2, "0")}</span>
                    <div>
                      <h3>{module.title}</h3>
                      {module.description ? <p>{module.description}</p> : null}
                    </div>
                    <small>
                      {t("courseDetail.lessons", { count: module.lessons.length })}
                    </small>
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
                              ? ` • ${t("courseDetail.resources", { count: lesson.resources.length })}`
                              : ""}
                            {lesson.assignments.length
                              ? ` • ${t("courseDetail.assignments", { count: lesson.assignments.length })}`
                              : ""}
                            {lesson.quizzes.length
                              ? ` • ${t("courseDetail.quizzes", { count: lesson.quizzes.length })}`
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
            <h2>{t("courseDetail.recentReviews")}</h2>
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
                      <p>{review.comment ?? t("courseDetail.noComment")}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p>{t("courseDetail.noReviews")}</p>
            )}
          </article>
        </div>

        <aside className="sp-course-detail-side">
          <div className="sp-detail-price-card">
            <strong>{formatCurrency(course.price)}</strong>
            <button type="button">{t("courseDetail.enrollNow")}</button>
            <button
              disabled={isAddingToCart || !purchasableBatch}
              onClick={() => void handleAddToCart()}
              type="button"
            >
              {!purchasableBatch
                ? t("courseDetail.notForSale")
                : isAddingToCart
                  ? t("courseDetail.adding")
                  : t("courseDetail.addToCart")}
            </button>
            {cartMessage ? <p className="sp-cart-message">{cartMessage}</p> : null}
          </div>

          <div className="sp-detail-section compact">
            <h2>{t("courseDetail.batches")}</h2>
            {course.batches.length ? (
              course.batches.map((batch) => (
                <article className="sp-batch-card" key={batch.id}>
                  <h3>{batch.name}</h3>
                  <p>
                    {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                  </p>
                  <span>
                    {t(`courseDetail.status.${batch.status}`, {
                      defaultValue: batch.status,
                    })}
                  </span>
                  <small>
                    {t(`courseDetail.mode.${batch.learningMode}`)} •{" "}
                    {batch.onlinePlatform}
                  </small>
                  <small>
                    {t("courseDetail.capacity", {
                      min: batch.minStudents,
                      max: batch.maxStudents,
                    })}
                  </small>
                  <small>
                    {t("courseDetail.batchStudents", {
                      enrolled: batch.stats.enrollmentCount,
                      active: batch.stats.activeEnrollmentCount,
                    })}
                  </small>
                  <small>
                    {t("courseDetail.sessions", { count: batch.sessions.length })}
                  </small>
                </article>
              ))
            ) : (
              <p>{t("courseDetail.noBatches")}</p>
            )}
          </div>

          <div className="sp-detail-section compact">
            <h2>{t("courseDetail.upcomingSchedule")}</h2>
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
                    <span>
                      {t(`courseDetail.status.${session.status}`, {
                        defaultValue: session.status,
                      })}
                    </span>
                  </article>
                ))
            ) : (
              <p>{t("courseDetail.noSchedule")}</p>
            )}
          </div>

          <div className="sp-detail-section compact">
            <h2>{t("courseDetail.instructor")}</h2>
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
