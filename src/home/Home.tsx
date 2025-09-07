import React from 'react';
import './Home.css';
import { useTranslation } from 'react-i18next';
import page_under_construction from '../img/page_under_construction.png';

const Home: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>{t('welcome')}</h1>
        <p>{t('description')}</p>
         <img src={page_under_construction} width="60%" alt="Page under construction" />
      </div>
    </div>
  );
};

export default Home;
