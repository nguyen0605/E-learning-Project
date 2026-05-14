import { Router } from "express";
import {
  getAdminGeneralContentData,
  deleteAdminFaq,
  updateAdminBanner,
  updateAdminFaq,
} from "../services/adminContent.service.js";
import {
  getAdminCoursesPageData,
  getAdminCourseDetail,
  reviewAdminCourse,
} from "../services/adminCourses.service.js";
import {
  getAdminSystemConfigData,
  updateAdminSystemConfigData,
} from "../services/adminConfig.service.js";
import { getAdminDashboardData } from "../services/adminDashboard.service.js";
import {
  getAdminStudentDetail,
  getAdminStudentsPageData,
  updateAdminStudentStatus,
} from "../services/adminStudents.service.js";

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
    const data = await getAdminDashboardData();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to load admin dashboard data.");
  }
});

router.get("/students", async (req, res) => {
  try {
    const data = await getAdminStudentsPageData();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to load admin students data.");
  }
});

router.get("/students/:id", async (req, res) => {
  try {
    const data = await getAdminStudentDetail(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to load student detail.");
  }
});

router.patch("/students/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "suspended", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student status.",
      });
    }

    const data = await updateAdminStudentStatus(req.params.id, status);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to update student status.");
  }
});

router.get("/courses", async (req, res) => {
  try {
    const data = await getAdminCoursesPageData();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to load admin courses data.");
  }
});

router.get("/courses/:id", async (req, res) => {
  try {
    const data = await getAdminCourseDetail(req.params.id);

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

router.patch("/courses/:id/review", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course review status.",
      });
    }

    const data = await reviewAdminCourse(req.params.id, status);

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
    handleRouteError(res, error, "Failed to update course review status.");
  }
});

router.get("/system-config", async (req, res) => {
  try {
    const data = await getAdminSystemConfigData();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to load system configuration.");
  }
});

router.put("/system-config", async (req, res) => {
  try {
    const data = await updateAdminSystemConfigData(req.body ?? {});

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to update system configuration.");
  }
});

router.get("/general-content", async (req, res) => {
  try {
    const data = await getAdminGeneralContentData();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to load general content data.");
  }
});

router.patch("/general-content/faqs/:id", async (req, res) => {
  try {
    const data = await updateAdminFaq(req.params.id, req.body ?? {});

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to update FAQ.");
  }
});

router.delete("/general-content/faqs/:id", async (req, res) => {
  try {
    const deleted = await deleteAdminFaq(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    res.json({
      success: true,
      data: {
        deleted: true,
      },
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to delete FAQ.");
  }
});

router.patch("/general-content/banners/:id", async (req, res) => {
  try {
    const data = await updateAdminBanner(req.params.id, req.body ?? {});

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Banner not found.",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleRouteError(res, error, "Failed to update banner.");
  }
});

export default router;
