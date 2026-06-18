import { useEffect, useState } from "react";
import { instructorApiRequest } from "../api/instructorApi";
import { getInstructorAuthTeacherId } from "../auth/instructorAuth";
import InstructorLayout from "../components/InstructorLayout";
import {
  analyticsRecommendations,
  analyticsStats,
  courseInsights,
  engagementTrend,
  learnerSegments,
} from "../data/instructorMockData";

const DEFAULT_TEACHER_ID = getInstructorAuthTeacherId();

type AnalyticsStat = (typeof analyticsStats)[number];
type EngagementItem = (typeof engagementTrend)[number];
type LearnerSegment = (typeof learnerSegments)[number];
type CourseInsight = (typeof courseInsights)[number];
type AnalyticsRecommendation = (typeof analyticsRecommendations)[number];

type InstructorAnalyticsApiResponse = {
  success: boolean;
  data: {
    analyticsStats: AnalyticsStat[];
    engagementTrend: EngagementItem[];
    learnerSegments: LearnerSegment[];
    courseInsights: CourseInsight[];
    analyticsRecommendations: AnalyticsRecommendation[];
  };
};

function InstructorAnalyticsPage() {
  const [pageData, setPageData] =
    useState<InstructorAnalyticsApiResponse["data"] | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("Học kỳ này");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAnalytics() {
      try {
        const payload = await instructorApiRequest<InstructorAnalyticsApiResponse>(
          "/api/instructor/analytics",
          {
            query: { teacherId: DEFAULT_TEACHER_ID },
            signal: controller.signal,
          },
        );
        if (!payload.success) throw new Error("Analytics API returned unsuccessful response.");

        setPageData(payload.data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error(error);
      }
    }

    loadAnalytics();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const displayedStats = pageData?.analyticsStats ?? analyticsStats;
  const displayedEngagementTrend = pageData?.engagementTrend ?? engagementTrend;
  const displayedLearnerSegments = pageData?.learnerSegments ?? learnerSegments;
  const displayedCourseInsights = pageData?.courseInsights ?? courseInsights;
  const displayedRecommendations = pageData?.analyticsRecommendations ?? analyticsRecommendations;

  function csvCell(value: string | number) {
    return `"${String(value).replaceAll('"', '""')}"`;
  }

  function handleTogglePeriod() {
    const nextPeriod = selectedPeriod === "Học kỳ này" ? "30 ngày gần nhất" : "Học kỳ này";
    setSelectedPeriod(nextPeriod);
    setToast({ type: "success", message: `Đã chuyển bộ lọc sang ${nextPeriod}.` });
  }

  function handleExportAnalyticsReport() {
    const header = ["Khóa học", "Hoàn thành", "Điểm kiểm tra TB", "Chuyên cần", "Xu hướng"];
    const csv = [
      header.map(csvCell).join(","),
      ...displayedCourseInsights.map((course) =>
        [
          course.title,
          `${course.completion}%`,
          course.quizAverage,
          `${course.attendance}%`,
          course.trend,
        ].map(csvCell).join(","),
      ),
    ].join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `bao-cao-phan-tich-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setToast({ type: "success", message: "Đã xuất báo cáo phân tích CSV." });
  }

  return (
    <InstructorLayout activePage="analytics">
      <section className="instructor-hero instructor-analytics-hero">
        <div>
          <p className="instructor-eyebrow">Phân tích</p>
          <h2>Hiểu tín hiệu học tập</h2>
          <p>
            So sánh mức độ tương tác, hoàn thành, kết quả kiểm tra và tín hiệu
            rủi ro giữa các khóa học đang giảng dạy.
          </p>
        </div>
        <div className="instructor-hero-actions">
          <button className="instructor-secondary-button" onClick={handleTogglePeriod} type="button">
            <span className="material-symbols-outlined">date_range</span>
            {selectedPeriod}
          </button>
          <button className="instructor-primary-button" onClick={handleExportAnalyticsReport} type="button">
            <span className="material-symbols-outlined">download</span>
            Xuất báo cáo
          </button>
        </div>
      </section>

      <section className="instructor-stat-grid" aria-label="Tổng quan phân tích">
        {displayedStats.map((stat) => (
          <article className="instructor-stat-card" key={stat.label}>
            <div className={`instructor-stat-icon ${stat.tone}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <p>{stat.label}</p>
            <div>
              <strong>{stat.value}</strong>
              <span>{pageData ? "Theo dữ liệu học tập" : "Trong 30 ngày gần nhất"}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="instructor-analytics-grid">
        <article className="instructor-panel instructor-engagement-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Tương tác</p>
              <h3>Hoạt động học tập theo tháng</h3>
            </div>
            <strong>+18%</strong>
          </div>
          <div className="instructor-analytics-chart">
            {displayedEngagementTrend.map((item) => (
              <div className="instructor-analytics-column" key={item.label}>
                <span style={{ height: `${item.value}%` }} />
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </article>

        <aside className="instructor-panel instructor-segment-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Học viên</p>
              <h3>Phân nhóm học viên</h3>
            </div>
            <span className="material-symbols-outlined">donut_large</span>
          </div>
          <div className="instructor-segment-list">
            {displayedLearnerSegments.map((segment) => (
              <div className="instructor-segment-item" key={segment.label}>
                <div>
                  <span className={`instructor-segment-dot ${segment.tone}`} />
                  <strong>{segment.label}</strong>
                </div>
                <p>{segment.value}%</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="instructor-analytics-content-grid">
        <article className="instructor-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Khóa học</p>
              <h3>Thông tin hiệu suất</h3>
            </div>
            <button className="instructor-ghost-button" type="button">So sánh</button>
          </div>
          <div className="instructor-insight-list">
            {displayedCourseInsights.map((course) => (
              <article className="instructor-insight-card" key={course.title}>
                <div>
                  <h4>{course.title}</h4>
                  <p>Mức hoàn thành, chuyên cần và chất lượng đánh giá.</p>
                </div>
                <span>{course.completion}% hoàn thành</span>
                <span>{course.quizAverage} điểm kiểm tra TB</span>
                <span>{course.attendance}% chuyên cần</span>
                <strong>{course.trend}</strong>
              </article>
            ))}
          </div>
        </article>

        <aside className="instructor-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Đề xuất</p>
              <h3>Hành động giảng dạy</h3>
            </div>
            <span className="material-symbols-outlined">tips_and_updates</span>
          </div>
          <div className="instructor-recommendation-list">
            {displayedRecommendations.map((item) => (
              <article className="instructor-recommendation-card" key={item.title}>
                <div>
                  <h4>{item.title}</h4>
                  <span>{item.impact}</span>
                </div>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>

      {toast && (
        <div className={`instructor-toast ${toast.type}`} role="status">
          <span className="material-symbols-outlined">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          <p>{toast.message}</p>
          <button onClick={() => setToast(null)} type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}
    </InstructorLayout>
  );
}

export default InstructorAnalyticsPage;
