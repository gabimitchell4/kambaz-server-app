import { v4 as uuidv4 } from "uuid";
export default function CoursesDao(db) {
  function findAllCourses() {
    console.log("Finding all courses");
    return db.courses;
  }

  function findCoursesForEnrolledUser(userId) {
    const { courses, enrollments } = db;
    console.log("Finding courses for userId:", userId);
    console.log(
      "Enrollments for user:",
      enrollments.filter((enrollment) => enrollment.user === userId)
    );
    const enrolledCourses = courses.filter((course) =>
      enrollments.some(
        (enrollment) =>
          enrollment.user === userId && enrollment.course === course._id
      )
    );
    return enrolledCourses;
  }

  function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    db.courses = [...db.courses, newCourse];
    console.log("Created new course:", newCourse);
    console.log("Updated courses list:", db.courses);
    return db.courses;
  }

  function deleteCourse(courseId) {
    const { courses, enrollments } = db;
    db.courses = courses.filter((course) => course._id !== courseId);
    db.enrollments = enrollments.filter(
      (enrollment) => enrollment.course !== courseId
    );
  }

  function updateCourse(courseId, courseUpdates) {
    const { courses } = db;
    const course = courses.find((course) => course._id === courseId);
    Object.assign(course, courseUpdates);
    return course;
  }

  function findEnrollmentsForUserInCourse(userId) {
    const { enrollments } = db;
    return enrollments.filter(
      (enrollment) =>
        enrollment.user === userId
    );
  }

  return {
    findAllCourses,
    createCourse,
    findCoursesForEnrolledUser,
    deleteCourse,
    updateCourse,
  };
}
