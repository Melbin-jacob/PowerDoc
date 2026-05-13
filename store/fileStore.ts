import { create } from 'zustand';

interface FileStore {
  pendingFile: File | null;
  setPendingFile: (file: File | null) => void;
  clearPendingFile: () => void;
}

export const useFileStore = create<FileStore>((set) => ({
  pendingFile: null,
  setPendingFile: (file) => set({ pendingFile: file }),
  clearPendingFile: () => set({ pendingFile: null }),
}));
