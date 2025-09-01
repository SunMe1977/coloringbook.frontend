import React from 'react';
import './Home.css';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>{t('welcome')}</h1>
        <p>{t('description')}</p>
      </div>
    </div>
  );
};

export default Home;
