import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUploader = ({ onFileAccepted }) => {
  const [fileName, setFileName] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]; // Fix: get the first file from array
      setFileName(file.name);
      onFileAccepted(file);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''}`}
      aria-label="File uploader dropzone"
    >
      <input {...getInputProps()} />
      {fileName ? (
        <p className="file-name">Selected file: {fileName}</p>
      ) : isDragReject ? (
        <p>Only PDF files are accepted.</p>
      ) : isDragActive ? (
        <p>Drop the file here...</p>
      ) : (
        <p>Drag 'n' drop your resume here, or click to select a file (PDF only)</p>
      )}
    </div>
  );
};

export default FileUploader;
