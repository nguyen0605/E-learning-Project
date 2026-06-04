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
            alt="Course video preview"
          />
          <button type="button">
            <Icon name="play_arrow" />
          </button>
        </div>
        <div className="sp-lesson-title">
          <div>
            <span>Module 04</span>
            <span>Lesson 12</span>
          </div>
          <button type="button">
            <Icon name="share" /> Share Lesson
          </button>
        </div>
        <h1>Architectural Principles of Modern UI Design</h1>
        <nav className="sp-tabs">
          <button className="active" type="button">
            Overview
          </button>
          <button type="button">Notes</button>
          <button type="button">Resources</button>
          <button type="button">Reviews</button>
        </nav>
        <div className="sp-lesson-info">
          <div>
            <p>
              In this session, we dive deep into the emotional impact of whitespace
              and the subtle psychology of tonal shifts. You'll learn how to create
              interfaces that feel like physical objects rather than flat digital
              layouts.
            </p>
            <div className="sp-learn-list">
              <h3>What you'll learn</h3>
              {learnItems.map((item) => (
                <span key={item}>
                  <Icon name="check_circle" /> {item}
                </span>
              ))}
            </div>
          </div>
          <aside className="sp-instructor">
            <h3>Instructor</h3>
            <p>
              <img src="https://api.dicebear.com/9.x/personas/svg?seed=Julian" alt="" />
              <strong>Julian Vane</strong>
              <small>Lead Designer @ Scholar</small>
            </p>
          </aside>
        </div>
      </section>
      <aside className="sp-lesson-side">
        <CourseContent />
        <div className="sp-notes">
          <h2>
            <Icon name="speaker_notes" /> Quick Notes <button type="button">View All</button>
          </h2>
          <textarea placeholder="Timestamped note at 12:45..." />
          <div>
            <small>Auto-saving...</small>
            <button type="button">Save Note</button>
          </div>
        </div>
      </aside>
    </main>
  );
}

export default LessonPage;
