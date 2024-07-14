/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

interface PlayerProps {
  videoId: string;
  id: string; // This is the ID of your video in your database
  isShort: boolean;
}

const Player: React.FC<PlayerProps> = ({ videoId, id, isShort }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player(playerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          playsinline: 1,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING && !hasStartedPlaying) {
              setHasStartedPlaying(true);
              incrementViewCount();
            }
          },
          onError: (event: any) => {
            console.error('YouTube Player Error:', event.data);
          },
        },
      });
    };
  }, [videoId, id, hasStartedPlaying]);

  const incrementViewCount = async () => {
    try {
      console.log(`sending request to increment view count for video ${id}`);
      const response = await fetch(`/api/videos/${id}/view-count`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to increment view count');
      }
      const data = await response.json();
      console.log('Response from increment view API:', data);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  return (
    <div className={`relative ${isShort ? 'aspect-[9/16] max-w-sm' : 'aspect-video'} w-full mx-auto`}>
      <div ref={playerRef} className="absolute top-0 left-0 w-full h-full"></div>
    </div>
  );
};

export default Player;
