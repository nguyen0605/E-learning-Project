import CourseCard from "../components/CourseCard";
import FilterGroup from "../components/FilterGroup";
import Icon from "../components/Icon";
import { courses } from "../data/courseData";

function CategoriesPage() {
  return (
    <main className="sp-category-page">
      <section className="sp-category-hero">
        <h1>Master your craft with expert precision.</h1>
        <p>
          Access a curated selection of advanced courses designed for the modern
          intellectual. From digital strategy to fine arts.
        </p>
        <div className="sp-hero-search">
          <Icon name="search" />
          <input placeholder="Search for 'Digital Typography' or 'Data Science'..." />
          <button type="button">Explore</button>
        </div>
      </section>
      <div className="sp-results-layout">
        <aside className="sp-filter-panel compact">
          <h2>
            <Icon name="filter_list" /> Filters
          </h2>
          <FilterGroup
            title="Category"
            items={["Design & Arts", "Technology", "Business", "Humanities"]}
            checkedIndex={0}
          />
          <div className="sp-slider">
            <h3>Price Range</h3>
            <input type="range" defaultValue="55" />
            <p>
              <span>$0</span>
              <span>$500+</span>
            </p>
          </div>
          <div className="sp-rating-toggle">
            <h3>Min. Rating</h3>
            <button type="button">4.0+</button>
            <button className="active" type="button">
              4.5+
            </button>
          </div>
        </aside>
        <section>
          <div className="sp-results-head">
            <h2>
              842 results for <span>"Design"</span>
            </h2>
            <button type="button">
              Most Popular <Icon name="expand_more" />
            </button>
          </div>
          <div className="sp-course-grid">
            {courses.map((course) => (
              <CourseCard key={`category-${course.title}`} course={course} />
            ))}
          </div>
          <button className="sp-load-more" type="button">
            Load More Courses
          </button>
        </section>
      </div>
    </main>
  );
}

export default CategoriesPage;
