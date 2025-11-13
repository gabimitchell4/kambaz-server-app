import { v4 as uuidv4 } from "uuid";
export default function UsersDao(db) {
  let { users } = db;
  const findAllUsers = () => users;
  const findUserById = (userId) => users.find((user) => user._id === userId);
  console.log("Searching for user with username:", users);
  const findUserByCredentials = (username, password) =>
    users.find(
      (user) => user.username === username && user.password === password
    );
    console.log("Searching for user with username:", users);
  const deleteUser = (userId) =>
    (users = users.filter((u) => u._id !== userId));
  const createUser = (user) => (users = [...users, { ...user, _id: uuidv4() }]);
  const findUserByUsername = (username) =>
    users.find((user) => user.username === username);
  const updateUser = (userId, user) =>
    (users = users.map((u) => (u._id === userId ? user : u)));
  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    updateUser,
    deleteUser,
  };
}
