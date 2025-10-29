# 📚 Book Finder - MERN Stack Application

A comprehensive full-stack book discovery and reading management application that allows users to search millions of books, maintain personal reading lists, track progress, write reviews, and get personalized recommendations.

![Book Finder](https://img.shields.io/badge/Book%20Finder-MERN%20Stack-blue?style=for-the-badge&logo=react)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## ✨ Key Features

### 🔍 **Advanced Book Discovery**
- **Real-time Search**: Search millions of books using Open Library API
- **Smart Filtering**: Filter by genre, publication year, and combine with text search
- **Autocomplete Suggestions**: Get instant book suggestions as you type
- **Detailed Book Information**: Access comprehensive book details, descriptions, and metadata

### 👤 **User Management & Authentication**
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **User Registration/Login**: Email or username-based login system
- **Password Recovery**: Secure password reset via email with token-based verification
- **Profile Management**: Update username, password, and user preferences
- **Accessibility Settings**: Dark mode, font size, reduced motion, and high contrast options

### 📖 **Reading List Management**
- **Personal Library**: Save and organize favorite books
- **Reading Progress Tracking**: Track current page, total pages, reading status, and completion percentage
- **Progress Notes**: Add personal notes and thoughts about books
- **Reading Statistics**: View reading progress stats and completion rates
- **Status Management**: Track books as not-started, reading, paused, or completed

### ⭐ **Review & Rating System**
- **Book Reviews**: Write detailed reviews with ratings (1-5 stars)
- **Community Reviews**: View reviews from other users
- **Helpful Votes**: Mark reviews as helpful and see community engagement
- **Average Ratings**: See aggregated ratings for books

### 🎯 **Personalized Recommendations**
- **Smart Recommendations**: Get book suggestions based on reading history and favorite genres
- **Genre-Based Discovery**: Recommendations tailored to user's preferred genres
- **Trending Books**: Explore popular and newly published books
- **Preference Settings**: Set favorite genres for better recommendations

### 📱 **Modern User Experience**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive UI**: Smooth animations and intuitive navigation
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Elegant loading indicators and error handling
- **Social Sharing**: Share books on Twitter, Facebook, WhatsApp, and copy links

### 🔒 **Security & Performance**
- **Input Validation**: Comprehensive server-side validation using express-validator
- **Error Handling**: Graceful error handling throughout the application
- **API Rate Limiting**: Built-in protection against API abuse
- **Secure Headers**: CORS configuration and security best practices
- **Database Security**: MongoDB with proper indexing and data validation

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - Modern UI library with hooks and functional components
- **React Router DOM** - Client-side routing and navigation
- **Vite** - Fast build tool and development server
- **Axios** - HTTP client for API communication
- **React Toastify** - Toast notifications
- **React Icons** - Beautiful icon library
- **CSS3** - Custom styling with CSS variables and responsive design

### **Backend**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT (jsonwebtoken)** - JSON Web Token authentication
- **bcryptjs** - Password hashing and verification
- **express-validator** - Server-side input validation
- **CORS** - Cross-origin resource sharing
- **Nodemailer** - Email service for password reset

### **External APIs**
- **Open Library API** - Access to millions of books and metadata
- **Covers API** - Book cover images and thumbnails

### **Development Tools**
- **ESLint** - Code linting and style enforcement
- **Nodemon** - Automatic server restart during development
- **MongoDB Compass** - Database management GUI (optional)

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager (comes with Node.js)
- **Git** - Version control system

### Environment Setup
You'll need to create environment files for both client and server:

**Server (.env)**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/book-finder
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
OPEN_LIBRARY_API=https://openlibrary.org
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Client (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/book-finder.git
cd book-finder
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file with your configuration
cp .env.example .env
# Edit .env with your actual values

# Start MongoDB service (if using local installation)
# On Windows: net start MongoDB
# On macOS: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# Start the development server
npm run dev
```

The server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your API URL

# Start the development server
npm run dev
```

The client will start on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173` to start using Book Finder!

## 📖 Usage Guide

### Getting Started
1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your email/username and password
3. **Explore**: Browse books using search or filters
4. **Save Books**: Add interesting books to your reading list
5. **Track Progress**: Update reading status and progress
6. **Write Reviews**: Share your thoughts about completed books
7. **Get Recommendations**: Discover new books based on your preferences

### Search & Discovery
- **Text Search**: Search by book title, author name, ISBN, or keywords
- **Genre Filtering**: Browse books by specific genres
- **Year Filtering**: Find books published within specific year ranges
- **Combined Search**: Use both text and filters for precise results

### Reading Management
- **Reading List**: View all your saved books in one place
- **Progress Tracking**: Update pages read, status, and add notes
- **Statistics**: Monitor your reading habits and completion rates
- **Status Updates**: Mark books as reading, completed, paused, or not started

### Social Features
- **Reviews**: Read and write detailed book reviews
- **Ratings**: Rate books on a 1-5 star scale
- **Sharing**: Share books on social media platforms
- **Community**: See reviews and ratings from other users

## 🏗️ Project Structure

```
book-finder/
├── client/                          # React frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── BookCard.jsx         # Book display component
│   │   │   ├── SearchBar.jsx        # Search functionality
│   │   │   ├── FilterBar.jsx        # Filtering options
│   │   │   ├── ReadingProgress.jsx  # Progress tracking
│   │   │   ├── SocialShare.jsx      # Social sharing
│   │   │   └── ...
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx            # Main search page
│   │   │   ├── ReadingList.jsx     # User's reading list
│   │   │   ├── BookDetails.jsx     # Individual book page
│   │   │   └── ...
│   │   ├── context/                # React context providers
│   │   ├── services/               # API service functions
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── server/                          # Node.js backend
│   ├── config/
│   │   └── db.js                   # Database configuration
│   ├── middleware/
│   │   ├── auth.js                # Authentication middleware
│   │   └── errorHandler.js        # Error handling
│   ├── models/                    # MongoDB schemas
│   │   ├── User.js                # User model
│   │   ├── Book.js                # Book model
│   │   └── Review.js              # Review model
│   ├── routes/                    # API route handlers
│   │   ├── auth.js                # Authentication routes
│   │   ├── books.js               # Book management routes
│   │   ├── recommendations.js     # Recommendation routes
│   │   └── reviews.js             # Review routes
│   ├── utils/
│   │   └── emailService.js        # Email utilities
│   ├── server.js                  # Main server file
│   └── package.json
└── README.md                      # Project documentation
```

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Book Management Endpoints
- `GET /api/books/search` - Search books with filters
- `GET /api/books/suggestions` - Get search suggestions
- `GET /api/books/details/:id` - Get detailed book information
- `GET /api/books/saved` - Get user's saved books
- `POST /api/books/saved` - Add book to reading list
- `DELETE /api/books/saved/:id` - Remove book from reading list
- `PUT /api/books/:id/progress` - Update reading progress

### Review Endpoints
- `GET /api/reviews/book/:openLibraryId` - Get reviews for a book
- `GET /api/reviews/user` - Get user's reviews
- `POST /api/reviews` - Create a new review
- `PUT /api/reviews/:id` - Update a review
- `DELETE /api/reviews/:id` - Delete a review
- `POST /api/reviews/:id/helpful` - Mark review as helpful

### Recommendation Endpoints
- `GET /api/recommendations` - Get personalized recommendations
- `GET /api/recommendations/trending` - Get trending books
- `PUT /api/recommendations/preferences` - Update user preferences

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Password reset functionality
- [ ] Book search and filtering
- [ ] Adding/removing books from reading list
- [ ] Reading progress tracking
- [ ] Writing and viewing reviews
- [ ] Social sharing features
- [ ] Responsive design on mobile/tablet
- [ ] Error handling and validation

### API Testing
Use tools like Postman or Insomnia to test API endpoints:
1. Import the API documentation
2. Test authentication flow
3. Test CRUD operations for books and reviews
4. Verify error responses

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB database (MongoDB Atlas for production)
2. Configure environment variables for production
3. Deploy to services like Heroku, Railway, or DigitalOcean
4. Set up proper CORS origins

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to services like Vercel, Netlify, or GitHub Pages
3. Configure API base URL for production

### Environment Variables for Production
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/book-finder
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write clear, concise commit messages
- Test your changes thoroughly
- Update documentation as needed
- Maintain code quality and consistency

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Open Library** for providing free access to book data
- **React Community** for excellent documentation and tools
- **MongoDB** for the powerful NoSQL database
- **Node.js** for the robust runtime environment

## 📞 Support

If you have any questions, issues, or suggestions:

- Open an issue on GitHub
- Contact the maintainers
- Check the documentation for common solutions

---

**Happy Reading! 📚✨**

*Built with ❤️ using the MERN Stack*