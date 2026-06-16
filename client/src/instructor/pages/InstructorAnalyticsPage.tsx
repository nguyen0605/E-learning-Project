import { useEffect, useState } from "react";
import InstructorLayout from "../components/InstructorLayout";
import {
  analyticsRecommendations,
  analyticsStats,
  courseInsights,
  engagementTrend,
  learnerSegments,
} from "../data/instructorMockData";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const DEFAULT_TEACHER_ID = 4;

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

  useEffect(() => {
    const controller = new AbortController();

    async function loadAnalytics() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/instructor/analytics?teacherId=${DEFAULT_TEACHER_ID}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

        const payload = (await response.json()) as InstructorAnalyticsApiResponse;
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

  const displayedStats = pageData?.analyticsStats ?? analyticsStats;
  const displayedEngagementTrend = pageData?.engagementTrend ?? engagementTrend;
  const displayedLearnerSegments = pageData?.learnerSegments ?? learnerSegments;
  const displayedCourseInsights = pageData?.courseInsights ?? courseInsights;
  const displayedRecommendations = pageData?.analyticsRecommendations ?? analyticsRecommendations;

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
          <button className="instructor-secondary-button" type="button">
            <span className="material-symbols-outlined">date_range</span>
            Học kỳ này
          </button>
          <button className="instructor-primary-button" type="button">
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
              <span>{pageData ? "Dữ liệu từ backend" : "Trong 30 ngày gần nhất"}</span>
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
    </InstructorLayout>
  );
}

export default InstructorAnalyticsPage;
