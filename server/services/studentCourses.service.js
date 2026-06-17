import db from "../db.js";
import { mapAssignmentSubmission } from "./studentAssignments.service.js";

const SERVER_BASE_URL =
  process.env.PUBLIC_SERVER_URL ??
  `http://localhost:${process.env.PORT || 3000}`;

function toNumber(value) {
  return value === null || value === undefined ? 0 : Number(value);
}

function normalizeVideoUrl(url) {
  if (!url) {
    return null;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/")) {
    return `${SERVER_BASE_URL}${url}`;
  }

  return `${SERVER_BASE_URL}/${url}`;
}

function mapCourse(row) {
  return {
    id: row.course_id,
    name: row.course_name,
    description: row.description,
    thumbnailUrl: row.thumbnail_url,
    level: row.level,
    price: toNumber(row.price),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    category: {
      id: row.category_id,
      name: row.category_name,
      description: row.category_description,
      status: row.category_status,
    },
    teacher: {
      id: row.teacher_id,
      fullName: row.teacher_name,
      email: row.teacher_email,
      avatarUrl: row.teacher_avatar_url,
    },
    stats: {
      averageRating: toNumber(row.average_rating),
      reviewCount: toNumber(row.review_count),
      enrollmentCount: toNumber(row.enrollment_count),
      lessonCount: toNumber(row.lesson_count),
      moduleCount: toNumber(row.module_count),
      totalDurationMinutes: toNumber(row.total_duration_minutes),
    },
  };
}

export async function getStudentCourseCategories() {
  const [rows] = await db.execute(
    `SELECT
       cc.category_id,
       cc.category_name,
       cc.description,
       cc.status,
       COUNT(c.course_id) AS course_count
     FROM course_categories cc
     LEFT JOIN courses c
       ON c.category_id = cc.category_id
      AND c.status = 'APPROVED'
     WHERE cc.status = 'ACTIVE'
     GROUP BY cc.category_id, cc.category_name, cc.description, cc.status
     ORDER BY cc.category_name`,
  );

  return rows.map((row) => ({
    id: row.category_id,
    name: row.category_name,
    description: row.description,
    status: row.status,
    courseCount: toNumber(row.course_count),
  }));
}

