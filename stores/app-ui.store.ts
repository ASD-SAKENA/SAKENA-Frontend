"use client";

import { create } from "zustand";

interface AppUiState {
  /** Mobile sidebar drawer. */
  navOpen: boolean;
  openNav: () => void;
  closeNav: () => void;
  /** Shared "new service request" modal, openable from any page. */
  requestModalOpen: boolean;
  openRequestModal: () => void;
  closeRequestModal: () => void;
}

export const useAppUiStore = create<AppUiState>((set) => ({
  navOpen: false,
  openNav: () => set({ navOpen: true }),
  closeNav: () => set({ navOpen: false }),
  requestModalOpen: false,
  openRequestModal: () => set({ requestModalOpen: true }),
  closeRequestModal: () => set({ requestModalOpen: false }),
}));
