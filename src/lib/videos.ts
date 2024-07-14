import { v4 as uuidv4 } from 'uuid';
import { kv } from '@vercel/kv';
import { google } from 'googleapis';

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

export async function saveVideo(videoDetails: Omit<Video, 'id' | 'createdAt'>) {
  const id = uuidv4();
  const savedVideo: Video = {
    ...videoDetails,
    id,
    createdAt: new Date().toISOString(),
  };

  await kv.set(`video:${id}`, savedVideo);
  await kv.lpush('all_videos', id);
  await kv.zadd('video_views', { score: 0, member: id });

  return savedVideo;
}

function isVideoData(data: unknown): data is Video {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    'thumbnailUrl' in data &&
    'description' in data &&
    'url' in data &&
    'isShort' in data &&
    'createdAt' in data
  );
}

export const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export async function getAllVideos(page: number, limit: number, sortBy: 'views' | 'date' = 'date') {
  try {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let videoIds: string[];
    if (sortBy === 'views') {
      videoIds = await kv.zrange('video_views', 0, -1, { rev: true });
      videoIds = videoIds.slice(start, end + 1);
    } else {
      videoIds = await kv.lrange('all_videos', start, end);
    }

    const totalCount = await kv.llen('all_videos');

    const videos = await Promise.all(
      videoIds.map(async (id) => {
        const videoData = (await kv.get(`video:${id}`)) as Video | null;
        const viewsData = await kv.get(`views:${id}`);
        const views =
          typeof viewsData === 'number' ? viewsData : typeof viewsData === 'string' ? parseInt(viewsData, 10) : 0;

        if (videoData) {
          return { ...videoData, views };
        } else {
          console.error(`Invalid video data for id: ${id}`, videoData);
          return null;
        }
      }),
    );

    const filteredVideos = videos.filter((video): video is NonNullable<typeof video> => video !== null);

    return {
      videos: filteredVideos,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { videos: [], totalCount: 0, totalPages: 0 };
  }
}

export async function getVideoDetails(id: string): Promise<(Video & { views: number }) | null> {
  const videoData = await kv.get(`video:${id}`);
  const viewsData = await kv.get(`views:${id}`);

  const views = typeof viewsData === 'number' ? viewsData : typeof viewsData === 'string' ? parseInt(viewsData, 10) : 0;

  if (isVideoData(videoData)) {
    return { ...videoData, views };
  } else {
    console.error(`invalid data for id: ${id}`, videoData);
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
