# Cipher Twitch Overlay

Responsive, animated Twitch streaming overlay designed for ultrawide monitors (3440x1440) with voice-reactive features

## Features

- **Responsive Design**: Scales perfectly from ultrawide (3440x1440) down to mobile
- **Voice Activity Detection**: Real-time microphone input analysis with visual feedback
- **Animated Elements**: Smooth transitions, typing effects, and particle animations
- **Cyberpunk Aesthetic**: Dark theme with green accents and monospace typography
- **Corner Brackets**: Animated corner elements that frame the stream
- **Live Status**: Dynamic stream status with typewriter effects
- **Voice-Reactive Avatar**: Monster character that responds to voice input

## Technology Stack

- **Runtime**: Bun
- **Framework**: React with TypeScript
- **Styling**: CSS-in-JS with responsive design
- **Audio**: Web Audio API for voice detection
- **Build**: Bun build (no Vite/Webpack)
- **Formatting**: dprint

## Setup

1. Install dependencies:
```bash
bun install
```

2. Start development server:
```bash
bun run dev
```

3. Build for production:
```bash
bun run build
```

4. Format code:
```bash
bun run format
```

## Usage in OBS

1. Add a "Browser Source" in OBS
2. Set URL to your local development server or built version
3. Set Width: 3440, Height: 1440
4. Enable "Shutdown source when not visible" and "Refresh browser when scene becomes active"
5. The overlay will automatically request microphone permissions for voice reactivity

## Customization

- **Colors**: Modify the CSS custom properties in each component
- **Animations**: Adjust animation durations and easing functions
- **Voice Sensitivity**: Change the threshold in `useVoiceActivity` hook
- **Layout**: Modify component positions in the responsive breakpoints

## Components

- `StreamOverlay`: Main container with responsive scaling
- `CornerBrackets`: Animated corner frame elements
- `Header`: Cipher branding with typing animation
- `SideCards`: About Me and Links cards with hover effects
- `StreamStatus`: Dynamic status display with matrix background
- `VoiceReactiveAvatar`: Monster character with voice detection
- `MicrophonePermission`: Permission request modal

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Limited Web Audio API support
