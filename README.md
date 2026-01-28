# Kaamelott Quotes Viewer

A simple React web application to browse and filter Kaamelott quotes using the [Kaamelott API](https://kaamelott.chaudie.re/api/all).

## Features

- Display Kaamelott quotes in a paginated table
- Filter quotes by auteur, acteur, personnage, saison, and episode
- Pagination (15 quotes per page)

## Installation

### Prerequisites

- Node.js (version 20.19.0 or higher, or 22.12.0 or higher)
- npm (comes with Node.js)

### Steps

1. **Clone or download the project**
   ```bash
   cd test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - The application will be available at `http://localhost:5173` (or the port shown in the terminal)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production

## Technologies Used

- **React** - UI library
- **Vite** - Build tool and development server
- **React Bootstrap** - UI component library
- **Bootstrap** - CSS framework

## Project Structure

```
test/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── vite.config.js       # Vite configuration (includes CORS proxy)
├── package.json         # Project dependencies
└── README.md           # This file
```

## Notes

- The application uses a Vite proxy to avoid CORS issues when fetching data from the Kaamelott API
- The proxy is configured in `vite.config.js` and routes `/kaamelott/*` requests to `https://kaamelott.chaudie.re`
