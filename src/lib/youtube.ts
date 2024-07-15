/* eslint-disable @typescript-eslint/no-explicit-any */
import { google } from 'googleapis';

let youtube: any;

if (typeof window === 'undefined') {
  youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
  });
}

export async function getYoutubeVideoDetails(videoId: string) {
  if (typeof window !== 'undefined') {
    throw new Error('YouTube API can only be used on the server side');
  }

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
