// Google Maps TypeScript declarations
declare namespace google {
  namespace maps {
    class Geocoder {
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[] | null, status: GeocoderStatus) => void): void;
    }

    interface GeocoderRequest {
      address?: string;
      location?: LatLng | LatLngLiteral;
      placeId?: string;
    }

    interface GeocoderResult {
      address_components: GeocoderAddressComponent[];
      formatted_address: string;
      geometry: GeocoderGeometry;
      place_id: string;
      types: string[];
    }

    interface GeocoderAddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    interface GeocoderGeometry {
      location: LatLng;
      location_type: GeocoderLocationType;
      viewport: LatLngBounds;
    }

    enum GeocoderLocationType {
      APPROXIMATE = 'APPROXIMATE',
      GEOMETRIC_CENTER = 'GEOMETRIC_CENTER',
      RANGE_INTERPOLATED = 'RANGE_INTERPOLATED',
      ROOFTOP = 'ROOFTOP'
    }

    enum GeocoderStatus {
      ERROR = 'ERROR',
      INVALID_REQUEST = 'INVALID_REQUEST',
      OK = 'OK',
      OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
      REQUEST_DENIED = 'REQUEST_DENIED',
      UNKNOWN_ERROR = 'UNKNOWN_ERROR',
      ZERO_RESULTS = 'ZERO_RESULTS'
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
    }

    namespace places {
      class AutocompleteService {
        getPlacePredictions(request: AutocompleteRequest, callback: (predictions: AutocompletePrediction[] | null, status: PlacesServiceStatus) => void): void;
      }

      class PlacesService {
        constructor(attrContainer: HTMLDivElement | HTMLDivElement);
        getDetails(request: PlaceDetailsRequest, callback: (place: PlaceResult | null, status: PlacesServiceStatus) => void): void;
      }

      interface AutocompleteRequest {
        input: string;
        types?: string[];
        componentRestrictions?: ComponentRestrictions;
      }

      interface ComponentRestrictions {
        country: string | string[];
      }

      interface AutocompletePrediction {
        description: string;
        place_id: string;
        structured_formatting: AutocompleteStructuredFormatting;
        types: string[];
      }

      interface AutocompleteStructuredFormatting {
        main_text: string;
        secondary_text: string;
      }

      interface PlaceDetailsRequest {
        placeId: string;
        fields: string[];
      }

      interface PlaceResult {
        formatted_address?: string;
        geometry?: PlaceGeometry;
        place_id?: string;
      }

      interface PlaceGeometry {
        location: LatLng;
      }

      enum PlacesServiceStatus {
        INVALID_REQUEST = 'INVALID_REQUEST',
        NOT_FOUND = 'NOT_FOUND',
        OK = 'OK',
        OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
        REQUEST_DENIED = 'REQUEST_DENIED',
        UNKNOWN_ERROR = 'UNKNOWN_ERROR',
        ZERO_RESULTS = 'ZERO_RESULTS'
      }
    }
  }
}

// Global Google Maps callback
interface Window {
  initGoogleMaps: () => void;
}
