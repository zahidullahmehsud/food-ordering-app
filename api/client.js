import {create} from 'apisauce';
import cache from '../utils/cache';
import authStorage from '../auth/storage';

const API_BASE_URL = 'https://server.saugeendrives.com:9001/api/v1.0';
const GOOGLE_MAPS_API_KEY = 'AIzaSyCq5Y4F8m77wt929gwKepvFlO4aBLO7bt4';

const apiClient = create({
  baseURL: 'https://server.saugeendrives.com:9000/',
});

apiClient.addAsyncRequestTransform(async request => {
  const authToken = `Bearer ${JSON.stringify(await authStorage.getToken())}`;
  if (!authToken) return;
  request.headers['Authorization'] = authToken;
});

const get = apiClient.get;
apiClient.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);

  if (response.ok) {
    cache.store(url, response.data);
    return response;
  }

  const data = await cache.get(url);
  return data ? {ok: true, data} : response;
};

export const fetchPlaceDetails = async (latitude, longitude) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;

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

export const saveLocation = async requestBody => {
  try {
    const token = await authStorage.getToken();
    const response = await fetch(`${API_BASE_URL}/Customer/address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log('Response Data:', responseData);
      return responseData;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save location');
    }
  } catch (error) {
    console.error('Error saving location:', error);
    throw error;
  }
};

export const fetchRestaurantItems = async vendorcode => {
  try {
    const Token = await authStorage.getToken();
    const myHeaders = new Headers();
    myHeaders.append('Authorization', Token);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    const response = await fetch(
      `${API_BASE_URL}/Item?VendorStoreCode=${vendorcode}`,
      requestOptions,
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching restaurant items:', error);
    throw error;
  }
};

export const fetchCategoryItems = async (
  itemName,
  storedLatitude,
  storedLongitude,
) => {
  try {
    const Token = await authStorage.getToken();
    const myHeaders = new Headers();
    myHeaders.append('Authorization', Token);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    const response = await fetch(
      `${API_BASE_URL}/Item?SearchKey=${itemName}&Geolocation=${storedLatitude}%2C${storedLongitude}`,
      requestOptions,
    );

    if (!response.ok) {
      throw new Error('Search item not found');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching restaurant items:', error);
    throw error;
  }
};

export const fetchFavoriteItems = async () => {
  try {
    const Token = await authStorage.getToken();
    const response = await fetch(`${API_BASE_URL}/Customer/favourite-items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Token,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch favorite items');
    }
    const data = await response.json();
    if (data.code === 'OK' && Array.isArray(data.items)) {
      return data.items;
    } else {
      console.error('Unexpected response format:', data);
    }
  } catch (error) {
    console.error('Error fetching favorite items:', error);
  }
};

export const fetchItemDetails = async itemCode => {
  try {
    const baseUrl = 'https://server.saugeendrives.com:9001/api/v1.0/Item';
    const urlWithGeolocation = `${baseUrl}?Code=${itemCode}`;

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    const response = await fetch(urlWithGeolocation, requestOptions);
    const result = await response.json();

    if (response.ok) {
      return result;
    } else {
      throw new Error('Failed to fetch item details');
    }
  } catch (error) {
    console.error('Error fetching item details:', error);
    throw error;
  }
};

export const toggleFavoriteItem = async (itemCode, isFavorite) => {
  try {
    console.log('itemCode : ', itemCode, 'isFav :', isFavorite);
    const Token = await authStorage.getToken();
    const method = isFavorite ? 'DELETE' : 'POST';
    const response = await fetch(
      `${API_BASE_URL}/Customer/favourite-items/${itemCode}`,
      {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: Token,
        },
      },
    );
    if (!response.ok)
      throw new Error(
        `Failed to ${isFavorite ? 'remove from' : 'add to'} favorites`,
      );
    return response.ok;
  } catch (error) {
    console.error('Error updating favorites:', error);
    throw error;
  }
};

export const checkIfFavorite = async itemCode => {
  try {
    const favorites = await fetchFavoriteItems();
    return favorites.some(fav => fav.code === itemCode);
  } catch (error) {
    console.error('Error checking if favorite:', error);
    throw error;
  }
};

export default apiClient;
