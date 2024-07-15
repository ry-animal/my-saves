import { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Player from '@/components/Player';
import { Video, extractVideoId, getVideoDetails } from '@/lib/videos';
import ErrorPage from '../_error';
import Head from 'next/head';

interface VideoPageProps {
  video: Video | null;
}

const VideoPage: NextPage<VideoPageProps> = ({ video }) => {
  const router = useRouter();

  if (!video) {
    return <ErrorPage statusCode={404} />;
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        const response = await fetch(`/api/videos/${video.id}`, { method: 'DELETE' });
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

  const ytId = extractVideoId(video.url);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://my-saves.vercel.app'; // Replace with your actual base URL
  const fullUrl = `${baseUrl}/videos/${video.id}`;

  return (
    <>
      <Head>
        <title>{`${video.title} | MySaves`}</title>
        <meta name="description" content={video.description || `Watch "${video.title}" on MySaves`} />
        <meta property="og:title" content={`${video.title} | MySaves`} />
        <meta property="og:description" content={video.description || `Watch "${video.title}" on MySaves`} />
        <meta property="og:image" content={video.thumbnailUrl} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:type" content="video.other" />
        <meta property="og:site_name" content="MySaves" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${video.title} | MySaves`} />
        <meta name="twitter:description" content={video.description || `Watch "${video.title}" on MySaves`} />
        <meta name="twitter:image" content={video.thumbnailUrl} />
      </Head>
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
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const video = await getVideoDetails(id);
  return { props: { video } };
};

export default VideoPage;
