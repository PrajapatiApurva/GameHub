# GameHub - Multi-Game Platform

A modern web application built with Next.js 15 that allows users to play classic games online with authentication and score tracking.

## 🎮 Features

- **User Authentication**: Secure credential-based authentication using NextAuth
- **Multiple Games**:
  - Tic-Tac-Toe (vs Human or Computer)
  - Rock-Paper-Scissors (vs Computer)
- **Score Tracking**: Monitor your game statistics and win rates
- **Responsive Design**: Beautiful UI built with Tailwind CSS
- **MongoDB Integration**: Persistent user data and game history

## 🚀 Games Available

### Tic-Tac-Toe

- Classic 3x3 grid gameplay
- Play against another human or AI opponent
- Real-time game state updates
- Win detection and draw handling

### Rock-Paper-Scissors

- Traditional rock, paper, scissors gameplay
- Play against computer opponent
- Score tracking with wins, losses, and draws
- Animated game interactions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **Authentication**: NextAuth.js v5
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript
- **Deployment**: Ready for Vercel deployment

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Git

## 🔧 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd GameHub
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXTAUTH_URL=http://localhost:3000<default>
   NEXTAUTH_SECRET=<secret>
   MONGODB_URI=mongodb://localhost:27017/gameapp
   # or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/gameapp
   ```

4. **Set up MongoDB**

   - **Local MongoDB**: Install MongoDB locally and ensure it's running
   - **MongoDB Atlas**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas) and get your connection string

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/route.ts    # NextAuth configuration
│   │       └── register/route.ts         # User registration
│   ├── auth/
│   │   ├── signin/page.tsx              # Sign in page
│   │   └── signup/page.tsx              # Sign up page
│   ├── dashboard/page.tsx               # Main dashboard
│   ├── games/
│   │   ├── tic-tac-toe/page.tsx        # Tic-tac-toe game
│   │   └── rock-paper-scissors/page.tsx # Rock-paper-scissors game
│   ├── layout.tsx                       # Root layout
│   └── page.tsx                         # Home page
├── components/
│   └── providers.tsx                    # NextAuth provider
├── lib/
│   └── mongodb.ts                       # Database connection
├── models/
│   └── index.ts                         # MongoDB schemas
└── auth.ts                              # NextAuth configuration
```

## 🎯 Usage

1. **Create an Account**: Visit the homepage and click "Get Started" to create a new account
2. **Sign In**: Use your credentials to sign in
3. **Play Games**: Choose from available games on the dashboard
4. **Track Progress**: View your game statistics and win rates

## 🔐 Authentication

- Uses NextAuth.js v4 with credentials provider
- Passwords are hashed using bcryptjs
- JWT-based sessions for security
- Protected routes with automatic redirects

## 📊 Database Schema

### User Model

```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  gamesPlayed: Number,
  gamesWon: Number,
  createdAt: Date
}
```

### GameSession Model

```javascript
{
  gameType: String ['tic-tac-toe', 'rock-paper-scissors'],
  player1: ObjectId (User),
  player2: ObjectId (User) [optional],
  winner: ObjectId (User) [optional],
  gameData: Mixed,
  status: String ['waiting', 'in-progress', 'completed'],
  createdAt: Date,
  completedAt: Date
}
```

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret-key
MONGODB_URI=your-mongodb-atlas-connection-string
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] Real-time multiplayer using WebSockets
- [ ] More games (Chess, Checkers, Connect Four)
- [ ] Leaderboards and tournaments
- [ ] Friend system and invitations

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running locally or check your Atlas connection string
   - Verify network access in MongoDB Atlas

2. **Authentication Issues**

   - Check NEXTAUTH_SECRET is set
   - Verify NEXTAUTH_URL matches your domain

3. **Build Errors**
   - Run `npm run build` to check for TypeScript errors
   - Ensure all dependencies are installed


## 🙏 Acknowledgments

- Next.js team for the amazing framework
- NextAuth.js for authentication
- Tailwind CSS for styling
- MongoDB for the database solution
