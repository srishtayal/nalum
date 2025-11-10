# Notable Alumni Image Guide

## Image Directory Structure

Place all alumni images in: `/home/not-manik/Desktop/nalum/frontend/public/notable-alumni/`

## Required Images

For each alumni, you need 2 images:

### 1. Naveen Kasturia
- `naveen-kasturia-1.jpg` (Main professional photo)
- `naveen-kasturia-2.jpg` (Secondary/candid photo)

### 2. Nitin Rakesh
- `nitin-rakesh-1.jpg`
- `nitin-rakesh-2.jpg`

### 3. Ishan Gupta
- `ishan-gupta-1.jpg`
- `ishan-gupta-2.jpg`

### 4. Paavan Nanda
- `paavan-nanda-1.jpg`
- `paavan-nanda-2.jpg`

### 5. Prashasti Singh
- `prashasti-singh-1.jpg`
- `prashasti-singh-2.jpg`

### 6. Prayag Narula
- `prayag-narula-1.jpg`
- `prayag-narula-2.jpg`

### 7. Aman Dhattarwal
- `aman-dhattarwal-1.jpg`
- `aman-dhattarwal-2.jpg`

### 8. Shradha Khapra
- `shradha-khapra-1.jpg`
- `shradha-khapra-2.jpg`

### 9. Love Babbar
- `love-babbar-1.jpg`
- `love-babbar-2.jpg`

## Image Guidelines

### Main Image (Image 1):
- **Dimensions**: 800x1000px (portrait orientation)
- **Format**: JPG or PNG
- **Style**: Professional headshot or action shot
- **Quality**: High resolution, well-lit

### Secondary Image (Image 2):
- **Dimensions**: 400x400px (square)
- **Format**: JPG or PNG
- **Style**: Candid, working, or event photo
- **Quality**: Good resolution

## Quick Setup Command

```bash
# Create the directory
mkdir -p /home/not-manik/Desktop/nalum/frontend/public/notable-alumni

# After adding images, verify
ls -la /home/not-manik/Desktop/nalum/frontend/public/notable-alumni
```

## Placeholder Images

If you don't have real images yet, you can use placeholder services:
- `https://via.placeholder.com/800x1000/800000/FFFFFF?text=Name` for main
- `https://via.placeholder.com/400x400/800000/FFFFFF?text=Name` for secondary

## Testing Without Images

The component includes:
- Loading states (shimmer effect)
- Fallback handling
- Graceful degradation if images are missing