export async function getStudentCourses({ categoryId, search, level } = {}) {
  const params = [];
  const filters = ["c.status = 'APPROVED'", "cc.status = 'ACTIVE'"];

  if (categoryId) {
    filters.push("c.category_id = ?");
    params.push(categoryId);
  }

  if (level) {
    filters.push("c.level = ?");
    params.push(String(level).toUpperCase());
  }

  if (search) {
    filters.push("(c.course_name LIKE ? OR c.description LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  const [rows] = await db.execute(
    `SELECT
       c.course_id,
       c.course_name,
       c.description,
       c.thumbnail_url,
       c.level,
       c.price,
       c.status,
       c.created_at,
       c.updated_at,
       cc.category_id,
       cc.category_name,
       cc.description AS category_description,
       cc.status AS category_status,
       u.user_id AS teacher_id,
       u.full_name AS teacher_name,
       u.email AS teacher_email,
       u.avatar_url AS teacher_avatar_url,
       COALESCE(AVG(cr.rating), 0) AS average_rating,
       COUNT(DISTINCT cr.review_id) AS review_count,
       COUNT(DISTINCT e.enrollment_id) AS enrollment_count,
       COUNT(DISTINCT cm.module_id) AS module_count,
       COUNT(DISTINCT l.lesson_id) AS lesson_count,
       COALESCE(SUM(DISTINCT l.duration_minutes), 0) AS total_duration_minutes
     FROM courses c
     INNER JOIN course_categories cc ON cc.category_id = c.category_id
     INNER JOIN users u ON u.user_id = c.teacher_id
     LEFT JOIN course_reviews cr ON cr.course_id = c.course_id
     LEFT JOIN course_batches cb ON cb.course_id = c.course_id
     LEFT JOIN enrollments e ON e.batch_id = cb.batch_id
     LEFT JOIN course_modules cm ON cm.course_id = c.course_id
     LEFT JOIN lessons l ON l.module_id = cm.module_id
     WHERE ${filters.join(" AND ")}
     GROUP BY
       c.course_id,
       cc.category_id,
       u.user_id
     ORDER BY c.created_at DESC, c.course_id DESC`,
    params,
  );

  return rows.map(mapCourse);
}

export async function getStudentEnrolledCourses(studentId) {
  const [rows] = await db.execute(
    `SELECT
       e.enrollment_id,
       e.enrolled_at,
       e.status AS enrollment_status,
       e.progress_percent,
       cb.batch_id,
       cb.batch_name,
       cb.start_date,
       cb.end_date,
       cb.status AS batch_status,
       c.course_id,
       c.course_name,
       c.description,
       c.thumbnail_url,
       c.level,
       c.price,
       c.status,
       c.created_at,
       c.updated_at,
       cc.category_id,
       cc.category_name,
       cc.description AS category_description,
       cc.status AS category_status,
       u.user_id AS teacher_id,
       u.full_name AS teacher_name,
       u.email AS teacher_email,
       u.avatar_url AS teacher_avatar_url,
       COALESCE(AVG(cr.rating), 0) AS average_rating,
       COUNT(DISTINCT cr.review_id) AS review_count,
       COUNT(DISTINCT e2.enrollment_id) AS enrollment_count,
       COUNT(DISTINCT cm.module_id) AS module_count,
       COUNT(DISTINCT l.lesson_id) AS lesson_count,
       COALESCE(SUM(DISTINCT l.duration_minutes), 0) AS total_duration_minutes
     FROM enrollments e
     INNER JOIN course_batches cb ON cb.batch_id = e.batch_id
     INNER JOIN courses c ON c.course_id = cb.course_id
     INNER JOIN course_categories cc ON cc.category_id = c.category_id
     INNER JOIN users u ON u.user_id = cb.teacher_id
     LEFT JOIN course_reviews cr ON cr.course_id = c.course_id
     LEFT JOIN enrollments e2 ON e2.batch_id = cb.batch_id
     LEFT JOIN course_modules cm ON cm.course_id = c.course_id
     LEFT JOIN lessons l ON l.module_id = cm.module_id
     WHERE e.student_id = ?
       AND e.status IN ('PENDING', 'ACTIVE', 'COMPLETED')
       AND c.status = 'APPROVED'
     GROUP BY e.enrollment_id, cb.batch_id, c.course_id, cc.category_id, u.user_id
     ORDER BY e.enrolled_at DESC`,
    [studentId],
  );

  return rows.map((row) => ({
    enrollment: {
      id: row.enrollment_id,
      enrolledAt: row.enrolled_at,
      status: row.enrollment_status,
      progressPercent: toNumber(row.progress_percent),
    },
    batch: {
      id: row.batch_id,
      name: row.batch_name,
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.batch_status,
    },
    course: mapCourse(row),
  }));
}

export async function getStudentCourseDetail(courseId, studentId) {
  const [courseRows] = await db.execute(
    `SELECT
       c.course_id,
       c.course_name,
       c.description,
       c.thumbnail_url,
       c.level,
       c.price,
       c.status,
       c.created_at,
       c.updated_at,
       cc.category_id,
       cc.category_name,
       cc.description AS category_description,
       cc.status AS category_status,
       u.user_id AS teacher_id,
       u.full_name AS teacher_name,
       u.email AS teacher_email,
       u.avatar_url AS teacher_avatar_url,
       COALESCE(AVG(cr.rating), 0) AS average_rating,
       COUNT(DISTINCT cr.review_id) AS review_count,
       COUNT(DISTINCT e.enrollment_id) AS enrollment_count,
       COUNT(DISTINCT cm.module_id) AS module_count,
       COUNT(DISTINCT l.lesson_id) AS lesson_count,
       COALESCE(SUM(DISTINCT l.duration_minutes), 0) AS total_duration_minutes
     FROM courses c
     INNER JOIN course_categories cc ON cc.category_id = c.category_id
     INNER JOIN users u ON u.user_id = c.teacher_id
     LEFT JOIN course_reviews cr ON cr.course_id = c.course_id
     LEFT JOIN course_batches cb ON cb.course_id = c.course_id
     LEFT JOIN enrollments e ON e.batch_id = cb.batch_id
     LEFT JOIN course_modules cm ON cm.course_id = c.course_id
     LEFT JOIN lessons l ON l.module_id = cm.module_id
     WHERE c.course_id = ? AND c.status = 'APPROVED'
     GROUP BY
       c.course_id,
       cc.category_id,
       u.user_id
     LIMIT 1`,
    [courseId],
  );

  if (!courseRows.length) {
    return null;
  }

  const course = mapCourse(courseRows[0]);

  const [batchRows] = await db.execute(
    `SELECT
       batch_id,
       batch_code,
       batch_name,
       start_date,
       end_date,
       enrollment_start_date,
       enrollment_deadline,
       min_students,
       max_students,
       tuition_fee,
       learning_mode,
       online_platform,
       default_meeting_url,
       timezone,
       status,
       note
     FROM course_batches
     WHERE course_id = ?
     ORDER BY start_date DESC, batch_id DESC`,
    [courseId],
  );

  const batchIds = batchRows.map((batch) => batch.batch_id);
  const batchStatsById = new Map();
  const sessionsByBatchId = new Map();
  const assignmentsByLessonId = new Map();
  const submissionsByAssignmentId = new Map();
  const quizzesByLessonId = new Map();
  const questionsByQuizId = new Map();

  if (batchIds.length) {
    const batchPlaceholders = batchIds.map(() => "?").join(",");
    const [batchStatsRows] = await db.execute(
      `SELECT
         cb.batch_id,
         COUNT(DISTINCT e.enrollment_id) AS enrollment_count,
         COUNT(DISTINCT CASE WHEN e.status = 'ACTIVE' THEN e.enrollment_id END) AS active_enrollment_count,
         COUNT(DISTINCT p.payment_id) AS payment_count,
         COALESCE(SUM(CASE WHEN p.payment_status = 'SUCCESS' THEN p.amount ELSE 0 END), 0) AS paid_amount
       FROM course_batches cb
       LEFT JOIN enrollments e ON e.batch_id = cb.batch_id
       LEFT JOIN payments p ON p.batch_id = cb.batch_id
       WHERE cb.batch_id IN (${batchPlaceholders})
       GROUP BY cb.batch_id`,
      batchIds,
    );

    batchStatsRows.forEach((row) => {
      batchStatsById.set(row.batch_id, {
        enrollmentCount: toNumber(row.enrollment_count),
        activeEnrollmentCount: toNumber(row.active_enrollment_count),
        paymentCount: toNumber(row.payment_count),
        paidAmount: toNumber(row.paid_amount),
      });
    });

    const [sessionRows] = await db.execute(
      `SELECT
         session_id,
         batch_id,
         session_title,
         session_description,
         start_time,
         end_time,
         meeting_url,
         platform,
         status,
         recording_url,
         note
       FROM class_sessions
       WHERE batch_id IN (${batchPlaceholders})
       ORDER BY start_time`,
      batchIds,
    );

    sessionRows.forEach((session) => {
      const sessions = sessionsByBatchId.get(session.batch_id) ?? [];

      sessions.push({
        id: session.session_id,
        title: session.session_title,
        description: session.session_description,
        startTime: session.start_time,
        endTime: session.end_time,
        meetingUrl: session.meeting_url,
        platform: session.platform,
        status: session.status,
        recordingUrl: session.recording_url,
        note: session.note,
      });
      sessionsByBatchId.set(session.batch_id, sessions);
    });

  }

  const [moduleRows] = await db.execute(
    `SELECT
       module_id,
       module_title,
       description,
       order_no
     FROM course_modules
     WHERE course_id = ?
     ORDER BY order_no`,
    [courseId],
  );

  const moduleIds = moduleRows.map((module) => module.module_id);
  let lessonRows = [];
  let resourceRows = [];

  if (moduleIds.length) {
    const placeholders = moduleIds.map(() => "?").join(",");

    [lessonRows] = await db.execute(
       `SELECT
         lesson_id,
         module_id,
         lesson_title,
         lesson_type,
         content,
         video_url,
         video_web_url,
         duration_minutes,
         is_preview,
         order_no
       FROM lessons
       WHERE module_id IN (${placeholders})
       ORDER BY module_id, order_no`,
      moduleIds,
    );

    const lessonIds = lessonRows.map((lesson) => lesson.lesson_id);

    if (lessonIds.length) {
      const lessonPlaceholders = lessonIds.map(() => "?").join(",");

      [resourceRows] = await db.execute(
        `SELECT
           resource_id,
           lesson_id,
           resource_name,
           resource_type,
           resource_url
         FROM lesson_resources
         WHERE lesson_id IN (${lessonPlaceholders})
         ORDER BY resource_id`,
        lessonIds,
      );

      const [assignmentRows] = await db.execute(
        `SELECT
           assignment_id,
           lesson_id,
           title,
           description,
           due_date,
           max_score
         FROM assignments
         WHERE lesson_id IN (${lessonPlaceholders})
         ORDER BY due_date IS NULL, due_date, assignment_id`,
        lessonIds,
      );

      if (studentId && assignmentRows.length) {
        const assignmentIds = assignmentRows.map((assignment) => assignment.assignment_id);
        const assignmentPlaceholders = assignmentIds.map(() => "?").join(",");
        const [submissionRows] = await db.execute(
          `SELECT
             submission_id,
             assignment_id,
             file_url,
             content,
             submitted_at,
             score,
             feedback,
             graded_at
           FROM assignment_submissions
           WHERE student_id = ?
             AND assignment_id IN (${assignmentPlaceholders})`,
          [studentId, ...assignmentIds],
        );

        submissionRows.forEach((submission) => {
          submissionsByAssignmentId.set(
            submission.assignment_id,
            mapAssignmentSubmission(submission),
          );
        });
      }

      assignmentRows.forEach((assignment) => {
        const assignments = assignmentsByLessonId.get(assignment.lesson_id) ?? [];

        assignments.push({
          id: assignment.assignment_id,
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.due_date,
          maxScore: toNumber(assignment.max_score),
          submission:
            submissionsByAssignmentId.get(assignment.assignment_id) ?? null,
        });
        assignmentsByLessonId.set(assignment.lesson_id, assignments);
      });

      const [quizRows] = await db.execute(
        `SELECT
           quiz_id,
           lesson_id,
           title,
           description,
           duration_minutes,
           max_score,
           pass_score,
           attempt_limit
         FROM quizzes
         WHERE lesson_id IN (${lessonPlaceholders})
         ORDER BY quiz_id`,
        lessonIds,
      );

      const quizIds = quizRows.map((quiz) => quiz.quiz_id);

      if (quizIds.length) {
        const quizPlaceholders = quizIds.map(() => "?").join(",");
        const [questionRows] = await db.execute(
          `SELECT
             q.question_id,
             q.quiz_id,
             q.question_text,
             q.question_type,
             q.score,
             ao.option_id,
             ao.option_text,
             ao.is_correct
           FROM questions q
           LEFT JOIN answer_options ao ON ao.question_id = q.question_id
           WHERE q.quiz_id IN (${quizPlaceholders})
           ORDER BY q.question_id, ao.option_id`,
          quizIds,
        );

        const questionMap = new Map();

        questionRows.forEach((row) => {
          if (!questionMap.has(row.question_id)) {
            questionMap.set(row.question_id, {
              id: row.question_id,
              quizId: row.quiz_id,
              text: row.question_text,
              type: row.question_type,
              score: toNumber(row.score),
              options: [],
            });
          }

          if (row.option_id) {
            questionMap.get(row.question_id).options.push({
              id: row.option_id,
              text: row.option_text,
              isCorrect: Boolean(row.is_correct),
            });
          }
        });

        questionMap.forEach((question) => {
          const questions = questionsByQuizId.get(question.quizId) ?? [];
          const { quizId, ...questionData } = question;

          questions.push(questionData);
          questionsByQuizId.set(quizId, questions);
        });
      }

      quizRows.forEach((quiz) => {
        const quizzes = quizzesByLessonId.get(quiz.lesson_id) ?? [];

        quizzes.push({
          id: quiz.quiz_id,
          title: quiz.title,
          description: quiz.description,
          durationMinutes: toNumber(quiz.duration_minutes),
          maxScore: toNumber(quiz.max_score),
          passScore: toNumber(quiz.pass_score),
          attemptLimit: toNumber(quiz.attempt_limit),
          questions: questionsByQuizId.get(quiz.quiz_id) ?? [],
        });
        quizzesByLessonId.set(quiz.lesson_id, quizzes);
      });
    }
  }

  const resourcesByLessonId = new Map();

  resourceRows.forEach((resource) => {
    const resources = resourcesByLessonId.get(resource.lesson_id) ?? [];

    resources.push({
      id: resource.resource_id,
      name: resource.resource_name,
      type: resource.resource_type,
      url: resource.resource_url,
    });
    resourcesByLessonId.set(resource.lesson_id, resources);
  });

  const lessonsByModuleId = new Map();

  lessonRows.forEach((lesson) => {
    const lessons = lessonsByModuleId.get(lesson.module_id) ?? [];

    lessons.push({
      id: lesson.lesson_id,
      title: lesson.lesson_title,
      type: lesson.lesson_type,
      content: lesson.content,
      videoUrl: normalizeVideoUrl(lesson.video_web_url || lesson.video_url),
      durationMinutes: toNumber(lesson.duration_minutes),
      isPreview: Boolean(lesson.is_preview),
      orderNo: lesson.order_no,
      resources: resourcesByLessonId.get(lesson.lesson_id) ?? [],
      assignments: assignmentsByLessonId.get(lesson.lesson_id) ?? [],
      quizzes: quizzesByLessonId.get(lesson.lesson_id) ?? [],
    });
    lessonsByModuleId.set(lesson.module_id, lessons);
  });

  const [reviewRows] = await db.execute(
    `SELECT
       cr.review_id,
       cr.rating,
       cr.teacher_rating,
       cr.comment,
       cr.teacher_comment,
       cr.created_at,
       u.user_id AS student_id,
       u.full_name AS student_name,
       u.avatar_url AS student_avatar_url
     FROM course_reviews cr
     INNER JOIN users u ON u.user_id = cr.student_id
     WHERE cr.course_id = ?
     ORDER BY cr.created_at DESC
     LIMIT 10`,
    [courseId],
  );

  return {
    ...course,
    batches: batchRows.map((batch) => ({
      id: batch.batch_id,
      code: batch.batch_code,
      name: batch.batch_name,
      startDate: batch.start_date,
      endDate: batch.end_date,
      enrollmentStartDate: batch.enrollment_start_date,
      enrollmentDeadline: batch.enrollment_deadline,
      minStudents: toNumber(batch.min_students),
      maxStudents: toNumber(batch.max_students),
      tuitionFee: batch.tuition_fee === null ? null : toNumber(batch.tuition_fee),
      learningMode: batch.learning_mode,
      onlinePlatform: batch.online_platform,
      defaultMeetingUrl: batch.default_meeting_url,
      timezone: batch.timezone,
      status: batch.status,
      note: batch.note,
      stats: batchStatsById.get(batch.batch_id) ?? {
        enrollmentCount: 0,
        activeEnrollmentCount: 0,
        paymentCount: 0,
        paidAmount: 0,
      },
      sessions: sessionsByBatchId.get(batch.batch_id) ?? [],
    })),
    modules: moduleRows.map((module) => ({
      id: module.module_id,
      title: module.module_title,
      description: module.description,
      orderNo: module.order_no,
      lessons: lessonsByModuleId.get(module.module_id) ?? [],
    })),
    reviews: reviewRows.map((review) => ({
      id: review.review_id,
      rating: review.rating,
      teacherRating: review.teacher_rating,
      comment: review.comment,
      teacherComment: review.teacher_comment,
      createdAt: review.created_at,
      student: {
        id: review.student_id,
        fullName: review.student_name,
        avatarUrl: review.student_avatar_url,
      },
    })),
  };
}
