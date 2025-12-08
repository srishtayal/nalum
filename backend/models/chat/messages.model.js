const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  conversation : {
    type : mongoose.SchemaTypes.ObjectId,
    ref : 'Conversation',
    required : true,
    index : true,
  },
  sender : {
    type : mongoose.SchemaTypes.ObjectId,
    ref : 'User',
    required : true,
    index : true,
  },
  content : {
    type : String,
    required : true,
    maxlength : 5000,
    trim : true,
  },
  messageType : {
    type : String,
    enum : ['text', 'system'],
    default : 'text',
  },

  // read tracking 
  readBy : [{
    user : {
      type : mongoose.SchemaTypes.ObjectId,
      ref : 'User',
    },
    readAt : {
      type : Date,
      default : Date.now,
    }
  }],
  deleted : {
    type : Boolean,
    default : false,
  },
} , { 
  timestamps: true,
});

// index to quickly retrieve messages in a conversation sorted by creation time 
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ conversation: 1, deleted: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
