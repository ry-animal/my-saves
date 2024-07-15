import type { NextApiRequest, NextApiResponse } from 'next';
import { getRandomVideoId } from '../../../lib/videos';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const randomId = await getRandomVideoId();
    if (randomId) {
      res.status(200).json({ id: randomId });
    } else {
      res.status(404).json({ error: 'No videos available' });
    }
  } catch (error) {
    console.error('Error getting random video:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
