import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { 
  extractExifData, 
  extractGPSInfo, 
  formatDateTime, 
  extractCameraInfo,
  extractImageSettings,
  extractDimensions,
  formatGPSAltitude
} from '../utils/exifUtils';
import type { ImageInfo } from '../types';

interface ImageUploaderProps {
  onImageProcessed: (imageInfo: ImageInfo) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const file = acceptedFiles[0];
      
      // Create a preview URL
      const preview = URL.createObjectURL(file);
      
      // Extract EXIF data
      const exifData = await extractExifData(file);
      
      // Extract GPS coordinates if available
      const location = extractGPSInfo(exifData);
      
      // Extract date and time
      const dateTime = formatDateTime(exifData);
      
      // Extract camera info
      const camera = extractCameraInfo(exifData);
      
      // Extract image settings
      const settings = extractImageSettings(exifData);
      
      // Extract image dimensions
      const dimensions = extractDimensions(exifData);
      
      const imageInfo: ImageInfo = {
        file,
        preview,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        location,
        dateTime,
        camera,
        settings,
        dimensions,
        copyright: exifData.Copyright,
        artist: exifData.Artist,
        exif: exifData
      };
      
      onImageProcessed(imageInfo);
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [onImageProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.heic']
    },
    maxFiles: 1
  });

  return (
    <motion.div 
      className="w-full max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center justify-center"
        >
          <Upload className="w-12 h-12 mb-4 text-gray-400" />
          
          {isProcessing ? (
            <p className="text-lg font-medium text-gray-700">Processing image...</p>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-700">
                {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
              </p>
              <p className="mt-2 text-sm text-gray-500">or click to select a file</p>
              <p className="mt-1 text-xs text-gray-400">
                Supported formats: JPEG, PNG, GIF
              </p>
            </>
          )}
        </motion.div>
      </div>
      
      {error && (
        <motion.div 
          className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <X className="w-5 h-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ImageUploader;