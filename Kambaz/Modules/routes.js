import ModulesDao from "../Modules/dao.js";
export default function ModulesRoutes(app, db) {
  const dao = ModulesDao(db);
  const findModulesForCourse = async (req, res) => {
    console.log("Finding modules for courseId (route) ebfroe:");
    const { courseId } = req.params;
    const modules = await dao.findModulesForCourse(courseId);
    res.json(modules);
  };

  const deleteModule = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const status = await modulesDao.deleteModule(courseId, moduleId);
    res.send(status);
  };

  const updateModule = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const moduleUpdates = req.body;
    const status = await modulesDao.updateModule(
      courseId,
      moduleId,
      moduleUpdates
    );
    res.send(status);
  };

  const createModuleForCourse = async (req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
      // course: courseId,
    };
    const newModule = await dao.createModule(courseId, module);
    res.send(newModule);
  };

  app.delete("/api/courses/:courseId/modules/:moduleId", deleteModule);
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.put("/api/courses/:courseId/modules/:moduleId", updateModule);
}
