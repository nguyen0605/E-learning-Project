import CourseCard from "../components/CourseCard";
import FilterGroup from "../components/FilterGroup";
import Icon from "../components/Icon";
import { courses } from "../data/courseData";

function CategoriesPage() {
  return (
    <main className="sp-category-page">
      <section className="sp-category-hero">
        <h1>Làm chủ kỹ năng của bạn với độ chính xác của một chuyên gia.</h1>

        <p>
          Khám phá bộ sưu tập các khóa học chuyên sâu được tuyển chọn dành cho
          người học hiện đại. Từ công nghệ, kinh doanh đến thiết kế và nghệ
          thuật sáng tạo.
        </p>

        <div className="sp-hero-search">
          <Icon name="search" />
          <input placeholder="Tìm kiếm 'Lập trình Web' hoặc 'Khoa học Dữ liệu'..." />
          <button type="button">Khám phá</button>
        </div>
      </section>

      <div className="sp-results-layout">
        <aside className="sp-filter-panel compact">
          <h2>
            <Icon name="filter_list" /> Bộ lọc
          </h2>

          <FilterGroup
            title="Danh mục"
            items={[
              "Thiết kế & Nghệ thuật",
              "Công nghệ thông tin",
              "Kinh doanh",
              "Khoa học xã hội",
            ]}
            checkedIndex={0}
          />

          <div className="sp-slider">
            <h3>Mức học phí</h3>

            <input type="range" defaultValue="55" />

            <p>
              <span>0đ</span>
              <span>10.000.000đ+</span>
            </p>
          </div>

          <div className="sp-rating-toggle">
            <h3>Đánh giá tối thiểu</h3>

            <button type="button">4.0+</button>

            <button className="active" type="button">
              4.5+
            </button>
          </div>
        </aside>

        <section>
          <div className="sp-results-head">
            <h2>
              Tìm thấy <span>842</span> khóa học thuộc lĩnh vực{" "}
              <span>"Thiết kế"</span>
            </h2>

            <button type="button">
              Phổ biến nhất <Icon name="expand_more" />
            </button>
          </div>

          <div className="sp-course-grid">
            {courses.map((course) => (
              <CourseCard
                key={`category-${course.title}`}
                course={course}
              />
            ))}
          </div>

          <button className="sp-load-more" type="button">
            Xem thêm khóa học
          </button>
        </section>
      </div>
    </main>
  );
}

export default CategoriesPage;