import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import _ from "lodash";
import {addSendDatesToPhotos} from "~/utils/planPhotoSchedule";

// todo change to non-pural anme
export type Photo = {
  id: string;
  url: string;
  created_at: number;
  send_at?: number;
};

export type TimeGenerationProps = {
  interval: "weekly" | "daily";
  startDate: Date | null;
  sendHour: number;
};

type Project = {
  id: string;
  photos: Photo[];
  name: string;
  owner: string | null;
  created_at: number;
  receivers: string[];
  selfReceive: boolean;
  generationProps: TimeGenerationProps;
};

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

type ProjectStore = {
  draft: Project;
  setReceivers: (receivers: string[]) => void;
  setSelfReceive: (selfReceive: boolean) => void;
  setDraftPhotos: (photos: Photo[]) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  setOwner: (owner: string | null) => void;
  addPhotos: (photos: Photo[]) => void;
  removePhoto: (id: string) => void;
  editGenerationProps: (
    someGenerationProps: Partial<TimeGenerationProps>,
  ) => void;
};

export const useProjectStore = create(
  persist<ProjectStore>(
    (set, get) => ({
      draft: {
        id: generateId(),
        photos: [],
        name: "Project 1",
        owner: null,
        created_at: Date.now(),
        receivers: [''],
        generationProps: {
          interval: "daily",
          startDate: null,
          sendHour: 8,
        },
        selfReceive: false
      },
      setDraftPhotos: (photos) => {
        set((state) => {
          return {
            draft: {
              ...state.draft,
              photos: addSendDatesToPhotos(photos, state.draft.generationProps),
            },
          };
        });
      },
      setSelfReceive: (selfReceive) => {
        set((state) => {
          return {
            draft: {
              ...state.draft,
              selfReceive,
            },
          };
        });
      },
      isUploading: false,
      setIsUploading: (isUploading) => {
        set((state) => {
          return {
            ...state,
            isUploading,
          };
        });
      },
      removePhoto: (id) => {
        // todo: remove photo from server
        set((state) => {
          // get().setDraftPhotos(state.draft.photos.filter((photo) => photo.id !== id));
          return {
            draft: {
              ...state.draft,
              photos: state.draft.photos.filter((photo) => photo.id !== id),
            },
          };
        });
      },
      setOwner: (owner) => {
        set((state) => {
          return {
            draft: {
              ...state.draft,
              owner,
            },
          };
        });
      },
      setReceivers: (receivers) => {
        set((state) => {
          return {
            draft: {
              ...state.draft,
              receivers,
            },
          };
        });
      },
      addPhotos: (photos) => {
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
          const newGenerationProps = {
            ...state.draft.generationProps,
            ...someGenerationProps,
          };

          return {
            ...state,
            draft: {
              ...state.draft,
              generationProps: newGenerationProps,
              photos: addSendDatesToPhotos(state.draft.photos, newGenerationProps),
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
