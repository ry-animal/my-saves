import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchYouTubeVideoDetails } from '../utils/yt-helpers';
import { saveVideo, getAllVideos } from '../utils/kv-helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return handlePost(req, res);
    case 'GET':
      return handleGet(req, res);
    default:
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'url is required' });
  }

  try {
    const videoDetails = await fetchYouTubeVideoDetails(url);
    const savedVideo = await saveVideo(videoDetails);
    res.status(201).json(savedVideo);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'invalid url') {
        res.status(400).json({ error: 'invalid URL' });
      } else if (error.message === 'no video found on youtube') {
        res.status(404).json({ error: 'no video found on youtube' });
      } else {
        console.error('error video submit:', error);
        res.status(500).json({ error: 'failed to submit video' });
      }
    } else {
      console.error('unexpected error:', error);
      res.status(500).json({ error: 'unexpected error occurred' });
    }
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  try {
    const { videos, totalCount, totalPages } = await getAllVideos(page, limit);
    res.status(200).json({
      videos,
      totalCount,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error('error fetching videos:', error);
    res.status(500).json({ error: 'failed fetch videos' });
  }
}
