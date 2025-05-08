import { NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/googleSheets';

export async function GET(request: Request) {
  try {
    // Get the current URL to check if we're in development or production
    const url = new URL(request.url);
    const isLocalhost = url.hostname === 'localhost';
    
    // Generate the auth URL with the correct redirect URI
    const authUrl = getAuthUrl();
    
    // Redirect to Google's OAuth page
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error in Google auth route:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 