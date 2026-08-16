import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useVoiceRecorder } from "./use-voice-recorder";

type Listener = (event: unknown) => void;

class FakeMediaRecorder {
  static isTypeSupported = vi.fn(() => true);
  mimeType: string;
  state: "recording" | "inactive" = "recording";
  stream: MediaStream;
  private listeners: Record<string, Listener[]> = {};

  constructor(stream: MediaStream, options?: { mimeType?: string }) {
    this.stream = stream;
    this.mimeType = options?.mimeType ?? "audio/webm";
  }

  addEventListener(type: string, cb: Listener) {
    (this.listeners[type] ??= []).push(cb);
  }

  emit(type: string, event: unknown) {
    this.listeners[type]?.forEach((cb) => cb(event));
  }

  start() {
    this.state = "recording";
  }

  stop() {
    this.state = "inactive";
    this.emit("stop", {});
  }
}

function fakeStream() {
  const track = { stop: vi.fn() };
  return {
    getTracks: () => [track],
  } as unknown as MediaStream;
}

let lastRecorder: FakeMediaRecorder | null = null;
let getUserMediaMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  lastRecorder = null;
  vi.useFakeTimers();

  vi.stubGlobal(
    "MediaRecorder",
    class extends FakeMediaRecorder {
      constructor(stream: MediaStream, options?: { mimeType?: string }) {
        super(stream, options);
        lastRecorder = this;
      }
    },
  );

  getUserMediaMock = vi.fn().mockResolvedValue(fakeStream());
  vi.stubGlobal("navigator", {
    ...globalThis.navigator,
    mediaDevices: { getUserMedia: getUserMediaMock },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("useVoiceRecorder", () => {
  it("starts idle", () => {
    const { result } = renderHook(() => useVoiceRecorder());
    expect(result.current.recording).toBe(false);
    expect(result.current.elapsed).toBe(0);
  });

  it("start() requests the microphone and flips recording on", async () => {
    const { result } = renderHook(() => useVoiceRecorder());

    await act(async () => {
      await result.current.start();
    });

    expect(getUserMediaMock).toHaveBeenCalledWith({ audio: true });
    expect(result.current.recording).toBe(true);
  });

  it("ticks elapsed seconds while recording", async () => {
    const { result } = renderHook(() => useVoiceRecorder());
    await act(async () => {
      await result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.elapsed).toBe(3);
  });

  it("stop() resolves null when nothing was captured", async () => {
    const { result } = renderHook(() => useVoiceRecorder());
    await act(async () => {
      await result.current.start();
    });

    let stopped: unknown;
    await act(async () => {
      stopped = await result.current.stop();
    });

    expect(stopped).toBeNull();
    expect(result.current.recording).toBe(false);
  });

  it("stop() resolves the recorded file when audio data was captured", async () => {
    const { result } = renderHook(() => useVoiceRecorder());
    await act(async () => {
      await result.current.start();
    });

    act(() => {
      lastRecorder?.emit("dataavailable", {
        data: new Blob(["audio-bytes"], { type: "audio/webm" }),
      });
    });

    let stopped: Awaited<ReturnType<typeof result.current.stop>> = null;
    await act(async () => {
      stopped = await result.current.stop();
    });

    expect(stopped?.file).toBeInstanceOf(File);
    expect(stopped?.file.name).toMatch(/^voice-note\./);
    expect(stopped?.durationSeconds).toBeGreaterThanOrEqual(1);
  });

  it("stop() resolves null immediately when never started", async () => {
    const { result } = renderHook(() => useVoiceRecorder());
    const stopped = await result.current.stop();
    expect(stopped).toBeNull();
  });

  it("cancel() stops the recorder and resets state without resolving a file", async () => {
    const { result } = renderHook(() => useVoiceRecorder());
    await act(async () => {
      await result.current.start();
    });

    act(() => {
      result.current.cancel();
    });

    expect(result.current.recording).toBe(false);
    expect(result.current.elapsed).toBe(0);
    expect(lastRecorder?.state).toBe("inactive");
  });
});
