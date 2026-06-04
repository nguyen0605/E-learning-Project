import CourseMiniCard from "../components/CourseMiniCard";
import Icon from "../components/Icon";
import { recommended } from "../data/courseData";
import type { StudentView } from "../types/student.types";

type HomePageProps = {
  onNavigate: (view: StudentView) => void;
};

function HomePage({ onNavigate }: HomePageProps) {
  return (
    <>
      <section className="sp-hero">
        <div className="sp-hero-copy">
          <h1>
            Làm chủ kỹ năng của bạn{" "}
            <span>với độ chính xác của một chuyên gia.</span>
          </h1>
          <p>
            Academic Atelier cung cấp một bộ sưu tập kiến thức được tuyển chọn kỹ
            lưỡng dành cho người học hiện đại. Tiếp cận nguồn tri thức chuyên sâu
            từ các chuyên gia hàng đầu trong lĩnh vực công nghệ, thiết kế và kinh
            doanh để phát triển kỹ năng và nâng cao năng lực nghề nghiệp.
          </p>

          <div className="sp-actions">
            <button type="button" onClick={() => onNavigate("courses")}>
              Bắt đầu học
            </button>

            <button
              className="secondary"
              type="button"
              onClick={() => onNavigate("categories")}
            >
              Xem tất cả danh mục
            </button>
          </div>

          <div className="sp-social-proof">
            <span />
            <span />
            <span />
            <small>Hơn 12.000 học viên đã tham gia trong tháng này</small>
          </div>
        </div>

        <div className="sp-hero-visual">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
            alt="Học viên đang cùng nhau học tập và thảo luận"
          />

          <div className="sp-certificate">
            <Icon name="workspace_premium" />
            <strong>Chứng nhận uy tín</strong>
            <p>
              Nhận chứng chỉ chính thức từ các tổ chức và học viện hàng đầu thế
              giới.
            </p>
          </div>
        </div>
      </section>

      <section className="sp-band">
        <div className="sp-section-head">
          <div>
            <h2>Khám phá lĩnh vực học tập</h2>
            <p>
              Chương trình đào tạo được xây dựng theo từng chuyên ngành, giúp bạn
              học tập chuyên sâu và phát triển kỹ năng một cách toàn diện.
            </p>
          </div>

          <button type="button" onClick={() => onNavigate("categories")}>
            Xem tất cả danh mục <Icon name="arrow_forward" />
          </button>
        </div>

        <div className="sp-discipline-grid">
          <article className="sp-discipline large">
            <Icon name="code" />
            <h3>Công nghệ & Kỹ thuật phần mềm</h3>
            <p>
              Làm chủ lập trình hiện đại, trí tuệ nhân tạo và thiết kế hệ thống.
            </p>
            <small>142 Khóa học</small>

            <button type="button" onClick={() => onNavigate("courses")}>
              <Icon name="north_east" />
            </button>
          </article>

          <article className="sp-discipline blue">
            <Icon name="palette" />
            <h3>Thiết kế sáng tạo</h3>
            <small>84 Khóa học</small>
          </article>

          <article className="sp-discipline muted">
            <Icon name="query_stats" />
            <h3>Quản trị & Kinh doanh</h3>
            <small>56 Khóa học</small>
          </article>

          <article className="sp-discipline wide">
            <Icon name="psychology" />
            <div>
              <h3>Khoa học xã hội & Nhân văn</h3>
              <p>Khám phá tư duy, đạo đức và các giá trị cốt lõi của con người.</p>
            </div>
            <Icon name="chevron_right" />
          </article>
        </div>
      </section>

      <section className="sp-content-section">
        <p className="sp-eyebrow">Khóa học nổi bật</p>
        <h2>Khóa học được đề xuất</h2>

        <div className="sp-card-row">
          {recommended.map((course) => (
            <CourseMiniCard key={course.title} course={course} />
          ))}
        </div>
      </section>

      <section className="sp-newsletter">
        <h2>Đăng ký nhận bản tin học tập</h2>

        <p>
          Nhận các bài viết chuyên sâu, khóa học mới và kiến thức hữu ích mỗi
          tuần. Nội dung được chọn lọc kỹ lưỡng để hỗ trợ hành trình học tập của
          bạn.
        </p>

        <form>
          <input placeholder="Nhập địa chỉ email của bạn" />
          <button type="button">Đăng ký</button>
        </form>

        <Icon name="mark_email_read" />
      </section>
    </>
  );
}

export default HomePage;