import mongoose from 'mongoose';

const quizResponseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: {
    type: Map,
    of: String, 
    required: true,
  }
}, { timestamps: true });

const QuizResponse = mongoose.model('QuizResponse', quizResponseSchema);
export default QuizResponse;