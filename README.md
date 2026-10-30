# Samvit's Kitchen

An interactive portfolio website (samvitchoudhary.dev) featuring a watercolor kitchen scene where visitors can explore different aspects of my work and interests.

## Tech Stack

- **Framework**: Next.js 16.4.3 (App Router)
- **React**: 19.3.1
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion 12.38.0
- **Physics**: Matter.js 0.20.0 (for the fridge game)
- **Font**: Crimson Pro (Google Fonts)
- **TypeScript**: 5

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the kitchen.

Build for production:

```bash
npm run build
npm start
```

Lint the codebase:

```bash
npm run lint
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── about/             # About page with scrolling story
│   ├── contact/           # Contact page with interactive post-it
│   ├── fridge/            # Fridge physics game (dev only)
│   ├── projects/          # Cookbook-style projects page
│   ├── resume/            # Resume viewer
│   ├── skills/            # Skills spice rack
│   ├── layout.tsx         # Root layout with Crimson Pro font
│   └── page.tsx           # Home page (kitchen scene)
├── components/
│   ├── about/             # About page scroll components
│   ├── fridge/            # Fridge game physics and ingredients
│   ├── kitchen/           # Kitchen effects (steam, fireflies, dust, lamp glow)
│   ├── projects/          # Cookbook recipe layouts
│   ├── sections/          # Modal sections (cooking, etc.)
│   ├── KitchenHotspotOverlay.tsx
│   ├── KitchenScene.tsx   # Main kitchen with clickable hotspots
│   └── Modal.tsx          # Themed modal wrapper
├── data/                  # Content data (hotspots, projects, etc.)
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities (geometry, routes, animations)
└── types/                 # TypeScript type definitions

public/
├── aboutMeImages/         # Photos for the about page
├── fridge/                # Ingredient PNGs for fridge game
├── Contact.png            # Contact page background
├── PersonalWebsite.png    # Main kitchen illustration
├── Skills.png             # Skills page spice rack
└── SamvitChoudhary_Resume.pdf
```

## Features

- **Interactive Kitchen**: Hover over items (stove, fridge, cookbook, etc.) to explore different sections
- **Watercolor Aesthetic**: Hand-drawn watercolor kitchen with animated effects (steam, fireflies, dust motes)
- **Page Transitions**: Smooth zoom transitions between kitchen and detail pages
- **Fridge Physics Game**: Matter.js-powered ingredient catching game (development only)
- **Responsive**: Works on mobile and desktop
- **Themed Modals**: Each hotspot has its own color palette

## Development Notes

- The fridge game is dynamically imported and only shown in development builds
- Hotspot debug mode can be toggled with the 'D' key in development
- Kitchen scene uses SVG polygon hotspots for click detection
- Bridge reveal overlay provides smooth transitions from kitchen to detail pages
