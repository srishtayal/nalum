const mongoose = require('mongoose');
const { Schema } = mongoose;
const connectionsSchema = new Schema({
  // participants: Array of user IDs representing the participants in the connectionsSchema
  requester: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  recipient: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'blocked'],
    default: 'pending',
    required: true
  },
  blockedBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    default: null
  },
  requestedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  respondedAt: {
    type: Date,
    default: null,
  },
  requestMessage: {
    type: String,
    maxlength: 200,
    default: null
  }
}, {
  timestamps: true
}
);

// Ensure unique connection requests between requester and recipient
connectionsSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// for efficient querying based on status and either participants
connectionsSchema.index({ status: 1, recipient: 1 });
connectionsSchema.index({ status: 1, requester: 1 });

module.exports = mongoose.model('Connection', connectionsSchema);
