import { kv } from '@vercel/kv';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveVideo(videoDetails: any) {
  const savedVideo = {
    ...videoDetails,
    createdAt: new Date().toISOString(),
  };

  await kv.set(`video:${savedVideo.id}`, savedVideo);
  await kv.lpush('all_videos', savedVideo.id);

  return savedVideo;
}

export async function getAllVideos(page: number, limit: number) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const videoIds = await kv.lrange('all_videos', start, end);
  const totalCount = await kv.llen('all_videos');

  const videos = await Promise.all(
    videoIds.map(async (id) => {
      const videoData = await kv.get(`video:${id}`);
      return videoData;
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
