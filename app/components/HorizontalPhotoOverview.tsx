import { ScrollShadow, Skeleton } from "@nextui-org/react";
import { Photo, useProjectStore } from "../store/store";
import { LilHeader } from "./LilHeader";

type Props = {
  photos: Photo[];
  numLoadingPhotos?: number;
  onPhotoPress?: (photo: Photo, index: number) => void;
  chosenIndex?: number;
  height?: number;
};

export const HorizontalPhotoOverview = (props: Props) => {
  const { photos, onPhotoPress, height, chosenIndex, numLoadingPhotos } = props;
  // const photos = useProjectStore((store) => store.draft.photos);
  const removePhoto = useProjectStore((store) => store.removePhoto);

  return (
    <div>
      <ScrollShadow
        hideScrollBar
        offset={10}
        orientation="horizontal"
        className="flex space-x-1 overflow-x-auto"
      >
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => onPhotoPress?.(photo, index)}
            className={`relative flex-shrink-0 cursor-pointer overflow-hidden
            first:rounded-bl-xl first:rounded-tl-xl last:rounded-br-xl last:rounded-tr-xl
          `}
          >
            <Skeleton className="w-[70px] h-[100px] absolute z-[-1]"></Skeleton>
            <img
              //
              src={`${photo.url}?w=200&h=200`}
              width="100"
              height={height || "100"}
              key={photo.id}
              className={`z-10 h-[${height || "100"}px] w-[70px] bg-gray-100 object-cover transition-all duration-300 ${chosenIndex === index ? "border-4 border-black" : ""}`}
              style={{ height: height || "100px" }}
              alt={"file.fileInfo.originalFilename" || ""}
            />
            <div className="absolute right-2 top-2">
              <button
                onClick={() => removePhoto(photo.id)}
                className="h-8 w-8 rounded-lg bg-white p-1"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
        {numLoadingPhotos &&
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-70 h-100 bg-gray-100">
              <Skeleton className="w-full h-full" />
            </div>
          ))}
      </ScrollShadow>
    </div>
  );
};
