import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import _ from "lodash";
import { addSendDatesToPhotos } from "~/utils/planPhotoSchedule";

export type Photo = {
  id: string;
  url: string;
  created_at: number;
  send_at?: number;
};

export type TimeGenerationProps = {
  interval: "weekly" | "daily";
  startDate: number | null;
  sendHour: number;
};

export type Project = {
  id: string;
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
  draftProject: Project;
  draftPhotos: Photo[];

  setReceivers: (receivers: string[]) => void;
  setSelfReceive: (selfReceive: boolean) => void;
  setDraftPhotos: (photos: Photo[]) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  setOwner: (owner: string | null) => void;
  addDraftPhotos: (photos: Photo[]) => void;
  removePhoto: (id: string) => void;
  editGenerationProps: (
    someGenerationProps: Partial<TimeGenerationProps>,
  ) => void;
};

export const useProjectStore = create(
  persist<ProjectStore>(
    (set) => ({
      draftProject: {
        id: generateId(),
        photos: [],
        name: "Project 1",
        owner: null,
        created_at: Date.now(),
        receivers: [""],
        generationProps: {
          interval: "daily",
          startDate: null,
          sendHour: 8,
        },
        selfReceive: false,
      },
      draftPhotos: [],
      setDraftPhotos: (photos) => {
        set((state) => {
          return {
            ...state,
            draftProject: {
              ...state.draftProject,
            },
            draftPhotos: addSendDatesToPhotos(
              photos,
              state.draftProject.generationProps,
            ),
          };
        });
      },
      setSelfReceive: (selfReceive) => {
        set((state) => {
          return {
            ...state,
            draftProject: {
              ...state.draftProject,
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
          return {
            ...state,
            draftPhotos: state.draftPhotos.filter((photo) => photo.id !== id),
          };
        });
      },
      setOwner: (owner) => {
        set((state) => {
          return {
            ...state,
            draftProject: {
              ...state.draftProject,
              owner,
            },
          };
        });
      },
      setReceivers: (receivers) => {
        set((state) => {
          return {
            ...state,
            draftProject: {
              ...state.draftProject,
              receivers,
            },
          } as ProjectStore;
        });
      },
      addDraftPhotos: (photos) => {
        set((state) => {
          return {
            ...state,
            draftPhotos: _.uniqBy([...state.draftPhotos, ...photos], "id"),
          } as ProjectStore;
        });
      },

      editGenerationProps: (
        someGenerationProps: Partial<TimeGenerationProps>,
      ) => {
        set((state) => {
          const newGenerationProps = {
            ...state.draftProject.generationProps,
            ...someGenerationProps,
          };

          return {
            ...state,
            draftProject: {
              ...state.draftProject,
              generationProps: newGenerationProps,
            },
            draftPhotos: addSendDatesToPhotos(
              state.draftPhotos,
              newGenerationProps,
            ),
          } as ProjectStore;
        });
      },
    }),
    {
      name: "kh-project-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
