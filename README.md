# News Dashboard

A responsive dashboard application that provides news analytics, payout calculations, and user authentication features.

## Features

- User authentication with NextAuth.js
- News and blog data integration
- Advanced filtering and search capabilities
- Payout calculator with export functionality
- Interactive charts and analytics
- Dark mode support
- Responsive design

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- Chart.js for data visualization
- NextAuth.js for authentication

## Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd news-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   GITHUB_ID=your-github-client-id
   GITHUB_SECRET=your-github-client-secret
   GOOGLE_ID=your-google-client-id
   GOOGLE_SECRET=your-google-client-secret
   NEWS_API_KEY=your-news-api-key
   ```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Sign in using your GitHub or Google account
2. Navigate through the dashboard using the sidebar
3. Use the search and filter options to find specific articles
4. Calculate payouts using the calculator component
5. Export data in various formats
6. Toggle dark mode using the theme switcher

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
├── lib/                 # Utility functions
├── store/              # Redux store configuration
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
