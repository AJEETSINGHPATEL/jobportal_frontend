import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import PersonalDetailsForm from '../components/profile/PersonalDetailsForm';
import EmploymentHistoryForm from '../components/profile/EmploymentHistoryForm';
import EducationForm from '../components/profile/EducationForm';
import ProjectForm from '../components/profile/ProjectForm';
import SkillsForm from '../components/profile/SkillsForm';

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, token, login } = useAuth(); // Get login function to update context
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState({
    personalDetails: {},
    employmentHistory: [],
    education: [],
    skills: [],
    projects: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(0); // Add profile completion state

  // Function to calculate profile completion percentage
  const calculateProfileCompletion = (profile) => {
    let totalPoints = 0;
    let earnedPoints = 0;

    // Required fields (weighted higher)
    const requiredFields = [
      'fullName', 'email', 'phone', 'address'
    ];

    for (const field of requiredFields) {
      if (profile.personalDetails && profile.personalDetails[field] && String(profile.personalDetails[field]).trim()) {
        earnedPoints += 2; // Weighted more heavily
      }
      totalPoints += 2;
    }

    // Additional personal fields
    const optionalPersonalFields = ['headline', 'summary', 'profilePicture'];
    for (const field of optionalPersonalFields) {
      if (profile.personalDetails && profile.personalDetails[field] && String(profile.personalDetails[field]).trim()) {
        earnedPoints += 1;
      }
      totalPoints += 1;
    }

    // Experience entries (if any exist)
    if (profile.employmentHistory && profile.employmentHistory.length > 0) {
      for (const exp of profile.employmentHistory) {
        if (exp.title && exp.company && exp.startDate) {
          earnedPoints += 2;
        }
        totalPoints += 2;
      }
    } else {
      totalPoints += 6; // Assume 3 experience entries possible
    }

    // Education entries (if any exist)
    if (profile.education && profile.education.length > 0) {
      for (const edu of profile.education) {
        if (edu.school && edu.degree && edu.startDate) {
          earnedPoints += 2;
        }
        totalPoints += 2;
      }
    } else {
      totalPoints += 6; // Assume 3 education entries possible
    }

    // Projects (if any exist)
    if (profile.projects && profile.projects.length > 0) {
      for (const proj of profile.projects) {
        if (proj.title && proj.description) {
          earnedPoints += 2;
        }
        totalPoints += 2;
      }
    } else {
      totalPoints += 4; // Assume 2 projects possible
    }

    // Skills (if any exist)
    if (profile.skills && profile.skills.length > 0) {
      // Cap skills points
      const skillPoints = Math.min(profile.skills.length * 0.5, 10);
      earnedPoints += skillPoints;
      totalPoints += 10;
    } else {
      totalPoints += 10;
    }

    const completionPercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    return Math.min(completionPercentage, 100);
  };

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    // Use the user ID from the auth context
    const userId = authUser?.id;
    if (!userId) {
      setError('User information not available');
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/api/profile/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Map the response to the expected frontend format
          const updatedProfileData = {
            personalDetails: {
              fullName: data.fullName || data.full_name || '',
              email: data.email || '',
              phone: data.phone || '',
              address: data.address || '',
              headline: data.headline || '',
              summary: data.summary || '',
              profilePicture: data.profilePicture || data.profile_picture || ''
            },
            employmentHistory: (data.experience || data.employment_history || []).map(exp => ({
              title: exp.title || exp.designation || '', // Map designation to title
              company: exp.company || exp.company || '',
              startDate: exp.startDate || exp.start_date || '',
              endDate: exp.endDate || exp.end_date || '',
              description: exp.description || exp.description || '',
              is_current: exp.is_current || exp.is_current || false
            })),
            education: (data.education || []).map(edu => ({
              school: edu.school || edu.institution || '', // Map institution to school
              degree: edu.degree || edu.degree || '',
              field: edu.field || edu.field_of_study || '', // Map field_of_study to field
              startDate: edu.startDate || edu.start_date || '',
              endDate: edu.endDate || edu.end_date || '',
              description: edu.description || edu.description || ''
            })),
            projects: data.projects || [],
            skills: data.skills || []
          };

          setProfileData(updatedProfileData);

          // Calculate and set profile completion
          const completion = calculateProfileCompletion(updatedProfileData);
          setProfileCompletion(completion);
        } else if (response.status === 404) {
          // Profile doesn't exist, initialize with empty data
          setProfileData({
            personalDetails: {},
            employmentHistory: [],
            education: [],
            skills: [],
            projects: []
          });
          setProfileCompletion(0);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, authUser, router]); // Include authUser in the dependency array

  const handleSave = async (formData, section) => {
    if (!token) return;

    // Use the user ID from the auth context
    const userId = authUser?.id;
    if (!userId) {
      setError('User information not available');
      return;
    }

    try {
      // Transform the section-specific data to match the backend ProfileUpdate schema
      let transformedData = {};

      switch (section) {
        case 'personalDetails':
          // Map personal details fields directly to the expected schema
          transformedData = {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            headline: formData.headline,
            summary: formData.summary,
            profilePicture: formData.profilePicture // Include profile picture URL if available
          };
          break;
        case 'employmentHistory':
          // Map the frontend format to backend format (designation -> title, etc.)
          // Include required fields from existing profile data to avoid validation errors
          transformedData = {
            fullName: profileData.personalDetails.fullName || authUser?.full_name || authUser?.email?.split('@')[0] || 'User',
            email: profileData.personalDetails.email || authUser?.email || '',
            experience: formData.map(exp => ({
              title: exp.designation || exp.title || '',
              company: exp.company || '',
              startDate: exp.start_date || exp.startDate || '',
              endDate: exp.end_date || exp.endDate || '',
              description: exp.description || '',
              is_current: exp.is_current || false
            }))
          };
          break;
        case 'education':
          // Map the frontend format to backend format (institution -> school, etc.)
          // Include required fields from existing profile data to avoid validation errors
          transformedData = {
            fullName: profileData.personalDetails.fullName || authUser?.full_name || authUser?.email?.split('@')[0] || 'User',
            email: profileData.personalDetails.email || authUser?.email || '',
            education: formData.map(edu => ({
              school: edu.institution || edu.school || '',
              degree: edu.degree || '',
              field: edu.field_of_study || edu.field || '',
              startDate: edu.start_date || edu.startDate || '',
              endDate: edu.end_date || edu.endDate || '',
              description: edu.description || ''
            }))
          };
          break;
        case 'projects':
          // Include required fields from existing profile data to avoid validation errors
          transformedData = {
            fullName: profileData.personalDetails.fullName || authUser?.full_name || authUser?.email?.split('@')[0] || 'User',
            email: profileData.personalDetails.email || authUser?.email || '',
            projects: formData
          };
          break;
        case 'skills':
          transformedData = {
            fullName: profileData.personalDetails.fullName || authUser?.full_name || authUser?.email?.split('@')[0] || 'User',
            email: profileData.personalDetails.email || authUser?.email || '',
            skills: formData
          };
          break;
        default:
          // For any other sections, ensure required fields are present
          transformedData = {
            fullName: profileData.personalDetails.fullName || authUser?.full_name || authUser?.email?.split('@')[0] || 'User',
            email: profileData.personalDetails.email || authUser?.email || '',
            ...formData
          };
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/api/profile/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transformedData)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        // Update the local profile data with the response from the backend
        const updatedProfileData = {
          ...profileData,
          personalDetails: {
            fullName: updatedProfile.fullName || updatedProfile.full_name || profileData.personalDetails.fullName,
            email: updatedProfile.email || profileData.personalDetails.email,
            phone: updatedProfile.phone || profileData.personalDetails.phone,
            address: updatedProfile.address || profileData.personalDetails.address,
            headline: updatedProfile.headline || profileData.personalDetails.headline,
            summary: updatedProfile.summary || profileData.personalDetails.summary,
            profilePicture: updatedProfile.profilePicture || updatedProfile.profile_picture || profileData.personalDetails.profilePicture
          },
          employmentHistory: (updatedProfile.experience || updatedProfile.employment_history || []).map(exp => ({
            title: exp.title || exp.designation || '', // Map designation to title
            company: exp.company || exp.company || '',
            startDate: exp.startDate || exp.start_date || '',
            endDate: exp.endDate || exp.end_date || '',
            description: exp.description || exp.description || '',
            is_current: exp.is_current || exp.is_current || false
          })),
          education: (updatedProfile.education || []).map(edu => ({
            school: edu.school || edu.institution || '', // Map institution to school
            degree: edu.degree || edu.degree || '',
            field: edu.field || edu.field_of_study || '', // Map field_of_study to field
            startDate: edu.startDate || edu.start_date || '',
            endDate: edu.endDate || edu.end_date || '',
            description: edu.description || edu.description || ''
          })),
          projects: updatedProfile.projects || profileData.projects,
          skills: updatedProfile.skills || profileData.skills
        };

        setProfileData(updatedProfileData);

        // Recalculate profile completion after save
        const completion = calculateProfileCompletion(updatedProfileData);
        setProfileCompletion(completion);

        // Prepare updated user data to update the auth context
        const updatedAuthUser = {
          ...authUser,
          profilePicture: updatedProfile.profilePicture || updatedProfile.profile_picture || authUser?.profilePicture,
          full_name: updatedProfile.fullName || updatedProfile.full_name || authUser?.full_name
        };

        // Update the auth context with the new user data
        login(updatedAuthUser, token);

        // Show success message to user
        alert('Profile updated successfully!');
      } else {
        const errorText = await response.text();
        console.error('Failed to save profile:', response.status, errorText);
        throw new Error(`Failed to save: ${response.statusText}. Details: ${errorText}`);
      }
    } catch (err) {
      console.error(`Error saving ${section}:`, err);
      setError(err.message);
      alert(`Error saving profile: ${err.message}`);
    }
  };

  // Function to get profile completion color based on percentage
  const getCompletionColor = (percentage) => {
    if (percentage < 50) return 'bg-red-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Details' },
    { id: 'employment', label: 'Employment History' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="opacity-90 mt-1">Manage your professional information</p>

                {/* Profile Completion Indicator */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Profile Completion</span>
                    <span className="text-sm font-bold">{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-blue-800 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${getCompletionColor(profileCompletion)}`}
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                  <p className="text-xs opacity-80 mt-1">
                    {profileCompletion < 50
                      ? 'Complete more sections to improve your profile'
                      : profileCompletion < 90
                        ? 'Almost complete! Add more details to stand out'
                        : 'Your profile is complete! Great job!'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold">
                    {authUser?.name?.charAt(0)?.toUpperCase() || authUser?.email?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'personal' && (
              <PersonalDetailsForm
                initialData={profileData.personalDetails}
                onSave={(data) => handleSave(data, 'personalDetails')}
              />
            )}

            {activeTab === 'employment' && (
              <EmploymentHistoryForm
                initialData={profileData.employmentHistory}
                onSave={(data) => handleSave(data, 'employmentHistory')}
              />
            )}

            {activeTab === 'education' && (
              <EducationForm
                initialData={profileData.education}
                onSave={(data) => handleSave(data, 'education')}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectForm
                initialData={profileData.projects}
                onSave={(data) => handleSave(data, 'projects')}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsForm
                initialData={profileData.skills}
                onSave={(data) => handleSave(data, 'skills')}
              />
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .form-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .form-section {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
        }
        
        .form-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 16px;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #374151;
        }
        
        .form-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          resize: vertical;
          min-height: 100px;
          transition: border-color 0.2s;
        }
        
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }
        
        .btn-primary {
          background-color: #3b82f6;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .btn-primary:hover {
          background-color: #2563eb;
        }
        
        .btn-secondary {
          background-color: #f3f4f6;
          color: #374151;
          padding: 10px 20px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .btn-secondary:hover {
          background-color: #e5e7eb;
        }
        
        .employment-item, .education-item, .project-item {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          margin-bottom: 16px;
        }
        
        .employment-header, .education-header, .project-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .item-title {
          font-weight: 600;
          color: #1f2937;
        }
        
        .item-subtitle {
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        .employment-dates, .education-dates {
          display: flex;
          gap: 16px;
          margin-top: 8px;
        }
        
        .date-field {
          flex: 1;
        }
        
        .remove-btn {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background-color 0.2s;
        }
        
        .remove-btn:hover {
          background: #fecaca;
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .employment-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .employment-dates {
            flex-direction: column;
            gap: 5px;
          }
          
          .education-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .education-dates {
            flex-direction: column;
            gap: 5px;
          }
          
          .project-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .form-actions {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}