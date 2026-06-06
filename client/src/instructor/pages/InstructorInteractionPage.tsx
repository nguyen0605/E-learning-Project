import InstructorLayout from "../components/InstructorLayout";
import {
  announcementDrafts,
  directMessages,
  discussionThreads,
  interactionStats,
} from "../data/instructorMockData";

function getThreadStatusClass(status: string) {
  if (status === "Cần phản hồi") return "risk";
  if (status === "Đã trả lời") return "track";

  return "excellent";
}

function InstructorInteractionPage() {
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
        {interactionStats.map((stat) => (
          <article className="instructor-stat-card" key={stat.label}>
            <div className={`instructor-stat-icon ${stat.tone}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <p>{stat.label}</p>
            <div>
              <strong>{stat.value}</strong>
              <span>Trung tâm giao tiếp</span>
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
              <button className="active" type="button">
                Tất cả
              </button>
              <button type="button">Cần phản hồi</button>
              <button type="button">Đã trả lời</button>
            </div>
          </div>

          <div className="instructor-thread-list">
            {discussionThreads.map((thread) => (
              <article className="instructor-thread-card" key={thread.title}>
                <div className="instructor-thread-icon">
                  <span className="material-symbols-outlined">forum</span>
                </div>
                <div>
                  <h4>{thread.title}</h4>
                  <p>
                    {thread.course} · {thread.batch}
                  </p>
                  <div className="instructor-thread-meta">
                    <span>{thread.replies} phản hồi</span>
                    <span>{thread.lastActivity}</span>
                  </div>
                </div>
                <em
                  className={`instructor-status-pill ${getThreadStatusClass(
                    thread.status,
                  )}`}
                >
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
            {directMessages.map((message) => (
              <article className="instructor-message-card" key={message.student}>
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
          <button className="instructor-ghost-button" type="button">
            Xem lưu trữ
          </button>
        </div>

        <div className="instructor-announcement-list">
          {announcementDrafts.map((announcement) => (
            <article
              className="instructor-announcement-card"
              key={announcement.title}
            >
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
