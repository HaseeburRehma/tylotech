"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Pause, Play } from "lucide-react";
import { useT } from "../i18n/LocaleProvider";

export type Voice = {
  src: string;
  /** seconds, shown before the file has loaded (preload="none") */
  duration: number;
  /** bar heights 0–1, precomputed from the recording */
  peaks: number[];
  label: { de: string; en: string };
};

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** WhatsApp-style voice message: play button, waveform that fills as it plays, click to seek. */
export default function VoiceNote({ voice }: { voice: Voice }) {
  const t = useT();
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const total = voice.duration;
  const progress = time / total;

  useEffect(() => {
    const a = audio.current;
    return () => a?.pause();
  }, []);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) void a.play();
    else a.pause();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audio.current;
    if (!a) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1) * total;
    setTime(a.currentTime);
    if (a.paused) void a.play();
  };

  return (
    <div className="flex w-full max-w-[400px] items-center gap-3 rounded-full border border-[#efe2cb] bg-white py-1.5 pl-1.5 pr-4 shadow-[0_1px_0_rgba(15,14,13,0.02)]">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? t("Sprachnachricht pausieren", "Pause voice message") : t("Sprachnachricht abspielen", "Play voice message")}
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#b98f53] text-white transition-colors hover:bg-[#a07d45]"
      >
        {playing ? <Pause className="size-4" fill="currentColor" aria-hidden /> : <Play className="ml-0.5 size-4" fill="currentColor" aria-hidden />}
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-center gap-1.5 truncate font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-[#94713f] sm:tracking-[0.12em]">
          <Mic className="size-3 shrink-0" aria-hidden />
          {t(voice.label.de, voice.label.en)}
        </span>
        <div className="flex items-center gap-3">
          <div
            onClick={seek}
            role="presentation"
            className="flex h-5 min-w-0 flex-1 cursor-pointer items-center gap-[2px]"
          >
            {voice.peaks.map((h, i) => (
              <span
                key={i}
                className="w-[2px] flex-1 rounded-full transition-colors duration-150"
                style={{
                  height: `${Math.round(h * 100)}%`,
                  background: (i + 0.5) / voice.peaks.length <= progress ? "#94713f" : "#e2d3b8",
                }}
              />
            ))}
          </div>
          <span className="shrink-0 font-mono text-[11px] tabular-nums text-[#5c5954]">
            {fmt(playing || time > 0 ? time : total)}
          </span>
        </div>
      </div>
      <audio
        ref={audio}
        src={voice.src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onEnded={(e) => {
          e.currentTarget.currentTime = 0;
          setTime(0);
        }}
      />
    </div>
  );
}
