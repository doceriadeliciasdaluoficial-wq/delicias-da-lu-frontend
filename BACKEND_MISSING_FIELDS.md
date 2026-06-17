# Backend Missing Fields Analysis

## Summary
Comparing frontend data structures with backend swagger definitions reveals several missing fields and endpoints that the frontend requires.

---

## 1. MENU ITEMS - MISSING FIELDS

### Current Backend Schema (from swagger):
```
MenuItem: { id, name, category, price, active, unit, image, description, order, createdAt, updatedAt }
```

### Frontend Needs:
```
MenuItem: { id, name, category, price, unit, image, description }
```

**Status**: ✅ ALIGNED - Backend has all needed fields

---

## 2. CAKE BUILDER COMPONENTS - MISSING FIELDS

### Current Backend Schema (from swagger):
```
CakeBuilderComponent: { id, name, type, price, active, image, order, createdAt, updatedAt }
```

### Frontend Actually Uses (from cakeBuilder.json & OrderBuilder.jsx):
```
Masses/Fillings/Toppings/Decorations: 
{
  id: string,
  label: string,              ❌ MISSING - Used for UI display
  value: number,              ❌ MISSING - Used for pricing calculation
  description: string,        ✅ In backend as "description"
  fullDescription?: string,   ❌ MISSING - Only for masses
  weight?: string,            ❌ MISSING - Only for sizes
  servings?: string,          ❌ MISSING - Only for sizes  
  note?: string,              ❌ MISSING - Only for decorations
  image: string,              ✅ In backend
  order?: number              ✅ In backend
}
```

### Required Changes:
Backend needs to add these fields to CakeBuilderComponent schema:
- **label** (string) - Display name for UI (e.g., "Chocolate", "Ninho", "Ganache")
- **value** (number) - Price increment for this component (frontend uses for calculation)
- **fullDescription** (string, optional) - Extended description for masses only
- **weight** (string, optional) - Weight for sizes (e.g., "1000g")
- **servings** (string, optional) - Servings for sizes (e.g., "8-10 pessoas")
- **note** (string, optional) - Special notes for decorations

---

## 3. CONTACTS - MISSING FIELDS & STRUCTURE

### Current Backend Schema (from swagger):
```
Contact: { 
  whatsapp: { number, link },
  email: string,
  instagram: string,
  address: string,
  phone: string
}
```

### Frontend Actually Uses (from config/contacts.js):
```
Contact: {
  whatsapp: {
    number: string,          ✅
    link: string,            ✅
    display: string,         ❌ MISSING - Formatted display version
    message: {               ❌ MISSING - Message templates
      default: string,
      order: string,
      custom: string
    }
  },
  email: {
    address: string,         ✅ (but backend expects just string)
    subject: string          ❌ MISSING - Email subject template
  },
  instagram: {
    handle: string,          ❌ MISSING - Instagram handle
    url: string,             ❌ MISSING - Instagram profile URL
    embedUrl: string         ❌ MISSING - Instagram embed URL
  },
  location: {                ❌ MISSING - Entire location object
    name: string,
    address: string,
    coordinates: { lat, lng },
    mapsUrl: string
  }
}
```

### Required Changes:
```
Contact: {
  whatsapp: {
    number: string,
    link: string,
    display?: string,              ✅ ADD
    message?: {                    ✅ ADD
      default?: string,
      order?: string,
      custom?: string
    }
  },
  email: {
    address: string,
    subject?: string               ✅ ADD
  },
  instagram: {
    handle?: string,               ✅ ADD
    url?: string,                  ✅ ADD
    embedUrl?: string              ✅ ADD
  },
  address?: string,
  phone?: string,
  location?: {                     ✅ ADD
    name?: string,
    address?: string,
    coordinates?: { lat: number, lng: number },
    mapsUrl?: string
  }
}
```

---

## 4. FEATURED CAKES / HOME CONFIGURATION - MISSING ENDPOINT

### Frontend Uses (from defaultSiteConfig.js):
```
home.featuredCakes: [
  {
    id: string,
    name: string,
    defaultWeight: string,
    defaultConfig: string,
    basePrice: number,
    tag?: string,
    image: string,
    description: string,
    config: { size, mass, filling, topping, decoration }
  }
]
```

### Backend Status:
❌ **NO ENDPOINT** - Featured cakes endpoint is missing entirely

### Required Additions:
Need to add these endpoints:
```
GET /config/home - Get home configuration (public)
  Response: { featuredCakes: [...] }

PUT /config/home - Update home configuration (admin)
  Request: { featuredCakes: [...] }
```

Or update existing `/config/public` to include home section.

---

## 5. ORDER ITEM STRUCTURE - MISSING FIELDS

