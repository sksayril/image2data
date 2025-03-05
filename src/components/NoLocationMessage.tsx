import React from 'react';
import { motion } from 'framer-motion';
import { ZapOff as MapOff } from 'lucide-react';

const NoLocationMessage: React.FC = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MapOff className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">No Location Data Found</h3>
      <p className="text-sm text-gray-500 text-center max-w-md">
        This image doesn't contain GPS coordinates in its EXIF data. 
        Try uploading a photo taken with a smartphone or a camera with GPS capabilities.
      </p>
    </motion.div>
  );
};

export default NoLocationMessage;