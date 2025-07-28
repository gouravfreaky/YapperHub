# YapperHub

A modern React web application for searching and visualizing user activity data (YAPS) using the Kaito AI API.

## Features

- **Real-time User Search**: Search for users and get instant results
- **Interactive Data Visualization**: Line chart showing activity growth over time
- **Dark Mode Support**: Toggle between light and dark themes
- **Search History**: Keep track of recent searches
- **Responsive Design**: Works on desktop and mobile devices
- **Direct API Integration**: Connects directly to Kaito AI API

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Charts**: Recharts library for data visualization
- **State Management**: TanStack Query for API state management
- **Routing**: Wouter for lightweight client-side routing

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect the Vite framework and deploy

### Manual Build

To build for production:

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Environment Variables

No environment variables are required for basic functionality. The app connects directly to the public Kaito AI API.

## Project Structure

```
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── lib/             # Utility functions and query client
│   ├── hooks/           # Custom React hooks
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── dist/                # Build output (generated)
└── vercel.json          # Vercel deployment configuration
```

## API Integration

The application integrates with the Kaito AI API to fetch user activity data:

- **Endpoint**: `https://api.kaito.ai/api/v1/yaps?username={username}`
- **Method**: GET
- **Response**: JSON object containing user activity metrics across different time periods

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details