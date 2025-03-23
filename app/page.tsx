// File: app/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { Artist } from '../types/spotify';

export default function Home() {
  const [artistName, setArtistName] = useState<string>('');
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!artistName.trim()) {
      setError('Please enter an artist name.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/search?artist=${encodeURIComponent(artistName)}`);
      const data = await response.json();
      
      if (response.ok) {
        if (data.artist) {
          setArtist(data.artist);
        } else {
          setError('Artist not found.');
        }
      } else {
        setError(data.error || 'An error occurred while searching.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-3xl">
      <main className="min-h-screen py-16 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold mb-8 text-green-500">Spotify Artist Search</h1>
          <div className="bg-red-500 p-10 text-white">Tailwind is Working!</div>

        
        <form onSubmit={handleSearch} className="w-full max-w-md mb-8 flex">
          <input
            type="text"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            placeholder="Enter Artist Name"
            className="flex-1 p-2 text-base border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button 
            type="submit" 
            className={`bg-green-500 text-white p-2 rounded-r-md transition-colors
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-green-600'}`}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}
        
        {artist && (
          <div className="w-full max-w-md border border-gray-200 rounded-lg p-6 shadow-md text-center">
            <h2 className="text-2xl font-bold">{artist.name}</h2>
            {artist.images && artist.images.length > 0 && (
              <img 
                src={artist.images[0].url} 
                alt={artist.name} 
                className="w-48 h-48 rounded-full object-cover mx-auto my-4"
              />
            )}
            <p className="my-2"><span className="font-bold">Popularity:</span> {artist.popularity}/100</p>
            <p className="my-2">
              <span className="font-bold">Genres:</span> {artist.genres && artist.genres.length > 0 
                ? artist.genres.join(', ') 
                : 'N/A'}
            </p>
            <p className="my-2"><span className="font-bold">Followers:</span> {artist.followers.total.toLocaleString()}</p>
            <a 
              href={artist.external_urls.spotify} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Spotify Profile
            </a>
          </div>
        )}
      </main>
    </div>
  );
}