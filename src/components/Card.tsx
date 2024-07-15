import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
}

const Card: React.FC<CardProps> = ({ id, title, thumbnailUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-110">
      <Link href={`/videos/${id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={thumbnailUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="transition-opacity duration-300 hover:opacity-75"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h3>
        </div>
      </Link>
    </div>
  );
};

export default Card;
