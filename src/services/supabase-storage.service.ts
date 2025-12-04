import { supabase } from '../config/supabase';

export class SupabaseStorageService {
  private bucketName = 'project-images';

  async uploadImage(file: File, folder: string = ''): Promise<string | null> {
    try {
      const fileName = `${Math.random()}-${file.name}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading file:', error);
        return null;
      }

      const { data: publicURLData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(data.path);

      console.log('Upload successful:', {
        filePath: data.path,
        publicUrl: publicURLData.publicUrl
      });

      return publicURLData.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  }

  async uploadMultipleImages(files: File[], folder: string = ''): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results.filter(url => url !== null) as string[];
  }

  async deleteImage(imagePath: string): Promise<boolean> {
    try {
      const fileName = imagePath.split('/').pop();
      if (!fileName) return false;

      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([fileName]);

      if (error) {
        console.error('Error deleting file:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }

  async deleteMultipleImages(imagePaths: string[]): Promise<boolean> {
    try {
      const fileNames = imagePaths
        .map(path => path.split('/').pop())
        .filter(name => name) as string[];

      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove(fileNames);

      if (error) {
        console.error('Error deleting files:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Delete multiple error:', error);
      return false;
    }
  }
}

export const supabaseStorage = new SupabaseStorageService();