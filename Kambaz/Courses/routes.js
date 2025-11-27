import CoursesDao from "./dao.js";
import ModulesDao from "../Modules/dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";
import AssignmentsDao from "../Assignments/dao.js";
import ModuleModel from "../Modules/model.js"; // Ensure this is the correct path

export default function CourseRoutes(app) {
  const dao = CoursesDao();
  const modulesDao = ModulesDao();
  const enrollmentsDao = EnrollmentsDao();
  const assignmentDao = AssignmentsDao();
  const createCourse = async (req, res) => {
    console.log("Creating course with data:", req.body);
    const currentUser = req.session["currentUser"];
    const newCourse = await dao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };
  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  };

  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = await req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = await dao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  };

  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  };

  const createModuleForCourse = async (req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
      course: courseId,
    };
    const newModule = await modulesDao.createModule(module);
    res.send(newModule);
  };

  const findModulesForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;

      // Ensure courseId is a string
      if (typeof courseId !== "string") {
        return res.status(400).send({ error: "Invalid courseId" });
      }

      // Query the database
      const modules = await ModuleModel.find({ course: courseId });
      res.json(modules);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  };

  const updateModuleForCourse = async (req, res) => {
    try {
      const { moduleId } = req.params;
      const moduleUpdates = { ...req.body };

      delete moduleUpdates._id;
      const status = await ModuleModel.updateOne(
        { _id: moduleId },
        moduleUpdates
      );

      res.send(status);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  };

  const deleteModule = async (req, res) => {
    const { moduleId } = req.params;
    const status = await modulesDao.deleteModule(moduleId);
    res.send(status);
  };
  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ error: "Not signed in" });
      }
      uid = currentUser._id;
    }
    try {
      await enrollmentsDao.enrollUserInCourse(uid, cid);
      res.sendStatus(200);
    } catch (error) {
      console.error("Error enrolling user in course:", error);
      res.status(500).json({ error: "Failed to enroll user in course" });
    }
  };

  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ error: "Not signed in" });
      }
      uid = currentUser._id;
    }
    try {
      await enrollmentsDao.unenrollUserFromCourse(uid, cid);
      res.sendStatus(200);
    } catch (error) {
      console.error("Error unenrolling user from course:", error);
      res.status(500).json({ error: "Failed to unenroll user from course" });
    }
  };

  const findEnrollmentsForUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = await req.session["currentUser"];
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

  const createAssignment = async (req, res) => {
    console.log("Creating assignment with data:", req.body);
    const newAssignment = await assignmentDao.createAssignment(req.body);
    res.json(newAssignment);
  };
  const findAllAssignmentsForCourse = async (req, res) => {
    console.log("Finding assignments for courseId (route)123:");
    const { courseId } = req.params;
    console.log("Finding assignments for courseId (route):", courseId);
    const assignments = await assignmentDao.findAllAssignmentsForCourse(
      courseId
    );
    res.json(assignments);
  };

  const findAssignmentById = async (req, res) => {
    const { assignmentId } = req.params;
    const assignment = await assignmentDao.findAssignmentById(assignmentId);
    if (assignment) {
      res.json(assignment);
    } else {
      res.sendStatus(404);
    }
  };

  const deleteAssignment = async (req, res) => {
    console.log("Deleting assignment with ID:");
    const { assignmentId } = req.params;
    await assignmentDao.deleteAssignment(assignmentId);
    res.sendStatus(200);
  };
  const updateAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    const updatedAssignment = await assignmentDao.updateAssignment(
      assignmentId,
      assignmentUpdates
    );
    res.json(updatedAssignment);
  };

  const getCurrentUser = async (req, res) => {
    const currentUser = await req.session?.currentUser;
    if (!currentUser) {
      return res.status(401).json({ error: "Not signed in" });
    }
    return res.json(currentUser);
  };

  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  };
  app.get("/api/courses/:cid/users", findUsersForCourse);
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
  app.delete("/api/courses/:courseId/modules/:moduleId", deleteModule);
  app.put("/api/courses/:courseId/modules/:moduleId", updateModuleForCourse);
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
