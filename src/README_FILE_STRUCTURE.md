# Raahi File Structure Documentation

## Overview
This document explains the file structure for the Raahi cab application.

## Directory Structure

### `/components/`
Contains all React components organized by functionality:

- **Core Components**: Main screen components like DashboardScreen, BookingScreen, etc.
- **`/auth/`**: Authentication-related components (login buttons, etc.)
- **`/common/`**: Shared components like Footer
- **`/figma/`**: Figma-specific components like ImageWithFallback
- **`/ui/`**: ShadCN UI components

### `/screens/`
Contains screen-level components and exports:
- `LoginScreen.tsx`: Main login screen
- `index.ts`: Centralized exports for all screens

### `/hooks/`
Custom React hooks:
- `useAppState.ts`: Main app state management hook
- `index.ts`: Hook exports

### `/utils/`
Utility functions and constants:
- `constants.ts`: App constants and configuration
- `index.ts`: Utility exports

### `/imports/`
Figma-imported assets and SVG paths

### `/services/`
API services and external integrations:
- `driver/`: Driver-specific API services
- `passenger/`: Passenger-specific API services

## Import Guidelines

1. **Screens**: Import from `/screens/` for screen-level components
2. **Components**: Import directly from `/components/[category]/`
3. **Hooks**: Import from `/hooks/`
4. **Utils**: Import from `/utils/`

## Circular Dependency Prevention

- Avoid importing from `/components/screens/` (deprecated)
- Use direct imports from source directories
- Keep exports in index files simple and flat