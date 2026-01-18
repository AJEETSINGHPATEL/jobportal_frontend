import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { api } from '../utils/api';
import { FaUpload, FaFilePdf, FaCheckCircle, FaExclamationTriangle, FaRedo, FaDownload } from 'react-icons/fa';

export default function ResumePage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF, DOC, or DOCX file');
        return;
      }
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      // Get user from localStorage (in a real app, you would get this from auth context)
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!userData.id) {
        throw new Error('User not authenticated');
      }
      
      // Upload file
      const uploadedResume = await api.uploadResume(file, userData.id);
      
      // Analyze resume
      const analysisResult = await api.analyzeResume(uploadedResume.id);
      
      // The backend returns { resume_id, analysis }, so we need to extract the analysis part
      setAnalysis(analysisResult.analysis || analysisResult);
    } catch (err) {
      console.error('Error uploading/analyzing resume:', err);
      setError(err.message || 'Error uploading/analyzing resume');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  };

  const getOverallRating = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="resume-container">
      {/* Header */}
      <div className="resume-header">
        <div className="header-content">
          <h1>Resume Management</h1>
          <p>Upload your resume and get instant ATS compatibility analysis</p>
        </div>
      </div>

      <div className="resume-content">
        {!analysis ? (
          <div className="upload-section">
            <div className="upload-card">
              <h2><FaUpload /> Upload Your Resume</h2>
              <p>Supported formats: PDF, DOC, DOCX (Max size: 5MB)</p>
              
              <div className="file-upload-area" onClick={() => fileInputRef.current?.click()}>
                <FaFilePdf className="upload-icon" />
                <p>{file ? file.name : 'Click to select a file or drag and drop'}</p>
                <p className="file-hint">PDF, DOC, or DOCX</p>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
              />
              
              {error && (
                <div className="error-message">
                  <FaExclamationTriangle /> {error}
                </div>
              )}
              
              <button 
                className="btn btn-primary" 
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                {uploading ? (
                  <>
                    <div className="spinner small"></div> Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload /> Upload & Analyze
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="analysis-section">
            <div className="analysis-header">
              <h2>ATS Compatibility Analysis</h2>
              <button className="btn btn-outline" onClick={resetForm}>
                <FaRedo /> Analyze Another Resume
              </button>
            </div>
            
            {/* Overall Score */}
            <div className="score-card">
              <div className="score-circle">
                <span className={`score-value ${getScoreColor(typeof analysis.ats_score === 'number' ? analysis.ats_score : 0)}`}>
                  {typeof analysis.ats_score === 'object' ? 
                    (analysis.ats_score.type || 'N/A') : 
                    analysis.ats_score}
                </span>
                <span className="score-label">ATS Score</span>
              </div>
              <div className="score-info">
                <h3>Your resume is {getOverallRating(analysis.ats_score).toLowerCase()}</h3>
                <p>Based on our analysis, your resume has a good chance of passing through Applicant Tracking Systems.</p>
              </div>
            </div>
            
            {/* Section Analysis */}
            <div className="sections-analysis">
              <h3>Section Breakdown</h3>
              <div className="sections-grid">
                {analysis.experience_years && (
                  <div className="section-item">
                    <div className="section-header">
                      <span className="section-name">Experience</span>
                      <span className={`section-score ${getScoreColor(typeof analysis.experience_years === 'number' ? analysis.experience_years * 10 : 0)}`}>
                        {typeof analysis.experience_years === 'object' ? 
                          (analysis.experience_years.type || 'N/A') : 
                          analysis.experience_years} years
                      </span>
                    </div>
                    <div className="score-bar">
                      <div 
                        className={`score-fill ${getScoreColor(typeof analysis.experience_years === 'number' ? analysis.experience_years * 10 : 0)}`} 
                        style={{ width: `${Math.min(typeof analysis.experience_years === 'number' ? analysis.experience_years * 10 : 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {analysis.achievements && Array.isArray(analysis.achievements) && (
                  <div className="section-item">
                    <div className="section-header">
                      <span className="section-name">Achievements</span>
                      <span className={`section-score ${getScoreColor(Array.isArray(analysis.achievements) ? analysis.achievements.length * 20 : 0)}`}>
                        {Array.isArray(analysis.achievements) ? analysis.achievements.length : 0} items
                      </span>
                    </div>
                    <div className="score-bar">
                      <div 
                        className={`score-fill ${getScoreColor(Array.isArray(analysis.achievements) ? analysis.achievements.length * 20 : 0)}`} 
                        style={{ width: `${Math.min(Array.isArray(analysis.achievements) ? analysis.achievements.length * 20 : 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {analysis.achievements && !Array.isArray(analysis.achievements) && (
                  <div className="section-item">
                    <div className="section-header">
                      <span className="section-name">Achievements</span>
                      <span className="section-score poor">Invalid format</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Skills */}
            <div className="analysis-card">
              <h3>Identified Skills</h3>
              <div className="skills-tags">
                {analysis.skills && Array.isArray(analysis.skills) && analysis.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
                {!analysis.skills || (!Array.isArray(analysis.skills) && analysis.skills && (
                  <p>No skills found or invalid format.</p>
                ))}
              </div>
            </div>
            
            {/* Achievements */}
            <div className="analysis-card">
              <h3>Key Achievements</h3>
              <p><strong>Years of Experience:</strong> {analysis.experience_years && typeof analysis.experience_years === 'object' ? 
                (analysis.experience_years.type || analysis.experience_years.toString()) : 
                analysis.experience_years}
              </p>
              <div className="achievements">
                <h4>Key Achievements:</h4>
                <ul>
                  {analysis.achievements && Array.isArray(analysis.achievements) && analysis.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                  {!analysis.achievements || (!Array.isArray(analysis.achievements) && analysis.achievements && (
                    <p>No achievements found or invalid format.</p>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Improvements */}
            <div className="analysis-card">
              <h3>Improvement Suggestions</h3>
              <ul className="improvements-list">
                {analysis.improvements && Array.isArray(analysis.improvements) && analysis.improvements.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
                {!analysis.improvements || (!Array.isArray(analysis.improvements) && analysis.improvements && (
                  <p>No improvement suggestions found or invalid format.</p>
                ))}
              </ul>
            </div>
            
            {/* Actions */}
            <div className="actions-section">
              <button className="btn btn-primary">
                <FaDownload /> Download Improved Resume
              </button>
              <button className="btn btn-secondary" onClick={resetForm}>
                <FaRedo /> Re-analyze
              </button>
            </div>
          </div>
        )}
        
        {analyzing && (
          <div className="analysis-overlay">
            <div className="analysis-modal">
              <div className="spinner"></div>
              <h3>Analyzing your resume...</h3>
              <p>Our AI is checking your resume for ATS compatibility</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .resume-container {
          min-height: 100vh;
          background-color: #f5f7fa;
          padding: 20px;
        }

        .resume-header {
          background: linear-gradient(135deg, #0070f3 0%, #0055cc 100%);
          color: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .header-content h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 10px 0;
        }

        .header-content p {
          font-size: 1.1rem;
          margin: 0;
          opacity: 0.9;
        }

        .resume-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .upload-section {
          display: flex;
          justify-content: center;
        }

        .upload-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          padding: 30px;
          width: 100%;
          max-width: 500px;
          text-align: center;
        }

        .upload-card h2 {
          margin: 0 0 15px 0;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .file-upload-area {
          border: 2px dashed #0070f3;
          border-radius: 8px;
          padding: 40px 20px;
          margin: 20px 0;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .file-upload-area:hover {
          background: #f0f7ff;
        }

        .upload-icon {
          font-size: 3rem;
          color: #0070f3;
          margin-bottom: 15px;
        }

        .file-hint {
          color: #666;
          font-size: 0.9rem;
          margin-top: 5px;
        }

        .error-message {
          color: #dc3545;
          margin: 15px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s ease;
          font-size: 1rem;
        }

        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #0070f3;
          color: white;
        }

        .btn-outline {
          background: transparent;
          color: #0070f3;
          border: 1px solid #0070f3;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .analysis-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          padding: 30px;
        }

        .analysis-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .analysis-header h2 {
          margin: 0;
          color: #333;
        }

        .score-card {
          display: flex;
          background: #f8f9fa;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          gap: 30px;
        }

        .score-circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: #e9ecef;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .score-value {
          font-size: 3rem;
          font-weight: 700;
        }

        .excellent { color: #28a745; }
        .good { color: #0070f3; }
        .fair { color: #ffc107; }
        .poor { color: #dc3545; }

        .score-label {
          font-size: 1rem;
          color: #666;
        }

        .score-info h3 {
          margin: 0 0 15px 0;
          font-size: 1.8rem;
          color: #333;
        }

        .score-info p {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
        }

        .sections-analysis {
          margin-bottom: 30px;
        }

        .sections-analysis h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .sections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .section-item {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .section-name {
          font-weight: 500;
          color: #333;
        }

        .section-score {
          font-weight: 700;
        }

        .score-bar {
          height: 8px;
          background: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          border-radius: 4px;
        }

        .analysis-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .analysis-card h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .skills-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .skill-tag {
          background: #0070f3;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .achievements ul, .improvements-list {
          padding-left: 20px;
        }

        .achievements li, .improvements-list li {
          margin-bottom: 10px;
          line-height: 1.5;
        }

        .actions-section {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 30px;
          flex-wrap: wrap;
        }

        .analysis-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .analysis-modal {
          background: white;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          max-width: 400px;
          width: 90%;
        }

        .analysis-modal h3 {
          margin: 20px 0 10px 0;
          color: #333;
        }

        .analysis-modal p {
          color: #666;
          margin: 0;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        .spinner.small {
          width: 20px;
          height: 20px;
          border-width: 3px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .score-card {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 20px;
          }
          
          .analysis-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
          
          .actions-section {
            flex-direction: column;
          }
          
          .sections-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
