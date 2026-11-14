# Royal South Indian Wedding Website: C. Vignesh & S. Pavithra

An auspicious, luxurious, ivory-and-gold Royal South Indian wedding invitation website and interactive 3D Blessings Tree experience celebrating the holy union of **C. Vignesh & S. Pavithra**.

---

## 🌟 Key Features

### 1. Traditional Dravidian Temple Aesthetic & Art
- **Color Palette**: Warm Ivory (`#F8F2E7`), Pearl White (`#FFFDF9`), Champagne Gold (`#C49A58`), Terracotta (`#98502F`), and Deep Brown (`#45352A`).
- Symmetrical Dravidian Temple Towers (Gopurams) framing the landing page.
- Centered traditional Ganesha motif with "Om Shri Ganeshaya Namah" and Tamil invocation.
- Brass Kuthu Vilakku lamps, traditional Kolam mandala details, and Madurai jasmine garlands.
- Delicate floating flower petals animation.

### 2. Live Countdown & Wedding Details
- **Wedding Date**: Monday, 14 December 2026.
- **Muhurtham Auspicious Window**: Between 06:15 AM and 07:15 AM IST (Asia/Kolkata timezone).
- Live countdown ticker tracking Days, Hours, Minutes, and Seconds.
- "Two hearts, one beautiful beginning."

### 3. Signature Feature: Fully Interactive 3D Blessings Tree
- Built with **Three.js** and procedural 3D courtyard architecture:
  - Multi-tiered white stone & marble temple pedestal with gold trim.
  - Organic twisting tree boughs with champagne gold foliage and ivory blossoms.
  - Jasmine flowers and petals scattered around the roots.
  - Hanging **Golden Blessing Leaves** in 3D space corresponding to approved guest blessings.
  - Interactive Raycasting: Click any golden leaf to inspect the heartfelt message, guest name, and date.
  - Smooth OrbitControls (drag to rotate, pinch/wheel to zoom, bounded angles so camera never clips the ground).
  - Collapsible bottom control dock (Zen Mode) adhering to zero viewport occlusion guidelines.
  - "Read a Random Blessing" shortcut.
  - Fullscreen / Dedicated Scene mode.
  - Alternative 2D Blessings Wall (paginated and searchable cards) for guests on low-power devices.

### 4. Real Blessing Submission & Backend Moderation Flow
- **Fields**: Required Guest Name and Blessing message (500-character limit with counter).
- Rate-limiting and anti-spam protection on submission.
- New blessings are saved and displayed immediately; no demo blessings or categories are shown.
- **Admin Moderation Portal**:
  - Protected by the `ADMIN_PASSCODE` deployment secret.
  - Filter by Pending, Approved, and Rejected.
  - One-click Approve, Reject, or Delete.
  - One-click CSV Keepsake Export.

### 5. Events Timeline
- **Event 1: Engagement**: Sunday, 13 December 2026, 6:00 PM onwards. (Marked "Venue details to be announced" pending confirmation).
- **Event 2: Muhurtham**: Monday, 14 December 2026, Between 06:15 AM and 07:15 AM.
  - Venue: Sri Srinivasa Perumal Kalyana Mandapam, Near Mahindra Showroom, Ettines Road, Ooty.
  - Get Directions & Add to Calendar (Google Calendar and `.ics` file).
- **Event 3: Reception**: Tuesday, 15 December 2026, 06:00 PM onwards.
  - Venue: GT Palace Thirumana Mandapam, Natham Main Road, Paraipatti Vilakku, Madurai.
  - Get Directions & Add to Calendar (Google Calendar and `.ics` file).

### 6. Venue & Travel Guide
- Dedicated cards for Ooty and Madurai venues.
- One-click address copy button with toast feedback.
- Practical Google Maps navigation links.
- Travel recommendations (airports, railway stations, ghat road advice, December weather in Ooty).
- Parking and accommodation guidance placeholders.
- Hospitality desk contact placeholders.

### 7. Digital Invitation Card
- Royal Dravidian gold-bordered Patrika card.
- Envelope open/close animation.
- Fullscreen zoomable lightbox (1x, 1.5x, 2x).
- Direct WhatsApp share with pre-formatted auspicious invitation text.
- Print/Download keepsake card.

### 8. Ambient Temple Music
- Synthesized Web Audio API Tanpura drone with gentle flute/nadaswaram swaras.
- 100% self-contained, 0 external audio files, mute/play control in navbar.

---

## 🛠️ Tech Stack & Scripts
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons.
- **3D Graphics**: Three.js, OrbitControls, RoomEnvironment.
- **Backend**: Express for local development; Vercel serverless API functions with Supabase for deployed blessing storage.
- **Build / Run**:
  - `npm run dev`: Starts the full-stack development server on port 3000.
  - `npm run build`: Compiles production assets with Vite.
  - `npm run lint`: Verifies TypeScript types without emitting files.

### Persistent blessings with Supabase

Blessings are stored in Supabase for both local development and Vercel deployment. The service key is only used by server-side code; it is never sent to the browser.

1. Create a Supabase project and run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor.
2. For local development, copy `.env.example` to `.env` and set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `ADMIN_PASSCODE`. `SUPABASE_URL` is the project's URL. Use a Supabase **Secret key** (or the legacy `service_role` key), not a publishable key. Never expose it with a `VITE_` or `NEXT_PUBLIC_` variable or commit `.env`.
3. If you have blessings in `data/blessings.json`, run `pnpm migrate:blessings` once the credentials are configured. This import is safe to rerun: previously imported records are skipped.
4. For Vercel, add the same environment variables in the project's settings and redeploy. New guest blessings are stored as `approved`, matching the current site behavior; only approved blessings appear in the public tree.

Admin moderation and CSV export use the same persistent database. If the Supabase environment variables are missing, the API reports a configuration error rather than falling back to local storage.

### Google Places venue photos

The Sacred Destinations cards load current venue photos and contributor attributions from Google Places when that scene is opened. To enable them:

1. In Google Cloud, enable Places API (New) and billing for your project.
2. Create a server-side API key restricted to Places API (New), and restrict it to the server environment where this app runs.
3. Copy `.env.example` to `.env` and set `GOOGLE_MAPS_API_KEY` to that key. Keep `.env` private and never commit the key.
4. Restart the server. If no key is configured or Google does not return a photo, the cards show the existing decorative illustrations and an explanatory message.

Photo references and contributor attributions are fetched at runtime; they are not saved or cached by this app.
