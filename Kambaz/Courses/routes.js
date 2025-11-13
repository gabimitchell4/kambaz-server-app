import CoursesDao from "./dao.js";
import ModulesDao from "../Modules/dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";
import AssignmentsDao from "../Assignments/dao.js";
export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const modulesDao = ModulesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);
  const assignmentDao = AssignmentsDao(db);
  const createCourse = (req, res) => {
    console.log("Creating course with data:", req.body);
    const currentUser = req.session["currentUser"];
    const newCourse = dao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };
  const findAllCourses = (req, res) => {
    const courses = dao.findAllCourses();
    console.log("Fetched courses:", courses);
    console.log("db.courses:", db);
    res.send(courses);
  };

  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = dao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  const deleteCourse = (req, res) => {
    const { courseId } = req.params;
    const status = dao.deleteCourse(courseId);
    res.send(status);
  };

  const updateCourse = (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  };

  const createModuleForCourse = (req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
      course: courseId,
    };
    const newModule = modulesDao.createModule(module);
    res.send(newModule);
  };

  const findModulesForCourse = (req, res) => {
    console.log("Finding modules for courseId (route) ebfroe:");
    const { courseId } = req.params;
    console.log("Finding modules for courseId (route):", courseId);
    const modules = modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  };

  const updateModuleForCourse = (req, res) => {
    const { courseId } = req.params;
    const moduleUpdates = req.body;
    const moduleId = moduleUpdates._id;
    const status = modulesDao.updateModule(moduleId, moduleUpdates);
    res.send(status);
  };

  const deleteModule = (req, res) => {
    const { moduleId } = req.params;
    const status = modulesDao.deleteModule(moduleId);
    res.send(status);
  };

  const enrollInCourse = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    enrollmentsDao.enrollUserInCourse({ ...req.body, user: userId });
    res.sendStatus(200);
  };

  const unenrollInCourse = (req, res) => {
    let { userId, courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    enrollmentsDao.unenrollInCourse(userId, courseId);
    res.sendStatus(200);
  };

  const findEnrollmentsForUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    console.log("Finding enrollments for userId:", userId);
    const enrollments = enrollmentsDao.findEnrollmentsForUserInCourse(userId);
    res.json(enrollments);
  };


  const createAssignment = (req, res) => {
    console.log("Creating assignment with data:", req.body);
    const newAssignment = assignmentDao.createAssignment(req.body);
    res.json(newAssignment);
  };
  const findAllAssignmentsForCourse = (req, res) => {
    console.log("Finding assignments for courseId (route)123:");
    const { courseId } = req.params;
    console.log("Finding assignments for courseId (route):", courseId);
    const assignments = assignmentDao.findAllAssignmentsForCourse(courseId);
    res.json(assignments);
  };

  const findAssignmentById = (req, res) => {
    const { assignmentId } = req.params;
    const assignment = assignmentDao.findAssignmentById(assignmentId);
    if (assignment) {
      res.json(assignment);
    } else {
      res.sendStatus(404);
    }
  };

  const deleteAssignment = (req, res) => {
    console.log("Deleting assignment with ID:");
    const { assignmentId } = req.params;
    assignmentDao.deleteAssignment(assignmentId);
    res.sendStatus(200);
  };
  const updateAssignment = (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    const updatedAssignment = assignmentDao.updateAssignment(
      assignmentId,
      assignmentUpdates
    );
    res.json(updatedAssignment);
  };

  const getCurrentUser = (req, res) => {
    const currentUser = req.session?.currentUser;
    if (!currentUser) {
      return res.status(401).json({ error: "Not signed in" });
    }
    return res.json(currentUser);
  }

  app.post("/api/users/:userId/enrollments/:courseId", enrollInCourse);
  app.delete("/api/users/:userId/enrollments/:courseId", unenrollInCourse);
  app.delete("/api/modules/:moduleId", deleteModule);
  app.put("/api/modules/:moduleId", updateModuleForCourse);
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.post("/api/users/:courseId/courses", createCourse);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.get("/api/courses", findAllCourses);
  app.get("/api/users/:userId/enrollments", findEnrollmentsForUser);
  app.get("api/profile", getCurrentUser);

  app.post("/api/assignments", createAssignment);
  app.get("/api/courses/:courseId/assignments", findAllAssignmentsForCourse);
  app.get("/api/assignments/:assignmentId", findAssignmentById);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.get("/api/currentUser", getCurrentUser);
}
