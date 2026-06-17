import CourseContent from "../components/CourseContent";
import Icon from "../components/Icon";

const learnItems = [
  "Mastering the No-Line Rule",
  "High-Contrast Typography Hierarchies",
  "Material Surface Nesting Logic",
  "Glassmorphism Depth Control",
];

function LessonPage() {
  return (
    <main className="sp-lesson-page">
      <section className="sp-lesson-main">
        <div className="sp-video">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
            alt="Xem trước video bài học"
          />

          <button type="button">
            <Icon name="play_arrow" />
          </button>
        </div>

        <div className="sp-lesson-title">
          <div>
            <span>Chương 04</span>
            <span>Bài học 12</span>
          </div>

          <button type="button">
            <Icon name="share" /> Chia sẻ bài học
          </button>
        </div>

        <h1>Nguyên Tắc Thiết Kế Giao Diện Hiện Đại</h1>

        <nav className="sp-tabs">
          <button className="active" type="button">
            Tổng quan
          </button>
          <button type="button">Tài liệu</button>
          <button type="button">Đánh giá</button>
        </nav>

        <div className="sp-lesson-info">
          <div>
            <p>
              Trong bài học này, bạn sẽ tìm hiểu sâu hơn về tác động của khoảng
              trắng trong thiết kế, tâm lý học thị giác và cách sử dụng màu sắc
              để tạo nên những trải nghiệm người dùng trực quan và hiệu quả.
            </p>

            <div className="sp-learn-list">
              <h3>Bạn sẽ học được gì?</h3>

              {learnItems.map((item) => (
                <span key={item}>
                  <Icon name="check_circle" /> {item}
                </span>
              ))}
            </div>
          </div>

          <aside className="sp-instructor">
            <h3>Giảng viên</h3>

            <p>
              <img
                src="https://api.dicebear.com/9.x/personas/svg?seed=Julian"
                alt=""
              />
              <strong>Julian Vane</strong>
              <small>Chuyên gia Thiết kế UI/UX</small>
            </p>
          </aside>
        </div>
      </section>

      <aside className="sp-lesson-side">
        <CourseContent />
      </aside>
    </main>
  );
}

export default LessonPage;
