# Repository Instructions

## Styling
- Prefer NativeWind/Tailwind `className` for React Native component styling.
- Avoid `StyleSheet.create` for new UI work unless a value cannot reasonably be represented with Tailwind classes, such as runtime animated/interpolated values.
- Keep reusable UI components styled through their own class names so screens do not need to patch component internals.
