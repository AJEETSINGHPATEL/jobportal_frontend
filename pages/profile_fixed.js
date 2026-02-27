import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { FaUser, FaGraduationCap, FaBriefcase, FaTools, FaSave, FaUpload, FaImage } from 'react-icons/fa';
import PersonalDetailsForm from '../components/profile/PersonalDetailsForm';
import EmploymentHistoryForm from '../components/profile/EmploymentHistoryForm';
import EducationForm from '../components/profile/EducationForm';
import ProjectForm from '../components/profile/ProjectForm';

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, login, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    headline: '',
    resume_headline: '',
    summary: '',
    experience: [], // Deprecated in favor of employment_history
    employment_history: [],
    education: [],
    projects: [],
    personal_details: { dob: '', gender: '', current_location: '', languages: [] },
    skills: [],
    profilePicture: null,
    profile_completion: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (authUser) {
      const fetchProfile = async () => {
        try {
          // Use auth context to get user data
          if (authUser) {
            setUser(authUser);
          } else {
            // If no auth user, redirect to login
            router.push('/login');
            return;
          }

          if (authUser.id) {
            // Try to get existing profile
            try {
              const userProfile = await api.getUserProfile(authUser.id);
              // Map the profile data to match our state structure
              setProfile({
                fullName: userProfile.fullName || userProfile.full_name || '',
                email: userProfile.email || '',
                phone: userProfile.phone || '',
                address: userProfile.address || '',
                headline: userProfile.headline || '',
                summary: userProfile.summary || '',
                employment_history: userProfile.employment_history || [],
                projects: userProfile.projects || [],
                personal_details: userProfile.personal_details || { dob: '', gender: '', current_location: '', languages: [] },
                // Keep experience mapped from employment_history if needed for legacy logic, otherwise empty
                experience: userProfile.employment_history || [],
                education: userProfile.education || [],
                skills: userProfile.skills || [],
                profilePicture: userProfile.profilePicture || null,
                profile_completion: userProfile.profile_completion || 0
              });
              setPreviewImage(userProfile.profilePicture || null);
            } catch (error) {
              console.log('No existing profile found, creating default');
              // Set default values if profile doesn't exist
              setProfile({
                fullName: authUser.full_name || '',
                email: authUser.email || '',
                phone: '',
                address: '',
                headline: '',
                summary: '',
                experience: [{ title: '', company: '', startDate: '', endDate: '', description: '' }],
                education: [{ school: '', degree: '', field: '', startDate: '', endDate: '' }],
                skills: [],
                profilePicture: null,
                profile_completion: 0
              });
            }
          } else {
            // Set default values
            setProfile({
              fullName: authUser.full_name || '',
              email: authUser.email || '',
              phone: '',
              address: '',
              headline: '',
              summary: '',
              experience: [{ title: '', company: '', startDate: '', endDate: '', description: '' }],
              education: [{ school: '', degree: '', field: '', startDate: '', endDate: '' }],
              skills: [],
              profilePicture: null,
              profile_completion: 0
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          // Set default values if profile doesn't exist
          if (authUser) {
            setUser(authUser);
            setProfile({
              fullName: authUser.full_name || '',
              email: authUser.email || '',
              phone: '',
              address: '',
              headline: '',
              summary: '',
              experience: [{ title: '', company: '', startDate: '', endDate: '', description: '' }],
              education: [{ school: '', degree: '', field: '', startDate: '', endDate: '' }],
              skills: [],
              profilePicture: null,
              profile_completion: 0
            });
          } else {
            router.push('/login');
          }
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    } else {
      // If no user is authenticated, redirect to login
      router.push('/login');
    }
  }, [authUser, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...profile.experience];
    newExperience[index][field] = value;
    setProfile(prev => ({
      ...prev,
      experience: newExperience
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...profile.education];
    newEducation[index][field] = value;
    setProfile(prev => ({
      ...prev,
      education: newEducation
    }));
  };

  const addExperience = () => {
    setProfile(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', startDate: '', endDate: '', description: '' }]
    }));
  };

  const removeExperience = (index) => {
    if (profile.experience.length > 1) {
      const newExperience = [...profile.experience];
      newExperience.splice(index, 1);
      setProfile(prev => ({
        ...prev,
        experience: newExperience
      }));
    }
  };

  const addEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', field: '', startDate: '', endDate: '' }]
    }));
  };

  const removeEducation = (index) => {
    if (profile.education.length > 1) {
      const newEducation = [...profile.education];
      newEducation.splice(index, 1);
      setProfile(prev => ({
        ...prev,
        education: newEducation
      }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handlePersonalDetailsSave = (details) => {
    setProfile(prev => ({ ...prev, personal_details: details, resume_headline: details.resume_headline }));
  };

  const handleEmploymentSave = (history) => {
    setProfile(prev => ({ ...prev, employment_history: history }));
  };

  const handleEducationSave = (edu) => {
    setProfile(prev => ({ ...prev, education: edu }));
  };

  const handleProjectsSave = (projs) => {
    setProfile(prev => ({ ...prev, projects: projs }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (authUser && authUser.id) {
        const profileData = {
          ...profile,
          user_id: authUser.id
        };

        // First try to get existing profile to see if it exists
        try {
          const existingProfile = await api.getUserProfile(authUser.id);
          // If profile exists, update it using the user ID (more intuitive)
          await api.updateUserProfile(authUser.id, profileData);
          alert('Profile updated successfully!');

          // Update the auth context with the new profile picture and completion
          if (authUser.profilePicture !== profileData.profilePicture || authUser.profile_completion !== profileData.profile_completion) {
            const updatedUser = {
              ...authUser,
              profilePicture: profileData.profilePicture,
              profile_completion: profileData.profile_completion
            };
            // Update localStorage with the updated user data
            localStorage.setItem('user', JSON.stringify(updatedUser));
            // Update the auth context user
            login(updatedUser, localStorage.getItem('token'));
          }
        } catch (error) {
          // If getting existing profile fails (meaning it doesn't exist), create new profile
          if (error.status === 404) {
            try {
              await api.createProfile(profileData);
              alert('Profile created successfully!');
              
              // Update the auth context with the new profile picture and completion
              const updatedUser = {
                ...authUser,
                profilePicture: profileData.profilePicture,
                profile_completion: profileData.profile_completion
              };
              // Update localStorage with the updated user data
              localStorage.setItem('user', JSON.stringify(updatedUser));
              // Update the auth context user
              login(updatedUser, localStorage.getItem('token'));
            } catch (createError) {
              // Check if the error is because profile already exists (rare race condition)
              if (createError.message && createError.message.includes('already exists')) {
                // Try updating again
                const retryProfile = await api.getUserProfile(authUser.id);
                await api.updateUserProfile(authUser.id, profileData);
                alert('Profile updated successfully!');
                
                // Update the auth context with the new profile picture and completion
                const updatedUser = {
                  ...authUser,
                  profilePicture: profileData.profilePicture,
                  profile_completion: profileData.profile_completion
                };
                // Update localStorage with the updated user data
                localStorage.setItem('user', JSON.stringify(updatedUser));
                // Update the auth context user
                login(updatedUser, localStorage.getItem('token'));
              } else {
                throw createError;
              }
            }
          } else if (error.status === 401) {
            // Handle unauthorized error
            alert('Session expired. Please log in again.');
            // Clear the token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
            return;
          } else {
            throw error;
          }
        }

        // If there's a profile picture to upload, upload it separately
        if (profilePictureFile) {
          // Update the auth context user after profile save to ensure consistency
          const updatedUser = {
            ...authUser,
            profilePicture: profileData.profilePicture,
            profile_completion: profileData.profile_completion
          };
          // Update localStorage with the updated user data
          localStorage.setItem('user', JSON.stringify(updatedUser));
          // Update the auth context user
          login(updatedUser, localStorage.getItem('token'));
          const formData = new FormData();
          formData.append('file', profilePictureFile);

          try {
            const response = await fetch('/api/profile/upload-picture', {
              method: 'POST',
              body: formData,
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });

            if (!response.ok) {
              const errorData = await response.json();
              console.error('Error uploading profile picture:', errorData.detail);
              alert('Error uploading profile picture: ' + errorData.detail);
            } else {
              const result = await response.json();
              console.log('Profile picture uploaded successfully:', result);
              alert('Profile picture uploaded successfully!');

              // Update the profile picture URL in the profile state
              setProfile(prev => ({
                ...prev,
                profilePicture: result.url
              }));
              setPreviewImage(result.url);

              // Update the auth context user with the new profile picture
              const updatedUser = {
                ...authUser,
                profilePicture: result.url
              };
              // Update the auth context user
              // This will be handled by the AuthContext when it fetches the profile again
            }
          } catch (uploadError) {
            console.error('Error uploading profile picture:', uploadError);
            alert('Error uploading profile picture: ' + uploadError.message);
          }
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      if (error.status === 401) {
        alert('Session expired. Please log in again.');
        // Clear the token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        logout(); // Call logout to update context state
        router.push('/login');
      } else {
        alert('Error saving profile: ' + (error.message || 'Unknown error occurred'));
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <h1>User Profile</h1>
          <p>Manage your personal information and professional details</p>
        </div>
      </div>

      {/* Profile Completion Bar */}
      <div className="completion-section">
        <div className="completion-header">
          <h3>Profile Completion</h3>
          <span className="completion-percentage">{profile.profile_completion}%</span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{
              width: `${profile.profile_completion}%`,
              backgroundColor: profile.profile_completion >= 75 ? '#10B981' : profile.profile_completion >= 50 ? '#F59E0B' : '#EF4444'
            }}
          ></div>
        </div>
        <p className="completion-text">
          {profile.profile_completion >= 75
            ? 'Great job! Your profile is almost complete.'
            : profile.profile_completion >= 50
              ? 'Good progress! Complete more sections to improve your profile.'
              : 'Complete your profile to stand out to potential employers.'}
        </p>
      </div>

      {/* Profile Form */}
      <div className="profile-form-container">
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="profile-form">
          {/* Profile Picture Section */}
          <div className="form-section">
            <h2><FaUser /> Profile Picture</h2>
            <div className="profile-picture-section">
              <div className="profile-picture-preview">
                {previewImage ? (
                  <img src={previewImage} alt="Profile Preview" className="preview-image" />
                ) : (
                  <div className="placeholder-image">
                    <FaUser size={60} color="#9ca3af" />
                    <p>No image uploaded</p>
                  </div>
                )}
              </div>
              <div className="profile-picture-upload">
                <label htmlFor="profilePicture" className="upload-label">
                  <FaUpload /> Upload Picture
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  style={{ display: 'none' }}
                />
                <p className="upload-hint">JPG, PNG or GIF (Max 5MB)</p>
              </div>
            </div>
          </div>

          {/* Personal Details & Headline */}
          <PersonalDetailsForm
            initialData={{
              ...profile.personal_details,
              resume_headline: profile.resume_headline || profile.headline,
              dob: profile.personal_details?.dob,
              gender: profile.personal_details?.gender,
              current_location: profile.personal_details?.current_location,
              languages: profile.personal_details?.languages
            }}
            onSave={handlePersonalDetailsSave}
          />

          {/* Work Experience */}
          <EmploymentHistoryForm
            initialData={profile.employment_history}
            onSave={handleEmploymentSave}
          />

          {/* Education */}
          <EducationForm
            initialData={profile.education}
            onSave={handleEducationSave}
          />

          {/* Projects */}
          <ProjectForm
            initialData={profile.projects}
            onSave={handleProjectsSave}
          />









          {/* Save Button */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <div className="spinner small"></div> Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div >

      <style jsx>{`
        .profile-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f4f8 0%, #e6ecf4 100%);
          padding: 20px;
        }

        .profile-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 16px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          position: relative;
          overflow: hidden;
        }

        .profile-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 50%);
        }

        .header-content h1 {
          font-size: 2.2rem;
          font-weight: 700;
          margin: 0 0 10px 0;
          position: relative;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .header-content p {
          font-size: 1.1rem;
          margin: 0;
          opacity: 0.9;
          position: relative;
        }

        .completion-section {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          padding: 30px;
          margin-bottom: 25px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .completion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .completion-percentage {
          font-size: 1.8rem;
          font-weight: bold;
          color: #4a5568;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .progress-bar-container {
          width: 100%;
          height: 12px;
          background-color: #edf2f7;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 15px;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
          border-radius: 6px;
          transition: width 0.5s ease, background-color 0.3s ease;
          box-shadow: 0 0 10px rgba(79, 172, 254, 0.3);
        }

        .completion-text {
          color: #718096;
          font-size: 1rem;
          margin: 0;
          text-align: center;
          font-style: italic;
        }

        .profile-form-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .profile-form {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          padding: 40px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .form-section {
          margin-bottom: 35px;
          padding-bottom: 35px;
          border-bottom: 1px solid #e2e8f0;
          transition: transform 0.2s ease;
        }

        .form-section:hover {
          transform: translateY(-2px);
        }

        .form-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .form-section h2 {
          margin: 0;
          font-size: 1.6rem;
          color: #2d3748;
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .form-group {
          margin-bottom: 22px;
        }

        .form-group label {
          display: block;
          margin-bottom: 10px;
          font-weight: 600;
          color: #4a5568;
          font-size: 0.95rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 14px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .experience-item, .education-item {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .add-btn {
          padding: 8px 16px;
          border-radius: 6px;
          border: 1px dashed #0070f3;
          background: transparent;
          color: #0070f3;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .remove-btn {
          padding: 8px 16px;
          border-radius: 6px;
          border: 1px solid #dc3545;
          background: transparent;
          color: #dc3545;
          cursor: pointer;
          font-weight: 500;
          margin-top: 10px;
        }

        .skills-input {
          margin-top: 20px;
        }

        .skill-input-container {
          display: flex;
          gap: 10px;
        }

        .skill-input-container input {
          flex: 1;
        }

        .add-skill-btn {
          padding: 12px 20px;
          border-radius: 8px;
          border: none;
          background: #0070f3;
          color: white;
          cursor: pointer;
          font-weight: 500;
        }

        .skills-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 15px;
        }

        .skill-tag {
          background: #0070f3;
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .remove-skill-btn {
          background: transparent;
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .form-actions {
          margin-top: 30px;
          padding-top: 30px;
          border-top: 1px solid #eee;
          text-align: center;
        }

        .btn {
          padding: 14px 30px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          font-size: 1rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          background: linear-gradient(135deg, #f0f4f8 0%, #e6ecf4 100%);
        }

        .spinner {
          width: 60px;
          height: 60px;
          border: 5px solid #e2e8f0;
          border-top: 5px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 25px;
        }

        .spinner.small {
          width: 24px;
          height: 24px;
          border-width: 3px;
        }

        /* Profile Picture Styles */
        .profile-picture-section {
          display: flex;
          align-items: flex-start;
          gap: 40px;
          margin-bottom: 25px;
          padding: 25px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .profile-picture-preview {
          flex: 0 0 auto;
        }

        .preview-image {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #e2e8f0;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .preview-image:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
        }

        .placeholder-image {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          border: 3px dashed #cbd5e0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #a0aec0;
          background: #f8fafc;
          transition: all 0.3s ease;
        }

        .placeholder-image:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .profile-picture-upload {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .upload-label {
          display: inline-block;
          padding: 14px 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          text-align: center;
        }

        .upload-label:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .upload-hint {
          margin-top: 15px;
          color: #718096;
          font-size: 0.9rem;
          text-align: center;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .skill-input-container {
            flex-direction: column;
          }
          
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .profile-picture-section {
            flex-direction: column;
            align-items: center;
          }
        }
      `}
      <style jsx>{`
        .personal-details-grid {
          display: grid;
          gap: 25px;
          margin-bottom: 25px;
        }

        .personal-details-title {
          margin: 0;
          font-size: 1.6rem;
          color: #2d3748;
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #4a5568;
          font-size: 0.95rem;
        }

        .form-input {
          width: 100%;
          padding: 14px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }

        .form-hint {
          display: block;
          margin-top: 6px;
          color: #718096;
          font-size: 0.85rem;
        }

        .employment-history-title {
          margin: 0;
          font-size: 1.6rem;
          color: #2d3748;
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .employment-history-list {
          margin-bottom: 25px;
        }

        .employment-item {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 25px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .employment-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .employment-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .employment-position {
          flex: 1;
        }

        .employment-designation {
          margin: 0 0 5px 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: #2d3748;
        }

        .employment-company {
          margin: 0;
          font-size: 1rem;
          color: #4a5568;
          font-weight: 500;
        }

        .employment-details {
          margin-top: 15px;
        }

        .employment-dates {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 10px;
          color: #718096;
          font-size: 0.9rem;
        }

        .employment-date, .employment-salary, .employment-notice {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .employment-description {
          margin: 0;
          color: #4a5568;
          line-height: 1.5;
        }

        .add-employment-form {
          background: #f8fafc;
          border-radius: 12px;
          padding: 25px;
          margin-top: 20px;
          border: 1px solid #e2e8f0;
        }

        .form-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .form-checkbox input {
          margin: 0;
        }

        .education-title {
          margin: 0;
          font-size: 1.6rem;
          color: #2d3748;
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .education-list {
          margin-bottom: 25px;
        }

        .education-item {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 25px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .education-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .education-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .education-degree {
          flex: 1;
        }

        .education-degree-name {
          margin: 0 0 5px 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: #2d3748;
        }

        .education-institution {
          margin: 0;
          font-size: 1rem;
          color: #4a5568;
          font-weight: 500;
        }

        .education-details {
          margin-top: 15px;
        }

        .education-dates {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 10px;
          color: #718096;
          font-size: 0.9rem;
        }

        .education-date, .education-grade {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .education-description {
          margin: 0;
          color: #4a5568;
          line-height: 1.5;
        }

        .add-education-form {
          background: #f8fafc;
          border-radius: 12px;
          padding: 25px;
          margin-top: 20px;
          border: 1px solid #e2e8f0;
        }

        .project-title {
          margin: 0;
          font-size: 1.6rem;
          color: #2d3748;
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .project-list {
          margin-bottom: 25px;
        }

        .project-item {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 25px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .project-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .project-info {
          flex: 1;
        }

        .project-title-name {
          margin: 0 0 5px 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: #2d3748;
        }

        .project-role {
          margin: 0 0 8px 0;
          font-size: 0.95rem;
          color: #4a5568;
          font-weight: 500;
        }

        .project-link {
          display: inline-block;
          padding: 6px 12px;
          background: #e2e8f0;
          color: #4a5568;
          border-radius: 6px;
          font-size: 0.85rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .project-link:hover {
          background: #667eea;
          color: white;
        }

        .project-details {
          margin-top: 15px;
        }

        .project-dates {
          margin-bottom: 10px;
          color: #718096;
          font-size: 0.9rem;
        }

        .project-description {
          margin: 0;
          color: #4a5568;
          line-height: 1.5;
        }

        .add-project-form {
          background: #f8fafc;
          border-radius: 12px;
          padding: 25px;
          margin-top: 20px;
          border: 1px solid #e2e8f0;
        }

        .form-actions {
          margin-top: 30px;
          padding-top: 25px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .btn {
          padding: 14px 30px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          font-size: 1rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .btn-outline {
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .btn-outline:hover {
          background: #667eea;
          color: white;
        }

        .add-btn {
          padding: 10px 20px;
          border-radius: 8px;
          border: 2px dashed #667eea;
          background: transparent;
          color: #667eea;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          width: auto;
        }

        .add-btn:hover {
          background: #667eea;
          color: white;
          transform: scale(1.02);
        }

        .remove-btn {
          padding: 8px 16px;
          border-radius: 6px;
          border: 1px solid #dc3545;
          background: transparent;
          color: #dc3545;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .remove-btn:hover {
          background: #dc3545;
          color: white;
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

             } < / s t y l e > 
         < / d i v > 
     ) ; 
 } 
 
 
