import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { getCurrentUser, updateUser } from '../../util/APIUtils'; // Import updateUser and getCurrentUser
import LoadingIndicator from '../../common/LoadingIndicator'; // Import LoadingIndicator
import { Edit, Save, XCircle } from 'lucide-react'; // Import icons for edit/save/cancel

interface User {
  name?: string;
  email?: string;
  imageUrl?: string;
}

interface ProfileProps {
  currentUser: User;
  onUserUpdate: (updatedUser: User) => void; // New prop for updating user in parent
}

const MAX_RETRIES = 3; // Maximum number of times to retry loading the image

const Profile: React.FC<ProfileProps> = ({ currentUser, onUserUpdate }) => {
  const { t } = useTranslation('common');
  const { imageUrl: initialImageUrl } = currentUser;

  const [editMode, setEditMode] = useState(false);
  const [editableName, setEditableName] = useState(currentUser.name || '');
  const [editableEmail, setEditableEmail] = useState(currentUser.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(initialImageUrl);
  const [retryCount, setRetryCount] = useState(0);

  // Update editable fields when currentUser prop changes
  useEffect(() => {
    setEditableName(currentUser.name || '');
    setEditableEmail(currentUser.email || '');
    setCurrentImageUrl(initialImageUrl);
    setRetryCount(0); // Reset retry count for a new image URL
  }, [currentUser, initialImageUrl]);

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

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    // Reset to original values
    setEditableName(currentUser.name || '');
    setEditableEmail(currentUser.email || '');
  };

  const handleSaveClick = async () => {
    setIsLoading(true);
    try {
      await updateUser({ name: editableName, email: editableEmail });
      toast.success(t('user.update.success'));
      setEditMode(false);
      
      // Re-fetch the current user to ensure the parent component's state is updated
      const refreshedUser = await getCurrentUser();
      if (refreshedUser) {
        onUserUpdate(refreshedUser); // Call the parent callback with the updated user
      }

    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.message || t('user.update.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '30px' }}>
      <div className="row">
        <div className="col-md-6 col-md-offset-3 text-center">
          <div className="panel panel-default" style={{ padding: '30px' }}>
            <div className="profile-avatar" style={{ marginBottom: '20px' }}>
              {currentImageUrl ? (
                <img 
                  key={`${currentImageUrl}-${retryCount}`}
                  src={currentImageUrl} 
                  alt={currentUser.name || t('user_alt_text')} 
                  onError={handleImageError}
                  className="img-circle img-responsive center-block"
                  style={{ maxWidth: '200px', height: '200px' }}
                />
              ) : (
                <div className="text-avatar center-block" style={{ width: '200px', height: '200px', borderRadius: '50%', background: 'linear-gradient(45deg, #46b5e5 1%, #1e88e5 64%, #40baf5 97%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <span style={{ lineHeight: '200px', color: '#fff', fontSize: '3em' }}>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '?'}</span>
                </div>
              )}
            </div>
            <div className="profile-name">
              {editMode ? (
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    value={editableName}
                    onChange={(e) => setEditableName(e.target.value)}
                    placeholder={t('name_placeholder')}
                    disabled={isLoading}
                    style={{ marginBottom: '10px' }}
                  />
                  <input
                    type="email"
                    className="form-control"
                    value={editableEmail}
                    onChange={(e) => setEditableEmail(e.target.value)}
                    placeholder={t('email_placeholder')}
                    disabled={isLoading}
                  />
                </div>
              ) : (
                <>
                  <h2>{currentUser.name || t('unnamed_user')}</h2>
                  <p className="text-muted">{currentUser.email || t('no_email_available')}</p>
                </>
              )}
            </div>
            <div className="profile-actions" style={{ marginTop: '20px' }}>
              {editMode ? (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={handleSaveClick}
                    disabled={isLoading}
                    style={{ marginRight: '10px' }}
                  >
                    {isLoading ? <LoadingIndicator /> : <><Save size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> {t('save')}</>}
                  </button>
                  <button
                    className="btn btn-default"
                    onClick={handleCancelClick}
                    disabled={isLoading}
                  >
                    <XCircle size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> {t('cancel')}
                  </button>
                </>
              ) : (
                <button className="btn btn-primary" onClick={handleEditClick}>
                  <Edit size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> {t('edit_profile')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;