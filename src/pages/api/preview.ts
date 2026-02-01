import type { APIRoute } from 'astro';

export const prerender = false; // SSR endpoint

// Preview activation endpoint
export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    // Parse request body
    const contentType = request.headers.get('content-type');
    let body: Record<string, unknown>;

    if (contentType?.includes('application/json')) {
      body = await request.json();
    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries());
    } else {
      return new Response(
        JSON.stringify({
          error:
            'Invalid content type. Expected application/json or application/x-www-form-urlencoded',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { secret, slug, contentType: type } = body as Record<string, string>;

    // Validate required parameters
    if (!secret) {
      return new Response(JSON.stringify({ error: 'Preview secret is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Content slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate preview secret
    const expectedSecret = process.env.CONTENTFUL_PREVIEW_SECRET || 'mock-preview-secret';
    if (secret !== expectedSecret) {
      console.warn('Invalid preview secret attempt:', {
        provided: `${(secret as string)?.substring(0, 4)}...`,
        timestamp: new Date().toISOString(),
      });

      return new Response(JSON.stringify({ error: 'Invalid preview secret' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate content type
    const validContentTypes = ['blog', 'guide'];
    const contentTypeToUse = type || 'blog'; // Default to blog if not specified

    if (!validContentTypes.includes(contentTypeToUse)) {
      return new Response(
        JSON.stringify({
          error: `Invalid content type. Must be one of: ${validContentTypes.join(', ')}`,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Set secure preview cookie
    cookies.set('preview', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    // Set additional metadata cookie for tracking
    cookies.set(
      'preview-meta',
      JSON.stringify({
        contentType: contentTypeToUse,
        slug,
        activatedAt: new Date().toISOString(),
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60, // 1 hour
        path: '/',
      }
    );

    // Log successful preview activation (for debugging)
    console.log('Preview mode activated:', {
      contentType: contentTypeToUse,
      slug,
      timestamp: new Date().toISOString(),
    });

    // Redirect to preview page
    const previewUrl = `/preview/${contentTypeToUse}/${slug}`;

    // Return JSON response for API clients or redirect for browser requests
    const acceptHeader = request.headers.get('accept');
    if (acceptHeader?.includes('application/json')) {
      return new Response(
        JSON.stringify({
          success: true,
          previewUrl,
          message: 'Preview mode activated successfully',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    return redirect(previewUrl, 302);
  } catch (error) {
    console.error('Preview activation error:', error);

    return new Response(
      JSON.stringify({
        error: 'Preview activation failed',
        message: 'An internal error occurred while activating preview mode',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// Preview deactivation endpoint
export const DELETE: APIRoute = async ({ cookies }) => {
  try {
    // Clear preview cookies
    cookies.delete('preview', { path: '/' });
    cookies.delete('preview-meta', { path: '/' });

    console.log('Preview mode deactivated:', {
      timestamp: new Date().toISOString(),
    });

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Preview mode deactivated successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Preview deactivation error:', error);

    return new Response(
      JSON.stringify({
        error: 'Preview deactivation failed',
        message: 'An internal error occurred while deactivating preview mode',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// Preview status check endpoint
export const GET: APIRoute = async ({ cookies }) => {
  try {
    const previewCookie = cookies.get('preview');
    const previewMetaCookie = cookies.get('preview-meta');

    const isActive = previewCookie?.value === 'true';
    let metadata = null;

    if (isActive && previewMetaCookie?.value) {
      try {
        metadata = JSON.parse(previewMetaCookie.value);
      } catch (parseError) {
        console.warn('Failed to parse preview metadata cookie:', parseError);
      }
    }

    return new Response(
      JSON.stringify({
        active: isActive,
        metadata,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Preview status check error:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to check preview status',
        active: false,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// Handle unsupported methods
export const GET_FALLBACK: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      error: 'Method not allowed',
      allowedMethods: ['GET', 'POST', 'DELETE'],
    }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        Allow: 'GET, POST, DELETE',
      },
    }
  );
};

// Export fallback for other HTTP methods
export const PUT = GET_FALLBACK;
export const PATCH = GET_FALLBACK;
export const HEAD = GET_FALLBACK;
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      Allow: 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};
