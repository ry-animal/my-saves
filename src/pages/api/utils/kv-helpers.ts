import { kv } from '@vercel/kv';
import { v4 as uuid4 } from 'uuid';

export async function saveVideo(url: string) {
  try {
    const response = await fetch(`/api/video-details?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }
    const videoDetails = await response.json();

    const id = uuid4();
    const savedVideo = {
      ...videoDetails,
      id,
      createdAt: new Date().toISOString(),
      views: 0,
    };

    await kv.set(`video:${id}`, savedVideo);
    await kv.lpush('all_videos', id);
    await kv.zadd('video_views', { score: 0, member: id });

    return savedVideo;
  } catch (error) {
    console.error('Error saving video:', error);
    throw error;
  }
}

export async function getVideoDetails(id: string) {
  const videoData = await kv.get(`video:${id}`);
  if (!videoData) {
    throw new Error('Video not found');
  }
  return videoData;
}
