import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function PersonalDetailsForm({ initialData, onSave }) {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    headline: initialData.headline || '',
    summary: initialData.summary || '',
    profilePicture: initialData.profilePicture || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(initialData.profilePicture || '');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const { updateProfilePicture, token } = useAuth(); // Get the updateProfilePicture function and token

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, GIF)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      // Resize image to appropriate dimensions
      resizeImage(file, 200, 200) // Resize to 200x200 pixels maximum
        .then(resizedFile => {
          // Create preview
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result);
          };
          reader.readAsDataURL(resizedFile);

          // Update form data with resized file
          setFormData(prev => ({
            ...prev,
            profilePictureFile: resizedFile
          }));
        })
        .catch(error => {
          console.error('Error resizing image:', error);
          alert('Error processing image. Please try another image.');
        });
    }
  };

  // Function to resize image
  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw image on canvas with new dimensions
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas back to blob
        canvas.toBlob(
          blob => {
            if (blob) {
              // Create new file with resized image
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Could not create resized image'));
            }
          },
          file.type,
          0.8 // Quality factor (80%)
        );
      };

      img.onerror = error => {
        reject(error);
      };

      // Load the original image
      img.src = URL.createObjectURL(file);
    });
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let profilePictureUrl = formData.profilePicture; // Start with current profile picture URL
      
      // First, handle profile picture upload if there's a new file
      if (formData.profilePictureFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', formData.profilePictureFile);
        
        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://jobportal-backend-2-i07w.onrender.com'}/api/profile/upload-picture`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataUpload // Send as FormData for file upload
        });

        if (uploadResponse.ok) {
          const result = await uploadResponse.json();
          profilePictureUrl = result.url; // Update with the new profile picture URL
          
          // Update the profile picture in the AuthContext
          updateProfilePicture(result.url);
        } else {
          console.error('Profile picture upload failed:', await uploadResponse.text());
          // Continue with save even if picture upload fails
        }
      }

      // Prepare the data for the profile update (excluding the file object)
      // Only include fields that are part of the personal details
      const personalDetailsData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        headline: formData.headline,
        summary: formData.summary,
        // Include the updated profile picture URL if it was uploaded
        profilePicture: profilePictureUrl
      };
      
      // Send only the personal details data to the profile update endpoint
      await onSave(personalDetailsData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving personal details:', error);
      alert('Error saving personal details');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="form-section">
      <h2 className="form-title">Personal Details & Headline</h2>
      
      <div className="flex items-start gap-6 mb-6">
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center">
          <div 
            className="w-16 h-16 rounded-full bg-gray-200 border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={triggerFileSelect}
          >
            {previewImage ? (
              <img 
                src={previewImage} 
                alt="Profile Preview" 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-gray-500 text-xl">+</span>
            )}
          </div>
          <button
            type="button"
            onClick={triggerFileSelect}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Change Photo
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Personal Details Form */}
        <div className="flex-1">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your phone number"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Current Location</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your location"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Resume Headline</label>
            <input
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              className="form-input"
              placeholder="E.g. Senior Java Developer with 5 years experience..."
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Professional Summary</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Tell us about your experience and career goals..."
              rows="4"
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={() => {
            if (isEditing) {
              setFormData({
                fullName: initialData.fullName || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                address: initialData.address || '',
                headline: initialData.headline || '',
                summary: initialData.summary || '',
                profilePicture: initialData.profilePicture || ''
              });
              setPreviewImage(initialData.profilePicture || '');
            }
            setIsEditing(!isEditing);
          }}
          className="btn-secondary"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
        
        {isEditing && (
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving}
            className="btn-primary"
          >
            {isSaving ? 'Saving...' : 'Save Personal Details'}
          </button>
        )}
      </div>
    </div>
  );
}