### Current Backend Schema (from swagger):
```
OrderItem: {
  type: "menu" | "cakeBuilder",
  menuItemId?: string,
  cakeCustomization?: object,
  quantity: number,
  unitPrice: number,
  subtotal: number
}
```

### Frontend Sends (from CartContext):
```
OrderItem: {
  type: "menu" | "cakeBuilder",
  menuItemId?: string,
  cakeCustomization?: {        ✅ OK as generic object
    massa: string,
    recheio: string,
    cobertura: string,
    decoracao: string
  },
  quantity: number,
  unitPrice: number,
  subtotal: number
}
```

**Status**: ✅ ALIGNED - Backend accepts flexible cakeCustomization object

---

## SUMMARY OF MISSING BACKEND FEATURES

### High Priority (Required for functionality):
1. ✅ **Menu Items** - OK, all fields present
2. ❌ **Cake Builder** - Add: `label`, `value`, `fullDescription`, `weight`, `servings`, `note`
3. ❌ **Contacts** - Restructure to nested objects with missing fields
4. ❌ **Featured Cakes** - Add new endpoint `/config/home`
5. ✅ **Orders** - OK, structure matches

### Field Count:
- Menu: 0 missing fields
- Cake Builder: 6 missing fields
- Contacts: 9 missing fields + structural changes
- Home/Featured: Entire endpoint missing

---

## RECOMMENDED BACKEND UPDATES

### 1. CakeBuilderComponent Schema
```go
type CakeBuilderComponent struct {
  ID                string    `json:"id"`
  Name              string    `json:"name"`
  Label             string    `json:"label"`              // ADD
  Type              string    `json:"type"`               // massa, recheio, cobertura, decoracao
  Price             float64   `json:"price"`              // was: "value" -> renamed to "price"
  Value             float64   `json:"value"`              // ADD: duplicate for compatibility
  Description       string    `json:"description"`
  FullDescription   *string   `json:"fullDescription"`    // ADD: optional
  Weight            *string   `json:"weight"`             // ADD: optional, for sizes
  Servings          *string   `json:"servings"`           // ADD: optional, for sizes
  Note              *string   `json:"note"`               // ADD: optional, for decorations
  Image             string    `json:"image"`
  Active            bool      `json:"active"`
  Order             int       `json:"order"`
  CreatedAt         time.Time `json:"createdAt"`
  UpdatedAt         time.Time `json:"updatedAt"`
}
```

### 2. Contact Schema
```go
type WhatsAppInfo struct {
  Number    string            `json:"number"`
  Link      string            `json:"link"`
  Display   *string           `json:"display"`            // ADD
  Message   *WhatsAppMessages `json:"message"`            // ADD
}

type WhatsAppMessages struct {
  Default *string `json:"default"`
  Order   *string `json:"order"`
  Custom  *string `json:"custom"`
}

type EmailInfo struct {
  Address string `json:"address"`
  Subject *string `json:"subject"`                      // ADD
}

type InstagramInfo struct {
  Handle    *string `json:"handle"`                     // ADD
  URL       *string `json:"url"`                        // ADD
  EmbedURL  *string `json:"embedUrl"`                   // ADD
}

type Location struct {
  Name        *string     `json:"name"`                 // ADD
  Address     *string     `json:"address"`              // ADD
  Coordinates *Coordinates `json:"coordinates"`         // ADD
  MapsURL     *string     `json:"mapsUrl"`              // ADD
}

type Coordinates struct {
  Lat float64 `json:"lat"`
  Lng float64 `json:"lng"`
}

type Contact struct {
  WhatsApp WhatsAppInfo  `json:"whatsapp"`
  Email    EmailInfo     `json:"email"`                 // Changed from string to object
  Instagram InstagramInfo `json:"instagram"`             // Changed from string to object
  Address  *string       `json:"address"`
  Phone    *string       `json:"phone"`
  Location *Location     `json:"location"`              // ADD
}
```

### 3. Add Home Endpoint
```go
type FeaturedCake struct {
  ID              string                 `json:"id"`
  Name            string                 `json:"name"`
  DefaultWeight   string                 `json:"defaultWeight"`
  DefaultConfig   string                 `json:"defaultConfig"`
  BasePrice       float64                `json:"basePrice"`
  Tag             *string                `json:"tag"`
  Image           string                 `json:"image"`
  Description     string                 `json:"description"`
  Config          map[string]interface{} `json:"config"`
}

type HomeConfig struct {
  FeaturedCakes []FeaturedCake `json:"featuredCakes"`
}

type SiteConfig struct {
  Home          HomeConfig      `json:"home"`           // ADD
  Menu          MenuConfig      `json:"menu"`
  CakeBuilder   CakeBuilderConfig `json:"cakeBuilder"`
  Contacts      Contact         `json:"contacts"`
}
```

Add endpoints:
```
GET /config/public  - Returns SiteConfig with home section
PUT /config/admin   - Can update all including home section
```
