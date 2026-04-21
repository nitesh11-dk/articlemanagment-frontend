# Article Management System

Full-stack app with JWT auth, role-based access control, and ownership logic using Node.js, Express, React, MongoDB.

## Setup Instructions

**Prerequisites**: Node.js v16+, MongoDB, pnpm

**Backend**:
```bash
cd backend
pnpm install
# Create .env: MONGO_URI=mongodb://localhost:27017/article-management, JWT_SECRET=your-secret, PORT=3000
node server.js  # Runs on http://localhost:3000
```

**Frontend**:
```bash
cd frontend
pnpm install
# Create .env: VITE_API_BASE_URL=http://localhost:3000/api
pnpm run dev  # Runs on http://localhost:5173
```

## Architecture

**Backend**: config/, controllers/ (article, auth, log), middlewares/ (auth), models/ (Article, AuditLog, User), routes/, server.js

**Frontend**: components/ (ArticleCard, ArticleModal, Navbar, Sidebar), context/ (AuthContext), pages/ (Dashboard, LoginPage, MyArticles, etc.), App.jsx, main.jsx

## API Flow

**Authentication**: POST /api/auth/login → validates credentials → returns JWT token with user id/role → Token sent in Authorization: Bearer header → `protect` middleware verifies → `authorize` middleware checks role

**Article Endpoints**:
- POST /api/articles (protect, authorize admin/editor) → sets createdBy, status='draft'
- GET /api/articles (optionalProtect) → Admin/Editor: all, Viewer/Guest: published only
- GET /api/articles/:id → Draft: owner/admin only, Published: all
- PATCH /api/articles/:id/publish (protect, authorize admin/editor) → Admin: any, Editor: own only
- DELETE /api/articles/:id (protect, authorize admin/editor) → Admin: any, Editor: own only

## Ownership Logic

Editors can only manage their own articles. Implemented by comparing `article.createdBy` with `req.user.id`:

```javascript
if (req.user.role !== 'admin' && article.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
}
```

| Action | Admin | Editor | Viewer |
|--------|-------|--------|--------|
| Create any article | ✓ | ✓ | ✗ |
| Delete own article | ✓ | ✓ | ✗ |
| Delete any article | ✓ | ✗ | ✗ |
| Publish own article | ✓ | ✓ | ✗ |
| Publish any article | ✓ | ✗ | ✗ |

## Permission Handling

**Authentication** (`protect`): Verifies JWT token, extracts user info, returns 401 if invalid

**Authorization** (`authorize`): Checks if user role matches required roles, returns 403 if unauthorized

**Middleware Usage**:
```javascript
router.post('/articles', protect, authorize('admin', 'editor'), createArticle);
router.get('/articles', optionalProtect, getArticles);
router.delete('/articles/:id', protect, authorize('admin'), deleteArticle);
```

| Endpoint | Guest | Viewer | Editor | Admin |
|----------|-------|--------|--------|-------|
| POST /login | ✓ | ✓ | ✓ | ✓ |
| POST /register | ✓ | ✓ | ✓ | ✓ |
| GET /articles | ✓ | ✓ | ✓ | ✓ |
| GET /articles/:id (published) | ✓ | ✓ | ✓ | ✓ |
| GET /articles/:id (draft) | ✗ | ✗ | Own | All |
| POST /articles | ✗ | ✗ | ✓ | ✓ |
| PATCH /articles/:id/publish | ✗ | ✗ | Own | All |
| DELETE /articles/:id | ✗ | ✗ | Own | All |
| GET /logs | ✗ | ✗ | Own | All |
| GET /users | ✗ | ✗ | ✗ | ✓ |
| PATCH /users/:id/role | ✗ | ✗ | ✗ | ✓ |

---

## Demo Credentials

**Admin**
- Email: admin@gmail.com
- Password: admin123
- Permissions: Full access (create/edit/delete any article, publish any, manage users, view all logs)

**Editor**
- Email: niteshdk11@gmail.com
- Password: Nitesh11-dk
- Permissions: Own articles only (create, edit, delete, publish own articles, view own logs)

**Viewer**
- No pre-created credentials. Create by registering → login as admin → Manage Users → change role to Viewer
- Permissions: Read-only (view published articles only)

---

## Walkthrough Guide

### Authentication Flow
1. Navigate to `/login`, enter credentials
2. Token stored in localStorage, redirect to dashboard
3. Protected requests send token in Authorization header
4. Backend verifies signature, extracts user info, proceeds if valid

### Role-Based Permissions

**Admin**: Login → Access all pages (Articles, My Articles, Audit Logs, Manage Articles, Manage Users) → Can create/delete/publish any article, change user roles

**Editor**: Login → Access Articles, My Articles, Audit Logs → Can create/delete/publish own articles only, blocked from others' articles (403), no Manage Users

**Viewer**: Login → Access Articles only (published) → No create/edit/delete buttons, redirected from My Articles/Audit Logs/Manage Articles

### Ownership Logic Testing
1. Create article as Editor A
2. Login as Editor B
3. Try to delete/publish Editor A's article → 403 Forbidden
4. Login as Admin → delete/publish succeeds

### How to Test Different Roles
1. Clear localStorage: `localStorage.removeItem('token')`
2. Login with different credentials
3. Verify menu items based on role
4. Test action button visibility
5. Check API responses in browser console
