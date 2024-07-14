import type { NextPage } from 'next';
import SEO from '../components/SEO';
import GridLayout from './layout/GridLayout';
import { getAllVideos } from './api/utils/kv-helpers';

interface HomePageProps {
  videos: Array<{
    id: string;
    title: string;
    thumbnailUrl: string;
    views?: number;
  }>;
}

const Home: NextPage<HomePageProps> = ({ videos }) => {
  return (
    <>
      <SEO
        title="Save and Share YouTube Videos"
        description="MySaves allows you to save, share, and stream your favorite YouTube videos in one place."
        ogImage="/og-home.jpg"
        ogUrl="/"
      />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-black">Recent Videos</h1>
        <GridLayout videos={videos} />
      </main>
    </>
  );
};

export async function getServerSideProps() {
  const { videos } = await getAllVideos(1, 12); // Fetch first 12 videos
  return { props: { videos } };
}

export default Home;
