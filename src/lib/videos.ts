import { kv } from '@vercel/kv';
import { google } from 'googleapis';

export const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export async function getAllVideoIds(): Promise<string[]> {
  try {
    return await kv.lrange('all_videos', 0, -1);
  } catch (error) {
    console.error('error fetching IDs:', error);
    return [];
  }
}

export async function getVideoDetails(id: string) {
  const video = await kv.get(`video:${id}`);
  if (!video) {
    throw new Error('no video found');
  }
  return video;
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

// export async function searchVideos(query: string, page: number = 1, limit: number = 20) {
//   try {
//     const allVideoIds = await getAllVideoIds();
//     const matchingVideos = [];

//     for (const id of allVideoIds) {
//       const video = await getVideoDetails(id);
//       if (video.title.toLowerCase().includes(query.toLowerCase())) {
//         matchingVideos.push(video);
//       }
//     }

//     const start = (page - 1) * limit;
//     const end = start + limit;
//     const paginatedVideos = matchingVideos.slice(start, end);

//     return {
//       videos: paginatedVideos,
//       totalCount: matchingVideos.length,
//       totalPages: Math.ceil(matchingVideos.length / limit),
//     };
//   } catch (error) {
//     console.error('error searching:', error);
//     throw error;
//   }
// }

export async function saveVideo(videoDetails: any) {
  const savedVideo = {
    ...videoDetails,
    isShort: videoDetails.url.includes('/shorts/'),
    createdAt: new Date().toISOString(),
  };

  await kv.set(`video:${savedVideo.id}`, savedVideo);
  await kv.lpush('all_videos', savedVideo.id);

  return savedVideo;
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
