# Hailuo AI Video Generator Widget

An interactive, high-conversion widget prototype designed for **Overchat AI / Pandaverse**. This is not just a UI; it's a lead-generation tool built with a focus on psychological engagement and user retention.

## "Vibe-Coder" Enhancements
*   **3D Tilt Experience:** Implemented a physics-based tilt effect (Framer Motion) that makes the widget feel "alive" and premium, responding to the user's cursor.
*   **AI Synthesis Simulation:** Instead of a static loading bar, users see a real-time stream of "Neural Logs." This simulates backend complexity, increasing the perceived value of the generated result.
*   **The "Pro" Reveal:** The final result features a cinematic blur-reveal effect and teasers for Pro features (4K, Music), strategically designed to maximize registration intent.
*   **Fast-Track UX:** Added clickable hashtags (#Cyberpunk, #Pixar) and an "Enhance ✨" button to lower the friction for first-time users.

## Tech Stack
- **React.js + Vite** (Ultra-fast development & build)
- **Tailwind CSS** (Clean, maintainable utility-first styling)
- **Framer Motion** (Industry-standard for advanced web animations)
- **Cloudflare Workers** (Architecture prepared for secure API proxying)

## How to run
1. Clone the repo
2. `npm install`
3. `npm run dev`

## Architecture
Included `worker.js` demonstrates how to proxy API requests to Hailuo/OpenAI while keeping sensitive API keys hidden from the client side.
