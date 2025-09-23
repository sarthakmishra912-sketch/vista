/// <reference path="../types/google-maps.d.ts" />

// Google Maps Geocoding Service
export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  placeId?: string;
}

export interface PlaceSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

class GeocodingService {
  private geocoder: google.maps.Geocoder | null = null;
  private placesService: google.maps.places.PlacesService | null = null;
  private autocompleteService: google.maps.places.AutocompleteService | null = null;
  private isInitialized = false;

  // Initialize Google Maps services
  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isInitialized) {
        resolve();
        return;
      }

      // Check if Google Maps is loaded
      if (typeof google === 'undefined' || !google.maps) {
        reject(new Error('Google Maps API not loaded'));
        return;
      }

      try {
        this.geocoder = new google.maps.Geocoder();
        this.autocompleteService = new google.maps.places.AutocompleteService();
        
        // Create a dummy div for PlacesService (required by Google Maps)
        const dummyDiv = document.createElement('div');
        this.placesService = new google.maps.places.PlacesService(dummyDiv);
        
        this.isInitialized = true;
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Geocode an address to coordinates
  async geocodeAddress(address: string): Promise<GeocodingResult | null> {
    if (!this.isInitialized) {
      await this.init();
    }

    if (!this.geocoder) {
      throw new Error('Geocoder not initialized');
    }

    return new Promise((resolve, reject) => {
      this.geocoder!.geocode(
        { address: address },
        (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            resolve({
              lat: location.lat(),
              lng: location.lng(),
              formattedAddress: results[0].formatted_address,
              placeId: results[0].place_id
            });
          } else {
            console.warn('Geocoding failed:', status);
            resolve(null);
          }
        }
      );
    });
  }

  // Reverse geocode coordinates to address
  async reverseGeocode(lat: number, lng: number): Promise<GeocodingResult | null> {
    if (!this.isInitialized) {
      await this.init();
    }

    if (!this.geocoder) {
      throw new Error('Geocoder not initialized');
    }

    return new Promise((resolve, reject) => {
      this.geocoder!.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            resolve({
              lat: location.lat(),
              lng: location.lng(),
              formattedAddress: results[0].formatted_address,
              placeId: results[0].place_id
            });
          } else {
            console.warn('Reverse geocoding failed:', status);
            resolve(null);
          }
        }
      );
    });
  }

  // Get place suggestions for autocomplete
  async getPlaceSuggestions(query: string): Promise<PlaceSuggestion[]> {
    if (!this.isInitialized) {
      await this.init();
    }

    if (!this.autocompleteService) {
      throw new Error('AutocompleteService not initialized');
    }

    return new Promise((resolve, reject) => {
      this.autocompleteService!.getPlacePredictions(
        {
          input: query,
          types: ['establishment', 'geocode'],
          componentRestrictions: { country: 'in' } // Restrict to India
        },
        (predictions, status) => {
          if (status === 'OK' && predictions) {
            const suggestions: PlaceSuggestion[] = predictions.map(prediction => ({
              placeId: prediction.place_id,
              description: prediction.description,
              mainText: prediction.structured_formatting.main_text,
              secondaryText: prediction.structured_formatting.secondary_text
            }));
            resolve(suggestions);
          } else {
            console.warn('Place suggestions failed:', status);
            resolve([]);
          }
        }
      );
    });
  }

  // Get place details by place ID
  async getPlaceDetails(placeId: string): Promise<GeocodingResult | null> {
    if (!this.isInitialized) {
      await this.init();
    }

    if (!this.placesService) {
      throw new Error('PlacesService not initialized');
    }

    return new Promise((resolve, reject) => {
      this.placesService!.getDetails(
        {
          placeId: placeId,
          fields: ['geometry', 'formatted_address', 'place_id']
        },
        (place, status) => {
          if (status === 'OK' && place && place.geometry) {
            const location = place.geometry.location!;
            resolve({
              lat: location.lat(),
              lng: location.lng(),
              formattedAddress: place.formatted_address || '',
              placeId: place.place_id
            });
          } else {
            console.warn('Place details failed:', status);
            resolve(null);
          }
        }
      );
    });
  }

  // Get current location using browser geolocation
  async getCurrentLocation(): Promise<GeocodingResult | null> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const result = await this.reverseGeocode(latitude, longitude);
            resolve(result);
          } catch (error) {
            // If reverse geocoding fails, return coordinates with basic info
            resolve({
              lat: latitude,
              lng: longitude,
              formattedAddress: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            });
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }
}

// Create singleton instance
export const geocodingService = new GeocodingService();

// Global callback for Google Maps initialization
declare global {
  interface Window {
    initGoogleMaps: () => void;
  }
}

// Initialize when Google Maps loads
window.initGoogleMaps = () => {
  geocodingService.init().catch(console.error);
};

export default geocodingService;
