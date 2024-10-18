import { Button } from "@nextui-org/button";
import React, { useCallback, useRef, useState } from "react";

interface DragDropUploadProps {
  onFilesSelected: (files: File[]) => void;
  uploading: boolean;
  onUpload: (event: React.FormEvent<HTMLFormElement>) => void;
  children?: React.ReactNode;
}

export function DragDropUpload({ onFilesSelected, uploading, onUpload, children }: DragDropUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('border-gray-400', 'shadow-xl');
    }
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-gray-400', 'shadow-xl');
    }
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-gray-400', 'shadow-xl');
    }
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles(files);
    onFilesSelected(files);
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  }, [onFilesSelected]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    onFilesSelected(files);
    formRef.current?.submit();
  }, [onFilesSelected]);

  return (
    <div>
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop} 
        // onClick={() => fileInputRef.current?.click()}
        className="border-1 border-gray-300 rounded-2xl p-4 text-center cursor-pointer hover:border-gray-400"
      >
        {children}
        <p className="text-gray-500">Træk fotos hertil eller klik for at vælge</p>
        <form ref={formRef} method="post" encType="multipart/form-data" onSubmit={onUpload} onClick={() => fileInputRef.current?.click()}>
          <input
            ref={fileInputRef}
            type="file"
            name="img"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button type="submit" disabled={uploading || selectedFiles.length === 0}>
            {uploading ? `Uploading...` : "Upload"}
          </Button>
          {selectedFiles.length > 0 && (
            <p>{selectedFiles.length} file(s) selected</p>
          )}
        </form>
      </div>
    </div>
  );
}

