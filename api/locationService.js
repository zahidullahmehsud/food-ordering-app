// locationService.js

export const fetchPlaceDetails = async (latitude, longitude) => {
  const apiKey = 'YOUR_API_KEY';
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === 'OK') {
      return data.results[0].formatted_address;
    } else {
      throw new Error('Error fetching place details');
    }
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
};

export const saveLocationToAPI = async (requestBody, token) => {
  try {
    const response = await fetch(
      'https://server.saugeendrives.com:9001/api/v1.0/Customer/address',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save location');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving location:', error);
    throw error;
  }
};
