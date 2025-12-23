const Giving = require('../models/giving.model');
const User = require('../models/user/user.model');

// Create a new giving submission (Alumni only)
exports.createGiving = async (req, res) => {
  try {
    const { user_id } = req.user;
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role !== 'alumni' || !user.verified_alumni) {
      return res.status(403).json({
        success: false,
        message: 'Only verified alumni can submit giving',
      });
    }

    const { title, content } = req.body;
    const images = req.files ? req.files.map((file) => file.filename) : [];

    // Validate title and content length
    if (!title || title.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Title is required and must be 50 characters or less',
      });
    }

    if (!content || content.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Content is required and must be 500 characters or less',
      });
    }

    const giving = await Giving.create({
      title,
      content,
      images,
      userId: user_id,
    });

    return res.status(201).json({
      success: true,
      data: giving,
      message: 'Giving submitted successfully',
    });
  } catch (error) {
    console.error('Error creating giving:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating giving',
    });
  }
};

// Get user's own giving submissions
exports.getMyGiving = async (req, res) => {
  try {
    const { user_id } = req.user;

    const givings = await Giving.find({ userId: user_id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: givings,
      message: 'Giving submissions fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching giving:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching giving',
    });
  }
};

// Get all giving submissions (Admin only) with search and sort
exports.getAllGiving = async (req, res) => {
  try {
    const { title, content, author, sortBy } = req.query;

    // Build query object
    const queryObj = {};

    if (title) {
      queryObj.title = { $regex: title, $options: 'i' };
    }

    if (content) {
      queryObj.content = { $regex: content, $options: 'i' };
    }

    // If author search is provided, find matching users first
    if (author) {
      const users = await User.find({
        name: { $regex: author, $options: 'i' },
      }).select('_id');

      const userIds = users.map((user) => user._id);
      queryObj.userId = { $in: userIds };
    }

    // Sort options
    let sortOptions = { createdAt: -1 }; // Default: newest first
    if (sortBy === 'status') {
      sortOptions = { status: 1, createdAt: -1 };
    }

    const givings = await Giving.find(queryObj)
      .sort(sortOptions)
      .populate('userId', 'name email')
      .lean();

    return res.status(200).json({
      success: true,
      count: givings.length,
      data: givings,
      message: 'Giving submissions fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching all giving:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching giving',
    });
  }
};

// Update giving status to 'viewed' (Admin only)
exports.updateGivingStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const giving = await Giving.findById(id);
    if (!giving) {
      return res.status(404).json({
        success: false,
        message: 'Giving submission not found',
      });
    }

    giving.status = 'viewed';
    await giving.save();

    return res.status(200).json({
      success: true,
      data: giving,
      message: 'Giving marked as viewed',
    });
  } catch (error) {
    console.error('Error updating giving status:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating giving status',
    });
  }
};

// Respond to giving submission (Admin only)
exports.respondToGiving = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({
        success: false,
        message: 'Answer is required',
      });
    }

    const giving = await Giving.findById(id);
    if (!giving) {
      return res.status(404).json({
        success: false,
        message: 'Giving submission not found',
      });
    }

    giving.answer = answer;
    giving.status = 'responded';
    await giving.save();

    return res.status(200).json({
      success: true,
      data: giving,
      message: 'Response submitted successfully',
    });
  } catch (error) {
    console.error('Error responding to giving:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error responding to giving',
    });
  }
};
