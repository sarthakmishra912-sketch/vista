# 🎨 RideApp Design Specifications

## 📐 **Layout Specifications**

### **Screen Dimensions**
- **Mobile**: 375x812px (iPhone X/11/12 standard)
- **Safe Area**: Top 44px, Bottom 34px
- **Status Bar**: 44px height
- **Tab Bar**: 83px height (49px + 34px safe area)

### **Grid System**
- **Base Unit**: 8px
- **Margins**: 16px (2 units)
- **Padding**: 8px, 16px, 24px
- **Border Radius**: 8px, 12px, 16px
- **Elevation**: 2px, 4px, 8px shadows

## 🎨 **Color Palette (HEX Codes)**

### **Primary Colors**
- **Primary Red**: `#FF6B6B` - Main brand color
- **Primary Dark**: `#E85555` - Pressed state
- **Primary Light**: `#FFB3B3` - Disabled state

### **Secondary Colors**
- **Teal**: `#4ECDC4` - Secondary actions
- **Sky Blue**: `#45B7D1` - Success states
- **Orange**: `#FFA726` - Warning states
- **Green**: `#66BB6A` - Online/active states

### **Neutral Colors**
- **Dark Blue**: `#2C3E50` - Primary text
- **Medium Gray**: `#7F8C8D` - Secondary text
- **Light Gray**: `#BDC3C7` - Borders
- **Background**: `#F8F9FA` - Screen background
- **White**: `#FFFFFF` - Card backgrounds
- **Black**: `#000000` - High contrast text

### **Status Colors**
- **Success**: `#27AE60` - Completed rides
- **Warning**: `#F39C12` - Pending states
- **Error**: `#E74C3C` - Cancelled/error states
- **Info**: `#3498DB` - Information states

## 🔤 **Typography System**

### **Font Family**
- **Primary**: SF Pro Display (iOS) / Roboto (Android)
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

### **Font Sizes & Weights**
```
H1 - 32px, Bold (700)     - Page titles
H2 - 24px, Bold (700)     - Section headers
H3 - 20px, SemiBold (600) - Card titles
H4 - 18px, SemiBold (600) - Subsection headers
Body - 16px, Regular (400) - Main content
Caption - 14px, Regular (400) - Supporting text
Small - 12px, Regular (400) - Labels, timestamps
Button - 16px, SemiBold (600) - Button text
```

### **Line Heights**
- **Headers**: 1.2x font size
- **Body text**: 1.5x font size
- **Captions**: 1.4x font size

## 📱 **Component Specifications**

### **Buttons**

#### **Primary Button**
```
Background: #FF6B6B
Text: #FFFFFF, 16px, SemiBold
Height: 48px
Border Radius: 12px
Padding: 0 24px
Shadow: 0 2px 8px rgba(255, 107, 107, 0.3)

States:
- Normal: #FF6B6B
- Pressed: #E85555
- Disabled: #FFB3B3
```

#### **Secondary Button**
```
Background: Transparent
Border: 1px solid #FF6B6B
Text: #FF6B6B, 16px, SemiBold
Height: 48px
Border Radius: 12px
Padding: 0 24px
```

### **Input Fields**
```
Background: #FFFFFF
Border: 1px solid #BDC3C7
Text: #2C3E50, 16px, Regular
Height: 48px
Border Radius: 8px
Padding: 0 16px
Placeholder: #7F8C8D

Focus State:
Border: 2px solid #FF6B6B
Shadow: 0 0 0 3px rgba(255, 107, 107, 0.1)
```

### **Cards**
```
Background: #FFFFFF
Border Radius: 12px
Shadow: 0 2px 12px rgba(0, 0, 0, 0.08)
Padding: 16px
Margin: 8px horizontal, 4px vertical
```

### **Map Markers**

#### **User Location**
```
Size: 20px circle
Background: #FF6B6B
Border: 3px solid #FFFFFF
Shadow: 0 2px 8px rgba(0, 0, 0, 0.3)
```

