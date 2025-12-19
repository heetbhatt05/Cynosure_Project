import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  analysis: {
    summary: String,
    personalityTraits: [{
      trait: String,
      score: Number
    }],
    topCareers: [{
      title: String,
      matchScore: Number,
      reason: String,
      skillsNeeded: [String]
    }],
    resumeFeedback: [String],
    actionPlan: [String]
  }
}, { timestamps: true });

const Result = mongoose.model('Result', resultSchema);
export default Result;