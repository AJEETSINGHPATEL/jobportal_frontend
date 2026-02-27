import { useState } from 'react';
import { api } from '../utils/api';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function AIInterviewPrep() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [aiAnswer, setAiAnswer] = useState('');
  const [answering, setAnswering] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, DOC, or DOCX file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }

    setUploading(true);
    setError(null);
    setResumeFile(file);

    try {
      // Just set the file for later use
      setResumeText(`Resume selected: ${file.name}`);
    } catch (err) {
      setError('Error uploading resume: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter job description');
      return;
    }

    if (!resumeText.trim() && !resumeFile) {
      setError('Please enter resume text or upload a resume file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result;
      if (resumeFile) {
        result = await api.generateInterviewQuestionsFromFile(jobDescription, resumeFile);
      } else {
        result = await api.generateInterviewQuestions(jobDescription, resumeText);
      }

      setInterviewQuestions(result.questions || []);
    } catch (err) {
      setError('Error generating interview questions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetAIAnswer = async (question) => {
    if (!question) return;

    setSelectedQuestion(question);
    setAnswering(true);
    setAiAnswer('');

    try {
      // For AI answer, we need to generate an answer based on the question, job description, and resume
      let answerResult;
      if (resumeFile) {
        // We need to extract text from file for the answer generation
        // For now, we'll use the job description and question only
        const formData = new FormData();
        formData.append('file', resumeFile);
        formData.append('job_description', `${jobDescription} ${question}`);
        
        // Use a new API endpoint that generates answers
        answerResult = await api.generateInterviewQuestionsFromFile(`${jobDescription} ${question}`, resumeFile);
      } else {
        // Use existing endpoint to generate an answer
        answerResult = await api.generateInterviewQuestions(question, resumeText);
      }

      // Use the API client method to generate an answer
      const result = await api.generateInterviewAnswer(question, jobDescription, resumeText);
      setAiAnswer(result.answer || 'No answer generated');
    } catch (err) {
      setError('Error generating answer: ' + err.message);
      setAiAnswer('Sorry, I couldn\'t generate an answer for this question.');
    } finally {
      setAnswering(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>AI Interview Preparation</h1>
        <p>Practice with AI-generated interview questions tailored to your profile and the job description</p>
      </div>

      <div className="interview-prep-container">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="job-description">Job Description:</label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows="6"
            />
          </div>

          <div className="input-group">
            <label htmlFor="resume-upload">Upload Resume (PDF, DOC, DOCX):</label>
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
            />
            {uploading && <p className="upload-status">Uploading resume...</p>}
            {resumeFile && <p className="upload-status">Selected: {resumeFile.name}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="resume-text">Or enter resume text:</label>
            <textarea
              id="resume-text"
              value={resumeText.replace(/^Resume selected: .*/, '')}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Enter your resume text here..."
              rows="6"
            />
          </div>

          <button 
            className="generate-btn" 
            onClick={handleGenerateQuestions} 
            disabled={loading || uploading}
          >
            {loading ? 'Generating Questions...' : 'Generate Interview Questions'}
          </button>
        </div>

        {error && (
          <div className="error-section">
            <p className="error">{error}</p>
          </div>
        )}

        {interviewQuestions.length > 0 && (
          <div className="questions-section">
            <h2>Generated Interview Questions</h2>
            <div className="questions-list">
              {interviewQuestions.map((question, index) => (
                <div key={index} className="question-card">
                  <div className="question-content">
                    <h3>Question {index + 1}:</h3>
                    <p>{typeof question === 'string' ? question : (question.question || question.Question || question.text || JSON.stringify(question))}</p>
                  </div>
                  <button 
                    className="answer-btn"
                    onClick={() => handleGetAIAnswer(typeof question === 'string' ? question : (question.question || question.Question || question.text || JSON.stringify(question)))}
                    disabled={answering && selectedQuestion === (typeof question === 'string' ? question : (question.question || question.Question || question.text || JSON.stringify(question)))}
                  >
                    {answering && selectedQuestion === (typeof question === 'string' ? question : (question.question || question.Question || question.text || JSON.stringify(question))) ? 'Generating Answer...' : 'Get AI Answer'}
                  </button>
                  
                  {selectedQuestion === (typeof question === 'string' ? question : (question.question || question.Question || question.text || JSON.stringify(question))) && (
                    <div className="ai-answer">
                      <h4>AI Answer:</h4>
                      <p>{aiAnswer || 'Generating answer...'}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 100vh;
          background-color: #f5f7fa;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .header h1 {
          color: #333;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .header p {
          color: #666;
          font-size: 1.2rem;
        }

        .interview-prep-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .interview-prep-container {
            grid-template-columns: 1fr 2fr;
          }
        }

        .input-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }

        .input-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          resize: vertical;
        }

        .input-group input[type="file"] {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .upload-status {
          margin-top: 0.5rem;
          color: #28a745;
          font-size: 0.9rem;
        }

        .generate-btn, .answer-btn {
          background: #0070f3;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .generate-btn:hover, .answer-btn:hover {
          background: #0055cc;
        }

        .generate-btn:disabled, .answer-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .questions-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .questions-section h2 {
          color: #333;
          margin-bottom: 1.5rem;
        }

        .questions-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .question-card {
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 1.5rem;
          background: #fafafa;
        }

        .question-content h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .question-content p {
          margin: 0;
          color: #666;
          line-height: 1.6;
        }

        .ai-answer {
          margin-top: 1rem;
          padding: 1rem;
          background: #e8f4ff;
          border-radius: 6px;
          border-left: 4px solid #0070f3;
        }

        .ai-answer h4 {
          margin: 0 0 0.5rem 0;
          color: #0070f3;
        }

        .ai-answer p {
          margin: 0;
          color: #333;
          line-height: 1.6;
        }

        .error-section {
          margin: 1rem 0;
        }

        .error {
          background: #ffe6e6;
          color: #d00;
          padding: 1rem;
          border-radius: 6px;
          border-left: 4px solid #d00;
        }
      `}</style>
    </div>
  );
}