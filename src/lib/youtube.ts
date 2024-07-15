import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export async function getYoutubeVideoDetails(videoId: string) {
  try {
    const response = await youtube.videos.list({
      part: ['snippet'],
      id: [videoId],
    });

    const videoDetails = response.data.items?.[0]?.snippet;
    if (!videoDetails) {
      throw new Error('Video not found');
    }

    return {
      title: videoDetails.title || 'Untitled',
      description: videoDetails.description || 'No description available',
      thumbnailUrl: videoDetails.thumbnails?.high?.url || videoDetails.thumbnails?.default?.url || '',
      uploadDate: videoDetails.publishedAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching YouTube video details:', error);
    throw error;
  }
}
