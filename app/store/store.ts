import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import _ from "lodash";

export type Photos = {
  id: string;
  url: string;
  created_at: number;
  send_at?: number;
};

type TimeGenerationProps = {
  interval: "weekly" | "daily";
  startDate: number;
  startTime: number;
  minute: number;
  hour: number;
  day?: number;
};

type Project = {
  id: string;
  photos: Photos[];
  name: string;
  owner: string | null;
  created_at: number;
  receivers: string[];
  generationProps: TimeGenerationProps;
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
        owner: null,
        created_at: Date.now(),
        receivers: [],
        generationProps: {
          interval: "daily",
          startDate: Date.now(),
          startTime: Date.now(),
          minute: 0,
          hour: 8,
        },
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
        // todo: remove photo from server
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
              photos: _.uniqBy([...state.draft.photos, ...photos], "id"),
            },
          };
        });
      },
      editGenerationProps: (
        someGenerationProps: Partial<TimeGenerationProps>,
      ) => {
        set((state) => {
          return {
            ...state,
            draft: {
              ...state.draft,
              generationProps: {
                ...state.draft.generationProps,
                ...someGenerationProps,
              },
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
