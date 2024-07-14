import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
}

interface GetServerSidePropsProps {
  videos: Video[];
}

const GetServerSideProps: React.FC<GetServerSidePropsProps> = ({ videos }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
    </div>
  );
};

export default GetServerSideProps;
