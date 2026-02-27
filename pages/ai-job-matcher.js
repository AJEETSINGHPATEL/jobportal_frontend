import { useState } from 'react';
import { api } from '../utils/api';

export default function AIJobMatcher() {
  const [resumeText, setResumeText] = useState('');
  const [jobPreferences, setJobPreferences] = useState('');
  const [matchedJobs, setMatchedJobs] = useState([]);
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

  const handleFindMatches = async () => {
    if (!resumeText.trim() && !resumeFile) {
      setError('Please enter resume text or upload a resume file');
      return;
    }

    if (!jobPreferences.trim()) {
      setError('Please enter your job preferences');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call an API to find matched jobs
      // For now, we'll simulate the process by extracting skills and finding matches
      
      // Extract skills from resume
      let skills = [];
      if (resumeFile) {
        // For file, we'd need to extract text first
        // For simplicity in this demo, we'll just use a placeholder
        skills = ['JavaScript', 'React', 'Node.js', 'Project Management'];
      } else {
        const skillResult = await api.extractSkills(resumeText);
        skills = skillResult.skills || ['JavaScript', 'React', 'Node.js'];
      }
      
      // Simulate finding matched jobs
      const simulatedJobs = [
        {
          id: 1,
          title: 'Frontend Developer',
          company: 'Tech Innovations Inc.',
          location: 'San Francisco, CA',
          matchScore: 92,
          description: 'We are looking for a skilled Frontend Developer with expertise in React and JavaScript.',
          skills: ['React', 'JavaScript', 'CSS', 'HTML'],
          salary: '$90,000 - $120,000'
        },
        {
          id: 2,
          title: 'Full Stack Developer',
          company: 'Digital Solutions LLC',
          location: 'Remote',
          matchScore: 85,
          description: 'Join our team as a Full Stack Developer working with modern technologies.',
          skills: ['JavaScript', 'Node.js', 'React', 'MongoDB'],
          salary: '$100,000 - $130,000'
        },
        {
          id: 3,
          title: 'Senior Software Engineer',
          company: 'Global Tech Corp',
          location: 'New York, NY',
          matchScore: 78,
          description: 'Lead development efforts on critical projects using cutting-edge technologies.',
          skills: ['JavaScript', 'React', 'Node.js', 'Project Management'],
          salary: '$120,000 - $150,000'
        }
      ];

      setMatchedJobs(simulatedJobs);
    } catch (err) {
      setError('Error finding job matches: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMatchLevel = (score) => {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 55) return 'average';
    return 'low';
  };

  return (
    <div className="container">
      <div className="header">
        <h1>AI Job Matcher</h1>
        <p>Find jobs that perfectly match your skills and career goals</p>
      </div>

      <div className="matcher-container">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="job-preferences">Job Preferences:</label>
            <textarea
              id="job-preferences"
              value={jobPreferences}
              onChange={(e) => setJobPreferences(e.target.value)}
              placeholder="Describe your ideal job, desired location, remote/hybrid preferences, etc."
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
            className="find-matches-btn" 
            onClick={handleFindMatches} 
            disabled={loading || uploading}
          >
            {loading ? 'Finding Matches...' : 'Find Matching Jobs'}
          </button>
        </div>

        {error && (
          <div className="error-section">
            <p className="error">{error}</p>
          </div>
        )}

        {matchedJobs.length > 0 && (
          <div className="results-section">
            <h2>Matching Jobs Found</h2>
            <div className="jobs-list">
              {matchedJobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <div className="job-title-company">
                      <h3>{job.title}</h3>
                      <p className="company">{job.company} • {job.location}</p>
                    </div>
                    <div className="match-score">
                      <div className={`score-circle ${getMatchLevel(job.matchScore)}`}>
                        <span>{job.matchScore}%</span>
                      </div>
                      <div className="match-label">{getMatchLevel(job.matchScore).toUpperCase()} MATCH</div>
                    </div>
                  </div>
                  
                  <div className="job-body">
                    <p className="job-description">{job.description}</p>
                    
                    <div className="job-details">
                      <div className="salary">{job.salary}</div>
                      <div className="skills-required">
                        <strong>Required Skills:</strong>
                        {job.skills.map((skill, idx) => (
                          <span key={idx} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="job-actions">
                      <button className="apply-btn">View Details</button>
                      <button className="save-btn">Save Job</button>
                    </div>
                  </div>
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

        .matcher-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .matcher-container {
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

        .find-matches-btn {
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

        .find-matches-btn:hover {
          background: #0055cc;
        }

        .find-matches-btn:disabled {
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

        .jobs-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .job-card {
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 1.5rem;
          background: #fafafa;
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .job-title-company h3 {
          margin: 0 0 0.25rem 0;
          color: #333;
        }

        .company {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .match-score {
          text-align: right;
        }

        .score-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.5rem;
          font-weight: bold;
          color: white;
        }

        .excellent {
          background: #28a745;
        }

        .good {
          background: #28a745;
        }

        .average {
          background: #ffc107;
        }

        .low {
          background: #dc3545;
        }

        .match-label {
          font-size: 0.8rem;
          font-weight: bold;
          text-transform: uppercase;
        }

        .job-body {
          border-top: 1px solid #eee;
          padding-top: 1rem;
        }

        .job-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .job-details {
          margin-bottom: 1rem;
        }

        .salary {
          font-weight: bold;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .skills-required {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
        }

        .skills-required strong {
          margin-right: 0.5rem;
        }

        .skill-tag {
          background: #e8f4ff;
          color: #0070f3;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
        }

        .job-actions {
          display: flex;
          gap: 1rem;
        }

        .apply-btn, .save-btn {
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .apply-btn {
          background: #0070f3;
          color: white;
        }

        .apply-btn:hover {
          background: #0055cc;
        }

        .save-btn {
          background: transparent;
          color: #0070f3;
          border: 1px solid #0070f3;
        }

        .save-btn:hover {
          background: #f0f7ff;
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