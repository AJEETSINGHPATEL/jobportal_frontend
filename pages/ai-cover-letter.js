import { useState } from 'react';
import { api } from '../utils/api';

export default function AICoverLetter() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const handleGenerateCoverLetter = async () => {
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
        result = await api.generateCoverLetterFromFile(jobDescription, resumeFile);
      } else {
        result = await api.generateCoverLetter(jobDescription, resumeText);
      }

      setCoverLetter(result.cover_letter || 'No cover letter generated');
    } catch (err) {
      setError('Error generating cover letter: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    alert('Cover letter copied to clipboard!');
  };

  return (
    <div className="container">
      <div className="header">
        <h1>AI Cover Letter Generator</h1>
        <p>Create personalized cover letters that stand out to employers</p>
      </div>

      <div className="cover-letter-container">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="job-description">Job Description:</label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows="8"
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
              rows="8"
            />
          </div>

          <button 
            className="generate-btn" 
            onClick={handleGenerateCoverLetter} 
            disabled={loading || uploading}
          >
            {loading ? 'Generating Cover Letter...' : 'Generate Cover Letter'}
          </button>
        </div>

        {error && (
          <div className="error-section">
            <p className="error">{error}</p>
          </div>
        )}

        {coverLetter && (
          <div className="results-section">
            <div className="letter-header">
              <h2>Generated Cover Letter</h2>
              <button className="copy-btn" onClick={handleCopyToClipboard}>
                Copy to Clipboard
              </button>
            </div>
            <div className="cover-letter-content">
              <pre className="letter-text">{coverLetter}</pre>
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

        .cover-letter-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .cover-letter-container {
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

        .generate-btn {
          background: #0070f3;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s ease;
          width: 100%;
        }

        .generate-btn:hover {
          background: #0055cc;
        }

        .generate-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .results-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .letter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .letter-header h2 {
          color: #333;
          margin: 0;
        }

        .copy-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        .copy-btn:hover {
          background: #218838;
        }

        .cover-letter-content {
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 2rem;
          background: #fafafa;
          min-height: 400px;
        }

        .letter-text {
          white-space: pre-wrap;
          line-height: 1.8;
          color: #333;
          font-family: Georgia, 'Times New Roman', Times, serif;
          font-size: 1rem;
          margin: 0;
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