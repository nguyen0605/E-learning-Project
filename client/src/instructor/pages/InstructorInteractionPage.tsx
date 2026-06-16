import { useEffect, useState } from "react";
import InstructorLayout from "../components/InstructorLayout";
import {
  announcementDrafts,
  directMessages,
  discussionThreads,
  interactionStats,
} from "../data/instructorMockData";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const DEFAULT_TEACHER_ID = 4;

type InteractionStat = (typeof interactionStats)[number];
type DiscussionThread = (typeof discussionThreads)[number];
type DirectMessage = (typeof directMessages)[number];
type AnnouncementDraft = (typeof announcementDrafts)[number];

type InstructorInteractionApiResponse = {
  success: boolean;
  data: {
    interactionStats: InteractionStat[];
    discussionThreads: DiscussionThread[];
    directMessages: DirectMessage[];
    announcementDrafts: AnnouncementDraft[];
  };
};

function getThreadStatusClass(status: string) {
  if (status === "Can phan hoi" || status === "Cần phản hồi") return "risk";
  if (status === "Da tra loi" || status === "Đã trả lời") return "track";
  return "excellent";
}

function InstructorInteractionPage() {
  const [pageData, setPageData] =
    useState<InstructorInteractionApiResponse["data"] | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadInteraction() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/instructor/interaction?teacherId=${DEFAULT_TEACHER_ID}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

        const payload = (await response.json()) as InstructorInteractionApiResponse;
        if (!payload.success) throw new Error("Interaction API returned unsuccessful response.");

        setPageData(payload.data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error(error);
      }
    }

    loadInteraction();
    return () => controller.abort();
  }, []);

  const displayedStats = pageData?.interactionStats ?? interactionStats;
  const displayedThreads = pageData?.discussionThreads ?? discussionThreads;
  const displayedMessages = pageData?.directMessages ?? directMessages;
  const displayedAnnouncements = pageData?.announcementDrafts ?? announcementDrafts;

  return (
    <InstructorLayout activePage="interaction">
      <section className="instructor-hero instructor-interaction-hero">
        <div>
          <p className="instructor-eyebrow">Tương tác</p>
          <h2>Giữ kết nối với từng lớp học</h2>
          <p>
            Theo dõi thảo luận, tin nhắn trực tiếp và thông báo lớp trong một
            không gian giao tiếp dành cho giảng viên.
          </p>
        </div>
        <div className="instructor-hero-actions">
          <button className="instructor-secondary-button" type="button">
            <span className="material-symbols-outlined">mark_email_read</span>
            Đánh dấu đã xem
          </button>
          <button className="instructor-primary-button" type="button">
            <span className="material-symbols-outlined">campaign</span>
            Thông báo mới
          </button>
        </div>
      </section>

      <section className="instructor-stat-grid" aria-label="Tổng quan tương tác">
        {displayedStats.map((stat) => (
          <article className="instructor-stat-card" key={stat.label}>
            <div className={`instructor-stat-icon ${stat.tone}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <p>{stat.label}</p>
            <div>
              <strong>{stat.value}</strong>
              <span>{pageData ? "Dữ liệu từ backend" : "Trung tâm giao tiếp"}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="instructor-interaction-grid">
        <article className="instructor-panel instructor-discussion-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Thảo luận</p>
              <h3>Chủ đề trong lớp</h3>
            </div>
            <div className="instructor-filter-tabs" aria-label="Bộ lọc chủ đề">
              <button className="active" type="button">Tất cả</button>
              <button type="button">Cần phản hồi</button>
              <button type="button">Đã trả lời</button>
            </div>
          </div>

          <div className="instructor-thread-list">
            {displayedThreads.map((thread) => (
              <article className="instructor-thread-card" key={thread.title}>
                <div className="instructor-thread-icon">
                  <span className="material-symbols-outlined">forum</span>
                </div>
                <div>
                  <h4>{thread.title}</h4>
                  <p>{thread.course} · {thread.batch}</p>
                  <div className="instructor-thread-meta">
                    <span>{thread.replies} phản hồi</span>
                    <span>{thread.lastActivity}</span>
                  </div>
                </div>
                <em className={`instructor-status-pill ${getThreadStatusClass(thread.status)}`}>
                  {thread.status}
                </em>
              </article>
            ))}
          </div>
        </article>

        <aside className="instructor-panel instructor-message-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Hộp thư</p>
              <h3>Tin nhắn trực tiếp</h3>
            </div>
            <span className="material-symbols-outlined">mail</span>
          </div>
          <div className="instructor-message-list">
            {displayedMessages.map((message) => (
              <article className="instructor-message-card" key={`${message.student}-${message.time}`}>
                <div>
                  <h4>{message.student}</h4>
                  <span>{message.priority}</span>
                </div>
                <p>{message.preview}</p>
                <small>{message.time}</small>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="instructor-panel instructor-announcement-panel">
        <div className="instructor-panel-header">
          <div>
            <p className="instructor-eyebrow">Thông báo</p>
            <h3>Gửi tin cho lớp</h3>
          </div>
          <button className="instructor-ghost-button" type="button">Xem lưu trữ</button>
        </div>
        <div className="instructor-announcement-list">
          {displayedAnnouncements.map((announcement) => (
            <article className="instructor-announcement-card" key={announcement.title}>
              <span className="material-symbols-outlined">campaign</span>
              <div>
                <h4>{announcement.title}</h4>
                <p>Lớp nhận: {announcement.target}</p>
              </div>
              <em>{announcement.state}</em>
              <button type="button">Sửa</button>
            </article>
          ))}
        </div>
      </section>
    </InstructorLayout>
  );
}

export default InstructorInteractionPage;
