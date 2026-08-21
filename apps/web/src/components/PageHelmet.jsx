import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { getSeoSettings } from '@/lib/seo';

const PageHelmet = ({ title }) => {
  const [seo, setSeo] = useState(getSeoSettings());

  useEffect(() => {
    const onUpdate = () => setSeo(getSeoSettings());
    window.addEventListener('seo-updated', onUpdate);
    return () => window.removeEventListener('seo-updated', onUpdate);
  }, []);

  return (
    <Helmet>
      <title>{title ? `${title} | ${seo.title}` : seo.title}</title>
    </Helmet>
  );
};

export default PageHelmet;
