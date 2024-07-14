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
  try {
    console.log('Extracting video info from URL:', url);
    const { videoId, isShort } = extractVideoInfo(url);
    console.log('Extracted video ID:', videoId, 'Is Short:', isShort);

    console.log('Fetching video details from YouTube API');
    const response = await youtube.videos.list({
      part: ['snippet', 'contentDetails'],
      id: [videoId],
    });

    const videoDetails = response.data.items?.[0];
    if (!videoDetails) {
      console.error('No video details returned from YouTube API');
      throw new Error('no video found on youtube');
    }

    console.log('Video details fetched successfully');
    return {
      url,
      title: videoDetails.snippet?.title || 'Untitled Video',
      description: videoDetails.snippet?.description || 'No description available',
      thumbnailUrl: videoDetails.snippet?.thumbnails?.high?.url || videoDetails.snippet?.thumbnails?.default?.url || '',
      uploadDate: videoDetails.snippet?.publishedAt || new Date().toISOString(),
      isShort,
    };
  } catch (error) {
    console.error('Error in fetchYouTubeVideoDetails:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch video details: ${error.message}`);
    } else {
      throw new Error('An unexpected error occurred while fetching video details');
    }
  }
}
