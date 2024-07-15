import type { NextApiRequest, NextApiResponse } from 'next';
import { saveVideo, extractVideoInfo } from '../../../lib/videos';
import { getYoutubeVideoDetails } from '@/lib/youtube';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      const { videoId, isShort } = extractVideoInfo(url);
      const youtubeData = await getYoutubeVideoDetails(videoId);

      const videoDetails = {
        url,
        title: youtubeData.title,
        description: youtubeData.description,
        thumbnailUrl: youtubeData.thumbnailUrl,
        uploadDate: youtubeData.uploadDate,
        isShort,
      };

      const savedVideo = await saveVideo(videoDetails);
      res.status(201).json(savedVideo);
    } catch (error) {
      console.error('Error submitting video:', error);
      res.status(500).json({ error: 'Failed to submit video' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
