import { useEffect, useMemo, useState } from "react";
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

type CoursesPageProps = {
  onOpenCourse: (courseId: number) => void;
};

const levels = [
  { label: "Tất cả cấp độ", value: "" },
  { label: "Người mới bắt đầu", value: "BEGINNER" },
  { label: "Trung cấp", value: "INTERMEDIATE" },
  { label: "Nâng cao", value: "ADVANCED" },
];

function CoursesPage({ onOpenCourse }: CoursesPageProps) {
  const [categories, setCategories] = useState<StudentCourseCategory[]>([]);
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedLevel, setSelectedLevel] = useState("");
  const [searchText, setSearchText] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
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
        level: selectedLevel,
        search: submittedSearch,
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
            : "Không thể tải danh sách khóa học.",
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
  }, [selectedCategoryId, selectedLevel, submittedSearch]);

  const totalLessons = useMemo(
    () =>
      courses.reduce((total, course) => total + course.stats.lessonCount, 0),
    [courses],
  );

  function handleSearchSubmit() {
    setSubmittedSearch(searchText.trim());
  }

  return (
    <main className="sp-catalog-layout">
      <aside className="sp-filter-panel">
        <div className="sp-filter-group">
          <h3>Danh mục</h3>
          <label>
            <input
              checked={selectedCategoryId === null}
              onChange={() => setSelectedCategoryId(null)}
              type="radio"
            />
            Tất cả danh mục
          </label>
          {categories.map((category) => (
            <label key={category.id}>
              <input
                checked={selectedCategoryId === category.id}
                onChange={() => setSelectedCategoryId(category.id)}
                type="radio"
              />
              {category.name} ({category.courseCount})
            </label>
          ))}
        </div>

        <div className="sp-filter-group">
          <h3>Trình độ</h3>
          {levels.map((level) => (
            <label key={level.label}>
              <input
                checked={selectedLevel === level.value}
                onChange={() => setSelectedLevel(level.value)}
                type="radio"
              />
              {level.label}
            </label>
          ))}
        </div>

        <div className="sp-premium-card">
          <h3>Dữ liệu khóa học từ hệ thống</h3>
          <p>
            Danh sách này đang đọc trực tiếp từ bảng khóa học, danh mục, giảng
            viên, bài học, đăng ký và đánh giá trong database.
          </p>
        </div>
      </aside>

      <section className="sp-catalog-main">
        <div className="sp-catalog-head">
          <div>
            <p className="sp-eyebrow">Khóa học đang mở</p>
            <h1>Nâng cao chuyên môn của bạn</h1>
            <p>
              Có {courses.length} khóa học, {categories.length} danh mục và{" "}
              {totalLessons} bài học đang sẵn sàng cho học viên.
            </p>
          </div>

          <div className="sp-course-search">
            <Icon name="search" />
            <input
              onChange={(event) => setSearchText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearchSubmit();
                }
              }}
              placeholder="Tìm khóa học..."
              value={searchText}
            />
            <button onClick={handleSearchSubmit} type="button">
              Tìm
            </button>
          </div>
        </div>

        {isLoading ? <p className="sp-state-line">Đang tải khóa học...</p> : null}
        {error ? <p className="sp-state-line error">{error}</p> : null}

        {!isLoading && !error ? (
          <div className="sp-course-grid">
            {courses.map((course) => (
              <StudentCourseCard
                course={course}
                key={course.id}
                onOpen={onOpenCourse}
              />
            ))}
          </div>
        ) : null}

        {!isLoading && !error && courses.length === 0 ? (
          <p className="sp-state-line">Không tìm thấy khóa học phù hợp.</p>
        ) : null}
      </section>
    </main>
  );
}

export default CoursesPage;
