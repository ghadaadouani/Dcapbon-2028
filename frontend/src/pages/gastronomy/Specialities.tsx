import React from 'react';
import PlaceholderPage from '../../components/PlaceholderPage';
import { useLanguage } from '../../context/LanguageContext';

const Specialities = () => {
  const { t } = useLanguage();
  return <PlaceholderPage title={t('nav.specialities')} subtitle="From Chakshouka to Grilled Fish: The flavours of Cap Bon" />;
};

export default Specialities;
