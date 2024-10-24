import { Draggable } from "@hello-pangea/dnd";
import { DragHandleHorizontalIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import { Photo } from "~/store/store";
import { Image } from "../shared/Image";

function PhotoDragItem({
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
          className={`mb-2 rounded-xl bg-white p-2 shadow-${snapshot.isDragging ? "lg" : "sm"} border transition-shadow transition-height ${snapshot.isDropAnimating ? "h-10" : ""} overflow-hidden`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <button
            type={"button"}
            className={"flex w-full flex-row items-center align-middle"}
            onClick={() => onClick(photo.id)}
          >
            <Image
              className={"h-16 w-16 rounded-md object-cover shadow-sm"}
              src={photo.url} 
              size="sm"
              alt={photo.id}
            />

            <div
              className={"flex flex-1 flex-row items-center justify-between"}
            >
              <div className={"ml-2 items-start text-left "}>
                <p className={"text-sm"}>
                  Sendes {dayjs(photo.send_at).format("D. MMM YY")}
                </p>
                <p className={"text-xs"}>
                  Billede {index + 1} af {numPhotos}
                </p>
              </div>
              <DragHandleHorizontalIcon
                className={"h-7 w-7 cursor-move text-default-400"}
              />
            </div>
          </button>
        </div>
      )}
    </Draggable>
  );
}

export const PhotoDragList = (props: {
  photos: Photo[];
  onClick: (id: string) => void;
}) => {
  const photos = props.photos;
  const onClick = props.onClick;

  return photos.map((photo: Photo, index: number) => (
    <PhotoDragItem
      photo={photo}
      index={index}
      key={photo.id}
      numPhotos={photos.length}
      onClick={onClick}
    />
  ));
};
