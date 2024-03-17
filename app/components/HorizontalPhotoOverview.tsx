import { ScrollShadow } from "@nextui-org/react";
import { useProjectStore } from "~/store/store";

export const HorizontalPhotoOverview = () => {
  const photos = useProjectStore((store) => store.draft.photos);
  const removePhoto = useProjectStore((store) => store.removePhoto);

  return (
    <div>
      {photos.length > 0 && (
        <p className="text-tiny mb-2 uppercase">Uploadede fotos</p>
      )}
      <ScrollShadow
        hideScrollBar
        offset={10}
        orientation="horizontal"
        className="flex space-x-1 overflow-x-auto "
      >
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => removePhoto(photo.id)}
            className="relative flex-shrink-0 cursor-pointer overflow-hidden first:rounded-bl-xl first:rounded-tl-xl last:rounded-br-xl last:rounded-tr-xl"
          >
            <img
              src={`${photo.url}/-/preview/-/resize/x200/`}
              width="100"
              height="100"
              key={photo.id}
              className={"h-[100px] w-[70px]  object-cover "}
              alt={"file.fileInfo.originalFilename" || ""}
            />
            {/* <div className="absolute right-2 top-2">
              <button
                onClick={() => removePhoto(photo.id)}
                className="h-8 w-8 rounded-lg bg-white p-1"
              >
                🗑
              </button>
            </div> */}
          </div>
        ))}
      </ScrollShadow>
    </div>
  );
};
