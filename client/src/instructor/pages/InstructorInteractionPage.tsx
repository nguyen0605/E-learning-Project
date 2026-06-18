import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { instructorApiRequest } from "../api/instructorApi";
import { getInstructorAuthTeacherId } from "../auth/instructorAuth";
import InstructorLayout from "../components/InstructorLayout";
import {
  announcementDrafts,
  directMessages,
  discussionThreads,
  interactionStats,
} from "../data/instructorMockData";

const DEFAULT_TEACHER_ID = getInstructorAuthTeacherId();

type InteractionStat = (typeof interactionStats)[number];
type DirectMessage = (typeof directMessages)[number];
type AnnouncementDraft = (typeof announcementDrafts)[number];
type DiscussionThread = {
  id?: number;
  title: string;
  content?: string;
  author?: string;
  course: string;
  batch: string;
  replies: number;
  lastActivity: string;
  status: string;
  comments?: Array<{
    id: number;
    author: string;
    isTeacher: boolean;
    content: string;
    time: string;
  }>;
};
type NotificationItem = {
  id: number;
  title: string;
  content: string;
  isRead: boolean;
  time: string;
};
type ReminderTask = {
  id: string;
  title: string;
  detail: string;
  category: string;
  tone: string;
  icon: string;
  time: string;
};

type InstructorInteractionApiResponse = {
  success: boolean;
  data: {
    interactionStats: InteractionStat[];
    discussionThreads: DiscussionThread[];
    directMessages: DirectMessage[];
    announcementDrafts: AnnouncementDraft[];
    notificationItems: NotificationItem[];
    reminderTasks: ReminderTask[];
  };
};

function getThreadStatusClass(status: string) {
  if (status === "Can phan hoi" || status === "Cần phản hồi") return "risk";
  if (status === "Da tra loi" || status === "Đã trả lời") return "track";
  return "excellent";
}

function InstructorInteractionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageData, setPageData] =
    useState<InstructorInteractionApiResponse["data"] | null>(null);
  const [isMarkingNotificationId, setIsMarkingNotificationId] = useState<number | null>(null);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<number | null>(null);
  const [discussionReplyText, setDiscussionReplyText] = useState("");
  const [discussionReplyError, setDiscussionReplyError] = useState<string | null>(null);
  const [isSavingDiscussionReply, setIsSavingDiscussionReply] = useState(false);
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [composeMode, setComposeMode] = useState<"announcement" | "message">("announcement");
  const [composeTarget, setComposeTarget] = useState("");
  const [composeTitle, setComposeTitle] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [composeError, setComposeError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function loadInteraction(signal?: AbortSignal) {
    try {
      const payload = await instructorApiRequest<InstructorInteractionApiResponse>(
        "/api/instructor/interaction",
        {
          query: { teacherId: DEFAULT_TEACHER_ID },
          signal,
        },
      );
      if (!payload.success) throw new Error("Interaction API returned unsuccessful response.");

      setPageData(payload.data);
      setSelectedDiscussionId((current) =>
        payload.data.discussionThreads.some((thread) => thread.id === current)
          ? current
          : payload.data.discussionThreads[0]?.id ?? null,
      );
      setNotificationError(null);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      console.error(error);
      setNotificationError("Không thể tải dữ liệu thông báo.");
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    loadInteraction(controller.signal);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const compose = params.get("compose");

    if (compose !== "message" && compose !== "announcement") {
      return;
    }

    openComposeForm(compose, params.get("cohort") ?? "");
    params.delete("compose");
    params.delete("cohort");
    const nextSearch = params.toString();

    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : "",
      },
      { replace: true },
    );
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  async function handleMarkNotificationRead(notificationId: number) {
    setIsMarkingNotificationId(notificationId);
    setNotificationError(null);

    try {
      await instructorApiRequest(`/api/instructor/notifications/${notificationId}/read`, {
        method: "PATCH",
        query: { teacherId: DEFAULT_TEACHER_ID },
      });

      await loadInteraction();
    } catch (error) {
      console.error(error);
      setNotificationError(error instanceof Error ? error.message : "Không thể đánh dấu đã đọc.");
    } finally {
      setIsMarkingNotificationId(null);
    }
  }

  async function handleSaveDiscussionReply() {
    if (!selectedDiscussionId) return;

    const content = discussionReplyText.trim();
    if (!content) {
      setDiscussionReplyError("Nội dung phản hồi không được để trống.");
      return;
    }

    setIsSavingDiscussionReply(true);
    setDiscussionReplyError(null);

    try {
      await instructorApiRequest(`/api/instructor/discussions/${selectedDiscussionId}/comments`, {
        method: "POST",
        query: { teacherId: DEFAULT_TEACHER_ID },
        body: { content },
      });

      setDiscussionReplyText("");
      await loadInteraction();
    } catch (error) {
      console.error(error);
      setDiscussionReplyError(error instanceof Error ? error.message : "Không thể gửi phản hồi.");
    } finally {
      setIsSavingDiscussionReply(false);
    }
  }

  function openComposeForm(mode: "announcement" | "message", target = "") {
    setComposeMode(mode);
    setComposeTarget(target);
    setComposeTitle(mode === "announcement" ? "" : "Tin nhắn cho lớp");
    setComposeContent("");
    setComposeError(null);
    setShowComposeForm(true);
  }

  function closeComposeForm() {
    setShowComposeForm(false);
    setComposeError(null);
  }

  function handleSubmitCompose() {
    const title = composeTitle.trim();
    const content = composeContent.trim();
    const target = composeTarget.trim() || "Tất cả lớp";

    if (!title) {
      setComposeError("Hãy nhập tiêu đề.");
      return;
    }

    if (!content) {
      setComposeError("Hãy nhập nội dung.");
      return;
    }

    setPageData((current) => {
      if (!current) return current;

      if (composeMode === "announcement") {
        return {
          ...current,
          announcementDrafts: [
            { title, target, state: "Đã gửi" },
            ...current.announcementDrafts,
          ],
        };
      }

      return {
        ...current,
        directMessages: [
          {
            student: target,
            preview: content,
            time: "Vừa xong",
            priority: "Đã gửi",
          },
          ...current.directMessages,
        ],
      };
    });

    setToast({
      type: "success",
      message: composeMode === "announcement" ? "Đã tạo thông báo demo." : "Đã gửi tin nhắn demo.",
    });
    closeComposeForm();
  }

  const displayedStats = pageData?.interactionStats ?? interactionStats;
  const displayedThreads: DiscussionThread[] = pageData?.discussionThreads ?? discussionThreads;
  const displayedMessages = pageData?.directMessages ?? directMessages;
  const displayedAnnouncements = pageData?.announcementDrafts ?? announcementDrafts;
  const displayedNotifications = pageData?.notificationItems ?? [];
  const displayedReminders = pageData?.reminderTasks ?? [];
  const unreadCount = displayedNotifications.filter((item) => !item.isRead).length;
  const selectedDiscussion =
    displayedThreads.find((thread) => thread.id === selectedDiscussionId) ??
    displayedThreads[0] ??
    null;

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
          <button
            className="instructor-secondary-button"
            onClick={() => {
              setPageData((current) =>
                current
                  ? {
                      ...current,
                      notificationItems: current.notificationItems.map((item) => ({ ...item, isRead: true })),
                    }
                  : current,
              );
              setToast({ type: "success", message: "Đã đánh dấu nhanh các thông báo là đã đọc." });
            }}
            type="button"
          >
            <span className="material-symbols-outlined">mark_email_read</span>
            {unreadCount} chưa đọc
          </button>
          <button className="instructor-primary-button" onClick={() => openComposeForm("announcement")} type="button">
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
              <span>{pageData ? "Theo tương tác lớp" : "Trung tâm giao tiếp"}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="instructor-reminder-grid">
        <article className="instructor-panel instructor-reminder-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Nhắc việc</p>
              <h3>Việc cần chú ý</h3>
            </div>
            <span className="material-symbols-outlined">notifications_active</span>
          </div>
          <div className="instructor-reminder-list">
            {displayedReminders.length === 0 ? (
              <p className="instructor-empty-state">Chưa có việc cần xử lý.</p>
            ) : (
              displayedReminders.map((task) => (
                <article className={`instructor-reminder-card ${task.tone}`} key={task.id}>
                  <span className="material-symbols-outlined">{task.icon}</span>
                  <div>
                    <strong>{task.title}</strong>
                    <p>{task.detail}</p>
                  </div>
                  <em>{task.category}</em>
                  <small>{task.time}</small>
                </article>
              ))
            )}
          </div>
        </article>

        <aside className="instructor-panel instructor-notification-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Thông báo</p>
              <h3>Thông báo của giảng viên</h3>
            </div>
            <span className="material-symbols-outlined">campaign</span>
          </div>
          {notificationError && <p className="instructor-course-detail-error">{notificationError}</p>}
          <div className="instructor-notification-list">
            {displayedNotifications.length === 0 ? (
              <p className="instructor-empty-state">Chưa có thông báo nào.</p>
            ) : (
              displayedNotifications.map((notification) => (
                <article
                  className={`instructor-notification-card ${notification.isRead ? "read" : "unread"}`}
                  key={notification.id}
                >
                  <div>
                    <strong>{notification.title}</strong>
                    <span>{notification.time}</span>
                  </div>
                  <p>{notification.content}</p>
                  <button
                    disabled={notification.isRead || isMarkingNotificationId === notification.id}
                    onClick={() => handleMarkNotificationRead(notification.id)}
                    type="button"
                  >
                    {notification.isRead
                      ? "Đã đọc"
                      : isMarkingNotificationId === notification.id
                        ? "Đang lưu..."
                        : "Đánh dấu đã đọc"}
                  </button>
                </article>
              ))
            )}
          </div>
        </aside>
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
              <button
                className={`instructor-thread-card ${selectedDiscussion?.id === thread.id ? "active" : ""}`}
                key={thread.id ?? thread.title}
                onClick={() => {
                  setSelectedDiscussionId(thread.id ?? null);
                  setDiscussionReplyError(null);
                }}
                type="button"
              >
                <div className="instructor-thread-icon">
                  <span className="material-symbols-outlined">forum</span>
                </div>
                <div>
                  <h4>{thread.title}</h4>
                  {thread.author && <strong>{thread.author}</strong>}
                  <p>{thread.course} · {thread.batch}</p>
                  <div className="instructor-thread-meta">
                    <span>{thread.replies} phản hồi</span>
                    <span>{thread.lastActivity}</span>
                  </div>
                </div>
                <em className={`instructor-status-pill ${getThreadStatusClass(thread.status)}`}>
                  {thread.status}
                </em>
              </button>
            ))}
          </div>
        </article>

        <aside className="instructor-panel instructor-discussion-reply-panel">
          <div className="instructor-panel-header">
            <div>
              <p className="instructor-eyebrow">Phản hồi</p>
              <h3>Trả lời học viên</h3>
            </div>
            <span className="material-symbols-outlined">reply</span>
          </div>

          {!selectedDiscussion ? (
            <p className="instructor-empty-state">Chọn một chủ đề để trả lời.</p>
          ) : (
            <>
              <div className="instructor-discussion-detail">
                <strong>{selectedDiscussion.title}</strong>
                <span>{selectedDiscussion.course} · {selectedDiscussion.batch}</span>
                <p>{selectedDiscussion.content || "Chưa có nội dung câu hỏi."}</p>
              </div>

              <div className="instructor-discussion-comment-list">
                {(selectedDiscussion.comments ?? []).length === 0 ? (
                  <p className="instructor-empty-state">Chưa có phản hồi nào.</p>
                ) : (
                  selectedDiscussion.comments?.map((comment) => (
                    <article className={comment.isTeacher ? "teacher" : ""} key={comment.id}>
                      <div>
                        <strong>{comment.author}</strong>
                        <span>{comment.time}</span>
                      </div>
                      <p>{comment.content}</p>
                    </article>
                  ))
                )}
              </div>

              <form
                className="instructor-discussion-reply-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSaveDiscussionReply();
                }}
              >
                {discussionReplyError && <p className="instructor-course-detail-error">{discussionReplyError}</p>}
                <textarea
                  rows={4}
                  value={discussionReplyText}
                  onChange={(event) => setDiscussionReplyText(event.target.value)}
                  placeholder="Nhập phản hồi cho học viên..."
                />
                <button disabled={isSavingDiscussionReply} type="submit">
                  {isSavingDiscussionReply ? "Đang gửi..." : "Gửi phản hồi"}
                </button>
              </form>
            </>
          )}
        </aside>
      </section>

      <section className="instructor-panel instructor-message-panel">
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
      </section>

      <section className="instructor-panel instructor-announcement-panel">
        <div className="instructor-panel-header">
          <div>
            <p className="instructor-eyebrow">Thông báo</p>
            <h3>Gửi tin cho lớp</h3>
          </div>
          <button className="instructor-ghost-button" onClick={() => openComposeForm("announcement")} type="button">
            Thông báo mới
          </button>
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

      {showComposeForm && (
        <div className="instructor-course-create-backdrop" onClick={closeComposeForm} role="presentation">
          <aside
            aria-label={composeMode === "announcement" ? "Tạo thông báo mới" : "Nhắn tin cho lớp"}
            aria-modal="true"
            className="instructor-course-detail-modal no-hero instructor-compose-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="instructor-create-course-header">
              <div>
                <p className="instructor-eyebrow">
                  {composeMode === "announcement" ? "Thông báo" : "Tin nhắn"}
                </p>
                <h3>{composeMode === "announcement" ? "Thông báo mới" : "Nhắn tin cho lớp"}</h3>
                <p>Soạn nhanh nội dung để demo luồng tương tác với học viên.</p>
              </div>
              <button
                aria-label="Đóng form soạn nội dung"
                className="instructor-course-detail-close"
                onClick={closeComposeForm}
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="instructor-compose-form">
              {composeError && <p className="instructor-course-detail-error">{composeError}</p>}

              <label className="instructor-create-course-field instructor-create-course-field-wide">
                <span>Lớp nhận</span>
                <input
                  value={composeTarget}
                  onChange={(event) => setComposeTarget(event.target.value)}
                  placeholder="VD: WEB-TEACH-01 hoặc Tất cả lớp"
                />
              </label>

              <label className="instructor-create-course-field instructor-create-course-field-wide">
                <span>Tiêu đề</span>
                <input
                  value={composeTitle}
                  onChange={(event) => setComposeTitle(event.target.value)}
                  placeholder="VD: Nhắc lịch học tối nay"
                />
              </label>

              <label className="instructor-create-course-field instructor-create-course-field-wide">
                <span>Nội dung</span>
                <textarea
                  rows={5}
                  value={composeContent}
                  onChange={(event) => setComposeContent(event.target.value)}
                  placeholder="Nhập nội dung gửi cho lớp..."
                />
              </label>

              <div className="instructor-create-course-actions">
                <button type="button" onClick={closeComposeForm}>
                  Hủy
                </button>
                <button type="button" onClick={handleSubmitCompose}>
                  {composeMode === "announcement" ? "Tạo thông báo" : "Gửi tin nhắn"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

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

export default InstructorInteractionPage;
