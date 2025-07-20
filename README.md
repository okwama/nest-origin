# Woosh Auth Flutter App

A beautiful Flutter authentication app that connects to your NestJS backend with login and signup functionality.

## 🚀 Features

- **Beautiful UI/UX** - Modern Material Design 3 interface
- **Authentication Flow** - Complete login and signup functionality
- **State Management** - Provider pattern for clean state management
- **Secure Storage** - JWT tokens stored securely using flutter_secure_storage
- **Form Validation** - Comprehensive input validation
- **Error Handling** - User-friendly error messages
- **Responsive Design** - Works on all screen sizes

## 📱 Screens

1. **Splash Screen** - App initialization and auth state check
2. **Login Screen** - Phone and password authentication
3. **Signup Screen** - User registration with validation
4. **Home Screen** - Dashboard with user info and logout

## 🛠 Setup Instructions

### Prerequisites

- Flutter SDK (latest stable version)
- Dart SDK
- Your NestJS backend running on `localhost:3000`

### Installation

1. **Clone or navigate to the project:**
   ```bash
   cd woosh_auth_app
   ```

2. **Install dependencies:**
   ```bash
   flutter pub get
   ```

3. **Configure backend URL:**
   
   Open `lib/services/auth_service.dart` and update the `baseUrl`:
   
   ```dart
   // For local development (emulator)
   static const String baseUrl = 'http://localhost:3000/api';
   
   // For physical device, use your computer's IP address
   // static const String baseUrl = 'http://192.168.1.100:3000/api';
   ```

4. **Run the app:**
   ```bash
   flutter run
   ```

## 🔧 Configuration

### For Physical Device Testing

If you're testing on a physical device, you need to:

1. **Find your computer's IP address:**
   ```bash
   # On macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # On Windows
   ipconfig
   ```

2. **Update the baseUrl in `lib/services/auth_service.dart`:**
   ```dart
   static const String baseUrl = 'http://YOUR_IP_ADDRESS:3000/api';
   ```

3. **Ensure your NestJS backend allows CORS from your device:**
   
   In your NestJS `main.ts`, update CORS settings:
   ```typescript
   app.enableCors({
     origin: ['http://localhost:3000', 'http://localhost:8080', 'capacitor://localhost', 'http://YOUR_IP_ADDRESS:3000'],
     credentials: true,
   });
   ```

## 📋 Test Credentials

Use these credentials to test the login functionality:

- **Phone:** `1234567890`
- **Password:** `password123`

## 🏗 Project Structure

```
lib/
├── main.dart                 # App entry point
├── models/
│   └── user.dart            # User data model
├── providers/
│   └── auth_provider.dart   # Authentication state management
├── screens/
│   ├── splash_screen.dart   # Loading screen
│   ├── login_screen.dart    # Login form
│   ├── signup_screen.dart   # Registration form
│   └── home_screen.dart     # Dashboard
└── services/
    └── auth_service.dart    # API communication
```

## 🔐 Authentication Flow

1. **App Launch** → Splash screen checks for stored token
2. **If token exists** → Navigate to home screen
3. **If no token** → Navigate to login screen
4. **Login Success** → Store token and navigate to home
5. **Logout** → Clear token and return to login

## 🎨 Customization

### Colors and Theme

Update the theme in `lib/main.dart`:

```dart
theme: ThemeData(
  primarySwatch: Colors.blue,  // Change primary color
  useMaterial3: true,
  // ... other theme settings
),
```

### API Endpoints

Modify endpoints in `lib/services/auth_service.dart`:

```dart
// Login endpoint
Uri.parse('$baseUrl/auth/login')

// Signup endpoint  
Uri.parse('$baseUrl/staff')

// Profile endpoint
Uri.parse('$baseUrl/auth/profile')
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection refused error:**
   - Ensure your NestJS backend is running
   - Check the correct IP address for physical devices
   - Verify CORS settings in backend

2. **Login fails:**
   - Check if test user exists in database
   - Verify phone number format (digits, spaces, hyphens, parentheses)
   - Ensure password is at least 6 characters

3. **Signup fails:**
   - Check if phone/email already exists
   - Verify all required fields are filled
   - Check backend validation rules

### Debug Mode

Run with debug information:
```bash
flutter run --debug
```

## 📦 Dependencies

- `http` - API communication
- `provider` - State management
- `flutter_secure_storage` - Secure token storage

## 🚀 Next Steps

This is a starter template. You can extend it by:

1. **Adding more screens** (Profile, Settings, etc.)
2. **Implementing biometric authentication**
3. **Adding offline support**
4. **Implementing push notifications**
5. **Adding more API endpoints**

## 📄 License

This project is part of the Woosh application suite.

---

**Happy coding! 🚀** 