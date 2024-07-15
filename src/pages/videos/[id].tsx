import Player from '@/components/Player';
import { extractVideoId, Video } from '@/lib/videos';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import ErrorPage from '../_error';

const VideoPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState<{ statusCode: number } | null>(null);

  const fetchVideoDetails = useCallback(async () => {
    if (typeof id !== 'string') return;

    try {
      const response = await fetch(`/api/videos/${id}`);
      if (response.ok) {
        const data = await response.json();
        setVideo(data);
      } else {
        setError({ statusCode: response.status });
      }
    } catch (error) {
      console.error('Error fetching video details:', error);
      setError({ statusCode: 500 });
    }
  }, [id]);

  useEffect(() => {
    fetchVideoDetails();
  }, [fetchVideoDetails]);

  const handleDelete = async () => {
    if (!id || typeof id !== 'string') return;

    if (confirm('Are you sure you want to delete this video?')) {
      try {
        const response = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
        if (response.ok) {
          router.push('/');
        } else {
          throw new Error('Failed to delete video');
        }
      } catch (error) {
        console.error('Failed to delete video:', error);
        alert('Failed to delete video. Please try again.');
      }
    }
  };

  const handleNextVideo = async () => {
    try {
      const response = await fetch('/api/videos/random');
      if (response.ok) {
        const { id: nextVideoId } = await response.json();
        if (nextVideoId) {
          router.push(`/videos/${nextVideoId}`);
        } else {
          alert('No more videos available.');
        }
      } else {
        throw new Error('Failed to get next video');
      }
    } catch (error) {
      console.error('Error getting next video:', error);
      alert('Failed to get next video. Please try again.');
    }
  };

  if (error) {
    return <ErrorPage statusCode={error.statusCode} />;
  }

  if (!video) {
    return <div>Loading...</div>;
  }

  let ytId;
  try {
    ytId = extractVideoId(video.url);
  } catch (err) {
    console.error('Failed to extract video ID:', err);
    return <ErrorPage statusCode={400} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
      <Player videoId={ytId} isShort={video.isShort} />
      {video.description && <p className="mt-4">{video.description}</p>}
      <div className="mt-4 space-x-4 font-broadway flex justify-between items-center text-xl md:text-xxl">
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
        >
          Delete Video
        </button>
        <button
          onClick={handleNextVideo}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
        >
          Stumble Videos
        </button>
      </div>
    </div>
  );
};

export default VideoPage;
