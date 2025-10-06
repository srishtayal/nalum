const User = require("../models/user/user.model"); // Mongoose model
const Profile = require("../models/user/profile.model");

// Create User
exports.create = async (userData) => {
  // Required fields for User + required profile fields
  const requiredUserFields = ["email", "password", "role"];
  const requiredProfileFields = ["name", "batch", "branch", "campus"];

  for (const field of requiredUserFields) {
    if (!userData[field]) {
      return { error: true, message: `Missing required user field: ${field}` };
    }
  }
  for (const field of requiredProfileFields) {
    if (!userData[field]) {
      return { error: true, message: `Missing required profile field: ${field}` };
    }
  }

  try {
    // Only store fields that exist on User model
    const userPayload = {
      email: userData.email,
      password: userData.password,
      role: userData.role,
      email_verified: userData.email_verified || false,
      customCV: userData.customCV || undefined,
    };

    const user = await User.create(userPayload);

    // Build profile from provided profile fields
    const profileData = {
      user: user._id,
      name: userData.name,
      batch: userData.batch,
      branch: userData.branch,
      campus: userData.campus,
      skills: Array.isArray(userData.skills) ? userData.skills : [],
      experience: Array.isArray(userData.experience) ? userData.experience : [],
      education: Array.isArray(userData.education) ? userData.education : [],
      honours: Array.isArray(userData.honours) ? userData.honours : [],
      projects: Array.isArray(userData.projects) ? userData.projects : [],
      publications: Array.isArray(userData.publications) ? userData.publications : [],
      social_media: userData.social_media || {},
      status: userData.status || undefined,
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
