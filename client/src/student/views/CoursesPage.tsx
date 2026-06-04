import CourseCard from "../components/CourseCard";
import FilterGroup from "../components/FilterGroup";
import Icon from "../components/Icon";
import { courses } from "../data/courseData";

function CoursesPage() {
  return (
    <main className="sp-catalog-layout">
      <aside className="sp-filter-panel">
        <FilterGroup
          title="Category"
          items={["Development", "Business", "Design", "Health"]}
          checkedIndex={0}
        />
        <FilterGroup
          title="Level"
          items={["All Levels", "Beginner", "Intermediate", "Advanced"]}
          radio
          checkedIndex={0}
        />
        <div className="sp-filter-group">
          <h3>Rating</h3>
          <p className="sp-rating-line">
            â˜…â˜…â˜…â˜…â˜… <span>4.5 & up</span>
          </p>
          <p className="sp-rating-line">
            â˜…â˜…â˜…â˜…â˜† <span>4.0 & up</span>
          </p>
        </div>
        <div className="sp-premium-card">
          <h3>Scholar Workspace</h3>
          <p>Upgrade to access premium curated galleries.</p>
          <button type="button">Go Premium</button>
        </div>
      </aside>
      <section className="sp-catalog-main">
        <div className="sp-catalog-head">
          <div>
            <p className="sp-eyebrow">Editorial Curation</p>
            <h1>Refine Your Expertise</h1>
            <p>
              Explore our meticulously curated gallery of high-end educational
              experiences designed for the modern editorial scholar.
            </p>
          </div>
          <button className="sp-sort" type="button">
            <Icon name="tune" /> Most Relevant <Icon name="expand_more" />
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
