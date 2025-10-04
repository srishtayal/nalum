const User = require("../models/user/user.model"); // Mongoose model
const Profile = require("../models/user/profile.model");

// Create User
exports.create = async (userData) => {
  const requiredFields = [
    "email",
    "password",
    "name",
    "batch",
    "branch",
    "campus",
    "phone_number",
    "role",
  ];
  for (const field of requiredFields) {
    if (!userData[field]) {
      return { error: true, message: `Missing required field: ${field}` };
    }
  }
  try {
    const user = await User.create(userData);
    const profileData = {
      user: user._id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      batch: user.batch,
      branch: user.branch,
      campus: user.campus,
    };
    const profile = await Profile.create(profileData);
    return { error: false, data: { user, profile } };
  } catch (err) {
    return { error: true, message: err.message || "Error creating user" };
  }
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
exports.findById = async (id) => {
  if (!id) {
    return { error: true, message: "User Id is required" };
  }
  try {
    const data = await User.findById(id);
    return { error: false, data };
  } catch (err) {
    return {
      error: true,
      message: err.message || "Some error occurred while searching for the User.",
    };
  }
};

// Update user
exports.update = async (email, changes) => {
  if (!email || !changes) {
    return { error: true, message: "Email and changes are required" };
  }
  try {
    await User.updateOne(
      { email: { $regex: new RegExp(`^${email}$`, "i") } },
      { $set: changes }
    );
    return { error: false, message: "User updated successfully" };
  } catch (err) {
    return {
      error: true,
      message: err.message,
    };
  }
};
