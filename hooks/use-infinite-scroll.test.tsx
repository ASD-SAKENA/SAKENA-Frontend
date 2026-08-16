import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useInfiniteScroll } from "./use-infinite-scroll";

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let capturedCallback: ObserverCallback | null = null;
let observeSpy: ReturnType<typeof vi.fn>;
let disconnectSpy: ReturnType<typeof vi.fn>;

class FakeIntersectionObserver {
  constructor(callback: ObserverCallback) {
    capturedCallback = callback;
  }
  observe = observeSpy;
  disconnect = disconnectSpy;
  unobserve = vi.fn();
  takeRecords = () => [];
}

function Sentinel(props: {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}) {
  const ref = useInfiniteScroll<HTMLDivElement>(props);
  return <div ref={ref} data-testid="sentinel" />;
}

beforeEach(() => {
  capturedCallback = null;
  observeSpy = vi.fn();
  disconnectSpy = vi.fn();
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useInfiniteScroll", () => {
  it("observes the sentinel when there is more to load", () => {
    render(<Sentinel hasMore isLoading={false} onLoadMore={vi.fn()} />);
    expect(observeSpy).toHaveBeenCalledTimes(1);
  });

  it("does not observe when there is nothing more to load", () => {
    render(<Sentinel hasMore={false} isLoading={false} onLoadMore={vi.fn()} />);
    expect(observeSpy).not.toHaveBeenCalled();
  });

  it("does not observe while already loading", () => {
    render(<Sentinel hasMore isLoading onLoadMore={vi.fn()} />);
    expect(observeSpy).not.toHaveBeenCalled();
  });

  it("calls onLoadMore when the sentinel intersects", () => {
    const onLoadMore = vi.fn();
    render(<Sentinel hasMore isLoading={false} onLoadMore={onLoadMore} />);

    capturedCallback?.([{ isIntersecting: true }]);
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("does not call onLoadMore when not intersecting", () => {
    const onLoadMore = vi.fn();
    render(<Sentinel hasMore isLoading={false} onLoadMore={onLoadMore} />);

    capturedCallback?.([{ isIntersecting: false }]);
    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = render(
      <Sentinel hasMore isLoading={false} onLoadMore={vi.fn()} />,
    );
    unmount();
    expect(disconnectSpy).toHaveBeenCalledTimes(1);
  });
});
