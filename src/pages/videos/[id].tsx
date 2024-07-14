import { GetServerSideProps, NextPage } from 'next';
import { getVideoDetails, Video } from '../../lib/videos';
import Player from '@/components/Player';

interface VideoPageProps {
  video: Video;
}

const VideoPage: NextPage<VideoPageProps> = ({ video }) => {
  const ytVideoId = extractVideoId(video.url);

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-2xl font-bold m-4 flex justify-between">
        <span>{video.title}</span>
        <span>Views: {video.views}</span>
      </h1>
      <Player videoId={ytVideoId} id={video.id} isShort={video.isShort} />
      <p className="mt-4">{video.description}</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const video = await getVideoDetails(id);

  if (!video) {
    return { notFound: true };
  }

  return { props: { video } };
};

function extractVideoId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^\/&#?]{11})/);
  return (match && match[1]) || '';
}

export default VideoPage;
