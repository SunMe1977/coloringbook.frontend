import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AppFooter: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="/impressum">{t('impressum')}</Link>
            <Link to="/privacy-policy">{t('privacy_policy')}</Link>
            <Link to="/user-data-deletion">{t('user_data_deletion')}</Link>
            <Link to="/terms-of-service">{t('terms_of_service')}</Link>
            <Link to="/cookie-policy">{t('cookie_policy')}</Link>
          </div>

          <div className="footer-counter" style={{ textAlign: 'center', marginTop: '1rem' }}>
            <a
              href="https://www.freecounterstat.com"
              title="free web counter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://counter1.optistats.ovh/private/freecounterstat.php?c=gr4tgex15w4sxbu54172p25yr2ma4n77"
                border="0"
                title="free web counter"
                alt="free web counter"
              />
            </a>
          </div>

          <div className="footer-copyright">
            <strong>
              Copyright © 2025{' '}
              <a
                href="https://aiselfpubcoloringbookstudio.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('appname')}
              </a>.
            </strong>{' '}
            All rights reserved.
            <span className="d-none d-sm-inline float-right">
              {t('footer_anything_you_want')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
