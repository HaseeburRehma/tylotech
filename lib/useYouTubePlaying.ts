"use client";

import { useEffect, useState, type RefObject } from "react";

/** True once the embedded YouTube player (src needs `enablejsapi=1`) reports
 *  that it is actually playing. Lets a poster stay on top when autoplay is
 *  blocked (e.g. iOS Low Power Mode) instead of revealing YouTube's paused UI. */
export function useYouTubePlaying(iframe: RefObject<HTMLIFrameElement | null>, active = true) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!active) return;
    const el = iframe.current;
    if (!el) return;

    const onMessage = (e: MessageEvent) => {
      if (e.source !== el.contentWindow || !/youtube(-nocookie)?\.com$/.test(new URL(e.origin).hostname)) return;
      let data: { event?: string; info?: unknown };
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      const state =
        data?.event === "onStateChange"
          ? data.info
          : data?.event === "infoDelivery" && data.info && typeof data.info === "object"
            ? (data.info as { playerState?: number }).playerState
            : undefined;
      if (state === 1) setPlaying(true);
    };

    // ask the player to start sending events (what the official iframe API does)
    const listen = () => el.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), "*");
    window.addEventListener("message", onMessage);
    el.addEventListener("load", listen);
    listen();
    const retry = window.setInterval(listen, 1000);
    const stop = window.setTimeout(() => window.clearInterval(retry), 10000);
    return () => {
      window.removeEventListener("message", onMessage);
      el.removeEventListener("load", listen);
      window.clearInterval(retry);
      window.clearTimeout(stop);
    };
  }, [iframe, active]);

  return playing;
}
