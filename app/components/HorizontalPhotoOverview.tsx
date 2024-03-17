import { Card, CardBody, CardHeader, ScrollShadow } from "@nextui-org/react";
import { useProjectStore } from "~/store/store";

export const HorizontalPhotoOverview = () => {
  const photos = useProjectStore((store) => store.draft.photos);

  return (
    <Card className="mt-4 p-2">
      <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
        <p className="text-tiny font-bold uppercase">Fotos</p>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <ScrollShadow
          hideScrollBar
          offset={100}
          orientation="horizontal"
          className="flex max-h-[300px] overflow-x-auto scroll-smooth"
        >
          {photos.map((photo) => (
            <img
              className={
                "ml-2 h-[120px] w-[120px] rounded-md object-cover first:ml-0"
              }
              key={photo.id}
              src={`${photo.url}/-/preview/-/resize/x400/`}
              width="200"
              height="200"
              alt={"file.fileInfo.originalFilename" || ""}
            />
          ))}
        </ScrollShadow>
      </CardBody>
    </Card>
  );
};
