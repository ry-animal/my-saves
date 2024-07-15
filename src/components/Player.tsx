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
  const playerInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initializePlayer = () => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.loadVideoById({
          videoId: videoId,
          startSeconds: 0,
        });
      } else {
        playerInstanceRef.current = new window.YT.Player(playerRef.current, {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            playsinline: 1,
            loop: isShort ? 1 : 0,
            playlist: isShort ? videoId : undefined,
            mute: 1,
          },
          events: {
            onReady: (event: any) => {
              event.target.unMute();
              event.target.playVideo();
            },
            onError: (event: any) => {
              console.error('YouTube Player Error:', event.data);
            },
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
        playerInstanceRef.current = null;
      }
    };
  }, [videoId, isShort]);

  return (
    <div className={`relative ${isShort ? 'aspect-[9/16] max-w-sm' : 'aspect-video'} w-full mx-auto`}>
      <div ref={playerRef} className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
};

export default Player;
