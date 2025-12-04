import { useState } from 'react';
import { supabaseStorage } from '../services/supabase-storage.service';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadSingle = async (file: File, folder?: string): Promise<string | null> => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const url = await supabaseStorage.uploadImage(file, folder);
      setUploadProgress(100);
      return url;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadMultiple = async (files: File[], folder?: string): Promise<string[]> => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const urls = await supabaseStorage.uploadMultipleImages(files, folder);
      setUploadProgress(100);
      return urls;
    } catch (error) {
      console.error('Multiple upload failed:', error);
      return [];
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteImage = async (imagePath: string): Promise<boolean> => {
    return await supabaseStorage.deleteImage(imagePath);
  };

  return {
    uploading,
    uploadProgress,
    uploadSingle,
    uploadMultiple,
    deleteImage
  };
};