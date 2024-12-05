const Teacher = require("./../models/Teacher");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get Teacher
// @route GET /teachers/:id
// @access Private
const getTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "ID Missing" });

  const teacher = await Teacher.findById(id)
    .select("-password -_id -__v")
    .lean();
  if (!teacher) {
    return res.status(404).json({ message: "No Teacher Found." });
  }
  res.json(teacher);
});

// @desc Get unapproved Teachers by department
// @route GET /teachers/unapproved/:department
// @access Private
const getNewTeachers = asyncHandler(async (req, res) => {
  if (!req?.params?.department)
    return res.status(400).json({ message: "Params Missing" });

  const teachers = await Teacher.find({
    department: req.params.department,
    role: "", // Assuming empty roles means unapproved
  })
    .select("-password")
    .lean();
  if (!teachers?.length) {
    return res.status(404).json({ message: "No Registered Teachers(s) Found." });
  }
  res.json(teachers);
});

// @desc Get Teacher Names only by department
// @route GET /teachers/list/:department
// @access Private
const getTeacherList = asyncHandler(async (req, res) => {
  const { department } = req.params;
  if (!department) return res.status(400).json({ message: "Department Missing" });

  const teachersList = await Teacher.find({ department })
    .select("name")
    .lean();
  if (!teachersList.length) {
    return res.status(404).json({ message: "No Teacher(s) Found" });
  }
  res.json(teachersList);
});

// @desc Create New Teacher
// @route POST /teachers
// @access Private
const createNewTeacher = asyncHandler(async (req, res) => {
  const { username, name, email, qualification, department, password, roles, status } = req.body;

  // Confirm Data
  if (!username || !name || !email || !qualification || !department || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for Duplicates
  const duplicate = await Teacher.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Username" });
  }

  // Hash Password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const teacherObj = {
    username,
    name,
    email,
    qualification,
    department,
    password: hashedPwd,
    roles: roles || [], // roles could be empty initially
    status: status || 'pending', // Set default status if not provided
  };

  // Create and Store New teacher
  const teacher = await Teacher.create(teacherObj);
  if (teacher) {
    res.status(201).json({ message: `New Teacher ${username} Registered` });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Approve Teacher by updating roles
// @route PATCH /teachers/:id
// @access Private
const approveTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { roles } = req.body;

  // Validate ID and roles
  if (!id) {
    return res.status(400).json({ message: "Teacher ID is required" });
  }
  if (!roles || !Array.isArray(roles) || roles.length === 0) {
    return res.status(400).json({ message: "Roles must be a non-empty array" });
  }

  // Find the teacher
  const teacher = await Teacher.findById(id).exec();
  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  // Update roles
  teacher.roles = roles;

  // Save the updated teacher
  try {
    await teacher.save();
    res.json({ message: `Teacher ${teacher.username} approved successfully` });
  } catch (error) {
    console.error("Error saving teacher:", error);
    res.status(500).json({ message: "Failed to approve teacher. Please try again." });
  }
});


// @desc Delete Teacher by ID
// @route DELETE /teachers/:id
// @access Private
const deleteTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Teacher ID required" });
  }

  // Find Teacher
  const teacher = await Teacher.findById(id).exec();
  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  const result = await teacher.deleteOne();
  res.json({ message: `${teacher.username} deleted` });
});

// @desc Get Teachers by Status
// @route GET /teachers/status/:status
// @access Private
const getTeachersByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  if (!status) return res.status(400).json({ message: "Status Missing" });

  const teachers = await Teacher.find({ status })
    .select("-password")
    .lean();
  if (!teachers.length) {
    return res.status(404).json({ message: "No Teachers Found for the given status" });
  }
  res.json(teachers);
});


// @desc Update Teacher Status
// @route PATCH /teachers/:id/status
// @access Private
const updateTeacherStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: "Status is required" });

  const teacher = await Teacher.findByIdAndUpdate(id, { status }, { new: true })
    .select("-password")
    .lean();
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  res.json({ message: "Teacher status updated successfully", teacher });
});

// @desc Approve Teachers by Subject
// @route PATCH /teachers/approve/:subject
// @access Private
const approveTeachersBySubject = asyncHandler(async (req, res) => {
  const { subject } = req.params;

  if (!subject) {
    return res.status(400).json({ message: "Subject is required" });
  }

  // Find teachers with the given subject and unapproved status
  const teachers = await Teacher.find({ subject, status: "pending" }).exec();

  if (!teachers.length) {
    return res.status(404).json({ message: "No Teachers Found for the given subject" });
  }

  // Update the status of all matching teachers to 'approved'
  const updatedTeachers = await Teacher.updateMany(
    { subject, status: "pending" },
    { $set: { status: "approved" } }
  );

  res.json({
    message: `Approved ${updatedTeachers.modifiedCount} teachers for the subject: ${subject}`,
  });
});


module.exports = {
  getTeacher,
  getNewTeachers,
  getTeacherList,
  createNewTeacher,
  approveTeacher,
  deleteTeacher,
  getTeachersByStatus,
  updateTeacherStatus,
  approveTeachersBySubject,
};
