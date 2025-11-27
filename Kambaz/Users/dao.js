import model from "./model.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
export default function UsersDao() {
  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    return model.create(newUser);
  };

  const findAllUsers = () => model.find();
  const findUserById = (userId) => model.findById(userId);
  const findUserByUsername = (username) =>
    model.findOne({ username: username });
  // ...existing code...
  const findUserByCredentials = async (username, password) => {
    const normalizedUsername = username?.trim();
    const normalizedPassword = password?.trim();

    // TEMP debug: show model/collection info
    console.log("DAO: model info:", {
      modelName: model.modelName,
      collection: model.collection && model.collection.name,
    });

    console.log("DAO: findUserByCredentials query:", {
      username: normalizedUsername,
      password: normalizedPassword,
    });

    // find by username first so we can inspect what's stored
    const user = await model.findOne({ username: normalizedUsername }).lean();
    console.log(
      "DAO: findUserByCredentials found user:",
      !!user,
      user && {
        _id: user._id,
        username: user.username,
        passwordStored: user.password,
      }
    );

    if (!user) {
      // show collection size and a sample document to inspect field names/structure
      try {
        const count = await model.countDocuments();
        const sample = await model.findOne().lean();
        console.log("DAO: collection count:", count);
        console.log(
          "DAO: sample document keys:",
          sample && Object.keys(sample)
        );
        console.log("DAO: sample document (debug):", sample);
      } catch (e) {
        console.log("DAO: error inspecting collection:", e.message);
      }
      return null;
    }

    // plaintext compare per your request
    if ((user.password?.toString()?.trim() || "") === normalizedPassword) {
      return user;
    }
    return null;
  };
  // ...existing code...
  const updateUser = (userId, user) =>
    model.updateOne({ _id: userId }, { $set: user });
  const findUsersByRole = (role) => model.find({ role: role });
  const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
    return model.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
  };
  const deleteUser = (userId) => model.findByIdAndDelete(userId);

  return {
    findUsersByRole,
    findUsersByPartialName,
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    updateUser,
    deleteUser,
  };
}
