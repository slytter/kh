import React, { useCallback, useRef } from "react";

interface DragDropUploadProps {
  onFilesSelected: (files: File[]) => void;
  children?: React.ReactNode;
}

export function DragDropUpload({ onFilesSelected, children }: DragDropUploadProps) {
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
    onFilesSelected(files);
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  }, [onFilesSelected]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    onFilesSelected(files);
  }, [onFilesSelected]);

  return (
    <div>
      <button type="button" className="w-full" onClick={() => fileInputRef.current?.click()}>
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop} 
        className="bg-white shadow-lg border-1 border-gray-300 rounded-2xl p-4 text-center cursor-pointer hover:border-gray-400 flex flex-col items-center justify-center"
      >
          {children}
          <form ref={formRef} method="post" encType="multipart/form-data">
            <input
              ref={fileInputRef}
              type="file"
              name="img"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </form>
        </div>
      </button>
    </div>
  );
}

