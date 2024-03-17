import { useEffect, useRef } from "react";
import { Container } from "~/components/Container";
import * as LR from "@uploadcare/blocks";
import { Photos, useProjectStore } from "~/store/store";
import { NavBotton } from "~/components/Button";
import { HorizontalPhotoOverview } from "~/components/HorizontalPhotoOverview";

export default function UploadImages() {
  const ctxProviderRef = useRef<InstanceType<LR.UploadCtxProvider>>(null);

  const addPhotos = useProjectStore((store) => store.addPhotos);

  useEffect(() => {
    const ctxProvider = ctxProviderRef.current;
    if (!ctxProvider) return;

    const handleChangeEvent = (e: LR.EventMap["change"]) => {
      console.log("change event payload:", e);
      const successEntries = e.detail.successEntries;
      const asPhotos: Photos[] = successEntries.map((f) => ({
        id: f.uuid,
        url: f.cdnUrl,
        created_at: new Date().toISOString(),
      }));

      addPhotos(asPhotos);
    };

    // There plenty of events you may use. See more: https://uploadcare.com/docs/file-uploader/events/
    ctxProvider.addEventListener("change", handleChangeEvent);
    return () => ctxProvider.removeEventListener("change", handleChangeEvent);
  }, [addPhotos]);

  return (
    <Container>
      <div className="bg flex h-full w-full flex-grow flex-row ">
        <lr-config
          ctx-name="my-uploader"
          pubkey="3b9243eaa4a4ae623c19"
          maxLocalFileSizeBytes={10000000}
          imgOnly={true}
          sourceList="local, dropbox, gdri+ve, gphotos"
        />
        <lr-file-uploader-inline
          css-src="https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.35.2/web/lr-file-uploader-regular.min.css"
          ctx-name="my-uploader"
          class="my-config"
        />
        <lr-upload-ctx-provider ctx-name="my-uploader" ref={ctxProviderRef} />
      </div>
      <div className="flex w-full pb-8">
        <NavBotton route="/create/plan" title="Planlæg afsendelse" />
      </div>

      <HorizontalPhotoOverview />
    </Container>
  );
}
