import Head from 'next/head';

interface VideoStructuredDataProps {
  video: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
  };
}

const VideoStructuredData: React.FC<VideoStructuredDataProps> = ({ video }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    contentUrl: `https://my-saves-seven.vercel.app/videos/${video.id}`,
  };

  return (
    <Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </Head>
  );
};

export default VideoStructuredData;
