import asyncHandler from 'express-async-handler';
import Resume from '../models/Resume.js';
import { parsePdf } from '../utils/pdfParser.js';

// @desc    Upload Resume PDF
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a PDF file');
  }

  try {
    // 1. Extract text from the buffer (In-Memory processing)
    const pdfText = await parsePdf(req.file.buffer);

    // 2. Save to Database (Update if exists, otherwise create)
    // We use upsert to ensure one resume per user for this MVP
    const resume = await Resume.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        fileName: req.file.originalname,
        parsedText: pdfText
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Resume parsed successfully',
      data: {
        fileName: resume.fileName,
        textPreview: resume.parsedText.substring(0, 100) + "..."
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error('PDF parsing failed');
  }
});

export { uploadResume };