#### **Driver Markers**
```
Size: 32x32px
Background: #FFFFFF
Car Icon: #FF6B6B
Border Radius: 50%
Shadow: 0 2px 8px rgba(0, 0, 0, 0.2)
```

#### **Pickup/Destination**
```
Pickup: Green circle (#27AE60) with white dot
Destination: Red circle (#E74C3C) with white square
Size: 24px
```

## 📐 **Layout Components**

### **Header**
```
Height: 60px (+ safe area)
Background: #FFFFFF
Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
Title: H3 style, centered
Back Button: 24x24px, left aligned
Action Button: 24x24px, right aligned
```

### **Tab Bar**
```
Height: 49px (+ safe area)
Background: #FFFFFF
Shadow: 0 -1px 3px rgba(0, 0, 0, 0.1)
Icons: 24x24px
Active Color: #FF6B6B
Inactive Color: #7F8C8D
Text: 12px, Medium
```

### **Status Bar**
```
Height: 40px
Background: Gradient (#FF6B6B to #E85555)
Text: #FFFFFF, 14px, SemiBold
Border Radius: 8px (bottom only)
Margin: 16px horizontal
```

## 🗺️ **Map Styling**

### **Map Theme** (Google Maps)
```json
[
  {
    "featureType": "all",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#F8F9FA"}]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#FFFFFF"}]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#45B7D1"}]
  },
  {
    "featureType": "poi",
    "elementType": "labels",
    "stylers": [{"visibility": "off"}]
  }
]
```

### **Route Line**
```
Color: #FF6B6B
Width: 4px
Pattern: Solid
Opacity: 0.8
```

## 🎭 **Animation Specifications**

### **Transitions**
```
Duration: 300ms
Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
Types:
- Fade: opacity 0 → 1
- Slide: translateY(20px) → 0
- Scale: scale(0.95) → 1
```

### **Loading States**
```
Skeleton: #F0F0F0 background with shimmer
Spinner: #FF6B6B color, 24px size
Progress: #FF6B6B fill, #E0E0E0 background
```

## 📊 **Icon System**

### **Icon Library**: Expo Vector Icons (Ionicons)
### **Sizes**: 16px, 20px, 24px, 32px
### **Colors**: 
- Primary: #FF6B6B
- Secondary: #7F8C8D
- Success: #27AE60
- Warning: #F39C12
- Error: #E74C3C

### **Common Icons**
```
Home: home-outline
Profile: person-outline
History: time-outline
Settings: settings-outline
Location: location-outline
Car: car-outline
Phone: call-outline
Message: chatbubble-outline
Star: star
Navigation: navigation-outline
```

## 📱 **Screen Templates**

### **Full Screen Map**
```
Header: 60px
Map: Remaining height
Bottom Sheet: 200-400px (draggable)
Floating Button: 56px, bottom-right corner
```

### **List Screen**
```
Header: 60px
Search Bar: 48px (optional)
List Items: 72px height each
Tab Bar: 49px + safe area
```

### **Form Screen**
```
Header: 60px
Content: Scrollable with 16px margins
Input Fields: 48px height, 16px spacing
Buttons: 48px height, 24px from last input
```

## 🎨 **Creating Visual Mockups**

### **Using Figma (Recommended)**
1. Create new file with 375x812px frame
2. Apply color palette from this spec
3. Use SF Pro Display font
4. Import icons from Ionicons
5. Create components for buttons, cards, inputs

### **Using Adobe XD**
1. Create artboard with iPhone X template
2. Set up color swatches
3. Configure text styles
4. Create symbol library
5. Design with specifications above

### **Using Sketch**
1. Use iOS UI kit template
2. Customize with color palette
3. Create text styles
4. Build symbol library
5. Apply design system

## 📋 **Design Checklist**

- [ ] Consistent 8px grid system
- [ ] Proper color contrast (4.5:1 minimum)
- [ ] Touch targets minimum 44px
- [ ] Consistent spacing and alignment
- [ ] Proper visual hierarchy
- [ ] Loading and error states
- [ ] Responsive behavior
- [ ] Dark mode variants (optional)

This specification provides everything needed to create pixel-perfect visual mockups of your ride-hailing app in any design tool!