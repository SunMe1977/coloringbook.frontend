import React, { useEffect, useState } from 'react';
import './Profile.css';

interface User {
  name?: string;
  email?: string;
  imageUrl?: string;
}

interface ProfileProps {
  currentUser?: User;
}

const Profile: React.FC<ProfileProps> = ({ currentUser }) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentUser]);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="container">
          <p className="profile-message">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || (!currentUser.name && !currentUser.email)) {
    console.warn('⚠️ No user data available. Redirect or login may be needed.');
    return (
      <div className="profile-container">
        <div className="container">
          <p className="profile-message">No user data available. Please log in.</p>
        </div>
      </div>
    );
  }

  const { name, email, imageUrl } = currentUser;

  return (
    <div className="profile-container">
      <div className="container">
        <div className="profile-info">
          <div className="profile-avatar">
            {imageUrl ? (
              <img src={imageUrl} alt={name || 'User'} />
            ) : (
              <div className="text-avatar">
                <span>{name ? name.charAt(0).toUpperCase() : '?'}</span>
              </div>
            )}
          </div>
          <div className="profile-name">
            <h2>{name || 'Unnamed User'}</h2>
            <p className="profile-email">{email || 'No email available'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
