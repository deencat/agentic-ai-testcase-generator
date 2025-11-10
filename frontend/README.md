# Frontend - AI Test Case Generator

## Overview
Next.js 14 frontend application for the AI Test Case Generator project with Knowledge Base integration.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn/ui
- **State Management**: Zustand 5.0+
- **Icons**: Lucide React
- **Code Quality**: ESLint + Prettier

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Dashboard page
│   └── globals.css         # Global styles and Tailwind config
├── components/             # React components
│   ├── ui/                 # Shadcn/ui components
│   └── Navigation.tsx      # Top navigation bar
├── lib/                    # Utility libraries
│   ├── api.ts              # API client for backend
│   └── utils.ts            # Shadcn/ui utilities
├── stores/                 # Zustand state stores
│   ├── useGenerationStore.ts    # File upload & generation state
│   ├── useConfigStore.ts        # LLM configuration state
│   ├── useTestCaseStore.ts      # Test case management state
│   └── useExportStore.ts        # Export functionality state
├── types/                  # TypeScript type definitions
└── utils/                  # Helper functions
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables
Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Development
```bash
# Start development server
npm run dev

# Access at http://localhost:3000
```

### Build
```bash
# Production build
npm run build

# Start production server
npm start
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Format with Prettier
npx prettier --write "src/**/*.{ts,tsx,css}"
```

## Week 1 Deliverables ✅

### Completed Tasks
- [x] Initialize Next.js 14 project with TypeScript
- [x] Install and configure Shadcn/ui components
- [x] Set up project structure (stores, types, utils, components)
- [x] Configure Tailwind CSS v4 with custom theme
- [x] Set up ESLint and Prettier
- [x] Create Navigation component
- [x] Create Dashboard page with API connection test
- [x] Implement Zustand stores (Generation, Config, TestCase, Export)
- [x] Create API client utility
- [x] Test backend connection

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## State Management
Using Zustand for global state with TypeScript support.

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Optimal viewport: 1280px+
