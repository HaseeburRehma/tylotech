/* Client voice messages, played with components/sections/VoiceNote. */

export type Voice = {
  src: string;
  /** seconds, shown before the file has loaded (preload="none") */
  duration: number;
  /** bar heights 0–1, precomputed from the recording */
  peaks: number[];
  label: { de: string; en: string };
};

export const ROHR_CLEANER_VOICE: Voice = {
  src: "/audio/rohr-cleaner-sprachnachricht.m4a",
  duration: 124,
  peaks: [0.6, 0.59, 0.52, 0.98, 0.88, 0.84, 0.87, 0.73, 0.7, 0.6, 0.88, 0.89, 0.77, 0.86, 0.82, 0.27, 0.38, 0.69, 0.73, 0.71, 0.83, 0.79, 0.85, 0.71, 0.6, 0.76, 0.67, 0.5, 0.82, 0.95, 0.82, 0.74, 0.32, 0.63, 0.92, 1.0, 0.51, 0.67, 0.26, 0.39, 0.47, 0.25, 0.32, 0.34],
  label: { de: "Sprachnachricht vom Inhaber", en: "Voice message from the owner" },
};
