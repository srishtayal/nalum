const Report = require("../models/report.model");
const Post = require("../models/posts/post.model");
const User = require("../models/user/user.model");

// Submit a report on a post
exports.submitReport = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reason, description } = req.body;
    const userId = req.user.user_id;

    if (!reason || !description) {
      return res.status(400).json({
        success: false,
        message: "Reason and description are required",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.userId.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot report your own post",
      });
    }

    const existingReport = await Report.findOne({ postId, userId });
    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: "You have already reported this post",
      });
    }

    const report = await Report.create({
      type: "post",
      postId,
      userId,
      reason,
      description,
    });

    post.report_count = (post.report_count || 0) + 1;

    if (post.report_count >= 5 && post.status !== "rejected") {
      post.status = "rejected";
      post.rejection_reason = "This post was reported by many users.";
    }

    await post.save();

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      data: report,
    });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit report",
    });
  }
};

// Check if user has already reported a post
exports.checkUserReport = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.user_id;

    const report = await Report.findOne({ postId, userId });

    res.status(200).json({
      success: true,
      hasReported: !!report,
    });
  } catch (error) {
    console.error("Error checking user report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check report status",
    });
  }
};

// Get all reports with pagination and filtering
exports.getReports = async (req, res) => {
  try {
    const { status } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate({
        path: "postId",
        select: "title content userId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    // Transform reports to match frontend expectations (reportedBy instead of userId)
    const transformedReports = reports.map((report) => ({
      _id: report._id,
      postId: report.postId,
      reportedBy: report.userId, // Map userId to reportedBy
      reason: report.reason,
      description: report.description,
      status: report.status,
      createdAt: report.createdAt,
    }));

    return res.status(200).json({
      success: true,
      count: transformedReports.length,
      data: transformedReports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};

// Get all reports for a specific post
exports.getPostReports = async (req, res) => {
  try {
    const { postId } = req.params;

    const reports = await Report.find({ postId })
      .populate("userId", "name email profileImage")
      .sort({ createdAt: -1 });

    const post = await Post.findById(postId).populate(
      "userId",
      "name email profileImage"
    );

    res.status(200).json({
      success: true,
      data: {
        post,
        reports,
      },
    });
  } catch (error) {
    console.error("Error getting post reports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch post reports",
    });
  }
};

// Dismiss a report
exports.dismissReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    if (report.postId) {
      const post = await Post.findById(report.postId);
      if (post && post.report_count > 0) {
        post.report_count -= 1;
        await post.save();
      }
    }

    // Update report status instead of deleting
    report.status = "dismissed";
    await report.save();

    res.status(200).json({
      success: true,
      message: "Report dismissed successfully",
    });
  } catch (error) {
    console.error("Error dismissing report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to dismiss report",
    });
  }
};

// Reject a post from reports page
exports.rejectPostFromReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const post = await Post.findById(report.postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Set post status to rejected
    post.status = "rejected";
    post.rejection_reason = rejectionReason;
    await post.save();

    // Update all reports for this post to 'post rejected' status
    await Report.updateMany(
      { postId: report.postId },
      { $set: { status: "post rejected" } }
    );

    res.status(200).json({
      success: true,
      message: "Post rejected successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete post",
    });
  }
};
