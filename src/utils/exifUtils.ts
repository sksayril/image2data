import exifr from 'exifr';

export const extractExifData = async (file: File): Promise<any> => {
  try {
    const exifData = await exifr.parse(file, { tiff: true, xmp: true, icc: true, iptc: true });
    return exifData || {};
  } catch (error) {
    console.error('Error extracting EXIF data:', error);
    return {};
  }
};

export const convertDMSToDD = (
  degrees: number,
  minutes: number,
  seconds: number,
  direction: string
): number => {
  let dd = degrees + minutes / 60 + seconds / 3600;
  if (direction === 'S' || direction === 'W') {
    dd = dd * -1;
  }
  return dd;
};

export const extractGPSInfo = (exifData: any) => {
  if (!exifData || (!exifData.latitude && !exifData.longitude)) {
    return null;
  }

  try {
    // Modern exifr library provides direct latitude and longitude values
    if (exifData.latitude !== undefined && exifData.longitude !== undefined) {
      return {
        latitude: exifData.latitude,
        longitude: exifData.longitude
      };
    }
    
    // Fallback to traditional EXIF format if needed
    if (exifData.GPSLatitude && exifData.GPSLongitude) {
      const latDegrees = Array.isArray(exifData.GPSLatitude) ? 
        exifData.GPSLatitude[0] : 
        (exifData.GPSLatitude.numerator / exifData.GPSLatitude.denominator);
      
      const latMinutes = Array.isArray(exifData.GPSLatitude) ? 
        exifData.GPSLatitude[1] : 
        (exifData.GPSLatitude.numerator / exifData.GPSLatitude.denominator);
      
      const latSeconds = Array.isArray(exifData.GPSLatitude) ? 
        exifData.GPSLatitude[2] : 
        (exifData.GPSLatitude.numerator / exifData.GPSLatitude.denominator);
      
      const latDirection = exifData.GPSLatitudeRef;

      const longDegrees = Array.isArray(exifData.GPSLongitude) ? 
        exifData.GPSLongitude[0] : 
        (exifData.GPSLongitude.numerator / exifData.GPSLongitude.denominator);
      
      const longMinutes = Array.isArray(exifData.GPSLongitude) ? 
        exifData.GPSLongitude[1] : 
        (exifData.GPSLongitude.numerator / exifData.GPSLongitude.denominator);
      
      const longSeconds = Array.isArray(exifData.GPSLongitude) ? 
        exifData.GPSLongitude[2] : 
        (exifData.GPSLongitude.numerator / exifData.GPSLongitude.denominator);
      
      const longDirection = exifData.GPSLongitudeRef;

      const latitude = convertDMSToDD(latDegrees, latMinutes, latSeconds, latDirection);
      const longitude = convertDMSToDD(longDegrees, longMinutes, longSeconds, longDirection);

      return { latitude, longitude };
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting GPS data:', error);
    return null;
  }
};

export const formatDateTime = (exifData: any): string | undefined => {
  if (exifData) {
    // Try different date fields in order of preference
    const dateField = exifData.DateTimeOriginal || exifData.DateTime || exifData.CreateDate || exifData.ModifyDate;
    
    if (dateField) {
      try {
        // Handle date string or Date object
        const date = typeof dateField === 'string' ? new Date(dateField.replace(/:/g, '-', 2)) : dateField;
        return date.toLocaleString();
      } catch (e) {
        // If it's in EXIF format (YYYY:MM:DD HH:MM:SS)
        if (typeof dateField === 'string' && dateField.includes(':')) {
          const [datePart, timePart] = dateField.split(' ');
          if (datePart && datePart.includes(':')) {
            const [year, month, day] = datePart.split(':');
            return `${day}/${month}/${year} ${timePart || ''}`;
          }
        }
      }
    }
  }
  return undefined;
};

export const extractCameraInfo = (exifData: any) => {
  if (!exifData) return undefined;
  
  return {
    make: exifData.Make || exifData.make,
    model: exifData.Model || exifData.model,
    software: exifData.Software || exifData.software,
    lens: exifData.LensModel || exifData.Lens || exifData.lens
  };
};

export const extractImageSettings = (exifData: any) => {
  if (!exifData) return undefined;
  
  let aperture;
  if (exifData.FNumber || exifData.fNumber) {
    const fNumber = exifData.FNumber || exifData.fNumber;
    const fNumberValue = typeof fNumber === 'number' ? 
      fNumber : 
      (fNumber?.numerator / fNumber?.denominator);
    
    if (fNumberValue) {
      aperture = `f/${fNumberValue.toFixed(1)}`;
    }
  }
  
  let exposureTime;
  if (exifData.ExposureTime || exifData.exposureTime) {
    const expTime = exifData.ExposureTime || exifData.exposureTime;
    const expTimeValue = typeof expTime === 'number' ? 
      expTime : 
      (expTime?.numerator / expTime?.denominator);
    
    if (expTimeValue) {
      if (expTimeValue >= 1) {
        exposureTime = `${expTimeValue}s`;
      } else {
        exposureTime = `1/${Math.round(1/expTimeValue)}s`;
      }
    }
  }
  
  let focalLength;
  if (exifData.FocalLength || exifData.focalLength) {
    const focal = exifData.FocalLength || exifData.focalLength;
    const focalValue = typeof focal === 'number' ? 
      focal : 
      (focal?.numerator / focal?.denominator);
    
    if (focalValue) {
      focalLength = `${Math.round(focalValue)}mm`;
    }
  }
  
  let flash;
  if (exifData.Flash !== undefined || exifData.flash !== undefined) {
    const flashValue = exifData.Flash !== undefined ? exifData.Flash : exifData.flash;
    if (flashValue === 0) {
      flash = "No Flash";
    } else if (flashValue === 1) {
      flash = "Flash Fired";
    } else if (flashValue === 5) {
      flash = "Flash Fired, Return not detected";
    } else if (flashValue === 7) {
      flash = "Flash Fired, Return detected";
    } else if (flashValue === 8) {
      flash = "On, Flash did not fire";
    } else if (flashValue === 9) {
      flash = "Flash Fired, Compulsory mode";
    } else if (flashValue === 16) {
      flash = "Off, Flash did not fire";
    } else if (flashValue === 24) {
      flash = "Auto, Flash did not fire";
    } else if (flashValue === 25) {
      flash = "Auto, Flash fired";
    } else if (typeof flashValue === 'boolean') {
      flash = flashValue ? "Flash Fired" : "No Flash";
    } else {
      flash = `Flash value: ${flashValue}`;
    }
  }
  
  return {
    iso: exifData.ISO || exifData.ISOSpeedRatings || exifData.iso,
    aperture,
    exposureTime,
    focalLength,
    flash
  };
};

export const extractDimensions = (exifData: any) => {
  if (!exifData) return undefined;
  
  return {
    width: exifData.PixelXDimension || exifData.ImageWidth || exifData.width,
    height: exifData.PixelYDimension || exifData.ImageHeight || exifData.height,
    orientation: exifData.Orientation || exifData.orientation
  };
};

export const formatGPSAltitude = (exifData: any): string | undefined => {
  if (!exifData) return undefined;
  
  const altitude = exifData.GPSAltitude || exifData.altitude;
  const altitudeRef = exifData.GPSAltitudeRef || exifData.altitudeRef;
  
  if (altitude === undefined) return undefined;
  
  try {
    const altitudeValue = typeof altitude === 'number' ? 
      altitude : 
      (altitude.numerator / altitude.denominator);
    
    const ref = altitudeRef === 0 || altitudeRef === '0' ? 'above' : 'below';
    return `${altitudeValue.toFixed(1)}m ${ref} sea level`;
  } catch (error) {
    return undefined;
  }
};