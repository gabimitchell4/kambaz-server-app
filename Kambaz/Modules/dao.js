import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js";
export default function ModulesDao(db) {
  async function findModulesForCourse(courseId) {
    const course = await model.findById(courseId);
    console.log("Find modules for course11", course); // Debugging: Check the course object
    return course.modules;
  }

  async function createModule(module) {
    const newModule = { ...module, _id: uuidv4() };
    return model.create(newModule);
  }

  async function deleteModule(courseId, moduleId) {
    const status = await model.updateOne(
      { _id: courseId },
      { $pull: { modules: { _id: moduleId } } }
    );
    return status;
    // const { modules } = db;
    // Database.modules = modules.filter((module) => module._id !== moduleId);
  }

  async function updateModule(courseId, moduleId, moduleUpdates) {
    const course = await model.findById(courseId);
    const module = course.modules.id(moduleId);
    Object.assign(module, moduleUpdates);
    await course.save();
    return module;
  }

  return {
    createModule,
    updateModule,
    findModulesForCourse,
    deleteModule,
  };
}
