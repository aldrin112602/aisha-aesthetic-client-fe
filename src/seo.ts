export const pageTitles: Record<string, string> = {
  '/': 'AishaEsthetics',

  // AUTH
  '/signin': 'Sign In',
  '/signup': 'Sign Up',

  // DASHBOARDS
  '/admin': 'Admin Dashboard',
  '/employee': 'Employee Dashboard',
  '/customer': 'Customer Dashboard',
  '/dashboard': 'Dashboard',

  // ADMIN
  '/admin-appointments': 'Appointment Management',
  '/account-management': 'Account Management',
  '/shop-areas': 'Shop Areas',
  '/services': 'Services',
  '/sales-report': 'Sales Report',
  '/database-backups': 'Database Backups',
  '/archives': 'Archives',

  // SHARED
  '/walkins': 'Walk-ins',
  '/notifications': 'Notifications',
  '/appointments': 'Appointments',
  '/profile': 'Profile',

  // CUSTOMER
  '/booking': 'Book Appointment',
  '/history': 'Appointment History',
};

export const publicPaths = ['/signin', '/signup'];

export function siteOrigin(value: string): string {
  if (!value) return '';
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error('VITE_SITE_URL must be an HTTP(S) origin without a path, query, or credentials.');
  }
  return url.origin;
}

function escape(value: string) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}

// Shared by the browser and production HTML so crawlers receive metadata without JavaScript.
export function renderSeoHead(pathname: string, siteUrl = ''): string {
  const path = pathname.replace(/\/+$/, '') || '/';
  const publicPath = path === '/' ? '/signin' : path;
  const isPublic = publicPaths.includes(publicPath);
  const origin = siteOrigin(siteUrl);
  const title = publicPath === '/signin' ? 'AishaEsthetics | Beauty, Aesthetics & Wellness' : `${pageTitles[path] || 'Page'} | AishaEsthetics`;
  const description = publicPath === '/signin'
    ? 'Welcome to AishaEsthetics. Sign in to book beauty, aesthetics and wellness appointments and manage your visits in one place.'
    : publicPath === '/signup'
      ? 'Create your AishaEsthetics account to book beauty and wellness appointments, view your bookings and manage upcoming visits.'
      : 'Manage your account and appointments with AishaEsthetics.';
  const meta = (key: string, value: string, property = false) => `<meta data-seo ${property ? 'property' : 'name'}="${key}" content="${escape(value)}" />`;
  const tags = [
    `<title data-seo>${escape(title)}</title>`,
    meta('description', description),
    meta('robots', isPublic ? 'index, follow' : 'noindex, nofollow'),
    meta('og:site_name', 'AishaEsthetics', true),
    meta('og:type', 'website', true),
    meta('og:title', title, true),
    meta('og:description', description, true),
    meta('og:image', `${origin}/logo-512.png`, true),
    meta('og:image:alt', 'AishaEsthetics — Beauty, Aesthetics & Wellness', true),
    meta('og:image:width', '512', true),
    meta('og:image:height', '512', true),
    meta('twitter:card', 'summary'),
    meta('twitter:title', title),
    meta('twitter:description', description),
    meta('twitter:image', `${origin}/logo-512.png`),
    meta('twitter:image:alt', 'AishaEsthetics logo'),
  ];
  if (origin && isPublic) {
    const url = `${origin}${publicPath}`;
    tags.push(`<link data-seo rel="canonical" href="${escape(url)}" />`, meta('og:url', url, true));
    const schema = { '@context': 'https://schema.org', '@type': 'Organization', name: 'AishaEsthetics', url: `${origin}/`, logo: `${origin}/logo-512.png` };
    tags.push(`<script data-seo type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.join('\n    ');
}
