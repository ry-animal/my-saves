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
    console.log('Fetching YouTube video details for URL:', url);
    const videoDetails = await fetchYouTubeVideoDetails(url);
    console.log('Fetched video details:', videoDetails);

    console.log('Saving video to database');
    const savedVideo = await saveVideo(videoDetails);
    console.log('Saved video:', savedVideo);

    res.status(201).json(savedVideo);
  } catch (error) {
    console.error('Error in handlePost:', error);
    if (error instanceof Error) {
      if (error.message === 'invalid url') {
        res.status(400).json({ error: 'invalid URL' });
      } else if (error.message === 'no video found on youtube') {
        res.status(404).json({ error: 'no video found on youtube' });
      } else {
        console.error('Error submitting video:', error.message);
        res.status(500).json({ error: 'failed to submit video', details: error.message });
      }
    } else {
      console.error('Unexpected error:', error);
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
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'failed to fetch videos' });
  }
}
