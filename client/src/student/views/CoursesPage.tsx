import CourseCard from "../components/CourseCard";
import FilterGroup from "../components/FilterGroup";
import Icon from "../components/Icon";
import { courses } from "../data/courseData";

function CoursesPage() {
  return (
    <main className="sp-catalog-layout">
      <aside className="sp-filter-panel">
        <FilterGroup
          title="Danh mục"
          items={[
            "Công nghệ thông tin",
            "Kinh doanh",
            "Thiết kế",
            "Sức khỏe",
          ]}
          checkedIndex={0}
        />

        <FilterGroup
          title="Trình độ"
          items={[
            "Tất cả cấp độ",
            "Người mới bắt đầu",
            "Trung cấp",
            "Nâng cao",
          ]}
          radio
          checkedIndex={0}
        />

        <div className="sp-filter-group">
          <h3>Đánh giá</h3>

          <p className="sp-rating-line">
            ★★★★★ <span>Từ 4.5 trở lên</span>
          </p>

          <p className="sp-rating-line">
            ★★★★☆ <span>Từ 4.0 trở lên</span>
          </p>
        </div>

        <div className="sp-premium-card">
          <h3>Không gian học tập cao cấp</h3>

          <p>
            Nâng cấp tài khoản để truy cập các khóa học, tài liệu và nội dung độc
            quyền dành cho thành viên Premium.
          </p>

          <button type="button">Nâng cấp ngay</button>
        </div>
      </aside>

      <section className="sp-catalog-main">
        <div className="sp-catalog-head">
          <div>
            <p className="sp-eyebrow">Khóa học nổi bật</p>

            <h1>Nâng cao chuyên môn của bạn</h1>

            <p>
              Khám phá bộ sưu tập khóa học chất lượng cao được tuyển chọn kỹ
              lưỡng, giúp bạn phát triển kỹ năng và kiến thức trong lĩnh vực yêu
              thích.
            </p>
          </div>

          <button className="sp-sort" type="button">
            <Icon name="tune" /> Liên quan nhất{" "}
            <Icon name="expand_more" />
          </button>
        </div>

        <div className="sp-course-grid">
          {courses.map((course) => (
            <CourseCard key={course.title} course={course} />
          ))}
        </div>

        <div className="sp-pagination">
          <button type="button">
            <Icon name="chevron_left" />
          </button>

          <button className="active" type="button">
            1
          </button>

          <button type="button">2</button>
          <button type="button">3</button>

          <span>...</span>

          <button type="button">12</button>

          <button type="button">
            <Icon name="chevron_right" />
          </button>
        </div>
      </section>
    </main>
  );
}

export default CoursesPage;