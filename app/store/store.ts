import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import _ from "lodash";
import { addSendDatesToPhotos } from "~/utils/planPhotoSchedule";
import { ProjectSchema } from "~/types/validations";
import { z } from "zod";

export type DraftProject = {
  id?: number; // id is optional because it is generated on backend submission
  name: string;
  owner: string | null;
  created_at: number;
  receivers: string[];
  self_receive: boolean;
  generation_props: TimeGenerationProps;
  photos_count: number;
  sent_photos_count: number;
};

export type Project = z.infer<typeof ProjectSchema>;

const defaultProject: DraftProject = {
  name: "Project 1",
  owner: null,
  created_at: Date.now(),
  receivers: [""],
  generation_props: {
    interval: "daily",
    startDate: null,
    sendHour: 8,
  },
  self_receive: false,
  photos_count: 0,
  sent_photos_count: 0,
};

export type Photo = {
  id: string;
  url: string;
  created_at: number;
  did_send: boolean;
  message: string;
  send_at?: number;
  project_id?: number;
};

export type TimeGenerationProps = {
  interval: "weekly" | "daily";
  startDate: number | null;
  sendHour: number;
};

type ProjectStore = {
  draftProject: DraftProject;
  draftPhotos: Photo[];
  resetDraftProject: () => void;
  setReceivers: (receivers: string[]) => void;
  setSelfReceive: (self_receive: boolean) => void;
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
      draftProject: { ...defaultProject },
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
              state.draftProject.generation_props,
            ),
          };
        });
      },
      resetDraftProject: () => {
        set((state) => {
          return {
            ...state,
            draftProject: { ...defaultProject },
            draftPhotos: [],
          };
        });
      },
      setSelfReceive: (self_receive) => {
        set((state) => {
          return {
            ...state,
            draftProject: {
              ...state.draftProject,
              self_receive,
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
            ...state.draftProject.generation_props,
            ...someGenerationProps,
          };

          return {
            ...state,
            draftProject: {
              ...state.draftProject,
              generation_props: newGenerationProps,
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
      name: "kh-project-storage-3", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
