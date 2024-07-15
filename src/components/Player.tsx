/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';

interface PlayerProps {
  videoId: string;
  isShort: boolean;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const Player: React.FC<PlayerProps> = ({ videoId, isShort }) => {
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    console.log('videoId', videoId);

    const initializePlayer = () => {
      new window.YT.Player(playerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          playsinline: 1,
          loop: isShort ? 1 : 0,
          playlist: isShort ? videoId : undefined,
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo();
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      window.onYouTubeIframeAPIReady = () => {};
    };
  }, [videoId, isShort]);

  return (
    <div className={`relative ${isShort ? 'aspect-[9/16] max-w-sm' : 'aspect-video'} w-full mx-auto`}>
      <div ref={playerRef} className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
};

export default Player;
