import { create } from 'zustand';

interface ConfigState {
  selections: Record<string, string>;
  designPath: "upload" | "ai" | "consult" | null;
  needsInstallation: boolean;
  uploadedFile: File | null;
  
  // Actions
  setSelection: (label: string, option: string) => void;
  setDesignPath: (path: "upload" | "ai" | "consult" | null) => void;
  setNeedsInstallation: (needs: boolean) => void;
  setUploadedFile: (file: File | null) => void;
  resetConfig: () => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  selections: {},
  designPath: null,
  needsInstallation: false,
  uploadedFile: null,

  setSelection: (label, option) =>
    set((state) => ({ selections: { ...state.selections, [label]: option } })),
    
  setDesignPath: (path) => set({ designPath: path }),
  setNeedsInstallation: (needs) => set({ needsInstallation: needs }),
  setUploadedFile: (file) => set({ uploadedFile: file }),
  
  resetConfig: () => set({
    selections: {},
    designPath: null,
    needsInstallation: false,
    uploadedFile: null
  }),
}));