// models/message.ts
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  }
});

const MessageModel = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default MessageModel;