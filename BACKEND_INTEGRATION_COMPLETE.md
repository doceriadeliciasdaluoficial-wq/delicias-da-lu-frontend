# Backend Integration - Changes Made

## Summary
Implemented missing fields and endpoints in the backend to support all frontend requirements. Updated frontend services to work with the new backend structure.

---

## Backend Changes (Go Service - delicias-da-lu-service)

### 1. CakeBuilderComponent Entity Updated
**File**: `internal/entity/cakebuilder/model.go`

**Added Fields**:
```go
Label             string    - Display name for UI (e.g., "Chocolate", "Ninho")
Value             float64   - Price increment for calculation
Description       string    - Short description
FullDescription   *string   - Extended description (for masses)
Weight            *string   - Weight info (for sizes, e.g., "1000g")
Servings          *string   - Servings (for sizes, e.g., "8-10 pessoas")
Note              *string   - Special notes (for decorations)
```

### 2. Contact Entity Restructured
**File**: `internal/entity/contact/model.go`

**Previous Structure**:
```go
Contact {
  WhatsApp: WhatsAppInfo
  Email: string
  Instagram: string
  Address: string
  Phone: string
}
```

**New Structure**:
```go
Contact {
  WhatsApp: WhatsAppInfo
  Email: EmailInfo              // Changed from string to object
  Instagram: InstagramInfo      // Changed from string to object
  Address: *string
  Phone: *string
  Location: *Location           // NEW
}

WhatsAppInfo {
  Number: string
  Link: string
  Display: *string              // NEW
  Message: *WhatsAppMessages    // NEW
}

WhatsAppMessages {
  Default: *string
  Order: *string
  Custom: *string
}

EmailInfo {
  Address: string
  Subject: *string              // NEW
}

InstagramInfo {
  Handle: *string               // NEW
  URL: *string                  // NEW
  EmbedURL: *string             // NEW
}

Location {
  Name: *string
  Address: *string
  Coordinates: *Coordinates
  MapsUrl: *string
}

Coordinates {
  Lat: float64
  Lng: float64
}
```

### 3. Home Configuration Added
**File**: `internal/entity/config/home.go` (NEW)

```go
HomeConfig {
  FeaturedCakes: []FeaturedCake
}

FeaturedCake {
  ID: string
  Name: string
  DefaultWeight: string
  DefaultConfig: string
  BasePrice: float64
  Tag: *string
  Image: string
  Description: string
  Config: map[string]interface{}
}
```

### 4. SiteConfig Updated
**File**: `internal/entity/config/model.go`

**Added Field**:
```go
Home: *HomeConfig   // NEW - optional home configuration
```

---

## Frontend Changes

### 1. New Service: homeService
**File**: `src/services/homeService.js`

```javascript
getHome()  - GET /config/public (returns home from response)
updateHome(homeConfig) - PUT /config/admin (updates home section)
```

### 2. Updated SiteDataContext
**File**: `src/context/SiteDataContext.jsx`

**Changes**:
- Imports homeService
- Loads homeData from API in useEffect
- Applies home data to siteConfig if available
- Handles backwards compatibility for contact structure (string vs object)

### 3. Contact Handling Improved
**File**: `src/context/SiteDataContext.jsx`

Added fallback logic to handle both old (string) and new (object) contact formats:
```javascript
email: typeof siteConfig.contacts.email === 'string' ? 
  { address: siteConfig.contacts.email } : 
  (siteConfig.contacts.email || {})
```

---

## API Endpoints Updated

### Menu Endpoints
- GET `/menu/items` - List all (no change)
- POST `/menu/items` - Create (no change)
- GET `/menu/items/{id}` - Get by ID (no change)
- PUT `/menu/items/{id}` - Update (no change)
- DELETE `/menu/items/{id}` - Delete (no change)
- PATCH `/menu/items/{id}/order` - Update order (no change)

### Cake Builder Endpoints
- GET `/cake-builder` - Returns object with massas, recheios, coberturas, decoracoes (UPDATED - new fields)
- GET `/cake-builder/{type}` - Get by type (UPDATED - new fields)
- GET `/cake-builder/{type}/{id}` - Get specific (UPDATED - new fields)
- POST `/cake-builder/{type}` - Create (UPDATED - new fields)
- PUT `/cake-builder/{type}/{id}` - Update (UPDATED - new fields)
- DELETE `/cake-builder/{type}/{id}` - Delete (no change)

### Contact Endpoints
- GET `/contacts` - Get contacts (UPDATED - new structure)
- PUT `/contacts` - Update contacts (UPDATED - new structure)

### Config Endpoints
- GET `/config/public` - Returns SiteConfig with home section (UPDATED)
- PUT `/config/admin` - Update full config including home (UPDATED)

---

## Data Flow

### Loading Featured Cakes
```
SiteDataProvider mounts
  → homeService.getHome() calls GET /config/public
  → Extracts home.featuredCakes
  → Merges into siteConfig.home
  → Available via useSiteData().siteConfig.home
```

### Loading Cake Builder Components
```
SiteDataProvider mounts
  → cakeBuilderService.getAll() calls GET /cake-builder
  → Returns { massas: [...], recheios: [...], coberturas: [...], decoracoes: [...] }
  → Each component now has: label, value, description, fullDescription, weight, servings, note
```

### Loading Contacts
```
SiteDataProvider mounts
  → contactService.getContacts() calls GET /contacts
  → Returns Contact object with nested Email, Instagram, Location
  → SiteDataContext normalizes for backwards compatibility
```

---

## Backend Implementation Checklist

- [x] CakeBuilderComponent - Added label, value, fullDescription, weight, servings, note
- [x] Contact - Restructured to nested objects
- [x] HomeConfig - Created new entity for featured cakes
- [x] SiteConfig - Added home field
- [x] Config handlers - Already support new structure via SiteConfig

**Note**: No handler changes needed in config/handler.go as it uses SiteConfig struct which now includes Home field.

---

## Frontend Implementation Checklist

- [x] homeService - New service for home data
- [x] SiteDataContext - Updated to load home data
- [x] Contact handling - Added backwards compatibility
- [x] Imports - Added homeService import

---

## Known Backwards Compatibility

The frontend handles both old and new contact formats:
- Old format: `email: "string"`
- New format: `email: { address: "string", subject?: "string" }`

Frontend automatically converts old format to new object format for consistency.

---

## Testing Checklist

- [ ] Backend returns CakeBuilderComponent with all new fields
- [ ] Backend returns Contact with nested structures
- [ ] Backend returns SiteConfig.home with featured cakes
- [ ] Frontend loads and displays all new fields correctly
- [ ] Featured cakes appear on home page
- [ ] Cake builder display works with label and value fields
- [ ] Contact information displays correctly
- [ ] Admin panel can update all new fields
