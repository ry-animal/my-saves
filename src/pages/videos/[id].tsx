import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getVideoDetails, Video } from '../../lib/videos';
import SEO from '../../components/SEO';
import VideoPlayer from '../../components/Player';

interface VideoPageProps {
  video: Video;
}

const VideoPage: NextPage<VideoPageProps> = ({ video }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SEO
        title={video.title}
        description={video.description}
        ogImage={video.thumbnailUrl}
        ogUrl={`/videos/${video.id}`}
      />
      <div className="container mx-auto px-4 py-8 text-black">
        <h1 className="text-3xl font-bold mb-6">{video.title}</h1>
        <div className="mb-8">
          <VideoPlayer videoId={video.id} isShort={video.isShort} title={video.title} />
        </div>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{video.description}</p>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const video = await getVideoDetails(id);
    return { props: { video } };
  } catch (error) {
    console.error('error fetching video:', error);
    return { notFound: true };
  }
};

export default VideoPage;
