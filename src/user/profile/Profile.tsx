import React from 'react';
import './Profile.css';

interface User {
  name?: string;
  email?: string;
  imageUrl?: string;
}

interface ProfileProps {
  currentUser: User; // currentUser is now guaranteed to be present by App.tsx
}

const Profile: React.FC<ProfileProps> = ({ currentUser }) => {
  // App.tsx now ensures currentUser is available before rendering Profile,
  // so we can directly destructure and use it.
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