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
            Master your craft with <span>expert precision.</span>
          </h1>
          <p>
            Academic Atelier provides a curated gallery of knowledge for the modern
            scholar. Access high-level instruction from global leaders in technology,
            design, and business.
          </p>
          <div className="sp-actions">
            <button type="button" onClick={() => onNavigate("courses")}>
              Start Learning
            </button>
            <button
              className="secondary"
              type="button"
              onClick={() => onNavigate("categories")}
            >
              Browse Catalog
            </button>
          </div>
          <div className="sp-social-proof">
            <span />
            <span />
            <span />
            <small>Joined by 12k+ students this month</small>
          </div>
        </div>
        <div className="sp-hero-visual">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
            alt="Students collaborating around a laptop"
          />
          <div className="sp-certificate">
            <Icon name="workspace_premium" />
            <strong>Accredited</strong>
            <p>Official certificates from world-class institutions.</p>
          </div>
        </div>
      </section>

      <section className="sp-band">
        <div className="sp-section-head">
          <div>
            <h2>Explore Disciplines</h2>
            <p>
              Our curriculum is curated into specialized ateliers designed for depth
              and mastery.
            </p>
          </div>
          <button type="button" onClick={() => onNavigate("categories")}>
            View all categories <Icon name="arrow_forward" />
          </button>
        </div>
        <div className="sp-discipline-grid">
          <article className="sp-discipline large">
            <Icon name="code" />
            <h3>Engineering & Architecture</h3>
            <p>Master modern software engineering, AI, and systems design.</p>
            <small>142 Courses</small>
            <button type="button" onClick={() => onNavigate("courses")}>
              <Icon name="north_east" />
            </button>
          </article>
          <article className="sp-discipline blue">
            <Icon name="palette" />
            <h3>Visual Design</h3>
            <small>84 Courses</small>
          </article>
          <article className="sp-discipline muted">
            <Icon name="query_stats" />
            <h3>Business Strategy</h3>
            <small>56 Courses</small>
          </article>
          <article className="sp-discipline wide">
            <Icon name="psychology" />
            <div>
              <h3>Humanities & Ethics</h3>
              <p>Exploring the core of human thought.</p>
            </div>
            <Icon name="chevron_right" />
          </article>
        </div>
      </section>

      <section className="sp-content-section">
        <p className="sp-eyebrow">Academic Selection</p>
        <h2>Recommended Courses</h2>
        <div className="sp-card-row">
          {recommended.map((course) => (
            <CourseMiniCard key={course.title} course={course} />
          ))}
        </div>
      </section>

      <section className="sp-newsletter">
        <h2>Join our editorial newsletter</h2>
        <p>
          Curated articles, course drops, and academic insights delivered once a
          week. No noise, just knowledge.
        </p>
        <form>
          <input placeholder="Enter your academic email" />
          <button type="button">Subscribe</button>
        </form>
        <Icon name="mark_email_read" />
      </section>
    </>
  );
}

export default HomePage;
