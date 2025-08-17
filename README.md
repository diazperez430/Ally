# React Native App with AWS Amplify REST API

This is a React Native application with a well-organized codebase that uses AWS Amplify for backend services through REST API.

## 🏗️ Project Structure

```
src/
├── config/           # Configuration files
│   └── amplify.ts   # Amplify configuration
├── hooks/           # Custom React hooks
│   └── useApi.ts    # API operation hooks
├── services/        # API service layer
│   └── api.ts       # REST API services
├── utils/           # Utility functions
└── aws-exports.js   # AWS Amplify configuration

components/           # React components
├── TodoScreen.tsx   # Todo management screen
├── SignUp.tsx       # User registration
├── LogIn.tsx        # User authentication
└── Dashboard.tsx    # Main dashboard
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- AWS CLI configured
- AWS Amplify CLI installed

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure AWS Amplify:**
   ```bash
   amplify init
   ```

3. **Add REST API:**
   ```bash
   amplify add api
   ```
   Choose "REST" when prompted.

4. **Configure API endpoints:**
   - TodoAPI: `/api/v1/todos`
   - UserAPI: `/api/v1/users`

5. **Push to AWS:**
   ```bash
   amplify push
   ```

## 📱 API Services

### Todo Service
- `getAllTodos()` - Fetch all todos
- `createTodo(todo)` - Create new todo
- `updateTodo(id, updates)` - Update existing todo
- `deleteTodo(id)` - Delete todo

### User Service
- `getUserProfile(userId)` - Get user profile
- `updateUserProfile(userId, updates)` - Update user profile

## 🎣 Custom Hooks

### useTodos()
Provides todo management functionality with loading states and error handling.

### useUser()
Provides user profile management functionality.

## 🔧 Configuration

The app uses centralized configuration in `src/config/amplify.ts`:

```typescript
export const API_ENDPOINTS = {
  TODO_API: 'TodoAPI',
  USER_API: 'UserAPI',
  AUTH_API: 'AuthAPI'
};
```

## 📝 Environment Variables

Create a `.env` file for environment-specific configuration:

```env
AMPLIFY_API_VERSION=v1
AMPLIFY_REGION=us-east-1
```

## 🚀 Development

1. **Start Metro bundler:**
   ```bash
   npm start
   ```

2. **Run on Android:**
   ```bash
   npm run android
   ```

3. **Run on iOS:**
   ```bash
   npm run ios
   ```

## 🧪 Testing

```bash
npm test
```

## 📦 Building for Production

```bash
# Android
npm run android:build

# iOS
npm run ios:build
```

## 🔒 Security

- All API calls are authenticated through AWS Cognito
- User data is protected with proper authorization
- API endpoints use HTTPS in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
