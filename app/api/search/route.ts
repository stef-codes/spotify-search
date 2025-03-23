// File: app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Artist } from '@/types/spotify';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  
  if (!artist) {
    return NextResponse.json(
      { error: 'Artist name is required' },
      { status: 400 }
    );
  }

  try {
    // Get access token
    const token = await getSpotifyToken();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Failed to authenticate with Spotify API' },
        { status: 500 }
      );
    }

    // Search for artist
    const artistData = await searchArtist(token, artist);
    
    if (!artistData) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ artist: artistData });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching data from Spotify' },
      { status: 500 }
    );
  }
}

async function getSpotifyToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials are not configured');
  }

  const authString = `${clientId}:${clientSecret}`;
  const authBase64 = Buffer.from(authString).toString('base64');
  
  try {
    const response = await fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authBase64}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get token: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Token error:', error);
    return null;
  }
}

async function searchArtist(token: string, artistName: string): Promise<Artist | null> {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.artists.items.length > 0) {
      return data.artists.items[0] as Artist;
    }
    
    return null;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}