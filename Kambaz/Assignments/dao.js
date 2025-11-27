import { v4 as uuidv4 } from "uuid";
import AssignmentModel from "./model.js";

export default function AssignmentsDao() {
  async function createAssignment(assignment) {
    const newAssignment = new AssignmentModel({ ...assignment, _id: uuidv4() });
    await newAssignment.save();
    console.log("Created new assignment:", newAssignment);
    return newAssignment;
  }

  async function findAllAssignmentsForCourse(courseId) {
    console.log("Finding assignments for courseId:", courseId);
    return await AssignmentModel.find({ course: courseId });
  }

  async function findAssignmentById(assignmentId) {
    console.log("Finding assignment by assignmentId:", assignmentId);
    return await AssignmentModel.findById(assignmentId);
  }

  async function deleteAssignment(assignmentId) {
    await AssignmentModel.findByIdAndDelete(assignmentId);
    console.log("Deleted assignment with id:", assignmentId);
  }

  async function updateAssignment(assignmentId, assignmentData) {
    const updatedAssignment = await AssignmentModel.findByIdAndUpdate(
      assignmentId,
      assignmentData,
      { new: true, upsert: true }
    );
    console.log("Updated assignment:", updatedAssignment);
    return updatedAssignment;
  }

  return {
    createAssignment,
    findAssignmentById,
    findAllAssignmentsForCourse,
    deleteAssignment,
    updateAssignment,
  };
}
