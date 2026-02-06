import fs from 'fs';
import path from 'path';

export const deleteFile = (filename) => {
  if (!filename) return;
  
  const filePath = path.join('uploads', filename);
  
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Error deleting file:', err);
    }
  });
};

export const validateImageDimensions = (file, maxWidth = 2000, maxHeight = 2000) => {
  // This would require image processing library like sharp
  // For now, just validate file size as a proxy
  const maxSize = 5 * 1024 * 1024; // 5MB
  return file.size <= maxSize;
};