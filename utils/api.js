const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jobportal-backend-2-i07w.onrender.com';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    // Create a copy of options to avoid mutating the original
    const requestOptions = { ...options };
    
    // Check if body is FormData, if so, don't set Content-Type header
    const isFormData = requestOptions.body instanceof FormData;
    
    // Set default headers, but allow options.headers to override specific headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    
    // If body is FormData, don't set Content-Type to let browser set it with proper boundary
    if (isFormData) {
      delete defaultHeaders['Content-Type'];
    }
    
    // Get token from localStorage for authenticated request
    const token = localStorage.getItem('token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    // Merge headers: default headers as base, then override with options.headers
    const mergedHeaders = {
      ...defaultHeaders,
      ...requestOptions.headers,
    };
    
    // Remove headers from requestOptions since we're handling them separately
    delete requestOptions.headers;
    
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: mergedHeaders,
      ...requestOptions,
    };

    try {
      // Determine timeout based on endpoint type
      let timeoutMs = 15000; // 15 second default timeout
      if (endpoint.includes('/api/ai/')) {
        timeoutMs = 120000; // 2 minute timeout for AI requests
      }
      
      // Add timeout for connection health check
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // Parse error response to get detailed error message
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          // If response is not JSON, try to get text
          try {
            const errorText = await response.text();
            errorData = { detail: errorText };
          } catch (e2) {
            errorData = { detail: `HTTP error! status: ${response.status}` };
          }
        }
        
        console.log('API Error Response:', errorData);
        
        // Handle Pydantic validation errors which come as objects
        let errorMessage = errorData.detail || `HTTP error! status: ${response.status}`;
        
        // If the error detail is an object (like Pydantic validation errors), extract the message
        if (typeof errorMessage === 'object') {
          if (errorMessage.msg) {
            errorMessage = errorMessage.msg;
          } else if (Array.isArray(errorMessage)) {
            // For validation errors array, get the first error message
            errorMessage = errorMessage[0]?.msg || 'Validation error occurred';
            // Also log the full validation error for debugging
            console.log('Validation errors:', errorMessage);
          } else {
            // Extract message from the object
            errorMessage = Object.values(errorMessage).join(', ') || 'Error occurred';
          }
        }
        
        // Check if this is an authentication error (expired token, invalid token, etc.)
        if (response.status === 401 || response.status === 403) {
          // Clear the invalid token from localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Update error message to be more descriptive
          if (response.status === 401) {
            errorMessage = 'Session expired. Please log in again.';
          }
        } else if (response.status === 422) {
          errorMessage = `Validation error: ${JSON.stringify(errorData)}`;
        }
        
        const error = new Error(errorMessage);
        error.status = response.status;
        error.response = errorData;
        throw error;
      }
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${error.message}`);
      
      // Enhanced error categorization
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout. The server is taking too long to respond. Please check your internet connection.';
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error. Unable to connect to the job portal service. Please check your internet connection and try again.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Connection failed. Please verify your internet connection and try again.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      // Create enhanced error object with more context
      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      enhancedError.timestamp = new Date().toISOString();
      enhancedError.endpoint = endpoint;
      enhancedError.baseUrl = this.baseUrl;
      
      throw enhancedError;
    }
  }

  // Auth endpoints
  async signup(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }
  
  async getAllUsers() {
    return this.request('/api/admin/users');
  }

  // Job endpoints
  async getJobs(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `/api/jobs/?${queryParams}` : '/api/jobs/';
    
    return this.request(url);
  }

  async searchJobs(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `/api/jobs/search?${queryParams}` : '/api/jobs/search';
    return this.request(url);
  }

  async getJobById(jobId) {
    try {
      const response = await this.request(`/api/jobs/${jobId}`);
      
      // Transform the response to match the required format
      return {
        success: true,
        data: {
          id: response.id,
          title: response.title,
          company: response.company,
          description: response.description,
          salary: {
            min: response.salary_min,
            max: response.salary_max
          },
          location: response.location,
          jobType: response.job_type,
          workMode: response.work_mode,
          skills: response.skills || []
        }
      };
    } catch (error) {
      throw new Error('Failed to load job details');
    }
  }

  async createJob(jobData) {
    return this.request('/api/jobs/', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateJob(jobId, jobData) {
    return this.request(`/api/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  // Admin endpoints
  async getAdminUsers() {
    return this.request('/api/admin/users');
  }

  async updateUserStatus(userId, isActive) {
    return this.request(`/api/admin/users/${userId}/status?is_active=${isActive}`, {
      method: 'PUT',
    });
  }

  async deleteUser(userId) {
    return this.request(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getAdminJobs() {
    return this.request('/api/admin/jobs');
  }

  async getAdminCompanies() {
    return this.request('/api/admin/companies');
  }

  async updateJobStatus(jobId, isActive) {
    return this.request(`/api/admin/jobs/${jobId}/status?is_active=${isActive}`, {
      method: 'PUT',
    });
  }

  async deleteJob(jobId) {
    return this.request(`/api/jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  // Resume endpoints
  async uploadResume(file, userId) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);
    
    // Don't include Authorization header in form data requests - it will be added automatically by the request method
    return this.request('/api/resume/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async analyzeResume(resumeId) {
    return this.request(`/api/resume/analyze/${resumeId}`, {
      method: 'POST',
    });
  }

  async getResume(resumeId) {
    return this.request(`/api/resume/${resumeId}`);
  }

  async getUserResumes(userId) {
    return this.request(`/api/resume/user/${userId}`);
  }

  // Profile endpoints
  async createProfile(profileData) {
    return this.request('/api/profile/', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async getUserProfile(userId) {
    try {
      const response = await this.request(`/api/profile/user/${userId}`);
      return response;
    } catch (error) {
      // If the profile doesn't exist, return a default profile
      if (error.status === 404) {
        console.log('Profile not found, returning default values');
        return {
          id: null,
          user_id: userId,
          fullName: '',
          email: '',
          phone: '',
          address: '',
          headline: '',
          summary: '',
          experience: [],
          education: [],
          skills: [],
          profilePicture: null,
          profile_completion: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      throw error;
    }
  }

  async updateProfile(profileId, profileData) {
    return this.request(`/api/profile/${profileId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updateUserProfile(userId, profileData) {
    return this.request(`/api/profile/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Application endpoints
  async getApplications(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `/api/applications/?${queryParams}` : '/api/applications/';
    
    return this.request(url);
  }

  async applyForJob(applicationData) {
    console.log('Applying for job with data:', applicationData);
    console.log('Sending request to /api/applications/');
    
    return this.request('/api/applications/', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async getApplicationById(applicationId) {
    console.log('Fetching application with ID:', applicationId);
    
    // Validate that applicationId is not empty or undefined
    if (!applicationId) {
      throw new Error('Application ID is required');
    }
    
    return this.request(`/api/applications/${applicationId}`);
  }

  // Review endpoints
  async createReview(reviewData) {
    return this.request('/api/reviews/', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getReview(reviewId) {
    return this.request(`/api/reviews/${reviewId}`);
  }

  async updateReview(reviewId, reviewData) {
    return this.request(`/api/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(reviewId) {
    return this.request(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  async getReviews(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `/api/reviews/?${queryParams}` : '/api/reviews/';
    return this.request(url);
  }

  async getCompanyReviews(companyId) {
    return this.request(`/api/reviews/company/${companyId}`);
  }

  async getCompanyAverageRatings(companyId) {
    return this.request(`/api/reviews/company/${companyId}/average`);
  }

  // Company verification endpoints
  async createCompanyVerification(verificationData) {
    return this.request('/api/company-verification/', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  }

  async getCompanyVerification(verificationId) {
    return this.request(`/api/company-verification/${verificationId}`);
  }

  async updateCompanyVerification(verificationId, verificationData) {
    return this.request(`/api/company-verification/${verificationId}`, {
      method: 'PUT',
      body: JSON.stringify(verificationData),
    });
  }

  async getCompanyVerifications(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `/api/company-verification/?${queryParams}` : '/api/company-verification/';
    return this.request(url);
  }

  // Job alerts endpoints
  async createJobAlert(alertData) {
    return this.request('/api/job-alerts/', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  }

  async getJobAlert(alertId) {
    return this.request(`/api/job-alerts/${alertId}`);
  }

  async updateJobAlert(alertId, alertData) {
    return this.request(`/api/job-alerts/${alertId}`, {
      method: 'PUT',
      body: JSON.stringify(alertData),
    });
  }

  async deleteJobAlert(alertId) {
    return this.request(`/api/job-alerts/${alertId}`, {
      method: 'DELETE',
    });
  }

  async getJobAlerts(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `/api/job-alerts/?${queryParams}` : '/api/job-alerts/';
    return this.request(url);
  }

  async getUserJobAlerts(userId) {
    return this.request(`/api/job-alerts/user/${userId}`);
  }

  async getRecentJobsForAlerts(userId) {
    return this.request(`/api/job-alerts/user/${userId}/recent-jobs`);
  }

  // AI endpoints
  async analyzeResumeWithAI(resumeText) {
    return this.request('/api/ai/resume-analyze', {
      method: 'POST',
      body: JSON.stringify({ resume_text: resumeText }),
    });
  }

  async analyzeResumeWithAIFile(formData) {
    return this.request('/api/ai/resume-analyze-file', {
      method: 'POST',
      body: formData,
    });
  }

  async generateCoverLetter(jobDescription, resumeText) {
    const response = await this.request('/api/ai/cover-letter', {
      method: 'POST',
      body: JSON.stringify({ job_description: job_description, resume_text: resumeText }),
    });
    return response || { cover_letter: 'No cover letter generated' };
  }

  async generateCoverLetterFromFile(jobDescription, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDescription);
    
    const response = await this.request('/api/ai/cover-letter-file', {
      method: 'POST',
      body: formData,
    });
    return response || { cover_letter: 'No cover letter generated' };
  }

  async generateJobDescription(jobTitle, requirements) {
    return this.request('/api/ai/job-description', {
      method: 'POST',
      body: JSON.stringify({ job_title: jobTitle, requirements: requirements }),
    });
  }

  async extractSkills(text) {
    return this.request('/api/ai/extract-skills', {
      method: 'POST',
      body: JSON.stringify({ text: text }),
    });
  }

  async calculateMatchScore(resumeSkills, jobSkills) {
    return this.request('/api/ai/match-score', {
      method: 'POST',
      body: JSON.stringify({ resume_skills: resumeSkills, job_skills: jobSkills }),
    });
  }

  async generateInterviewQuestions(jobDescription, resumeText) {
    const response = await this.request('/api/ai/interview-questions', {
      method: 'POST',
      body: JSON.stringify({ job_description: job_description, resume_text: resumeText }),
    });
    return response || { questions: [] };
  }
  
  async generateInterviewQuestionsFromFile(jobDescription, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDescription);
    
    const response = await this.request('/api/ai/interview-questions-file', {
      method: 'POST',
      body: formData,
    });
    return response || { questions: [] };
  }

  async generateInterviewAnswer(question, jobDescription, resumeText) {
    const response = await this.request('/api/ai/interview-answer', {
      method: 'POST',
      body: JSON.stringify({
        question: question,
        job_description: jobDescription,
        resume_text: resumeText
      }),
    });
    return response || { answer: 'No answer generated' };
  }
  
  // Test AI chat endpoint specifically
  async testAIChatEndpoint(message = 'Hello') {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || !window.fetch) {
        throw new Error('Not running in browser environment');
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for AI requests
      
      const response = await fetch(`${this.baseUrl}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          history: [{role: 'user', content: message}]
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('AI Chat endpoint test failed:', error);
      throw error;
    }
  }
  
  // Employer dashboard endpoints
  async getEmployerDashboardStats() {
    return this.request('/api/employer/dashboard/stats');
  }
  
  async getEmployerJobs() {
    return this.request('/api/employer/jobs');
  }
  
  async getEmployerApplications() {
    return this.request('/api/employer/applications');
  }
  
  async getEmployerActivity() {
    return this.request('/api/employer/activity');
  }
  
  // Connection health check method
  async checkConnection() {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || !window.fetch) {
        return {
          connected: false,
          error: 'Not running in browser environment',
          timestamp: new Date().toISOString()
        };
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for health check (allowing for Render free tier cold starts)
      
      // Test the AI chat endpoint specifically to verify backend is accessible
      const testEndpoint = `${this.baseUrl}/api/ai/chat`;
      
      try {
        // Make an OPTIONS request to check if the endpoint is available
        const response = await fetch(testEndpoint, {
          method: 'OPTIONS',
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'X-Requested-With': 'HealthCheck'  // Custom header to identify health check requests
          },
          // Don't include credentials to avoid CORS issues
        });
        
        // If we receive any response (even error responses like 401, 404),
        // it means the server is reachable. Only network errors or 5xx errors
        // indicate actual connection problems.
        clearTimeout(timeoutId);
        
        // If the OPTIONS request fails, try a GET request to a basic endpoint
        if (!response.ok && response.status >= 400) {
          const fallbackEndpoint = `${this.baseUrl}/api/jobs/`;
          const fallbackResponse = await fetch(fallbackEndpoint, {
            method: 'GET',
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache',
              'X-Requested-With': 'HealthCheck'
            }
          });
          
          return {
            connected: fallbackResponse.status < 500,
            status: fallbackResponse.status,
            timestamp: new Date().toISOString(),
            endpoint: 'fallback'
          };
        }
        
        const isConnected = response.status < 500;
        
        return {
          connected: isConnected,
          status: response.status,
          timestamp: new Date().toISOString(),
          endpoint: 'ai/chat'
        };
      } catch (error) {
        // Network error (failed to fetch, timeout, DNS failure, etc.)
        clearTimeout(timeoutId);
        
        // If the primary endpoint fails, try a fallback
        try {
          const fallbackEndpoint = `${this.baseUrl}/api/jobs/`;
          const fallbackResponse = await fetch(fallbackEndpoint, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache',
              'X-Requested-With': 'HealthCheck'
            }
          });
          
          return {
            connected: fallbackResponse.status < 500,
            status: fallbackResponse.status,
            timestamp: new Date().toISOString(),
            endpoint: 'fallback',
            error: error.message
          };
        } catch (fallbackError) {
          return {
            connected: false,
            error: error.message,
            timestamp: new Date().toISOString()
          };
        }
      }
    } catch (error) {
      return {
        connected: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Export singleton instance
export const api = new ApiClient();

export default api