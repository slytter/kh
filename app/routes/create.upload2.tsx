import { useState } from "react";
import { HorizontalPhotoOverview } from "~/components/HorizontalPhotoOverview";
import { LilHeader } from "~/components/LilHeader";
import { PhotoSlider } from "~/components/PhotoSlider";
import { Photo, useProjectStore } from "~/store/store";
import { DragDropUpload } from "~/components/DragDropUpload";
import { Loader, LoaderCircle } from "lucide-react";
import { Spinner } from "@nextui-org/react";


const photoFactory = (url: string) => ({
  id: url,
  url: url,
  did_send: false,
  message: "",
  created_at: Date.now(),
} as Photo);

export default function Upload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null as null | number );
  const [error, setError] = useState<string | null>(null);

  const photos = useProjectStore((store) => store.draftPhotos);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPhotoSliderOpen, setIsPhotoSliderOpen] = useState(false);

  const addPhotos = useProjectStore((store) => store.addDraftPhotos);
  const removePhoto = useProjectStore((store) => store.removePhoto);
  const setIsUploading = useProjectStore((store) => store.setIsUploading);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);


  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    setError(null);
    setUploading(true);
    setProgress(0);

    if (files.length === 0) {
      setError("Please select at least one file to upload.");
      setUploading(false);
      return;
    }

    const concurrentUploads = 4;
    const totalFiles = files.length;
    let uploadedFiles = 0;
    const allImageUrls: string[] = [];

    try {
      for (let i = 0; i < totalFiles; i += concurrentUploads) {
        console.log(`Processing batch ${Math.floor(i / concurrentUploads) + 1}`);
        const uploadBatch = files.slice(i, i + concurrentUploads);
        const formData = new FormData();
        uploadBatch.forEach(file => formData.append('img', file));

        const response = await fetch('/server/upload-photo', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Upload failed: ${response.status} ${response.statusText}`, errorText);
          throw new Error(`Upload failed: ${response.statusText}`);
        }
        console.log({response})

        const result = await response.json();

        allImageUrls.push(...result.imageUrls);

        uploadedFiles += uploadBatch.length;
        const newProgress = Math.round((uploadedFiles / totalFiles) * 100);
        console.log(`Progress: ${newProgress}%`);
        setProgress(newProgress);

        const photos = allImageUrls.map(photoFactory);
        addPhotos(photos);
      }

    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "An error occurred during upload. Please try again.");
    } finally {
      setIsUploading(false);
      setSelectedFiles([]);
      setUploading(false);
      setProgress(null);
    }

    console.log("Upload completed");
  };

  const onFilesSelected = (files: File[]) => {
    handleUpload(files);
  }

  return (
    <div className="mb-2 items-center justify-center w-full">
      {photos.length > 0 && <LilHeader>Uploadede fotos ({photos.length})</LilHeader>}
      <PhotoSlider
        onOpenChange={setIsPhotoSliderOpen}
        initialIndex={currentPhotoIndex}
        isOpen={isPhotoSliderOpen}
      />
      <DragDropUpload 
        progress={progress}
        onFilesSelected={onFilesSelected}
        uploading={uploading}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
      > 
        <HorizontalPhotoOverview 
          numLoadingPhotos={3}
          chosenIndex={currentPhotoIndex}
          photos={photos}
          onPhotoPress={(_, index) => {
            setCurrentPhotoIndex(index);
            setIsPhotoSliderOpen(true)
          }}
        />

      </DragDropUpload>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
}
