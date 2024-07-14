import { Video } from '@/lib/videos';
import { kv } from '@vercel/kv';
import { v4 as uuid4 } from 'uuid';

export async function saveVideo(videoDetails: Omit<Video, 'id' | 'createdAt' | 'views'>) {
  const id = uuid4();
  const savedVideo: Video = {
    ...videoDetails,
    id,
    createdAt: new Date().toISOString(),
    views: 0,
  };

  await kv.set(`video:${id}`, savedVideo);
  await kv.lpush('all_videos', id);
  await kv.zadd('video_views', { score: 0, member: id });

  return savedVideo;
}

export async function getAllVideos(page: number, limit: number) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const videoIds = await kv.lrange('all_videos', start, end);
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
}

export async function getVideoDetails(id: string) {
  const videoData = await kv.get(`video:${id}`);
  if (!videoData) {
    throw new Error('Video not found');
  }
  return videoData;
}
