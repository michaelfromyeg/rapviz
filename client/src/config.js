const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const serverEndpoint = isDevelopment ? "http://localhost:5000" : "https://rapviz-production.up.railway.app";

export const authEndpoint = "https://accounts.spotify.com/authorize";

// Replace with your app's client ID, redirect URI and desired scopes
export const clientId = "9f19d3f83c3a493cadd7f4cf1ab8661d";
export const redirectUri = isDevelopment ? "http://localhost:3000/" : "https://michaelfromyeg.github.io/rapviz/";
export const scopes = [
  "user-top-read",
  "user-read-currently-playing",
  "user-read-playback-state",
];
