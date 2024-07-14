import React from 'react';

interface PlayerProps {
  videoId: string;
  isShort: boolean;
  title: string;
}

const Player: React.FC<PlayerProps> = ({ videoId, isShort, title }) => {
  const wrapperClass = isShort ? 'w-full max-w-sm mx-auto aspect-[9/16]' : 'w-full max-w-4xl mx-auto aspect-video';

  return (
    <div className={`relative text-black ${wrapperClass}`} style={{ minHeight: '360px' }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
      />
    </div>
  );
};

export default Player;
