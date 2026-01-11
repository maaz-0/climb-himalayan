/**
 * Cloudflare Pages Middleware for Password Protection
 * This middleware intercepts all requests and checks for valid authentication
 */

// Simple session cookie name
const SESSION_COOKIE_NAME = 'climb_auth_session';
// Session secret will be derived from SITE_PASSWORD
const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Simple hash function for session validation
 */
async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a session token
 */
async function createSessionToken(password) {
  const timestamp = Date.now();
  const token = await hashString(`${password}-${timestamp}`);
  return `${token}.${timestamp}`;
}

/**
 * Verify a session token
 */
async function verifySessionToken(token, password) {
  if (!token || !password) return false;
  
  try {
    const [hash, timestamp] = token.split('.');
    const timestampNum = parseInt(timestamp, 10);
    
    // Check if session is expired (7 days)
    if (Date.now() - timestampNum > SESSION_DURATION * 1000) {
      return false;
    }
    
    // Verify hash
    const expectedHash = await hashString(`${password}-${timestamp}`);
    return hash === expectedHash;
  } catch (e) {
    return false;
  }
}

/**
 * Get cookie value from request
 */
function getCookie(request, name) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const cookie = cookies.find(c => c.startsWith(`${name}=`));
  return cookie ? cookie.split('=')[1] : null;
}

/**
 * Main middleware function
 */
export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  
  // CRITICAL: Allow access to login page and auth endpoints FIRST
  if (url.pathname === '/auth-login.html' || 
      url.pathname === '/auth-login' ||
      url.pathname.startsWith('/auth/')) {
    return next();
  }
  
  // Allow access to static assets (including those from public folder)
  if (url.pathname.startsWith('/_astro/') || 
      url.pathname.endsWith('.css') || 
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.jpeg') ||
      url.pathname.endsWith('.webp') ||
      url.pathname.endsWith('.ico') ||
      url.pathname === '/robots.txt' ||
      url.pathname === '/favicon.svg' ||
      url.pathname.startsWith('/sitemap')) {
    return next();
  }
  
  // Check if SITE_PASSWORD is configured
  const sitePassword = env.SITE_PASSWORD;
  if (!sitePassword) {
    // Password not configured - show error page instead of redirecting
    return new Response('Site password not configured. Please set SITE_PASSWORD environment variable in Cloudflare Pages settings.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
  // Check for valid session
  const sessionToken = getCookie(request, SESSION_COOKIE_NAME);
  
  if (sessionToken) {
    const isValid = await verifySessionToken(sessionToken, sitePassword);
    if (isValid) {
      // Valid session, allow access
      return next();
    }
  }
  
  // No valid session, redirect to login (without .html for clean URLs)
  return Response.redirect(new URL('/auth-login', request.url).toString(), 302);
}
