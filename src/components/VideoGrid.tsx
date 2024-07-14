import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import GridLayout from '@/pages/layout/GridLayout';

interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
}

interface VideoGridProps {
  videos: Video[];
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos }) => {
  if (!videos || videos.length === 0) {
    return <p>No videos available.</p>;
  }

  return (
    <GridLayout columns={4}>
      {videos.map((video) => (
        <Link href={`/videos/${video.id}`} key={video.id}>
          <div className="border rounded-lg overflow-hidden shadow-lg">
            <div className="relative h-48">
              <Image src={video.thumbnailUrl} alt={video.title} layout="fill" objectFit="cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold truncate text-black">{video.title}</h3>
            </div>
          </div>
        </Link>
      ))}
    </GridLayout>
  );
};

export default VideoGrid;
