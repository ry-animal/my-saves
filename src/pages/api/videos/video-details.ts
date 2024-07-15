import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const videoId = extractVideoId(url);
    const response = await youtube.videos.list({
      part: ['snippet'],
      id: [videoId],
    });

    const videoDetails = response.data.items?.[0]?.snippet;
    if (!videoDetails) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.status(200).json({
      id: videoId,
      url,
      title: videoDetails.title,
      description: videoDetails.description,
      thumbnailUrl: videoDetails.thumbnails?.high?.url || videoDetails.thumbnails?.default?.url,
      uploadDate: videoDetails.publishedAt,
      isShort: url.includes('/shorts/'),
    });
  } catch (error) {
    console.error('Error fetching video details:', error);
    res.status(500).json({ error: 'Failed to fetch video details' });
  }
}

function extractVideoId(url: string): string {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^/?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^/?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^/?]+)/,
    /(?:https?:\/\/)?youtu\.be\/([^/?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  throw new Error('Could not extract video ID from URL');
}
