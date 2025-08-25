const User = require("../models/user/user.model"); // Mongoose model
const generator = require("./components/generator");

// Create User
exports.create = async (userData) => {
  if (!userData.email || !userData.password) {
    return { error: true, message: "Email and Password are required" };
  }

  return await generator(User, userData);
};

// Find one by email (case-insensitive)
exports.findOne = async (email) => {
  if (!email) {
    return { error: true, message: "Email is required" };
  }

  try {
    const data = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") }, // case-insensitive
    });
    return { error: false, data };
  } catch (err) {
    return {
      error: true,
      message: err.message || "Some error occurred while searching for the User.",
    };
  }
};

// Find by user_id (if you have custom user_id field)
exports.findById = async (user_id) => {
  if (!user_id) {
    return { error: true, message: "User Id is required" };
  }

  try {
    const data = await User.findOne({ user_id }); // if using custom user_id
    // OR: const data = await User.findById(user_id); if you're using Mongo's _id
    return { error: false, data };
  } catch (err) {
    return {
      error: true,
      message: err.message || "Some error occurred while searching for the User.",
    };
  }
};

// Update user
exports.update = async (user_id, changes) => {
  if (!user_id || !changes) {
    return { error: true, message: "User ID and changes are required" };
  }

  try {
    await User.updateOne({ user_id }, { $set: changes });
    // OR if using Mongo's default _id: await User.findByIdAndUpdate(user_id, { $set: changes });
    return { error: false, message: "User updated successfully" };
  } catch (err) {
    return {
      error: true,
      message: err.message,
    };
  }
};
