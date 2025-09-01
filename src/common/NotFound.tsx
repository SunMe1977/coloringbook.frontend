import React from 'react';
import './NotFound.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="page-not-found">
      <h1 className="title">404</h1>
      <div className="desc">{t('notfound')}</div>
      <Link to="/">
        <button className="go-back-btn btn btn-primary" type="button">
          {t('goback')}
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
