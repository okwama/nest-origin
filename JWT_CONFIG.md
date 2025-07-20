# JWT Configuration Guide

## Environment Variables

Create a `.env` file in your NestJS root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=woosh_admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Application Configuration
PORT=3000
NODE_ENV=development
```

## JWT Storage Best Practices

### 1. **Client-Side Storage Options**

#### **Option A: HttpOnly Cookies (Recommended)**
```typescript
// Server-side: Set secure cookies
res.cookie('access_token', accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000, // 15 minutes
});

res.cookie('refresh_token', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

#### **Option B: Memory Storage (SPA)**
```typescript
// Store in memory (cleared on page refresh)
let accessToken: string | null = null;
let refreshToken: string | null = null;

// Set tokens after login
const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
};

// Clear tokens on logout
const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
};
```

#### **Option C: Secure Local Storage**
```typescript
// Encrypt before storing
const encryptAndStore = (key: string, value: string) => {
  const encrypted = btoa(value); // Simple base64 encoding
  localStorage.setItem(key, encrypted);
};

const getAndDecrypt = (key: string) => {
  const encrypted = localStorage.getItem(key);
  return encrypted ? atob(encrypted) : null;
};
```

### 2. **Token Refresh Strategy**

```typescript
// Automatic token refresh
class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshTimeout: NodeJS.Timeout | null = null;

  setTokens(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;
    this.scheduleRefresh();
  }

  private scheduleRefresh() {
    // Refresh 1 minute before expiry
    const refreshTime = 14 * 60 * 1000; // 14 minutes
    this.refreshTimeout = setTimeout(() => {
      this.refreshTokens();
    }, refreshTime);
  }

  private async refreshTokens() {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });
      
      if (response.ok) {
        const data = await response.json();
        this.setTokens(data.access_token, data.refresh_token);
      } else {
        // Redirect to login
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      window.location.href = '/login';
    }
  }

  getAccessToken() {
    return this.accessToken;
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
  }
}
```

### 3. **HTTP Interceptor (Angular/Axios)**

```typescript
// Axios interceptor example
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = getAccessToken(); // Get from your storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const refreshed = await refreshTokens();
      if (refreshed) {
        // Retry original request
        return api.request(error.config);
      } else {
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

## Security Considerations

1. **Never store sensitive tokens in localStorage** without encryption
2. **Use HttpOnly cookies** for maximum security
3. **Implement token blacklisting** for logout
4. **Set appropriate expiration times** (short for access tokens, longer for refresh tokens)
5. **Use HTTPS in production**
6. **Implement rate limiting** on auth endpoints
7. **Log authentication events** for security monitoring

## API Endpoints

- `POST /api/auth/login` - Login with phone/password
- `POST /api/auth/register` - Register new staff
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout (blacklist refresh token)
- `GET /api/auth/profile` - Get current user profile 