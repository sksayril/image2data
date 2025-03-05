import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Camera, Map as MapIcon, Image as ImageIcon, Settings, Info, Upload } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import ImageDetails from './components/ImageDetails';
import MapView from './components/Map';
import NoLocationMessage from './components/NoLocationMessage';
import type { ImageInfo } from './types';

function App() {
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);

  const handleImageProcessed = (info: ImageInfo) => {
    setImageInfo(info);
  };

  const handleReset = () => {
    if (imageInfo?.preview) {
      URL.revokeObjectURL(imageInfo.preview);
    }
    setImageInfo(null);
  };

  return (
    <>
      <Helmet>
        <title>{imageInfo ? `Analyzing ${imageInfo.name} - Image Location Map` : 'Image Location Map - View Photo Metadata & Location'}</title>
        <meta name="description" content="Extract and analyze image metadata, EXIF data, and location information from your photos. Free online tool for photographers and enthusiasts." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center text-blue-600">
                  <Camera className="w-8 h-8 mr-2" />
                  <MapIcon className="w-8 h-8" />
                </div>
                <h1 className="ml-3 text-2xl font-bold text-gray-900">Image Location Map</h1>
              </div>
            </div>
          </div>
        </header>

        {!imageInfo && (
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Discover Your Photo's Story
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Upload any photo to reveal its hidden details - from camera settings to exact location.
                Free, instant, and private analysis of your images.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <ImageIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">EXIF Data Analysis</h3>
                <p className="text-gray-600">
                  Extract detailed metadata from your photos including camera model, lens info, and settings.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <MapIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Location Mapping</h3>
                <p className="text-gray-600">
                  View the exact location where your photo was taken on an interactive map.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Technical Details</h3>
                <p className="text-gray-600">
                  Get insights into aperture, shutter speed, ISO, and other camera settings.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto"
            >
              <h3 className="text-2xl font-semibold text-center mb-6">
                Upload Your Image
              </h3>
              <ImageUploader onImageProcessed={handleImageProcessed} />
            </motion.div>

            {/* Google AdSense Ad Block */}
            <div className="mt-12 flex justify-center">
              <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-4433068335890521"
                data-ad-slot="YOUR_AD_SLOT_ID"
                data-ad-format="auto"
                data-full-width-responsive="true">
              </ins>
            </div>
          </div>
        )}

        {imageInfo && (
          <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <motion.div
              layout
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <motion.div layout className="space-y-6">
                <motion.div
                  layout
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Image Analysis</h2>
                  <div className="space-y-4">
                    <ImageDetails imageInfo={imageInfo} onClose={handleReset} />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      onClick={handleReset}
                    >
                      Analyze Another Image
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div layout className="space-y-6">
                <motion.div
                  layout
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Location Information</h2>
                  
                  {imageInfo.location ? (
                    <MapView 
                      latitude={imageInfo.location.latitude} 
                      longitude={imageInfo.location.longitude}
                      imageName={imageInfo.name}
                      imagePreview={imageInfo.preview}
                    />
                  ) : (
                    <NoLocationMessage />
                  )}
                </motion.div>

                {/* Google AdSense Ad Block */}
                <div className="flex justify-center">
                  <ins className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-4433068335890521"
                    data-ad-slot="YOUR_AD_SLOT_ID"
                    data-ad-format="auto"
                    data-full-width-responsive="true">
                  </ins>
                </div>
              </motion.div>
            </motion.div>
          </main>
        )}

        <footer className="bg-gray-50 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About</h3>
                <p className="text-gray-600">
                  Image Location Map helps photographers and enthusiasts analyze their photos and discover detailed metadata information.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>EXIF Data Extraction</li>
                  <li>Location Mapping</li>
                  <li>Camera Settings Analysis</li>
                  <li>Privacy-First Approach</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Privacy</h3>
                <p className="text-gray-600">
                  Your photos are processed entirely in your browser. We never store or transmit your images to any server.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
              <p>&copy; {new Date().getFullYear()} Image Location Map. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;