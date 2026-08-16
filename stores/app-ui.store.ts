"use client";

import { create } from "zustand";

import type { ServiceRequest } from "@/types/requests.type";

interface AppUiState {
  /** Mobile sidebar drawer. */
  navOpen: boolean;
  openNav: () => void;
  closeNav: () => void;
  /**
   * Shared "service request" modal, openable from any page. `editingRequest`
   * set means the modal is in edit mode for that request; null means create.
   */
  requestModalOpen: boolean;
  editingRequest: ServiceRequest | null;
  openRequestModal: (editingRequest?: ServiceRequest) => void;
  closeRequestModal: () => void;
}

export const useAppUiStore = create<AppUiState>((set) => ({
  navOpen: false,
  openNav: () => set({ navOpen: true }),
  closeNav: () => set({ navOpen: false }),
  requestModalOpen: false,
  editingRequest: null,
  openRequestModal: (editingRequest) =>
    set({ requestModalOpen: true, editingRequest: editingRequest ?? null }),
  closeRequestModal: () =>
    set({ requestModalOpen: false, editingRequest: null }),
}));
