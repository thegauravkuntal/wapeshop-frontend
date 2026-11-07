const API_BASE = import.meta.env.VITE_API_URL || '';
const STORAGE_KEY = 'site-seo-settings';
const LEGACY_STORAGE_KEY = 'vape-shop-seo';

const LOGO_URL = 'https://horizons-cdn.hostinger.com/e2f1ece2-d7c0-4f82-9306-ebd3eb0d039c/94114334774e476ae574972944e6913d.jpg';

export const DEFAULT_SEO = {
  title: 'Vape Shop - Best Vapouriser Dealers in Mumbai | Vape Shop Mumbai Andheri Near Me Open Now',
  description: 'Buy authentic disposable vapes, pod systems, e-liquids and vape accessories online in Mumbai. Same day delivery in Bandra, Andheri & Mumbai.',
  keywords: 'vape shop mumbai, vape shop bandra, buy vape online mumbai, disposable vape mumbai, vape delivery mumbai, vape near me, vape store mumbai, vape bandra west, elf bar mumbai, vaporesso mumbai',
  ogTitle: 'Vape Shop - Best Vapouriser Dealers in Mumbai | Vape Shop Mumbai Andheri Near Me Open Now',
  ogDescription: 'Order authentic disposable vapes, pod systems and vape accessories online. Fast delivery across Mumbai.',
  twitterTitle: 'Vape Shop - Best Vapouriser Dealers in Mumbai | Vape Shop Mumbai Andheri Near Me Open Now',
  twitterDescription: 'Premium vaping products with same day delivery in Mumbai. Authentic brands and secure payments.',
  ogImage: LOGO_URL,
  favicon: LOGO_URL,
};

try {
  localStorage.removeItem(LEGACY_STORAGE_KEY);
} catch {}

const readCache = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const writeCache = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
};

export const getSeoSettings = () => ({
  ...DEFAULT_SEO,
  ...readCache(),
  title: DEFAULT_SEO.title,
});

export async function fetchSeoSettings() {
  try {
    const res = await fetch(`${API_BASE}/api/seo`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const settings = { ...DEFAULT_SEO };
    Object.keys(DEFAULT_SEO).forEach((field) => {
      if (typeof data[field] === 'string' && data[field]) {
        settings[field] = data[field];
      }
    });
    settings.title = DEFAULT_SEO.title;
    writeCache(settings);
    window.dispatchEvent(new Event('seo-updated'));
    return settings;
  } catch {
    return getSeoSettings();
  }
}

export async function saveSeoSettings(settings) {
  const token = localStorage.getItem('vape-shop-token');
  const res = await fetch(`${API_BASE}/api/seo`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(settings),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Server error: ${res.status}`);
  }
  writeCache({ ...getSeoSettings(), ...settings });
  return data;
}

export async function resetSeoSettings() {
  await saveSeoSettings(DEFAULT_SEO);
  return { ...DEFAULT_SEO };
}
