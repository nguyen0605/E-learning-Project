import { Router } from "express";
import {
  addStudentCartItem,
  getStudentCart,
  removeStudentCartItem,
} from "../services/studentCart.service.js";
import {
  getStudentCourseCategories,
  getStudentCourseDetail,
  getStudentCourses,
  getStudentEnrolledCourses,
} from "../services/studentCourses.service.js";
import {
  assignmentUploadMiddleware,
  saveStudentAssignmentSubmission,
} from "../services/studentAssignments.service.js";

const router = Router();

function handleRouteError(res, error, message) {
  console.error(message, error);

  res.status(500).json({
    success: false,
    message,
  });
}

router.get("/course-categories", async (req, res) => {
  try {
    const data = await getStudentCourseCategories();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to load course categories.");
  }
});

router.get("/cart", async (req, res) => {
  try {
    const data = await getStudentCart(req.auth.user.id);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to load cart.");
  }
});

router.post("/cart/items", async (req, res) => {
  try {
    const batchId = Number(req.body?.batchId);

    if (!Number.isInteger(batchId) || batchId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch id.",
      });
    }

    const result = await addStudentCartItem(req.auth.user.id, batchId);

    if (!result.ok) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Course added to cart.",
      data: result.cart,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to add cart item.");
  }
});

router.delete("/cart/items/:id", async (req, res) => {
  try {
    const cartItemId = Number(req.params.id);

    if (!Number.isInteger(cartItemId) || cartItemId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item id.",
      });
    }

    const deleted = await removeStudentCartItem(req.auth.user.id, cartItemId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found.",
      });
    }

    res.json({
      success: true,
      data: {
        deleted: true,
      },
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to remove cart item.");
  }
});

router.get("/courses", async (req, res) => {
  try {
    const data = await getStudentCourses({
      categoryId: req.query.categoryId,
      level: req.query.level,
      search: req.query.search,
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to load courses.");
  }
});

router.get("/my-courses", async (req, res) => {
  try {
    const data = await getStudentEnrolledCourses(req.auth.user.id);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to load enrolled courses.");
  }
});

router.post("/assignments/:id/submission", (req, res) => {
  assignmentUploadMiddleware(req, res, async (uploadError) => {
    if (uploadError) {
      return res.status(400).json({
        success: false,
        message: uploadError.message || "Không thể tải file bài nộp.",
      });
    }

    try {
      const assignmentId = Number(req.params.id);

      if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid assignment id.",
        });
      }

      const result = await saveStudentAssignmentSubmission(
        assignmentId,
        req.auth.user.id,
        {
          ...req.body,
          file: req.file ?? null,
        },
      );

      if (!result.ok) {
        return res.status(result.status).json({
          success: false,
          message: result.message,
        });
      }

      res.status(201).json({
        success: true,
        data: result.submission,
      });
    } catch (error) {
      handleRouteError(res, error, "Failed to save assignment submission.");
    }
  });
});

router.get("/courses/:id", async (req, res) => {
  try {
    const data = await getStudentCourseDetail(req.params.id, req.auth.user.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to load course detail.");
  }
});

export default router;
