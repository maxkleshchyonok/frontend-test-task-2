# Tailwind CSS Configuration

This project uses Tailwind CSS with a custom configuration for theming and styling.

## Custom Theme Configuration

### Colors

The configuration includes three custom color palettes:

- **Primary** - Blue shades (50-950)
- **Secondary** - Purple shades (50-950)
- **Accent** - Green shades (50-950)

Plus semantic colors that adapt to light/dark themes:
- `background`, `foreground`
- `card`, `card-foreground`
- `popover`, `popover-foreground`
- `muted`, `muted-foreground`
- `border`, `input`, `ring`

### Usage Examples

```tsx
// Using custom color palette
<div className="bg-primary-500 text-white">Primary Button</div>
<div className="bg-secondary-600 hover:bg-secondary-700">Secondary Button</div>
<div className="border-accent-400">Accent Border</div>

// Using semantic colors (auto-adapts to theme)
<div className="bg-background text-foreground">Themed content</div>
<div className="bg-card border-border">Card component</div>
<div className="bg-muted text-muted-foreground">Muted text</div>
```

## Theme Switching

### Light/Dark Mode

The app supports three theme modes:
- **Light** - Always light theme
- **Dark** - Always dark theme
- **System** - Follows system preference

### Using the Theme

```tsx
import { useTheme } from "@/components/ThemeProvider";

function MyComponent() {
  const { theme, setTheme, actualTheme } = useTheme();
  
  return (
    <div>
      <button onClick={() => setTheme("dark")}>Dark Mode</button>
      <button onClick={() => setTheme("light")}>Light Mode</button>
      <button onClick={() => setTheme("system")}>System</button>
      <p>Current theme: {actualTheme}</p>
    </div>
  );
}
```

## Custom Animations

```tsx
// Fade in animation
<div className="animate-fade-in">Fades in</div>

// Slide in animation
<div className="animate-slide-in">Slides in from top</div>

// Slow bounce
<div className="animate-bounce-slow">Bounces slowly</div>
```

## Custom Spacing

Extended spacing utilities:
- `18` (4.5rem)
- `88` (22rem)
- `100` (25rem)
- `112` (28rem)
- `128` (32rem)

```tsx
<div className="p-18">Extra padding</div>
<div className="w-128">Wide container</div>
```

## Custom Shadows

```tsx
// Soft shadow
<div className="shadow-soft">Subtle shadow</div>

// Glow effect
<div className="shadow-glow">Glowing effect</div>
```

## Border Radius

Custom radius variables:
```tsx
<div className="rounded-lg">Large radius (uses --radius-lg)</div>
<div className="rounded-md">Medium radius (uses --radius-md)</div>
<div className="rounded-sm">Small radius (uses --radius-sm)</div>
```

## Customization

To modify colors, update `tailwind.config.ts`:

```ts
colors: {
  primary: {
    500: "#your-color",
    // ... other shades
  },
}
```

To modify theme colors, update CSS variables in `globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  /* ... other variables */
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... other variables */
}
```
