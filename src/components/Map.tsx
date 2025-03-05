import React, { useEffect, useState } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapViewProps {
  latitude: number;
  longitude: number;
  imageName: string;
  imagePreview: string;
}

const MapView: React.FC<MapViewProps> = ({ latitude, longitude, imageName, imagePreview }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [viewState, setViewState] = useState({
    latitude,
    longitude,
    zoom: 12
  });

  // Update view state when coordinates change
  useEffect(() => {
    setViewState(prev => ({
      ...prev,
      latitude,
      longitude
    }));
  }, [latitude, longitude]);

  return (
    <motion.div
      className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Map
        mapboxAccessToken="pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA"
        mapStyle="mapbox://styles/mapbox/streets-v12"
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
      >
        <NavigationControl position="top-right" />
        
        <Marker
          latitude={latitude}
          longitude={longitude}
          anchor="bottom"
          onClick={e => {
            e.originalEvent.stopPropagation();
            setShowPopup(true);
          }}
        >
          <motion.div
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <MapPin className="w-8 h-8 text-red-500" />
          </motion.div>
        </Marker>
        
        {showPopup && (
          <Popup
            latitude={latitude}
            longitude={longitude}
            anchor="top"
            closeOnClick={false}
            onClose={() => setShowPopup(false)}
            className="z-10"
          >
            <div className="p-2 max-w-[200px]">
              <img 
                src={imagePreview} 
                alt={imageName} 
                className="w-full h-24 object-cover rounded mb-2" 
              />
              <p className="text-sm font-medium truncate">{imageName}</p>
              <div className="text-xs text-gray-500 mt-1">
                <p>{latitude.toFixed(6)}, {longitude.toFixed(6)}</p>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </motion.div>
  );
};

export default MapView;