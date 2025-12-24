const Query = require('../models/query.model');
const User = require('../models/user/user.model');

// Create a new query (Students & Alumni)
exports.createQuery = async (req, res) => {
  try {
    const { user_id } = req.user;
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

    const query = await Query.create({
      title,
      content,
      images,
      userId: user_id,
    });

    return res.status(201).json({
      success: true,
      data: query,
      message: 'Query submitted successfully',
    });
  } catch (error) {
    console.error('Error creating query:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating query',
    });
  }
};

// Get user's own queries
exports.getMyQueries = async (req, res) => {
  try {
    const { user_id } = req.user;

    const queries = await Query.find({ userId: user_id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: queries,
      message: 'Queries fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching queries:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching queries',
    });
  }
};

// Get all queries (Admin only) with search and sort
exports.getAllQueries = async (req, res) => {
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

    const queries = await Query.find(queryObj)
      .sort(sortOptions)
      .populate('userId', 'name email')
      .lean();

    return res.status(200).json({
      success: true,
      count: queries.length,
      data: queries,
      message: 'Queries fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching all queries:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching queries',
    });
  }
};

// Update query status to 'viewed' (Admin only)
exports.updateQueryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const query = await Query.findById(id);
    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found',
      });
    }

    query.status = 'viewed';
    await query.save();

    return res.status(200).json({
      success: true,
      data: query,
      message: 'Query marked as viewed',
    });
  } catch (error) {
    console.error('Error updating query status:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating query status',
    });
  }
};

// Respond to query (Admin only)
exports.respondToQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({
        success: false,
        message: 'Answer is required',
      });
    }

    const query = await Query.findById(id);
    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found',
      });
    }

    query.answer = answer;
    query.status = 'responded';
    await query.save();

    return res.status(200).json({
      success: true,
      data: query,
      message: 'Response submitted successfully',
    });
  } catch (error) {
    console.error('Error responding to query:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error responding to query',
    });
  }
};
