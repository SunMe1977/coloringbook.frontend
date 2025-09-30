import React from 'react';
import { useTranslation } from 'react-i18next';

const Sponsor: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <div className="container" style={{ paddingTop: '80px', paddingBottom: '50px' }}>
      <section style={{ textAlign: 'center', padding: '2rem', fontFamily: 'sans-serif' }}>
        <h2 style={{ fontSize: '2rem', color: '#333' }}>{t('sponsor.title')}</h2>
        <p style={{ fontSize: '1.2rem', color: '#555', maxWidth: '600px', margin: 'auto' }}>
          {t('sponsor.content_p1')}
          <br /><br />
          {t('sponsor.content_p2')}
          <br /><br />
          <strong>{t('sponsor.call_to_action')}</strong>
        </p>
      </section>
    </div>
  );
};

export default Sponsor;