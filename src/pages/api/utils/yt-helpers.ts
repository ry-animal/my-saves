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
  const { videoId, isShort } = extractVideoInfo(url);

  const response = await youtube.videos.list({
    part: ['snippet'],
    id: [videoId],
  });

  const videoDetails = response.data.items?.[0];
  if (!videoDetails) {
    throw new Error('Video not found on YouTube');
  }

  return {
    id: videoId,
    url,
    title: videoDetails.snippet?.title,
    description: videoDetails.snippet?.description,
    thumbnailUrl: videoDetails.snippet?.thumbnails?.high?.url,
    uploadDate: videoDetails.snippet?.publishedAt,
    isShort,
  };
}
