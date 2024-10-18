import { useState } from "react";
import { HorizontalPhotoOverview } from "~/components/HorizontalPhotoOverview";
import { LilHeader } from "~/components/LilHeader";
import { PhotoSlider } from "~/components/PhotoSlider";
import { Photo, useProjectStore } from "~/store/store";
import { DragDropUpload } from "~/components/DragDropUpload";


const photoFactory = (url: string) => ({
  id: url,
  url: url,
  did_send: false,
  message: "",
  created_at: Date.now(),
} as Photo);

export default function Upload() {
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const photos = useProjectStore((store) => store.draftPhotos);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPhotoSliderOpen, setIsPhotoSliderOpen] = useState(false);

  const addPhotos = useProjectStore((store) => store.addDraftPhotos);
  const removePhoto = useProjectStore((store) => store.removePhoto);
  const setIsUploading = useProjectStore((store) => store.setIsUploading);


  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsUploading(true);
    event.preventDefault();
    setError(null);
    setUploading(true);
    setProgress(0);
    setUploadedImageUrls([]);

    if (selectedFiles.length === 0) {
      setError("Please select at least one file to upload.");
      setUploading(false);
      return;
    }

    const concurrentUploads = 4;
    const totalFiles = selectedFiles.length;
    let uploadedFiles = 0;
    const allImageUrls: string[] = [];

    try {
      for (let i = 0; i < totalFiles; i += concurrentUploads) {
        console.log(`Processing batch ${Math.floor(i / concurrentUploads) + 1}`);
        const uploadBatch = selectedFiles.slice(i, i + concurrentUploads);
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
        setUploadedImageUrls(allImageUrls);

        const photos = allImageUrls.map(photoFactory);
        addPhotos(photos);
      }

    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "An error occurred during upload. Please try again.");
    } finally {
      setIsUploading(false);
      setUploading(false);
    }

    console.log("Upload completed");
  };

  return (
    <div className="mb-2">
      {photos.length > 0 && <LilHeader>Uploadede fotos</LilHeader>}
      <PhotoSlider
        onOpenChange={setIsPhotoSliderOpen}
        initialIndex={currentPhotoIndex}
        isOpen={isPhotoSliderOpen}
      />

      <h1>Upload Images</h1>
      <DragDropUpload
        onFilesSelected={setSelectedFiles}
        uploading={uploading}
        onUpload={handleUpload}
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {uploadedImageUrls.length > 0 && (
        <div>
          <h2>Uploaded Images:</h2>
          {uploadedImageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Uploaded ${index + 1}`}
              style={{ maxWidth: '300px', margin: '10px' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
