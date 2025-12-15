// represents the conversation data structure
const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema({
  participants: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  }],
  // last message sent in the conversation 
  lastMessage: {
    content: {
      type: String,
      maxlength: 500,
    },
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    }
  },
  lastReadBy: {
    type: Map,
    of: Date, // maps userId to the timestamp of the last read lastMessage
    default: {},
  },

  // soft delete for participants
  archived: {
    type: Map,
    of: Boolean, // maps userId to a boolean indicating if the conversation is archived
    default: {},
  },
  // soft delete for conversation (hiding from list)
  deletedBy: {
    type: Map,
    of: Boolean, // maps userId to boolean
    default: {}
  },
}, {
  timestamps: true
});

// index to quickly find conversations between 2 users
conversationSchema.index({ participants: 1 });
// index to quickly sort conversations by last updated time 
conversationSchema.index({ 'lastMessage.timestamp': -1 });


module.exports = mongoose.model('Conversation', conversationSchema);
