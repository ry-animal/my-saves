import type { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'video id required' });
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
    const videoString = await kv.get(`video:${id}`);

    if (!videoString) {
      return res.status(404).json({ error: 'no video found' });
    }

    const video = JSON.parse(videoString as string);

    await kv.incr(`views:${id}`);
    const views = await kv.get(`views:${id}`);

    res.status(200).json({
      ...video,
      views: views || 0,
    });
  } catch (error) {
    console.error('error fetching video:', error);
    res.status(500).json({ error: 'failed fetching video' });
  }
}

async function handleDelete(id: string, res: NextApiResponse) {
  try {
    const videoExists = await kv.exists(`video:${id}`);

    if (!videoExists) {
      return res.status(404).json({ error: 'no video found' });
    }

    await kv.del(`video:${id}`);
    await kv.del(`views:${id}`);
    await kv.lrem('all_videos', 0, id);

    res.status(200).json({ message: 'video successfully deleted' });
  } catch (error) {
    console.error('error deleting video:', error);
    res.status(500).json({ error: 'video failed to delete' });
  }
}
