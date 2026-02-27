import { useState } from 'react';
import { api } from '../utils/api';

export default function AIDemo() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

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
      const formData = new FormData();
      formData.append('file', file);

      // We'll just set the file and let the user click analyze
      setResumeText(`Resume selected: ${file.name}`);
    } catch (err) {
      setError('Error uploading resume: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyzeResume = async () => {
    // Check if we have a file to process
    if (resumeFile) {
      setLoading(true);
      setError(null);
      try {
        // For file-based analysis, we need a different API endpoint
        // that can process the uploaded file directly
        const formData = new FormData();
        formData.append('file', resumeFile);
        
        // Call a new API endpoint for file-based resume analysis
        const result = await api.analyzeResumeWithAIFile(formData);
        setAnalysisResult(result);
      } catch (err) {
        setError('Error analyzing resume: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else if (resumeText.trim()) {
      // Fallback to text-based analysis
      setLoading(true);
      setError(null);
      try {
        const result = await api.analyzeResumeWithAI(resumeText);
        setAnalysisResult(result);
      } catch (err) {
        setError('Error analyzing resume: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please enter resume text or upload a resume file');
      return;
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter job description');
      return;
    }

    // Check if we have a file to process
    if (resumeFile) {
      setLoading(true);
      setError(null);
      try {
        const result = await api.generateCoverLetterFromFile(jobDescription, resumeFile);
        setCoverLetter(result.cover_letter);
      } catch (err) {
        setError('Error generating cover letter: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else if (resumeText.trim()) {
      // Fallback to text-based generation
      setLoading(true);
      setError(null);
      try {
        const result = await api.generateCoverLetter(jobDescription, resumeText);
        setCoverLetter(result.cover_letter);
      } catch (err) {
        setError('Error generating cover letter: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please enter resume text or upload a resume file');
      return;
    }
  };

  const handleGenerateInterviewQuestions = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter job description');
      return;
    }

    // Check if we have a file to process
    if (resumeFile) {
      setLoading(true);
      setError(null);
      try {
        const result = await api.generateInterviewQuestionsFromFile(jobDescription, resumeFile);
        setInterviewQuestions(result.questions);
      } catch (err) {
        setError('Error generating interview questions: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else if (resumeText.trim()) {
      // Fallback to text-based generation
      setLoading(true);
      setError(null);
      try {
        const result = await api.generateInterviewQuestions(jobDescription, resumeText);
        setInterviewQuestions(result.questions);
      } catch (err) {
        setError('Error generating interview questions: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please enter resume text or upload a resume file');
      return;
    }
  };

  return (
    <div className="container">
      <h1>AI Features Demo</h1>
      
      <div className="demo-section">
        <h2>Resume Analysis</h2>
        <div className="upload-section">
          <label htmlFor="resume-upload">Upload Resume:</label>
          <input
            type="file"
            id="resume-upload"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
          />
          {uploading && <p>Uploading resume...</p>}
          {resumeFile && <p>Selected: {resumeFile.name}</p>}
        </div>
        <br />
        <div className="text-input-section">
          <label>Or enter resume text:</label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Enter resume text here..."
            rows="10"
            cols="50"
          />
        </div>
        <br />
        <button onClick={handleAnalyzeResume} disabled={loading || uploading}>
          {loading ? 'Analyzing...' : uploading ? 'Uploading...' : 'Analyze Resume'}
        </button>
        
        {analysisResult && (
          <div className="result">
            <h3>Analysis Result:</h3>
            <p><strong>Skills:</strong> {Array.isArray(analysisResult.skills) ? analysisResult.skills.join(', ') : analysisResult.skills || 'N/A'}</p>
            <p><strong>Experience:</strong> {analysisResult.experience_years} years</p>
            <p><strong>ATS Score:</strong> {analysisResult.ats_score}</p>
            <h4>Achievements:</h4>
            <ul>
              {Array.isArray(analysisResult.achievements) ? analysisResult.achievements.map((ach, i) => (
                <li key={i}>{ach}</li>
              )) : analysisResult.achievements ? <li>{analysisResult.achievements}</li> : null}
            </ul>
          </div>
        )}
      </div>

      <div className="demo-section">
        <h2>Job Description</h2>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Enter job description here..."
          rows="10"
          cols="50"
        />
        <br />
        <button onClick={handleGenerateCoverLetter} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Cover Letter'}
        </button>
        <button onClick={handleGenerateInterviewQuestions} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Interview Questions'}
        </button>
        
        {coverLetter && (
          <div className="result">
            <h3>Cover Letter:</h3>
            <p>{typeof coverLetter === 'string' ? coverLetter : JSON.stringify(coverLetter)}</p>
          </div>
        )}
        
        {interviewQuestions && (
          <div className="result">
            <h3>Interview Questions:</h3>
            <ol>
              {Array.isArray(interviewQuestions) ? (
                interviewQuestions.map((q, i) => (
                  <li key={i}>{typeof q === 'string' ? q : (q.question || q.Question || q.text || JSON.stringify(q))}</li>
                ))
              ) : (
                <li>{typeof interviewQuestions === 'string' ? interviewQuestions : JSON.stringify(interviewQuestions)}</li>
              )}
            </ol>
          </div>
        )}
      </div>

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .demo-section {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        
        textarea {
          width: 100%;
          margin-bottom: 10px;
        }
        
        .upload-section {
          margin-bottom: 15px;
        }
        
        .upload-section input[type="file"] {
          margin-top: 5px;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 100%;
        }
        
        .text-input-section {
          margin-top: 15px;
        }
        
        button {
          padding: 10px 20px;
          margin-right: 10px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        
        .result {
          margin-top: 20px;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 5px;
        }
        
        .error {
          color: red;
          padding: 10px;
          background-color: #ffe6e6;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
}