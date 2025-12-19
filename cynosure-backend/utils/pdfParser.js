import pdf from 'pdf-parse';

export const parsePdf = async (buffer) => {
  try {
    const data = await pdf(buffer);
    return data.text.replace(/\n+/g, ' ').trim(); 
  } catch (error) {
    console.error('PDF Parsing Failed:', error);
    throw new Error('Failed to extract text from resume.');
  }
};