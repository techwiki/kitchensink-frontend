# Kitchensink Frontend

This project represents the frontend component of the Kitchensink application, which has been extracted from the original monolithic Kitchensink project. This separation was done to support a more modular and scalable architecture, allowing the backend to serve multiple UI options such as web applications and mobile apps.

## Overview

The Kitchensink Frontend is built using Next.js and provides a modern, responsive web interface for the Kitchensink application. It includes features such as:

- User authentication (login/register)
- Member management
- Admin dashboard
- User dashboard
- Responsive design
- Protected routes
- Form validation

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (version 18.0.0 or higher)
- npm (version 8.0.0 or higher)
- The Kitchensink Backend service should be running (see kitchensink-backend project)

## Environment Setup

1. Create a `.env.local` file in the project root with the following variables:
```
# Backend API URL - This is required for the frontend to communicate with the backend
# If not set, defaults to http://localhost:8080
NEXT_PUBLIC_API_URL=http://localhost:8080
```

This environment variable is used in `src/lib/api.ts` to configure the base URL for all API requests. If you don't set this variable, it will default to 'https://localhost:8080'.

## Installation

1. Navigate to the project directory:
```bash
cd kitchensink-frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode

To run the application in development mode with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## Project Structure

- `/src/app` - Next.js pages and routing
- `/src/components` - Reusable React components
- `/src/contexts` - React context providers
- `/src/lib` - Utility functions and API handlers
- `/src/types` - TypeScript type definitions

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
