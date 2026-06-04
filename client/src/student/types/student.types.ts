export type StudentView =
  | "home"
  | "courses"
  | "categories"
  | "cart"
  | "lesson"
  | "exam"
  | "interaction";

export type Course = {
  title: string;
  category: string;
  author: string;
  price: string;
  rating: string;
  image: string;
};

export type RecommendedCourse = Omit<Course, "rating">;
