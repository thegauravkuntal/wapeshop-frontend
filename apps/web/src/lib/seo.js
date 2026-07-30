const STORAGE_KEY = 'vape-shop-seo';

const LOGO_URL = 'https://horizons-cdn.hostinger.com/e2f1ece2-d7c0-4f82-9306-ebd3eb0d039c/94114334774e476ae574972944e6913d.jpg';

const DEFAULTS = {
  title: 'Vape Shop Mumbai Andheri — Premium Vapes, Pods & E-Liquids',
  description: 'Mumbai\'s most loved vape store in Andheri West. Shop premium disposable vapes, pods, e-liquids from ELFBAR, ALFAKHER, GEEK VAPES & more. Free delivery across Mumbai.',
  keywords: 'vape shop mumbai, vaping andheri west, disposable vapes mumbai, elfbar mumbai, alfakher crown bar, geek vapes, pods and e-liquids mumbai, vape store andheri',
  ogImage: LOGO_URL,
  favicon: LOGO_URL,
};

export const getSeoSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULTS, ...JSON.parse(stored) };
  } catch {}
  return { ...DEFAULTS };
};

export const saveSeoSettings = (settings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const resetSeoSettings = () => {
  localStorage.removeItem(STORAGE_KEY);
  return { ...DEFAULTS };
};
