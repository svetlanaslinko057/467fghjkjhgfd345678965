/**
 * Site Settings API - Header config, socials
 */
const API_URL = process.env.REACT_APP_BACKEND_URL;

// Default header config (fallback)
export const defaultHeaderConfig = {
  showTopbar: true,
  topbarStyle: "dark",
  phones: ["050-247-41-61", "063-724-77-03"],
  socials: [
    { type: "telegram", url: "https://t.me/ystore", enabled: true },
    { type: "instagram", url: "https://instagram.com/ystore", enabled: true },
    { type: "tiktok", url: "https://tiktok.com/@ystore", enabled: true },
    { type: "facebook", url: "https://facebook.com/ystore", enabled: true },
  ],
  workingHours: "Пн-Пт: 9:00-19:00, Сб: 10:00-17:00"
};

/**
 * Get header configuration from API
 * Returns fallback on error
 */
export async function getHeaderConfig() {
  try {
    const res = await fetch(`${API_URL}/api/v2/site/header`);
    if (!res.ok) throw new Error('Failed to fetch header config');
    return await res.json();
  } catch (error) {
    console.warn('Using default header config:', error);
    return defaultHeaderConfig;
  }
}

/**
 * Admin: Get all site settings
 */
export async function getSiteSettings(token) {
  const res = await fetch(`${API_URL}/api/v2/admin/site-settings`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch site settings');
  return await res.json();
}

/**
 * Admin: Update site settings
 */
export async function updateSiteSettings(token, settings) {
  const res = await fetch(`${API_URL}/api/v2/admin/site-settings`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(settings)
  });
  if (!res.ok) throw new Error('Failed to update site settings');
  return await res.json();
}
