import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { getSeoSettings } from '@/lib/seo';

const PageHelmet = ({ title, rawTitle }) => {
  const [seo, setSeo] = useState(getSeoSettings());

  useEffect(() => {
    const onUpdate = () => setSeo(getSeoSettings());
    window.addEventListener('seo-updated', onUpdate);
    return () => window.removeEventListener('seo-updated', onUpdate);
  }, []);

  return (
    <Helmet>
      <title>{rawTitle || (title ? `${title} | ${seo.title}` : seo.title)}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
    </Helmet>
  );
};

export default PageHelmet;
