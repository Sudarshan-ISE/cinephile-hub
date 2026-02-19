

# Netflix Clone with OMDB API

## Overview
A professional Netflix-inspired movie browsing application with glassmorphic authentication, movie search & discovery, and personal watchlist — all powered by the OMDB API.

---

## Pages & Features

### 1. Sign In Page (Glassmorphic Design)
- Frosted glass card over a cinematic background image
- Email & password fields with form validation
- Link to Register page
- Netflix-style dark/red branding

### 2. Register Page (Glassmorphic Design)
- Matching glassmorphic style
- Name, email, password, confirm password fields
- On successful registration → redirect to Sign In page
- Frontend-only auth using localStorage

### 3. Home Page (Landing / Hero)
- Auto-rotating hero banner featuring a highlighted movie
- Horizontal scrolling rows organized by category:
  - **Trending Now** — popular movies
  - **Action**, **Comedy**, **Drama**, **Sci-Fi**, etc.
- Each movie card shows poster, title, and year
- Hover effects with quick info overlay

### 4. Search
- Search bar in the top navigation
- Real-time results as user types (debounced OMDB search)
- Results displayed in a grid layout

### 5. Movie Details Page
- Full movie info: plot, cast, director, ratings, runtime, genre
- Movie poster and background
- Button to add/remove from watchlist

### 6. Favorites / Watchlist
- Dedicated page showing all saved movies
- Stored in localStorage per user
- Remove from watchlist option

### 7. Navigation & Layout
- Top navigation bar with Netflix-style logo, search, and user avatar/menu
- Logout option in user dropdown → redirects to Sign In
- Protected routes — unauthenticated users redirected to Sign In

---

## Design
- **Theme**: Dark background (#141414) with Netflix red (#E50914) accents
- **Auth pages**: Glassmorphic cards with backdrop blur and semi-transparent backgrounds
- **Typography**: Clean, modern sans-serif
- **Animations**: Smooth hover effects on movie cards, fade transitions between pages

---

## Technical Approach
- OMDB API for all movie data (using the provided API key)
- Frontend-only authentication with localStorage
- React Router for navigation and route protection
- Responsive design for desktop and mobile

