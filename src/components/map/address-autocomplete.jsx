import { useState, useCallback, memo } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

function AddressAutocomplete({ label, placeholder, onAddressSelect }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: CONFIG.googleMapApiKey,
    libraries: ['places'],
  });

  const [autocomplete, setAutocomplete] = useState(null);

  const onAutocompleteLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      
      const addressComponents = {};
      
      if (place.address_components) {
        place.address_components.forEach(component => {
          const types = component.types;
          if (types.includes('street_number')) addressComponents.streetNumber = component.long_name;
          if (types.includes('route')) addressComponents.route = component.long_name;
          if (types.includes('locality')) addressComponents.city = component.long_name;
          if (types.includes('administrative_area_level_1')) addressComponents.state = component.long_name;
          if (types.includes('country')) {
              addressComponents.country = component.short_name; // Short name for CountrySelect
              addressComponents.countryFull = component.long_name;
          }
          if (types.includes('postal_code')) addressComponents.pincode = component.long_name;
        });
      }

      const formattedAddress = place.formatted_address || '';
      const addressLine1 = `${addressComponents.streetNumber || ''} ${addressComponents.route || ''}`.trim() || formattedAddress.split(',')[0];

      const lat = place.geometry?.location?.lat() || 0;
      const lng = place.geometry?.location?.lng() || 0;

      onAddressSelect({
        addressLine1,
        city: addressComponents.city || '',
        state: addressComponents.state || '',
        country: addressComponents.country || '',
        pincode: addressComponents.pincode || '',
        fullAddress: formattedAddress,
        latitude: lat,
        longitude: lng
      });
    }
  };

  if (!isLoaded) {
    return (
      <TextField
        fullWidth
        label={label}
        placeholder="Loading..."
        InputProps={{
          endAdornment: <CircularProgress size={20} />,
        }}
      />
    );
  }

  return (
    <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
      <TextField
        fullWidth
        label={label}
        placeholder={placeholder}
      />
    </Autocomplete>
  );
}

export default memo(AddressAutocomplete);
