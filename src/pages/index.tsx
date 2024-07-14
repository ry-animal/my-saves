import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import SEO from '../components/SEO';
import VideoGrid from '../components/VideoGrid';
import { getAllVideos } from './api/utils/kv-helpers';

interface HomeProps {
  videos: Array<{
    id: string;
    title: string;
    thumbnailUrl: string;
  }>;
}

const Home: NextPage<HomeProps> = ({ videos }) => {
  return (
    <>
      <SEO
        title="MySaves - Save and Share YouTube Videos"
        description="Save, share, and stream your favorite YouTube videos in one place."
        ogImage="/og-home.jpg"
        ogUrl="/"
      />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Recently Saved Videos</h1>
        <VideoGrid videos={videos} />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const { videos } = await getAllVideos(1, 8);
    return { props: { videos } };
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { props: { videos: [] } };
  }
};

export default Home;
