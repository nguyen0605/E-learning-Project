import { Router } from "express";
import { getInstructorDashboardData } from "../services/instructorDashboard.service.js";
import {
  createInstructorCourse,
  createInstructorLesson,
  createInstructorQuiz,
  bulkImportInstructorLessons,
  createInstructorBatch,
  createInstructorQuestion,
  createInstructorSession,
  createInstructorModule,
  deleteInstructorCourse,
  deleteInstructorBatch,
  deleteInstructorSession,
  deleteInstructorLesson,
  deleteInstructorModule,
  deleteInstructorQuiz,
  deleteInstructorQuestion,
  getInstructorCourseDetail,
  getInstructorCoursesPageData,
  reorderInstructorLessons,
  reorderInstructorModules,
  updateInstructorCourse,
  updateInstructorCourseWorkflowStatus,
  updateInstructorBatch,
  updateInstructorSession,
  updateInstructorModule,
  updateInstructorLesson,
  updateInstructorQuiz,
  updateInstructorQuestion,
} from "../services/instructorCourses.service.js";
import {
  getInstructorAnalyticsData,
  getInstructorInteractionData,
  getInstructorQuizzesData,
  getInstructorStudentsData,
} from "../services/instructorPortal.service.js";

const router = Router();

function handleRouteError(res, error, message) {
  console.error(message, error);

  res.status(500).json({
    success: false,
    message,
  });
}

router.get("/dashboard", async (req, res) => {
  try {
    const data = await getInstructorDashboardData(req.query.teacherId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found.",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to load instructor dashboard data.");
  }
});

router.get("/courses", async (req, res) => {
  try {
    const data = await getInstructorCoursesPageData(req.query.teacherId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found.",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to load instructor courses data.");
  }
});

router.post("/courses", async (req, res) => {
  try {
    const courseData = req.body ?? {};
    const newCourse = await createInstructorCourse(req.query.teacherId, courseData);

    res.status(201).json({
      success: true,
      data: newCourse,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("required") ||
        error.message.includes("valid course category") ||
        error.message.includes("Thumbnail URL"))
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    handleRouteError(res, error, "Failed to create course.");
  }
});

router.put("/courses/:courseId", async (req, res) => {
  try {
    const courseData = req.body ?? {};
    const data = await updateInstructorCourse(req.query.teacherId, req.params.courseId, courseData);

    res.json({ success: true, data });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("required") ||
        error.message.includes("valid course category") ||
        error.message.includes("Thumbnail URL"))
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to update course.");
  }
});

router.delete("/courses/:courseId", async (req, res) => {
  try {
    const data = await deleteInstructorCourse(req.query.teacherId, req.params.courseId);
    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Invalid")) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to delete course.");
  }
});

router.patch("/courses/:courseId/workflow", async (req, res) => {
  try {
    const data = await updateInstructorCourseWorkflowStatus(
      req.query.teacherId,
      req.params.courseId,
      req.body?.action,
    );

    res.json({ success: true, data });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("Invalid") ||
        error.message.includes("Only") ||
        error.message.includes("not found"))
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to update course workflow.");
  }
});

router.get("/courses/:courseId", async (req, res) => {
  try {
    const data = await getInstructorCourseDetail(req.query.teacherId, req.params.courseId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Course not found for this instructor.",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to load instructor course detail.");
  }
});

router.post("/courses/:courseId/modules", async (req, res) => {
  try {
    const moduleData = req.body ?? {};
    const data = await createInstructorModule(req.query.teacherId, req.params.courseId, moduleData);

    res.status(201).json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && error.message.includes("required")) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to create module.");
  }
});

router.put("/courses/:courseId/modules/:moduleId", async (req, res) => {
  try {
    const moduleData = req.body ?? {};
    const data = await updateInstructorModule(
      req.query.teacherId,
      req.params.courseId,
      req.params.moduleId,
      moduleData,
    );

    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && error.message.includes("required")) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to update module.");
  }
});

