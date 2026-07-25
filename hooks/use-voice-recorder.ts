"use client";

import { useRef, useState } from "react";

export interface VoiceRecording {
  file: File;
  durationSeconds: number;
}

interface VoiceRecorder {
  recording: boolean;
  /** Elapsed seconds while recording, for the live timer. */
  elapsed: number;
  start: () => Promise<void>;
  /** Stops and resolves with the recorded clip, or null if nothing was captured. */
  stop: () => Promise<VoiceRecording | null>;
  cancel: () => void;
}

/** The first type the browser actually supports, so Safari and Chrome both work. */
function pickMimeType(): string {
  const candidates = ["audio/webm", "audio/mp4", "audio/ogg"];
  return (
    candidates.find((type) => MediaRecorder.isTypeSupported(type)) ??
    "audio/webm"
  );
}

function extensionFor(mimeType: string): string {
  if (mimeType.includes("mp4")) return "m4a";
  if (mimeType.includes("ogg")) return "ogg";
  return "webm";
}

/**
 * Microphone recording for chat voice notes. The stream is always released on
 * stop or cancel so the browser's recording indicator never lingers.
 */
export function useVoiceRecorder(): VoiceRecorder {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);

  const releaseStream = () => {
    recorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    recorderRef.current = null;
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(stream, { mimeType });
    chunksRef.current = [];
    recorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    });
    recorder.start();

    recorderRef.current = recorder;
    startedAtRef.current = Date.now();
    setElapsed(0);
    setRecording(true);
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
  };

  const stop = () =>
    new Promise<VoiceRecording | null>((resolve) => {
      const recorder = recorderRef.current;
      if (!recorder) {
        resolve(null);
        return;
      }
      const durationSeconds = Math.max(
        1,
        Math.round((Date.now() - startedAtRef.current) / 1000),
      );
      recorder.addEventListener(
        "stop",
        () => {
          const mimeType = recorder.mimeType || "audio/webm";
          const blob = new Blob(chunksRef.current, { type: mimeType });
          releaseStream();
          setRecording(false);
          setElapsed(0);
          if (blob.size === 0) {
            resolve(null);
            return;
          }
          const file = new File(
            [blob],
            `voice-note.${extensionFor(mimeType)}`,
            { type: mimeType },
          );
          resolve({ file, durationSeconds });
        },
        { once: true },
      );
      recorder.stop();
    });

  const cancel = () => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();
    chunksRef.current = [];
    releaseStream();
    setRecording(false);
    setElapsed(0);
  };

  return { recording, elapsed, start, stop, cancel };
}
