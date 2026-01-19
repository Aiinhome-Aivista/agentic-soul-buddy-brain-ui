import React, { useRef } from "react";
import { UploadCloud, FolderOpen, X } from "lucide-react";

function FileUploader({ files = [], setFiles }) {
  const fileInputRef = useRef(null);

  // Safe file handler
  const handleFiles = (newFiles) => {
    if (!newFiles) return;
    const fileArray = Array.from(newFiles);
    setFiles((prev = []) => [...prev, ...fileArray]); // fallback to empty array
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const openFileDialog = () => fileInputRef.current?.click();

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      className="border border-slate-600 rounded-md p-6 text-center bg-slate-900 cursor-grab"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
      <p className="text-slate-300">Drag and drop files here</p>
      <p className="text-slate-400 text-sm my-1">or</p>

      <button
        onClick={openFileDialog}
        className="border border-[#795EFF] text-[#795EFF] rounded-md px-4 py-1 hover:bg-[#795EFF]/30 text-sm cursor-pointer"
      >
        <FolderOpen className="inline w-4 h-4 mr-1" /> Browse Files
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
        multiple
        hidden
      />

      <p className="text-xs text-slate-500 mt-2">
        Supported formats: PDF and doc files. Max 50MB each.
      </p>

      {files.length > 0 && (
        <ul className="mt-3 text-left text-slate-300 text-sm">
          {files.map((file, idx) => (
            <li key={`${file.name}-${idx}`} className="flex items-center justify-between p-1.5 hover:bg-slate-800 rounded-md">
              <span className="truncate">
                <span className="mr-2">📂</span>{file.name}
              </span>
              <button onClick={() => handleRemoveFile(idx)} className="ml-2 p-1 text-slate-400 hover:text-red-500 hover:bg-slate-700 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileUploader;