router.patch("/courses/:courseId/modules/order", async (req, res) => {
  try {
    const data = await reorderInstructorModules(
      req.query.teacherId,
      req.params.courseId,
      req.body?.moduleIds,
    );

    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("required") || error.message.includes("Invalid"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to reorder modules.");
  }
});

router.post("/courses/:courseId/batches", async (req, res) => {
  try {
    const batchData = req.body ?? {};
    const data = await createInstructorBatch(req.query.teacherId, req.params.courseId, batchData);

    res.status(201).json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("required") || error.message.includes("Invalid"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to create batch.");
  }
});

router.put("/courses/:courseId/batches/:batchId", async (req, res) => {
  try {
    const batchData = req.body ?? {};
    const data = await updateInstructorBatch(
      req.query.teacherId,
      req.params.courseId,
      req.params.batchId,
      batchData,
    );

    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("required") || error.message.includes("Invalid"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to update batch.");
  }
});

router.delete("/courses/:courseId/batches/:batchId", async (req, res) => {
  try {
    const data = await deleteInstructorBatch(
      req.query.teacherId,
      req.params.courseId,
      req.params.batchId,
    );

    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Invalid") || error.message.includes("not found"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to delete batch.");
  }
});

router.post("/courses/:courseId/batches/:batchId/sessions", async (req, res) => {
  try {
    const sessionData = req.body ?? {};
    const data = await createInstructorSession(
      req.query.teacherId,
      req.params.courseId,
      req.params.batchId,
      sessionData,
    );

    res.status(201).json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("required") || error.message.includes("Invalid"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to create session.");
  }
});

router.put("/courses/:courseId/batches/:batchId/sessions/:sessionId", async (req, res) => {
  try {
    const sessionData = req.body ?? {};
    const data = await updateInstructorSession(
      req.query.teacherId,
      req.params.courseId,
      req.params.batchId,
      req.params.sessionId,
      sessionData,
    );

    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("required") || error.message.includes("Invalid"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to update session.");
  }
});

router.delete("/courses/:courseId/batches/:batchId/sessions/:sessionId", async (req, res) => {
  try {
    const data = await deleteInstructorSession(
      req.query.teacherId,
      req.params.courseId,
      req.params.batchId,
      req.params.sessionId,
    );

    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Invalid") || error.message.includes("not found"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to delete session.");
  }
});

router.delete("/courses/:courseId/modules/:moduleId", async (req, res) => {
  try {
    const data = await deleteInstructorModule(
      req.query.teacherId,
      req.params.courseId,
      req.params.moduleId,
    );

    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Invalid") || error.message.includes("required"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to delete module.");
  }
});

router.post("/courses/:courseId/lessons", async (req, res) => {
  try {
    const lessonData = req.body ?? {};
    const data = await createInstructorLesson(req.query.teacherId, req.params.courseId, lessonData);

    res.status(201).json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("required") || error.message.includes("Invalid"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to create lesson.");
  }
});

router.put("/courses/:courseId/lessons/:lessonId", async (req, res) => {
  try {
    const lessonData = req.body ?? {};
    const data = await updateInstructorLesson(
      req.query.teacherId,
      req.params.courseId,
      req.params.lessonId,
      lessonData,
    );

    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("required") || error.message.includes("Invalid"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to update lesson.");
  }
});

router.patch("/courses/:courseId/modules/:moduleId/lessons/order", async (req, res) => {
  try {
    const data = await reorderInstructorLessons(
      req.query.teacherId,
      req.params.courseId,
      req.params.moduleId,
      req.body?.lessonIds,
    );

    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("required") || error.message.includes("Invalid"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to reorder lessons.");
  }
});

router.post("/courses/:courseId/quizzes", async (req, res) => {
  try {
    const quizData = req.body ?? {};
    const data = await createInstructorQuiz(req.query.teacherId, req.params.courseId, quizData);

    res.status(201).json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("required") || error.message.includes("Invalid") || error.message.includes("must"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to create quiz.");
  }
});

router.put("/courses/:courseId/quizzes/:quizId", async (req, res) => {
  try {
    const quizData = req.body ?? {};
    const data = await updateInstructorQuiz(
      req.query.teacherId,
      req.params.courseId,
      req.params.quizId,
      quizData,
    );

    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("required") || error.message.includes("Invalid") || error.message.includes("must"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to update quiz.");
  }
});

router.delete("/courses/:courseId/quizzes/:quizId", async (req, res) => {
  try {
    const data = await deleteInstructorQuiz(
      req.query.teacherId,
      req.params.courseId,
      req.params.quizId,
    );

    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Invalid") || error.message.includes("not found"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to delete quiz.");
  }
});

router.post("/courses/:courseId/quizzes/:quizId/questions", async (req, res) => {
  try {
    const questionData = req.body ?? {};
    const data = await createInstructorQuestion(
      req.query.teacherId,
      req.params.courseId,
      req.params.quizId,
      questionData,
    );

    res.status(201).json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("required") || error.message.includes("Invalid") || error.message.includes("must"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to create question.");
  }
});

router.put("/courses/:courseId/quizzes/:quizId/questions/:questionId", async (req, res) => {
  try {
    const questionData = req.body ?? {};
    const data = await updateInstructorQuestion(
      req.query.teacherId,
      req.params.courseId,
      req.params.quizId,
      req.params.questionId,
      questionData,
    );

    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("required") || error.message.includes("Invalid") || error.message.includes("must"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to update question.");
  }
});

router.delete("/courses/:courseId/quizzes/:quizId/questions/:questionId", async (req, res) => {
  try {
    const data = await deleteInstructorQuestion(
      req.query.teacherId,
      req.params.courseId,
      req.params.quizId,
      req.params.questionId,
    );

    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Invalid") || error.message.includes("not found"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to delete question.");
  }
});

router.post("/courses/:courseId/lessons/import", async (req, res) => {
  try {
    const { moduleId, lessons } = req.body ?? {};
    const data = await bulkImportInstructorLessons(
      req.query.teacherId,
      req.params.courseId,
      moduleId,
      lessons,
    );

    res.status(201).json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("required") || error.message.includes("Invalid"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to import lessons.");
  }
});

router.delete("/courses/:courseId/lessons/:lessonId", async (req, res) => {
  try {
    const data = await deleteInstructorLesson(
      req.query.teacherId,
      req.params.courseId,
      req.params.lessonId,
    );

    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Invalid") || error.message.includes("required"))) {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleRouteError(res, error, "Failed to delete lesson.");
  }
});

router.get("/students", async (req, res) => {
  try {
    const data = await getInstructorStudentsData(req.query.teacherId);

    if (!data) {
      return res.status(404).json({ success: false, message: "Instructor not found." });
    }

    res.json({ success: true, data });
  } catch (error) {
    handleRouteError(res, error, "Failed to load instructor students data.");
  }
});

router.get("/quizzes", async (req, res) => {
  try {
    const data = await getInstructorQuizzesData(req.query.teacherId);

    if (!data) {
      return res.status(404).json({ success: false, message: "Instructor not found." });
    }

    res.json({ success: true, data });
  } catch (error) {
    handleRouteError(res, error, "Failed to load instructor quizzes data.");
  }
});

router.get("/interaction", async (req, res) => {
  try {
    const data = await getInstructorInteractionData(req.query.teacherId);

    if (!data) {
      return res.status(404).json({ success: false, message: "Instructor not found." });
    }

    res.json({ success: true, data });
  } catch (error) {
    handleRouteError(res, error, "Failed to load instructor interaction data.");
  }
});

router.get("/analytics", async (req, res) => {
  try {
    const data = await getInstructorAnalyticsData(req.query.teacherId);

    if (!data) {
      return res.status(404).json({ success: false, message: "Instructor not found." });
    }

    res.json({ success: true, data });
  } catch (error) {
    handleRouteError(res, error, "Failed to load instructor analytics data.");
  }
});

export default router;
