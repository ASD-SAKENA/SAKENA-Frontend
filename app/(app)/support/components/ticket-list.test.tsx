import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { TicketApiResponse } from "@/types/support.api.type";

import { TicketList } from "./ticket-list";

const named: TicketApiResponse = {
  id: "t-1",
  category: "COMPLAINT",
  subject: "سر و صدای واحد بالا",
  status: "AWAITING_REPLY",
  anonymous: false,
  raisedByName: "سارا محمدی",
  raisedByUnit: "12",
  createdAt: "2026-08-01T09:00:00Z",
  lastMessageAt: "2026-08-01T09:00:00Z",
};

const anonymous: TicketApiResponse = {
  ...named,
  id: "t-2",
  subject: "پیشنهاد برای پارکینگ",
  category: "SUGGESTION",
  anonymous: true,
  raisedByName: null,
  raisedByUnit: null,
};

describe("TicketList", () => {
  it("shows the status of each ticket", () => {
    render(
      <TicketList
        tickets={[named]}
        selectedId={null}
        isManager
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("سر و صدای واحد بالا")).toBeInTheDocument();
    expect(screen.getByText("در انتظار پاسخ")).toBeInTheDocument();
  });

  it("names the resident for the manager when the ticket is not anonymous", () => {
    render(
      <TicketList
        tickets={[named]}
        selectedId={null}
        isManager
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText(/سارا محمدی/)).toBeInTheDocument();
  });

  it("never shows an identity for an anonymous ticket", () => {
    // The backend withholds the name; the list must not fall back to
    // anything that could identify the resident.
    render(
      <TicketList
        tickets={[anonymous]}
        selectedId={null}
        isManager
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText(/ساکن ناشناس/)).toBeInTheDocument();
    expect(screen.queryByText(/سارا محمدی/)).not.toBeInTheDocument();
  });

  it("tells a resident with no tickets what the page is for", () => {
    render(
      <TicketList
        tickets={[]}
        selectedId={null}
        isManager={false}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText(/هنوز تیکتی ثبت نکرده‌اید/)).toBeInTheDocument();
  });
});
