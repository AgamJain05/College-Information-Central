# College Information Central Hub 🎓

A comprehensive web application designed exclusively for college students to share information, create blogs, and stay connected with ongoing events and academic resources.

## 🌟 Features

### 🔐 Authentication & Authorization
- **Exclusive College Access**: Only students with `@ietdavv.edu.in` email addresses can register
- **Dual Authentication**: Email/password and Google OAuth integration
- **JWT-based Security**: Secure token-based authentication system
- **Firebase Integration**: Google authentication powered by Firebase
![Screenshot 2025-06-27 131043](https://github.com/user-attachments/assets/5faa705a-c615-48d3-af72-b5b300e00408)
![Screenshot 2025-06-27 131043](https://github.com/user-attachments/assets/15843682-970d-4281-8c12-e71cb81aed18)
![Screenshot 2025-06-27 125534](https://github.com/user-attachments/assets/c1693878-ab51-40e7-a9f9-ee82cfb751e4)

### 📝 Blog Management System
- **Rich Text Editor**: Powered by EditorJS with support for:
  - Headers, lists, quotes, links
  - Image uploads with Cloudinary integration
  - Code blocks and raw HTML
- **Draft System**: Save drafts and publish when ready
- **Blog Categories**: Organize content by topics (tech, finance, hollywood, cooking, travel, etc.)
- **Search & Filter**: Find blogs by title, tags, or author
- **Trending Algorithm**: Discover popular content based on likes and reads

### 💬 Social Features
- **Interactive Comments**: Nested comment system with replies
- **Like System**: Like/unlike blogs with real-time updates
- **User Profiles**: Customizable profiles with bio and social links
- **Notifications**: Real-time notifications for likes, comments, and interactions
- **User Discovery**: Search and discover other college students

### 🔗 Resource Sharing
- **Year-wise Links**: Share important links organized by academic years
- **Discussion Topics**: Topic-based link organization
- **Meetup System**: College year-specific resource sharing

### 📊 Analytics & Management
- **Dashboard**: Manage published blogs and drafts
- **Blog Statistics**: Track views, likes, and comments
- **Profile Analytics**: Monitor total posts and reads
- **Content Management**: Edit, delete, and manage your content

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: Theme switching capability
- **Smooth Animations**: Framer Motion for enhanced user experience
- **Modern Icons**: Flaticon integration for beautiful interfaces

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **Firebase Admin SDK** for authentication
- **Cloudinary** for image storage and management
- **JWT** for secure authentication
- **bcrypt** for password hashing
- **Multer** for file uploads

### Frontend
- **React.js** with modern hooks and context
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Router** for navigation
- **EditorJS** for rich text editing
- **React Hot Toast** for notifications
- **Framer Motion** for animations

### Database Schema

#### User Model
```javascript
{
  personal_info: {
    fullname: String,
    email: String (unique),
    password: String,
    username: String (unique),
    bio: String,
    profile_img: String
  },
  social_links: {
    youtube, instagram, facebook, twitter, github, website
  },
  account_info: {
    total_posts: Number,
    total_reads: Number
  },
  google_auth: Boolean,
  blogs: [ObjectId],
  links: {
    firstYear, secondYear, thirdYear, fourthYear: String,
    discussionTopics: Map
  }
}
```

#### Blog Model
```javascript
{
  blog_id: String (unique),
  title: String,
  banner: String,
  des: String,
  content: Array,
  tags: [String],
  author: ObjectId,
  activity: {
    total_likes, total_comments, total_reads, total_parent_comments: Number
  },
  comments: [ObjectId],
  draft: Boolean
}
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account
- Firebase project

### Backend Setup

1. **Clone and Navigate**
   ```bash
   cd Backend-Central
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend root:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/collegeCentralDB?retryWrites=true&w=majority
   ACCESS_TOKEN_SECRET=your_jwt_secret_key
   ACCESS_TOKEN_EXPIRY=7d
   REFRESH_TOKEN_SECRET=your_refresh_secret
   REFRESH_TOKEN_EXPIRY=30d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   PORT=8000
   ```

4. **Firebase Setup**
   - Download Firebase service account key
   - Place it as `serviceAccountKey.js` in the src folder
   - Configure Firebase in the frontend

5. **Start Development Server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to Frontend**
   ```bash
   cd Frontend-Central
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file:
   ```env
   VITE_SERVER_DOMAIN=http://localhost:8000
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Authentication
- `POST /signup` - Register new user
- `POST /signin` - User login
- `POST /google-auth` - Google OAuth

### Blog Management
- `POST /create-blog` - Create/update blog
- `POST /get-blog` - Fetch specific blog
- `POST /latest-blogs` - Get latest blogs
- `GET /trending-blogs` - Get trending blogs
- `POST /search-blogs` - Search blogs
- `POST /delete-blog` - Delete blog

### User Interactions
- `POST /like-blog` - Like/unlike blog
- `POST /add-comment` - Add comment
- `POST /get-blog-comments` - Fetch comments
- `POST /get-replies` - Get comment replies

### User Management
- `POST /get-profile` - Get user profile
- `POST /update-profile` - Update profile
- `POST /update-profile-img` - Update profile image
- `POST /change-password` - Change password

### Notifications
- `POST /notifications` - Get notifications
- `POST /all-notifications-count` - Count notifications
- `GET /new-notification` - Check new notifications

### Links & Resources
- `GET /api/links` - Get all shared links
- `POST /api/links` - Add new link

## 🎯 Key Features Explained

### College-Exclusive Access
The platform uses email validation to ensure only students from IET DAVV (`@ietdavv.edu.in`) can access the platform, creating a trusted academic community.

### Rich Blog Editor
The integrated EditorJS provides a modern, block-style editor similar to Medium, allowing students to create rich content with images, code blocks, and formatted text.

### Real-time Interactions
The notification system keeps users engaged with real-time updates about likes, comments, and new followers.

### Resource Sharing System
The meetup/links feature allows students to share year-specific academic resources and important links, fostering collaborative learning.

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **File Upload Security**: Cloudinary integration for secure image handling

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Tablet and desktop optimizations
- Touch-friendly interfaces
- Optimized loading for different screen sizes

## 🚀 Deployment

### Backend Deployment
The backend can be deployed on platforms like:
- Heroku
- Vercel
- Railway
- DigitalOcean

### Frontend Deployment
The frontend can be deployed on:
- Vercel (recommended)
- Netlify
- GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Agam Jain** - Full Stack Developer

## 🙏 Acknowledgments

- IET DAVV for inspiration
- Firebase for authentication services
- Cloudinary for image management
- MongoDB Atlas for database hosting
- All the open-source libraries that made this project possible

---

*Built with ❤️ for the IET DAVV student community*
