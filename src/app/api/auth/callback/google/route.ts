import { NextResponse } from 'next/server';
import { getOAuthClient } from '@/lib/googleSheets';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'No authorization code provided' },
        { status: 400 }
      );
    }

    // Exchange the code for tokens
    const auth = await getOAuthClient(code);
    const tokens = auth.credentials;

    // Store the tokens in an HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set('google_tokens', JSON.stringify(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 // 1 hour
    });

    // Redirect back to the main page with a success message
    return NextResponse.redirect(new URL('/?auth=success', request.url));
  } catch (error) {
    console.error('Error in Google callback:', error);
    return NextResponse.redirect(new URL('/?auth=error', request.url));
  }
} 