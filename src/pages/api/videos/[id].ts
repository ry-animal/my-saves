import type { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';
import { extractVideoId, isVideoData, Video } from '../../../lib/videos';
import { getYoutubeVideoDetails } from '@/lib/youtube';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Video ID is required' });
  }

  switch (req.method) {
    case 'GET':
      return handleGet(id, res);
    case 'DELETE':
      return handleDelete(id, res);
    default:
      res.setHeader('Allow', ['GET', 'DELETE']);
      res.status(405).end(`${req.method} not allowed`);
  }
}

async function handleGet(id: string, res: NextApiResponse) {
  try {
    const videoData = await kv.get(`video:${id}`);

    if (!videoData) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (!isVideoData(videoData)) {
      console.error(`Invalid data for id: ${id}`, videoData);
      return res.status(500).json({ error: 'Invalid video data' });
    }

    if (typeof videoData.url === 'string') {
      const youtubeId = extractVideoId(videoData.url);
      const youtubeData = await getYoutubeVideoDetails(youtubeId);
      const updatedVideoData: Video = {
        ...videoData,
        title: youtubeData.title || videoData.title,
        description: youtubeData.description || videoData.description,
        thumbnailUrl: youtubeData.thumbnailUrl || videoData.thumbnailUrl,
        uploadDate: youtubeData.uploadDate || videoData.uploadDate,
      };
      await kv.set(`video:${id}`, updatedVideoData);
      return res.status(200).json(updatedVideoData);
    }

    res.status(200).json(videoData);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
}

async function handleDelete(id: string, res: NextApiResponse) {
  try {
    const videoExists = await kv.exists(`video:${id}`);

    if (!videoExists) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await kv.del(`video:${id}`);
    await kv.lrem('all_videos', 0, id);
    await kv.zrem('video_views', id);

    res.status(200).json({ message: 'Video successfully deleted' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
}
