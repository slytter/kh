import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Photos = {
  id: string;
  url: string;
  created_at: string;
  send_at?: string;
};

type Project = {
  id: string;
  photos: Photos[];
  name: string;
  owner: string;
  created_at: string;
  receivers: string[];
};

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

type ProjectStore = {
  draft: Project;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  setOwner: (owner: string) => void;
  addPhotos: (photos: Photos[]) => void;
  removePhoto: (id: string) => void;
};

export const useProjectStore = create(
  persist<ProjectStore>(
    (set) => ({
      draft: {
        id: generateId(),
        photos: [],
        name: "Project 1",
        owner: "",
        created_at: Date.now().toString(),
        receivers: [],
      },
      isUploading: false,
      setIsUploading: (isUploading: boolean) => {
        set((state) => {
          return {
            ...state,
            isUploading,
          };
        });
      },
      removePhoto: (id: string) => {
        set((state) => {
          return {
            draft: {
              ...state.draft,
              photos: state.draft.photos.filter((photo) => photo.id !== id),
            },
          };
        });
      },
      setOwner: (owner: string) => {
        set((state) => {
          return {
            draft: {
              ...state.draft,
              owner,
            },
          };
        });
      },
      addPhotos: (photos: Photos[]) => {
        set((state) => {
          return {
            draft: {
              ...state.draft,
              photos: [...state.draft.photos, ...photos],
            },
          };
        });
      },
    }),
    {
      name: "kh-project-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
