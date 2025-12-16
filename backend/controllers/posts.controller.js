const Post = require("../models/posts/post.model");
const User = require("../models/user/user.model");

exports.createPost = async (req, res) => {
  try {
    const { user_id } = req.user;
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "alumni" || !user.verified_alumni) {
      return res.status(403).json({
        success: false,
        message: "Only verified alumni can create posts",
      });
    }

    const { title, content } = req.body;
    const images = req.files ? req.files.map((file) => file.filename) : [];

    const post = await Post.create({
      title,
      content,
      images,
      userId: user_id,
    });

    return res.status(201).json({
      success: true,
      data: post,
      message: "Post created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error creating post",
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email role");

    const total = await Post.countDocuments();

    return res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
      },
      message: "Posts fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching posts",
    });
  }
};

exports.searchPosts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Find users matching the name
    const users = await User.find({
      name: { $regex: query, $options: "i" },
    }).select("_id");

    const userIds = users.map((user) => user._id);

    // Find posts matching title OR userId in the found users
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { userId: { $in: userIds } },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("userId", "name email role");

    return res.status(200).json({
      success: true,
      data: posts,
      message: "Posts found successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error searching posts",
    });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "userId",
      "name email role"
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
      message: "Post fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching post",
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { user_id } = req.user;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.userId.toString() !== user_id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this post",
      });
    }

    const { title, content } = req.body;
    const newImages = req.files ? req.files.map((file) => file.filename) : [];

    if (title) post.title = title;
    if (content) post.content = content;
    if (newImages.length > 0) post.images = newImages;

    await post.save();

    return res.status(200).json({
      success: true,
      data: post,
      message: "Post updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error updating post",
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { user_id } = req.user;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.userId.toString() !== user_id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      data: {},
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error deleting post",
    });
  }
};
