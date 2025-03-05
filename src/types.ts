export interface ImageInfo {
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  dateTime?: string;
  camera?: {
    make?: string;
    model?: string;
    software?: string;
    lens?: string;
  };
  settings?: {
    iso?: number;
    aperture?: string;
    exposureTime?: string;
    focalLength?: string;
    flash?: string;
  };
  dimensions?: {
    width?: number;
    height?: number;
    orientation?: number;
  };
  copyright?: string;
  artist?: string;
  exif?: any;
}