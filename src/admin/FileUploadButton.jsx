// src/admin/FileUploadButton.jsx (or wherever your admin folder is)
import React, { useState } from 'react';
import { Upload, X, Check, Loader } from 'lucide-react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { app, db } from '../firebase'; // Adjust path if needed

const FileUploadButton = ({ onUploadComplete, acceptedFileTypes = "*", maxSizeMB = 10 }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setError('');
    setUploading(true);
    setUploadProgress(0);

    try {
      const storage = getStorage(app);
      const timestamp = Date.now();
      const fileName = `uploads/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error('Upload error:', error);
          setError('Upload failed. Please try again.');
          setUploading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            const fileData = {
              name: file.name,
              url: downloadURL,
              size: file.size,
              type: file.type,
              uploadedAt: new Date().toISOString(),
              path: fileName
            };
            
            // Save to Firestore
            await addDoc(collection(db, 'uploadedFiles'), fileData);
            
            setUploadedFile(fileData);
            setUploading(false);
            
            if (onUploadComplete) {
              onUploadComplete(fileData);
            }
          } catch (err) {
            console.error('Error:', err);
            setError('Failed to complete upload');
            setUploading(false);
          }
        }
      );
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to initialize upload.');
      setUploading(false);
    }
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setError('');
  };

  return (
    <div className="w-full">
      {!uploadedFile && !uploading && (
        <label className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transition-colors cursor-pointer">
          <Upload size={20} />
          <span>Upload File</span>
          <input
            type="file"
            onChange={handleFileSelect}
            accept={acceptedFileTypes}
            className="hidden"
          />
        </label>
      )}

      {uploading && (
        <div className="bg-white border-2 border-red-500 rounded-lg p-4 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <Loader className="animate-spin text-red-500" size={20} />
            <span className="text-sm font-semibold text-gray-700">Uploading...</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-red-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 font-semibold">{uploadProgress}%</p>
        </div>
      )}

      {uploadedFile && (
        <div className="bg-white border-2 border-green-500 rounded-lg p-4 shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <Check className="text-green-500 mt-0.5 flex-shrink-0" size={24} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {(uploadedFile.size / 1024).toFixed(1)} KB • Uploaded
                </p>
                <div className="flex gap-2 mt-2">
                  
                   <a href={uploadedFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition-colors font-semibold"
                  >
                    Open
                  </a>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = uploadedFile.url;
                      link.download = uploadedFile.name;
                      link.click();
                    }}
                    className="text-xs bg-gray-500 text-white px-3 py-1.5 rounded hover:bg-gray-600 transition-colors font-semibold"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={clearUpload}
              className="text-gray-400 hover:text-red-500 ml-2 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-3 mt-2 shadow-md">
          <p className="text-sm text-red-600 font-semibold">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUploadButton;