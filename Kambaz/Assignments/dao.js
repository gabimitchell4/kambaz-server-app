import { v4 as uuidv4 } from "uuid";
export default function AssignmentsDao(db) {
  function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    db.assignments = [...db.assignments, newAssignment];
    console.log("Created new assignment:", newAssignment);
    console.log("Updated assignments list:", db.assignments);
    return newAssignment;
  }
  function findAllAssignmentsForCourse(courseId) {
    console.log("Finding assignments for courseId:", courseId);
    const { assignments } = db;
    return assignments.filter(
      (assignment) => assignment.course === courseId
    );
  }
  function findAssignmentById(assignmentId) {
    console.log("Finding assignment by assignmentId:", assignmentId);
    const { assignments } = db;
    return assignments.find(
      (assignment) => assignment._id === assignmentId
    );
  } 

  function deleteAssignment(assignmentId) {
    const { assignments } = db;
    db.assignments = assignments.filter(
      (assignment) => assignment._id !== assignmentId
    );
  }

  function updateAssignment(assignmentId, assignmentData) {
    const { assignments } = db;
    const existingAssignment = assignments.find(
      (assignment) => assignment._id === assignmentId
    );
  
    if (existingAssignment) {
      // Update existing assignment
      Object.assign(existingAssignment, assignmentData);
      console.log("Updated assignment:", existingAssignment);
      return existingAssignment;
    } else {
      // Create new assignment
      const newAssignment = { ...assignmentData, _id: assignmentId || uuidv4() };
      db.assignments = [...assignments, newAssignment];
      console.log("Created new assignment:", newAssignment);
      return newAssignment;
    }
  }


  return { createAssignment, findAssignmentById, findAllAssignmentsForCourse, deleteAssignment, updateAssignment };
}


