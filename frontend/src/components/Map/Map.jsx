import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

function MapContainer(props) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_MAP_KEY,
  });

  if (!isLoaded) {
    return null;
  }

  return (
    <GoogleMap
      mapContainerStyle={{ height: '100%', width: '100%' }}
      {...props}
    />
  );
}

export { Marker };
export default MapContainer;
