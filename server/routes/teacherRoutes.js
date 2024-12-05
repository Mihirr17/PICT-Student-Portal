// routes/teacherRoutes.js

const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");


// Route to create a new teacher
router.post("/", teacherController.createNewTeacher);

// Route to get a list of teacher names by department
router.get("/list/:department", teacherController.getTeacherList);

// Route to get unapproved teachers by department
router.get("/unapproved/:department", teacherController.getNewTeachers);

// Route to get teachers by status (e.g., approved/unapproved)
router.get("/status/:status", teacherController.getTeachersByStatus);

// Route to update teacher status (e.g., approve/reject)
router.patch("/:id/status", teacherController.updateTeacherStatus);

// Routes to get, update (approve), and delete a teacher by ID
router
  .route("/:id")
  .get(teacherController.getTeacher) // Get a teacher by ID
  .patch(teacherController.approveTeacher) // Approve a teacher by ID
  .delete(teacherController.deleteTeacher); // Delete a teacher by ID

// New route to approve teachers by subject
router.get("/approve/:subject", teacherController.approveTeachersBySubject);

module.exports = router;
