import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useTranslation } from 'react-i18next';

interface User {
  name?: string;
  email?: string;
  imageUrl?: string;
}

interface ProfileProps {
  currentUser: User;
}

const MAX_RETRIES = 3; // Maximum number of times to retry loading the image

const Profile: React.FC<ProfileProps> = ({ currentUser }) => {
  const { name, email, imageUrl: initialImageUrl } = currentUser;
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(initialImageUrl);
  const [retryCount, setRetryCount] = useState(0);
  const { t } = useTranslation('common'); // Using common namespace for profile strings

  // Reset imageUrl and retryCount if currentUser.imageUrl changes (e.g., user logs in/out)
  useEffect(() => {
    setCurrentImageUrl(initialImageUrl);
    setRetryCount(0); // Reset retry count for a new image URL
  }, [initialImageUrl]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn(`Failed to load profile image: ${e.currentTarget.src}. Attempt ${retryCount + 1} of ${MAX_RETRIES}.`);

    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      // By changing the key, React will re-mount the <img> element,
      // forcing a new load attempt with the same URL.
    } else {
      console.error('Max retries reached. Falling back to text avatar.');
      setCurrentImageUrl(undefined); // Fallback to text avatar if all retries fail
    }
  };

  return (
    <div className="profile-container">
      <div className="container">
        <div className="profile-info">
          <div className="profile-avatar">
            {currentImageUrl ? (
              <img 
                key={`${currentImageUrl}-${retryCount}`} // Key changes on retry to force re-render
                src={currentImageUrl} 
                alt={name || t('user_alt_text')} 
                onError={handleImageError}
              />
            ) : (
              <div className="text-avatar">
                <span>{name ? name.charAt(0).toUpperCase() : '?'}</span>
              </div>
            )}
          </div>
          <div className="profile-name">
            <h2>{name || t('unnamed_user')}</h2>
            <p className="profile-email">{email || t('no_email_available')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;