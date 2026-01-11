/**
 * Login endpoint for password verification
 * POST /auth/login with { password: "..." }
 */

const SESSION_COOKIE_NAME = 'climb_auth_session';
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
 * Handle POST request for login
 */
export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const contentType = request.headers.get('content-type');
    let password;
    
    // Handle both JSON and form data
    if (contentType?.includes('application/json')) {
      const body = await request.json();
      password = body.password;
    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      password = formData.get('password');
    } else {
      return new Response(JSON.stringify({ error: 'Invalid content type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Verify password
    const sitePassword = env.SITE_PASSWORD;
    
    if (!sitePassword) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (password === sitePassword) {
      // Password correct, create session
      const sessionToken = await createSessionToken(sitePassword);
      
      // Set secure cookie and redirect
      const cookieValue = `${SESSION_COOKIE_NAME}=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DURATION}`;
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookieValue
        }
      });
    } else {
      // Password incorrect
      return new Response(JSON.stringify({ error: 'Invalid password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
