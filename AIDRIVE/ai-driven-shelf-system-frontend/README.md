# ShelfAI Frontend

A modern, responsive web application for AI-powered inventory management with smart expiry detection and demand forecasting.

## Features

### 🏠 Dashboard
- Real-time overview of inventory metrics
- Critical alerts and expiring products
- Demand forecast visualizations
- Recent activity feed

### 📦 Product Management
- Complete CRUD operations for products
- Search and filter functionality
- Category management
- Stock level tracking

### ⚠️ Alert System
- Real-time expiry alerts
- Low stock notifications
- Critical alert filtering
- Action buttons for quick responses

### 📊 Demand Forecasting
- AI-powered demand predictions
- Multiple chart types (Bar, Line, Pie)
- Category-based filtering
- Top and low demand insights

### 📷 OCR Expiry Detection
- Image upload for expiry date extraction
- AI-powered OCR processing
- Preview functionality
- Validation and error handling

### 📝 Manual Expiry Entry
- Manual expiry data input
- Product selection dropdown
- Date validation
- Form validation with Zod

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend README)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-driven-shelf-system-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard overview
│   ├── products/          # Product management
│   ├── alerts/            # Alert monitoring
│   ├── forecast/          # Demand forecasting
│   ├── scan-expiry/       # OCR expiry detection
│   ├── manual-expiry/     # Manual expiry entry
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── Navbar.tsx         # Navigation component
│   ├── ExpiryCard.tsx     # Expiry information card
│   ├── ForecastChart.tsx  # Chart component
│   ├── ManualExpiryForm.tsx # Manual entry form
│   └── OCRUploadForm.tsx  # OCR upload form
├── hooks/                 # Custom React hooks
│   ├── useProducts.ts     # Product management
│   ├── useExpiry.ts       # Expiry data management
│   ├── useForecast.ts     # Forecast data
│   └── useAlerts.ts       # Alert management
├── services/              # API services
│   └── api.ts            # Axios configuration
├── types/                 # TypeScript interfaces
│   └── index.ts          # Type definitions
└── utils/                 # Utility functions
    └── helper.ts         # Helper functions
```

## API Integration

The frontend integrates with the backend API through the following endpoints:

### Products
- `GET /api/v1/products/` - List all products
- `POST /api/v1/products/` - Create new product
- `PUT /api/v1/products/{id}` - Update product
- `DELETE /api/v1/products/{id}` - Delete product

### Expiry Management
- `GET /api/v1/expiry/` - List expiry data
- `POST /api/v1/expiry/manual` - Add manual expiry
- `POST /api/v1/expiry/scan` - OCR expiry detection

### Alerts
- `GET /api/v1/alerts/` - Get all alerts

### Forecasts
- `GET /api/v1/forecast/` - Get demand forecasts

## Key Components

### Navbar
Responsive navigation with active route highlighting and mobile menu support.

### ExpiryCard
Displays expiry information with status indicators and action buttons.

### ForecastChart
Interactive charts using Recharts with multiple visualization types.

### Forms
React Hook Form with Zod validation for data integrity.

## Customization

### Styling
The application uses Tailwind CSS for styling. Custom styles can be added in `globals.css`.

### API Configuration
Update the API base URL in `services/api.ts` or set the `NEXT_PUBLIC_API_URL` environment variable.

### Chart Types
Modify chart types in the Forecast page by updating the `chartType` state.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Component-based architecture

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

1. Build the application: `npm run build`
2. Start the production server: `npm run start`
3. Deploy the `.next` folder to your hosting platform

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000/api/v1` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.
