import UserModel from "../models/user.model.js";

async function createUser({ firstname, lastname, email, password }) {
  if (!firstname || !email || !password) {
    throw new Error("All fields are required");
  }

  const user = await UserModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
  });

  return user;
}

const userService = {
  createUser,
};
export default userService;
