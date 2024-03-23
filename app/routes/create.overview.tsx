import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Photo, useProjectStore } from "~/store/store";
import dayjs from "dayjs";
import { DragHandleHorizontalIcon } from "@radix-ui/react-icons";
import { LilHeader } from "~/components/LilHeader";
import { BottomNav } from "~/components/BottomNav";
import { PhotoSlider } from "~/components/PhotoSlider";
import { useState } from "react";
// import {PhotoSlider} from "~/components/PhotoSlider";

const reorder = (photos: Photo[], startIndex: number, endIndex: number) => {
  const result = Array.from(photos);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function Quote({
  photo,
  index,
  numPhotos,
  onClick,
}: {
  photo: Photo;
  index: number;
  numPhotos: number;
  onClick: (id: string) => void;
}) {
  return (
    <Draggable draggableId={photo.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`mb-2 rounded-xl bg-white p-2 shadow-${snapshot.isDragging ? "lg" : "sm"} transition-height border transition-shadow ${snapshot.isDropAnimating ? "h-10" : ""} overflow-hidden`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <button
            type={"button"}
            className={"flex w-full flex-row items-center align-middle"}
            onClick={() => onClick(photo.id)}
          >
            <img
              className={"h-16 w-16 rounded-md object-cover shadow-sm"}
              src={`${photo.url}/-/preview/-/resize/x200/`}
              alt={photo.id}
            />

            <div className={"flex flex-1 flex-row justify-between"}>
              <div className={"ml-2 items-start text-left "}>
                <p className={"text-sm"}>
                  Sendes {dayjs(photo.send_at).format("D. MMM YY")}
                </p>
                <p className={"text-xs"}>
                  Billede {index + 1} af {numPhotos}
                </p>
              </div>
              <DragHandleHorizontalIcon
                className={"text-default-400 h-7 w-7 cursor-move"}
              />
            </div>
          </button>
        </div>
      )}
    </Draggable>
  );
}

const PhotoList = (props: {
  photos: Photo[];
  onClick: (id: string) => void;
}) => {
  const photos = props.photos;
  const onClick = props.onClick;

  return photos.map((photo: Photo, index: number) => (
    <Quote
      photo={photo}
      index={index}
      key={photo.id}
      numPhotos={photos.length}
      onClick={onClick}
    />
  ));
};

export default function CreateOverview() {
  const photos = useProjectStore((state) => state.draft.photos);
  const setDraftPhotos = useProjectStore((state) => state.setDraftPhotos);
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

    setDraftPhotos(quotes);
  }

  return (
    <div className={"flex flex-1 flex-shrink-0 flex-col"}>
      <LilHeader>Overblik</LilHeader>
      <p className={"text-default-500 mb-2 px-2 text-sm"}>
        Her kan du se og sortere dine fotos
      </p>
      <DragDropContext
        className={"flex flex-shrink-0 flex-col gap-4"}
        onDragEnd={onDragEnd}
        onDragStart={
          () => {
            console.log("dragging");
            if (window.navigator.vibrate) {
              window.navigator.vibrate(100);
            }
          } // good times
        }
      >
        <Droppable droppableId="list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <PhotoList
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

      <BottomNav route="/create/overview" title={"Overblik"} />
    </div>
  );
}
