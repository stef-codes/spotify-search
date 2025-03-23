// File: types/spotify.ts
export interface ExternalUrls {
    spotify: string;
  }
  
  export interface Followers {
    href: string | null;
    total: number;
  }
  
  export interface Image {
    height: number;
    url: string;
    width: number;
  }
  
  export interface Artist {
    external_urls: ExternalUrls;
    followers: Followers;
    genres: string[];
    href: string;
    id: string;
    images: Image[];
    name: string;
    popularity: number;
    type: string;
    uri: string;
  }
  
  export interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
  }
  
  export interface SpotifySearchResponse {
    artists: {
      href: string;
      items: Artist[];
      limit: number;
      next: string | null;
      offset: number;
      previous: string | null;
      total: number;
    }
  }