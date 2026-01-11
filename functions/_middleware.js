/**
 * Cloudflare Pages Functions Middleware
 * Implements password protection for the entire site
 */

const SESSION_COOKIE_NAME = 'climb_auth_session';
const SESSION_SECRET = 'climb_himalayan_session'; // In production, this would be more secure

// Simple session validation - checks if session cookie exists and is valid
function isValidSession(request) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return false;
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  
  const sessionToken = cookies[SESSION_COOKIE_NAME];
  if (!sessionToken) return false;
  
  // Simple validation - in production you'd want to verify the token properly
  // For now, we just check if it matches our expected pattern
  return sessionToken.startsWith('valid_');
}

// Middleware that runs on every request
export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  
  // Allow access to login page and login endpoint without authentication
  if (url.pathname === '/auth-login.html' || url.pathname === '/login') {
    return next();
  }
  
  // Allow access to assets (CSS, JS, images, etc.)
  if (url.pathname.startsWith('/_astro/') || 
      url.pathname.startsWith('/favicon.') ||
      url.pathname.match(/\.(css|js|jpg|jpeg|png|gif|svg|ico|webp)$/)) {
    return next();
  }
  
  // Check if user has valid session
  if (isValidSession(request)) {
    return next();
  }
  
  // Redirect to login page
  return Response.redirect(new URL('/auth-login.html', request.url), 302);
}
