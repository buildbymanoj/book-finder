# 📚 Book Finder API - Node.js Backend

The backend API server for Book Finder, a comprehensive book discovery and reading management platform built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB service (if using local)
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Start development server
npm run dev
```

The API will be available at `http://localhost:5000`

### Production Start

```bash
npm start
```

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Nodemailer** - Email service

## 📁 Project Structure

```
server/
├── config/
│   └── db.js                   # MongoDB connection configuration
├── middleware/
│   ├── auth.js                # JWT authentication middleware
│   └── errorHandler.js        # Global error handling
├── models/                    # MongoDB schemas
│   ├── User.js                # User model
│   ├── Book.js                # Book model
│   └── Review.js              # Review model
├── routes/                    # API route handlers
│   ├── auth.js                # Authentication routes
│   ├── books.js               # Book management routes
│   ├── recommendations.js     # Recommendation routes
│   └── reviews.js             # Review routes
├── utils/
│   └── emailService.js        # Email utilities
├── server.js                  # Main server file
├── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

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

### Database Configuration

The `config/db.js` file handles MongoDB connection with:
- Connection string from environment variables
- Error handling and logging
- Connection retry logic

## 📊 Data Models

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  favoriteGenres: [String],
  preferences: {
    darkMode: Boolean,
    fontSize: String,
    reducedMotion: Boolean,
    highContrast: Boolean
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date
}
```

### Book Model
```javascript
{
  user: ObjectId (ref: User),
  openLibraryId: String,
  title: String,
  author: String,
  coverUrl: String,
  publishYear: Number,
  description: String,
  isbn: String,
  genres: [String],
  readingProgress: {
    status: String (enum),
    currentPage: Number,
    totalPages: Number,
    percentage: Number,
    notes: String,
    startedAt: Date,
    completedAt: Date
  },
  userRating: Number,
  addedAt: Date
}
```

### Review Model
```javascript
{
  user: ObjectId (ref: User),
  book: ObjectId (ref: Book),
  openLibraryId: String,
  rating: Number (1-5),
  title: String,
  comment: String,
  helpfulVotes: Number,
  votedBy: [ObjectId],
  readingStatus: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/profile` | Update user profile | Private |
| PUT | `/preferences` | Update user preferences | Private |
| POST | `/forgot-password` | Request password reset | Public |
| POST | `/reset-password` | Reset password with token | Public |

### Book Routes (`/api/books`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/search` | Search books with filters | Private |
| GET | `/suggestions` | Get search suggestions | Private |
| GET | `/details/:id` | Get detailed book info | Private |
| GET | `/saved` | Get user's saved books | Private |
| POST | `/saved` | Add book to reading list | Private |
| DELETE | `/saved/:id` | Remove book by ID | Private |
| DELETE | `/saved/openlibrary/:id` | Remove book by OpenLibrary ID | Private |
| PUT | `/:id/progress` | Update reading progress | Private |
| GET | `/progress/stats` | Get reading statistics | Private |

### Review Routes (`/api/reviews`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/book/:openLibraryId` | Get reviews for a book | Public |
| GET | `/user` | Get user's reviews | Private |
| POST | `/` | Create new review | Private |
| PUT | `/:id` | Update review | Private |
| DELETE | `/:id` | Delete review | Private |
| POST | `/:id/helpful` | Mark review as helpful | Private |

### Recommendation Routes (`/api/recommendations`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get personalized recommendations | Private |
| GET | `/trending` | Get trending books | Private |
| PUT | `/preferences` | Update favorite genres | Private |

## 🔐 Authentication

### JWT Token
- Tokens are issued upon successful login/registration
- Include token in `Authorization: Bearer <token>` header
- Tokens expire after 30 days (configurable)

### Protected Routes
Routes marked as "Private" require authentication. The `protect` middleware:
- Verifies JWT token
- Attaches user information to `req.user`
- Returns 401 if token is invalid or missing

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: express-validator for all inputs
- **Rate Limiting**: Built-in protection against abuse
- **CORS**: Configured for cross-origin requests
- **Helmet**: Security headers (recommended addition)
- **Data Sanitization**: MongoDB injection protection

## 📧 Email Service

### Configuration
Uses Nodemailer for password reset emails:
- Gmail SMTP configuration
- Secure token generation
- HTML email templates

### Password Reset Flow
1. User requests password reset
2. System generates secure token
3. Email sent with reset link
4. Token expires after 1 hour
5. User can reset password with valid token

## 🔍 External API Integration

### Open Library API
- Search endpoint: `https://openlibrary.org/search.json`
- Details endpoint: `https://openlibrary.org/works/{id}.json`
- Covers endpoint: `https://covers.openlibrary.org/b/id/{id}-M.jpg`

### Error Handling
- Timeout handling (30 seconds for search, 10 seconds for suggestions)
- Rate limiting awareness
- Graceful fallback for API failures

## 🚀 Development

### Available Scripts

```bash
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start production server
npm test         # Run tests (when implemented)
```

### Development Features

- **Nodemon**: Automatic server restart on file changes
- **Morgan**: HTTP request logging (can be added)
- **Winston**: Advanced logging (can be added)
- **PM2**: Process management for production

## 🧪 Testing

### API Testing
Use tools like Postman, Insomnia, or Thunder Client:

1. **Authentication Flow**:
   - Register a new user
   - Login to get JWT token
   - Use token in subsequent requests

2. **Book Operations**:
   - Search for books
   - Save books to reading list
   - Update reading progress
   - Remove books

3. **Review System**:
   - Create reviews
   - View reviews
   - Update/delete reviews

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Password reset flow
- [ ] Book search and filtering
- [ ] Reading list management
- [ ] Progress tracking
- [ ] Review creation and management
- [ ] Recommendation system
- [ ] Error handling

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**:
   ```env
   NODE_ENV=production
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/book-finder
   JWT_SECRET=your-production-secret
   CLIENT_URL=https://your-frontend-domain.com
   ```

2. **Database**: Use MongoDB Atlas for production

3. **Process Management**: Use PM2 or Docker

4. **SSL/TLS**: Configure HTTPS in production

### Deployment Platforms
- **Heroku**: Easy Node.js deployment
- **Railway**: Modern deployment platform
- **DigitalOcean**: VPS with Docker
- **AWS**: EC2 with load balancer

## 📊 Monitoring & Logging

### Recommended Additions
- **Winston**: Structured logging
- **Morgan**: HTTP request logging
- **Sentry**: Error tracking
- **New Relic**: Performance monitoring

## 🤝 Contributing

1. Follow existing code structure
2. Add proper error handling
3. Update API documentation
4. Test thoroughly before committing
5. Use meaningful commit messages

## 📄 License

This project is part of the Book Finder application and follows the same MIT license.