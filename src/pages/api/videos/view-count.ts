import { incrementViewCount } from '@/lib/videos';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid video ID' });
  }

  console.log(`Received request to increment view count for video ${id}`);

  try {
    const newViewCount = await incrementViewCount(id);
    console.log(`Successfully incremented view count for video ${id}. New count: ${newViewCount}`);
    res.status(200).json({ viewCount: newViewCount });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    res.status(500).json({ error: 'Failed to increment view count' });
  }
}
