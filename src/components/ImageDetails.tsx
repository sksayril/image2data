import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Calendar, 
  MapPin, 
  FileText, 
  X, 
  Settings, 
  Maximize, 
  User, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import type { ImageInfo } from '../types';

interface ImageDetailsProps {
  imageInfo: ImageInfo;
  onClose: () => void;
}

const ImageDetails: React.FC<ImageDetailsProps> = ({ imageInfo, onClose }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    file: true,
    location: true,
    camera: true,
    settings: false,
    dimensions: false,
    copyright: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatOrientation = (orientation?: number): string => {
    if (!orientation) return 'Unknown';
    
    const orientations: Record<number, string> = {
      1: 'Normal',
      2: 'Mirrored horizontally',
      3: 'Rotated 180°',
      4: 'Mirrored vertically',
      5: 'Mirrored horizontally and rotated 270°',
      6: 'Rotated 90°',
      7: 'Mirrored horizontally and rotated 90°',
      8: 'Rotated 270°'
    };
    
    return orientations[orientation] || `Orientation ${orientation}`;
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <img 
          src={imageInfo.preview} 
          alt={imageInfo.name} 
          className="w-full h-64 object-cover"
        />
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 truncate">{imageInfo.name}</h3>
        
        <div className="space-y-4">
          {/* File Information */}
          <div className="border-b border-gray-100 pb-3">
            <button 
              className="flex items-center justify-between w-full text-left"
              onClick={() => toggleSection('file')}
            >
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-500 mr-3" />
                <p className="text-sm font-medium text-gray-700">File Information</p>
              </div>
              {expandedSections.file ? 
                <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                <ChevronDown className="w-4 h-4 text-gray-500" />
              }
            </button>
            
            {expandedSections.file && (
              <div className="mt-2 pl-8">
                <p className="text-sm text-gray-500">Size: {formatFileSize(imageInfo.size)}</p>
                <p className="text-sm text-gray-500">Type: {imageInfo.type}</p>
                <p className="text-sm text-gray-500">
                  Last Modified: {new Date(imageInfo.lastModified).toLocaleString()}
                </p>
              </div>
            )}
          </div>
          
          {/* Date and Time */}
          {imageInfo.dateTime && (
            <div className="border-b border-gray-100 pb-3">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Date Taken</p>
                  <p className="text-sm text-gray-500">{imageInfo.dateTime}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Location Information */}
          {imageInfo.location && (
            <div className="border-b border-gray-100 pb-3">
              <button 
                className="flex items-center justify-between w-full text-left"
                onClick={() => toggleSection('location')}
              >
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                  <p className="text-sm font-medium text-gray-700">Location</p>
                </div>
                {expandedSections.location ? 
                  <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                }
              </button>
              
              {expandedSections.location && (
                <div className="mt-2 pl-8">
                  <p className="text-sm text-gray-500">
                    Latitude: {imageInfo.location.latitude.toFixed(6)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Longitude: {imageInfo.location.longitude.toFixed(6)}
                  </p>
                  {imageInfo.exif?.GPSAltitude && (
                    <p className="text-sm text-gray-500">
                      Altitude: {
                        (imageInfo.exif.GPSAltitude.numerator / imageInfo.exif.GPSAltitude.denominator).toFixed(1)
                      }m {imageInfo.exif.GPSAltitudeRef === 0 ? 'above' : 'below'} sea level
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Camera Information */}
          {imageInfo.camera && (imageInfo.camera.make || imageInfo.camera.model) && (
            <div className="border-b border-gray-100 pb-3">
              <button 
                className="flex items-center justify-between w-full text-left"
                onClick={() => toggleSection('camera')}
              >
                <div className="flex items-center">
                  <Camera className="w-5 h-5 text-gray-500 mr-3" />
                  <p className="text-sm font-medium text-gray-700">Camera</p>
                </div>
                {expandedSections.camera ? 
                  <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                }
              </button>
              
              {expandedSections.camera && (
                <div className="mt-2 pl-8">
                  {imageInfo.camera.make && (
                    <p className="text-sm text-gray-500">Make: {imageInfo.camera.make}</p>
                  )}
                  {imageInfo.camera.model && (
                    <p className="text-sm text-gray-500">Model: {imageInfo.camera.model}</p>
                  )}
                  {imageInfo.camera.software && (
                    <p className="text-sm text-gray-500">Software: {imageInfo.camera.software}</p>
                  )}
                  {imageInfo.camera.lens && (
                    <p className="text-sm text-gray-500">Lens: {imageInfo.camera.lens}</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Camera Settings */}
          {imageInfo.settings && (
            <div className="border-b border-gray-100 pb-3">
              <button 
                className="flex items-center justify-between w-full text-left"
                onClick={() => toggleSection('settings')}
              >
                <div className="flex items-center">
                  <Settings className="w-5 h-5 text-gray-500 mr-3" />
                  <p className="text-sm font-medium text-gray-700">Camera Settings</p>
                </div>
                {expandedSections.settings ? 
                  <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                }
              </button>
              
              {expandedSections.settings && (
                <div className="mt-2 pl-8">
                  {imageInfo.settings.iso && (
                    <p className="text-sm text-gray-500">ISO: {imageInfo.settings.iso}</p>
                  )}
                  {imageInfo.settings.aperture && (
                    <p className="text-sm text-gray-500">Aperture: {imageInfo.settings.aperture}</p>
                  )}
                  {imageInfo.settings.exposureTime && (
                    <p className="text-sm text-gray-500">Exposure: {imageInfo.settings.exposureTime}</p>
                  )}
                  {imageInfo.settings.focalLength && (
                    <p className="text-sm text-gray-500">Focal Length: {imageInfo.settings.focalLength}</p>
                  )}
                  {imageInfo.settings.flash && (
                    <p className="text-sm text-gray-500">Flash: {imageInfo.settings.flash}</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Image Dimensions */}
          {imageInfo.dimensions && (
            <div className="border-b border-gray-100 pb-3">
              <button 
                className="flex items-center justify-between w-full text-left"
                onClick={() => toggleSection('dimensions')}
              >
                <div className="flex items-center">
                  <Maximize className="w-5 h-5 text-gray-500 mr-3" />
                  <p className="text-sm font-medium text-gray-700">Dimensions</p>
                </div>
                {expandedSections.dimensions ? 
                  <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                }
              </button>
              
              {expandedSections.dimensions && (
                <div className="mt-2 pl-8">
                  {(imageInfo.dimensions.width && imageInfo.dimensions.height) && (
                    <p className="text-sm text-gray-500">
                      Resolution: {imageInfo.dimensions.width} × {imageInfo.dimensions.height} pixels
                    </p>
                  )}
                  {imageInfo.dimensions.orientation && (
                    <p className="text-sm text-gray-500">
                      Orientation: {formatOrientation(imageInfo.dimensions.orientation)}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Copyright and Artist */}
          {(imageInfo.copyright || imageInfo.artist) && (
            <div className="border-b border-gray-100 pb-3">
              <button 
                className="flex items-center justify-between w-full text-left"
                onClick={() => toggleSection('copyright')}
              >
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-500 mr-3" />
                  <p className="text-sm font-medium text-gray-700">Copyright Information</p>
                </div>
                {expandedSections.copyright ? 
                  <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                }
              </button>
              
              {expandedSections.copyright && (
                <div className="mt-2 pl-8">
                  {imageInfo.artist && (
                    <p className="text-sm text-gray-500">Artist: {imageInfo.artist}</p>
                  )}
                  {imageInfo.copyright && (
                    <p className="text-sm text-gray-500">Copyright: {imageInfo.copyright}</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Additional EXIF Data */}
          {imageInfo.exif && Object.keys(imageInfo.exif).length > 0 && (
            <div className="mt-4">
              <details className="text-sm">
                <summary className="text-blue-600 cursor-pointer">View All EXIF Data</summary>
                <div className="mt-2 p-3 bg-gray-50 rounded-md max-h-60 overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(imageInfo.exif, null, 2)}
                  </pre>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ImageDetails;