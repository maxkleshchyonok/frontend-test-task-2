# PWA Setup Verification

This document explains how to verify your PWA setup is working correctly.

## Prerequisites

- Node.js version >= 20.9.0 (required for Next.js 16)

## Build and Test PWA

1. **Build the production version**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

3. **Test PWA Features**:
   - Open http://localhost:3000 in Chrome or Edge
   - Open DevTools (F12)
   - Go to Application tab > Manifest
   - Verify the manifest is loaded correctly
   - Go to Application tab > Service Workers
   - Verify the service worker is registered
   - Check for install prompt (may appear in address bar)

## PWA Features Included

✅ **Manifest File** (`public/manifest.json`)
- App name, description, and theme colors
- App icon configuration
- Display mode set to standalone

✅ **Service Worker** (auto-generated in production)
- Caching strategy for offline support
- Auto-update functionality
- Disabled in development for better DX

✅ **Meta Tags** (in `src/app/layout.tsx`)
- Theme color
- Apple Web App capable
- Viewport settings

✅ **Icons**
- SVG icon at `public/icon.svg`
- You can replace this with your own PNG icons (192x192 and 512x512)

## Customizing Your PWA

### Update App Name and Colors

Edit `public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "App",
  "theme_color": "#your-color",
  "background_color": "#your-bg-color"
}
```

### Add Custom Icons

Replace `public/icon.svg` with your own icons, or add PNG versions:
- `public/icon-192x192.png` (192x192 pixels)
- `public/icon-512x512.png` (512x512 pixels)

Then update `public/manifest.json` to reference them.

### Configure Caching Strategy

Edit `next.config.ts` to customize the PWA behavior:
```typescript
export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // Add more options here
})(nextConfig);
```

## Troubleshooting

**Service Worker not registering?**
- Make sure you're testing in production mode (`npm run build && npm start`)
- PWA is disabled in development mode by default

**Install prompt not showing?**
- Clear browser cache and service workers
- Make sure all PWA criteria are met (HTTPS in production, valid manifest, etc.)

**Icons not appearing?**
- Check browser console for icon loading errors
- Verify icon paths in manifest.json are correct
