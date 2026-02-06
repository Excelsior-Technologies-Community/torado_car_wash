export const handleUploadError = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
      });
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 10 files allowed.'
      });
    }
    
    if (err.message.includes('Only JPEG, PNG, WebP, GIF, and AVIF images are allowed')) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    return res.status(400).json({
      success: false,
      message: 'File upload error: ' + err.message
    });
  }
  
  next();
};