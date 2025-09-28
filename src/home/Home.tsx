import React from 'react';
import { useTranslation } from 'react-i18next';
import page_under_construction from '../img/page_under_construction.png';

const Home: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <div className="container text-center" style={{ minHeight: 'calc(100vh - 60px)', paddingTop: '60px' }}>
      <div className="jumbotron"> {/* Using Jumbotron for prominent content */}
        <h1 className="display-4">{t('welcome')}</h1>
        <p className="lead">{t('description')}</p>
        <img src={page_under_construction} width="300px" alt="Page under construction" className="img-responsive center-block" />
        <p style={{ marginTop: '20px', fontSize: '1.1em' }}>
          {t('fundraising_message')}{" "}
          <a href="https://www.indiegogo.com/projects/ai-selfpub-coloringbook-studio" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', color: '#e03a73' }}>
            {t('fundraising_link_text')}
          </a>
        </p>
        {/* hitwebcounter Code START */}
        <div style={{ marginTop: '30px' }}>
          <a href="https://www.hitwebcounter.com/" target="_blank" rel="noopener noreferrer">
            <img src="https://hitwebcounter.com/counter/counter.php?page=21442109&style=0027&nbdigits=5&type=page&initCount=0" title="Counters" alt="Counters" border="0" />
          </a>
        </div>
        {/* hitwebcounter Code END */}
      </div>
    </div>
  );
};

export default Home;