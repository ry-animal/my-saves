import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export function extractVideoInfo(url: string): { videoId: string; isShort: boolean } {
  const shortRegExp = /^.*(youtu.be\/|youtube.com\/shorts\/)([^#\&\?]*).*/;
  const standardRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

  let match = url.match(shortRegExp);
  if (match && match[2].length === 11) {
    return { videoId: match[2], isShort: true };
  }

  match = url.match(standardRegExp);
  if (match && match[2].length === 11) {
    return { videoId: match[2], isShort: false };
  }

  throw new Error('Invalid YouTube URL');
}

export async function fetchYouTubeVideoDetails(url: string) {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error('invalid url');
  }

  const response = await youtube.videos.list({
    part: ['snippet'],
    id: [videoId],
  });

  const videoDetails = response.data.items?.[0]?.snippet;
  if (!videoDetails) {
    throw new Error('no video found on youtube');
  }

  return {
    url,
    title: videoDetails.title || 'Untitled Video',
    description: videoDetails.description || 'no description',
    thumbnailUrl: videoDetails.thumbnails?.high?.url || videoDetails.thumbnails?.default?.url || '',
    uploadDate: videoDetails.publishedAt || new Date().toISOString(),
    isShort: url.includes('/shorts/'),
  };
}

function extractVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}
