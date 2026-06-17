# Image Upload Testing Guide

## Prerequisites
- Admin panel is running and accessible
- You're authenticated as an admin
- Backend API is running and responding

## Test Steps

### 1. Access Admin Panel

```bash
# Navigate to the admin panel
# URL: http://localhost:5173/painel-interno-secreto-lu

# Login with test credentials:
# Username: (your configured username)
# Password: (your configured password hash)
```

### 2. Upload Image for Menu Item

1. **Navigate to Menu Tab**
   - Click on the **Menu** tab in the admin panel
   - Select a category (e.g., "Bolos")

2. **Create or Edit a Menu Item**
   - Click "Novo item" button or click edit on existing item
   - Fill in the form fields:
     - ID: unique identifier
     - Name: item name
     - Category: category name
     - Price: item price
     - Description: item description

3. **Upload Image**
   - In the ImageUploader component, you'll see:
     - "Choose File" button - click to select image from computer
     - "Or paste image URL" - paste a URL to an image
   
   **Image Requirements:**
   - Max file size: 5MB
   - Allowed formats: JPEG, PNG, WebP
   - Recommended size: 800x600px or similar

4. **Verify Preview**
   - After upload, you should see a preview of the image
   - File size is displayed below preview
   - Click "Remove" to clear the image

5. **Save Item**
   - Click "Salvar item" button
   - Image is converted to base64 and sent to backend
   - Check browser console for any errors

### 3. Upload Image for Cake Builder Component

1. **Navigate to Cake Builder Tab**
   - Click on "Cake Builder" in admin panel
   - Select a component type: Massas, Recheios, Coberturas, or Decorações

2. **Create Component with Image**
   - Click "Novo item" button
   - Fill in component details
   - Use ImageUploader to select and preview image
   - Click "Salvar item"

### 4. Upload Image for Featured Cake

1. **Navigate to Home Tab**
   - If available, access featured cakes section
   - Create or edit featured cake
   - Upload image and save

### 5. Verify Image Display

After uploading and saving, verify images display in:

- **Menu Page** (`/menu`)
  - Navigate to Menu page
  - Check each tab (Bolos, Doces Simples, etc.)
  - Images should display in grid with fallback emoji if missing

- **Home Page** (`/`)
  - Check featured cakes carousel
  - Should display images on desktop and mobile
  - Hover should show scale effect

- **Admin Panel**
  - Images should show preview in form
  - List items should display images when available

## Troubleshooting

### Issue: Image Won't Upload

**Solution:**
- Check file size (must be < 5MB)
- Verify file format (JPEG, PNG, or WebP only)
- Check browser console for error messages
- Ensure network request succeeded (check Network tab in DevTools)

### Issue: Image Shows as "No image"

**Possible Causes:**
- Base64 string is empty
- Image wasn't properly converted
- Backend didn't save the image data

**Solution:**
- Re-upload the image
- Check that the save request included the image
- Verify Firestore document contains Image field

### Issue: Image Display Broken After Save

**Solution:**
- Check ImageDisplay component renders correctly
- Verify base64 string is valid
- Check browser console for conversion errors
- Try clearing browser cache

### Issue: Memory Leaks with Multiple Images

**Solution:**
- Component automatically cleans up blob URLs
- Check DevTools Memory tab for blob URLs
- Should be cleaned after component unmounts

## Performance Testing

### Test Large Image Upload

1. Create test image (4-5MB)
2. Upload and observe performance
3. Check UI responsiveness during upload
4. Verify no freezing occurs

### Test Multiple Image Uploads

1. Upload 10+ items with images
2. Navigate between pages
3. Check memory usage in DevTools
4. Verify no memory leaks

### Test Image Display Performance

1. Load page with 50+ images
2. Scroll and check FPS
3. Verify images load smoothly
4. Check CPU usage

## Browser DevTools Checks

### Check Network Tab

1. Open DevTools → Network tab
2. Upload image
3. Look for POST/PUT request to `/menu/items` or similar
4. Verify request includes `image` field with base64 string
5. Confirm response status is 200/201

### Check Storage

1. Open DevTools → Application → Storage
2. Check Firestore (if using Firebase)
3. Navigate to your document
4. Look for `Image` field containing base64 string
5. Verify data integrity

### Check Console

1. Watch for error messages
2. Check for validation warnings
3. Verify no CORS errors
4. Look for type mismatches

## Success Criteria

✅ **Image Upload Successful When:**
- File selected shows preview in ImageUploader
- Save button sends request to backend
- Response includes image in data
- Image displays in list view
- Image displays on public pages (Menu, Home)
- No console errors
- No memory leaks
- Performance is acceptable

## Quick Test Command (curl)

```bash
# Create menu item with image from URL
curl -X POST http://localhost:8080/v1/menu/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "id": "test-cake-1",
    "name": "Test Cake with Image",
    "category": "Test Category",
    "price": 45.00,
    "image": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "description": "Test cake with base64 image",
    "active": true
  }'
```

## Testing Checklist

- [ ] Can upload JPEG image
- [ ] Can upload PNG image
- [ ] Can upload WebP image
- [ ] Image preview shows after upload
- [ ] File size displays correctly
- [ ] Can remove uploaded image
- [ ] Save request includes image
- [ ] Image displays in admin list
- [ ] Image displays on Menu page
- [ ] Image displays on Home page
- [ ] Mobile view displays images
- [ ] No console errors
- [ ] No memory leaks
- [ ] Performance acceptable with 10+ images
- [ ] Image persists after page refresh

## Notes

- Images are stored as base64 strings directly in Firestore
- Each image is converted when displayed (blob URL generation)
- Memory cleanup happens automatically on component unmount
- Maximum file size is 5MB to prevent performance issues
- Supported formats: JPEG, PNG, WebP
