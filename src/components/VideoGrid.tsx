import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import GridLayout from '@/pages/layout/GridLayout';
import { Video } from '@/lib/videos';

interface VideoGridProps {
  videos: Video[];
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos }) => {
  if (!videos || videos.length === 0) {
    return <p className="text-black">No videos available.</p>;
  }

  return (
    <GridLayout columns={3}>
      {videos.map((video) => (
        <Link href={`/videos/${video.id}`} key={video.id}>
          <div className="border rounded-lg overflow-hidden shadow-lg m-4">
            <div className="relative h-48">
              <Image src={video.thumbnailUrl} alt={video.title} layout="fill" objectFit="cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold truncate text-black">{video.title}</h3>

              <h3 className="text-lg font-semibold truncate text-black">Views: {video.views}</h3>
            </div>
          </div>
        </Link>
      ))}
    </GridLayout>
  );
};

export default VideoGrid;
