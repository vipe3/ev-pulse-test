# EV Pulse

EV Pulse is a premium, minimalist stock market dashboard designed specifically for tracking Electric Vehicle (EV) stocks. It provides a clean, high-performance interface focusing on real-time data, position tracking, and progressive disclosure, all while adhering to strict design principles for optimal data-ink ratio and an intuitive inverted pyramid layout.

## Features

- **Normalized Performance Tracking**: Compare EV-focused stocks (including Tesla, Rivian, Polestar, etc.) against broader market benchmarks using normalized performance metrics.
- **Interactive Line Chart**: Visualize historical stock data and trends clearly and effectively.
- **Ranked Data Table**: Quickly identify top and bottom performers with a sortable, information-dense table.
- **Progressive Disclosure Details**: Click on individual stocks to view a detail slide-over with deeper insights and specific performance metrics without losing context.
- **Premium Dark Mode**: Designed with a sleek, low-glare dark mode aesthetic for comfortable, extended viewing.
- **High-Performance Architecture**: Built with modern web technologies to ensure lightning-fast load times and smooth interactions.

## Technology Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Charting**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

Follow these steps to run the EV Pulse dashboard locally:

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (or yarn/pnpm)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vipe3/ev-pulse-test.git
   cd ev-pulse-test
   ```

2. Navigate to the app directory:
   ```bash
   cd app
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start the Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified in your terminal).

## Building for Production

To create a production build, run:

```bash
npm run build
```

This will compile and bundle the application into the `dist` folder.

## Linting

To run the ESLint configuration and check for code quality issues:

```bash
npm run lint
```
