# Users Table - Wave Health Assesment

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- **User Data Fetching**: Fetches user data from JSONPlaceholder API
- **TanStack Table**: Modern, feature-rich table component with sorting capabilities
- **shadcn/ui Components**: Beautiful, accessible UI components
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Graceful error handling with retry functionality
- **Loading States**: Smooth loading experiences during data fetching
- **Accessibility**: ARIA attributes, keyboard navigation, and screen reader support
- **Testing**: Comprehensive Playwright E2E and component tests

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 🧪 Playwright testing
- ♿ Accessibility-first design
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher (LTS recommended)
- **npm**: Version 9 or higher

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wave-health-takehome
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Development Workflow

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Create production build
- `npm run typecheck` - Run TypeScript type checking
- `npm test` - Run Playwright tests
- `npm run test:ui` - Run Playwright tests with UI
- `npm run test:headed` - Run Playwright tests in headed mode
- `npm run test:debug` - Run Playwright tests in debug mode

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (if configured)

## Testing

### Playwright Test Suite

The application includes comprehensive E2E and component tests using Playwright:

- **Home Page Tests**: Table display, search, sorting, modal interactions
- **Add User Form Tests**: Form validation, submission, navigation
- **Component Tests**: UI component behavior and accessibility

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Debug tests
npm run test:debug
```

### Test Structure

```
tests/
├── home.spec.ts          # Home page E2E tests
├── add-user.spec.ts      # Add user form tests
├── components.spec.ts     # Component-specific tests
└── README.md             # Test documentation
```

## Architecture & Design Decisions

### Technology Stack

- **React Router**: For client-side routing and navigation
- **TypeScript**: For type safety and better developer experience
- **TanStack Table**: For feature-rich, accessible table implementation
- **React Hook Form**: For form state management and validation
- **Zod**: For schema validation and type inference
- **Tailwind CSS**: For utility-first styling
- **shadcn/ui**: For accessible, customizable UI components
- **Playwright**: For reliable E2E testing

### Architectural Patterns

#### Component Architecture
- **Separation of Concerns**: UI components separated from business logic
- **Composition over Inheritance**: Using composition patterns for reusable components
- **Props Interface**: Strict TypeScript interfaces for component props

#### State Management
- **React Context**: For modal state management
- **Local State**: For component-specific state (forms, loading states)
- **Form State**: React Hook Form for complex form state management

#### Data Flow
- **API Layer**: Centralized API calls with error handling
- **Type Safety**: Zod schemas for runtime validation
- **Error Boundaries**: Graceful error handling at component level

### Accessibility Decisions

- **ARIA Attributes**: Comprehensive ARIA support for custom components
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Focus Management**: Proper focus handling in modals and forms

### Performance Considerations

- **Lazy Loading**: Components loaded on demand
- **Debouncing**: Search input debounced for performance
- **Memoization**: React.memo for expensive components
- **Bundle Optimization**: Tree-shaking and code splitting

## Assumptions & Constraints

### API Assumptions
- **JSONPlaceholder API**: Used for demonstration purposes
- **Data Structure**: Assumes consistent user data structure
- **Error Handling**: Graceful degradation for API failures

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: Responsive design for mobile devices
- **JavaScript Required**: No server-side rendering fallback

### Development Assumptions
- **Node.js Environment**: Development and build tools
- **Git Workflow**: Version control with Git
- **Package Manager**: npm for dependency management

## Building for Production

### Create Production Build

```bash
npm run build
```

### Build Output

The build process creates optimized assets:

```
build/
├── client/          # Static assets (JS, CSS, images)
└── server/          # Server-side code
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
# Build the Docker image
docker build -t users-table-app .

# Run the container
docker run -p 3000:3000 users-table-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### Manual Deployment

For traditional deployment:

1. Build the application:
```bash
npm run build
```

2. Deploy the `build/` directory to your web server
3. Configure your server to serve the static assets
4. Set up proper routing for SPA (all routes serve index.html)

### Environment Variables

No environment variables are required for basic functionality. For production deployments, consider:

- `NODE_ENV`: Set to "production"
- `PORT`: Server port (default: 3000)

