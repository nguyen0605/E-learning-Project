import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import StudentCourseCard from "../components/StudentCourseCard";
import {
  getCourseCategories,
  getCourses,
} from "../services/studentCoursesApi";
import type {
  StudentCourse,
  StudentCourseCategory,
} from "../types/course.types";

type CategoriesPageProps = {
  onOpenCourse: (courseId: number) => void;
};

function CategoriesPage({ onOpenCourse }: CategoriesPageProps) {
  const [categories, setCategories] = useState<StudentCourseCategory[]>([]);
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setError("");

    Promise.all([
      getCourseCategories(),
      getCourses({
        categoryId: selectedCategoryId,
        search: searchText.trim(),
      }),
    ])
      .then(([categoryData, courseData]) => {
        if (!isMounted) {
          return;
        }

        setCategories(categoryData);
        setCourses(courseData);
      })
      .catch((fetchError) => {
        if (!isMounted) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Không thể tải dữ liệu danh mục.",
        );
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategoryId, searchText]);

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );

  return (
    <main className="sp-category-page">
      <section className="sp-category-hero">
        <h1>Làm chủ kỹ năng của bạn với dữ liệu khóa học thực tế.</h1>
        <p>
          Khám phá danh mục khóa học đang hoạt động trong hệ thống, cùng thông
          tin giảng viên, bài học, học phí và đánh giá được lấy trực tiếp từ
          database.
        </p>

        <div className="sp-hero-search">
          <Icon name="search" />
          <input
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Tìm kiếm khóa học..."
            value={searchText}
          />
          <button type="button">Khám phá</button>
        </div>
      </section>

      <div className="sp-results-layout">
        <aside className="sp-filter-panel compact">
          <h2>
            <Icon name="filter_list" /> Danh mục
          </h2>

          <div className="sp-category-list">
            <button
              className={selectedCategoryId === null ? "active" : ""}
              onClick={() => setSelectedCategoryId(null)}
              type="button"
            >
              Tất cả danh mục
              <span>{categories.reduce((sum, item) => sum + item.courseCount, 0)}</span>
            </button>
            {categories.map((category) => (
              <button
                className={selectedCategoryId === category.id ? "active" : ""}
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                type="button"
              >
                {category.name}
                <span>{category.courseCount}</span>
              </button>
            ))}
          </div>
        </aside>

        <section>
          <div className="sp-results-head">
            <h2>
              Tìm thấy <span>{courses.length}</span> khóa học
              {selectedCategory ? (
                <>
                  {" "}
                  thuộc lĩnh vực <span>"{selectedCategory.name}"</span>
                </>
              ) : null}
            </h2>
          </div>

          {isLoading ? <p className="sp-state-line">Đang tải danh mục...</p> : null}
          {error ? <p className="sp-state-line error">{error}</p> : null}

          {!isLoading && !error ? (
            <div className="sp-course-grid">
              {courses.map((course) => (
                <StudentCourseCard
                  course={course}
                  key={`category-${course.id}`}
                  onOpen={onOpenCourse}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

export default CategoriesPage;
