import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import SEO from '../components/SEO';
import VideoGrid from '../components/VideoGrid';
import { getAllVideos, Video } from '../lib/videos';

interface HomeProps {
  videos: Array<Video>;
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
      <main className="container mx-auto px-4 py-8 text-black">
        <h1 className="text-3xl font-bold mb-6">Top 6 Most Viewed Videos</h1>
        {videos.length > 0 ? <VideoGrid videos={videos} /> : <p>No videos available. Start by adding some!</p>}
        <div className="mt-8 text-center">
          <Link href="/explore" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Explore All Videos
          </Link>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const { videos } = await getAllVideos(1, 6, 'views');
    return { props: { videos } };
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { props: { videos: [] } };
  }
};

export default Home;
