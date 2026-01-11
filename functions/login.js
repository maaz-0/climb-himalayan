/**
 * Login endpoint handler
 * Validates password and sets session cookie
 */

const SESSION_COOKIE_NAME = 'climb_auth_session';

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const formData = await request.formData();
    const password = formData.get('password');
    
    // Get the correct password from environment variable
    const correctPassword = env.SITE_PASSWORD || 'defaultPassword123';
    
    if (password === correctPassword) {
      // Generate a session token (simplified version)
      const sessionToken = `valid_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      // Create response with session cookie
      const response = new Response(
        JSON.stringify({ success: true, message: 'Authentication successful' }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `${SESSION_COOKIE_NAME}=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400` // 24 hours
          }
        }
      );
      
      return response;
    } else {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid password' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Error processing request' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
