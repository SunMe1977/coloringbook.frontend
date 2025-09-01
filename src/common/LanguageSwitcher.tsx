import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = event.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <div className="language-switcher">
      <select onChange={handleChange} value={i18n.language}>
        <option value="en">{t('english')}</option>
        <option value="de">{t('german')}</option>
        <option value="it">{t('italian')}</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
