const Profile = require("../models/user/profile.model");
const User = require("../models/user/user.model");

const searchProfiles = async (req, res) => {
  try {
    const { name, graduationYear, skills, campus, branch, page = 1, limit = 10 } = req.query;

    let userQuery = {};
    if (name) {
      userQuery.name = { $regex: name, $options: "i" };
    }

    let users = [];
    if (Object.keys(userQuery).length > 0) {
      users = await User.find(userQuery).select("_id");
    }

    let profileQuery = {};
    if (users.length > 0) {
      profileQuery.user = { $in: users.map((user) => user._id) };
    }

    if (graduationYear) {
      profileQuery.batch = graduationYear;
    }

    if (skills) {
      profileQuery.skills = { $in: skills.split(",") };
    }

    if (campus) {
      profileQuery.campus = campus;
    }

    if (branch) {
      profileQuery.branch = { $regex: `^${branch}$`, $options: "i" };
    }

    const profiles = await Profile.find(profileQuery)
      .populate("user", "name email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Profile.countDocuments(profileQuery);

    res.json({
      profiles,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchProfiles,
};
