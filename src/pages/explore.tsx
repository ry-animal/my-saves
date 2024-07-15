import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';
import VideoGrid from '../components/VideoGrid';
import { getAllVideos, Video } from '../lib/videos';

interface ExploreProps {
  videos: Array<Video>;
  currentPage: number;
  totalPages: number;
}

const Explore: NextPage<ExploreProps> = ({ videos, currentPage, totalPages }) => {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/explore?page=${page}`);
  };

  return (
    <>
      <SEO
        title="Explore Videos - MySaves"
        description="Explore all saved videos on MySaves."
        ogImage="/og-explore.jpg"
        ogUrl="/explore"
      />
      <main className="container mx-auto px-4 py-8 text-white">
        <h1 className="text-3xl font-bold mb-6">Explore All Videos</h1>
        {videos.length > 0 ? <VideoGrid videos={videos} /> : <p>No videos available. Start by adding some!</p>}
        <div className="mt-8 flex justify-center space-x-4">
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Previous
            </button>
          )}
          <span className="py-2">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Next
            </button>
          )}
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = Number(context.query.page) || 1;
  const limit = 12;

  try {
    const { videos, totalPages } = await getAllVideos(page, limit);
    return {
      props: {
        videos,
        currentPage: page,
        totalPages,
      },
    };
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { props: { videos: [], currentPage: 1, totalPages: 1 } };
  }
};

export default Explore;
