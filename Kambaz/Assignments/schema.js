import mongoose from "mongoose";
const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    course: { type: String, ref: "CourseModel" },
    releaseDate: Date,
    dueDate: Date,
    untilDate: Date,
    points: Number,
    description: String,
    displayType: String,
    assignmentGroup: String,
    submissionType: String,
    onlineEntryOption: String,
    assignTo: String,
  },
  { collection: "assignments" }
);
export default assignmentSchema;