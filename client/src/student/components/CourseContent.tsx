import Icon from "./Icon";

function CourseContent() {
  return (
    <div className="sp-course-content">
      <h2>
        Course Content <span>72% Complete</span>
      </h2>
      <div className="sp-chapter">
        <p>Chapter 01</p>
        <h3>
          Design Fundamentals <Icon name="expand_more" />
        </h3>
        <span className="done">
          <Icon name="check_circle" /> The History of Grid Systems <small>14:20</small>
        </span>
        <span>
          <Icon name="check_circle" /> Golden Ratio in Digital UI <small>08:45</small>
        </span>
      </div>
      <div className="sp-chapter active">
        <p>Chapter 02</p>
        <h3>
          The Editorial Aesthetic <Icon name="expand_less" />
        </h3>
        <span>
          <Icon name="check_circle" /> Mastering Whitespace <small>12:30</small>
        </span>
        <span className="current">
          <Icon name="play_circle" /> Modern UI Principles <small>42:00</small>
        </span>
        <span>
          <Icon name="lock" /> Asymmetric Layout Strategy <small>15:10</small>
        </span>
      </div>
      <div className="sp-chapter locked">
        <p>Chapter 03</p>
        <h3>
          Final Project Execution <Icon name="lock" />
        </h3>
      </div>
    </div>
  );
}

export default CourseContent;
