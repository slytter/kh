import { useEffect, useRef, useState } from "react";
import * as LR from "@uploadcare/blocks";
import { Photo, useProjectStore } from "../store/store.js";
import { HorizontalPhotoOverview } from "../components/HorizontalPhotoOverview.js";
import { Card } from "@nextui-org/react";
import { BottomNav } from "../components/BottomNav";
import { LilHeader } from "../components/LilHeader.js";
import { PhotoSlider } from "../components/PhotoSlider.js";
import { CalendarIcon } from "lucide-react";
import Dropzone, { useDropzone } from "react-dropzone";

const ImageUploader = () => {
  const ctxProviderRef = useRef<InstanceType<LR.UploadCtxProvider>>(null);
  const addPhotos = useProjectStore((store) => store.addDraftPhotos);
  const removePhoto = useProjectStore((store) => store.removePhoto);
  const setIsUploading = useProjectStore((store) => store.setIsUploading);

  useEffect(() => {
    const ctxProvider = ctxProviderRef.current;
    if (!ctxProvider) return;

    const handleChangeEvent = (e: LR.EventMap["change"]) => {
      console.log("change event payload:", e);
      setIsUploading(e.detail.isUploading);

      const successEntries = e.detail.successEntries;
      const asPhotos: Photo[] = successEntries.map((f) => ({
        id: f.uuid,
        url: f.cdnUrl,
        did_send: false,
        message: "",
        created_at: Date.now(),
      }));

      addPhotos(asPhotos);
    };

    const removePhotoEvent = (e: LR.EventMap["file-removed"]) => {
      const uuid = e.detail.uuid;
      if (uuid) removePhoto(uuid);
    };

    // There plenty of events you may use. See more: https://uploadcare.com/docs/file-uploader/events/
    ctxProvider.addEventListener("change", handleChangeEvent);
    ctxProvider.addEventListener("file-removed", removePhotoEvent);

    return () => {
      ctxProvider.removeEventListener("change", handleChangeEvent);
      ctxProvider.removeEventListener("file-removed", removePhotoEvent);
    };
  }, []);

  return (
    <Card className="mb-4 flex h-full w-full flex-grow flex-row">
      <div className="flex w-full flex-grow flex-row">
        <lr-config
          ctx-name="my-uploader"
          pubkey="fd19e269dbf2d1933345"
          maxLocalFileSizeBytes={10000000}
          imgOnly={true}
          sourceList="local, dropbox, gdrive, gphotos"
        />
        <lr-file-uploader-inline
          css-src="https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.35.2/web/lr-file-uploader-regular.min.css"
          ctx-name="my-uploader"
          class="my-config "
        />
        <lr-upload-ctx-provider
          ctx-name="my-uploader"
          class="p-0"
          ref={ctxProviderRef}
        />
      </div>
    </Card>
  );
};

const UploadZone = () => {
  return (
    <Dropzone
      onDrop={(acceptedFiles) => console.log(acceptedFiles)}
      onDragOver={() => {}}
    >
      {({ getRootProps, getInputProps }) => (
        <div className="">
          <div
            {...getRootProps()}
            className=" min-h-40 rounded-xl border-1 content-center justify-center flex flex-1"
          >
            <input {...getInputProps()} />
            <p>Upload</p>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default function UploadImages() {
  const isUploading = useProjectStore((store) => store.isUploading);
  const photos = useProjectStore((store) => store.draftPhotos);
  const numPhotos = photos.length;

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPhotoSliderOpen, setIsPhotoSliderOpen] = useState(false);

  return (
    <>
      <div className="mb-2">
        {photos.length > 0 && <LilHeader>Uploadede fotos</LilHeader>}
        <HorizontalPhotoOverview
          chosenIndex={currentPhotoIndex}
          photos={photos}
          onPhotoPress={(_, index) => {
            setCurrentPhotoIndex(index);
            setIsPhotoSliderOpen(true);
          }}
        />
        <PhotoSlider
          onOpenChange={setIsPhotoSliderOpen}
          initialIndex={currentPhotoIndex}
          isOpen={isPhotoSliderOpen}
        />
      </div>
      <UploadZone />
      {/* <ImageUploader /> */}
      <BottomNav
        disabled={isUploading || numPhotos === 0}
        route="/create/plan"
        startContent={<CalendarIcon />}
        title={"Planlæg afsendelse"}
        disabledReason="Upload billeder først"
      />
    </>
  );
}
