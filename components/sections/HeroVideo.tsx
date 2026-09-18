"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function HeroVideo({ videoId }: { videoId: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let player: any;

    const init = () => {
      if (cancelled || !holder.current || !window.YT?.Player) return;
      player = new window.YT.Player(holder.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: videoId,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          playsinline: 1,
        },
        events: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onReady: (e: any) => {
            e.target.mute();
            e.target.playVideo();
            const f = e.target.getIframe();
            if (f) {
              f.style.width = "100%";
              f.style.height = "100%";
              f.style.pointerEvents = "none";
            }
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.PLAYING) setPlaying(true);
          },
        },
      });
    };

    if (window.YT?.Player) {
      init();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        init();
      };
      if (!document.getElementById("yt-iframe-api")) {
        const s = document.createElement("script");
        s.id = "yt-iframe-api";
        s.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(s);
      }
    }

    return () => {
      cancelled = true;
      try {
        player?.destroy?.();
      } catch {
        /* noop */
      }
    };
  }, [videoId]);

  return (
    <div className="hero-media pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-ink">
      {/* Live video (cover-sized) */}
      <div className="absolute left-1/2 top-1/2 h-[56.25vw] w-screen min-h-full min-w-full -translate-x-1/2 -translate-y-1/2">
        <div ref={holder} className="h-full w-full" />
      </div>

      {/* Poster still — matches Figma; fades out once playback begins */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: `url(https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg)`,
          opacity: playing ? 0 : 1,
        }}
      />

      {/* Legibility overlays — darker on the left where the copy sits */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/20" />
    </div>
  );
}
