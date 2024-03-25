import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useState } from "react";
import { Photo } from "~/store/store";
import { PhotoDragList } from "./planning/PhotoDragList";
import { PhotoSlider } from "./PhotoSlider";

const reorder = (photos: Photo[], startIndex: number, endIndex: number) => {
  const result = Array.from(photos);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

type Props = {
  photos: Photo[];
  setPhotos: (photos: Photo[]) => void;
};

export const DragAndDropPhotos = (props: Props) => {
  const { photos, setPhotos } = props;

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  function onDragEnd(result: {
    destination: { index: number };
    source: { index: number };
  }) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const quotes = reorder(
      photos,
      result.source.index,
      result.destination.index,
    );

    setPhotos(quotes);
  }

  return (
    <div>
      <DragDropContext
        className={"flex flex-shrink-0 flex-col gap-4"}
        onDragEnd={onDragEnd}
        onDragStart={() => {
          console.log("dragging");
          if (window.navigator.vibrate) {
            window.navigator.vibrate(100);
          }
        }}
      >
        <Droppable droppableId="list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <PhotoDragList
                photos={photos}
                onClick={(id) => {
                  setImageModalOpen(true);
                  setSelectedPhotoId(id);
                }}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <PhotoSlider
        initialIndex={
          photos.findIndex((photo) => photo.id === selectedPhotoId) || 0
        }
        isOpen={imageModalOpen}
        onOpenChange={setImageModalOpen}
      />
    </div>
  );
};
