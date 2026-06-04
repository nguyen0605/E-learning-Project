import type { RecommendedCourse } from "../types/student.types";
import Icon from "./Icon";

type CourseMiniCardProps = {
  course: RecommendedCourse;
};

function CourseMiniCard({ course }: CourseMiniCardProps) {
  return (
    <article className="sp-mini-card">
      <img src={course.image} alt={course.title} />
      <span>{course.category}</span>
      <div className="sp-stars">
        â˜…â˜…â˜…â˜…â˜… <small>(1,209 reviews)</small>
      </div>
      <h3>{course.title}</h3>
      <p>{course.author}</p>
      <div>
        <strong>{course.price}</strong>
        <button type="button">
          Enroll <Icon name="add" />
        </button>
      </div>
    </article>
  );
}

export default CourseMiniCard;
