import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { kv } from '@vercel/kv';
import { getYoutubeVideoDetails } from './youtube';

export interface Video {
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  isShort: boolean;
  createdAt: string;
}

export async function saveVideo(videoDetails: Omit<Video, 'id' | 'createdAt' | 'views'>) {
  const id = uuidv4();
  const isShort = videoDetails.url.includes('/shorts/');
  const savedVideo: Video = {
    ...videoDetails,
    id,
    isShort,
    createdAt: new Date().toISOString(),
  };

  await kv.set(`video:${id}`, savedVideo);
  await kv.lpush('all_videos', id);
  await kv.zadd('video_views', { score: 0, member: id });

  return savedVideo;
}

export function isVideoData(data: unknown): data is Video {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    'thumbnailUrl' in data &&
    'description' in data &&
    'url' in data &&
    'isShort' in data &&
    'createdAt' in data &&
    'uploadDate' in data
  );
}

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

export async function getVideoDetails(id: string): Promise<Video | null> {
  try {
    const videoData = await kv.get(`video:${id}`);

    if (isVideoData(videoData)) {
      return videoData;
    } else {
      console.error(`Invalid data for id: ${id}`, videoData);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching video details for id ${id}:`, error);
    return null;
  }
}

export async function deleteVideo(id: string) {
  try {
    await kv.del(`video:${id}`);
    await kv.lrem('all_videos', 0, id);
  } catch (error) {
    console.error(`error deleting video ${id}:`, error);
    throw error;
  }
}

export function extractVideoInfo(url: string): { videoId: string; isShort: boolean } {
  const shortRegExp = /^.*(youtu.be\/|youtube.com\/shorts\/)([^#\&\?]*).*/;
  const standardRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

  let match = url.match(shortRegExp);
  if (match && match[2].length === 11) {
    return { videoId: match[2], isShort: true };
  }

  match = url.match(standardRegExp);
  if (match && match[2].length === 11) {
    return { videoId: match[2], isShort: false };
  }

  throw new Error('invalid url');
}

export async function getRandomVideoId(excludeId?: string): Promise<string | null> {
  try {
    const allVideoIds = await kv.lrange('all_videos', 0, -1);
    const availableIds = excludeId ? allVideoIds.filter((id) => id !== excludeId) : allVideoIds;

    if (availableIds.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableIds.length);
    return availableIds[randomIndex];
  } catch (error) {
    console.error('Error getting random video ID:', error);
    return null;
  }
}

export function extractVideoId(url: string): string {
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

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function getAllVideos(page: number, limit: number, random: boolean = false) {
  try {
    const totalCount = await kv.llen('all_videos');
    let videoIds: string[];

    if (random) {
      // For random selection (e.g., home page)
      const allVideoIds = await kv.lrange('all_videos', 0, -1);
      const shuffledIds = shuffleArray(allVideoIds);
      videoIds = shuffledIds.slice(0, limit);
    } else {
      // For ordered selection with pagination (e.g., explore page)
      const start = (page - 1) * limit;
      const end = start + limit - 1;
      videoIds = await kv.lrange('all_videos', start, end);
    }

    const videos = await Promise.all(
      videoIds.map(async (id) => {
        const videoData = await kv.get(`video:${id}`);
        if (isVideoData(videoData)) {
          return videoData;
        } else {
          console.error(`Invalid data for id: ${id}`, videoData);
          return null;
        }
      }),
    );

    const filteredVideos = videos.filter((video): video is Video => video !== null);

    return {
      videos: filteredVideos,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { videos: [], totalCount: 0, totalPages: 1 };
  }
}
