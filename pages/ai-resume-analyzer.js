import { useState } from 'react';
import { api } from '../utils/api';

export default function AIResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
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

  const handleAnalyzeResume = async () => {
    if (!resumeText.trim() && !resumeFile) {
      setError('Please enter resume text or upload a resume file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result;
      if (resumeFile) {
        const formData = new FormData();
        formData.append('file', resumeFile);
        result = await api.analyzeResumeWithAIFile(formData);
      } else {
        result = await api.analyzeResumeWithAI(resumeText);
      }

      setAnalysisResult(result);
    } catch (err) {
      setError('Error analyzing resume: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'average';
    return 'poor';
  };

  const renderSkills = (skills) => {
    if (!skills) return null;
    if (Array.isArray(skills)) {
      return (
        <div className="skills-container">
          {skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
      );
    }
    return <span className="skill-tag">{skills}</span>;
  };

  const renderAchievements = (achievements) => {
    if (!achievements) return null;
    if (Array.isArray(achievements)) {
      return (
        <ul className="achievements-list">
          {achievements.map((achievement, index) => (
            <li key={index}>{achievement}</li>
          ))}
        </ul>
      );
    }
    return <p>{achievements}</p>;
  };

  const renderImprovements = (improvements) => {
    if (!improvements) return null;
    if (Array.isArray(improvements)) {
      return (
        <ul className="improvements-list">
          {improvements.map((improvement, index) => (
            <li key={index}>{improvement}</li>
          ))}
        </ul>
      );
    }
    return <p>{improvements}</p>;
  };

  return (
    <div className="container">
      <div className="header">
        <h1>AI Resume Analyzer</h1>
        <p>Get instant feedback on your resume and suggestions for improvement</p>
      </div>

      <div className="analyzer-container">
        <div className="input-section">
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
              placeholder="Paste your resume text here..."
              rows="10"
            />
          </div>

          <button 
            className="analyze-btn" 
            onClick={handleAnalyzeResume} 
            disabled={loading || uploading}
          >
            {loading ? 'Analyzing Resume...' : 'Analyze Resume'}
          </button>
        </div>

        {error && (
          <div className="error-section">
            <p className="error">{error}</p>
          </div>
        )}

        {analysisResult && (
          <div className="results-section">
            <h2>Analysis Results</h2>
            
            <div className="result-card">
              <h3>Skills Identified</h3>
              {renderSkills(analysisResult.skills)}
            </div>
            
            <div className="result-card">
              <h3>Experience</h3>
              <p><strong>Years of Experience:</strong> {analysisResult.experience_years || 'N/A'}</p>
            </div>
            
            <div className="result-card">
              <h3>Key Achievements</h3>
              {renderAchievements(analysisResult.achievements)}
            </div>
            
            <div className="result-card">
              <h3>ATS Compatibility Score</h3>
              <div className="score-display">
                <div className="score-value">{analysisResult.ats_score || 0}%</div>
                <div className={`score-bar ${getScoreColor(analysisResult.ats_score || 0)}`}>
                  <div 
                    className="score-fill" 
                    style={{ width: `${Math.min(analysisResult.ats_score || 0, 100)}%` }}
                  ></div>
                </div>
                <div className="score-label">{getScoreColor(analysisResult.ats_score || 0).toUpperCase()}</div>
              </div>
            </div>
            
            <div className="result-card">
              <h3>Areas for Improvement</h3>
              {renderImprovements(analysisResult.improvements)}
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

        .analyzer-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .analyzer-container {
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

        .analyze-btn {
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

        .analyze-btn:hover {
          background: #0055cc;
        }

        .analyze-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .results-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .results-section h2 {
          color: #333;
          margin-bottom: 1.5rem;
        }

        .result-card {
          margin-bottom: 2rem;
          padding: 1.5rem;
          border: 1px solid #eee;
          border-radius: 8px;
          background: #fafafa;
        }

        .result-card h3 {
          color: #333;
          margin-top: 0;
          margin-bottom: 1rem;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .skill-tag {
          background: #e8f4ff;
          color: #0070f3;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .achievements-list, .improvements-list {
          padding-left: 1.5rem;
        }

        .achievements-list li, .improvements-list li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }

        .score-display {
          text-align: center;
        }

        .score-value {
          font-size: 2rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 1rem;
        }

        .score-bar {
          height: 20px;
          background: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .score-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .excellent .score-fill {
          background: #28a745;
          width: 100%;
        }

        .good .score-fill {
          background: #28a745;
          width: 80%;
        }

        .average .score-fill {
          background: #ffc107;
          width: 60%;
        }

        .poor .score-fill {
          background: #dc3545;
          width: 40%;
        }

        .score-label {
          font-weight: bold;
          text-transform: uppercase;
        }

        .excellent .score-label {
          color: #28a745;
        }

        .good .score-label {
          color: #28a745;
        }

        .average .score-label {
          color: #ffc107;
        }

        .poor .score-label {
          color: #dc3545;
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