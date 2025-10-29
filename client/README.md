# 📚 Book Finder - React Frontend

The frontend application for Book Finder, a comprehensive book discovery and reading management platform built with React and Vite.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your API URL (default: http://localhost:5000/api)

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Toastify** - Toast notifications
- **React Icons** - Icon library
- **CSS3** - Custom styling with responsive design

## 📁 Project Structure

```
client/
├── public/                      # Static assets
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── BookCard.jsx         # Book display card
│   │   ├── SearchBar.jsx        # Search input component
│   │   ├── FilterBar.jsx        # Genre/year filters
│   │   ├── ReadingProgress.jsx  # Progress tracking
│   │   ├── SocialShare.jsx      # Social sharing buttons
│   │   ├── Navbar.jsx           # Navigation bar
│   │   ├── Recommendations.jsx  # Book recommendations
│   │   └── ...
│   ├── pages/                   # Page components
│   │   ├── Home.jsx            # Main search/discovery page
│   │   ├── ReadingList.jsx     # User's saved books
│   │   ├── BookDetails.jsx     # Individual book details
│   │   ├── AuthPage.jsx        # Login/register page
│   │   ├── EditProfile.jsx     # Profile editing
│   │   └── ...
│   ├── context/                # React context providers
│   │   ├── AuthContext.js      # Authentication state
│   │   └── ThemeContext.jsx    # Theme preferences
│   ├── services/               # API service functions
│   │   ├── api.js             # Base API configuration
│   │   ├── authService.js     # Authentication API calls
│   │   ├── bookService.js     # Book management API calls
│   │   └── ...
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # App entry point
│   └── index.css              # Global styles
├── package.json
├── vite.config.js             # Vite configuration
└── eslint.config.js           # ESLint configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Vite Configuration

The `vite.config.js` includes:
- React plugin for fast refresh
- Proxy configuration for API calls during development
- Build optimizations for production

## 🎨 Features

### Core Components

- **SearchBar**: Real-time book search with autocomplete
- **FilterBar**: Genre and year-based filtering
- **BookCard**: Book display with save/share functionality
- **ReadingProgress**: Progress tracking interface
- **SocialShare**: Social media sharing buttons
- **Recommendations**: Personalized book suggestions

### Pages

- **Home**: Main search and discovery interface
- **ReadingList**: Personal library management
- **BookDetails**: Detailed book information and reviews
- **Auth**: User authentication (login/register)
- **EditProfile**: User profile management

### Context Providers

- **AuthContext**: Manages user authentication state
- **ThemeContext**: Handles theme preferences and accessibility

## 🚀 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Quality

- ESLint for code linting
- Prettier for code formatting (recommended)
- React hooks linting enabled

### API Integration

The frontend communicates with the Book Finder API through service modules:
- Centralized API configuration in `services/api.js`
- Separate service files for different domains (auth, books, etc.)
- Axios interceptors for authentication and error handling

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

CSS uses:
- CSS Grid and Flexbox for layouts
- CSS custom properties (variables) for theming
- Media queries for responsive breakpoints
- Modern CSS features with fallbacks

## 🔒 Security

- JWT token management for authentication
- Secure API communication
- Input validation and sanitization
- Protected routes for authenticated users

## 🚀 Deployment

### Build Process

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

### Deployment Options

- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag-and-drop dist folder or connect repo
- **GitHub Pages**: Use GitHub Actions for automated deployment

### Environment Setup

For production deployment, set the `VITE_API_URL` environment variable to your production API URL.

## 🤝 Contributing

1. Follow the existing code style
2. Run `npm run lint` before committing
3. Test changes on multiple screen sizes
4. Update component documentation as needed

## 📄 License

This project is part of the Book Finder application and follows the same MIT license.
