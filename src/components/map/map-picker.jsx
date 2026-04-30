import { useState, useCallback, memo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
};

const center = {
  lat: 47.3769,
  lng: 8.5417, // Zurich as default
};

function MapPicker({ lat, lng, address, onSelectLocation }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: CONFIG.googleMapApiKey,
    libraries: ['places'],
  });

  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onAutocompleteLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();
        const newAddress = place.formatted_address || place.name;
        onSelectLocation(newLat, newLng, newAddress);
        map.panTo({ lat: newLat, lng: newLng });
      }
    }
  };

  const onMapClick = useCallback((event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    
    // Reverse geocoding to get address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        onSelectLocation(newLat, newLng, results[0].formatted_address);
      } else {
        onSelectLocation(newLat, newLng, 'Unknown Location');
      }
    });
  }, [onSelectLocation]);

  if (!isLoaded) {
    return (
      <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.neutral', borderRadius: 1 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
        {CONFIG.googleMapApiKey ? (
            <>
                <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
                    <TextField
                    fullWidth
                    label="Search Location"
                    placeholder="Enter a city or address"
                    sx={{ mb: 2 }}
                    />
                </Autocomplete>

                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={lat && lng ? { lat, lng } : center}
                    zoom={lat && lng ? 15 : 10}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onClick={onMapClick}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                    }}
                >
                    {lat && lng && <Marker position={{ lat, lng }} />}
                </GoogleMap>

                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
                    Click on the map to pick a location or use the search box.
                </Typography>
            </>
        ) : (
            <Box sx={{ p: 3, border: '1px dashed grey', textAlign: 'center' }}>
                <Typography variant="body2" color="error">
                    Google Maps API Key is missing. Please add it to your .env file.
                </Typography>
            </Box>
        )}
    </Box>
  );
}

export default memo(MapPicker);
